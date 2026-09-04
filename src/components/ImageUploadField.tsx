'use client';

import { useRef, useState } from 'react';
import { ImagePlus, X } from 'lucide-react';

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPTED = ['image/png', 'image/jpeg', 'image/webp'];

export function ImageUploadField({
  value,
  onChange,
  error,
}: {
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  function handleFile(file: File | null) {
    setLocalError(null);
    if (!file) {
      onChange(null);
      return;
    }
    if (!ACCEPTED.includes(file.type)) {
      setLocalError('Envie uma imagem PNG, JPEG ou WEBP.');
      onChange(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError('A imagem deve ter no máximo 5MB.');
      onChange(null);
      return;
    }
    onChange(file);
  }

  return (
    <div>
      <label htmlFor="image-upload" className="mb-2 block font-medium text-slate-800">
        📷 Enviar print (opcional)
      </label>
      {!value ? (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 px-4 py-6 text-sm font-medium text-slate-500 hover:border-brand-400 hover:text-brand-600"
        >
          <ImagePlus className="h-5 w-5" aria-hidden="true" />
          Toque para anexar uma imagem (PNG, JPEG ou WEBP, até 5MB)
        </button>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
          <span className="truncate text-slate-700">{value.name}</span>
          <button
            type="button"
            onClick={() => handleFile(null)}
            className="ml-3 shrink-0 rounded-full p-1 text-slate-500 hover:bg-slate-200"
            aria-label="Remover imagem"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      )}
      <input
        ref={inputRef}
        id="image-upload"
        type="file"
        accept={ACCEPTED.join(',')}
        className="sr-only"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />
      {(localError || error) && <p className="mt-1 text-sm text-red-600">{localError ?? error}</p>}
    </div>
  );
}
