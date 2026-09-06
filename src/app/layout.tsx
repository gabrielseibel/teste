import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VERIFICA — Golpes & Notícias',
  description:
    'Antes de pagar, clicar ou acreditar, verifique. Ferramenta gratuita e sem cadastro para analisar riscos de golpe e desinformação com base em um catálogo de padrões conhecidos.',
  metadataBase: undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a6ff2',
};

// Site estático (GitHub Pages) — sem servidor, não dá para enviar o cabeçalho
// HTTP `Content-Security-Policy`. Uma tag <meta> cobre a maioria das
// diretivas (fetch/script/style/img/etc.); `frame-ancestors` e outros
// cabeçalhos como X-Frame-Options não têm equivalente em <meta> e ficam de
// fora dessa hospedagem — trade-off aceito ao trocar um host com Node.js
// por um 100% estático e gratuito.
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  // `connect-src` precisa liberar o Supabase (dados) e o CDN de onde o
  // tesseract.js baixa o modelo de OCR (roda só quando alguém anexa imagem).
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://cdn.jsdelivr.net",
  "worker-src 'self' blob:",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
].join('; ');

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <meta httpEquiv="Content-Security-Policy" content={CSP} />
      </head>
      <body className="flex min-h-screen flex-col">
        <a href="#conteudo-principal" className="skip-link">
          Pular para o conteúdo principal
        </a>
        <Header />
        <main id="conteudo-principal" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
