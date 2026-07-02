import { createPublicClient } from '@/lib/supabase/public';
import type { BannerColor } from '@/lib/database.types';

export type Product = {
  id: string;
  cod: string;
  name: string;
  pres: string;
  description: string;
};

export type Subcategory = {
  id: string;
  categoryId: string;
  name: string;
  sub: string;
  icon: string;
  imageUrl: string | null;
  products: Product[];
};

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: BannerColor;
  subcategories: Subcategory[];
};

export type FlatProduct = Product & {
  subcategoryId: string;
  subcategoryName: string;
  subcategorySub: string;
  subcategoryIcon: string;
  categoryId: string;
  categoryName: string;
};

// Aplana el árbol categorías->subcategorías->productos para la tabla de
// "Editar Productos" del admin (búsqueda/filtro) y el modal de edición.
// No pega contra la base — solo reordena datos ya traídos por getCatalog().
export function flattenProducts(categories: Category[]): FlatProduct[] {
  const rows: FlatProduct[] = [];
  categories.forEach((cat) => {
    cat.subcategories.forEach((sc) => {
      sc.products.forEach((p) => {
        rows.push({
          ...p,
          subcategoryId: sc.id,
          subcategoryName: sc.name,
          subcategorySub: sc.sub,
          subcategoryIcon: sc.icon,
          categoryId: cat.id,
          categoryName: cat.name,
        });
      });
    });
  });
  return rows;
}

// Trae categorías, subcategorías y productos en 3 queries en paralelo
// (en vez de un join anidado) y los arma en memoria — simple y suficiente
// para el volumen de datos de este catálogo (decenas de productos, no miles).
export async function getCatalog(): Promise<Category[]> {
  const supabase = createPublicClient();

  const [catsRes, subcatsRes, prodsRes] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('subcategories').select('*').order('sort_order'),
    supabase.from('products').select('*').order('sort_order'),
  ]);

  if (catsRes.error) throw catsRes.error;
  if (subcatsRes.error) throw subcatsRes.error;
  if (prodsRes.error) throw prodsRes.error;

  const cats = catsRes.data ?? [];
  const subcats = subcatsRes.data ?? [];
  const prods = prodsRes.data ?? [];

  return cats.map((cat) => ({
    id: cat.id,
    name: cat.name,
    icon: cat.icon,
    color: cat.color,
    subcategories: subcats
      .filter((sc) => sc.category_id === cat.id)
      .map((sc) => ({
        id: sc.id,
        categoryId: sc.category_id,
        name: sc.name,
        sub: sc.sub,
        icon: sc.icon,
        imageUrl: sc.image_url,
        products: prods
          .filter((p) => p.subcategory_id === sc.id)
          .map((p) => ({
            id: p.id,
            cod: p.cod,
            name: p.name,
            pres: p.pres,
            description: p.description,
          })),
      })),
  }));
}
