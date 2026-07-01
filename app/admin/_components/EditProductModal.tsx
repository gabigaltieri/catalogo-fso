'use client';

import { useState } from 'react';
import type { Category, FlatProduct } from '@/lib/queries';
import { updateProduct } from '../actions';

export default function EditProductModal({
  product,
  catalog,
  onClose,
  showToast,
  refresh,
}: {
  product: FlatProduct;
  catalog: Category[];
  onClose: () => void;
  showToast: (msg: string, type?: 'success') => void;
  refresh: () => void;
}) {
  const [cod, setCod] = useState(product.cod);
  const [name, setName] = useState(product.name);
  const [pres, setPres] = useState(product.pres);
  const [description, setDescription] = useState(product.description);
  const [subcategoryId, setSubcategoryId] = useState(product.subcategoryId);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await updateProduct(product.id, { subcategoryId, cod, name, pres, description });
      showToast('Producto actualizado correctamente', 'success');
      refresh();
      onClose();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al guardar');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay open" onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal">
        <div className="modal-header">
          <span className="modal-title">Editar Producto</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Código</label>
            <input className="form-input" value={cod} onChange={(e) => setCod(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Presentación</label>
            <input className="form-input" value={pres} onChange={(e) => setPres(e.target.value)} />
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">Nombre del Producto</label>
          <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Descripción</label>
          <textarea className="form-textarea" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label className="form-label">Subcategoría</label>
          <select className="form-select" value={subcategoryId} onChange={(e) => setSubcategoryId(e.target.value)}>
            {catalog.map((cat) => (
              <optgroup key={cat.id} label={cat.name}>
                {cat.subcategories.map((sc) => (
                  <option key={sc.id} value={sc.id}>
                    {sc.icon} {sc.name}{sc.sub ? ' · ' + sc.sub : ''}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="modal-actions">
          <button className="btn-secondary" onClick={onClose}>Cancelar</button>
          <button className="btn-primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando…' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </div>
  );
}
