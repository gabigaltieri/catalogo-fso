import { createHmac, timingSafeEqual } from 'node:crypto';

// Gate de contraseña compartida para /admin — no hay sistema de usuarios,
// es un solo dueño de comercio. Cookie HTTP-only firmada con HMAC,
// sin sesiones en base de datos (todo se verifica de forma stateless).

export const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 días

function requireSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error('Falta la variable de entorno SESSION_SECRET');
  return secret;
}

function sign(payload: string, secret: string): string {
  return createHmac('sha256', secret).update(payload).digest('base64url');
}

export function createSessionCookieValue(): string {
  const exp = Date.now() + SESSION_DURATION_MS;
  const payload = String(exp);
  const sig = sign(payload, requireSecret());
  return `${payload}.${sig}`;
}

export function isValidSessionCookieValue(value: string | undefined | null): boolean {
  if (!value) return false;
  const dot = value.indexOf('.');
  if (dot === -1) return false;
  const payload = value.slice(0, dot);
  const sig = value.slice(dot + 1);
  if (!payload || !sig) return false;

  let expected: string;
  try {
    expected = sign(payload, requireSecret());
  } catch {
    return false;
  }

  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}
