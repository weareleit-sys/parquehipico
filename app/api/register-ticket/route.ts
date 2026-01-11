import { NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';
import { Resend } from 'resend';
import TicketEmail from '@/components/emails/TicketEmail';
import { render } from '@react-email/render';

export async function POST(request: Request) {
    try {
        console.log('[register-ticket] Starting...');

        // Initialize Resend with runtime environment variable
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('[register-ticket] RESEND_API_KEY is missing!');
            return NextResponse.json({ error: 'Missing RESEND_API_KEY' }, { status: 500 });
        }
        const resend = new Resend(apiKey);

        const body = await request.json();
        console.log('[register-ticket] Body received:', JSON.stringify(body));

        const { email, attendees, payment_id, total, eventName } = body;

        // Validamos datos básicos
        if (!email || !attendees || !Array.isArray(attendees)) {
            console.error('[register-ticket] Invalid data - missing email or attendees');
            return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 });
        }

        // Array para guardar tickets generados y enviarlos al email
        const generatedTickets = [];
        const dbInserts = [];

        // 1. Procesamos cada asistente (soporta tanto objetos {nombre, tipo} como strings)
        for (const attendee of attendees) {
            const nombreAsistente = typeof attendee === 'string' ? attendee : attendee.nombre;
            const tipoAsistente = typeof attendee === 'string' ? 'general' : attendee.tipo;

            const codigoQr = `TICKET-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

            // Preparamos objeto para email
            generatedTickets.push({
                nombre: nombreAsistente,
                tipo: tipoAsistente,
                qr: codigoQr
            });

            // Preparamos objeto para BD
            dbInserts.push({
                nombre_cliente: nombreAsistente,
                email_cliente: email,
                payment_id: payment_id,
                monto_pagado: total / attendees.length,
                codigo_qr: codigoQr,
                estado: 'pagado',
                evento: eventName || 'Evento General'
            });
        }

        console.log('[register-ticket] Inserting tickets into Supabase...');

        // 2. Guardamos en SUPABASE (Bulk Insert)
        const { data, error: dbError } = await supabase
            .from('tickets')
            .insert(dbInserts)
            .select();

        if (dbError) {
            console.error('[register-ticket] Supabase Error:', JSON.stringify(dbError));
            return NextResponse.json({ error: 'Error guardando tickets', details: dbError.message }, { status: 500 });
        }

        console.log('[register-ticket] Tickets saved:', data?.length);

        // 3. Enviamos UN SOLO CORREO con todos los tickets
        console.log('[register-ticket] Rendering email...');
        const emailHtml = await render(
            TicketEmail({ tickets: generatedTickets, eventName: eventName || 'Evento Parque Hípico' })
        );

        console.log('[register-ticket] Sending email to:', email);
        const emailResult = await resend.emails.send({
            from: 'Entradas Parque Hípico <entradas@parquehipico.cl>',
            to: [email],
            subject: `¡Tus entradas están listas! (${attendees.length}) - Parque Hípico`,
            html: emailHtml,
        });

        console.log('[register-ticket] Email result:', JSON.stringify(emailResult));

        return NextResponse.json({ success: true, tickets: data });

    } catch (error: any) {
        console.error('[register-ticket] CATCH Error:', error?.message, error?.stack);
        return NextResponse.json({ error: 'Error interno', details: error?.message }, { status: 500 });
    }
}
