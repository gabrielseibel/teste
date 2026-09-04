-- Os relatos de vítimas costumam narrar em discurso indireto/passado
-- ("disse que ERA do banco"), não em citação direta na 1ª pessoa
-- ("sou do banco"). Os padrões abaixo só cobriam a citação direta.
-- Também amplia o pedido de dados pessoais para frases naturais como
-- "precisava dos meus dados", não só imperativos como "confirme seus dados".
--
-- Motivado por caso real reportado: "alguém me chamou dizendo que era do
-- banco e precisava dos meus dados para ajustar" não gerava nenhum sinal
-- antes desta correção.

update public.scam_patterns set
  keywords = ARRAY['(sou|era|é|seria|estava) (do|da) (banco|caixa|ita[uú]|bradesco|santander|nubank)', 'gerente da sua conta', 'central de seguran[çc]a do banco']::text[],
  updated_at = now()
where id = 'falso_funcionario_banco';

update public.scam_patterns set
  keywords = ARRAY['(sou|era|é) (da )?pol[íi]cia', 'delegacia', '(sou|era|é) policial']::text[],
  updated_at = now()
where id = 'falso_policial';

update public.scam_patterns set
  keywords = ARRAY['(sou|era|é) (o |a )?advogad', 'represento juridicamente']::text[],
  updated_at = now()
where id = 'falso_advogado';

update public.scam_patterns set
  keywords = ARRAY['(é|era) a mãe', '(é|era) o pai', '(aqui é|era) (seu |meu )?filho', 'perdi meu celular', 'esse é meu novo n[úu]mero']::text[],
  updated_at = now()
where id = 'falso_familiar';

update public.scam_patterns set
  keywords = ARRAY['me (envia|passa|manda) (seu |o )?cpf', 'n[úu]mero do rg', 'confirme seus dados', '(pediu|pedindo|precisava|precisa|queria|quer|solicitou) (de |dos )?(meus |os )?dados', 'ajustar (meus |os )?dados', 'atualizar (meus |os )?(dados|cadastro)']::text[],
  updated_at = now()
where id = 'pedido_dados_pessoais';
