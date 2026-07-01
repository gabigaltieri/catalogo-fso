import type { Category } from '@/lib/queries';

function esc(s: string): string {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Port casi textual del generatePDF() de legacy/admin.html: abre una ventana
// nueva, escribe un documento HTML imprimible y dispara window.print().
// Ahora recibe el catálogo ya cargado en memoria (sin fetch extra).
export function generatePdf(catalog: Category[]) {
  const win = window.open('', '_blank');
  if (!win) {
    alert('Permitir ventanas emergentes para generar el PDF');
    return;
  }

  const fecha = new Date().toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' });

  let body = '';
  let totalProds = 0;

  catalog.forEach((cat) => {
    const catHasProds = cat.subcategories.some((sc) => sc.products.length > 0);
    if (!catHasProds) return;

    const bgColor = cat.color === 'dark' ? '#1E1E1E' : cat.color === 'darkred' ? '#8B0000' : '#CC0000';

    body += `<div class="section-banner" style="background:${bgColor}">
      <span class="sb-icon">${cat.icon}</span>
      <h2 class="sb-title">${esc(cat.name)}</h2>
    </div>`;

    cat.subcategories.forEach((sc) => {
      if (!sc.products.length) return;
      totalProds += sc.products.length;

      const rows = sc.products
        .map(
          (p) => `<tr>
        <td class="tcod">${esc(p.cod)}</td>
        <td class="tname">${esc(p.name)}</td>
        <td class="tpres">${esc(p.pres)}</td>
        <td class="tdesc">${esc(p.description)}</td>
      </tr>`
        )
        .join('');

      body += `<div class="subcat-block">
        <div class="subcat-title">
          <div class="sn">${esc(sc.name)}</div>
          ${sc.sub ? `<div class="sa">${esc(sc.sub)}</div>` : ''}
        </div>
        <table>
          <thead><tr><th>Código</th><th>Producto</th><th>Presentación</th><th>Descripción</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
    });
  });

  const html = `${'<'}!DOCTYPE html>
${'<'}html lang="es">
<head>
<meta charset="UTF-8">
<title>FSO — Catálogo de Productos — ${fecha}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&display=swap" rel="stylesheet">
<style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    @page { size: A4; margin: 14mm 18mm; }
    body { font-family: 'Segoe UI', system-ui, sans-serif; color: #111; background: #fff; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .print-header { display: flex; align-items: center; justify-content: space-between; padding-bottom: 16px; border-bottom: 3px solid #CC0000; margin-bottom: 24px; }
    .print-logo { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-size: 38pt; font-weight: 900; color: #111; letter-spacing: -2px; line-height: 1; }
    .print-logo span { color: #CC0000; }
    .print-logo-sub { font-size: 9pt; font-weight: 700; color: #666; letter-spacing: 1px; text-transform: uppercase; margin-top: 3px; }
    .print-date { font-size: 9pt; color: #999; text-align: right; line-height: 1.7; }
    .print-date b { display: block; font-size: 10pt; color: #333; font-weight: 700; }
    .section-banner { display: flex; align-items: center; gap: 16px; padding: 12px 18px; margin-top: 24px; page-break-after: avoid; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    .sb-icon { font-size: 30pt; opacity: .45; flex-shrink: 0; }
    .sb-title { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-size: 32pt; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; line-height: 1; color: #fff; }
    .subcat-block { margin-top: 14px; page-break-inside: avoid; }
    .subcat-title { border-left: 4px solid #CC0000; padding-left: 12px; margin-bottom: 7px; }
    .sn { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-size: 17pt; font-weight: 900; text-transform: uppercase; color: #111; line-height: 1.05; }
    .sa { font-family: 'Barlow Condensed', 'Arial Narrow', Arial, sans-serif; font-size: 11pt; font-weight: 700; text-transform: uppercase; color: #888; }
    table { width: 100%; border-collapse: collapse; font-size: 9pt; }
    table thead tr { background: #CC0000; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    table th { padding: 6px 9px; text-align: left; font-size: 7.5pt; font-weight: 700; letter-spacing: .8px; text-transform: uppercase; color: #fff; }
    table th:first-child { width: 66px; text-align: center; }
    table tbody tr { border-bottom: 1px solid #E5E5E5; page-break-inside: avoid; }
    table tbody tr:last-child { border-bottom: none; }
    table tbody tr:nth-child(even) { background: #FAFAFA; print-color-adjust: exact; -webkit-print-color-adjust: exact; }
    table td { padding: 6px 9px; vertical-align: middle; }
    .tcod { text-align: center; font-family: 'Courier New', monospace; font-weight: 700; color: #CC0000; }
    .tname { font-weight: 600; color: #111; }
    .tpres { color: #555; white-space: nowrap; }
    .tdesc { color: #666; line-height: 1.4; }
    .print-footer { margin-top: 32px; padding-top: 10px; border-top: 1px solid #E5E5E5; text-align: center; font-size: 8pt; color: #aaa; }
    @media screen { body { padding: 24px 40px; max-width: 860px; margin: 0 auto; } }
</style>
</head>
${'<'}body>

<div class="print-header">
    <div>
        <div class="print-logo">F<span>S</span>O</div>
        <div class="print-logo-sub">Productos de Limpieza</div>
    </div>
    <div class="print-date">
        <b>Catálogo de Productos</b>
        ${fecha}
    </div>
</div>

${body}

<div class="print-footer">
    FSO Productos de Limpieza &nbsp;·&nbsp; "Limpieza que brilla en cada rincón" &nbsp;·&nbsp; ${totalProds} productos
</div>

${'<'}/body>
${'<'}/html>`;

  win.document.write(html);
  win.document.close();

  win.onload = function () {
    const go = () => win.print();
    if (win.document.fonts && win.document.fonts.ready) {
      win.document.fonts.ready.then(() => setTimeout(go, 300));
    } else {
      setTimeout(go, 1000);
    }
  };
}
