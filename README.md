# VERIFICA — Golpes & Notícias

> "Antes de pagar, clicar ou acreditar, verifique."

Ferramenta pública, **gratuita e sem cadastro** que ajuda qualquer pessoa no Brasil a avaliar o risco de
golpe em uma situação suspeita, ou a checar se uma notícia/informação é confiável. Pensada para funcionar
bem inclusive para pessoas idosas ou com pouca familiaridade com tecnologia.

Este é um **MVP funcional de verdade**: frontend, backend, motor de análise, segurança, rate limiting,
mascaramento de dados sensíveis e testes automatizados — tudo já integrado e executável localmente, **sem
nenhum custo de API**.

**O motor de análise é 100% determinístico — não há nenhuma chamada a IA generativa em nenhum lugar do
sistema.** Toda análise compara o conteúdo enviado pelo usuário contra uma base de conhecimento já
conhecida (catálogo de táticas de golpe, domínios oficiais de referência, alegações já verificadas), por
correspondência de padrões e similaridade de texto. Isso é uma escolha de produto deliberada: nenhum risco
de alucinação de IA, nenhum custo por análise, funcionamento previsível e auditável.

---

## Índice

1. [Como funciona](#como-funciona)
2. [Arquitetura](#arquitetura)
3. [Stack tecnológica](#stack-tecnológica)
4. [Instalação](#instalação)
5. [Desenvolvimento](#desenvolvimento)
6. [Testes](#testes)
7. [Deploy](#deploy)
8. [Supabase (base de conhecimento)](#supabase-base-de-conhecimento)
9. [Variáveis de ambiente](#variáveis-de-ambiente)
10. [Segurança](#segurança)
11. [Privacidade](#privacidade)
12. [Limitações conhecidas e próximos passos](#limitações-conhecidas-e-próximos-passos)
13. [Auditoria final do produto](#auditoria-final-do-produto)

---

## Como funciona

A ferramenta tem dois modos, acessíveis direto da página inicial, sem login:

### 🚨 Modo 1 — "Estão tentando me dar um golpe"
O usuário descreve uma mensagem, ligação ou situação suspeita. O sistema:
- compara o relato contra um catálogo de ~35 táticas conhecidas de golpe (urgência artificial, pedido de
  código de SMS, falso funcionário de banco, golpe do parente, investimento fraudulento, phishing, golpe de
  marketplace, entre outras — ver `services/knowledge/staticData.ts` ou a tabela `scam_patterns` no
  Supabase);
- classifica o risco em 6 níveis (🔴 muito alto → 🟢 sem sinais → ⚪ não foi possível confirmar) com base no
  número e na gravidade dos sinais encontrados — nunca apenas "é golpe" / "não é golpe";
- explica o porquê de forma simples, com o que fazer agora e o que evitar;
- ativa um **modo de emergência** (🚨 AÇÃO IMEDIATA) quando identifica frases indicando que a pessoa já
  perdeu dinheiro, compartilhou dados ou está sendo ameaçada;
- faz até 5 perguntas objetivas quando a informação é insuficiente.

### 📰 Modo 2 — "Essa notícia é verdade?"
O usuário cola uma notícia, mensagem de WhatsApp, texto, URL ou print. O sistema:
- compara o conteúdo, por similaridade de texto (trigramas), contra uma base curada de alegações já
  verificadas (padrões de boatos recorrentes documentados por agências brasileiras de fact-checking);
- quando encontra uma correspondência, retorna a classificação, explicação e fontes já registradas para
  aquela alegação;
- detecta sinais de linguagem sensacionalista como sinal de alerta adicional;
- **nunca declara algo como falso apenas por "parecer estranho"** — sem correspondência suficiente na base,
  a resposta é honesta: "Não consegui confirmar essa informação com segurança."

Ambos os modos aceitam texto, um link opcional e uma imagem/print opcional (OCR local, via `tesseract.js`).

---

## Arquitetura

```
src/
  app/                        # Next.js App Router
    page.tsx                  # Home
    golpe/page.tsx            # Fluxo Modo 1 (client component)
    noticia/page.tsx          # Fluxo Modo 2 (client component)
    api/
      analyze/scam/route.ts   # Backend do Modo 1
      analyze/news/route.ts   # Backend do Modo 2
      health/route.ts         # Diagnóstico (sem dados sensíveis)
  components/                 # UI reutilizável e acessível
  features/
    scam-analysis/            # Domínio do Modo 1: types, schema (zod), varredura de padrões
                               # (patterns.ts), montagem do resultado (engine.ts), orquestração (analyze.ts)
    fake-news/                 # Domínio do Modo 2: idem, + detecção de linguagem sensacionalista
  services/
    knowledge/                 # A base de conhecimento — único "provedor de dados" do sistema.
                               # KnowledgeProvider (interface) + SupabaseKnowledgeProvider +
                               # StaticKnowledgeProvider (fallback embutido) + FallbackKnowledgeProvider
                               # (decorator que junta os dois com resiliência a falhas)
    url-analysis/             # Heurística de análise de URL (sem acessar o link)
    image/                    # Validação de upload + OCR (tesseract.js, opcional, roda localmente)
    security/                 # PII masking, rate limiting, sanitização
  lib/                        # Constantes e utilitários compartilhados
supabase/
  migrations/                 # Schema SQL versionado + seeds (tabelas, RLS, função de busca)
tests/                        # Suíte de testes (vitest)
github-pages/                 # Landing page estática de apresentação (ver seção Deploy)
```

Princípios de design:

- **Nenhuma chamada a IA generativa em nenhum lugar do sistema.** O motor de análise é 100%
  determinístico: varredura por padrões (regex) contra o catálogo de golpes, e similaridade de texto
  (trigramas) contra a base de alegações verificadas.
- **Base de conhecimento plugável** (`KnowledgeProvider`): nada no resto do sistema conhece detalhes do
  Supabase. Trocar/adicionar uma fonte de dados é implementar uma interface
  (`services/knowledge/KnowledgeProvider.ts`). O `FallbackKnowledgeProvider` garante que uma falha do
  Supabase (rede, projeto pausado) nunca derruba a análise — ela automaticamente usa os dados estáticos
  embutidos no código.
- **Saída sempre validada por schema**: mesmo sendo construída pelo próprio código (não por uma IA), toda
  resposta passa por validação Zod (`features/*/schema.ts`) como rede de segurança antes de chegar ao
  usuário.
- **Stateless / sem banco de dados de usuários**: não há cadastro, login, nem persistência de relatos. O
  Supabase guarda apenas a base de conhecimento pública (somente leitura para o app), nunca dados de quem
  usa a ferramenta. O resultado de uma análise existe apenas durante a sessão do navegador.
- **Catálogo extensível sem redeploy**: com o Supabase configurado, adicionar uma nova tática de golpe ou
  uma nova alegação verificada é inserir uma linha na tabela — nenhuma mudança de código é necessária.

---

## Stack tecnológica

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript, React 18
- **UI**: Tailwind CSS + lucide-react
- **Validação**: Zod
- **Base de conhecimento**: Supabase (Postgres + `pg_trgm` para busca por similaridade), com fallback
  estático embutido no código — **nenhuma IA generativa em nenhum ponto do sistema**
- **OCR**: `tesseract.js` (dependência opcional, roda localmente via WASM, com degradação graciosa)
- **Testes**: Vitest
- **Sem banco de dados de usuários** (por design) — o único banco existente guarda conhecimento público

---

## Instalação

Pré-requisitos: Node.js 18+ (recomendado 20+).

```bash
npm install
cp .env.example .env.local
# Opcional — veja a seção Supabase abaixo. Sem isso, o app já funciona com dados estáticos.
```

O sistema **funciona sem nenhuma configuração**: nesse caso, usa a base de conhecimento estática embutida
no código (`services/knowledge/staticData.ts`) em vez do Supabase.

---

## Desenvolvimento

```bash
npm run dev
# abre em http://localhost:3000
```

Outros comandos úteis:

```bash
npm run lint        # ESLint (regras do Next.js)
npm run typecheck   # Checagem de tipos TypeScript
npm run test        # Suíte de testes (vitest)
npm run build        # Build de produção
npm run start        # Roda o build de produção localmente
```

Diagnóstico rápido (não expõe segredos): `GET /api/health` informa se o Supabase está configurado e qual
provedor de conhecimento está ativo.

---

## Testes

```bash
npm run test
```

A suíte cobre, sem depender de rede ou credenciais (os testes usam a base de conhecimento estática):

- **Golpes**: falso banco, falso Pix, falso familiar, falso prêmio, falso emprego, investimento
  fraudulento, phishing, marketplace, falso suporte técnico, golpe de WhatsApp, boleto falso, além do modo
  de emergência, da escalada de risco e da influência das respostas de esclarecimento.
- **Notícias**: alegação que corresponde a um boato conhecido, padrão de conteúdo fora de contexto,
  opinião apresentada como fato, informação sem evidência suficiente — validando que o sistema **nunca
  inventa fontes nem classifica sem correspondência na base**.
- **Base de conhecimento**: `StaticKnowledgeProvider`, similaridade de texto por trigramas, e resiliência
  do `FallbackKnowledgeProvider` a falhas do provedor primário.
- **Segurança**: XSS, upload inválido, arquivo gigante, URL maliciosa/SSRF (incluindo endereço de
  metadados de nuvem `169.254.169.254`), rate limiting/spam, mascaramento de PII (CPF, e-mail, telefone,
  cartão, chave Pix, código de autenticação).

---

## Deploy

O projeto é compatível com qualquer plataforma que suporte Next.js (App Router com rotas de API):

- **Netlify**: detecta Next.js automaticamente via `netlify.toml` (usa o `@netlify/plugin-nextjs` oficial,
  que serve as rotas de API como Netlify Functions). Configure `SUPABASE_URL` e `SUPABASE_ANON_KEY` em
  *Site settings → Environment variables* — sem elas, o app funciona normalmente com dados estáticos.
- **Vercel**: `vercel deploy` (configure as variáveis de ambiente no painel do projeto).
- **Cloudflare / outra infraestrutura Node.js**: `npm run build && npm run start`, configurando as
  variáveis de ambiente do host.

Nunca defina chaves como variáveis `NEXT_PUBLIC_*` — todas são lidas exclusivamente no servidor (rotas
`src/app/api/**`). A chave do Supabase usada aqui é a `anon key` pública (protegida por Row Level Security,
somente leitura), não a `service_role key`.

### GitHub Pages (apenas página de apresentação)

O GitHub Pages hospeda somente arquivos estáticos — ele **não** executa o backend Node.js do VERIFICA, então
os modos de análise não funcionam ali. Para quem quiser um link público simples explicando o projeto, o
repositório inclui uma página estática em [`github-pages/index.html`](github-pages/index.html), publicada
automaticamente pelo workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml)
a cada push em `main` que altere essa pasta.

Passo único e manual para ativar (feito uma vez pelo dono do repositório): em **Settings → Pages**, defina
**Source** como **GitHub Actions**.

---

## Supabase (base de conhecimento)

O Supabase é opcional, mas recomendado: ele permite manter o catálogo de táticas de golpe, os domínios
oficiais de referência e a base de alegações verificadas em um banco de dados real — editável a qualquer
momento, sem alterar código nem fazer novo deploy.

### O que é armazenado (e o que não é)

O banco guarda **apenas conhecimento público**, gerenciado por quem administra o projeto:

- `scam_patterns` — catálogo de táticas de golpe (id, rótulo, descrição, severidade, palavras-chave).
- `known_domains` — domínios oficiais de referência (bancos, governo, marketplaces...).
- `fact_checks` — alegações já verificadas (afirmação, classificação, explicação, fontes).

**Nunca é armazenado**: nenhum relato enviado por um usuário, nenhum dado pessoal, nenhum histórico de
análises. Todas as tabelas têm Row Level Security habilitada com uma política de **somente leitura
pública** (`select` em registros ativos) — não existe nenhum endpoint que permita ao app escrever no banco.
Escrita é feita apenas pelo dono do projeto, via SQL Editor ou dashboard do Supabase.

### Como configurar

1. Crie um projeto gratuito em [supabase.com](https://supabase.com) (ou use um que já tenha).
2. No **SQL Editor** do painel, rode as migrations em [`supabase/migrations/`](supabase/migrations/), em
   ordem (`0001_knowledge_base.sql`, `0002_seed_scam_patterns_and_domains.sql`,
   `0003_seed_fact_checks.sql`).
3. Em **Project Settings → API**, copie a **Project URL** e a **anon/public key**.
4. Defina `SUPABASE_URL` e `SUPABASE_ANON_KEY` em `.env.local` (local) ou nas variáveis de ambiente do seu
   host de deploy.

### Como adicionar uma nova tática de golpe ou uma nova alegação verificada

Basta inserir uma linha na tabela correspondente pelo SQL Editor ou pelo Table Editor do Supabase — o app
lê a base de conhecimento a cada análise (com um cache de 5 minutos), então a mudança fica ativa em
minutos, sem redeploy.

---

## Variáveis de ambiente

Veja [`.env.example`](.env.example) para a lista completa e comentada. Resumo:

| Variável | Obrigatória? | Efeito se ausente |
|---|---|---|
| `SUPABASE_URL`, `SUPABASE_ANON_KEY` | Não | Sistema usa a base de conhecimento estática embutida no código, em vez do Supabase |
| `OCR_ENABLED` | Não (padrão `true`) | Se `false` ou se a extração falhar, o usuário é orientado a descrever a imagem em texto |

---

## Segurança

- **Nenhuma IA generativa no sistema** — elimina de forma estrutural toda uma classe de riscos: prompt
  injection (não há prompt para injetar), alucinação de fontes/fatos, e custo variável por requisição.
- **Chave do Supabase nunca no frontend** — todas as consultas passam pelo backend (rotas de API); a chave
  usada é a `anon key` pública, protegida por Row Level Security somente-leitura.
- **Rate limiting** por IP (em memória): limite de análises (10/5min) + anti-burst (30/min). Ver
  `services/security/rateLimit.ts` — a limitação conhecida desse formato em memória (não é uma garantia
  global entre múltiplas instâncias serverless) está documentada no código; a interface `RateLimiter`
  permite trocar por um backend distribuído (ex.: Redis/Upstash) sem alterar as rotas.
- **Validação e sanitização de entrada**: limites de tamanho de texto/URL, remoção de HTML/scripts,
  validação com Zod em todas as rotas.
- **Upload de imagem**: validação por assinatura binária real (magic numbers), não apenas pelo
  `Content-Type` declarado; limite de 5MB; apenas PNG/JPEG/WEBP.
- **Proteção contra SSRF**: o sistema **nunca acessa automaticamente** uma URL informada pelo usuário —
  toda análise de link é feita sobre a string da URL (domínio, HTTPS, Punycode, TLD suspeito, semelhança
  com domínios oficiais conhecidos). Além disso, qualquer validação de URL rejeita hosts privados/locais e
  o endereço de metadados de nuvem (`169.254.169.254`).
- **Resiliência de dados**: se o Supabase estiver indisponível (rede, projeto pausado), o
  `FallbackKnowledgeProvider` recorre automaticamente aos dados estáticos embutidos — a análise nunca fica
  fora do ar por causa de uma falha de infraestrutura externa.
- **Saída sempre validada por schema** (Zod) antes de chegar ao usuário, mesmo sendo construída pelo
  próprio backend.
- **Headers de segurança e CSP** aplicados globalmente via `next.config.mjs` (CSP, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy).

---

## Privacidade

- **Sem cadastro, login ou banco de dados de usuários.**
- **Mascaramento automático de PII** (CPF, CNPJ, RG/CEP, telefone, e-mail, número de cartão, chave Pix,
  código de autenticação) antes de qualquer processamento — ver `services/security/piiMask.ts`.
- Aviso visível antes do envio pedindo para não incluir senhas, códigos completos de autenticação, número
  completo de cartão ou documentos.
- **Nenhum relato é armazenado permanentemente.** O Supabase guarda apenas a base de conhecimento pública
  (táticas de golpe, domínios, alegações verificadas) — nunca o que um usuário envia. O resultado de uma
  análise existe apenas durante a sessão do navegador.
- Logs de erro no servidor são mínimos (mensagem técnica genérica), sem conteúdo do relato do usuário.

---

## Limitações conhecidas e próximos passos

- **Rate limiting em memória** é por instância — para deploys com múltiplas instâncias simultâneas,
  trocar por um backend distribuído (a interface já está pronta para isso).
- **OCR** depende da dependência opcional `tesseract.js`, que baixa dados de modelo de idioma na primeira
  execução; em ambientes totalmente offline, o sistema degrada graciosamente pedindo para o usuário
  descrever a imagem em texto.
- **O Modo 2 só reconhece o que já está na base de alegações verificadas.** Sem IA generativa nem busca em
  tempo real, uma notícia genuinamente nova (que ainda não foi adicionada à base) sempre retorna "não
  confirmada" — o que é o comportamento honesto pretendido, mas significa que a cobertura cresce apenas à
  medida que a base é curada e ampliada (ver [Supabase](#supabase-base-de-conhecimento) acima).
- **Análise de URL é puramente heurística** (nunca acessa o link) — uma evolução natural é integrar, por
  trás da mesma interface, um serviço de sandbox de varredura de links (ex.: Google Safe Browsing).
- A interface `KnowledgeProvider` foi desenhada para permitir, no futuro, plugar outra fonte de dados (por
  exemplo, uma API de fact-checking) sem alterar o restante do sistema — mas isso está fora do escopo
  deste MVP, que é deliberadamente autônomo e sem custo de API externa.

---

## Auditoria final do produto

Checklist (item 42 do briefing) e como este MVP responde a cada pergunta:

- **Sem cadastro** — sim, nenhuma tela pede nome, e-mail, telefone ou senha.
- **Funciona no celular** — sim, layout mobile-first, testado em breakpoints estreitos.
- **Credenciais protegidas** — sim, a chave do Supabase (pública, somente-leitura) só é lida no backend;
  nunca em `NEXT_PUBLIC_*`.
- **Diferencia golpe de situação legítima** — a classificação tem 6 níveis (não é binária) e exige
  múltiplos sinais de severidade alta para escalar ao risco máximo.
- **Proteção contra alucinação** — não há IA generativa; toda resposta vem de correspondência com uma base
  de conhecimento real, validada por schema antes de chegar ao usuário.
- **Sem risco de prompt injection** — não há nenhum prompt de IA no sistema para ser manipulado.
- **Admite quando não sabe** — respostas "não foi possível confirmar" são tratadas como aceitáveis, não
  como falha.
- **Fontes verificáveis** — toda fonte exibida vem com título, tipo, data (quando disponível) e link.
- **Orienta vítima que já perdeu dinheiro** — modo de emergência dedicado, com passos de contenção.
- **Evita culpabilizar a vítima** — linguagem revisada para nunca usar "você caiu porque...".
- **Evita guardar informações desnecessárias** — sem banco de dados de usuários; o único banco (opcional)
  guarda apenas conhecimento público; PII mascarada antes do processamento.
- **Preparado para alta demanda** — rate limiting, e um motor determinístico (sem chamadas de IA) que
  responde em milissegundos e não tem custo variável por requisição.
- **Compreensível para idosos** — linguagem simples, botões grandes, contraste alto, poucas perguntas por
  vez, foco visível para navegação por teclado.
- **Resultados acionáveis** — toda análise inclui "o que fazer agora", "o que não fazer" e "como confirmar
  por conta própria".

---

## Aviso legal

Esta ferramenta fornece uma análise automatizada para ajudar na tomada de decisão. Ela não substitui
orientação profissional, investigação oficial ou confirmação diretamente com a instituição envolvida. Em
casos de risco financeiro ou criminal, procure os canais oficiais adequados. Em caso de perigo imediato,
procure ajuda e os serviços de emergência apropriados sem demora.
