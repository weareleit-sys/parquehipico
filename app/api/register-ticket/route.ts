import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { Resend } from 'resend';
import TicketEmail from '@/components/emails/TicketEmail';
import { render } from '@react-email/render';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, attendees, payment_id, total, eventName } = body;

        // Validamos datos básicos
        if (!email || !attendees || !Array.isArray(attendees)) {
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        // Array para guardar tickets generados y enviarlos al email
        const generatedTickets = [];
        const dbInserts = [];

        // 1. Procesamos cada asistente
        for (const nombreAsistente of attendees) {
            const codigoQr = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            // Preparamos objeto para email
            generatedTickets.push({
                nombre: nombreAsistente,
                qr: codigoQr
            });

            // Preparamos objeto para BD
            dbInserts.push({
                nombre_cliente: nombreAsistente,
                email_cliente: email,
                payment_id: payment_id,
                monto_pagado: total / attendees.length, // Prorrateo simple o guardar total en el primero
                codigo_qr: codigoQr,
                estado: 'pagado',
                evento: eventName // Si tienes columna evento, úsala. Si no, ignora esto por ahora.
            });
        }

        // 2. Guardamos en SUPABASE (Bulk Insert)
        const { data, error: dbError } = await supabase
            .from('tickets')
            .insert(dbInserts)
            .select();

        if (dbError) {
            console.error('Error BD:', dbError);
            return NextResponse.json({ error: 'Error guardando tickets' }, { status: 500 });
        }

        // 3. Enviamos UN SOLO CORREO con todos los tickets
        const emailHtml = await render(
            TicketEmail({ tickets: generatedTickets, eventName: eventName || 'Evento Parque Hípico' })
        );

        await resend.emails.send({
            from: 'Entradas Parque Hípico <entradas@parquehipico.cl>',
            to: [email],
            subject: `¡Tus entradas están listas! (${attendees.length}) - Parque Hípico`,
            html: emailHtml,
        });

        return NextResponse.json({ success: true, tickets: data });

    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Error interno' }, { status: 500 });
    }
}
