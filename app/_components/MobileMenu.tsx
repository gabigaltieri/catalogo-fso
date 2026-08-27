'use client';

import { useState } from 'react';

type NavItem = { id: string; name: string };

export default function MobileMenu({ items }: { items: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="hamburger-btn"
        aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
        </svg>
      </button>
      {open && (
        <nav className="mobile-menu-panel site-nav" onClick={() => setOpen(false)}>
          {items.map((it) => (
            <a key={it.id} href={`#sec-cat-${it.id}`}>{it.name}</a>
          ))}
        </nav>
      )}
    </>
  );
}
