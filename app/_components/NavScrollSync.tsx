'use client';

import { useEffect } from 'react';

// Resalta el link de nav correspondiente a la sección visible mientras se
// scrollea. Puro efecto de DOM (igual que el <script> original de
// legacy/catalogo-fso.html) — no necesita estado de React.
export default function NavScrollSync() {
  useEffect(() => {
    const onScroll = () => {
      let current = '';
      document.querySelectorAll<HTMLElement>('.section-banner[id]').forEach((el) => {
        if (window.scrollY >= el.offsetTop - 80) current = el.id;
      });
      document.querySelectorAll('.site-nav a').forEach((a) => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + current);
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return null;
}
