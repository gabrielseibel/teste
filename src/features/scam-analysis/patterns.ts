/**
 * Catálogo de táticas de golpe conhecidas.
 *
 * Esta é a base de um DETECTOR DETERMINÍSTICO (regras/keywords), usado em
 * duas frentes:
 *   1. Como "pré-varredura" cujo resultado é enviado à IA como pistas
 *      objetivas (grounding), reduzindo alucinação e dando à IA sinais
 *      concretos para justificar a conclusão.
 *   2. Como fallback autônomo quando nenhum provedor de IA está configurado
 *      (MockProvider), permitindo que o sistema funcione localmente sem
 *      credenciais.
 *
 * Extensibilidade: para adicionar uma nova tática, basta acrescentar uma
 * entrada a este array — nenhuma outra parte do sistema precisa ser
 * alterada ou reconstruída. Em uma evolução futura, este array pode ser
 * substituído por uma fonte de dados externa (JSON remoto, banco, CMS) sem
 * mudar a interface consumida pelo restante do código.
 */

export type PatternCategory =
  | 'pressao_psicologica'
  | 'pedido_de_dados_ou_dinheiro'
  | 'identidade_falsa'
  | 'canal_e_link'
  | 'financeiro'
  | 'contexto_especifico';

export interface ScamPatternDef {
  id: string;
  label: string;
  description: string;
  severity: 'alto' | 'medio' | 'baixo';
  category: PatternCategory;
  keywords: RegExp[];
}

const kw = (...words: string[]): RegExp[] => words.map((w) => new RegExp(w, 'i'));

