'use client';

import { useMemo, useState } from 'react';
import type { Category } from '@/lib/queries';
import { createProduct } from '../actions';
import HelpIcon from './HelpIcon';

export default function AddProductForm({
  catalog,
  showToast,
  refresh,
}: {
  catalog: Category[];
  showToast: (msg: string, type?: 'success') => void;
  refresh: () => void;
}) {
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [cod, setCod] = useState('');
  const [pres, setPres] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const subcats = useMemo(
    () => catalog.find((c) => c.id === categoryId)?.subcategories ?? [],
    [catalog, categoryId]
  );

  async function handleSubmit() {
    setSaving(true);
    try {
      await createProduct({ subcategoryId, cod, name, pres, description });
      showToast('Producto agregado correctamente', 'success');
      refresh();
      setCod('');
      setPres('');
      setName('');
      setDescription('');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al agregar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <div className="admin-section-title">
        Agregar Producto
        <HelpIcon tip="Completá todos los campos. El código y el nombre son obligatorios; el resto lo podés dejar en blanco y completarlo después." />
      </div>

      <div className="form-card">
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">
              Categoría
              <HelpIcon tip="La sección grande del catálogo a la que pertenece el producto (ej: 'Higiene Institucional')." />
            </label>
            <select
              className="form-select"
              value={categoryId}
              onChange={(e) => { setCategoryId(e.target.value); setSubcategoryId(''); }}
            >
              <option value="">Seleccionar…</option>
              {catalog.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">
              Subcategoría
              <HelpIcon tip="El grupo específico dentro de la categoría (ej: 'Jabón Líquido'). Elegí primero la categoría." />
            </label>
            <select
              className="form-select"
              value={subcategoryId}
              onChange={(e) => setSubcategoryId(e.target.value)}
              disabled={!categoryId}
            >
              <option value="">{categoryId ? (subcats.length ? 'Seleccionar…' : 'Sin subcategorías') : 'Seleccionar categoría primero'}</option>
              {subcats.map((sc) => (
                <option key={sc.id} value={sc.id}>{sc.icon} {sc.name}{sc.sub ? ' · ' + sc.sub : ''}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Código</label>
            <input className="form-input" placeholder="Ej: 025" value={cod} onChange={(e) => setCod(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Presentación</label>
            <input className="form-input" placeholder="Ej: 5 lts" value={pres} onChange={(e) => setPres(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nombre del Producto</label>
          <input
            className="form-input"
            placeholder="Ej: Desengrasante Industrial"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea
            className="form-textarea"
            placeholder="Descripción del producto…"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Agregando…' : 'Agregar Producto'}
          </button>
        </div>
      </div>
    </>
  );
}
