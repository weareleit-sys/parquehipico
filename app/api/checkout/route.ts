import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '../../lib/supabase';

// Usar variable de entorno para el token (más seguro)
const client = new MercadoPagoConfig({
    accessToken: process.env.MP_ACCESS_TOKEN || ''
});

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        // Generar un ID único para esta orden
        const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

        // URL base dinámica (Producción o Local)
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://parquehipico.cl';

        // 1. Guardar la orden pendiente en Supabase ANTES del pago
        const { error: dbError } = await supabase
            .from('pending_orders')
            .insert({
                order_id: orderId,
                email: body.email,
                attendees: body.attendees, // Array de {nombre, tipo}
                event_name: body.eventName,
                total_price: body.unit_price,
                status: 'pending'
            });

        if (dbError) {
            console.error('Error saving pending order:', dbError);
            return NextResponse.json({ error: 'Error guardando orden' }, { status: 500 });
        }

        // 2. Crear preferencia de pago con external_reference
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
                    email: body.email || 'test_user_123456@testuser.com',
                    name: body.name || 'Usuario',
                    surname: 'Pago'
                },
                external_reference: orderId, // ← Esto nos permite recuperar la orden después
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
            url: result.init_point,
            orderId: orderId
        });

    } catch (error: any) {
        console.error('Error Mercado Pago:', error);
        return NextResponse.json({
            error: error.message || 'Error al crear el pago',
            details: error
        }, { status: 500 });
    }
}