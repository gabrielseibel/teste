# VERIFICA — Golpes & Notícias

> "Antes de pagar, clicar ou acreditar, verifique."

Ferramenta pública, **gratuita e sem cadastro** que ajuda qualquer pessoa no Brasil a avaliar o risco de
golpe em uma situação suspeita, ou a checar se uma notícia/informação é confiável. Pensada para funcionar
bem inclusive para pessoas idosas ou com pouca familiaridade com tecnologia.

🔗 **Site no ar:** publicado no GitHub Pages a partir da branch `main` (ver seção "Deploy" abaixo para a URL
exata do seu fork/repositório).

## Arquitetura: 100% estático, sem backend próprio

O VERIFICA **não tem servidor**: é um site estático (`next build` com `output: 'export'`) hospedado
gratuitamente no GitHub Pages. Todo o motor de análise roda **no navegador de quem usa**, e a única chamada
de rede em tempo de uso é direta ao [Supabase](https://supabase.com) (Postgres), para buscar a base de
conhecimento pública (catálogo de táticas de golpe, domínios oficiais, alegações já verificadas).

```
Navegador (GitHub Pages)  ──leitura pública (RLS)──▶  Supabase (Postgres)
        │
        └─ motor de análise determinístico roda aqui mesmo
```

**O motor de análise é 100% determinístico — não há nenhuma chamada a IA generativa em nenhum lugar do
sistema, nem custo por análise.** Toda análise compara o conteúdo enviado pela pessoa contra a base de
conhecimento conhecida, por correspondência de padrões (regex) e similaridade de texto (trigramas). Isso é
uma escolha de produto deliberada: nenhum risco de alucinação de IA, funcionamento previsível e auditável, e
gratuito para sempre — sem chave de API para pagar.

Se o Supabase não estiver configurado (ou estiver fora do ar), o app cai automaticamente para uma base de
conhecimento **estática, embutida no próprio código** (`src/services/knowledge/staticData.ts`) — o site
nunca fica sem funcionar por causa do banco de dados.

### Por que não há mais rate limiting no código

Versões anteriores deste projeto tinham rotas de API (Next.js) com rate limiting por IP. Como o site agora
roda inteiramente no navegador — sem nenhum servidor próprio —, essa camada deixou de existir: não há mais
nada rodando "no meio" para contar requisições. A proteção contra abuso passa a ser responsabilidade do
próprio Supabase (limites de uso do projeto, como em qualquer app que fala diretamente com um
backend-as-a-service). Isso é o mesmo modelo de segurança de qualquer aplicativo mobile ou SPA que usa uma
chave pública de um BaaS — a chave do Supabase usada aqui é a "anon/publishable key", protegida por Row
Level Security (RLS): somente leitura de registros ativos, nenhuma escrita exposta.

## Funcionalidades

- **Dois modos de análise**: "Estão tentando me dar um golpe?" e "Essa notícia é verdade?".
- **Risco em níveis, nunca binário**: `muito_alto` / `alto` / `moderado` / `baixo` / `sem_sinais` /
  `nao_confirmado` para golpes; 5 níveis de classificação para notícias, sempre com nível de confiança.
- **Explicações acionáveis**: o que fazer agora, o que evitar, como verificar por conta própria.
- **Modo de emergência**: detecta quando a pessoa já sofreu dano (já fez um Pix, já passou uma senha) e
  prioriza ações imediatas.
- **Perguntas de esclarecimento** quando não há sinais suficientes para uma conclusão confiável.
- **OCR de imagens no navegador** (prints de WhatsApp, SMS, boletos) via `tesseract.js` — a imagem nunca sai
  do dispositivo da pessoa; só o texto extraído entra na análise.
- **Mascaramento de dados sensíveis** (CPF, e-mail, telefone) antes de qualquer processamento.
- **Acessível** (WCAG): navegação por teclado, leitura de tela, contraste adequado.
- **100% em português**, pensado para o contexto brasileiro.

## Rodando localmente

```bash
npm install
npm run dev
```

Abre em `http://localhost:3000`. Funciona imediatamente, sem nenhuma configuração — usa a base de
conhecimento estática embutida por padrão.

```bash
npm run build   # gera o export estático em ./out
npm run start   # serve ./out localmente (equivalente ao GitHub Pages)
npm run test    # testes automatizados (vitest)
npm run lint
npm run typecheck
```

## Configuração (opcional)

Veja [`.env.example`](.env.example). Sem nenhuma variável configurada, o app já funciona por completo
(base de conhecimento estática). O build de produção usado no GitHub Pages vem com um projeto Supabase já
configurado em [`.env.production`](.env.production) — os valores ali são intencionalmente públicos (URL e
chave pública, protegidas por Row Level Security), então nenhum segredo é necessário para publicar o site.

## Base de conhecimento (Supabase)

O schema completo (tabelas, RLS, extensões, seed de dados) está versionado em
[`supabase/migrations/`](supabase/migrations/), em ordem. Para usar seu próprio projeto Supabase:

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Rode as migrations em ordem (SQL Editor do painel, ou `supabase db push` com a CLI).
3. Copie a URL e a chave pública em *Project Settings → API* para `.env.local` (ver `.env.example`) — ou
   para `.env.production.local` se for gerar seu próprio build de produção.

Passar a manter os dados no Supabase (em vez de só no código estático) permite adicionar novas táticas de
golpe, domínios ou alegações verificadas diretamente no banco, sem precisar alterar código ou fazer um novo
deploy.

## Deploy

### GitHub Pages (recomendado — é como este repositório é publicado)

Já configurado em [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml): todo push em
`main` roda os testes, gera o export estático e publica em
`https://<usuário>.github.io/<repositório>/`.

Pré-requisito único (manual, uma vez): em *Settings → Pages* deste repositório, definir **Source** como
**"GitHub Actions"**.

### Alternativas

Como a saída do build (`./out`) é um site estático puro, ele pode ser publicado em qualquer host de
arquivos estáticos — Netlify (ver [`netlify.toml`](netlify.toml)), Vercel, Cloudflare Pages, etc. — sem
nenhuma mudança de código.

## Estrutura do projeto

```
src/
  app/                 páginas (Next.js App Router): home, /golpe, /noticia
  components/          componentes de UI reutilizáveis
  features/
    scam-analysis/     motor de análise de golpes (patterns, engine, schema)
    fake-news/         motor de fact-checking (engine, red flags, schema)
  services/
    knowledge/         provedores da base de conhecimento (Supabase / estático / fallback)
    security/          mascaramento de PII, sanitização de texto, validação de URL
    image/             validação de upload e OCR (roda no navegador)
    url-analysis/      heurísticas de link suspeito (sem nunca acessar a URL)
  lib/
    analysisClient.ts  orquestra sanitização + OCR + motor de análise no navegador
supabase/
  migrations/          schema, RLS e seed da base de conhecimento (versionado)
tests/                 testes automatizados (vitest)
```

## Limitações conhecidas e trade-offs

- **Cabeçalhos de segurança HTTP**: o GitHub Pages não permite configurar cabeçalhos de resposta
  personalizados. A Content-Security-Policy é aplicada via `<meta>` em `src/app/layout.tsx`, que cobre a
  maior parte das diretivas — mas `X-Frame-Options` e diretivas equivalentes não têm alternativa em
  `<meta>` e ficam de fora nessa hospedagem.
- **Rate limiting**: ver seção "Por que não há mais rate limiting no código" acima.
- **A base de conhecimento não é exaustiva**: o VERIFICA nunca afirma "isso definitivamente é/não é golpe" —
  sempre expressa um nível de risco/confiança e recomenda os canais oficiais para confirmação. Ausência de
  sinais no catálogo não é garantia de segurança.

## Aviso legal

O VERIFICA é uma ferramenta de apoio à decisão, não um veredito definitivo. Em casos de risco financeiro ou
criminal, procure os canais oficiais adequados (seu banco, a plataforma envolvida, ou a autoridade
competente). Se você estiver em perigo imediato, procure ajuda e os serviços de emergência apropriados sem
demora.
