-- Esquema inicial: categorías > subcategorías > productos.
-- Reemplaza el modelo de localStorage (arrays fso_cat/fso_subcat/fso_prod)
-- de la versión estática archivada en legacy/admin.html.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null default '',
  color text not null check (color in ('red', 'dark', 'darkred')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists subcategories (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references categories(id) on delete cascade,
  name text not null,
  sub text not null default '',
  icon text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  subcategory_id uuid not null references subcategories(id) on delete cascade,
  cod text not null,
  name text not null,
  pres text not null default '',
  description text not null default '',
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists subcategories_category_id_idx on subcategories(category_id);
create index if not exists products_subcategory_id_idx on products(subcategory_id);

-- Row Level Security: lectura pública, escritura solo vía service-role
-- (usada exclusivamente desde Server Actions en el servidor, nunca en el cliente).
alter table categories enable row level security;
alter table subcategories enable row level security;
alter table products enable row level security;

create policy "Lectura pública de categorías" on categories
  for select using (true);
create policy "Lectura pública de subcategorías" on subcategories
  for select using (true);
create policy "Lectura pública de productos" on products
  for select using (true);

-- No se crean policies de insert/update/delete para "anon":
-- toda escritura pasa por el service-role key, que ignora RLS.
