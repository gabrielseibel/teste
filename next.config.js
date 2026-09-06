/** @type {import('next').NextConfig} */
// O VERIFICA é publicado como site 100% estático no GitHub Pages — não há
// servidor Next.js em produção, então não é possível usar Route Handlers,
// middleware, otimização de imagem sob demanda nem o `headers()` do Next
// (GitHub Pages não permite configurar cabeçalhos HTTP de resposta; a
// política de segurança de conteúdo é aplicada via <meta> em layout.tsx,
// que cobre a maior parte das diretivas — X-Frame-Options e afins não têm
// equivalente em <meta> e ficam de fora nesse tipo de hospedagem).
//
// `GITHUB_PAGES_BASE_PATH` é definido apenas pelo workflow de deploy
// (.github/workflows/deploy-pages.yml), com o nome do repositório — o site
// é publicado em `https://<usuário>.github.io/<repositório>/`. Em
// desenvolvimento local e em outros hosts (Vercel, Netlify, etc.) a
// variável fica vazia e o app roda normalmente na raiz.
const basePath = process.env.GITHUB_PAGES_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  trailingSlash: true,
  reactStrictMode: true,
  poweredByHeader: false,
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
