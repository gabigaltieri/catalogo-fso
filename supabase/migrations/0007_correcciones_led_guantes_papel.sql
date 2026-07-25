-- Correcciones del cliente (sesión 21/07/2026): resuelve los pendientes que
-- 0006_productos_reales.sql había dejado abiertos para Iluminación LED,
-- marcas nuevas de Guantes y presentaciones de Papel Higiénico. Fuente:
-- mensaje de voz del cliente, contrastado con las dudas abiertas en
-- transcripcion-maxilimp.txt (secciones 22, 23, 26) y readme.txt 8c.

-- ═══════════════════════════════════════════════════════════════════════
-- 1. ILUMINACIÓN LED: Dicroicas LED y Tubos LED (subcategorías nuevas) +
--    watts/colores faltantes en Lámparas LED. Maxilimp no da código real
--    para estos productos → código generado (prefijo "LED-N"), confirmado
--    por el cliente que existen las 24 combinaciones (3 tipos × 4 watts ×
--    2 colores).
-- ═══════════════════════════════════════════════════════════════════════

insert into subcategories (category_id, name, sub, icon, sort_order) values
  ((select id from categories where name = 'Electricidad'), 'Dicroicas LED', '', '💡', 1),
  ((select id from categories where name = 'Electricidad'), 'Tubos LED', '', '💡', 2);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N1', 'Dicroica LED', '7w, cálida', '', 0),
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N2', 'Dicroica LED', '7w, fría', '', 1),
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N3', 'Dicroica LED', '9w, cálida', '', 2),
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N4', 'Dicroica LED', '9w, fría', '', 3),
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N5', 'Dicroica LED', '12w, cálida', '', 4),
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N6', 'Dicroica LED', '12w, fría', '', 5),
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N7', 'Dicroica LED', '14w, cálida', '', 6),
  ((select id from subcategories where name = 'Dicroicas LED'), 'LED-N8', 'Dicroica LED', '14w, fría', '', 7);

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N9', 'Tubo LED', '7w, cálida', '', 0),
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N10', 'Tubo LED', '7w, fría', '', 1),
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N11', 'Tubo LED', '9w, cálida', '', 2),
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N12', 'Tubo LED', '9w, fría', '', 3),
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N13', 'Tubo LED', '12w, cálida', '', 4),
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N14', 'Tubo LED', '12w, fría', '', 5),
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N15', 'Tubo LED', '14w, cálida', '', 6),
  ((select id from subcategories where name = 'Tubos LED'), 'LED-N16', 'Tubo LED', '14w, fría', '', 7);

-- Lámparas LED ya tenía cod 280 (9w, fría) y 282 (12w, fría) reales; se
-- reordenan para que queden intercalados por watt ascendente junto con
-- las combinaciones nuevas.
update products set sort_order = 3 where cod = '280';
update products set sort_order = 5 where cod = '282';

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Lámparas LED'), 'LED-N17', 'Lámpara LED', '7w, cálida', '', 0),
  ((select id from subcategories where name = 'Lámparas LED'), 'LED-N18', 'Lámpara LED', '7w, fría', '', 1),
  ((select id from subcategories where name = 'Lámparas LED'), 'LED-N19', 'Lámpara LED', '9w, cálida', '', 2),
  ((select id from subcategories where name = 'Lámparas LED'), 'LED-N20', 'Lámpara LED', '12w, cálida', '', 4),
  ((select id from subcategories where name = 'Lámparas LED'), 'LED-N21', 'Lámpara LED', '14w, cálida', '', 6),
  ((select id from subcategories where name = 'Lámparas LED'), 'LED-N22', 'Lámpara LED', '14w, fría', '', 7);

-- ═══════════════════════════════════════════════════════════════════════
-- 2. GUANTES: marcas nuevas Jorgito y Pirelli Plissé (goma doméstico,
--    S/M/L/XL), línea Profesional (talles numéricos 7-11), y talle XL
--    agregado a los descartables de Látex/Nitrilo ya cargados (que además
--    pasan de "Pequeño/Mediano/Grande" a la nomenclatura S/M/L/XL). Sin
--    código real de Maxilimp para lo nuevo → código generado ("GTE-N").
-- ═══════════════════════════════════════════════════════════════════════

update products set pres = 'S · 100 u' where cod = '194';
update products set pres = 'M · 100 u' where cod = '195';
update products set pres = 'L · 100 u' where cod = '196';
update products set pres = 'S · 100 u' where cod = '754';
update products set pres = 'M · 100 u' where cod = '755';
update products set pres = 'L · 100 u' where cod = '756';

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Guantes'), 'GTE-N1', 'Guante de Látex', 'XL · 100 u', '', 15),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N2', 'Guante de Nitrilo', 'XL · 100 u', '', 16),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N3', 'Guante Jorgito', 'S', '', 17),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N4', 'Guante Jorgito', 'M', '', 18),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N5', 'Guante Jorgito', 'L', '', 19),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N6', 'Guante Jorgito', 'XL', '', 20),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N7', 'Guante Pirelli Plissé', 'S', '', 21),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N8', 'Guante Pirelli Plissé', 'M', '', 22),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N9', 'Guante Pirelli Plissé', 'L', '', 23),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N10', 'Guante Pirelli Plissé', 'XL', '', 24),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N11', 'Guante Profesional', '7', '', 25),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N12', 'Guante Profesional', '8', '', 26),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N13', 'Guante Profesional', '9', '', 27),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N14', 'Guante Profesional', '10', '', 28),
  ((select id from subcategories where name = 'Guantes'), 'GTE-N15', 'Guante Profesional', '11', '', 29);

-- ═══════════════════════════════════════════════════════════════════════
-- 3. PAPEL HIGIÉNICO: se elimina el cod 259 ("36 u × 100 mts×10cm", mal
--    interpretado); las variantes reales son 30/80 mts simple/doble hoja
--    (ya cargadas como PH-N1..N4) y el rollo de 100 mts hoja simple × 1 u
--    (PH-N5) — el cliente confirmó esta interpretación, se limpia el
--    disclaimer de "confirmar con Leila". Se agregan los dispensers cono
--    mediano/grande con código real (257/258; la cantidad, antes
--    ilegible en el catálogo, el cliente confirmó que es 2 u).
-- ═══════════════════════════════════════════════════════════════════════

delete from products where cod = '259';

update products set description = '' where cod in ('PH-N1', 'PH-N2', 'PH-N3', 'PH-N4', 'PH-N5');

insert into products (subcategory_id, cod, name, pres, description, sort_order) values
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '257', 'Papel Higiénico Dispenser Cono Mediano', '2 u × 300 mts×10cm', '', 12),
  ((select id from subcategories where name = 'Papel Higiénico' and sub = 'Toallas de Mano'), '258', 'Papel Higiénico Dispenser Cono Grande', '2 u × 300 mts×10cm', '', 13);
