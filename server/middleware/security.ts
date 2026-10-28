import type { NextFunction, Request, Response } from 'express';
import { env } from '../env';

/**
 * Security headers. HSTS only in production (avoid locking localhost to HTTPS).
 */
export function securityHeaders(_req: Request, res: Response, next: NextFunction): void {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader(
    'Permissions-Policy',
    'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  );

  const connectSrc = ["'self'"];
  if (env.appUrl) {
    for (const u of env.appUrl.split(',')) {
      const trimmed = u.trim().replace(/\/$/, '');
      if (trimmed && !connectSrc.includes(trimmed)) {
        connectSrc.push(trimmed);
      }
    }
  }

  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com",
      "img-src 'self' data: blob:",
      `connect-src ${connectSrc.join(' ')}`,
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );

  if (env.isProduction) {
    res.setHeader(
      'Strict-Transport-Security',
      'max-age=31536000; includeSubDomains'
    );
  }

  next();
}
