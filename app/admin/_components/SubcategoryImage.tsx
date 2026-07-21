'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { createPublicClient } from '@/lib/supabase/public';
import { createSubcategoryImageUploadUrl, finalizeSubcategoryImage, removeSubcategoryImage } from '../actions';

const MAX_IMAGE_BYTES = 20 * 1024 * 1024;

export default function SubcategoryImage({
  subcategoryId,
  imageUrl,
  showToast,
  refresh,
}: {
  subcategoryId: string;
  imageUrl: string | null;
  showToast: (msg: string, type?: 'success') => void;
  refresh: () => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      showToast('El archivo tiene que ser una imagen');
      return;
    }
    if (file.size > MAX_IMAGE_BYTES) {
      showToast('La imagen no puede pesar más de 20 MB');
      return;
    }

    setBusy(true);
    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const { path, token } = await createSubcategoryImageUploadUrl(subcategoryId, ext);

      // Sube directo del navegador a Supabase Storage: evita el límite fijo
      // de 4.5 MB que Vercel impone al body de cualquier función.
      const supabase = createPublicClient();
      const { error: uploadError } = await supabase.storage
        .from('subcategory-images')
        .uploadToSignedUrl(path, token, file, { contentType: file.type });
      if (uploadError) throw new Error(uploadError.message);

      await finalizeSubcategoryImage(subcategoryId, path);
      showToast('Foto actualizada', 'success');
      refresh();
    } catch (e) {
      showToast(e instanceof Error ? e.message : 'Error al subir la foto');
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  }

  async function handleRemove(e: React.MouseEvent) {
    e.stopPropagation();
    if (!confirm('¿Quitar la foto de esta subcategoría?')) return;
    setBusy(true);
    try {
      await removeSubcategoryImage(subcategoryId);
      showToast('Foto quitada');
      refresh();
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Error al quitar la foto');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="sc-thumb"
      onClick={() => inputRef.current?.click()}
      disabled={busy}
      title={imageUrl ? 'Cambiar foto' : 'Subir foto'}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {imageUrl ? (
        <>
          <Image src={imageUrl} alt="" width={40} height={40} className="sc-thumb-img" />
          <span className="sc-thumb-remove" onClick={handleRemove} title="Quitar foto">✕</span>
        </>
      ) : (
        <span className="sc-thumb-empty">📷</span>
      )}
    </button>
  );
}
