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

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export async function uploadSubcategoryImage(subcategoryId: string, formData: FormData) {
  const file = formData.get('file');
  if (!(file instanceof File) || file.size === 0) throw new Error('Elegí una imagen');
  if (!file.type.startsWith('image/')) throw new Error('El archivo tiene que ser una imagen');
  if (file.size > MAX_IMAGE_BYTES) throw new Error('La imagen no puede pesar más de 20 MB');

  const supabase = createServiceClient();
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  // Nombre de archivo único por subida: evita tener que limpiar la imagen
  // vieja del bucket (queda huérfana, costo de storage insignificante a
  // esta escala) y evita problemas de caché de navegador con la URL nueva.
  const path = `${subcategoryId}/${Date.now()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from('subcategory-images')
    .upload(path, file, { contentType: file.type });
  if (uploadError) throw new Error(uploadError.message);

  const { data: pub } = supabase.storage.from('subcategory-images').getPublicUrl(path);

  const { error } = await supabase
    .from('subcategories')
    .update({ image_url: pub.publicUrl })
    .eq('id', subcategoryId);
  if (error) throw new Error(error.message);
  refresh();
}

export async function removeSubcategoryImage(subcategoryId: string) {
  const supabase = createServiceClient();
  const { error } = await supabase
    .from('subcategories')
    .update({ image_url: null })
    .eq('id', subcategoryId);
  if (error) throw new Error(error.message);
  refresh();
}
