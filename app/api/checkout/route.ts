import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

// 👇 MODO PRUEBA: Credenciales de prueba de "Parque Hipico Web"
const client = new MercadoPagoConfig({
    accessToken: 'APP_USR-7069132968758424-011408-9924e6599cc23ec0d29c6c3d14f4b3f3-3134094374'
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
                    failure: `${baseUrl}/eventos?status=failure`,
                    pending: `${baseUrl}/eventos?status=pending`,
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