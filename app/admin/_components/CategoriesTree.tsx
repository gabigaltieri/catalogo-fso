'use client';

import { useState } from 'react';
import type { BannerColor } from '@/lib/database.types';
import type { Category } from '@/lib/queries';
import { createCategory, createSubcategory, deleteCategory, deleteSubcategory } from '../actions';
import HelpIcon from './HelpIcon';
import SubcategoryImage from './SubcategoryImage';

export default function CategoriesTree({
  catalog,
  showToast,
  refresh,
}: {
  catalog: Category[];
  showToast: (msg: string, type?: 'success') => void;
  refresh: () => void;
}) {
  // Agregar subcategoría
  const [scCatId, setScCatId] = useState('');
  const [scName, setScName] = useState('');
  const [scSub, setScSub] = useState('');
  const [scIcon, setScIcon] = useState('');
  const [scSaving, setScSaving] = useState(false);

  // Agregar categoría
  const [catName, setCatName] = useState('');
  const [catIcon, setCatIcon] = useState('');
  const [catColor, setCatColor] = useState<BannerColor>('red');
  const [catSaving, setCatSaving] = useState(false);

  async function handleAddSubcat() {
    setScSaving(true);
    try {
      await createSubcategory({ categoryId: scCatId, name: scName, sub: scSub, icon: scIcon });
      showToast('Subcategoría agregada', 'success');
      refresh();
      setScName('');
      setScSub('');
      setScIcon('');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al agregar');
    } finally {
      setScSaving(false);
    }
  }

  async function handleAddCategory() {
    setCatSaving(true);
    try {
      await createCategory({ name: catName, icon: catIcon, color: catColor });
      showToast('Categoría agregada', 'success');
      refresh();
      setCatName('');
      setCatIcon('');
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al agregar');
    } finally {
      setCatSaving(false);
    }
  }

  async function handleDeleteSubcat(sc: Category['subcategories'][number]) {
    const warn = sc.products.length ? ` También se eliminarán ${sc.products.length} producto(s).` : '';
    if (!confirm(`¿Eliminar subcategoría "${sc.name}"?${warn}`)) return;
    try {
      await deleteSubcategory(sc.id);
      showToast('Subcategoría eliminada');
      refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al eliminar');
    }
  }

  async function handleDeleteCategory(cat: Category) {
    const prodCount = cat.subcategories.reduce((n, sc) => n + sc.products.length, 0);
    const warn = cat.subcategories.length
      ? ` Se eliminarán también ${cat.subcategories.length} subcategoría(s) y ${prodCount} producto(s).`
      : '';
    if (!confirm(`¿Eliminar categoría "${cat.name}"?${warn}`)) return;
    try {
      await deleteCategory(cat.id);
      showToast('Categoría eliminada');
      refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al eliminar');
    }
  }

  return (
    <>
      <div className="admin-section-title">
        Gestión de Categorías
        <HelpIcon tip="Acá ves el árbol completo del catálogo: categorías y sus subcategorías, con la cantidad de productos que tiene cada una." />
      </div>

      <div className="cat-tree" style={{ marginBottom: 28 }}>
        {catalog.length === 0 ? (
          <div className="empty-state"><div className="es-icon">📂</div>No hay categorías.</div>
        ) : (
          catalog.map((cat) => {
            const prodCount = cat.subcategories.reduce((n, sc) => n + sc.products.length, 0);
            return (
              <div className="cat-item" key={cat.id}>
                <div className="cat-header-row">
                  <span className="cat-num">{cat.icon}</span>
                  <span>{cat.name}</span>
                  <span className="cat-count">{cat.subcategories.length} subcategorías · {prodCount} productos</span>
                  <button
                    className="btn-del-sc"
                    style={{ color: 'rgba(255,255,255,.5)' }}
                    title="Eliminar categoría"
                    onClick={() => handleDeleteCategory(cat)}
                  >
                    ✕
                  </button>
                </div>
                {cat.subcategories.length ? (
                  cat.subcategories.map((sc) => (
                    <div className="subcat-row" key={sc.id}>
                      <SubcategoryImage
                        subcategoryId={sc.id}
                        imageUrl={sc.imageUrl}
                        showToast={showToast}
                        refresh={refresh}
                      />
                      <span className="sc-icon">{sc.icon}</span>
                      <span className="sc-name">
                        {sc.name}
                        {sc.sub && <><br /><small className="sc-sub">{sc.sub}</small></>}
                      </span>
                      <span className="sc-prod-count">{sc.products.length} prod.</span>
                      <button className="btn-del-sc" title="Eliminar subcategoría" onClick={() => handleDeleteSubcat(sc)}>✕</button>
                    </div>
                  ))
                ) : (
                  <div className="subcat-row" style={{ color: '#bbb', fontStyle: 'italic' }}>Sin subcategorías</div>
                )}
              </div>
            );
          })
        )}
      </div>

      <div className="cards-2col">
        <div className="add-card">
          <h3>
            Agregar Subcategoría
            <HelpIcon tip="Una subcategoría agrupa productos similares dentro de una categoría (ej: 'Detergentes' dentro de 'Productos de Limpieza')." />
          </h3>
          <div className="form-group">
            <label className="form-label">Categoría Padre</label>
            <select className="form-select" value={scCatId} onChange={(e) => setScCatId(e.target.value)}>
              <option value="">Seleccionar…</option>
              {catalog.map((c) => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nombre Principal</label>
            <input className="form-input" placeholder="Ej: Jabones en Barra" value={scName} onChange={(e) => setScName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Nombre Secundario <span style={{ fontWeight: 400 }}>(opcional)</span></label>
            <input className="form-input" placeholder="Ej: Antibacteriales" value={scSub} onChange={(e) => setScSub(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Emoji Ícono</label>
            <input className="form-input" placeholder="Ej: 🧼" maxLength={4} value={scIcon} onChange={(e) => setScIcon(e.target.value)} />
          </div>
          <button className="btn-primary" onClick={handleAddSubcat} disabled={scSaving}>
            {scSaving ? 'Agregando…' : 'Agregar Subcategoría'}
          </button>
        </div>

        <div className="add-card">
          <h3>
            Agregar Categoría Principal
            <HelpIcon tip="Una categoría es una sección grande del catálogo (ej: 'Higiene Institucional'). Tiene su propio color de banner en el catálogo público." />
          </h3>
          <div className="form-group">
            <label className="form-label">Nombre de la Categoría</label>
            <input className="form-input" placeholder="Ej: Maquinaria de Limpieza" value={catName} onChange={(e) => setCatName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Emoji Ícono</label>
            <input className="form-input" placeholder="Ej: 🏭" maxLength={4} value={catIcon} onChange={(e) => setCatIcon(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Color del Banner</label>
            <select className="form-select" value={catColor} onChange={(e) => setCatColor(e.target.value as BannerColor)}>
              <option value="red">Rojo (como Limpieza)</option>
              <option value="dark">Negro (como Higiene)</option>
              <option value="darkred">Rojo Oscuro (como Descartables)</option>
            </select>
          </div>
          <button className="btn-primary" onClick={handleAddCategory} disabled={catSaving}>
            {catSaving ? 'Agregando…' : 'Agregar Categoría'}
          </button>
        </div>
      </div>
    </>
  );
}
