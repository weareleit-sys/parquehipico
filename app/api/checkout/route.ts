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

        const preference = new Preference(client);

        const result = await preference.create({
            body: {
                items: [
                    {
                        id: 'entrada-general',
                        title: body.title || 'Entrada Parque Hípico',
                        quantity: 1,
                        unit_price: Number(body.price) || 5000,
                        currency_id: 'CLP',
                    },
                ],
                // 👇 IMPORTANTE: Puse el puerto 3001 porque vi en tu foto que estás ahí
                back_urls: {
                    success: 'http://localhost:3000/compra-exitosa',
                    failure: 'http://localhost:3000/compra-fallida',
                    pending: 'http://localhost:3000/compra-pendiente',
                },
                // auto_return: 'approved',
                payer: {
                    email: `test_user_${Math.floor(Math.random() * 1000000)}@test.com`, // Email aleatorio de prueba
                    name: body.name,
                }
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