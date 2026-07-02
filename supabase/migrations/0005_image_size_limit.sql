-- Límite explícito de tamaño en el bucket (no depender del límite global
-- del proyecto, que no está confirmado). Debe coincidir con
-- MAX_IMAGE_BYTES en app/admin/actions.ts y bodySizeLimit en
-- next.config.ts (los tres tienen que ir sincronizados si se cambia).
update storage.buckets
set file_size_limit = 20 * 1024 * 1024
where id = 'subcategory-images';
