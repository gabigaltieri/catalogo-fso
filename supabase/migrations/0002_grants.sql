-- Con "Automatically expose new tables" desactivado en el proyecto de
-- Supabase (decisión deliberada, ver 0001_init.sql), las tablas nuevas no
-- reciben privilegios de PostgreSQL por defecto para los roles de la Data
-- API. RLS solo filtra FILAS; sin este GRANT, "anon" ni siquiera puede
-- intentar el SELECT (error 42501 "permission denied for table ...").
-- Igual queda protegido: RLS sigue exigiendo la policy de solo-lectura.

grant usage on schema public to anon, authenticated;
grant select on public.categories    to anon, authenticated;
grant select on public.subcategories to anon, authenticated;
grant select on public.products      to anon, authenticated;
