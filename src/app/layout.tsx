import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'VERIFICA — Golpes & Notícias',
  description:
    'Antes de pagar, clicar ou acreditar, verifique. Ferramenta gratuita e sem cadastro para analisar riscos de golpe e desinformação com apoio de Inteligência Artificial.',
  metadataBase: undefined,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#1a6ff2',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
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
