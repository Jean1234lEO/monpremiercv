import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import { env } from '../env';
import { isGeminiConfigured } from '../lib/gemini';
import { getDashboardStats, recordCvEvent, type CvEvent } from '../lib/dashboard';
import { getClientIp } from '../lib/clientIp';
import { z } from 'zod';
import { HttpError } from '../middleware/errorHandler';
import { checkRateLimit } from '../lib/rateLimit';

export const dashboardRouter = Router();

function requireDashboard(_req: Request, _res: Response, next: NextFunction): void {
  if (!env.dashboardEnabled) {
    next(new HttpError(404, 'Dashboard désactivé.', 'DASHBOARD_DISABLED'));
    return;
  }
  next();
}

/**
 * Secures GET access to dashboard stats/summary if DASHBOARD_SECRET is configured.
 * Accepts token via:
 * - Header: `X-Dashboard-Token: <secret>`
 * - Header: `Authorization: Bearer <secret>`
 * - Query param: `?token=<secret>`
 */
function requireDashboardAuth(req: Request, _res: Response, next: NextFunction): void {
  if (!env.dashboardSecret) {
    next();
    return;
  }

  const authHeader = req.headers.authorization;
  const tokenFromAuth = authHeader?.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : undefined;
  const tokenFromHeader = req.headers['x-dashboard-token'] as string | undefined;
  const tokenFromQuery = typeof req.query.token === 'string' ? req.query.token : undefined;

  const providedToken = tokenFromHeader || tokenFromAuth || tokenFromQuery;

  if (!providedToken || providedToken !== env.dashboardSecret) {
    next(
      new HttpError(
        401,
        'Accès non autorisé : token dashboard invalide ou manquant.',
        'UNAUTHORIZED'
      )
    );
    return;
  }

  next();
}

dashboardRouter.use(requireDashboard);

// ── GET /api/dashboard/stats ────────────────────────────────────────
dashboardRouter.get('/stats', requireDashboardAuth, (_req, res) => {
  const stats = getDashboardStats();
  res.json({
    ...stats,
    server: {
      env: env.isProduction ? 'production' : 'development',
      aiConfigured: isGeminiConfigured(),
      model: isGeminiConfigured() ? env.geminiModel : null,
      uptime: Math.floor(process.uptime()),
      memoryMB: Math.round(process.memoryUsage().rss / 1024 / 1024),
    },
    timestamp: new Date().toISOString(),
  });
});

// ── POST /api/dashboard/event ───────────────────────────────────────
// Records anonymous analytics events from the frontend
const eventSchema = z.object({
  event: z.enum([
    'cv_created',
    'cv_downloaded',
    'cv_previewed',
    'template_changed',
    'ai_improve_used',
    'preset_loaded',
    'json_exported',
    'json_imported',
    'photo_uploaded',
  ]),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

dashboardRouter.post('/event', (req, res, next) => {
  try {
    const ip = getClientIp(req);
    // Rate-limit: max 120 events per IP per hour
    const limit = checkRateLimit(`dash:${ip}`, 120);

    if (!limit.allowed) {
      throw new HttpError(
        429,
        'Trop de requêtes. Réessaie plus tard.',
        'RATE_LIMIT'
      );
    }

    const body = eventSchema.parse(req.body);

    recordCvEvent({
      event: body.event as CvEvent['event'],
      ip,
      metadata: body.metadata,
      timestamp: new Date(),
    });

    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

// ── GET /api/dashboard/summary ──────────────────────────────────────
// Returns a text summary suitable for a simple admin view
dashboardRouter.get('/summary', requireDashboardAuth, (_req, res) => {
  const stats = getDashboardStats();
  const lines = [
    `📊 MonPremierCV — Tableau de bord`,
    `─────────────────────────────────────`,
    `📝 CV créés          : ${stats.totalCvsCreated}`,
    `📥 CV téléchargés    : ${stats.totalDownloads}`,
    `🤖 Améliorations IA  : ${stats.totalAiImprovements}`,
    `📋 Presets chargés   : ${stats.totalPresetsLoaded}`,
    `📤 Exports JSON      : ${stats.totalJsonExports}`,
    `📥 Imports JSON      : ${stats.totalJsonImports}`,
    `📷 Photos uploadées  : ${stats.totalPhotoUploads}`,
    `🎨 Templates changés : ${stats.totalTemplateChanges}`,
    `─────────────────────────────────────`,
    `⏱  Uptime serveur    : ${Math.floor(process.uptime())}s`,
    `🔑 IA configurée     : ${isGeminiConfigured() ? 'Oui' : 'Non'}`,
  ];

  res.type('text/plain').send(lines.join('\n'));
});
