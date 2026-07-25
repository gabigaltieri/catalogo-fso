-- Carga de productos reales de FSO (catálogo físico Maxilimp), sesión 10/07/2026.
-- Reemplaza los productos placeholder en las subcategorías existentes que ya
-- tienen datos reales transcritos, agrega 13 subcategorías nuevas y
-- reestructura las categorías de 3 a 5: Productos de Limpieza, Higiene
-- Institucional, Ropa de Trabajo, Electricidad y Bolsas (reemplaza a
-- "Descartables"). Fuente completa y decisiones: transcripcion-maxilimp.txt
-- (secciones "RESPUESTAS DEL USUARIO") y readme.txt sección 7/8c.
--
-- NO incluido en esta migración (se mantiene el placeholder / queda vacío):
--   - Dispensers y Desodorantes/de Ambiente: el catálogo Maxilimp solo listó
--     los códigos que sobreviven, sin nombre/presentación — falta volver a
--     transcribir con fotos más claras (Dispensers: todos los códigos van
--     menos el 286, según el usuario).
--   - Film · Papel Aluminio / Papel Manteca: no hay sección transcrita del
--     catálogo Maxilimp para esto todavía — queda dentro de "Bolsas" por
--     ahora, pendiente de confirmar si existe o se elimina.
--   - Variantes nuevas de iluminación LED sin código real (dicroicas, tubos,
--     7w, 14w): pendiente de consultar al cliente, no se cargan.
--   - Marcas de guantes nuevas (Jorgito, Pirelli): pendiente de consultar
--     al cliente.
--   - Ropa de Trabajo y Electricidad quedan con muy poco o ningún producto
--     por ahora — no hay fotos del catálogo Maxilimp para esos rubros
--     (salvo las lámparas LED, que sí se cargan en Electricidad).

-- ═══════════════════════════════════════════════════════════════════════
-- 0. REESTRUCTURACIÓN DE CATEGORÍAS: 3 → 5
-- ═══════════════════════════════════════════════════════════════════════

update categories set name = 'Bolsas', icon = '🛍️' where name = 'Descartables';

insert into categories (name, icon, color, sort_order) values
  ('Ropa de Trabajo', '🦺', 'dark', 3),
  ('Electricidad', '💡', 'red', 4);

update subcategories set category_id = (select id from categories where name = 'Higiene Institucional')
  where name = 'Guantes';

delete from subcategories where name = 'Vasos · Platos';

-- ═══════════════════════════════════════════════════════════════════════
-- 1. SUBCATEGORÍAS EXISTENTES: reemplazo de productos placeholder
-- ═══════════════════════════════════════════════════════════════════════

delete from products where subcategory_id = (select id from subcategories where name = 'Lavandinas' and sub = 'Cloros');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Lavandinas' and sub = 'Cloros'), '1', 'Lavandina', '5 lts', '', 0),
  ((select id from subcategories where name = 'Lavandinas' and sub = 'Cloros'), '3', 'Lavandina', '1 L', '', 1),
  ((select id from subcategories where name = 'Lavandinas' and sub = 'Cloros'), '4', 'Lavandina', '2 lts', '', 2),
  ((select id from subcategories where name = 'Lavandinas' and sub = 'Cloros'), '5', 'Cloro · Hipoclorito de Sodio', '5 lts', '', 3);

delete from products where subcategory_id = (select id from subcategories where name = 'Detergentes');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Detergentes'), '10', 'Detergente Ultra', '5 lts', '', 0),
  ((select id from subcategories where name = 'Detergentes'), '10-N1', 'Detergente Ultra', '2 lts', '', 1),
  ((select id from subcategories where name = 'Detergentes'), '10-N2', 'Detergente Ultra', '1 L', '', 2);

delete from products where subcategory_id = (select id from subcategories where name = 'Desengrasantes' and sub = 'Limpiadores');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Desengrasantes' and sub = 'Limpiadores'), '39', 'Desengrasante con Amoníaco', '5 lts', '', 0),
  ((select id from subcategories where name = 'Desengrasantes' and sub = 'Limpiadores'), '40', 'Desengrasante Gel Forte', '5 lts', '', 1),
  ((select id from subcategories where name = 'Desengrasantes' and sub = 'Limpiadores'), '42', 'Desengrasante Emerel Forte', '5 lts / 1 L', 'Línea Remocer.', 2);

