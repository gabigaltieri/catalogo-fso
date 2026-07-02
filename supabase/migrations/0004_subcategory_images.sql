-- Fotos por subcategoría (no por producto individual — decisión de diseño
-- original: catálogo estilo tabla, sin fotos por producto).

alter table subcategories add column if not exists image_url text;

-- Bucket público de Storage: las fotos se sirven directo por URL sin
-- necesitar auth (igual que hoy son visibles sin login). Las subidas
-- (insert/update/delete en storage.objects) solo se hacen desde las
-- Server Actions del admin con la service-role key, que bypassa RLS —
-- no hace falta agregar policies de escritura para "anon".
insert into storage.buckets (id, name, public)
values ('subcategory-images', 'subcategory-images', true)
on conflict (id) do nothing;
