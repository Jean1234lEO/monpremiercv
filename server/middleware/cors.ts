import type { NextFunction, Request, Response } from 'express';
import { env } from '../env';

function isOriginAllowed(origin: string): boolean {
  if (!env.isProduction) {
    // Dev: Vite (:3000) + API (:3001) — allow localhost variants
    try {
      const url = new URL(origin);
      return url.hostname === 'localhost' || url.hostname === '127.0.0.1';
    } catch {
      return false;
    }
  }

  if (!env.appUrl) {
    // Same-origin deploy (Express sert le front) : pas de CORS cross-origin requis
    return false;
  }

  const normalizedOrigin = origin.replace(/\/$/, '');
  const allowedList = env.appUrl
    .split(',')
    .map((u) => u.trim().replace(/\/$/, ''))
    .filter(Boolean);

  return allowedList.includes(normalizedOrigin);
}

/**
 * CORS strict : refuse les origines non autorisées au lieu de renvoyer
 * Access-Control-Allow-Origin « par défaut ».
 */
export function corsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const origin = req.headers.origin;

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Dashboard-Token');
  res.setHeader('Access-Control-Max-Age', '86400');
  res.setHeader('Vary', 'Origin');

  // Requêtes same-origin / outils CLI sans header Origin
  if (!origin) {
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }
    next();
    return;
  }

  if (!isOriginAllowed(origin)) {
    if (req.method === 'OPTIONS') {
      res.status(403).end();
      return;
    }
    res.status(403).json({
      error: 'Origine non autorisée.',
      code: 'CORS_DENIED',
    });
    return;
  }

  res.setHeader('Access-Control-Allow-Origin', origin);

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  next();
}
