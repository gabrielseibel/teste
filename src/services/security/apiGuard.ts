import { NextResponse } from 'next/server';
import { analysisRateLimiter, burstRateLimiter, getClientIdentifier } from './rateLimit';

export interface RateLimitCheckResult {
  blocked: boolean;
  response?: NextResponse;
}

/**
 * Aplica dois limites simultaneamente: um limite anti-burst (mais permissivo,
 * pega automações muito agressivas) e um limite de análises (mais restrito,
 * protege o serviço contra abuso/spam).
 */
export function checkRateLimit(request: Request): RateLimitCheckResult {
  const identifier = getClientIdentifier(request.headers);

  const burst = burstRateLimiter.check(identifier);
  if (!burst.allowed) {
    return { blocked: true, response: tooManyRequests(burst.resetAtMs) };
  }

  const analysis = analysisRateLimiter.check(identifier);
  if (!analysis.allowed) {
    return { blocked: true, response: tooManyRequests(analysis.resetAtMs) };
  }

  return { blocked: false };
}

function tooManyRequests(resetAtMs: number): NextResponse {
  const retryAfterSeconds = Math.max(1, Math.ceil((resetAtMs - Date.now()) / 1000));
  return NextResponse.json(
    {
      error: 'Muitas solicitações em pouco tempo. Aguarde um momento antes de tentar novamente.',
    },
    {
      status: 429,
      headers: { 'Retry-After': String(retryAfterSeconds) },
    },
  );
}

export function badRequest(message: string): NextResponse {
  return NextResponse.json({ error: message }, { status: 400 });
}

export function serverError(message = 'Ocorreu um erro ao processar sua solicitação. Tente novamente em instantes.'): NextResponse {
  return NextResponse.json({ error: message }, { status: 500 });
}
