// Genera supabase/seed.sql a partir de los arrays DEFAULT_CATS/DEFAULT_SUBCATS/DEFAULT_PRODS
// que viven en legacy/admin.html (la versión estática archivada). Evita transcribir a mano
// las ~60 filas de productos. Correr con: node scripts/generate-seed.mjs

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const html = readFileSync(path.join(root, 'legacy', 'admin.html'), 'utf8');

function extractArray(varName) {
  const start = html.indexOf(`const ${varName} = [`);
  if (start === -1) throw new Error(`No se encontró ${varName}`);
  const arrayStart = html.indexOf('[', start);
  let depth = 0;
  let end = -1;
  for (let i = arrayStart; i < html.length; i++) {
    if (html[i] === '[') depth++;
    if (html[i] === ']') {
      depth--;
      if (depth === 0) { end = i + 1; break; }
    }
  }
  const literal = html.slice(arrayStart, end);
  // eslint-disable-next-line no-new-func
  return new Function(`return ${literal};`)();
}

const cats = extractArray('DEFAULT_CATS');
const subcats = extractArray('DEFAULT_SUBCATS');
const prods = extractArray('DEFAULT_PRODS');

function sqlStr(s) {
  return `'${String(s).replace(/'/g, "''")}'`;
}

let sql = `-- Datos semilla: traducidos desde DEFAULT_CATS/DEFAULT_SUBCATS/DEFAULT_PRODS
-- de legacy/admin.html. Generado por scripts/generate-seed.mjs — no editar a mano,
-- volver a correr el script si cambian los datos por defecto.
-- Se resuelven las FKs por nombre (subquery) en vez de inventar UUIDs a mano.

`;

cats.forEach((c, i) => {
  sql += `insert into categories (name, icon, color, sort_order) values (${sqlStr(c.name)}, ${sqlStr(c.icon)}, ${sqlStr(c.color)}, ${i});\n`;
});

sql += '\n';

subcats.forEach((s, i) => {
  const cat = cats.find((c) => c.id === s.catId);
  if (!cat) throw new Error(`Subcategoría ${s.name} sin categoría (catId=${s.catId})`);
  sql += `insert into subcategories (category_id, name, sub, icon, sort_order) values ((select id from categories where name = ${sqlStr(cat.name)}), ${sqlStr(s.name)}, ${sqlStr(s.sub)}, ${sqlStr(s.icon)}, ${i});\n`;
});

sql += '\n';

prods.forEach((p, i) => {
  const sc = subcats.find((s) => s.id === p.subcatId);
  if (!sc) throw new Error(`Producto ${p.cod} sin subcategoría (subcatId=${p.subcatId})`);
  // Nombre de subcategoría puede repetirse entre categorías distintas (no en los datos
  // actuales, pero por las dudas) — se resuelve también por categoría padre.
  const cat = cats.find((c) => c.id === sc.catId);
  sql += `insert into products (subcategory_id, cod, name, pres, description, sort_order) values ((select sc.id from subcategories sc join categories c on c.id = sc.category_id where sc.name = ${sqlStr(sc.name)} and c.name = ${sqlStr(cat.name)}), ${sqlStr(p.cod)}, ${sqlStr(p.name)}, ${sqlStr(p.pres)}, ${sqlStr(p.desc)}, ${i});\n`;
});

writeFileSync(path.join(root, 'supabase', 'seed.sql'), sql, 'utf8');
console.log(`OK: ${cats.length} categorías, ${subcats.length} subcategorías, ${prods.length} productos -> supabase/seed.sql`);
