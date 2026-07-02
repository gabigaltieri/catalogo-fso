-- El mismo motivo que 0002_grants.sql: con "Automatically expose new
-- tables" desactivado, ni siquiera "service_role" (usado en las Server
-- Actions del admin para crear/editar/borrar) tenía privilegios de tabla.
-- service_role igual bypassa RLS, pero necesita el GRANT a nivel de tabla.

grant usage on schema public to service_role;
grant all privileges on public.categories    to service_role;
grant all privileges on public.subcategories to service_role;
grant all privileges on public.products      to service_role;
