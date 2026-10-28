import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';
import { env } from '../env';

export class HttpError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (res.headersSent) {
    return;
  }

  // Handle malformed JSON body from express.json()
  if (
    err instanceof SyntaxError &&
    'status' in err &&
    (err as { status: number }).status === 400 &&
    'body' in err
  ) {
    res.status(400).json({
      error: 'Corps de requête JSON invalide.',
      code: 'BAD_REQUEST',
    });
    return;
  }

  if (err instanceof ZodError) {
    const first = err.issues[0]?.message ?? 'Données invalides.';
    res.status(400).json({
      error: first,
      code: 'VALIDATION_ERROR',
      // Détails structurés uniquement en dev (évite de trop exposer le schéma)
      ...(env.isProduction ? {} : { details: err.flatten() }),
    });
    return;
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message, code: err.code });
    return;
  }

  console.error('[api]', err);
  res.status(500).json({
    error: 'Une erreur serveur est survenue. Réessaie dans un instant.',
    code: 'INTERNAL_ERROR',
  });
}
