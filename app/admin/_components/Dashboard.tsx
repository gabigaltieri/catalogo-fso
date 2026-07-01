import type { Category } from '@/lib/queries';
import HelpIcon from './HelpIcon';

const ICON_PACKAGE = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </svg>
);

const ICON_LAYERS = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z" />
    <path d="m22 17.65-9.17 4.16a2 2 0 0 1-1.66 0L2 17.65" />
    <path d="m22 12.65-9.17 4.16a2 2 0 0 1-1.66 0L2 12.65" />
  </svg>
);

const ICON_FOLDER = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={22} height={22}>
    <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z" />
  </svg>
);

const ICON_ADD = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
  </svg>
);

const ICON_TAG = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <path d="M12.6 2.7a2 2 0 0 0-2.8 0L2.7 9.8a2 2 0 0 0 0 2.8l8.7 8.7a2 2 0 0 0 2.8 0l7.1-7.1a2 2 0 0 0 0-2.8Z" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
);

const ICON_EXTERNAL = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={16} height={16}>
    <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
  </svg>
);

export default function Dashboard({
  catalog,
  onGoTo,
}: {
  catalog: Category[];
  onGoTo: (tab: 'add' | 'cats') => void;
}) {
  const subcatCount = catalog.reduce((n, c) => n + c.subcategories.length, 0);
  const prodCount = catalog.reduce((n, c) => n + c.subcategories.reduce((m, sc) => m + sc.products.length, 0), 0);

  const cards = [
    { icon: ICON_PACKAGE, color: 'c-red', value: prodCount, label: 'Productos', sub: `en ${subcatCount} subcategorías` },
    { icon: ICON_LAYERS, color: 'c-dark', value: subcatCount, label: 'Subcategorías', sub: `en ${catalog.length} categorías` },
    { icon: ICON_FOLDER, color: 'c-darkred', value: catalog.length, label: 'Categorías', sub: 'secciones del catálogo' },
  ];

  const total = prodCount || 1;

  return (
    <>
      <div className="dash-cards">
        {cards.map((c) => (
          <div className="dash-card" key={c.label}>
            <div className={`dash-card-icon ${c.color}`}>{c.icon}</div>
            <div className="dash-card-value">{c.value}</div>
            <div className="dash-card-label">{c.label}</div>
            <div className="dash-card-sub">{c.sub}</div>
          </div>
        ))}
      </div>

      <div className="dash-panel">
        <div className="dash-panel-title">
          Productos por categoría
          <HelpIcon tip="Muestra qué porcentaje de tus productos está en cada categoría, para detectar si alguna quedó vacía o desbalanceada." />
        </div>
        {catalog.length === 0 ? (
          <div className="empty-state" style={{ padding: 20 }}>Todavía no hay categorías cargadas.</div>
        ) : (
          catalog.map((cat) => {
            const count = cat.subcategories.reduce((n, sc) => n + sc.products.length, 0);
            const pct = Math.round((count / total) * 100);
            return (
              <div className="dash-bar-row" key={cat.id}>
                <div className="dash-bar-label"><span>{cat.icon}</span> {cat.name}</div>
                <div className="dash-bar-track"><div className="dash-bar-fill" style={{ width: `${pct}%` }} /></div>
                <div className="dash-bar-pct">{count} · {pct}%</div>
              </div>
            );
          })
        )}
      </div>

      <div className="dash-panel">
        <div className="dash-panel-title">
          Accesos rápidos
          <HelpIcon tip="Atajos a las acciones más comunes, sin tener que ir al menú de la izquierda." />
        </div>
        <div className="dash-quicklinks">
          <button className="dash-quicklink" onClick={() => onGoTo('add')}>{ICON_ADD} Agregar producto</button>
          <button className="dash-quicklink" onClick={() => onGoTo('cats')}>{ICON_TAG} Gestionar categorías</button>
          <a className="dash-quicklink" href="/" target="_blank">{ICON_EXTERNAL} Ver catálogo público</a>
        </div>
      </div>
    </>
  );
}
