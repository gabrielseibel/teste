-- VERIFICA — Golpes & Notícias
-- Base de conhecimento pública, somente-leitura para o app (RLS), usada pelo
-- motor determinístico de análise (sem IA generativa). Escrita fica restrita
-- ao service role / dashboard do Supabase — não há endpoint público de escrita.

create extension if not exists pg_trgm with schema extensions;

-- ---------------------------------------------------------------------------
-- scam_patterns: catálogo de táticas conhecidas de golpe (Modo 1)
-- ---------------------------------------------------------------------------
create table if not exists public.scam_patterns (
  id text primary key,
  label text not null,
  description text not null,
  severity text not null check (severity in ('alto', 'medio', 'baixo')),
  category text not null,
  keywords text[] not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.scam_patterns is
  'Catálogo extensível de táticas de golpe conhecidas. keywords são padrões regex (JS, flag "i") aplicados ao relato do usuário.';

-- ---------------------------------------------------------------------------
-- known_domains: domínios oficiais de instituições comumente usadas em golpes
-- ---------------------------------------------------------------------------
create table if not exists public.known_domains (
  id bigint generated always as identity primary key,
  domain text not null unique,
  category text not null,
  created_at timestamptz not null default now()
);

comment on table public.known_domains is
  'Domínios oficiais de referência, usados para detectar links "parecidos" (typosquatting) na análise de URL.';

-- ---------------------------------------------------------------------------
-- fact_checks: base curada de alegações já verificadas (Modo 2)
-- ---------------------------------------------------------------------------
create table if not exists public.fact_checks (
  id bigint generated always as identity primary key,
  claim text not null,
  classification text not null check (
    classification in (
      'provavelmente_falsa',
      'enganosa_fora_de_contexto',
      'nao_confirmada',
      'provavelmente_verdadeira',
      'confirmada_por_fontes'
    )
  ),
  explanation text not null,
  red_flags text[] not null default '{}',
  how_to_verify text[] not null default '{}',
  source_title text,
  source_url text,
  source_type text check (source_type in ('oficial', 'jornalistico', 'fact_checking', 'outra')),
  source_date text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

comment on table public.fact_checks is
  'Base curada de alegações já verificadas. O motor compara o texto enviado pelo usuário contra "claim" por similaridade de trigramas (pg_trgm); sem correspondência suficiente, a resposta é honestamente "não confirmada".';

-- Índice trigram para busca por similaridade em claim (case-insensitive).
create index if not exists fact_checks_claim_trgm_idx
  on public.fact_checks
  using gin (lower(claim) extensions.gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- RLS: leitura pública de registros ativos, sem escrita pública.
-- ---------------------------------------------------------------------------
alter table public.scam_patterns enable row level security;
alter table public.known_domains enable row level security;
alter table public.fact_checks enable row level security;

create policy "scam_patterns são públicos para leitura (somente ativos)"
  on public.scam_patterns for select
  to anon, authenticated
  using (active = true);

create policy "known_domains são públicos para leitura"
  on public.known_domains for select
  to anon, authenticated
  using (true);

create policy "fact_checks são públicos para leitura (somente ativos)"
  on public.fact_checks for select
  to anon, authenticated
  using (active = true);

-- ---------------------------------------------------------------------------
-- match_fact_checks: função de busca por similaridade (RPC chamada pelo app)
-- ---------------------------------------------------------------------------
create or replace function public.match_fact_checks(
  query text,
  min_similarity float default 0.2,
  match_count int default 3
)
returns table (
  id bigint,
  claim text,
  classification text,
  explanation text,
  red_flags text[],
  how_to_verify text[],
  source_title text,
  source_url text,
  source_type text,
  source_date text,
  similarity float
)
language sql
stable
security invoker
set search_path = public, extensions
as $$
  select
    fc.id,
    fc.claim,
    fc.classification,
    fc.explanation,
    fc.red_flags,
    fc.how_to_verify,
    fc.source_title,
    fc.source_url,
    fc.source_type,
    fc.source_date,
    similarity(lower(fc.claim), lower(query)) as similarity
  from public.fact_checks fc
  where fc.active = true
    and similarity(lower(fc.claim), lower(query)) >= min_similarity
  order by similarity desc
  limit match_count;
$$;

grant execute on function public.match_fact_checks(text, float, int) to anon, authenticated;
