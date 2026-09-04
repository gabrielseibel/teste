# VERIFICA — Golpes & Notícias

> "Antes de pagar, clicar ou acreditar, verifique."

Ferramenta pública, **gratuita e sem cadastro** que ajuda qualquer pessoa no Brasil a avaliar o risco de
golpe em uma situação suspeita, ou a checar se uma notícia/informação é confiável — com apoio de
Inteligência Artificial. Pensada para funcionar bem inclusive para pessoas idosas ou com pouca
familiaridade com tecnologia.

Este é um **MVP funcional de verdade**: frontend, backend, camada de IA (com adapter pronto para
Anthropic/OpenAI), segurança, rate limiting, mascaramento de dados sensíveis e testes automatizados —
tudo já integrado e executável localmente. Quando uma credencial de IA/busca não está configurada, o
sistema **não finge** que a integração existe: ele usa uma análise determinística de fallback, honesta
sobre suas limitações, em vez de simular uma resposta de IA.

---

## Índice

1. [Como funciona](#como-funciona)
2. [Arquitetura](#arquitetura)
3. [Stack tecnológica](#stack-tecnológica)
4. [Instalação](#instalação)
5. [Desenvolvimento](#desenvolvimento)
6. [Testes](#testes)
7. [Deploy](#deploy)
8. [Variáveis de ambiente](#variáveis-de-ambiente)
9. [Segurança](#segurança)
10. [Privacidade](#privacidade)
11. [Limitações conhecidas e próximos passos](#limitações-conhecidas-e-próximos-passos)
12. [Auditoria final do produto](#auditoria-final-do-produto)

---

## Como funciona

A ferramenta tem dois modos, acessíveis direto da página inicial, sem login:

### 🚨 Modo 1 — "Estão tentando me dar um golpe"
O usuário descreve uma mensagem, ligação ou situação suspeita. O sistema:
- identifica táticas conhecidas de golpe (urgência artificial, pedido de código de SMS, falso
  funcionário de banco, golpe do parente, investimento fraudulento, phishing, golpe de marketplace, entre
  [dezenas de outras](src/features/scam-analysis/patterns.ts));
- classifica o risco em 6 níveis (🔴 muito alto → 🟢 sem sinais → ⚪ não foi possível confirmar), nunca
  apenas "é golpe" / "não é golpe";
- explica o porquê de forma simples, com o que fazer agora e o que evitar;
- ativa um **modo de emergência** (🚨 AÇÃO IMEDIATA) quando identifica que a pessoa já perdeu dinheiro,
  compartilhou dados ou está sendo ameaçada;
- faz até 5 perguntas objetivas quando a informação é insuficiente.

### 📰 Modo 2 — "Essa notícia é verdade?"
O usuário cola uma notícia, mensagem de WhatsApp, texto, URL ou print. O sistema:
- identifica a principal afirmação, separa fatos de opinião;
- pesquisa fontes públicas (quando um provedor de busca está configurado) priorizando fontes
  oficiais/primárias, depois jornalísticas, depois fact-checking, depois outras;
- classifica em 5 níveis (🔴 provavelmente falsa → 🔵 confirmada por fontes confiáveis);
- **nunca declara algo como falso apenas por "parecer estranho"** — sem evidência suficiente, a resposta é
  honesta: "Não consegui confirmar essa informação com segurança."

Ambos os modos aceitam texto, um link opcional e uma imagem/print opcional (OCR).

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
    scam-analysis/            # Domínio do Modo 1: types, schema (zod), prompt, catálogo de
                               # táticas, fallback determinístico, orquestração (analyze.ts)
    fake-news/                 # Domínio do Modo 2: idem, + hierarquia de fontes
  services/
    ai/                       # Abstração de provedor de IA (Anthropic/OpenAI) + parsing seguro de JSON
    search/                   # Abstração de provedor de busca (Brave Search / Noop)
    url-analysis/             # Heurística de análise de URL (sem acessar o link)
    image/                    # Validação de upload + OCR (tesseract.js, opcional)
    security/                 # PII masking, rate limiting, sanitização, prompt-injection guard
  lib/                        # Constantes e utilitários compartilhados
tests/                        # Suíte de testes (vitest)
```

Princípios de design:

- **Camada de IA plugável** (`AIProvider`): nada no resto do sistema conhece detalhes de Anthropic ou
  OpenAI. Trocar/adicionar um provedor é implementar uma interface (`services/ai/AIProvider.ts`).
- **Saída sempre estruturada e validada**: a IA responde em JSON; o backend valida contra um schema Zod
  (`features/*/schema.ts`) antes de confiar em qualquer campo. Se a validação falhar, o sistema recorre à
  análise determinística — nunca repassa dados fora do contrato para o usuário.
- **Stateless / sem banco de dados**: não há cadastro, login, nem persistência de relatos. O resultado
  existe apenas durante a sessão do navegador.
- **Catálogo de táticas extensível**: `features/scam-analysis/patterns.ts` é um array de dados — para
  adicionar uma nova tática de golpe basta acrescentar uma entrada, sem alterar nenhuma outra parte do
  sistema.

---

## Stack tecnológica

- **Frontend/Backend**: Next.js 14 (App Router) + TypeScript, React 18
- **UI**: Tailwind CSS + lucide-react
- **Validação**: Zod
- **IA**: `@anthropic-ai/sdk` e `openai`, atrás de uma camada de abstração própria
- **OCR**: `tesseract.js` (dependência opcional, com degradação graciosa)
- **Testes**: Vitest
- **Sem banco de dados** no MVP (por design)

---

## Instalação

Pré-requisitos: Node.js 18+ (recomendado 20+).

```bash
npm install
cp .env.example .env.local
# Edite .env.local e preencha as chaves que você tiver disponíveis (opcional — veja abaixo).
```

O sistema **funciona sem nenhuma chave configurada**: nesse caso, usa a análise determinística de
catálogo em vez de IA generativa e busca externa.

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

Diagnóstico rápido (não expõe segredos): `GET /api/health` informa se um provedor de IA/busca está
configurado.

---

## Testes

```bash
npm run test
```

A suíte cobre, sem depender de rede ou credenciais (o pipeline usa o modo determinístico de fallback nos
testes):

- **Golpes**: falso banco, falso Pix, falso familiar, falso prêmio, falso emprego, investimento
  fraudulento, phishing, marketplace, falso suporte técnico, golpe de WhatsApp, boleto falso, além do modo
  de emergência e da escalada de risco.
- **Notícias**: notícia verdadeira, notícia falsa, notícia antiga como atual, conteúdo fora de contexto,
  manchete verdadeira com texto enganoso, sátira, opinião como fato, informação sem evidência — validando
  que o sistema **nunca inventa fontes nem classifica sem evidência**.
- **Segurança**: prompt injection, XSS, upload inválido, arquivo gigante, URL maliciosa/SSRF (incluindo
  endereço de metadados de nuvem `169.254.169.254`), rate limiting/spam, mascaramento de PII (CPF, e-mail,
  telefone, cartão, chave Pix, código de autenticação).

---

## Deploy

O projeto é compatível com qualquer plataforma que suporte Next.js (App Router com rotas de API em
Node.js runtime):

- **Vercel**: `vercel deploy` (configure as variáveis de ambiente no painel do projeto).
- **Cloudflare / outra infraestrutura Node.js**: `npm run build && npm run start`, configurando as
  variáveis de ambiente do host.

Nunca defina chaves de API como variáveis `NEXT_PUBLIC_*` — todas as chaves deste projeto são lidas
exclusivamente no servidor (rotas `src/app/api/**`).

---

## Variáveis de ambiente

Veja [`.env.example`](.env.example) para a lista completa e comentada. Resumo:

| Variável | Obrigatória? | Efeito se ausente |
|---|---|---|
| `AI_PROVIDER`, `ANTHROPIC_API_KEY` / `OPENAI_API_KEY` | Não | Sistema usa análise determinística por catálogo de padrões, sem IA generativa |
| `BRAVE_SEARCH_API_KEY` | Não | Modo 2 não pesquisa fontes externas; classifica honestamente como "não confirmada" quando não há evidência suficiente |
| `OCR_ENABLED` | Não (padrão `true`) | Se `false` ou se a extração falhar, o usuário é orientado a descrever a imagem em texto |

---

## Segurança

- **Chaves de IA nunca no frontend** — todas as chamadas passam pelo backend (rotas de API).
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
- **Proteção contra prompt injection**: o conteúdo do usuário é sempre tratado como dado, nunca como
  instrução — via separação estrutural (mensagem de sistema própria do provedor de IA), delimitação
  explícita do conteúdo não confiável, e detecção de âncoras comuns de injeção (ver
  `services/security/promptGuard.ts`).
- **Proteção contra alucinação**: saída sempre em JSON validado por schema; a IA é instruída a nunca
  inventar fontes, números, leis ou telefones, e a admitir explicitamente quando não pode confirmar algo.
  Se a validação de schema falhar, o sistema descarta a resposta da IA e usa o fallback determinístico.
- **Headers de segurança e CSP** aplicados globalmente via `next.config.mjs` (CSP, X-Frame-Options,
  X-Content-Type-Options, Referrer-Policy, Permissions-Policy).
- **Timeout e tratamento de erros**: chamadas à IA e à busca têm timeout (30s e 10s) via `AbortController`
  e nunca derrubam a análise — o sistema recorre ao fallback determinístico em caso de falha.

---

## Privacidade

- **Sem cadastro, login ou banco de dados de usuários.**
- **Mascaramento automático de PII** (CPF, CNPJ, RG/CEP, telefone, e-mail, número de cartão, chave Pix,
  código de autenticação) antes de qualquer processamento — ver `services/security/piiMask.ts`.
- Aviso visível antes do envio pedindo para não incluir senhas, códigos completos de autenticação, número
  completo de cartão ou documentos.
- **Nenhum relato é armazenado permanentemente.** O resultado existe apenas durante a sessão do navegador.
- Logs de erro no servidor são mínimos (mensagem técnica genérica), sem conteúdo do relato do usuário.

---

## Limitações conhecidas e próximos passos

- **Rate limiting em memória** é por instância — para deploys com múltiplas instâncias simultâneas,
  trocar por um backend distribuído (a interface já está pronta para isso).
- **OCR** depende da dependência opcional `tesseract.js`, que baixa dados de modelo de idioma na primeira
  execução; em ambientes totalmente offline, o sistema degrada graciosamente pedindo para o usuário
  descrever a imagem em texto.
- **Busca de fontes** usa a Brave Search API como adapter de referência (é fácil obter uma chave
  gratuita); trocar por outro provedor é implementar a interface `SearchProvider`.
- **Análise de URL é puramente heurística** (nunca acessa o link) — uma evolução natural é integrar, por
  trás da mesma interface, um serviço de sandbox de varredura de links (ex.: Google Safe Browsing).
- Nenhuma integração de IA/busca vem "fingida": sem credenciais, o `/api/health` reporta claramente que
  elas não estão configuradas, e as respostas usam o modo determinístico honesto descrito acima.

---

## Auditoria final do produto

Checklist (item 42 do briefing) e como este MVP responde a cada pergunta:

- **Sem cadastro** — sim, nenhuma tela pede nome, e-mail, telefone ou senha.
- **Funciona no celular** — sim, layout mobile-first, testado em breakpoints estreitos.
- **API Key protegida** — sim, toda chamada de IA/busca acontece no backend; nunca em `NEXT_PUBLIC_*`.
- **Diferencia golpe de situação legítima** — a classificação tem 6 níveis (não é binária) e exige
  múltiplos sinais de severidade alta para escalar ao risco máximo.
- **Proteção contra alucinação** — saída sempre validada por schema; fallback honesto quando incerto.
- **Proteção contra prompt injection** — conteúdo do usuário sempre delimitado e tratado como dado.
- **Admite quando não sabe** — respostas "não foi possível confirmar" são tratadas como aceitáveis, não
  como falha.
- **Fontes verificáveis** — toda fonte exibida vem com título, tipo, data (quando disponível) e link.
- **Orienta vítima que já perdeu dinheiro** — modo de emergência dedicado, com passos de contenção.
- **Evita culpabilizar a vítima** — linguagem revisada para nunca usar "você caiu porque...".
- **Evita guardar informações desnecessárias** — sem banco de dados, PII mascarada antes do processamento.
- **Preparado para alta demanda** — rate limiting, timeouts, e fallback determinístico que não depende de
  IA para responder.
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
