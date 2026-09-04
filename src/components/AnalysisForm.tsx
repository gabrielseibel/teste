'use client';

import { useId, useState } from 'react';
import { ScanSearch } from 'lucide-react';
import { ImageUploadField } from './ImageUploadField';
import { PrivacyNotice } from './PrivacyNotice';

interface AnalysisFormProps {
  textLabel: string;
  textPlaceholder: string;
  examples: string[];
  linkLabel: string;
  linkPlaceholder: string;
  submitLabel: string;
  onSubmit: (values: { text: string; link: string; image: File | null }) => void;
  submitting: boolean;
  errorMessage?: string | null;
}

export function AnalysisForm({
  textLabel,
  textPlaceholder,
  examples,
  linkLabel,
  linkPlaceholder,
  submitLabel,
  onSubmit,
  submitting,
  errorMessage,
}: AnalysisFormProps) {
  const [text, setText] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const textareaId = useId();
  const linkId = useId();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (text.trim().length < 3) return;
    onSubmit({ text: text.trim(), link: link.trim(), image });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div>
        <label htmlFor={textareaId} className="mb-2 block text-lg font-semibold text-slate-900">
          {textLabel}
        </label>
        <textarea
          id={textareaId}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={textPlaceholder}
          rows={7}
          maxLength={8000}
          required
          minLength={3}
          className="w-full rounded-xl border-2 border-slate-300 p-4 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {examples.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => setText((prev) => (prev ? prev : example))}
              className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:border-brand-400 hover:text-brand-700"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor={linkId} className="mb-2 block font-medium text-slate-800">
          {linkLabel}
        </label>
        <input
          id={linkId}
          type="text"
          inputMode="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder={linkPlaceholder}
          maxLength={2048}
          className="w-full rounded-xl border-2 border-slate-300 p-3 text-base text-slate-900 placeholder:text-slate-400 focus:border-brand-500"
        />
      </div>

      <ImageUploadField value={image} onChange={setImage} />

      <PrivacyNotice />

      {errorMessage && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm font-medium text-red-800">
          {errorMessage}
        </p>
      )}

      <button type="submit" className="btn-primary w-full text-lg sm:w-auto" disabled={submitting || text.trim().length < 3}>
        <ScanSearch className="h-5 w-5" aria-hidden="true" />
        {submitting ? 'Analisando...' : submitLabel}
      </button>
    </form>
  );
}
