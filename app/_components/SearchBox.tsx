'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { FlatProduct } from '@/lib/queries';

const DIACRITICS = /[\u0300-\u036f]/g;

function normalize(s: string) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(DIACRITICS, '');
}

// Buscador de productos por palabras (código, nombre, presentación,
// descripción, subcategoría o categoría). Filtra en el cliente sobre la
// lista ya traída por getCatalog() -- no pega contra la base.
export default function SearchBox({ products }: { products: FlatProduct[] }) {
  const [focused, setFocused] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const open = focused && query.trim().length > 0;

  function close() {
    setFocused(false);
    setQuery('');
    inputRef.current?.blur();
  }

  useEffect(() => {
    if (!focused) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') close();
    }
    function onClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setFocused(false);
    }
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('mousedown', onClick);
    };
  }, [focused]);

  const results = useMemo(() => {
    const words = normalize(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return products
      .filter((p) => {
        const haystack = normalize(
          `${p.cod} ${p.name} ${p.pres} ${p.description} ${p.subcategoryName} ${p.subcategorySub} ${p.categoryName}`
        );
        return words.every((w) => haystack.includes(w));
      })
      .slice(0, 12);
  }, [query, products]);

  function goTo(p: FlatProduct) {
    close();
    setTimeout(() => {
      const row = document.getElementById(`prod-${p.id}`);
      if (!row) return;

      const block = row.closest<HTMLElement>('.subcat-block');
      const groupId = block?.closest<HTMLElement>('[data-cat-group]')?.dataset.catGroup;
      if (block && groupId) {
        document.querySelectorAll<HTMLElement>(`[data-cat-group="${groupId}"] .subcat-block`).forEach((el) => {
          el.style.display = el === block ? '' : 'none';
        });
        document.querySelectorAll<HTMLElement>(`[data-filter-group="${groupId}"] .filter-chip`).forEach((el) => {
          el.classList.toggle('active', el.dataset.subcat === block.dataset.subcat);
        });
      }

      row.scrollIntoView({ behavior: 'smooth', block: 'center' });
      row.classList.add('search-highlight');
      setTimeout(() => row.classList.remove('search-highlight'), 1800);
    }, 50);
  }

  return (
    <div className="search-nav" ref={rootRef}>
      <div className="search-pill">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        <input
          ref={inputRef}
          type="text"
          className="search-pill-input"
          placeholder="Buscar lavandina, guantes, bolsas..."
          value={query}
          onFocus={() => setFocused(true)}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {open && (
        <div className="search-panel">
          <div className="search-results">
            {results.length === 0 ? (
              <div className="search-empty">Sin resultados para &quot;{query}&quot;.</div>
            ) : (
              results.map((p) => (
                <button key={p.id} type="button" className="search-result" onClick={() => goTo(p)}>
                  <span className="sr-icon">{p.subcategoryIcon || '📦'}</span>
                  <span className="sr-text">
                    <span className="sr-name">{p.name}</span>
                    <span className="sr-meta">
                      {p.cod} · {p.subcategoryName}
                      {p.subcategorySub ? ' · ' + p.subcategorySub : ''}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
