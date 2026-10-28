import type { NextFunction, Request, Response } from 'express';

/**
 * Lightweight request logger for API calls.
 * Logs method, path, status code, and response time.
 */
export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  // Only log API requests to keep output clean
  if (!req.path.startsWith('/api/')) {
    next();
    return;
  }

  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const color = status >= 400 ? '\x1b[31m' : status >= 300 ? '\x1b[33m' : '\x1b[32m';
    const reset = '\x1b[0m';

    console.log(
      `${color}${req.method}${reset} ${req.path} → ${color}${status}${reset} (${duration}ms)`
    );
  });

  next();
}
