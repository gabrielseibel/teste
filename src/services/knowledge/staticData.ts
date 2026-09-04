/**
 * Dados estáticos embutidos no código — usados pelo StaticKnowledgeProvider
 * (fallback autônomo, sem nenhuma configuração) e mantidos em paridade com
 * o conteúdo do Supabase (ver supabase/migrations/, incluindo 0004_expand_knowledge_base.sql).
 *
 * Ao adicionar um novo item no Supabase, adicione também aqui para manter
 * os dois modos (estático e Supabase) consistentes.
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
  },
  {
    "id": "golpe_pix_agendado",
    "label": "Falso Pix agendado",
    "description": "O golpista mostra um comprovante de Pix agendado e tenta convencer a vítima de que o pagamento já foi realizado. O agendamento pode ser cancelado antes da transferência, deixando o vendedor sem receber.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "pix agendado",
      "pagamento agendado",
      "comprovante de agendamento",
      "ja fiz o pix",
      "o pix vai cair",
      "ta programado"
    ]
  },
  {
    "id": "golpe_falso_comprovante_pix",
    "label": "Falso comprovante de Pix",
    "description": "O criminoso envia uma imagem ou comprovante falsificado para fazer parecer que pagou por um produto ou serviço. A vítima é induzida a entregar a mercadoria antes de conferir o crédito no extrato.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "comprovante do pix",
      "comprovante de pagamento",
      "pix realizado",
      "pagamento realizado",
      "ja paguei",
      "confere ai o comprovante"
    ]
  },
  {
    "id": "golpe_acesso_remoto_app",
    "label": "Golpe do acesso remoto",
    "description": "O criminoso se passa por funcionário de banco e afirma que existe uma irregularidade na conta. Depois pede para a vítima instalar um aplicativo que permite controlar ou acessar o celular.",
    "severity": "alto",
    "category": "canal_e_link",
    "keywords": [
      "instale o aplicativo",
      "instalar um app",
      "aplicativo de seguran[cç]a",
      "acesso remoto",
      "controle remoto",
      "resolver o problema da conta"
    ]
  },
  {
    "id": "golpe_falsa_taxa_encomenda",
    "label": "Falsa taxa para liberar encomenda",
    "description": "A vítima recebe uma mensagem dizendo que uma encomenda está retida ou atrasada e precisa pagar uma taxa para ser liberada. O golpe normalmente leva a uma página falsa que coleta dados e dinheiro.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "encomenda est[aá] retida",
      "taxa de libera[cç][aã]o",
      "taxa de entrega",
      "regularizar sua encomenda",
      "objeto retido",
      "pagar para liberar"
    ]
  },
  {
    "id": "golpe_falso_sac_0800",
    "label": "Falso SAC por número 0800",
    "description": "Criminosos podem disponibilizar números falsos de atendimento, inclusive em adesivos colocados próximos a caixas eletrônicos. A vítima acredita estar ligando para o banco e acaba entregando dados ou informações de segurança ao golpista.",
    "severity": "alto",
    "category": "canal_e_link",
    "keywords": [
      "n[uú]mero 0800",
      "ligue para o suporte",
      "central de atendimento",
      "sac do banco",
      "n[uú]mero de atendimento",
      "ligue neste n[uú]mero"
    ]
  },
  {
    "id": "golpe_deepfake_indenizacao",
    "label": "Deepfake de indenização",
    "description": "Vídeos manipulados usam a imagem ou a voz de apresentadores, advogados ou figuras conhecidas para anunciar falsas indenizações. O usuário é direcionado a um site falso para informar dados pessoais ou pagar valores.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "indeniza[cç][aã]o de",
      "voc[eê] tem direito",
      "saque sua indeniza[cç][aã]o",
      "clique em saiba mais",
      "receba seu dinheiro",
      "sete sal[aá]rios m[ií]nimos"
    ]
  },
  {
    "id": "golpe_falso_saque_receita",
    "label": "Falso saldo para saque da Receita",
    "description": "Anúncios falsos usam o nome da Receita Federal para afirmar que a pessoa possui um saldo ou dinheiro disponível para saque. O objetivo é levar a vítima a clicar em um link e entregar dados ou dinheiro.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "saldo para retirar",
      "saque pelo cpf",
      "valor liberado pelo cpf",
      "consulte seu saldo",
      "dinheiro dispon[ií]vel para saque",
      "receita federal liberou"
    ]
  },
  {
    "id": "golpe_falso_leilao_receita",
    "label": "Falso leilão da Receita",
    "description": "Golpistas anunciam falsos leilões de produtos atribuídos à Receita Federal e direcionam a vítima para sites fraudulentos. O conteúdo usa a identidade visual de órgãos públicos para criar aparência de legitimidade.",
    "severity": "alto",
    "category": "identidade_falsa",
    "keywords": [
      "leil[aã]o da receita",
      "leil[aã]o oficial",
      "encomendas apreendidas",
      "celulares apreendidos",
      "produtos abandonados",
      "participe do leil[aã]o"
    ]
  },
  {
    "id": "golpe_limite_credito_falso",
    "label": "Falso aumento de limite",
    "description": "Anúncios prometem aumento imediato de limite de crédito em um banco conhecido e levam a uma página que imita a identidade visual da instituição. O objetivo é capturar dados pessoais ou induzir outras ações fraudulentas.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "aumentamos seu limite",
      "novo limite de",
      "limite total de \\d+[.,]?\\d*",
      "ajuste seu novo limite",
      "libere seu limite",
      "limite aprovado"
    ]
  },
  {
    "id": "deepfake_famoso",
    "label": "Deepfake de Famoso ou Jornalista",
    "description": "Uso de inteligência artificial para clonar imagem e voz de personalidades ou jornalistas simulando reportagens sobre investimentos com retornos garantidos.",
    "severity": "alto",
    "category": "pressao_psicologica",
    "keywords": [
      "deepfake",
      "v[ií]deo manipulado",
      "voz clonada",
      "falso investimento",
      "mat[eé]ria da tv",
      "esc[aã]ndalo",
      "roda viva"
    ]
  },
  {
    "id": "falsa_prova_de_vida",
    "label": "Falsa Prova de Vida",
    "description": "Mensagem enviada em nome do INSS alegando suspensão do benefício por falta de prova de vida para capturar selfies e dados pessoais em sites falsos.",
    "severity": "alto",
    "category": "pedido_de_dados_ou_dinheiro",
    "keywords": [
      "prova de vida",
      "inss",
      "pend[eê]ncia",
      "bloqueio de benef[ií]cio",
      "reconhecimento facial",
      "resolverfacil"
    ]
  },
  {
    "id": "raspadinha_premiada",
    "label": "Falsa Raspadinha Digital",
    "description": "Página maliciosa que simula um jogo de raspadinha online com promessas de prêmios em dinheiro via Pix em nome de grandes empresas.",
    "severity": "medio",
    "category": "financeiro",
    "keywords": [
      "raspadinha",
      "raspou achou ganhou",
      "pr[eê]mio via pix",
      "ganhe na hora",
      "sorteio"
    ]
  },
  {
    "id": "falso_auxilio_emergencial",
    "label": "Falso Auxílio Governamental",
    "description": "Fraude que divulga programas sociais inexistentes exigindo pagamento de taxa de cadastro ou repasse de chaves Pix.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "aux[ií]lio reconstru[çc][aã]o",
      "libera[çc][aã]o do aux[ií]lio",
      "saque emergencial",
      "cadastro social"
    ]
  },
  {
    "id": "falsa_portabilidade",
    "label": "Falsa Portabilidade de Consignado",
    "description": "Falsos correspondentes bancários oferecem redução de juros em empréstimos consignados para efetuar refinanciamentos não autorizados.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "portabilidade consignado",
      "redu[çc][aã]o de juros",
      "troco consignado",
      "refinanciamento"
    ]
  },
  {
    "id": "golpe_pix_errado_devolucao",
    "label": "Pix errado com pedido de devolução",
    "description": "O golpista envia um Pix para a vítima e pede que o valor seja devolvido para uma chave diferente da conta de origem. Depois, também tenta contestar a transferência original para receber o dinheiro duas vezes.",
    "severity": "alto",
    "category": "financeiro",
    "keywords": [
      "fiz um pix errado",
      "devolv[ae] para (esta|essa|outra) chave",
      "manda de volta por pix",
      "pix caiu por engano",
      "devolu[cç][aã]o para outra conta"
    ]
  },
  {
    "id": "golpe_troca_de_cartao",
    "label": "Troca de cartão durante pagamento",
    "description": "O criminoso observa a senha digitada e troca o cartão da vítima por outro parecido durante um pagamento. Em seguida, utiliza o cartão verdadeiro para realizar compras ou saques.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "seu cart[aã]o n[aã]o passou",
      "insira o cart[aã]o novamente",
      "digite a senha outra vez",
      "vou limpar o chip",
      "trocar a maquininha"
    ]
  },
  {
    "id": "golpe_falso_concurso_publico",
    "label": "Falso concurso público",
    "description": "Anúncios falsos usam o nome de órgãos públicos para oferecer vagas, inscrições ou editais inexistentes. A vítima é induzida a fornecer documentos ou pagar uma falsa taxa de inscrição.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "inscri[cç][oõ]es abertas para concurso",
      "pague a taxa de inscri[cç][aã]o",
      "vagas imediatas no (ibama|governo|minist[ée]rio)",
      "edital exclusivo",
      "garanta sua vaga hoje",
      "envie seus documentos para inscri[cç][aã]o"
    ]
  },
  {
    "id": "golpe_falso_agendamento_documento",
    "label": "Falso agendamento de documento",
    "description": "Sites falsos imitam serviços de emissão de documentos e cobram antecipadamente por um agendamento que seria gratuito. A cobrança costuma ser apresentada no final do formulário, geralmente por Pix.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "taxa para agendar",
      "pagamento para confirmar o agendamento",
      "emiss[aã]o da (identidade|cin|rg)",
      "agendamento confirmado ap[oó]s o pix",
      "pague agora para reservar o hor[aá]rio"
    ]
  },
  {
    "id": "golpe_falsa_doacao_online",
    "label": "Falsa campanha de doação",
    "description": "Criminosos reutilizam imagens de pessoas doentes, vídeos manipulados ou histórias inventadas para pedir doações. O dinheiro enviado por Pix não chega à pessoa apresentada na campanha.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "ajude (esta|essa) crian[cç]a",
      "cada minuto conta",
      "fa[cç]a sua doa[cç][aã]o",
      "pix para salvar uma vida",
      "meta de doa[cç][oõ]es",
      "campanha solid[aá]ria urgente"
    ]
  },
  {
    "id": "golpe_falso_leilao_publico",
    "label": "Falso leilão de veículos",
    "description": "Páginas falsas usam nomes e símbolos de órgãos públicos para anunciar veículos em leilões inexistentes. O interessado é pressionado a pagar sinal, taxa ou o valor do suposto lote.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "leil[aã]o oficial do detran",
      "ve[ií]culo com at[ée] \\d+% de desconto",
      "pague o sinal do lote",
      "lote reservado por poucos minutos",
      "taxa de arremata[cç][aã]o",
      "confirme o lance por pix"
    ]
  },
  {
    "id": "golpe_falsa_inscricao_enem",
    "label": "Falsa inscrição no Enem",
    "description": "Sites não oficiais imitam a Página do Participante e solicitam CPF, outros dados pessoais e pagamento por Pix ou boleto. O pagamento não gera uma inscrição válida no exame.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "inscri[cç][aã]o enem 20\\d{2}",
      "confirme sua inscri[cç][aã]o por pix",
      "pague a taxa do enem",
      "vaga garantida no enem",
      "p[aá]gina do participante"
    ]
  },
  {
    "id": "golpe_falsa_regularizacao_cpf",
    "label": "Falsa regularização de CPF",
    "description": "Mensagens usam nome, CPF, símbolos da Receita Federal e ameaças de bloqueio para levar a vítima a um site falso. A página cobra por Pix uma suposta taxa para regularizar o documento.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "irregularidade fiscal grave",
      "seu cpf ser[aá] bloqueado",
      "regularize seu cpf",
      "pend[êe]ncia grave em aberto",
      "[uú]ltimo aviso da receita",
      "bloqueio (definitivo|imediato) do cpf"
    ]
  },
  {
    "id": "golpe_falsa_pre_venda",
    "label": "Falsa pré-venda de produto",
    "description": "Anúncios oferecem antecipadamente produtos muito aguardados, mas direcionam a páginas que imitam a loja oficial. A vítima fornece dados pessoais e paga por um item que não está em pré-venda naquele canal.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "pr[ée]-venda exclusiva",
      "seja um dos primeiros",
      "[aá]lbum oficial j[aá] dispon[ií]vel",
      "compre antes do lan[cç]amento",
      "oferta de pr[ée]-lan[cç]amento",
      "reserva confirmada por pix"
    ]
  },
  {
    "id": "golpe_promocao_relampago_falsa",
    "label": "Promoção relâmpago em site falso",
    "description": "Uma página imita uma loja conhecida, oferece produtos por valores muito baixos e pressiona o visitante com estoque limitado ou cronômetro. O pagamento é enviado a terceiros e o produto não é entregue.",
    "severity": "alto",
    "category": "contexto_especifico",
    "keywords": [
      "promo[cç][aã]o rel[âa]mpago",
      "estoque limitado",
      "[uú]ltimas unidades",
      "oferta termina em \\d+ minutos",
      "brinde gr[aá]tis na compra"
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
  },
  {
    "domain": "neon.com.br",
    "category": "bancos"
  },
  {
    "domain": "pagbank.com.br",
    "category": "bancos"
  },
  {
    "domain": "willbank.com.br",
    "category": "bancos"
  },
  {
    "domain": "original.com.br",
    "category": "bancos"
  },
  {
    "domain": "digio.com.br",
    "category": "bancos"
  },
  {
    "domain": "bancobs2.com.br",
    "category": "bancos"
  },
  {
    "domain": "btgpactual.com",
    "category": "bancos"
  },
  {
    "domain": "safra.com.br",
    "category": "bancos"
  },
  {
    "domain": "sicredi.com.br",
    "category": "bancos"
  },
  {
    "domain": "sicoob.com.br",
    "category": "bancos"
  },
  {
    "domain": "claro.com.br",
    "category": "telecom"
  },
  {
    "domain": "tim.com.br",
    "category": "telecom"
  },
  {
    "domain": "vivo.com.br",
    "category": "telecom"
  },
  {
    "domain": "voegol.com.br",
    "category": "companhias_aereas"
  },
  {
    "domain": "latamairlines.com",
    "category": "companhias_aereas"
  },
  {
    "domain": "voeazul.com.br",
    "category": "companhias_aereas"
  },
  {
    "domain": "smiles.com.br",
    "category": "companhias_aereas"
  },
  {
    "domain": "globoplay.globo.com",
    "category": "streaming"
  },
  {
    "domain": "spotify.com",
    "category": "streaming"
  },
  {
    "domain": "netflix.com",
    "category": "streaming"
  },
  {
    "domain": "bcb.gov.br",
    "category": "governo"
  },
  {
    "domain": "tse.jus.br",
    "category": "governo"
  },
  {
    "domain": "detran.sc.gov.br",
    "category": "governo"
  },
  {
    "domain": "detran.pr.gov.br",
    "category": "governo"
  },
  {
    "domain": "policiacientifica.sc.gov.br",
    "category": "governo"
  },
  {
    "domain": "ibama.gov.br",
    "category": "governo"
  },
  {
    "domain": "inep.gov.br",
    "category": "governo"
  },
  {
    "domain": "saude.sp.gov.br",
    "category": "governo"
  },
  {
    "domain": "cofen.gov.br",
    "category": "governo"
  },
  {
    "domain": "serasa.com.br",
    "category": "financeiro"
  },
  {
    "domain": "spcbrasil.com.br",
    "category": "financeiro"
  },
  {
    "domain": "porto.com.br",
    "category": "seguradoras"
  },
  {
    "domain": "ifood.com.br",
    "category": "marketplaces"
  },
  {
    "domain": "uber.com",
    "category": "transporte"
  },
  {
    "domain": "99app.com",
    "category": "transporte"
  },
  {
    "domain": "panini.com.br",
    "category": "varejo"
  },
  {
    "domain": "sodexo.com.br",
    "category": "beneficios"
  },
  {
    "domain": "pluxee.br",
    "category": "beneficios"
  },
  {
    "domain": "ticket.com.br",
    "category": "beneficios"
  },
  {
    "domain": "alelo.com.br",
    "category": "beneficios"
  },
  {
    "domain": "febraban.org.br",
    "category": "associacoes_financeiras"
  },
  {
    "domain": "aosfatos.org",
    "category": "fact_checking"
  },
  {
    "domain": "g1.globo.com",
    "category": "jornalismo"
  }
];

export interface StaticFactCheck {
  claim: string;
  classification: FactCheckClassification;
  explanation: string;
  redFlags: string[];
  howToVerify: string[];
  sourceTitle?: string;
  sourceUrl?: string;
  sourceType?: 'oficial' | 'jornalistico' | 'fact_checking' | 'outra';
  sourceDate?: string;
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
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
    ],
    "sourceTitle": "Padrão de boato recorrente, amplamente documentado por agências brasileiras de fact-checking (ex.: Aos Fatos, Lupa, Comprova, Boatos.org, e-Farsas) ao longo dos anos",
    "sourceType": "fact_checking",
    "sourceDate": "Recorrente"
  },
  {
    "claim": "O governo federal vai pagar um benefício extra de R$ 1.150 para aposentados e pensionistas do INSS.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação foi desmentida pelo INSS e pelo Ministério da Previdência Social. A checagem identificou um vídeo manipulado com deepfake de uma apresentadora e um trecho antigo de televisão usado para dar aparência de veracidade ao falso anúncio.",
    "redFlags": [
      "Promessa de dinheiro inesperado",
      "Valor fixo e elevado",
      "Vídeo manipulado",
      "Uso de apresentadora para dar credibilidade"
    ],
    "howToVerify": [
      "Consulte o site oficial do INSS em gov.br/inss",
      "Procure o benefício nos canais oficiais do governo",
      "Desconfie de anúncios que pedem clique ou cadastro para liberar dinheiro"
    ],
    "sourceTitle": "Aos Fatos",
    "sourceUrl": "https://www.aosfatos.org/noticias/e-falso-que-governo-federal-vai-pagar-beneficio-extra-de-r-1150-a-beneficiarios-do-inss/",
    "sourceType": "fact_checking",
    "sourceDate": "19 de novembro de 2025"
  },
  {
    "claim": "Existe uma lista oficial de beneficiários do INSS que já foi liberada para receber a restituição de descontos indevidos.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação foi classificada como golpe. O governo não havia divulgado uma lista pública desse tipo e os criminosos direcionavam usuários para uma página falsa que imitava o portal gov.br para obter dados e dinheiro.",
    "redFlags": [
      "Suposta lista de beneficiários",
      "Uso de página que imita gov.br",
      "Promessa de restituição",
      "Anúncio patrocinado"
    ],
    "howToVerify": [
      "Consulte informações diretamente no Meu INSS",
      "Acesse gov.br pelo endereço digitado manualmente",
      "Não informe CPF em páginas acessadas por anúncios suspeitos"
    ],
    "sourceTitle": "Aos Fatos",
    "sourceUrl": "https://www.aosfatos.org/noticias/e-golpe-lista-de-beneficiarios-que-vao-receber-restituicao-de-descontos-do-inss/",
    "sourceType": "fact_checking",
    "sourceDate": "15 de maio de 2025"
  },
  {
    "claim": "A Receita Federal liberou R$ 30.450,90 para saque pelo CPF de usuários das redes sociais.",
    "classification": "provavelmente_falsa",
    "explanation": "A Receita Federal informou que não havia consulta para liberação de saques vinculados ao CPF. A publicação levava a uma página fraudulenta e utilizava o nome da Receita para induzir vítimas a fornecer informações.",
    "redFlags": [
      "Valor inesperado disponível",
      "Uso do CPF como suposta chave de consulta",
      "Link para saque",
      "Uso indevido da Receita Federal"
    ],
    "howToVerify": [
      "Consulte informações somente em gov.br/receitafederal",
      "Não clique em links enviados por anúncios ou mensagens suspeitas",
      "Verifique se o endereço termina em gov.br"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/01/16/e-golpe-post-de-saque-de-r-30-mil-atribuido-a-receita-federal/",
    "sourceType": "fact_checking",
    "sourceDate": "16 de janeiro de 2025"
  },
  {
    "claim": "Um e-mail da Receita Federal informa que existe uma pendência grave no CPF que pode bloquear contas bancárias, documentos e viagens.",
    "classification": "provavelmente_falsa",
    "explanation": "A mensagem foi identificada como golpe. O conteúdo usava ameaças e urgência para fazer a vítima clicar em um link que levava a uma página semelhante ao portal do governo.",
    "redFlags": [
      "Ameaça de bloqueio",
      "Sensação de urgência",
      "Link em e-mail",
      "Página imitando o governo"
    ],
    "howToVerify": [
      "Consulte seu CPF diretamente no site oficial da Receita",
      "Não use o link recebido no e-mail",
      "Desconfie de ameaças que exigem regularização imediata"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/03/11/e-golpe-e-mail-atribuido-a-receita-federal-sobre-pendencia-no-cpf/",
    "sourceType": "fact_checking",
    "sourceDate": "11 de março de 2025"
  },
  {
    "claim": "É preciso pagar uma taxa para liberar uma encomenda retida pelos Correios após atraso na entrega.",
    "classification": "provavelmente_falsa",
    "explanation": "A publicação foi identificada como golpe. O link não tinha relação com os Correios e direcionava para uma página fraudulenta que solicitava dados pessoais e pagamento para uma falsa liberação.",
    "redFlags": [
      "Encomenda retida",
      "Cobrança inesperada",
      "Link fora do canal oficial",
      "Pagamento para liberar entrega"
    ],
    "howToVerify": [
      "Consulte o rastreamento diretamente em correios.com.br",
      "Não pague taxas por links recebidos em mensagens suspeitas",
      "Confira o domínio antes de informar qualquer dado"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/01/29/golpe-de-falsa-taxa-dos-correios-volta-a-circular-nas-redes/",
    "sourceType": "fact_checking",
    "sourceDate": "29 de janeiro de 2025"
  },
  {
    "claim": "Consumidores que usaram o Nubank têm direito a uma indenização de até R$ 10 mil.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação foi desmentida e fazia parte de uma fraude. Vídeos manipulados com deepfake eram usados para divulgar uma suposta indenização inexistente e levar usuários a um site falso para fornecer dados pessoais.",
    "redFlags": [
      "Promessa de indenização",
      "Valor alto e inesperado",
      "Vídeo manipulado",
      "Site falso para consulta"
    ],
    "howToVerify": [
      "Consulte informações no aplicativo ou site oficial do Nubank",
      "Não informe CPF em páginas abertas por anúncios suspeitos",
      "Procure confirmação em fontes independentes e oficiais"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/04/11/e-falso-que-nubank-esta-oferecendo-indenizacao-de-r-10-mil-para-clientes/",
    "sourceType": "fact_checking",
    "sourceDate": "11 de abril de 2025"
  },
  {
    "claim": "O Nubank aumentou o limite de crédito de usuários para R$ 6.100 por meio de uma promoção divulgada nas redes sociais.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação fazia parte de um golpe. O anúncio levava para um site que não tinha relação com o Nubank e usava elementos visuais da marca para parecer legítimo.",
    "redFlags": [
      "Aumento automático de limite",
      "Valor específico prometido",
      "Site fora do domínio oficial",
      "Uso de identidade visual da empresa"
    ],
    "howToVerify": [
      "Confira seu limite apenas no aplicativo ou site oficial",
      "Não use links patrocinados para validar uma suposta oferta bancária",
      "Confirme o domínio antes de fornecer dados"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/06/13/aumento-de-limite-de-credito-para-r-6.100-00-e-golpe-site-usa-identidade-visual-do-nubank/",
    "sourceType": "fact_checking",
    "sourceDate": "13 de junho de 2025"
  },
  {
    "claim": "A Caixa oferece uma consulta para descobrir se a pessoa tem direito a uma indenização da Receita Federal.",
    "classification": "provavelmente_falsa",
    "explanation": "A publicação levava para um site falso que imitava a Caixa. A instituição não oferecia a consulta anunciada e a página fraudulenta tentava obter dados pessoais.",
    "redFlags": [
      "Consulta de indenização",
      "Pedido de CPF",
      "Site que imita banco",
      "Promessa de dinheiro"
    ],
    "howToVerify": [
      "Digite caixa.gov.br manualmente no navegador",
      "Não informe dados pessoais em páginas de anúncios",
      "Compare o endereço do site com o domínio oficial"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/05/30/e-golpe-site-da-caixa-que-simula-consulta-de-indenizacao-da-receita/",
    "sourceType": "fact_checking",
    "sourceDate": "30 de maio de 2025"
  },
  {
    "claim": "Os Correios estão oferecendo vagas com salário de R$ 3.900 e cadastro 100% online nas redes sociais.",
    "classification": "provavelmente_falsa",
    "explanation": "Os Correios alertaram que anúncios desse tipo utilizavam indevidamente a marca da empresa e do governo. As contratações da empresa são feitas por concurso público com editais divulgados pelos canais oficiais.",
    "redFlags": [
      "Vaga sem experiência",
      "Cadastro totalmente online",
      "Uso da marca dos Correios",
      "Possível cobrança de taxa"
    ],
    "howToVerify": [
      "Consulte oportunidades diretamente em correios.com.br",
      "Procure o edital oficial do concurso",
      "Não pague taxas para links recebidos em anúncios suspeitos"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/09/01/e-golpe-anuncio-de-vagas-nos-correios-com-salario-de-r-3-900/",
    "sourceType": "fact_checking",
    "sourceDate": "1 de setembro de 2025"
  },
  {
    "claim": "A Receita Federal abriu um leilão oficial de smartphones provenientes de encomendas abandonadas, esquecidas ou confiscadas.",
    "classification": "provavelmente_falsa",
    "explanation": "A publicação foi identificada como golpe e levava para um site falso de compras. O anúncio usava o nome da Receita Federal para criar aparência de legitimidade.",
    "redFlags": [
      "Oferta de produtos muito baratos",
      "Suposto leilão oficial",
      "Uso da marca Receita Federal",
      "Link externo"
    ],
    "howToVerify": [
      "Consulte leilões diretamente nos canais oficiais da Receita",
      "Não faça pagamentos em sites enviados por anúncios suspeitos",
      "Verifique o domínio antes de continuar"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/01/21/golpe-no-facebook-usa-falso-leilao-da-receita-para-enganar-usuarios/",
    "sourceType": "fact_checking",
    "sourceDate": "21 de janeiro de 2025"
  },
  {
    "claim": "O Mercado Livre está oferecendo celulares, eletrodomésticos e outros produtos com 95% de desconto após uma pesquisa e uma roleta promocional.",
    "classification": "provavelmente_falsa",
    "explanation": "A campanha não existia. A checagem mostrou que a promoção direcionava usuários para páginas falsas que imitavam o Mercado Livre e o Mercado Pago, coletando dados e dinheiro.",
    "redFlags": [
      "Desconto extremo",
      "Questionário com prêmio",
      "Roleta promocional",
      "Página falsa de pagamento"
    ],
    "howToVerify": [
      "Verifique promoções diretamente no mercadolivre.com.br",
      "Evite questionários promocionais acessados por anúncios desconhecidos",
      "Confirme a URL antes de pagar"
    ],
    "sourceTitle": "Aos Fatos",
    "sourceUrl": "https://www.aosfatos.org/noticias/golpe-mercado-livre-desconto-celulares-geladeiras/",
    "sourceType": "fact_checking",
    "sourceDate": "4 de dezembro de 2024"
  },
  {
    "claim": "A vacina contra a dengue faz parte de um experimento mortal e não seria segura.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação foi classificada como falsa. A checagem informou que os imunizantes contra dengue foram aprovados pela Anvisa e que não existem evidências de que façam parte de um experimento mortal.",
    "redFlags": [
      "Linguagem alarmista",
      "Afirmação sem evidência",
      "Vídeo viral",
      "Ataque genérico à segurança da vacina"
    ],
    "howToVerify": [
      "Consulte informações sobre vacinas no site da Anvisa",
      "Confira orientações do Ministério da Saúde",
      "Procure estudos e fontes médicas reconhecidas"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/06/10/e-falso-que-a-vacina-da-dengue-seja-parte-de-um-experimento-letal/",
    "sourceType": "fact_checking",
    "sourceDate": "10 de junho de 2025"
  },
  {
    "claim": "Vacinas contra dengue e gripe contêm grafeno e substâncias fluorescentes.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação foi desmentida. O Ministério da Saúde informou que não há vacina aprovada pela OMS com grafeno como componente ativo e a fabricante da vacina contra dengue informou que o produto não contém grafeno ou óxido de grafeno.",
    "redFlags": [
      "Alegação sobre substância secreta",
      "Uso de microscopia como suposta prova",
      "Ausência de documentação regulatória",
      "Linguagem alarmista"
    ],
    "howToVerify": [
      "Consulte a bula aprovada pela Anvisa",
      "Confira comunicados do Ministério da Saúde",
      "Não trate vídeos de microscópio como prova isolada de composição química"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/02/17/e-falso-que-vacinas-contra-dengue-e-gripe-sejam-contaminadas-com-grafeno/",
    "sourceType": "fact_checking",
    "sourceDate": "17 de fevereiro de 2025"
  },
  {
    "claim": "Tomar caldo de cana, água de coco e uma fórmula manipulada com Eupatorium e Phosphorus cura ou previne a dengue.",
    "classification": "provavelmente_falsa",
    "explanation": "Não existe comprovação científica de que essas bebidas ou a fórmula mencionada curem ou previnam a dengue. A checagem destacou limitações metodológicas dos estudos citados e recomendou seguir o manejo clínico adequado.",
    "redFlags": [
      "Promessa de cura rápida",
      "Uso de receita caseira",
      "Ausência de evidência clínica robusta",
      "Promessa de imunidade"
    ],
    "howToVerify": [
      "Consulte orientações do Ministério da Saúde",
      "Procure atendimento de saúde para sintomas de dengue",
      "Desconfie de receitas que prometem cura ou imunidade"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/02/14/caldo-de-cana-agua-de-coco-e-formulas-manipuladas-nao-curam-a-dengue/",
    "sourceType": "fact_checking",
    "sourceDate": "14 de fevereiro de 2025"
  },
  {
    "claim": "Beber três litros de água alcalina por dia cura a dengue em 72 horas.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação foi classificada como falsa. Não há evidências científicas de que a ingestão de água alcalina cure a dengue ou elimine o vírus em 72 horas.",
    "redFlags": [
      "Promessa de cura em prazo curto",
      "Explicação pseudocientífica",
      "Recomendação de tratamento caseiro",
      "Ausência de evidência clínica"
    ],
    "howToVerify": [
      "Consulte informações de saúde em fontes oficiais",
      "Não substitua tratamento médico por receitas virais",
      "Procure orientação profissional em caso de sintomas"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/08/15/beber-agua-alcalina-nao-cura-a-dengue/",
    "sourceType": "fact_checking",
    "sourceDate": "15 de agosto de 2025"
  },
  {
    "claim": "Uma bebida feita com limão, maçã, couve, alho e mel previne ou elimina a dengue.",
    "classification": "provavelmente_falsa",
    "explanation": "A checagem concluiu que não existe comprovação científica de que a receita tenha eficácia contra a dengue. A orientação oficial é seguir o manejo clínico da doença e evitar automedicação ou receitas milagrosas.",
    "redFlags": [
      "Receita milagrosa",
      "Promessa de prevenção",
      "Promessa de eliminar a doença",
      "Ausência de evidência científica"
    ],
    "howToVerify": [
      "Consulte recomendações do Ministério da Saúde",
      "Não use receitas virais como substitutas do tratamento",
      "Confira se a alegação aparece em fontes médicas reconhecidas"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/05/08/bebida-com-limao-maca-couve-alho-e-mel-nao-previne-ou-cura-a-dengue/",
    "sourceType": "fact_checking",
    "sourceDate": "8 de maio de 2025"
  },
  {
    "claim": "Bill Gates inaugurou uma biofábrica de mosquitos em Curitiba e o episódio estaria ligado a um alerta global da OMS sobre vírus transmitidos por mosquitos.",
    "classification": "provavelmente_falsa",
    "explanation": "A alegação foi desmentida. A biofábrica em Curitiba foi viabilizada pelo Governo do Paraná e pela Fiocruz, e o alerta da OMS citado na publicação não estabelecia relação com Bill Gates ou com a unidade brasileira.",
    "redFlags": [
      "Associação de acontecimentos sem evidência",
      "Uso de figura pública para gerar suspeita",
      "Interpretação conspiratória",
      "Ausência de conexão documental"
    ],
    "howToVerify": [
      "Leia comunicados oficiais da Fiocruz e do Governo do Paraná",
      "Confira o conteúdo original do alerta da OMS",
      "Compare a data e o contexto dos dois acontecimentos"
    ],
    "sourceTitle": "Agência Lupa",
    "sourceUrl": "https://www.agencialupa.org/jornalismo/2025/07/29/bill-gates-nao-inaugurou-biofabrica-de-mosquitos-em-curitiba/",
    "sourceType": "fact_checking",
    "sourceDate": "29 de julho de 2025"
  },
  {
    "claim": "Estão dizendo que o INSS envia servidores às casas dos segurados para fazer prova de vida, revisar benefícios ou recolher dados.",
    "classification": "provavelmente_falsa",
    "explanation": "O INSS informou que não envia servidores sem aviso prévio às residências para pedir senhas, documentos, dados pessoais ou informações bancárias. Atendimentos domiciliares específicos precisam ser previamente autorizados e comunicados ao cidadão.",
    "redFlags": [
      "Visita sem agendamento",
      "Pedido de senha ou documento",
      "Uso de crachá como única prova",
      "Solicitação de pagamento"
    ],
    "howToVerify": [
      "Consulte o Meu INSS",
      "Ligue para a Central 135",
      "Não permita a entrada de visitante não agendado"
    ],
    "sourceTitle": "Instituto Nacional do Seguro Social",
    "sourceUrl": "https://www.gov.br/inss/pt-br/assuntos/e-golpe-inss-nao-vai-a-casa-dos-segurados-para-pedir-dados",
    "sourceType": "oficial",
    "sourceDate": "22 de abril de 2026"
  },
  {
    "claim": "Estão dizendo que a alíquota previdenciária paga pelo MEI aumentou em 2025.",
    "classification": "provavelmente_falsa",
    "explanation": "O INSS esclareceu que a alíquota do MEI continuou em 5% do salário mínimo. O valor do DAS aumentou porque o salário mínimo foi reajustado, e não porque o percentual da contribuição mudou.",
    "redFlags": [
      "Confusão entre valor e percentual",
      "Ausência de referência ao salário mínimo",
      "Mensagem sem fonte oficial"
    ],
    "howToVerify": [
      "Consulte o Portal do Simples Nacional",
      "Confira o valor no aplicativo oficial MEI",
      "Leia os comunicados do INSS"
    ],
    "sourceTitle": "Instituto Nacional do Seguro Social",
    "sourceUrl": "https://www.gov.br/inss/pt-br/noticias/e-falsa-a-informacao-que-aliquota-de-contribuicao-do-mei-subiu",
    "sourceType": "oficial",
    "sourceDate": "26 de fevereiro de 2025"
  },
  {
    "claim": "Estão anunciando vagas de agente de saúde com salário de até R$ 5 mil e cobrando uma taxa de inscrição.",
    "classification": "provavelmente_falsa",
    "explanation": "O anúncio analisado imitava páginas do governo e solicitava dados pessoais e pagamento por Pix. O Ministério da Saúde informou que os cursos do Programa Mais Saúde com Agente são gratuitos e que não havia inscrições abertas para aquela oferta.",
    "redFlags": [
      "Cobrança por Pix",
      "Promessa de contratação",
      "Site que imita o governo",
      "Prazo prestes a terminar"
    ],
    "howToVerify": [
      "Consulte o portal do Ministério da Saúde",
      "Não pague taxas recebidas por anúncio em rede social",
      "Confira se o endereço termina em gov.br"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2025/05/30/e-fake-anuncio-no-instagram-que-promete-vagas-para-agente-de-saude-e-salario-de-ate-r-5-mil-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "30 de maio de 2025"
  },
  {
    "claim": "Estão dizendo que a vacina da dengue do Instituto Butantan foi aplicada como um experimento em cobaias humanas.",
    "classification": "provavelmente_falsa",
    "explanation": "O Ministério da Saúde informou ao Fato ou Fake que a vacina passou pelas etapas de avaliação exigidas pelos órgãos reguladores antes de ser incorporada ao SUS. O monitoramento de eventos após a aplicação faz parte da farmacovigilância e não prova que a população tenha sido usada como cobaia.",
    "redFlags": [
      "Uso da palavra cobaia",
      "Mensagem de pânico",
      "Confusão entre monitoramento e experimento",
      "Falta de documento regulatório"
    ],
    "howToVerify": [
      "Consulte os comunicados da Anvisa",
      "Verifique as informações do Ministério da Saúde",
      "Procure o registro oficial do imunizante"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/06/19/e-fake-que-vacina-da-dengue-foi-aplicada-como-experimento-e-usou-populacao-como-cobaia.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "19 de junho de 2026"
  },
  {
    "claim": "Estão dizendo que consumir sal em excesso faz bem à saúde e não aumenta o risco de pressão alta.",
    "classification": "provavelmente_falsa",
    "explanation": "Especialista consultado pelo Fato ou Fake explicou que o excesso de sal aumenta a chance de hipertensão e pode sobrecarregar o coração e os rins. A recomendação apresentada pela fonte é limitar o consumo de sal, e não aumentá-lo.",
    "redFlags": [
      "Contraria recomendações médicas consolidadas",
      "Promessa ampla de benefício",
      "Uso seletivo de estudos",
      "Incentivo ao consumo excessivo"
    ],
    "howToVerify": [
      "Consulte orientações do Ministério da Saúde",
      "Converse com profissional de saúde",
      "Verifique recomendações da Organização Mundial da Saúde"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2025/07/14/e-fake-que-consumo-de-sal-em-excesso-faz-bem-a-saude.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "14 de julho de 2025"
  },
  {
    "claim": "Estão dizendo que apertar a tecla 2 em uma ligação sobre vacinação bloqueia o celular e permite que golpistas façam Pix.",
    "classification": "provavelmente_falsa",
    "explanation": "Especialista ouvido pelo Aos Fatos afirmou que apenas apertar uma tecla em uma ligação não permite a invasão descrita na corrente. Para obter acesso, normalmente seria necessária uma vulnerabilidade ou uma ação adicional, como instalar programa malicioso, abrir arquivo ou informar dados em página falsa.",
    "redFlags": [
      "Relato sem identificação da vítima",
      "Invasão instantânea apenas ao apertar uma tecla",
      "Número de telefone apresentado como prova",
      "Pedido para encaminhar a todos"
    ],
    "howToVerify": [
      "Não instale aplicativos enviados por desconhecidos",
      "Verifique permissões concedidas ao celular",
      "Consulte alertas de segurança de fontes especializadas"
    ],
    "sourceTitle": "Aos Fatos",
    "sourceUrl": "https://www.aosfatos.org/noticias/golpe-vacina-celular-invadido/",
    "sourceType": "fact_checking",
    "sourceDate": "6 de abril de 2026"
  },
  {
    "claim": "Uma campanha chamada Ajude a Manu está pedindo Pix para tratar uma criança com doença rara.",
    "classification": "provavelmente_falsa",
    "explanation": "O Aos Fatos verificou que a campanha utilizava vídeos manipulados e imagens de pessoas que não correspondiam à história divulgada. O site imitava plataformas legítimas de arrecadação e direcionava os pagamentos para os golpistas.",
    "redFlags": [
      "Vídeo emocional sem identificação verificável",
      "Imagens reutilizadas",
      "Site que imita plataforma de doações",
      "Pix fora de instituição conhecida"
    ],
    "howToVerify": [
      "Faça busca reversa das imagens",
      "Confirme a campanha diretamente com hospital ou família identificada",
      "Verifique o domínio da plataforma de arrecadação"
    ],
    "sourceTitle": "Aos Fatos",
    "sourceUrl": "https://www.aosfatos.org/noticias/golpe-deepfakes-imagens-crianca-doente-para-roubar-dinheiro-de-doacoes/",
    "sourceType": "fact_checking",
    "sourceDate": "17 de abril de 2025"
  },
  {
    "claim": "Estão dizendo que a vacina trivalente contra a gripe contém cepa de Covid-19 e provoca gripe.",
    "classification": "provavelmente_falsa",
    "explanation": "O Instituto Butantan esclareceu que a vacina trivalente não contém cepa do coronavírus e não causa gripe. O imunizante utiliza vírus inativados, incapazes de causar a doença nas pessoas vacinadas.",
    "redFlags": [
      "Mistura doenças diferentes",
      "Afirmação sem composição do produto",
      "Mensagem que desencoraja a vacinação",
      "Ausência de fonte sanitária"
    ],
    "howToVerify": [
      "Consulte a bula registrada",
      "Verifique o portal do Instituto Butantan",
      "Procure orientação em uma unidade de saúde"
    ],
    "sourceTitle": "Secretaria da Saúde do Estado de São Paulo",
    "sourceUrl": "https://saude.sp.gov.br/coordenadoria-de-controle-de-doencas/noticias/29042025-butantan-desmente-10-fake-news-sobre-a-vacina-trivalente-da-gripe",
    "sourceType": "oficial",
    "sourceDate": "29 de abril de 2025"
  },
  {
    "claim": "Estão oferecendo óculos de grau gratuitos em unidades de saúde de Araras.",
    "classification": "provavelmente_falsa",
    "explanation": "A Prefeitura de Araras informou que a publicação era falsa e que as unidades mencionadas não estavam distribuindo óculos gratuitamente. A circulação do conteúdo fez pessoas procurarem os locais em busca do benefício inexistente.",
    "redFlags": [
      "Oferta local sem publicação oficial",
      "Unidades específicas citadas sem contato",
      "Mensagem compartilhada em redes sociais"
    ],
    "howToVerify": [
      "Consulte o site da Prefeitura de Araras",
      "Ligue diretamente para a unidade de saúde",
      "Verifique os canais da Secretaria Municipal de Saúde"
    ],
    "sourceTitle": "Prefeitura de Araras",
    "sourceUrl": "https://araras.sp.gov.br/noticias/28402",
    "sourceType": "oficial",
    "sourceDate": "15 de setembro de 2025"
  },
  {
    "claim": "Um site que parece ser do Inep está fazendo inscrições para o Enem e cobrando por Pix ou boleto.",
    "classification": "provavelmente_falsa",
    "explanation": "O Fato ou Fake verificou páginas que imitavam a inscrição oficial do Enem para roubar dados e gerar cobranças fraudulentas. O Centro Integrado de Segurança Cibernética do Governo Digital alertou que esses endereços simulavam inscrições que não existiam.",
    "redFlags": [
      "Domínio sem gov.br",
      "Cobrança em página não oficial",
      "Aparência copiada do Inep",
      "Mensagem urgente sobre encerramento"
    ],
    "howToVerify": [
      "Acesse a Página do Participante pelos canais do Inep",
      "Confira se o domínio pertence ao gov.br",
      "Não use links patrocinados sem verificar o endereço"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/06/10/e-fake-site-nao-oficial-que-imita-pagina-de-inscricao-do-enem-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "10 de junho de 2026"
  },
  {
    "claim": "Estão anunciando a pré-venda do álbum da Copa do Mundo de 2026 e cobrando por Pix.",
    "classification": "provavelmente_falsa",
    "explanation": "A Panini informou ao Fato ou Fake que não havia pré-venda oficial no período em que os anúncios circulavam. As páginas falsas imitavam a empresa, coletavam dados pessoais e direcionavam pagamentos a uma intermediadora.",
    "redFlags": [
      "Pré-venda antes do anúncio oficial",
      "Domínio parecido com o da empresa",
      "Cronômetro de oferta",
      "Pagamento por Pix a terceiro"
    ],
    "howToVerify": [
      "Consulte panini.com.br",
      "Confira as redes oficiais da editora",
      "Verifique o nome do recebedor antes de pagar"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/02/23/e-fake-anuncio-de-pre-venda-do-album-da-copa-do-mundo-2026-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "23 de fevereiro de 2026"
  },
  {
    "claim": "A Receita Federal está enviando mensagens no WhatsApp com links para pagar dívidas e evitar o bloqueio do CPF.",
    "classification": "provavelmente_falsa",
    "explanation": "A Receita Federal desmentiu as mensagens analisadas pelo Fato ou Fake. Elas usavam dados verdadeiros das vítimas, símbolos oficiais, ameaças de bloqueio e links que levavam a páginas falsas para cobrança por Pix.",
    "redFlags": [
      "Ameaça de bloqueio imediato",
      "Link recebido por WhatsApp",
      "Uso do CPF para gerar confiança",
      "Cobrança por Pix"
    ],
    "howToVerify": [
      "Consulte sua situação no e-CAC",
      "Digite manualmente o endereço oficial da Receita",
      "Não efetue pagamento por link recebido em mensagem"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/01/22/e-fake-mensagem-de-whatsapp-em-nome-da-receita-federal-com-link-para-pagamento-de-dividas-de-impostos-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "22 de janeiro de 2026"
  },
  {
    "claim": "Uma mensagem da Receita Federal diz que existe uma pendência grave no Imposto de Renda e que o CPF será bloqueado amanhã.",
    "classification": "provavelmente_falsa",
    "explanation": "A mensagem verificada pelo Fato ou Fake levava a uma página semelhante ao gov.br e apresentava uma falsa dívida. O site ameaçava bloquear CPF, contas, cartões e Pix para pressionar a vítima a pagar uma quantia por QR Code.",
    "redFlags": [
      "Prazo termina amanhã",
      "Ameaça de bloqueio total",
      "Falsa certidão fiscal",
      "Desconto para pagamento imediato"
    ],
    "howToVerify": [
      "Consulte diretamente o e-CAC",
      "Confirme pendências no aplicativo oficial da Receita Federal",
      "Verifique o destinatário do Pix"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/02/26/e-fake-mensagem-de-whatsapp-sobre-regularizacao-de-pendencia-grave-da-receita-federal-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "26 de fevereiro de 2026"
  },
  {
    "claim": "Um site com a aparência da Shopee está oferecendo produtos em promoção relâmpago por preços muito baixos.",
    "classification": "provavelmente_falsa",
    "explanation": "A Shopee confirmou ao Fato ou Fake que a página externa e as ofertas analisadas eram falsas. O site usava preços muito baixos, estoque limitado, mensagens de urgência e pagamento por Pix fora da plataforma.",
    "redFlags": [
      "Preço muito abaixo do mercado",
      "Pagamento fora do aplicativo",
      "Site sem CNPJ ou contato",
      "Pressão por estoque limitado"
    ],
    "howToVerify": [
      "Abra o aplicativo oficial da Shopee",
      "Pesquise a oferta dentro da própria plataforma",
      "Não pague Pix solicitado por página externa"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2025/11/27/e-fake-site-que-imita-pagina-da-shopee-e-oferece-promocao-relampago-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "27 de novembro de 2025"
  },
  {
    "claim": "Mensagem avisa sobre Auxílio Reconstrução no valor de R$ 1.050 liberado via Pix mediante cadastro em site externo.",
    "classification": "provavelmente_falsa",
    "explanation": "O Ministério da Integração e do Desenvolvimento Regional informou que não há programa com esses moldes. A mensagem em circulação no WhatsApp trata-se de um golpe para capturar dados pessoais e chaves Pix das vítimas.",
    "redFlags": [
      "Promessa de dinheiro via Pix",
      "Cadastro em site externo",
      "Nome de programa governamental não confirmado"
    ],
    "howToVerify": [
      "Consulte o site oficial do Ministério da Integração e do Desenvolvimento Regional (gov.br)",
      "Não cadastre dados em sites fora do domínio gov.br",
      "Procure confirmação em veículos jornalísticos estabelecidos"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/06/17/e-fake-mensagem-que-imita-visual-do-ifood-e-oferece-link-de-raspadinha-da-copa-do-mundo-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "20 de agosto de 2026"
  },
  {
    "claim": "SMS em nome do INSS avisa pendência na prova de vida com link resolverfacil.com para biometria facial.",
    "classification": "provavelmente_falsa",
    "explanation": "O INSS esclareceu que não envia links de acesso por SMS e nem solicita reconhecimento facial fora do aplicativo Meu INSS. Páginas do domínio resolverfacil.com são fraudulentas e roubam dados e fotos do usuário.",
    "redFlags": [
      "Link fora do domínio gov.br",
      "Pedido de biometria facial por SMS",
      "Ameaça de bloqueio do benefício"
    ],
    "howToVerify": [
      "Consulte a prova de vida apenas pelo app Meu INSS",
      "Ligue para a Central 135",
      "Não clique em links recebidos por SMS"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/06/10/e-fake-mensagem-em-nome-do-inss-que-avisa-sobre-pendencia-de-prova-de-vida-e-tem-link-para-reconhecimento-facial.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "10 de junho de 2026"
  },
  {
    "claim": "iFood lançou jogo de raspadinha online da Copa do Mundo com prêmios de até R$ 30.000 no Pix.",
    "classification": "provavelmente_falsa",
    "explanation": "O iFood desmentiu a existência do concurso e alertou que o endereço eletrônico utilizado na mensagem é malicioso. A página buscava induzir o compartilhamento em massa para capturar dados cadastrais.",
    "redFlags": [
      "Prêmio alto e imediato via Pix",
      "Pedido de compartilhamento em massa",
      "Site que imita a marca iFood"
    ],
    "howToVerify": [
      "Verifique promoções apenas no aplicativo oficial do iFood",
      "Confira os canais oficiais da marca nas redes sociais",
      "Não compartilhe links de promoções não confirmadas"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2026/06/17/e-fake-mensagem-que-imita-visual-do-ifood-e-oferece-link-de-raspadinha-da-copa-do-mundo-trata-se-de-golpe.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "17 de junho de 2026"
  },
  {
    "claim": "Youtuber Felca foi expulso por Vera Magalhães do Roda Viva após revelar aplicativo de investimento de R$ 22.000 ao mês.",
    "classification": "provavelmente_falsa",
    "explanation": "O conteúdo veiculado em redes sociais é um anúncio golpista montado com auxílio de inteligência artificial. A TV Cultura e a jornalista Vera Magalhães negaram o fato e alertaram para a fraude de investimento.",
    "redFlags": [
      "Vídeo manipulado por IA",
      "Promessa de retorno financeiro alto e fixo",
      "Uso de figuras públicas sem autorização"
    ],
    "howToVerify": [
      "Confira os canais oficiais da TV Cultura e do Roda Viva",
      "Desconfie de vídeos que prometem ganhos financeiros extraordinários",
      "Procure a notícia em veículos jornalísticos estabelecidos"
    ],
    "sourceTitle": "Boatos.org",
    "sourceUrl": "https://www.boatos.org/entretenimento/felca-e-expulso-por-vera-magalhaes-do-roda-viva-ao-falar-de-investimento-incrivel.html",
    "sourceType": "fact_checking",
    "sourceDate": "3 de setembro de 2026"
  },
  {
    "claim": "Palhaço Mauro de 70 anos vende apresentações gravadas na web para custear cirurgia cardíaca e sustentar a neta.",
    "classification": "provavelmente_falsa",
    "explanation": "A história e os personagens foram fabricados por inteligência artificial. A narrativa apelativa é usada para atrair internautas a efetuarem pagamentos em plataformas não verificadas.",
    "redFlags": [
      "História emocional sem confirmação",
      "Personagem fabricado por IA",
      "Pedido de pagamento em plataforma não verificada"
    ],
    "howToVerify": [
      "Faça busca reversa das imagens do perfil",
      "Desconfie de histórias comoventes sem fonte verificável",
      "Não pague por conteúdo em páginas recém-criadas"
    ],
    "sourceTitle": "Boatos.org",
    "sourceUrl": "https://www.boatos.org/brasil/palhaco-mauro-vende-apresentacao-online-para-custear-tratamento-do-coracao.html",
    "sourceType": "fact_checking",
    "sourceDate": "2 de setembro de 2026"
  },
  {
    "claim": "Vale, Havaianas e Sadia estão dando R$ 5.000 no Dia das Mães para quem preencher pesquisa no WhatsApp.",
    "classification": "provavelmente_falsa",
    "explanation": "As empresas confirmaram que não veiculam campanhas com prêmios em dinheiro condicionadas ao repasse de links no WhatsApp. O objetivo das páginas falsas é disseminar anúncios maliciosos e roubar dados.",
    "redFlags": [
      "Pesquisa com prêmio em dinheiro",
      "Pedido de repasse no WhatsApp",
      "Uso de marcas conhecidas sem confirmação oficial"
    ],
    "howToVerify": [
      "Confira as redes sociais oficiais das marcas citadas",
      "Não preencha pesquisas recebidas por link de terceiros",
      "Desconfie de prêmios condicionados a repasse em massa"
    ],
    "sourceTitle": "Boatos.org",
    "sourceUrl": "https://www.boatos.org/tecnologia/vale-supermercados-bh-sadia-e-havaianas-dao-presentes-no-dia-das-maes.html",
    "sourceType": "fact_checking",
    "sourceDate": "8 de maio de 2026"
  },
  {
    "claim": "Cacau Show distribui prêmios de R$ 5.000 e kits de chocolate no Dia das Mães via questionário digital.",
    "classification": "provavelmente_falsa",
    "explanation": "Trata-se de um golpe de phishing recorrente em datas comemorativas. A empresa recomenda desconsiderar links externos enviados fora dos perfis verificados da marca.",
    "redFlags": [
      "Questionário digital com prêmio",
      "Data comemorativa usada como gancho",
      "Link fora dos canais oficiais"
    ],
    "howToVerify": [
      "Confira promoções apenas no site ou app oficial da Cacau Show",
      "Verifique o selo de conta verificada nas redes sociais",
      "Não preencha questionários recebidos por link de terceiros"
    ],
    "sourceTitle": "Boatos.org",
    "sourceUrl": "https://www.boatos.org/tecnologia/cacau-show-esta-dando-r-5000-de-presente-de-dia-das-maes.html",
    "sourceType": "fact_checking",
    "sourceDate": "5 de maio de 2026"
  },
  {
    "claim": "O site Gmail Premia libera saques de até R$ 2.500 via Pix para quem pagar taxa de validação.",
    "classification": "provavelmente_falsa",
    "explanation": "O Google não possui serviços de recompensas com depósitos em dinheiro via Pix. O site fraudulento retém os valores cobrados sob pretexto de \"taxa de verificação\".",
    "redFlags": [
      "Cobrança de taxa para liberar prêmio",
      "Uso indevido da marca Google/Gmail",
      "Promessa de saque em dinheiro"
    ],
    "howToVerify": [
      "O Google não pede pagamento para liberar prêmios",
      "Consulte a central de ajuda oficial do Google",
      "Desconfie de qualquer taxa cobrada antecipadamente para \"liberar\" dinheiro"
    ],
    "sourceTitle": "Boatos.org",
    "sourceUrl": "https://www.boatos.org/tecnologia/gmail-premia-permite-que-voce-realize-saque-de-premio-via-pix.html",
    "sourceType": "fact_checking",
    "sourceDate": "12 de agosto de 2026"
  },
  {
    "claim": "Vídeos enviados pelo WhatsApp contendo a palavra Hiperlog carregam vírus que apagam o celular.",
    "classification": "provavelmente_falsa",
    "explanation": "Especialistas em segurança cibernética não identificaram nenhum vetor de contaminação sob essa designação. O texto é uma corrente enganosa sem fundamento técnico.",
    "redFlags": [
      "Alerta em corrente sem fonte técnica",
      "Nome de vírus genérico e não documentado",
      "Pedido de repasse a todos os contatos"
    ],
    "howToVerify": [
      "Consulte o CERT.br para alertas reais de segurança",
      "Não repasse correntes de alerta sem confirmar a fonte",
      "Mantenha o WhatsApp e o sistema operacional atualizados"
    ],
    "sourceTitle": "Boatos.org",
    "sourceUrl": "https://www.boatos.org/tecnologia/alerta-que-aponta-que-golpistas-estao-enviando-videos-com-a-palavra-hiperlog-para-roubar-dados-no-whatsapp-nao-procede.html",
    "sourceType": "fact_checking",
    "sourceDate": "8 de maio de 2026"
  },
  {
    "claim": "O Governo Federal aprovou regras para cobrar IPVA de cadeiras de rodas e bicicletas.",
    "classification": "provavelmente_falsa",
    "explanation": "O IPVA é um tributo de competência estadual e recai exclusivamente sobre veículos automotores. Não há lei federal ou estadual prevendo a incidência de IPVA sobre bicicletas ou equipamentos de acessibilidade.",
    "redFlags": [
      "Confusão sobre competência tributária",
      "Ausência de lei ou projeto de lei citado",
      "Alegação sobre equipamento de acessibilidade"
    ],
    "howToVerify": [
      "Consulte a legislação tributária do seu estado",
      "Verifique comunicados oficiais da Secretaria da Fazenda estadual",
      "Desconfie de alegações fiscais sem citação de lei específica"
    ],
    "sourceTitle": "E-farsas",
    "sourceUrl": "https://www.e-farsas.com/o-governo-federal-vai-cobrar-ipva-de-cadeira-de-rodas.html",
    "sourceType": "fact_checking",
    "sourceDate": "27 de novembro de 2025"
  },
  {
    "claim": "Mensagens com o link r/go do Banco Central realizam a liberação imediata de Valores a Receber por Pix.",
    "classification": "provavelmente_falsa",
    "explanation": "O Banco Central adverte que o único endereço oficial para verificação e resgate de valores esquecidos é valoresareceber.bcb.gov.br. O órgão não utiliza SMS ou intermediários para o repasse desses valores.",
    "redFlags": [
      "Link encurtado ou não oficial",
      "Promessa de liberação imediata por Pix",
      "Uso indevido da marca Banco Central"
    ],
    "howToVerify": [
      "Acesse apenas valoresareceber.bcb.gov.br digitado manualmente",
      "Não use links recebidos por SMS ou WhatsApp para essa consulta",
      "Confira o domínio antes de informar CPF"
    ],
    "sourceTitle": "g1 Fato ou Fake",
    "sourceUrl": "https://g1.globo.com/fato-ou-fake/noticia/2023/03/08/e-fake-que-mensagens-com-link-nao-oficial-permitam-acesso-a-dinheiro-esquecido-veja-o-unico-link-que-vale.ghtml",
    "sourceType": "fact_checking",
    "sourceDate": "8 de março de 2023"
  }
];
