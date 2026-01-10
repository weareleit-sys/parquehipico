-- 1. Si existía una tabla vieja, la borramos para empezar limpio
drop table if exists tickets cascade;

-- 2. Creamos la tabla DEFINITIVA para ventas
create table tickets (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  payment_id text, -- El ID de Mercado Pago
  nombre_cliente text not null,
  email_cliente text not null,
  monto_pagado numeric,
  estado text default 'pagado', -- 'pagado' o 'usado'
  codigo_qr text, -- El código único que va en el correo
  evento text -- Nombre del evento (e.g. "Carreras a la Chilena")
);

-- 3. Habilitamos la seguridad
alter table tickets enable row level security;

-- 4. Damos permisos (Para que la web pueda guardar la venta)
create policy "Lectura publica temporal" on tickets for select using (true);
create policy "Escritura publica temporal" on tickets for insert with check (true);
create policy "Actualizacion publica temporal" on tickets for update using (true);
