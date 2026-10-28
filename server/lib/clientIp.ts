import type { Request } from 'express';

/**
 * Client IP for rate-limiting.
 * Relies on Express `trust proxy` — never read X-Forwarded-For manually
 * (spoofable by the client and would bypass rate limits).
 */
export function getClientIp(req: Request): string {
  const ip = req.ip || req.socket.remoteAddress || 'anonymous';
  // Normalize IPv6-mapped IPv4 (:ffff:1.2.3.4 → 1.2.3.4)
  return ip.startsWith('::ffff:') ? ip.slice(7) : ip;
}
