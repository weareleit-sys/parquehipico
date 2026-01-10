import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import TicketEmail from '@/components/emails/TicketEmail';
import { render } from '@react-email/render';

// Inicializar Resend con la API key
export async function POST(request: NextRequest) {
    try {
        console.log('Iniciando envío de correo...');

        // Inicializar Resend dentro del handler para capturar errores de init
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            console.error('RESEND_API_KEY no está configurada en process.env');
            return NextResponse.json(
                {
                    success: false,
                    error: 'Configuración del servidor incompleta (Falta API Key)',
                },
                { status: 500 }
            );
        }

        const resend = new Resend(apiKey);

        // Parsear el body de la petición
        const body = await request.json();
        const { email, nombre, qrCode } = body;

        // Validar datos requeridos
        if (!email || !nombre || !qrCode) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Faltan campos requeridos: email, nombre, qrCode',
                },
                { status: 400 }
            );
        }

        // Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Formato de email inválido',
                },
                { status: 400 }
            );
        }

        console.log(`Enviando correo a ${email} para ${nombre}`);

        // Renderizar el email a HTML usando la estructura correcta
        const emailHtml = await render(
            TicketEmail({
                tickets: [
                    {
                        nombre: nombre,
                        qr: qrCode
                    }
                ],
                eventName: 'Evento Parque Hípico'
            })
        );

        // Enviar el correo usando Resend con HTML crudo
        const { data, error } = await resend.emails.send({
            from: 'Entradas Parque Hípico <entradas@parquehipico.cl>', // ¡Ahora usamos tu dominio!
            to: [email],
            subject: 'Tu Entrada - Parque Hípico La Montaña',
            html: emailHtml,
        });

        // Manejar error de Resend
        if (error) {
            console.error('Error al enviar email (Resend):', error);
            return NextResponse.json(
                {
                    success: false,
                    error: 'Error al enviar el correo',
                    details: error.message,
                },
                { status: 500 }
            );
        }

        console.log('Correo enviado exitosamente:', data);

        // Respuesta exitosa
        return NextResponse.json(
            {
                success: true,
                message: 'Correo enviado exitosamente',
                emailId: data?.id,
            },
            { status: 200 }
        );
    } catch (error: any) {
        console.error('Error no controlado en /api/send-email:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Error interno del servidor',
                details: error.message,
            },
            { status: 500 }
        );
    }
}
