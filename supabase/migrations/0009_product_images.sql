-- Foto por producto individual (además de la foto de subcategoría que ya
-- existe). Supera la decisión original documentada en
-- 0004_subcategory_images.sql: ahora sí hace falta una imagen 1:1 junto al
-- código de cada producto en el listado.

alter table products add column if not exists image_url text;

-- Mismo patrón que subcategory-images: bucket público (las fotos se sirven
-- sin auth), límite de tamaño explícito. Las subidas van siempre por las
-- Server Actions del admin con la service-role key.
insert into storage.buckets (id, name, public, file_size_limit)
values ('product-images', 'product-images', true, 20 * 1024 * 1024)
on conflict (id) do nothing;
