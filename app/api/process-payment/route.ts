import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { Resend } from 'resend';
import TicketEmail from '@/components/emails/TicketEmail';
import { render } from '@react-email/render';

export async function POST(request: Request) {
    try {
        console.log('[process-payment] Starting...');

        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('[process-payment] RESEND_API_KEY is missing!');
            return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
        }
        const resend = new Resend(apiKey);

        const body = await request.json();
        const { payment_id, order_id } = body;

        console.log('[process-payment] payment_id:', payment_id, 'order_id:', order_id);

        if (!payment_id || !order_id) {
            return NextResponse.json({ error: 'Missing payment_id or order_id' }, { status: 400 });
        }

        // 1. Buscar la orden pendiente en Supabase
        const { data: order, error: orderError } = await supabase
            .from('pending_orders')
            .select('*')
            .eq('order_id', order_id)
            .single();

        if (orderError || !order) {
            console.error('[process-payment] Order not found:', orderError);
            return NextResponse.json({ error: 'Orden no encontrada' }, { status: 404 });
        }

        // 2. Verificar que no se haya procesado ya
        if (order.status === 'paid') {
            console.log('[process-payment] Order already processed');
            return NextResponse.json({ success: true, message: 'Ya procesado' });
        }

        // 3. Generar tickets
        const attendees = order.attendees as Array<{ nombre: string; tipo: string }>;
        const generatedTickets = [];
        const dbInserts = [];

        for (const attendee of attendees) {
            const codigoQr = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            generatedTickets.push({
                nombre: attendee.nombre,
                tipo: attendee.tipo,
                qr: codigoQr
            });

            dbInserts.push({
                nombre_cliente: attendee.nombre,
                email_cliente: order.email,
                payment_id: payment_id,
                monto_pagado: order.total_price / attendees.length,
                codigo_qr: codigoQr,
                estado: 'pagado',
                evento: order.event_name
            });
        }

        // 4. Guardar tickets en Supabase
        const { error: ticketError } = await supabase
            .from('tickets')
            .insert(dbInserts);

        if (ticketError) {
            console.error('[process-payment] Error saving tickets:', ticketError);
            return NextResponse.json({ error: 'Error guardando tickets' }, { status: 500 });
        }

        // 5. Marcar orden como pagada
        await supabase
            .from('pending_orders')
            .update({ status: 'paid' })
            .eq('order_id', order_id);

        // 6. Enviar email con los tickets
        console.log('[process-payment] Rendering email...');
        const emailHtml = await render(
            TicketEmail({ tickets: generatedTickets, eventName: order.event_name })
        );

        console.log('[process-payment] Sending email to:', order.email);
        await resend.emails.send({
            from: 'Entradas Parque Hípico <entradas@parquehipico.cl>',
            to: [order.email],
            subject: `¡Tus entradas están listas! (${attendees.length}) - Parque Hípico`,
            html: emailHtml,
        });

        console.log('[process-payment] ✅ Success!');
        return NextResponse.json({ success: true });

    } catch (error: any) {
        console.error('[process-payment] Error:', error?.message);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
