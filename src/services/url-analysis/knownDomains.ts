/**
 * Lista curada de domínios oficiais de instituições comumente usadas em
 * golpes no Brasil (bancos, marketplaces, órgãos públicos, transportadoras).
 * Usada para detectar domínios "parecidos" (typosquatting) com uma marca
 * legítima. Não exaustiva — fácil de estender.
 */
export const KNOWN_LEGITIMATE_DOMAINS: Record<string, string[]> = {
  bancos: [
    'itau.com.br',
    'bradesco.com.br',
    'santander.com.br',
    'caixa.gov.br',
    'bb.com.br',
    'nubank.com.br',
    'inter.co',
    'c6bank.com.br',
    'picpay.com',
  ],
  governo: ['gov.br', 'inss.gov.br', 'receita.fazenda.gov.br', 'anvisa.gov.br'],
  marketplaces: [
    'mercadolivre.com.br',
    'mercadopago.com.br',
    'amazon.com.br',
    'shopee.com.br',
    'magazineluiza.com.br',
    'americanas.com.br',
    'olx.com.br',
  ],
  transportadoras: ['correios.com.br', 'jadlog.com.br', 'totalexpress.com.br'],
  redes_sociais: ['whatsapp.com', 'instagram.com', 'facebook.com', 'telegram.org'],
};

export const ALL_KNOWN_DOMAINS: string[] = Object.values(KNOWN_LEGITIMATE_DOMAINS).flat();
