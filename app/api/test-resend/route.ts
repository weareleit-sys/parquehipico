import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function GET() {
    try {
        const apiKey = process.env.RESEND_API_KEY;

        console.log('[test-resend] API Key exists:', !!apiKey);
        console.log('[test-resend] API Key starts with:', apiKey?.substring(0, 10) + '...');

        if (!apiKey) {
            return NextResponse.json({
                success: false,
                error: 'RESEND_API_KEY not found in environment variables'
            });
        }

        const resend = new Resend(apiKey);

        console.log('[test-resend] Sending test email...');

        const result = await resend.emails.send({
            from: 'Entradas Parque Hípico <entradas@parquehipico.cl>',
            to: ['weareleit@gmail.com'],
            subject: 'Test de Email - ' + new Date().toLocaleTimeString(),
            html: '<h1>Test exitoso!</h1><p>Si ves este email, Resend está funcionando correctamente.</p>',
        });

        console.log('[test-resend] Result:', JSON.stringify(result));

        return NextResponse.json({
            success: true,
            message: 'Email enviado exitosamente',
            result: result
        });

    } catch (error: any) {
        console.error('[test-resend] Error:', error?.message, error);
        return NextResponse.json({
            success: false,
            error: error?.message || 'Error desconocido',
            details: error
        }, { status: 500 });
    }
}
