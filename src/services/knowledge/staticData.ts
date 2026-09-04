/**
 * Dados estáticos embutidos no código — usados pelo StaticKnowledgeProvider
 * (fallback autônomo, sem nenhuma configuração) e como base de referência
 * para o seed das mesmas informações no Supabase (ver supabase/migrations/).
 *
 * Gerado a partir da mesma fonte usada para o seed SQL — ao adicionar um
 * novo item aqui, adicione também ao seed correspondente para manter os
 * dois modos (estático e Supabase) consistentes.
 */
import type { FactCheckClassification, KnownDomain, ScamPatternDef } from './KnowledgeProvider';

export const STATIC_SCAM_PATTERNS: ScamPatternDef[] = [
  {
    "id": "urgencia_artificial",
    "label": "Urgência artificial",
    "description": "Criam senso de urgência para impedir que você pense com calma ou confirme com outra pessoa.",
    "severity": "alto",
    "category": "pressao_psicologica",
    "keywords": [
      "urgente",
      "imediatamente",
      "agora mesmo",
      "últimos minutos",
      "expira hoje",
      "até às \\d",
      "em \\d+ minutos"
    ]
  },
  {
    "id": "ameaca",
    "label": "Ameaça",
    "description": "Uso de ameaças (bloqueio, multa, prisão, corte de serviço) para gerar medo.",
    "severity": "alto",
    "category": "pressao_psicologica",
    "keywords": [
      "será bloquead",
      "conta será encerrada",
      "você será preso",
      "ação judicial",
      "processo criminal",
      "multa de",
      "suspens[ãa]o"
    ]
  },
  {
    "id": "medo",
    "label": "Indução de medo",
    "description": "Mensagem construída para provocar pânico e reduzir a capacidade de análise crítica.",
    "severity": "medio",
    "category": "pressao_psicologica",
    "keywords": [
      "não conte para ningu[ée]m",
      "não desligue",
      "não fale com ningu[ée]m",
      "segredo",
      "perigo"
    ]
  },
  {
    "id": "promessa_dinheiro",
    "label": "Promessa de dinheiro fácil",
    "description": "Oferece dinheiro, prêmio ou retorno financeiro incomum.",
    "severity": "alto",
    "category": "pressao_psicologica",
    "keywords": [
      "voc[êe] ganhou",
      "pr[êe]mio",
      "sorteio",
      "dinheiro fácil",
      "renda extra garantida",
      "retorno de \\d+%"
    ]
  },
  {
    "id": "premio_inesperado",
    "label": "Prêmio inesperado",
    "description": "Comunicação não solicitada informando um prêmio ou benefício surpresa.",
    "severity": "alto",
    "category": "pressao_psicologica",
    "keywords": [
      "foi sorteado",
      "contemplado",
      "brinde exclusivo",
      "presente surpresa"
    ]
  },
  {
    "id": "pedido_pix",
    "label": "Pedido de Pix",
    "description": "Solicitação de transferência via Pix, frequentemente para uma chave que não pertence à instituição oficial.",
    "severity": "alto",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "fa[çc]a um pix",
      "transfira via pix",
      "chave pix",
      "pix para essa chave"
    ]
  },
  {
    "id": "pedido_codigo_sms",
    "label": "Pedido de código de SMS/autenticação",
    "description": "Pedido do código de verificação recebido por SMS, e-mail ou aplicativo. Nenhuma empresa séria pede esse código.",
    "severity": "alto",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "código que chegou",
      "código de verifica[çc][ãa]o",
      "me (envia|passa|manda) o código",
      "código do sms"
    ]
  },
  {
    "id": "pedido_senha",
    "label": "Pedido de senha",
    "description": "Solicitação de senha de aplicativos, e-mail ou bancos.",
    "severity": "alto",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "me (envia|passa|manda) (a |sua )?senha",
      "informe sua senha",
      "confirme sua senha"
    ]
  },
  {
    "id": "pedido_dados_bancarios",
    "label": "Pedido de dados bancários",
    "description": "Solicitação de número de conta, agência, cartão ou dados de acesso bancário.",
    "severity": "alto",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "n[úu]mero do cart[ãa]o",
      "dados banc[áa]rios",
      "agência e conta",
      "cvv"
    ]
  },
  {
    "id": "pedido_dados_pessoais",
    "label": "Pedido de dados pessoais sensíveis",
    "description": "Solicitação de CPF, RG, data de nascimento ou outros dados pessoais fora de um canal oficial.",
    "severity": "medio",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "me (envia|passa|manda) (seu |o )?cpf",
      "n[úu]mero do rg",
      "confirme seus dados"
    ]
  },
  {
    "id": "cobranca_inesperada",
    "label": "Cobrança inesperada",
    "description": "Cobrança de um valor que a pessoa não reconhece ou não esperava.",
    "severity": "medio",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "cobran[çc]a n[ãa]o reconhecida",
      "fatura em aberto",
      "d[ée]bito pendente"
    ]
  },
  {
    "id": "falso_reembolso",
    "label": "Falso reembolso",
    "description": "Oferta de reembolso ou estorno que exige dados ou pagamento antecipado.",
    "severity": "alto",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "reembolso dispon[íi]vel",
      "estorno pendente",
      "devolu[çc][ãa]o de valor"
    ]
  },
  {
    "id": "qr_code_suspeito",
    "label": "QR Code suspeito",
    "description": "Envio de QR Code para pagamento ou acesso fora de canais oficiais.",
    "severity": "medio",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "escaneie o qr ?code",
      "leia o qr ?code",
      "aponte a câmera"
    ]
  },
  {
    "id": "falso_funcionario_banco",
    "label": "Possível falso funcionário de banco",
    "description": "A pessoa se identifica como funcionário de um banco através de um canal não oficial.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "sou (do|da) (banco|caixa|ita[uú]|bradesco|santander|nubank)",
      "gerente da sua conta",
      "central de seguran[çc]a do banco"
    ]
  },
  {
    "id": "falso_funcionario_governo",
    "label": "Possível falso funcionário público",
    "description": "A pessoa alega representar um órgão do governo.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "receita federal",
      "inss",
      "minist[ée]rio",
      "governo federal"
    ]
  },
  {
    "id": "falso_policial",
    "label": "Possível falso policial",
    "description": "A pessoa alega ser policial ou agente de autoridade.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "sou (da )?pol[íi]cia",
      "delegacia",
      "sou policial"
    ]
  },
  {
    "id": "falso_advogado",
    "label": "Possível falso advogado",
    "description": "A pessoa alega ser advogado, geralmente em contexto de um familiar em apuros.",
    "severity": "medio",
    "category": "identidade_falsa",
    "keywords": [
      "sou (o |a )?advogad",
      "represento juridicamente"
    ]
  },
  {
    "id": "falso_familiar",
    "label": "Possível falso familiar (golpe do parente)",
    "description": "Mensagem alegando ser um filho, neto ou parente em dificuldade, geralmente pedindo dinheiro com urgência.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "é a mãe",
      "é o pai",
      "aqui é seu filho",
      "perdi meu celular",
      "esse é meu novo n[úu]mero"
    ]
  },
  {
    "id": "falso_entregador",
    "label": "Possível falso entregador/transportadora",
    "description": "Mensagem alegando problema em uma entrega, com link para \"reagendar\" ou \"pagar taxa\".",
    "severity": "medio",
    "category": "identidade_falsa",
    "keywords": [
      "sua encomenda",
      "objeto retido",
      "taxa de reenvio",
      "tentativa de entrega"
    ]
  },
  {
    "id": "falso_suporte_tecnico",
    "label": "Possível falso suporte técnico",
    "description": "Contato alegando ser suporte técnico, pedindo acesso remoto ou instalação de aplicativo.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "suporte t[ée]cnico",
      "acesso remoto",
      "instale este aplicativo",
      "anydesk",
      "teamviewer"
    ]
  },
  {
    "id": "falso_emprego",
    "label": "Possível falsa oferta de emprego",
    "description": "Oferta de emprego com pagamento antecipado, tarefas simples e retorno alto.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "vaga de emprego",
      "trabalhe de casa",
      "renda extra",
      "tarefa di[áa]ria"
    ]
  },
  {
    "id": "canal_nao_oficial",
    "label": "Contato por canal não oficial",
    "description": "O primeiro contato aconteceu por um canal que a instituição normalmente não usa (WhatsApp pessoal, por exemplo).",
    "severity": "medio",
    "category": "canal_e_link",
    "keywords": [
      "pelo whatsapp",
      "me chamou no whatsapp",
      "n[úu]mero pessoal"
    ]
  },
  {
    "id": "link_suspeito",
    "label": "Link suspeito",
    "description": "Um link foi enviado pedindo para clicar e inserir dados.",
    "severity": "alto",
    "category": "canal_e_link",
    "keywords": [
      "clique (aqui|no link)",
      "acesse o link",
      "http[s]?://"
    ]
  },
  {
    "id": "dominio_parecido",
    "label": "Domínio parecido com empresa legítima",
    "description": "O link usa um domínio semelhante, mas não idêntico, ao domínio oficial da empresa citada.",
    "severity": "alto",
    "category": "canal_e_link",
    "keywords": [
      "\\.com-",
      "\\.net-",
      "-oficial\\.",
      "\\.info\\b",
      "\\.xyz\\b"
    ]
  },
  {
    "id": "boleto_falso",
    "label": "Possível boleto falso",
    "description": "Boleto enviado fora do canal oficial de cobrança, com dados divergentes.",
    "severity": "alto",
    "category": "canal_e_link",
    "keywords": [
      "boleto em anexo",
      "segunda via do boleto",
      "boleto atualizado"
    ]
  },
  {
    "id": "investimento_fraudulento",
    "label": "Possível investimento fraudulento",
    "description": "Promessa de retorno financeiro alto, rápido e \"garantido\" — incompatível com investimentos reais.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "retorno garantido",
      "lucro garantido",
      "sem risco",
      "\\d+% ao (m[êe]s|dia)"
    ]
  },
  {
    "id": "piramide_financeira",
    "label": "Possível pirâmide financeira",
    "description": "Modelo que depende de recrutar novos participantes para gerar retorno.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "indique (amigos|pessoas) e ganhe",
      "sistema de indica[çc][ãa]o",
      "multin[íi]vel"
    ]
  },
  {
    "id": "falso_emprestimo",
    "label": "Possível falso empréstimo",
    "description": "Oferta de empréstimo com taxa antecipada obrigatória, prática ilegal no Brasil.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "empr[ée]stimo aprovado",
      "libera[çc][ãa]o mediante taxa",
      "pague uma taxa para liberar"
    ]
  },
  {
    "id": "falso_financiamento",
    "label": "Possível falso financiamento",
    "description": "Oferta de financiamento com condições incomuns e pedido de pagamento antecipado.",
    "severity": "medio",
    "category": "financeiro",
    "keywords": [
      "financiamento pr[ée]-aprovado",
      "crédito facilitado"
    ]
  },
  {
    "id": "falso_beneficio",
    "label": "Possível falso benefício governamental",
    "description": "Comunicação sobre um benefício do governo (auxílio, restituição) fora dos canais oficiais.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "aux[íi]lio dispon[íi]vel",
      "benef[íi]cio liberado",
      "restitui[çc][ãa]o do imposto de renda"
    ]
  },
  {
    "id": "golpe_marketplace",
    "label": "Golpe de marketplace/compra e venda",
    "description": "Negociação de compra/venda com pedido de pagamento fora da plataforma oficial.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "pagamento fora do site",
      "combinamos fora do (site|app)",
      "chave pix diferente"
    ]
  },
  {
    "id": "golpe_aluguel",
    "label": "Golpe de aluguel",
    "description": "Anúncio de aluguel com preço muito abaixo do mercado, exigindo pagamento adiantado sem visita.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "alugo sem fiador",
      "chave mediante dep[óo]sito",
      "n[ãa]o precisa visitar"
    ]
  },
  {
    "id": "golpe_afetivo",
    "label": "Possível golpe do romance",
    "description": "Relacionamento à distância que evolui para pedidos de dinheiro.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "preciso de dinheiro para (te visitar|a passagem)",
      "estou preso na alf[âa]ndega",
      "perdi meus documentos no exterior"
    ]
  },
  {
    "id": "clonagem_conta",
    "label": "Sinal de clonagem/roubo de conta",
    "description": "Indícios de que uma conta (WhatsApp, redes sociais) foi clonada ou tomada por terceiros.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "minha conta foi clonada",
      "perdi acesso [àa] minha conta",
      "n[ãa]o consigo entrar no whatsapp"
    ]
  },
  {
    "id": "falso_sequestro",
    "label": "Possível falso sequestro",
    "description": "Ligação alegando sequestro ou acidente de um familiar, exigindo pagamento imediato.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "sofreu um acidente",
      "foi sequestrad",
      "est[áa] em meu poder"
    ]
  },
  {
    "id": "extorsao_sextorsao",
    "label": "Possível extorsão/sextorsão",
    "description": "Ameaça de divulgar imagens ou informações comprometedoras caso não haja pagamento.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "vou divulgar suas fotos",
      "vazar suas fotos",
      "print da sua conversa"
    ]
  }
];