delete from products where subcategory_id = (select id from subcategories where name = 'Limpiavidrios');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Limpiavidrios'), '46', 'Limpiavidrios', '5 lts', '', 0),
  ((select id from subcategories where name = 'Limpiavidrios'), '46-N', 'Limpiavidrios', '500 ml', '', 1),
  ((select id from subcategories where name = 'Limpiavidrios'), '50', 'Limpiavidrios en Aerosol View', '360 cc', '', 2);

delete from products where subcategory_id = (select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '84', 'Escoba de Paja 6 Hilos', 'Reforzada', '', 0),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '85', 'Escoba Plástica', 'Rinconera', '', 1),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '86', 'Escoba de Paja 6 Hilos', 'Galponera', '', 2),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '87', 'Escoba Plástica', 'Interior', '', 3),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '88', 'Escoba Plástica', 'Exterior', '', 4),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '91', 'Escobillón de Plástico', '30 cm', '', 5),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '92', 'Escobillón de Plástico', '50 cm', '', 6),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '93', 'Escobillón de Plástico', '80 cm', '', 7),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '94', 'Escobillón de Plástico', '1 m', '', 8),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '96', 'Escobillón de Cerda', '30 cm', '', 9),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '97', 'Escobillón de Cerda', '50 cm', '', 10),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '98', 'Escobillón de Cerda', '80 cm', '', 11),
  ((select id from subcategories where name = 'Escobas' and sub = 'Palos · Accesorios'), '99', 'Escobillón de Cerda', '1 m', '', 12);

delete from products where subcategory_id = (select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '259', 'Papel Higiénico', '36 u × 100 mts×10cm', '', 0),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '249', 'Rollo de Cocina', '3 u × 21×18,7cm, 40 paños c/rollo', '', 1),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), 'PH-N1', 'Papel Higiénico en Rollo', '30 mts, hoja simple', 'Interpretación de nota manuscrita del catálogo — confirmar nombre/uso exacto con Leila.', 2),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), 'PH-N2', 'Papel Higiénico en Rollo', '30 mts, hoja doble', 'Interpretación de nota manuscrita del catálogo — confirmar nombre/uso exacto con Leila.', 3),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), 'PH-N3', 'Papel Higiénico en Rollo', '80 mts, hoja simple', 'Interpretación de nota manuscrita del catálogo — confirmar nombre/uso exacto con Leila.', 4),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), 'PH-N4', 'Papel Higiénico en Rollo', '80 mts, hoja doble', 'Interpretación de nota manuscrita del catálogo — confirmar nombre/uso exacto con Leila.', 5),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), 'PH-N5', 'Papel Higiénico en Rollo', '100 mts, hoja simple × 1u', 'Interpretación de nota manuscrita del catálogo — confirmar nombre/uso exacto con Leila.', 6),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '239', 'Toalla Intercalada Blanca', '2500u · 20×24cm', '', 7),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '240', 'Toalla Intercalada Beige', '2500u · 20×24cm', '', 8),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '242', 'Toalla en Bobina Blanca (Elite)', '2u · 24cm×400mts', '', 9),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '243', 'Toalla en Bobina Blanca (Elegante)', '2u · 19cm×400mts', '', 10),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '244', 'Toalla en Bobina Blanca (Elegante, hoja simple)', '4u · 20cm×200mts', '', 11);

delete from products where subcategory_id = (select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '139', 'Jabón Líquido Bactericida', '5 lts', '', 0),
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '55', 'Alcohol en Gel con Dosificador', '1 l', '', 1),
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '59', 'Alcohol en Gel', '5 lts', '', 2),
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '56', 'Alcohol Etílico', '500 cc', '', 3),
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '77', 'Alcohol Etílico', '5 lts', '', 4),
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '77-N', 'Alcohol Etílico', '1 L', '', 5),
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '58', 'Diluyente Etílico para Fajinar', '5 lts', '', 6),
  ((select id from subcategories where name = 'Jabón Líquido' and sub = 'Alcohol en Gel'), '57', 'Alcohol de Quemar', '930 cc', '', 7);

