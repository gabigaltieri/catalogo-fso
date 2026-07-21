'use client';

type FilterItem = { id: string; label: string };

// Filtro de subcategorías por categoría: manipula el DOM directamente
// (mismo enfoque que NavScrollSync) en vez de mantener estado en React,
// así el resto de la página sigue siendo un Server Component.
export default function CategoryFilter({ groupId, items }: { groupId: string; items: FilterItem[] }) {
  if (items.length < 2) return null;

  function apply(subId: string | null) {
    document.querySelectorAll<HTMLElement>(`[data-cat-group="${groupId}"] .subcat-block`).forEach((el) => {
      el.style.display = !subId || el.dataset.subcat === subId ? '' : 'none';
    });
    document.querySelectorAll<HTMLElement>(`[data-filter-group="${groupId}"] .filter-chip`).forEach((el) => {
      el.classList.toggle('active', el.dataset.subcat === (subId ?? 'all'));
    });
  }

  return (
    <div className="filter-bar" data-filter-group={groupId}>
      <button type="button" className="filter-chip active" data-subcat="all" onClick={() => apply(null)}>
        Todos
      </button>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          className="filter-chip"
          data-subcat={it.id}
          onClick={() => apply(it.id)}
        >
          {it.label}
        </button>
      ))}
    </div>
  );
}
