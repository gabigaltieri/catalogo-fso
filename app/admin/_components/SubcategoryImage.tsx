'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { removeSubcategoryImage, uploadSubcategoryImage } from '../actions';

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
    setBusy(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      await uploadSubcategoryImage(subcategoryId, formData);
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
