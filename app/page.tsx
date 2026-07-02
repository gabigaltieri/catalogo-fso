import Image from 'next/image';
import { getCatalog, type Category } from '@/lib/queries';
import NavScrollSync from '@/app/_components/NavScrollSync';

export const revalidate = 30;

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '549XXXXXXXXXX';
const WHATSAPP_MSG = encodeURIComponent('Hola, quiero consultar el catálogo FSO');
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MSG}`;

function bannerClass(color: Category['color']) {
  return color === 'dark' ? 'dark' : color === 'darkred' ? 'darkred' : '';
}

function tableClass(color: Category['color']) {
  return color === 'dark' ? 'dark-head' : color === 'darkred' ? 'darkred-head' : '';
}

function subcatLabel(sc: { name: string; sub: string }) {
  return sc.name + (sc.sub ? ' · ' + sc.sub : '');
}

const WhatsAppIcon = ({ size }: { size: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

export default async function CatalogPage() {
  const categories = await getCatalog();
  const categoriesWithProducts = categories.filter((c) =>
    c.subcategories.some((sc) => sc.products.length > 0)
  );

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <a href="#" className="logo-wrap">
            <div className="logo-fso">F<span>S</span>O</div>
            <div className="logo-info">
              <b>Productos de Limpieza</b>
              <small>Limpieza que brilla en cada rincón</small>
            </div>
          </a>
          <nav className="site-nav">
            {categoriesWithProducts.map((c) => (
              <a key={c.id} href={`#sec-cat-${c.id}`}>{c.name}</a>
            ))}
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="hero-left">
            <div className="hero-eyebrow">Catálogo 2025</div>
            <h1 className="hero-headline">FSO<br /><em>Productos</em><br />de Limpieza</h1>
            <p className="hero-sub">Distribución mayorista de productos de limpieza, higiene institucional y descartables.</p>
          </div>
          <div className="hero-right">
            {categoriesWithProducts.map((c) => (
              <a key={c.id} href={`#sec-cat-${c.id}`} className="hero-cat-card">
                <div className="hcc-icon">{c.icon || '📁'}</div>
                <div className="hcc-text">
                  <div className="hcc-name">{c.name}</div>
                  <div className="hcc-desc">{c.subcategories.map((sc) => sc.name).join(', ')}</div>
                </div>
                <div className="hcc-arrow">→</div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <main>
        {categoriesWithProducts.length === 0 && (
          <div className="empty-catalog">
            <div className="ec-icon">📦</div>
            Todavía no hay productos cargados en el catálogo.
          </div>
        )}

        {categoriesWithProducts.map((cat) => {
          const subcatsWithProducts = cat.subcategories.filter((sc) => sc.products.length > 0);
          const names = subcatsWithProducts.map(subcatLabel);
          const desc = names.length > 4 ? names.slice(0, 4).join(', ') + ' y más.' : names.join(', ') + '.';

          return (
            <div key={cat.id}>
              <div className={`section-banner ${bannerClass(cat.color)}`} id={`sec-cat-${cat.id}`}>
                <div className="sb-inner">
                  <div className="sb-icon">{cat.icon || '📁'}</div>
                  <div className="sb-text">
                    <h2>{cat.name}</h2>
                    <p>{desc}</p>
                  </div>
                </div>
              </div>

              <div className="catalog-wrap">
                {subcatsWithProducts.map((sc) => (
                  <div key={sc.id} className="subcat-block">
                    <div className="subcat-header">
                      <div className="subcat-title-group">
                        <div className="subcat-name">{sc.name}</div>
                        {sc.sub && <div className="subcat-name-alt">{sc.sub}</div>}
                      </div>
                      {sc.imageUrl ? (
                        <div className="cat-photo cat-photo-filled">
                          <Image
                            src={sc.imageUrl}
                            alt={subcatLabel(sc)}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ) : (
                        <div className="cat-photo">
                          <div className="ph-icon">{sc.icon || '📦'}</div>
                          <div className="ph-label">Agregar foto de<br />{subcatLabel(sc)}</div>
                        </div>
                      )}
                    </div>

                    <table className={`prod-table ${tableClass(cat.color)}`}>
                      <thead>
                        <tr>
                          <th>Código</th>
                          <th style={{ width: '26%' }}>Producto</th>
                          <th style={{ width: 155 }}>Presentación</th>
                          <th>Descripción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sc.products.map((p) => (
                          <tr key={p.id}>
                            <td><span className="cod">{p.cod}</span></td>
                            <td className="prod-name">{p.name}</td>
                            <td className="prod-pres">{p.pres}</td>
                            <td className="prod-desc">{p.description}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </main>

      <div className="contact-strip">
        <h2>¿Consultás por precios o disponibilidad?</h2>
        <p>Escribinos directo por WhatsApp y te respondemos a la brevedad.</p>
        <a href={WHATSAPP_URL} className="wa-btn" target="_blank">
          <WhatsAppIcon size={20} />
          Consultar por WhatsApp
        </a>
      </div>

      <footer>
        <div className="ft-logo">F<span>S</span>O</div>
        <p>Productos de Limpieza &nbsp;·&nbsp; Higiene Institucional &nbsp;·&nbsp; Descartables</p>
        <p style={{ fontStyle: 'italic', fontSize: 11, marginTop: 4, color: '#333' }}>
          &quot;Limpieza que brilla en cada rincón&quot;
        </p>
        <nav className="ft-nav">
          {categoriesWithProducts.map((c) => (
            <a key={c.id} href={`#sec-cat-${c.id}`}>{c.name}</a>
          ))}
        </nav>
        <small>© 2025 FSO Productos de Limpieza &nbsp;·&nbsp; Todos los derechos reservados</small>
      </footer>

      <a href={WHATSAPP_URL} className="wa-fab" target="_blank" title="Consultar por WhatsApp">
        <WhatsAppIcon size={30} />
      </a>

      <NavScrollSync />
    </>
  );
}