export const SCAM_PATTERNS: ScamPatternDef[] = [
  // ---- Pressão psicológica ----
  {
    id: 'urgencia_artificial',
    label: 'Urgência artificial',
    description: 'Criam senso de urgência para impedir que você pense com calma ou confirme com outra pessoa.',
    severity: 'alto',
    category: 'pressao_psicologica',
    keywords: kw('urgente', 'imediatamente', 'agora mesmo', 'últimos minutos', 'expira hoje', 'até às \\d', 'em \\d+ minutos'),
  },
  {
    id: 'ameaca',
    label: 'Ameaça',
    description: 'Uso de ameaças (bloqueio, multa, prisão, corte de serviço) para gerar medo.',
    severity: 'alto',
    category: 'pressao_psicologica',
    keywords: kw('será bloquead', 'conta será encerrada', 'você será preso', 'ação judicial', 'processo criminal', 'multa de', 'suspens[ãa]o'),
  },
  {
    id: 'medo',
    label: 'Indução de medo',
    description: 'Mensagem construída para provocar pânico e reduzir a capacidade de análise crítica.',
    severity: 'medio',
    category: 'pressao_psicologica',
    keywords: kw('não conte para ningu[ée]m', 'não desligue', 'não fale com ningu[ée]m', 'segredo', 'perigo'),
  },
  {
    id: 'promessa_dinheiro',
    label: 'Promessa de dinheiro fácil',
    description: 'Oferece dinheiro, prêmio ou retorno financeiro incomum.',
    severity: 'alto',
    category: 'pressao_psicologica',
    keywords: kw('voc[êe] ganhou', 'pr[êe]mio', 'sorteio', 'dinheiro fácil', 'renda extra garantida', 'retorno de \\d+%'),
  },
  {
    id: 'premio_inesperado',
    label: 'Prêmio inesperado',
    description: 'Comunicação não solicitada informando um prêmio ou benefício surpresa.',
    severity: 'alto',
    category: 'pressao_psicologica',
    keywords: kw('foi sorteado', 'contemplado', 'brinde exclusivo', 'presente surpresa'),
  },

  // ---- Pedido de dados ou dinheiro ----
  {
    id: 'pedido_pix',
    label: 'Pedido de Pix',
    description: 'Solicitação de transferência via Pix, frequentemente para uma chave que não pertence à instituição oficial.',
    severity: 'alto',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('fa[çc]a um pix', 'transfira via pix', 'chave pix', 'pix para essa chave'),
  },
  {
    id: 'pedido_codigo_sms',
    label: 'Pedido de código de SMS/autenticação',
    description: 'Pedido do código de verificação recebido por SMS, e-mail ou aplicativo. Nenhuma empresa séria pede esse código.',
    severity: 'alto',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('código que chegou', 'código de verifica[çc][ãa]o', 'me (envia|passa|manda) o código', 'código do sms'),
  },
  {
    id: 'pedido_senha',
    label: 'Pedido de senha',
    description: 'Solicitação de senha de aplicativos, e-mail ou bancos.',
    severity: 'alto',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('me (envia|passa|manda) (a |sua )?senha', 'informe sua senha', 'confirme sua senha'),
  },
  {
    id: 'pedido_dados_bancarios',
    label: 'Pedido de dados bancários',
    description: 'Solicitação de número de conta, agência, cartão ou dados de acesso bancário.',
    severity: 'alto',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('n[úu]mero do cart[ãa]o', 'dados banc[áa]rios', 'agência e conta', 'cvv'),
  },
  {
    id: 'pedido_dados_pessoais',
    label: 'Pedido de dados pessoais sensíveis',
    description: 'Solicitação de CPF, RG, data de nascimento ou outros dados pessoais fora de um canal oficial.',
    severity: 'medio',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('me (envia|passa|manda) (seu |o )?cpf', 'n[úu]mero do rg', 'confirme seus dados'),
  },
  {
    id: 'cobranca_inesperada',
    label: 'Cobrança inesperada',
    description: 'Cobrança de um valor que a pessoa não reconhece ou não esperava.',
    severity: 'medio',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('cobran[çc]a n[ãa]o reconhecida', 'fatura em aberto', 'd[ée]bito pendente'),
  },
  {
    id: 'falso_reembolso',
    label: 'Falso reembolso',
    description: 'Oferta de reembolso ou estorno que exige dados ou pagamento antecipado.',
    severity: 'alto',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('reembolso dispon[íi]vel', 'estorno pendente', 'devolu[çc][ãa]o de valor'),
  },
  {
    id: 'qr_code_suspeito',
    label: 'QR Code suspeito',
    description: 'Envio de QR Code para pagamento ou acesso fora de canais oficiais.',
    severity: 'medio',
    category: 'pedido_de_dados_ou_dinheiro',
    keywords: kw('escaneie o qr ?code', 'leia o qr ?code', 'aponte a câmera'),
  },

  // ---- Identidade falsa ----
  {
    id: 'falso_funcionario_banco',
    label: 'Possível falso funcionário de banco',
    description: 'A pessoa se identifica como funcionário de um banco através de um canal não oficial.',
    severity: 'alto',
    category: 'identidade_falsa',
    keywords: kw('sou (do|da) (banco|caixa|ita[uú]|bradesco|santander|nubank)', 'gerente da sua conta', 'central de seguran[çc]a do banco'),
  },
  {
    id: 'falso_funcionario_governo',
    label: 'Possível falso funcionário público',
    description: 'A pessoa alega representar um órgão do governo.',
    severity: 'alto',
    category: 'identidade_falsa',
    keywords: kw('receita federal', 'inss', 'minist[ée]rio', 'governo federal'),
  },
  {
    id: 'falso_policial',
    label: 'Possível falso policial',
    description: 'A pessoa alega ser policial ou agente de autoridade.',
    severity: 'alto',
    category: 'identidade_falsa',
    keywords: kw('sou (da )?pol[íi]cia', 'delegacia', 'sou policial'),
  },
  {
    id: 'falso_advogado',
    label: 'Possível falso advogado',
    description: 'A pessoa alega ser advogado, geralmente em contexto de um familiar em apuros.',
    severity: 'medio',
    category: 'identidade_falsa',
    keywords: kw('sou (o |a )?advogad', 'represento juridicamente'),
  },
  {
    id: 'falso_familiar',
    label: 'Possível falso familiar (golpe do parente)',
    description: 'Mensagem alegando ser um filho, neto ou parente em dificuldade, geralmente pedindo dinheiro com urgência.',
    severity: 'alto',
    category: 'identidade_falsa',
    keywords: kw('é a mãe', 'é o pai', 'aqui é seu filho', 'perdi meu celular', 'esse é meu novo n[úu]mero'),
  },
  {
    id: 'falso_entregador',
    label: 'Possível falso entregador/transportadora',
    description: 'Mensagem alegando problema em uma entrega, com link para "reagendar" ou "pagar taxa".',
    severity: 'medio',
    category: 'identidade_falsa',
    keywords: kw('sua encomenda', 'objeto retido', 'taxa de reenvio', 'tentativa de entrega'),
  },
  {
    id: 'falso_suporte_tecnico',
    label: 'Possível falso suporte técnico',
    description: 'Contato alegando ser suporte técnico, pedindo acesso remoto ou instalação de aplicativo.',
    severity: 'alto',
    category: 'identidade_falsa',
    keywords: kw('suporte t[ée]cnico', 'acesso remoto', 'instale este aplicativo', 'anydesk', 'teamviewer'),
  },
  {
    id: 'falso_emprego',
    label: 'Possível falsa oferta de emprego',
    description: 'Oferta de emprego com pagamento antecipado, tarefas simples e retorno alto.',
    severity: 'alto',
    category: 'identidade_falsa',
    keywords: kw('vaga de emprego', 'trabalhe de casa', 'renda extra', 'tarefa di[áa]ria'),
  },

  // ---- Canal e link ----
  {
    id: 'canal_nao_oficial',
    label: 'Contato por canal não oficial',
    description: 'O primeiro contato aconteceu por um canal que a instituição normalmente não usa (WhatsApp pessoal, por exemplo).',
    severity: 'medio',
    category: 'canal_e_link',
    keywords: kw('pelo whatsapp', 'me chamou no whatsapp', 'n[úu]mero pessoal'),
  },
  {
    id: 'link_suspeito',
    label: 'Link suspeito',
    description: 'Um link foi enviado pedindo para clicar e inserir dados.',
    severity: 'alto',
    category: 'canal_e_link',
    keywords: kw('clique (aqui|no link)', 'acesse o link', 'http[s]?://'),
  },
  {
    id: 'dominio_parecido',
    label: 'Domínio parecido com empresa legítima',
    description: 'O link usa um domínio semelhante, mas não idêntico, ao domínio oficial da empresa citada.',
    severity: 'alto',
    category: 'canal_e_link',
    keywords: kw('\\.com-', '\\.net-', '-oficial\\.', '\\.info\\b', '\\.xyz\\b'),
  },
  {
    id: 'boleto_falso',
    label: 'Possível boleto falso',
    description: 'Boleto enviado fora do canal oficial de cobrança, com dados divergentes.',
    severity: 'alto',
    category: 'canal_e_link',
    keywords: kw('boleto em anexo', 'segunda via do boleto', 'boleto atualizado'),
  },

  // ---- Financeiro ----
  {
    id: 'investimento_fraudulento',
    label: 'Possível investimento fraudulento',
    description: 'Promessa de retorno financeiro alto, rápido e "garantido" — incompatível com investimentos reais.',
    severity: 'alto',
    category: 'financeiro',
    keywords: kw('retorno garantido', 'lucro garantido', 'sem risco', '\\d+% ao (m[êe]s|dia)'),
  },
  {
    id: 'piramide_financeira',
    label: 'Possível pirâmide financeira',
    description: 'Modelo que depende de recrutar novos participantes para gerar retorno.',
    severity: 'alto',
    category: 'financeiro',
    keywords: kw('indique (amigos|pessoas) e ganhe', 'sistema de indica[çc][ãa]o', 'multin[íi]vel'),
  },
  {
    id: 'falso_emprestimo',
    label: 'Possível falso empréstimo',
    description: 'Oferta de empréstimo com taxa antecipada obrigatória, prática ilegal no Brasil.',
    severity: 'alto',
    category: 'financeiro',
    keywords: kw('empr[ée]stimo aprovado', 'libera[çc][ãa]o mediante taxa', 'pague uma taxa para liberar'),
  },
  {
    id: 'falso_financiamento',
    label: 'Possível falso financiamento',
    description: 'Oferta de financiamento com condições incomuns e pedido de pagamento antecipado.',
    severity: 'medio',
    category: 'financeiro',
    keywords: kw('financiamento pr[ée]-aprovado', 'crédito facilitado'),
  },
  {
    id: 'falso_beneficio',
    label: 'Possível falso benefício governamental',
    description: 'Comunicação sobre um benefício do governo (auxílio, restituição) fora dos canais oficiais.',
    severity: 'alto',
    category: 'financeiro',
    keywords: kw('aux[íi]lio dispon[íi]vel', 'benef[íi]cio liberado', 'restitui[çc][ãa]o do imposto de renda'),
  },

  // ---- Contexto específico ----
  {
    id: 'golpe_marketplace',
    label: 'Golpe de marketplace/compra e venda',
    description: 'Negociação de compra/venda com pedido de pagamento fora da plataforma oficial.',
    severity: 'alto',
    category: 'contexto_especifico',
    keywords: kw('pagamento fora do site', 'combinamos fora do (site|app)', 'chave pix diferente'),
  },
  {
    id: 'golpe_aluguel',
    label: 'Golpe de aluguel',
    description: 'Anúncio de aluguel com preço muito abaixo do mercado, exigindo pagamento adiantado sem visita.',
    severity: 'alto',
    category: 'contexto_especifico',
    keywords: kw('alugo sem fiador', 'chave mediante dep[óo]sito', 'n[ãa]o precisa visitar'),
  },
  {
    id: 'golpe_afetivo',
    label: 'Possível golpe do romance',
    description: 'Relacionamento à distância que evolui para pedidos de dinheiro.',
    severity: 'alto',
    category: 'contexto_especifico',
    keywords: kw('preciso de dinheiro para (te visitar|a passagem)', 'estou preso na alf[âa]ndega', 'perdi meus documentos no exterior'),
  },
  {
    id: 'clonagem_conta',
    label: 'Sinal de clonagem/roubo de conta',
    description: 'Indícios de que uma conta (WhatsApp, redes sociais) foi clonada ou tomada por terceiros.',
    severity: 'alto',
    category: 'contexto_especifico',
    keywords: kw('minha conta foi clonada', 'perdi acesso [àa] minha conta', 'n[ãa]o consigo entrar no whatsapp'),
  },
  {
    id: 'falso_sequestro',
    label: 'Possível falso sequestro',
    description: 'Ligação alegando sequestro ou acidente de um familiar, exigindo pagamento imediato.',
    severity: 'alto',
    category: 'contexto_especifico',
    keywords: kw('sofreu um acidente', 'foi sequestrad', 'est[áa] em meu poder'),
  },
  {
    id: 'extorsao_sextorsao',
    label: 'Possível extorsão/sextorsão',
    description: 'Ameaça de divulgar imagens ou informações comprometedoras caso não haja pagamento.',
    severity: 'alto',
    category: 'contexto_especifico',
    keywords: kw('vou divulgar suas fotos', 'vazar suas fotos', 'print da sua conversa'),
  },
];

