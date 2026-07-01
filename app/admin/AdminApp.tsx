'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Category } from '@/lib/queries';
import HelpIcon from './_components/HelpIcon';
import Dashboard from './_components/Dashboard';
import ProductsTable from './_components/ProductsTable';
import AddProductForm from './_components/AddProductForm';
import CategoriesTree from './_components/CategoriesTree';
import Toast from './_components/Toast';
import { generatePdf } from './_lib/generatePdf';
import { logout } from './login/actions';

type Tab = 'dashboard' | 'edit' | 'add' | 'cats';

const TABS: { id: Tab; label: string; tip: string; icon: React.ReactNode; title: string; subtitle: string }[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    tip: 'Pantalla de inicio: resumen de cuántos productos, subcategorías y categorías tenés cargados en el catálogo.',
    title: 'Dashboard',
    subtitle: 'Resumen general del catálogo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={19} height={19}>
        <rect x="3" y="3" width="7" height="9" rx="1.2" /><rect x="14" y="3" width="7" height="5" rx="1.2" />
        <rect x="14" y="12" width="7" height="9" rx="1.2" /><rect x="3" y="16" width="7" height="5" rx="1.2" />
      </svg>
    ),
  },
  {
    id: 'edit',
    label: 'Productos',
    tip: 'Buscá cualquier producto ya cargado para modificar nombre, código, presentación o descripción, o para eliminarlo.',
    title: 'Productos',
    subtitle: 'Editar, buscar y eliminar productos del catálogo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={19} height={19}>
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" /><path d="M12 22V12" />
      </svg>
    ),
  },
  {
    id: 'add',
    label: 'Agregar',
    tip: 'Cargá un producto nuevo: elegí categoría y subcategoría, y completá código, presentación, nombre y descripción.',
    title: 'Agregar Producto',
    subtitle: 'Cargar un producto nuevo en el catálogo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={19} height={19}>
        <circle cx="12" cy="12" r="9" /><path d="M12 8v8M8 12h8" />
      </svg>
    ),
  },
  {
    id: 'cats',
    label: 'Categorías',
    tip: "Organizá categorías y subcategorías del catálogo (ej: 'Limpieza' → 'Lavandinas'). Crear nuevas o borrar las que no uses.",
    title: 'Categorías',
    subtitle: 'Organizar categorías y subcategorías del catálogo',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={19} height={19}>
        <path d="M12.6 2.7a2 2 0 0 0-2.8 0L2.7 9.8a2 2 0 0 0 0 2.8l8.7 8.7a2 2 0 0 0 2.8 0l7.1-7.1a2 2 0 0 0 0-2.8Z" />
        <circle cx="8" cy="8" r="1.4" />
      </svg>
    ),
  },
];

export default function AdminApp({ catalog }: { catalog: Category[] }) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [toast, setToast] = useState<{ msg: string; type?: 'success' } | null>(null);
  const router = useRouter();

  function showToast(msg: string, type?: 'success') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2800);
  }

  function refresh() {
    router.refresh();
  }

  const current = TABS.find((t) => t.id === tab)!;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span className="sidebar-logo-mark">F<span>S</span>O</span>
          <span className="sidebar-badge">Admin</span>
        </div>

        <div className="sidebar-section-label">Menú</div>
        <nav className="sidebar-nav">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`nav-item${tab === t.id ? ' active' : ''}`}
              aria-label={t.label}
              onClick={() => setTab(t.id)}
            >
              {t.icon}
              <span className="nav-item-label">{t.label}</span>
              <HelpIcon tip={t.tip} onDark tipRight />
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" className="sidebar-footer-link" aria-label="Ver Catálogo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
              <path d="M15 3h6v6" /><path d="M10 14 21 3" /><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            </svg>
            <span className="nav-item-label">Ver Catálogo</span>
            <HelpIcon tip="Abre en una pestaña nueva el catálogo tal como lo ve el cliente, para revisar cómo quedó." onDark tipRight />
          </a>
          <button className="sidebar-footer-link" aria-label="Descargar PDF" onClick={() => generatePdf(catalog)}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
              <path d="M12 3v12" /><path d="m7 10 5 5 5-5" /><path d="M5 21h14" />
            </svg>
            <span className="nav-item-label">Descargar PDF</span>
            <HelpIcon tip="Genera un PDF del catálogo completo, listo para imprimir o enviar por WhatsApp/email." onDark tipRight />
          </button>
          <button className="sidebar-footer-link" aria-label="Cerrar sesión" onClick={() => logout()}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" width={17} height={17}>
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" />
            </svg>
            <span className="nav-item-label">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-content-header">
          <h1>{current.title}</h1>
          <p>{current.subtitle}</p>
        </div>
        <div className="admin-tab-content">
          {tab === 'dashboard' && <Dashboard catalog={catalog} onGoTo={(t) => setTab(t)} />}
          {tab === 'edit' && <ProductsTable catalog={catalog} showToast={showToast} refresh={refresh} />}
          {tab === 'add' && <AddProductForm catalog={catalog} showToast={showToast} refresh={refresh} />}
          {tab === 'cats' && <CategoriesTree catalog={catalog} showToast={showToast} refresh={refresh} />}
        </div>
      </main>

      <Toast toast={toast} />
    </div>
  );
}
