import { extractTextFromImage } from './ocr';
import { validateImageUpload } from './validateUpload';

export interface ProcessedImage {
  ocrText?: string;
  warning?: string;
  error?: string;
}

/**
 * Valida e processa um upload de imagem opcional vindo de um FormData.
 * Nunca lança — erros são retornados no campo `error` para o chamador decidir
 * como responder.
 */
export async function processImageField(file: File | null): Promise<ProcessedImage> {
  if (!file) return {};

  const arrayBuffer = await file.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  const validation = validateImageUpload(bytes, file.type);
  if (!validation.valid) {
    return { error: validation.reason ?? 'Arquivo de imagem inválido.' };
  }

  const ocr = await extractTextFromImage(bytes);
  if (!ocr.available) {
    return { warning: ocr.reason };
  }
  if (!ocr.text) {
    return { warning: 'Não identificamos texto legível nessa imagem. Descreva o conteúdo dela no campo de texto, se possível.' };
  }

  return { ocrText: ocr.text };
}
