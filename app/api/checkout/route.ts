import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

// 👇 AQUÍ ESTÁ EL CAMBIO: Ponemos la llave directo.
// Así no depende de si el servidor leyó o no el archivo .env
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-1382387818783144-010810-323f5437e8d582832d3680fd1e9299db-3115909271'
});

export async function POST(req: NextRequest) {
    try {
        // 👇 COMENTAMOS ESTO para que no te bloquee
        /* if (!process.env.MP_ACCESS_TOKEN) {
           return NextResponse.json({ error: '...' }, { status: 500 });
        } 
        */

        const body = await req.json();

        // URL base dinámica (Producción o Local)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parquehipico.cl';

        const result = await new Preference(client).create({
            body: {
                items: [
                    {
                        id: body.id,
                        title: body.title,
                        quantity: body.quantity,
                        unit_price: Number(body.unit_price),
                        currency_id: 'CLP',
                    },
                ],
                payer: {
                    email: body.email || 'test_user_123456@testuser.com', // Email real del comprador o fallback
                    name: body.name || 'Usuario', // Nombre real del comprador
                    surname: 'Pago'
                },
                back_urls: {
                    success: `${baseUrl}/compra-exitosa`,
                    failure: `${baseUrl}/test-pago?status=failure`,
                    pending: `${baseUrl}/test-pago?status=pending`,
                },
                auto_return: 'approved',
            },
        });

        return NextResponse.json({
            id: result.id,
            url: result.init_point
        });

    } catch (error: any) {
        console.error('Error Mercado Pago:', error);
        return NextResponse.json({
            error: error.message || 'Error al crear el pago',
            details: error
        }, { status: 500 });
    }
}