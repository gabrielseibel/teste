-- Calibração empírica: com a base de alegações maior (52+ entradas), o
-- limiar anterior (0.2) passou a gerar falso positivo por coincidência de
-- palavras comuns do português entre textos sem nenhuma relação temática
-- (ex.: "governo", "está", "não"). Correspondências reais (mesma alegação
-- parafraseada) tipicamente pontuam 0.4+; o novo limiar de 0.35 mantém uma
-- margem de segurança confortável dos dois lados. Ver também
-- src/features/fake-news/analyze.ts (MIN_SIMILARITY) e
-- src/services/knowledge/StaticKnowledgeProvider.ts (DEFAULT_MIN_SIMILARITY),
-- que foram calibrados com o mesmo valor.
create or replace function public.match_fact_checks(
  query text,
  min_similarity float default 0.35,
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
