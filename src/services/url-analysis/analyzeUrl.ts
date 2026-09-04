/**
 * Análise heurística de URL — feita inteiramente sobre a STRING da URL,
 * sem nunca acessar o link automaticamente. Isso evita expor o sistema (e o
 * usuário) a SSRF, malware ou rastreamento via um link potencialmente
 * malicioso. Uma evolução futura poderia integrar um serviço de sandbox de
 * varredura de URLs (ex.: Google Safe Browsing API, VirusTotal) por trás
 * desta mesma interface, sem mudar o restante do sistema.
 *
 * A lista de domínios oficiais de referência (para detecção de typosquatting)
 * é injetada como parâmetro — vem do KnowledgeProvider (Supabase por padrão,
 * com fallback estático embutido), nunca hardcoded aqui.
 */

export interface UrlAnalysis {
  originalUrl: string;
  valid: boolean;
  hostname?: string;
  usesHttps?: boolean;
  isPunycode?: boolean;
  subdomainDepth?: number;
  suspiciousTld?: boolean;
  lookalikeOf?: string;
  lookalikeDistance?: number;
  warnings: string[];
}

const SUSPICIOUS_TLDS = ['.xyz', '.top', '.click', '.gq', '.tk', '.ml', '.cf', '.info', '.work'];

/** Distância de Levenshtein simples, suficiente para strings curtas (domínios). */
function levenshtein(a: string, b: string): number {
  const dp: number[][] = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i]![0] = i;
  for (let j = 0; j <= b.length; j++) dp[0]![j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i]![j] = Math.min(dp[i - 1]![j]! + 1, dp[i]![j - 1]! + 1, dp[i - 1]![j - 1]! + cost);
    }
  }
  return dp[a.length]![b.length]!;
}

function findLookalike(hostname: string, knownDomains: string[]): { domain: string; distance: number } | null {
  let best: { domain: string; distance: number } | null = null;
  for (const known of knownDomains) {
    if (hostname === known) return null; // é o domínio oficial, não um lookalike
    const distance = levenshtein(hostname, known);
    // Só considera "parecido" se for próximo o suficiente para confundir,
    // mas não idêntico.
    const threshold = Math.max(1, Math.floor(known.length * 0.2));
    if (distance <= threshold && (!best || distance < best.distance)) {
      best = { domain: known, distance };
    }
  }
  return best;
}

export function analyzeUrl(rawUrl: string, knownDomains: string[] = []): UrlAnalysis {
  const warnings: string[] = [];
  let url: URL;
  try {
    url = new URL(rawUrl.trim());
  } catch {
    return { originalUrl: rawUrl, valid: false, warnings: ['Não foi possível interpretar essa URL.'] };
  }

  const hostname = url.hostname.toLowerCase();
  const usesHttps = url.protocol === 'https:';
  const isPunycode = hostname.includes('xn--');
  const subdomainDepth = hostname.split('.').length - 2;
  const suspiciousTld = SUSPICIOUS_TLDS.some((tld) => hostname.endsWith(tld));
  const lookalike = findLookalike(hostname, knownDomains);

  if (!usesHttps) warnings.push('O link não usa HTTPS (conexão não criptografada) — evite inserir dados nele.');
  if (isPunycode) warnings.push('O domínio usa codificação Punycode, uma técnica comum para imitar letras de domínios legítimos.');
  if (subdomainDepth > 2) warnings.push('O domínio tem muitos subdomínios, uma técnica usada para tentar disfarçar o domínio real.');
  if (suspiciousTld) warnings.push('O domínio usa uma extensão (TLD) frequentemente associada a sites fraudulentos.');
  if (lookalike) {
    warnings.push(`O domínio é parecido com "${lookalike.domain}", mas não é idêntico — possível tentativa de imitação.`);
  }

  return {
    originalUrl: rawUrl,
    valid: true,
    hostname,
    usesHttps,
    isPunycode,
    subdomainDepth,
    suspiciousTld,
    lookalikeOf: lookalike?.domain,
    lookalikeDistance: lookalike?.distance,
    warnings,
  };
}
