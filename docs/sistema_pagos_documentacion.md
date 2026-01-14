# 🎟️ Sistema de Venta de Tickets - Parque Hípico La Montaña

## Diagrama del Sistema

![Diagrama del flujo de pagos](C:/Users/alber/.gemini/antigravity/brain/e40973a5-a22d-4063-afeb-9222f5f266a8/payment_system_diagram_1768406681200.png)

---

## Descripción del Flujo

### Paso 1: Usuario Selecciona Tickets
El cliente ingresa a `parquehipico.cl/eventos` y:
- Selecciona la cantidad de entradas para **Hombres** y **Mujeres**
- Ingresa su **email** (donde recibirá los tickets)
- Ingresa los **nombres de cada asistente**
- Hace click en **"Pagar con Mercado Pago"**

### Paso 2: Guardar Orden Pendiente
Antes de redirigir al pago, el sistema:
- Genera un **ID único** para la orden (ej: `ORDER-1234567890-abc123`)
- Guarda en Supabase (tabla `pending_orders`):
  - Email del comprador
  - Lista de asistentes (nombres y tipo H/M)
  - Nombre del evento
  - Monto total

### Paso 3: Redirigir a Mercado Pago
- Se crea una **preferencia de pago** en Mercado Pago
- El `order_id` se envía como `external_reference`
- El usuario es redirigido al checkout de Mercado Pago

### Paso 4: Pago Exitoso
Cuando el pago se aprueba:
- Mercado Pago redirige a `/compra-exitosa`
- Incluye el `payment_id` y `external_reference` (order_id) en la URL

### Paso 5: Recuperar Datos de la Orden
El sistema:
- Busca en Supabase la orden usando el `order_id`
- Recupera todos los datos del comprador y asistentes

### Paso 6: Generar y Enviar Tickets
Para cada asistente:
- Se genera un **código QR único** (ej: `TICKET-1234567890-5678`)
- Se guardan los tickets en Supabase (tabla `tickets`)
- Se renderiza un email con todos los QR codes

### Paso 7: Entrega de QR Codes
- El comprador recibe un email con **todos los tickets**
- Cada QR code tiene el nombre del asistente
- Los QR codes se pueden escanear en la entrada del evento

---

## Tecnologías Utilizadas

| Tecnología | Uso |
|------------|-----|
| **Next.js 14** | Frontend + API Routes |
| **Supabase** | Base de datos PostgreSQL |
| **Mercado Pago** | Procesamiento de pagos |
| **Resend** | Envío de emails transaccionales |
| **Vercel** | Hosting y deployment |

---

## Tablas en Supabase

### `pending_orders` (Órdenes Pendientes)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| order_id | text | ID único de la orden |
| email | text | Email del comprador |
| attendees | jsonb | Lista de asistentes [{nombre, tipo}] |
| event_name | text | Nombre del evento |
| total_price | numeric | Monto total |
| status | text | 'pending' o 'paid' |

### `tickets` (Tickets Vendidos)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| payment_id | text | ID de Mercado Pago |
| nombre_cliente | text | Nombre del asistente |
| email_cliente | text | Email del comprador |
| monto_pagado | numeric | Monto por ticket |
| codigo_qr | text | Código único del QR |
| estado | text | 'pagado' o 'usado' |
| evento | text | Nombre del evento |

---

## URLs Importantes

- **Página de eventos:** `parquehipico.cl/eventos`
- **Checkout success:** `parquehipico.cl/compra-exitosa`
- **API de checkout:** `parquehipico.cl/api/checkout`
- **API de procesamiento:** `parquehipico.cl/api/process-payment`

---

*Documento generado el 14 de enero de 2026*
