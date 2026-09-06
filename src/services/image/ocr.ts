/**
 * Adapter de OCR (extração de texto de imagens — prints de WhatsApp, SMS,
 * e-mails, anúncios, comprovantes).
 *
 * Roda inteiramente no navegador de quem usa o VERIFICA, via `tesseract.js`
 * (WebAssembly) — a imagem enviada nunca sai do dispositivo da pessoa; só o
 * texto extraído dela é usado na análise (que também roda no navegador). Se
 * a inicialização falhar (por exemplo, sem acesso de rede para baixar os
 * dados do modelo de idioma na primeira execução), o sistema degrada
 * graciosamente: informa que o OCR está indisponível no momento e pede para
 * descrever o conteúdo da imagem em texto — a análise continua funcionando
 * normalmente a partir da descrição.
 */

export interface OcrResult {
  available: boolean;
  text: string;
  reason?: string;
}

export async function extractTextFromImage(file: File): Promise<OcrResult> {
  if (process.env.NEXT_PUBLIC_OCR_ENABLED === 'false') {
    return { available: false, text: '', reason: 'OCR desativado nesta implantação.' };
  }

  try {
    // Import dinâmico: mantém o pacote fora do bundle inicial (só é
    // baixado quando alguém de fato anexa uma imagem).
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('por');
    try {
      const {
        data: { text },
      } = await worker.recognize(file);
      return { available: true, text: text.trim() };
    } finally {
      await worker.terminate();
    }
  } catch {
    return {
      available: false,
      text: '',
      reason:
        'Não foi possível processar a imagem automaticamente neste navegador. Descreva o que a imagem mostra no campo de texto para continuarmos a análise.',
    };
  }
}
