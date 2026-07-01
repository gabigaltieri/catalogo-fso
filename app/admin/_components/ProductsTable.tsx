'use client';

import { useMemo, useState } from 'react';
import { flattenProducts, type Category, type FlatProduct } from '@/lib/queries';
import { deleteProduct } from '../actions';
import HelpIcon from './HelpIcon';
import EditProductModal from './EditProductModal';

export default function ProductsTable({
  catalog,
  showToast,
  refresh,
}: {
  catalog: Category[];
  showToast: (msg: string, type?: 'success') => void;
  refresh: () => void;
}) {
  const [query, setQuery] = useState('');
  const [filterCat, setFilterCat] = useState('');
  const [editing, setEditing] = useState<FlatProduct | null>(null);

  const allProducts = useMemo(() => flattenProducts(catalog), [catalog]);

  const filtered = allProducts.filter((p) => {
    if (filterCat && p.categoryId !== filterCat) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      p.name.toLowerCase().includes(q) ||
      p.cod.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.pres.toLowerCase().includes(q)
    );
  });

  async function handleDelete(p: FlatProduct) {
    if (!confirm(`¿Eliminar "${p.name}" (${p.cod})?`)) return;
    try {
      await deleteProduct(p.id);
      showToast('Producto eliminado');
      refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al eliminar');
    }
  }

  return (
    <>
      <div className="admin-section-title">
        Editar Productos
        <HelpIcon tip="Escribí en el buscador o filtrá por categoría para encontrar el producto que querés modificar o borrar." />
      </div>

      <div className="search-wrap">
        <input
          className="search-input"
          placeholder="Buscar por nombre, código o descripción…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="filter-select" value={filterCat} onChange={(e) => setFilterCat(e.target.value)}>
          <option value="">Todas las categorías</option>
          {catalog.map((c) => (
            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="no-results">No se encontraron productos.</div>
      ) : (
        <table className="admin-prod-table">
          <thead>
            <tr>
              <th>Código</th>
              <th>Producto · Presentación</th>
              <th>Descripción</th>
              <th>Subcategoría</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td><span className="cod-badge">{p.cod}</span></td>
                <td>
                  <strong>{p.name}</strong>
                  <br />
                  <span style={{ color: '#888', fontSize: 12 }}>{p.pres}</span>
                </td>
                <td style={{ maxWidth: 340, fontSize: 13, color: '#555' }}>{p.description}</td>
                <td>
                  <span className="cat-tag">
                    {p.subcategoryIcon} {p.subcategoryName}{p.subcategorySub ? ' · ' + p.subcategorySub : ''}
                  </span>
                </td>
                <td style={{ whiteSpace: 'nowrap' }}>
                  <button className="btn-edit" onClick={() => setEditing(p)}>Editar</button>
                  <button className="btn-delete" onClick={() => handleDelete(p)} title="Eliminar">✕</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {editing && (
        <EditProductModal
          product={editing}
          catalog={catalog}
          onClose={() => setEditing(null)}
          showToast={showToast}
          refresh={refresh}
        />
      )}
    </>
  );
}
