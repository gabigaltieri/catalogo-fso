-- Ropa de Trabajo: primera carga de productos para la categoría "Ropa de
-- Trabajo" (creada vacía en 0006_productos_reales.sql, sin fotos del
-- catálogo Maxilimp). Datos dados directamente por el cliente (24/07/2026),
-- no vienen de Maxilimp → sin código real, se generan con prefijo "ROPA-N".
--
-- Pantalón Común, Pantalón Cargo y Camisa son un solo producto cada uno
-- (sin "Conjunto"), con los colores disponibles listados en la descripción
-- en vez de una fila por color.

insert into subcategories (category_id, name, sub, icon, sort_order) values
  ((select id from categories where name = 'Ropa de Trabajo'), 'OMBU / PAMPERO', '', '🦺', 0);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'OMBU / PAMPERO'), 'ROPA-N1', 'Pantalón Común', '', 'Disponible en los colores: Beige, Verde, Azulino y Azul Marino.', 0),
  ((select id from subcategories where name = 'OMBU / PAMPERO'), 'ROPA-N2', 'Pantalón Cargo', '', 'Disponible en los colores: Beige, Verde, Azulino y Azul Marino.', 1),
  ((select id from subcategories where name = 'OMBU / PAMPERO'), 'ROPA-N3', 'Camisa', '', 'Disponible en los colores: Beige, Verde, Azulino y Azul Marino.', 2),
  ((select id from subcategories where name = 'OMBU / PAMPERO'), 'ROPA-N17', 'Zapatos de Trabajo Ombu', '', '', 16),
  ((select id from subcategories where name = 'OMBU / PAMPERO'), 'ROPA-N18', 'Botín de Trabajo Ombu', '', '', 17);
