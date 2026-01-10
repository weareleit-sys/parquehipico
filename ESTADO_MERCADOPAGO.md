# Prompt Debugging Mercado Pago - Parque Hípico

## Contexto del Proyecto
Proyecto **Next.js** (`parquehipico-nextjs`) integrando **Mercado Pago** para venta de entradas.

## Problema Actual
Al intentar crear una "Preferencia" de pago desde la ruta `/api/checkout`, Mercado Pago responde sistemáticamente con:
```json
{
  "status": 403,
  "code": "PA_UNAUTHORIZED_RESULT_FROM_POLICIES",
  "message": "At least one policy returned UNAUTHORIZED.",
  "blocked_by": "PolicyAgent"
}
```

## Estado de la Cuenta
*   La cuenta de Mercado Pago es nueva y está en proceso de validación ("Etapa 1 de 6").
*   Por ende, las credenciales de Producción (`APP_USR-...`) están bloqueadas.
*   Hemos cambiado a **Credenciales de Prueba** (`TEST-...`) para desarrollo.

## Acciones Realizadas (Sin Éxito)
1.  **Cambio de Credenciales**: Se reemplazó el `back_urls` access token por el `TEST_TOKEN` directamente en el código (`api/checkout/route.ts`).
2.  **Configuración de Payer**: Se configuró el objeto `payer` en la preferencia para enviar un email aleatorio (`test_user_RANDOM@test.com`) y evitar conflictos de "auto-compra" (pagar con el mismo email de la cuenta vendedora).
3.  **Puertos y URLs**: Se actualizaron las `back_urls` al puerto actual (`localhost:3002`).
4.  **Reinicios**: Se han realizado múltiples reinicios de servidor (Hard restarts).

## Código Actual (`app/api/checkout/route.ts`)
```typescript
import { MercadoPagoConfig, Preference } from 'mercadopago';
import { NextRequest, NextResponse } from 'next/server';

const client = new MercadoPagoConfig({
    accessToken: 'TEST-565cb296-fcdb-4cc4-a975-db2ff165348a' // Token de Prueba Hardcodeado
});

export async function POST(req: NextRequest) {
    try {
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
                back_urls: {
                    success: 'http://localhost:3002/compra-exitosa',
                    failure: 'http://localhost:3002/compra-fallida',
                    pending: 'http://localhost:3002/compra-pendiente',
                },
                auto_return: 'approved',
                payer: {
                    // Lógica para evitar conflicto de email vendedor-comprador
                    email: `test_user_${Math.floor(Math.random() * 1000000)}@test.com`,
                    name: body.name,
                }
            },
        });

        return NextResponse.json({ id: result.id, url: result.init_point });

    } catch (error: any) {
        console.error('Error Mercado Pago:', error);
        return NextResponse.json({ error: error.message, details: error }, { status: 500 });
    }
}
```

## Pregunta para la IA
"A pesar de usar Credenciales de Prueba (TEST-...), generar un email de payer aleatorio y reiniciar el servidor, la API sigue devolviendo 403 PA_UNAUTHORIZED_RESULT_FROM_POLICIES. ¿Qué otra política de seguridad de Sandbox o configuración de cuenta podría estar bloqueando la creación de la preferencia? ¿Es posible que el Token de Prueba también requiera validación de cuenta básica?"