delete from products where subcategory_id = (select id from subcategories where name = 'Bolsas de Residuos');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Bolsas de Residuos'), '158', 'Bolsas Consorcio Negra', '60×90cm · 45 micrones × 50u', '', 0),
  ((select id from subcategories where name = 'Bolsas de Residuos'), '162', 'Bolsas Consorcio Negra', '80×110cm · 50 micrones × 50u', '', 1),
  ((select id from subcategories where name = 'Bolsas de Residuos'), '164', 'Bolsas Consorcio Negra', '100×120cm · 55 micrones × 50u', '', 2),
  ((select id from subcategories where name = 'Bolsas de Residuos'), '148', 'Bolsas Consorcio Eco Negra', '60×90cm · 35 micrones × 50u', '', 3),
  ((select id from subcategories where name = 'Bolsas de Residuos'), '149', 'Bolsas Consorcio Eco Negra', '80×110cm · 35 micrones × 50u', '', 4),
  ((select id from subcategories where name = 'Bolsas de Residuos'), '167', 'Bolsas Residuos Familiar Verde', '45×60cm · 25 micrones × 50u', '', 5),
  ((select id from subcategories where name = 'Bolsas de Residuos'), '151', 'Bolsas Residuos Familiar Negro', '45×60cm · 25 micrones × 50u', '', 6),
  ((select id from subcategories where name = 'Bolsas de Residuos'), '155', 'Bolsas Residuos Familiar Negro', '50×70cm · 25 micrones × 50u', '', 7);

delete from products where subcategory_id = (select id from subcategories where name = 'Guantes');
insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Guantes'), '185', 'Guante Goma Doméstico Afelpado', 'Pequeño · 6½·7', '', 0),
  ((select id from subcategories where name = 'Guantes'), '186', 'Guante Goma Doméstico Afelpado', 'Mediano · 7½·8', '', 1),
  ((select id from subcategories where name = 'Guantes'), '187', 'Guante Goma Doméstico Afelpado', 'Grande · 8½·9', '', 2),
  ((select id from subcategories where name = 'Guantes'), '188', 'Guante Goma Doméstico Afelpado', 'Extra Grande · 9½·10', '', 3),
  ((select id from subcategories where name = 'Guantes'), '189', 'Guante Goma Doméstico', 'Pequeño · 6½·7', '', 4),
  ((select id from subcategories where name = 'Guantes'), '190', 'Guante Goma Doméstico', 'Mediano · 7½·8', '', 5),
  ((select id from subcategories where name = 'Guantes'), '191', 'Guante Goma Doméstico', 'Grande · 8½·9', '', 6),
  ((select id from subcategories where name = 'Guantes'), '192', 'Guante Goma Doméstico', 'Extra Grande · 9½·10', '', 7),
  ((select id from subcategories where name = 'Guantes'), '193', 'Guante Goma Reforzado Industrial', '9½·10', '', 8),
  ((select id from subcategories where name = 'Guantes'), '194', 'Guante de Látex', 'Pequeño · 100 u', '', 9),
  ((select id from subcategories where name = 'Guantes'), '195', 'Guante de Látex', 'Mediano · 100 u', '', 10),
  ((select id from subcategories where name = 'Guantes'), '196', 'Guante de Látex', 'Grande · 100 u', '', 11),
  ((select id from subcategories where name = 'Guantes'), '754', 'Guante de Nitrilo', 'Pequeño · 100 u', '', 12),
  ((select id from subcategories where name = 'Guantes'), '755', 'Guante de Nitrilo', 'Mediano · 100 u', '', 13),
  ((select id from subcategories where name = 'Guantes'), '756', 'Guante de Nitrilo', 'Grande · 100 u', '', 14);

-- ═══════════════════════════════════════════════════════════════════════
-- 2. SUBCATEGORÍAS NUEVAS EN "Productos de Limpieza" (14, incluye Insecticidas)
-- ═══════════════════════════════════════════════════════════════════════

