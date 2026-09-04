/**
 * Rate limiting simples, em memória, por identificador (normalmente IP).
 *
 * Limitação conhecida: como o sistema é stateless por design (sem banco de
 * dados) e o MVP roda em um único processo, este limitador é por instância.
 * Em produção com múltiplas instâncias (ex.: Vercel serverless), cada
 * instância mantém seu próprio contador — o efeito prático é um rate limit
 * "melhor esforço", não uma garantia global. Para uma garantia global,
 * trocar esta implementação por um adapter baseado em Redis/Upstash mantendo
 * a mesma interface `RateLimiter`.
 *
 * Nenhum dado pessoal é armazenado: apenas um hash do identificador e
 * contadores numéricos, todos expurgados automaticamente após a janela.
 */

import { createHash } from 'crypto';

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
  limit: number;
}

export interface RateLimiter {
  check(identifier: string): RateLimitResult;
}

interface Bucket {
  count: number;
  windowStartMs: number;
}

function hashIdentifier(identifier: string): string {
  // Não armazenamos o IP em texto puro, mesmo em memória de curto prazo.
  return createHash('sha256').update(identifier).digest('hex');
}

export class InMemoryRateLimiter implements RateLimiter {
  private buckets = new Map<string, Bucket>();
  private lastSweep = Date.now();

  constructor(
    private readonly limit: number,
    private readonly windowMs: number,
  ) {}

  check(identifier: string): RateLimitResult {
    this.maybeSweep();

    const key = hashIdentifier(identifier);
    const now = Date.now();
    const existing = this.buckets.get(key);

    if (!existing || now - existing.windowStartMs >= this.windowMs) {
      this.buckets.set(key, { count: 1, windowStartMs: now });
      return {
        allowed: true,
        remaining: this.limit - 1,
        resetAtMs: now + this.windowMs,
        limit: this.limit,
      };
    }

    if (existing.count >= this.limit) {
      return {
        allowed: false,
        remaining: 0,
        resetAtMs: existing.windowStartMs + this.windowMs,
        limit: this.limit,
      };
    }

    existing.count += 1;
    return {
      allowed: true,
      remaining: this.limit - existing.count,
      resetAtMs: existing.windowStartMs + this.windowMs,
      limit: this.limit,
    };
  }

  /** Remove buckets expirados periodicamente para não vazar memória. */
  private maybeSweep() {
    const now = Date.now();
    if (now - this.lastSweep < this.windowMs) return;
    this.lastSweep = now;
    for (const [key, bucket] of this.buckets.entries()) {
      if (now - bucket.windowStartMs >= this.windowMs) {
        this.buckets.delete(key);
      }
    }
  }
}

// Limites: 10 análises a cada 5 minutos por IP, e um limite mais amplo
// (anti-burst) de 30 requisições por minuto para qualquer rota de API.
export const analysisRateLimiter = new InMemoryRateLimiter(10, 5 * 60 * 1000);
export const burstRateLimiter = new InMemoryRateLimiter(30, 60 * 1000);

/**
 * Extrai um identificador razoável do request para fins de rate limiting.
 * Nunca confiar cegamente em X-Forwarded-For em produção sem um proxy
 * confiável na frente — aqui usamos o primeiro IP informado como melhor
 * esforço, adequado para plataformas como Vercel/Cloudflare que preenchem
 * esse header de forma confiável.
 */
export function getClientIdentifier(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() ?? 'unknown';
  }
  const realIp = headers.get('x-real-ip');
  if (realIp) return realIp;
  return 'unknown';
}