export const STATIC_KNOWN_DOMAINS: KnownDomain[] = [
  {
    "domain": "itau.com.br",
    "category": "bancos"
  },
  {
    "domain": "bradesco.com.br",
    "category": "bancos"
  },
  {
    "domain": "santander.com.br",
    "category": "bancos"
  },
  {
    "domain": "caixa.gov.br",
    "category": "bancos"
  },
  {
    "domain": "bb.com.br",
    "category": "bancos"
  },
  {
    "domain": "nubank.com.br",
    "category": "bancos"
  },
  {
    "domain": "inter.co",
    "category": "bancos"
  },
  {
    "domain": "c6bank.com.br",
    "category": "bancos"
  },
  {
    "domain": "picpay.com",
    "category": "bancos"
  },
  {
    "domain": "gov.br",
    "category": "governo"
  },
  {
    "domain": "inss.gov.br",
    "category": "governo"
  },
  {
    "domain": "receita.fazenda.gov.br",
    "category": "governo"
  },
  {
    "domain": "anvisa.gov.br",
    "category": "governo"
  },
  {
    "domain": "mercadolivre.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "mercadopago.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "amazon.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "shopee.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "magazineluiza.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "americanas.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "olx.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "correios.com.br",
    "category": "transportadoras"
  },
  {
    "domain": "jadlog.com.br",
    "category": "transportadoras"
  },
  {
    "domain": "totalexpress.com.br",
    "category": "transportadoras"
  },
  {
    "domain": "whatsapp.com",
    "category": "redes_sociais"
  },
  {
    "domain": "instagram.com",
    "category": "redes_sociais"
  },
  {
    "domain": "facebook.com",
    "category": "redes_sociais"
  },
  {
    "domain": "telegram.org",
    "category": "redes_sociais"
  }
];

