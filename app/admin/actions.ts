'use server';

import { revalidatePath } from 'next/cache';
import { createServiceClient } from '@/lib/supabase/server';
import type { BannerColor } from '@/lib/database.types';

function refresh() {
  revalidatePath('/');
  revalidatePath('/admin');
}

export type ProductInput = {
  subcategoryId: string;
  cod: string;
  name: string;
  pres: string;
  description: string;
};

export async function createProduct(input: ProductInput) {
  if (!input.subcategoryId) throw new Error('Seleccioná una subcategoría');
  if (!input.name.trim()) throw new Error('El nombre es obligatorio');
  if (!input.cod.trim()) throw new Error('El código es obligatorio');

  const supabase = createServiceClient();
  const { error } = await supabase.from('products').insert({
    subcategory_id: input.subcategoryId,
    cod: input.cod.trim(),
    name: input.name.trim(),
    pres: input.pres.trim(),
    description: input.description.trim(),
  });
  if (error) throw new Error(error.message);
  refresh();
}

export async function updateProduct(id: string, input: ProductInput) {
  if (!input.subcategoryId) throw new Error('Seleccioná una subcategoría');
  if (!input.name.trim()) throw new Error('El nombre es obligatorio');
  if (!input.cod.trim()) throw new Error('El código es obligatorio');

  const supabase = createServiceClient();
  const { error } = await supabase
    .from('products')
    .update({
      subcategory_id: input.subcategoryId,
      cod: input.cod.trim(),
      name: input.name.trim(),
      pres: input.pres.trim(),
      description: input.description.trim(),
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteProduct(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

export type CategoryInput = { name: string; icon: string; color: BannerColor };

export async function createCategory(input: CategoryInput) {
  if (!input.name.trim()) throw new Error('El nombre es obligatorio');

  const supabase = createServiceClient();
  const { count } = await supabase.from('categories').select('*', { count: 'exact', head: true });
  const { error } = await supabase.from('categories').insert({
    name: input.name.trim(),
    icon: input.icon.trim() || '📁',
    color: input.color,
    sort_order: count ?? 0,
  });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteCategory(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}

export type SubcategoryInput = { categoryId: string; name: string; sub: string; icon: string };

export async function createSubcategory(input: SubcategoryInput) {
  if (!input.categoryId) throw new Error('Seleccioná una categoría padre');
  if (!input.name.trim()) throw new Error('El nombre es obligatorio');

  const supabase = createServiceClient();
  const { count } = await supabase.from('subcategories').select('*', { count: 'exact', head: true });
  const { error } = await supabase.from('subcategories').insert({
    category_id: input.categoryId,
    name: input.name.trim(),
    sub: input.sub.trim(),
    icon: input.icon.trim() || '📦',
    sort_order: count ?? 0,
  });
  if (error) throw new Error(error.message);
  refresh();
}

export async function deleteSubcategory(id: string) {
  const supabase = createServiceClient();
  const { error } = await supabase.from('subcategories').delete().eq('id', id);
  if (error) throw new Error(error.message);
  refresh();
}