insert into subcategories (category_id, name, sub, icon, sort_order) values
  ((select id from categories where name = 'Productos de Limpieza'), 'Desodorantes · Desinfectantes', 'para Pisos', '🧴', 13),
  ((select id from categories where name = 'Productos de Limpieza'), 'Limpiadores', 'Lustramuebles', '✨', 14),
  ((select id from categories where name = 'Productos de Limpieza'), 'Jabones · Perfumes', 'para Ropa', '👕', 15),
  ((select id from categories where name = 'Productos de Limpieza'), 'Ceras', 'Removedores para Pisos', '🕯️', 16),
  ((select id from categories where name = 'Productos de Limpieza'), 'Palos · Palas', '', '🪵', 17),
  ((select id from categories where name = 'Productos de Limpieza'), 'Secadores para Vidrios', '', '🔷', 18),
  ((select id from categories where name = 'Productos de Limpieza'), 'Plumeros', '', '🪶', 19),
  ((select id from categories where name = 'Productos de Limpieza'), 'Secadores para Piso', 'Sopapas', '🧽', 20),
  ((select id from categories where name = 'Productos de Limpieza'), 'Cepillos', '', '🖌️', 21),
  ((select id from categories where name = 'Productos de Limpieza'), 'Paños · Trapos', 'Franelas · Delantales', '🟦', 22),
  ((select id from categories where name = 'Productos de Limpieza'), 'Baldes · Mopas', 'Lampazos', '🪣', 23),
  ((select id from categories where name = 'Productos de Limpieza'), 'Recipientes de Residuos', '', '🚮', 24),
  ((select id from categories where name = 'Productos de Limpieza'), 'Esponjas · Fibras', 'Estropajos · Lanas', '🫧', 25),
  ((select id from categories where name = 'Productos de Limpieza'), 'Insecticidas · Desinfectantes', '', '🐜', 26);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Desodorantes · Desinfectantes' and c.name = 'Productos de Limpieza'), '20', 'Desodorante para Pisos', '5 lts', 'Disponible en las fragancias: Lavanda, Floral, Pino, Frutal, Limón, Cherry, Anís/Menta (Delirio), Brisa (Muguet), Oceanic, Algodón (Colonia) y Bambú.', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Desodorantes · Desinfectantes' and c.name = 'Productos de Limpieza'), '34', 'Desodorante para Pisos', '1 L × 12 u', 'Pack surtido de fragancias.', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Desodorantes · Desinfectantes' and c.name = 'Productos de Limpieza'), '990', 'Limpiador para Pisos Flash Lavanda', '5 lts', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Desodorantes · Desinfectantes' and c.name = 'Productos de Limpieza'), '991', 'Limpiador para Pisos Flash Cherry', '5 lts', '', 3);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '51', 'Limpiador con Lavandina Cif', '500 cc', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '52', 'Limpiador Cremoso Cif', '500 cc', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '78', 'Limpiador Cremoso Cif', '2 lts', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '231', 'Limpiador para Inodoros', '500 cc', '', 3),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '232', 'Limpiador para Horno en Aerosol', '360 cc', '', 4),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '219', 'Limpiador de Acero Inoxidable 3M', '600 cc', '', 5),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '223', 'Limpiador de Metales Venus', '425 cc', '', 6),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '224', 'Limpiador Brilla Metal', '60 grs', '', 7),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '225', 'Limpiador Espuma Lem', '360 cc', '', 8),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '220', 'Lustramuebles Blem Original', '360 cc', '', 9),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '221', 'Lustramuebles Blem Naranja', '360 cc', '', 10),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Limpiadores' and c.name = 'Productos de Limpieza'), '228', 'Espuma Blem Electrónicos', '235 cc', '', 11);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Jabones · Perfumes' and c.name = 'Productos de Limpieza'), '126', 'Jabón Líquido para Ropa Fina', '5 lts', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Jabones · Perfumes' and c.name = 'Productos de Limpieza'), '126-N', 'Jabón Líquido para Ropa Fina', '1 L', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Jabones · Perfumes' and c.name = 'Productos de Limpieza'), '140', 'Jabón en Pan Blanco', '200 grs', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Jabones · Perfumes' and c.name = 'Productos de Limpieza'), '130', 'Suavizante Perfumado Ropa Fina', '5 lts', '', 3),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Jabones · Perfumes' and c.name = 'Productos de Limpieza'), '131', 'Perfume para Ropa', '5 lts', '', 4),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Jabones · Perfumes' and c.name = 'Productos de Limpieza'), '133', 'Perfume para Ropa Repuesto', '1 l', '', 5);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '203', 'Cera para Pisos Autobrillo Incolora', '5 lts', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '204', 'Cera para Pisos Autobrillo Negra', '5 lts', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '205', 'Cera para Pisos Autobrillo Roja', '5 lts', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '206', 'Cera Pisos Autolustre 8M Incolora Johnson', '5 lts', '', 3),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '207', 'Cera Pisos Autolustre 8M Negra Johnson', '5 lts', '', 4),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '208', 'Cera Pisos Autolustre 8M Roja Johnson', '5 lts', '', 5),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '209', 'Cera para Pisos Blem Incolora Johnson', '5 lts', '', 6),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '211', 'Cera para Madera Roble Claro', '5 lts', '', 7),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '212', 'Cera para Madera Roble Oscuro', '5 lts', '', 8),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '213', 'Acondicionador de Piso Lavalustre', '5 lts', '', 9),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '218', 'Brillo de Pisos Mopa y Lampazo', '5 lts', '', 10),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '215', 'Removedor de Cera', '1 l', 'Línea Remocer.', 11),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Ceras' and c.name = 'Productos de Limpieza'), '216', 'Removedor de Cera', '5 lts', 'Línea Remocer.', 12);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Palos · Palas' and c.name = 'Productos de Limpieza'), '118', 'Palo para Residuos con Escobita', '1 m', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Palos · Palas' and c.name = 'Productos de Limpieza'), '119', 'Pala para Residuos Plástica', '—', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Palos · Palas' and c.name = 'Productos de Limpieza'), '120', 'Pala para Residuos de Pie', '1 m', '', 2);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Vidrios' and c.name = 'Productos de Limpieza'), '321', 'Secador para Vidrio con Esponja', '30 cm', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Vidrios' and c.name = 'Productos de Limpieza'), '325', 'Secador de Vidrio Profesional', '35 cm', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Vidrios' and c.name = 'Productos de Limpieza'), '326', 'Vaina Repuesto Secador Vidrio Profesional', '35 cm', '', 2);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Plumeros'), '122', 'Plumero de Pluma Grande', '—', 'Ideal para desempolvar superficies altas y de difícil acceso sin dañarlas.', 0),
  ((select id from subcategories where name = 'Plumeros'), '123', 'Plumero de Pluma Mediano', '—', 'Ideal para desempolvar superficies altas y de difícil acceso sin dañarlas.', 1),
  ((select id from subcategories where name = 'Plumeros'), '124', 'Plumero de Pluma Limpia Techos', '—', 'Ideal para desempolvar superficies altas y de difícil acceso sin dañarlas.', 2),
  ((select id from subcategories where name = 'Plumeros'), '125', 'Plumero de Plástico Limpia Techos', '—', 'Ideal para desempolvar superficies altas y de difícil acceso sin dañarlas.', 3),
  ((select id from subcategories where name = 'Plumeros'), 'PL-N1', 'Plumero de Microfibra', '—', 'Ideal para desempolvar superficies altas y de difícil acceso sin dañarlas.', 4);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Piso' and c.name = 'Productos de Limpieza'), '310', 'Secador para Piso de Goma', '30 cm', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Piso' and c.name = 'Productos de Limpieza'), '311', 'Secador para Piso de Goma', '40 cm', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Piso' and c.name = 'Productos de Limpieza'), '312', 'Secador para Piso de Goma', '50 cm', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Piso' and c.name = 'Productos de Limpieza'), '317', 'Secador para Piso Doble Goma', '40 cm', '', 3),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Piso' and c.name = 'Productos de Limpieza'), '329', 'Sopapa de Goma Uso Familiar', '—', '', 4),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Secadores para Piso' and c.name = 'Productos de Limpieza'), '330', 'Sopapa de Goma Uso Industrial', '—', '', 5);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Cepillos'), '60', 'Aplicador para Cera', '20 cm', '', 0),
  ((select id from subcategories where name = 'Cepillos'), '62', 'Cepillo de Mano Plástico', '20 cm', '', 1),
  ((select id from subcategories where name = 'Cepillos'), '67', 'Cepillo Piso Paja Amarilla Guinea', '20 m', '', 2),
  ((select id from subcategories where name = 'Cepillos'), '68', 'Cepillo para Piso Plástico', '30 cm', '', 3),
  ((select id from subcategories where name = 'Cepillos'), '69', 'Cepillo Parrilla Paja Amarilla Guinea', '20 cm', '', 4),
  ((select id from subcategories where name = 'Cepillos'), '71', 'Cepillo Parrilla Paja Amarilla Guinea con Cabo', '20 cm', '', 5);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '179', 'Delantal con Pechera', 'Plástico', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '181', 'Delantal con Pechera', 'Poliéster', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '307', 'Repasador Tela Grafa', 'Guarda Francesa', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '270', 'Paño Absorbente Amarillo', '37×40 cm', '', 3),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '271', 'Paño Absorbente Celeste', '37×40 cm', '', 4),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '277', 'Paño Absorbente Naranja', '37×40 cm', '', 5),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '276', 'Paño Microfibra', '38×40 cm', '', 6),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '300', 'Trapo Rejilla Reforzada', '—', '', 7),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '303', 'Trapo Franela Naranja', '50×50 cm', '', 8),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '269', 'Trapo Paño para Piso', '50×57 cm', '', 9),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '304', 'Trapo de Piso Gris', '50×60 cm', '', 10),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '305', 'Trapo de Piso Blanco', '50×60 cm', '', 11),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '306', 'Trapo de Piso Consorcio Blanco', '60×70 cm', '', 12),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Paños · Trapos' and c.name = 'Productos de Limpieza'), '309', 'Trapo Piso Blanco Trama Nido de Abeja', '50×60 cm', '', 13);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '75', 'Balde con Escurridor para Lampazo', '12 lts', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '76', 'Balde', '12 lts', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '101', 'Mopa para Piso con Bastidor', '35 cm', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '102', 'Mopa para Piso con Bastidor', '60 cm', '', 3),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '103', 'Mopa para Piso con Bastidor', '80 cm', '', 4),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '104', 'Mopa para Piso Repuesto', '35 cm', '', 5),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '105', 'Mopa para Piso Repuesto', '60 cm', '', 6),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '106', 'Mopa para Piso Repuesto', '80 cm', '', 7),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '115', 'Lampazo para Piso', 'Paños', '', 8),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Baldes · Mopas' and c.name = 'Productos de Limpieza'), '116', 'Lampazo para Piso', 'Algodón', '', 9);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Recipientes de Residuos'), '79', 'Recipiente para Residuos con Tapa', '10 lts', '', 0),
  ((select id from subcategories where name = 'Recipientes de Residuos'), '80', 'Recipiente para Residuos', '13 lts', '', 1),
  ((select id from subcategories where name = 'Recipientes de Residuos'), '81', 'Recipiente para Residuos con Tapa', '34 lts', '', 2),
  ((select id from subcategories where name = 'Recipientes de Residuos'), '82', 'Recipiente para Residuos con Tapa', '72 lts', '', 3);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '260', 'Esponja con Fibra Verde Chica', '100×60×35 mm', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '261', 'Esponja con Fibra Verde Grande', '120×80×35 mm', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '266', 'Esponja Doble Cara', '13×10 cm', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '267', 'Paño Fibra Negra para Parrilla', '12×16 cm', '', 3),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '268', 'Paño Fibra Verde', '12×16 cm', '', 4),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '262', 'Estropajo de Acero Inoxidable', '30 grs', '', 5),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '263', 'Estropajo de Acero Especial', '40 grs', '', 6),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '264', 'Estropajo de Bronce', '30 grs', '', 7),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '272', 'Lana de Acero en Rulito', '10 rollos de 43 grs', '', 8),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '273', 'Lana de Acero', '1,50 kgs', '', 9),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '274', 'Viruta para Piso Fina', '330 grs', '', 10),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Esponjas · Fibras' and c.name = 'Productos de Limpieza'), '275', 'Viruta para Piso Mediana', '330 grs', '', 11);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Insecticidas · Desinfectantes' and c.name = 'Productos de Limpieza'), '38', 'Desinfectante para Pisos Acaroina', '4 lts', '', 0),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Insecticidas · Desinfectantes' and c.name = 'Productos de Limpieza'), '234', 'Insecticida sin Olor Raid', '360 cc', '', 1),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Insecticidas · Desinfectantes' and c.name = 'Productos de Limpieza'), '235', 'Insecticida Casa y Jardín Raid', '360 cc', '', 2),
  ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = 'Insecticidas · Desinfectantes' and c.name = 'Productos de Limpieza'), '236', 'Insecticida sin Olor Raid', '360 cc', 'Posible duplicado del código 234 en el catálogo original (mismo producto) — confirmar con Leila.', 3);

-- ═══════════════════════════════════════════════════════════════════════
-- 3. SUBCATEGORÍA NUEVA EN "Electricidad"
-- ═══════════════════════════════════════════════════════════════════════

insert into subcategories (category_id, name, sub, icon, sort_order) values
  ((select id from categories where name = 'Electricidad'), 'Lámparas LED', '', '💡', 0);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Lámparas LED'), '280', 'Lámpara LED', '9w, fría', '', 0),
  ((select id from subcategories where name = 'Lámparas LED'), '282', 'Lámpara LED', '12w, fría', '', 1);