export interface StaticFactCheck {
  claim: string;
  classification: FactCheckClassification;
  explanation: string;
  redFlags: string[];
  howToVerify: string[];
}

export const FACT_CHECK_SOURCE_TITLE = "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos";

export const STATIC_FACT_CHECKS: StaticFactCheck[] = [
  {
    "claim": "O WhatsApp vai começar a cobrar uma mensalidade para continuar sendo usado",
    "classification": "provavelmente_falsa",
    "explanation": "Esse é um boato recorrente que circula há anos em correntes de mensagem. O WhatsApp nunca cobrou, e não há indício de cobrança para o uso pessoal do aplicativo.",
    "redFlags": [
      "Mensagem em cadeia pedindo repasse imediato",
      "Sem fonte oficial citada",
      "Reaparece periodicamente com pequenas variações"
    ],
    "howToVerify": [
      "Consulte o site oficial do WhatsApp (whatsapp.com)",
      "Verifique a seção de ajuda do próprio aplicativo",
      "Procure agências de fact-checking brasileiras (Aos Fatos, Lupa, Comprova, Boatos.org)"
    ]
  },
  {
    "claim": "Roupas ou panfletos com anestesia são deixados em portas de casas para facilitar sequestro relâmpago",
    "classification": "provavelmente_falsa",
    "explanation": "Não existe caso comprovado desse método. É um boato de segurança recorrente, já desmentido diversas vezes por corporações policiais e agências de checagem.",
    "redFlags": [
      "Apelo emocional de medo",
      "Pede compartilhamento imediato \"para proteger a família\"",
      "Nunca cita uma ocorrência policial verificável específica"
    ],
    "howToVerify": [
      "Consulte o site da Polícia Civil ou Militar do seu estado",
      "Procure agências de fact-checking brasileiras"
    ]
  },
  {
    "claim": "Botijões de gás de uma marca específica vão explodir e famílias devem verificar imediatamente",
    "classification": "provavelmente_falsa",
    "explanation": "Alertas desse tipo circulam recorrentemente citando supostos \"engenheiros da empresa\", sem qualquer comunicado oficial real da fabricante ou de órgãos reguladores.",
    "redFlags": [
      "Cita um \"engenheiro\" ou \"funcionário\" não identificável",
      "Pede repasse urgente",
      "Nenhum comunicado oficial da empresa citada"
    ],
    "howToVerify": [
      "Consulte diretamente o site oficial da fabricante do botijão",
      "Consulte a ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis)"
    ]
  },
  {
    "claim": "Vacinas contêm microchip ou tecnologia 5G para controle ou rastreamento da população",
    "classification": "provavelmente_falsa",
    "explanation": "Não existe base técnica nem evidência que sustente essa alegação. É uma das desinformações mais desmentidas por agências de fact-checking e órgãos de saúde no mundo todo.",
    "redFlags": [
      "Alegação tecnicamente implausível (tamanho de agulha x componentes eletrônicos)",
      "Sem fonte científica verificável",
      "Linguagem conspiratória"
    ],
    "howToVerify": [
      "Consulte o site do Ministério da Saúde (gov.br/saude) ou da Anvisa",
      "Procure agências de fact-checking brasileiras e internacionais"
    ]
  },
  {
    "claim": "Sua conta do WhatsApp será excluída se você não repassar esta mensagem para um número mínimo de contatos",
    "classification": "provavelmente_falsa",
    "explanation": "O WhatsApp nunca exclui contas por falta de repasse de mensagens. Esse é um formato clássico de corrente projetada para se espalhar rapidamente.",
    "redFlags": [
      "Prazo ou número mínimo de repasses especificado",
      "Ameaça de perda da conta",
      "Formato típico de corrente"
    ],
    "howToVerify": [
      "Consulte a central de ajuda oficial do WhatsApp (faq.whatsapp.com)"
    ]
  },
  {
    "claim": "Uma cédula de dinheiro em circulação vai perder validade em breve sem comunicado oficial",
    "classification": "provavelmente_falsa",
    "explanation": "Mudanças na validade de cédulas no Brasil são sempre anunciadas oficialmente, com prazo longo, pelo Banco Central — nunca por corrente de mensagem.",
    "redFlags": [
      "Prazo curto e alarmista",
      "Nenhuma fonte do Banco Central citada",
      "Pede repasse urgente"
    ],
    "howToVerify": [
      "Consulte o site oficial do Banco Central do Brasil (bcb.gov.br)"
    ]
  },
  {
    "claim": "Produtos alimentícios estariam sendo intencionalmente contaminados em supermercados, segundo mensagem em cadeia",
    "classification": "nao_confirmada",
    "explanation": "Alegações desse tipo circulam periodicamente sem nunca apontar um caso, local ou data verificável. Sem uma fonte oficial (Anvisa, vigilância sanitária, boletim de ocorrência), não é possível confirmar nem descartar por completo — mas o padrão é característico de boato.",
    "redFlags": [
      "Nenhum local, data ou produto específico verificável",
      "Apelo emocional envolvendo crianças ou famílias",
      "Pede compartilhamento amplo e imediato"
    ],
    "howToVerify": [
      "Consulte o site da Anvisa (gov.br/anvisa) para alertas sanitários oficiais",
      "Procure a vigilância sanitária do seu estado ou município"
    ]
  },
  {
    "claim": "Um novo vírus apaga todos os contatos e fotos do celular se uma determinada imagem ou link for aberto",
    "classification": "nao_confirmada",
    "explanation": "Existem golpes reais de malware distribuídos por links e arquivos, mas alertas em corrente com essa descrição genérica raramente correspondem a uma ameaça real específica — geralmente são boatos ou versões distorcidas de alertas de segurança legítimos.",
    "redFlags": [
      "Descrição vaga, sem nome do malware ou fonte técnica",
      "Pede repasse em massa",
      "Instrui a não abrir \"qualquer\" arquivo sem especificar qual"
    ],
    "howToVerify": [
      "Consulte o CERT.br (cert.br), o centro de resposta a incidentes de segurança do Brasil",
      "Mantenha o sistema operacional e antivírus atualizados"
    ]
  },
  {
    "claim": "Ligar de volta para um número desconhecido específico gera uma cobrança altíssima automática",
    "classification": "nao_confirmada",
    "explanation": "Golpes de \"toque e desliga\" (que induzem a vítima a ligar de volta para números com tarifação especial) existem, mas alegações genéricas sobre um número específico circulando em corrente raramente podem ser confirmadas sem uma fonte da operadora ou da Anatel.",
    "redFlags": [
      "Número específico citado sem fonte oficial",
      "Valor de cobrança exagerado e sem comprovação",
      "Formato de corrente"
    ],
    "howToVerify": [
      "Consulte o site da Anatel (gov.br/anatel)",
      "Não ligue de volta para números desconhecidos e verifique com sua operadora"
    ]
  },
  {
    "claim": "Uma foto ou vídeo de um desastre ou evento antigo está sendo compartilhado como se fosse de um acontecimento atual",
    "classification": "enganosa_fora_de_contexto",
    "explanation": "Esse é um padrão comum de desinformação: conteúdo real, mas reaproveitado fora do contexto original de data e local. Cada caso precisa ser verificado individualmente comparando a imagem com sua origem.",
    "redFlags": [
      "Imagem sem data ou fonte original citada",
      "Legenda alarmista associando a um evento recente específico",
      "Qualidade ou marca d'água inconsistente com a suposta origem"
    ],
    "howToVerify": [
      "Use uma busca reversa de imagens (ex.: Google Imagens) para encontrar a publicação original",
      "Procure a mesma imagem em veículos jornalísticos estabelecidos com data de publicação"
    ]
  }
];
