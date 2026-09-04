/**
 * Adapter de OCR (extração de texto de imagens — prints de WhatsApp, SMS,
 * e-mails, anúncios, comprovantes).
 *
 * Implementado com `tesseract.js` (dependência opcional). Se o pacote não
 * estiver instalado, ou se a inicialização falhar (por exemplo, sem acesso
 * de rede para baixar os dados do modelo de linguagem na primeira execução),
 * o sistema degrada graciosamente: informa ao usuário que o OCR está
 * indisponível no momento e pede para descrever o conteúdo da imagem em
 * texto — a análise de golpe/notícia continua funcionando normalmente a
 * partir da descrição.
 */

export interface OcrResult {
  available: boolean;
  text: string;
  reason?: string;
}

export async function extractTextFromImage(bytes: Uint8Array): Promise<OcrResult> {
  if (process.env.OCR_ENABLED === 'false') {
    return { available: false, text: '', reason: 'OCR desativado nesta implantação.' };
  }

  try {
    // Import dinâmico: mantém o pacote como dependência opcional e evita
    // custo de bundle quando OCR não é usado.
    const { createWorker } = await import('tesseract.js');
    const worker = await createWorker('por');
    try {
      const {
        data: { text },
      } = await worker.recognize(Buffer.from(bytes));
      return { available: true, text: text.trim() };
    } finally {
      await worker.terminate();
    }
  } catch (err) {
    return {
      available: false,
      text: '',
      reason:
        'Não foi possível processar a imagem automaticamente neste ambiente. Descreva o que a imagem mostra no campo de texto para continuarmos a análise.',
    };
  }
}