export interface DetectedPattern extends ScamPatternDef {
  matchedText: string;
}

/** Varredura determinística por palavras-chave em todo o texto informado. */
export function scanForScamPatterns(text: string): DetectedPattern[] {
  const found: DetectedPattern[] = [];
  for (const pattern of SCAM_PATTERNS) {
    for (const kwRegex of pattern.keywords) {
      const match = text.match(kwRegex);
      if (match) {
        found.push({ ...pattern, matchedText: match[0] });
        break;
      }
    }
  }
  return found;
}

/** Frases que indicam que a pessoa já sofreu algum dano — aciona o modo de emergência. */
export const EMERGENCY_KEYWORDS: RegExp[] = kw(
  'j[áa] fiz o pix',
  'j[áa] transferi',
  'j[áa] paguei',
  'j[áa] enviei o (código|dinheiro)',
  'j[áa] passei (minha |a )?senha',
  'j[áa] passei meus dados',
  'perdi acesso [àa] (minha )?conta',
  'instalei o aplicativo',
  'cliquei no link',
  'j[áa] mandei os documentos',
  'est[ãa]o me amea[çc]ando',
  'est[ãa]o me extorquindo',
);

export function detectEmergency(text: string): boolean {
  return EMERGENCY_KEYWORDS.some((r) => r.test(text));
}
