-- Tabla para órdenes pendientes (se guardan antes del pago)
-- Esto permite recuperar los datos aunque el usuario cambie de sesión

create table if not exists pending_orders (
  id uuid default gen_random_uuid() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  order_id text unique not null, -- ID único que se pasa a Mercado Pago como external_reference
  email text not null,
  attendees jsonb not null, -- Array de {nombre, tipo}
  event_name text not null,
  total_price numeric not null,
  status text default 'pending' -- 'pending', 'paid', 'expired'
);

-- Dar permisos
alter table pending_orders enable row level security;
create policy "Lectura publica" on pending_orders for select using (true);
create policy "Escritura publica" on pending_orders for insert with check (true);
create policy "Actualizacion publica" on pending_orders for update using (true);
