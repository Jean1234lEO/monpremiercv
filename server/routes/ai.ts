import { Router } from 'express';
import { z } from 'zod';
import { env } from '../env';
import { getClientIp } from '../lib/clientIp';
import { recordCvEvent } from '../lib/dashboard';
import { improveSectionText, isGeminiConfigured, type ImproveSection } from '../lib/gemini';
import { checkRateLimit } from '../lib/rateLimit';
import { HttpError } from '../middleware/errorHandler';

export const aiRouter = Router();

const improveSchema = z.object({
  section: z.enum(['profile', 'skills', 'projects', 'experience', 'education']),
  text: z
    .string()
    .trim()
    .min(8, 'Écris au moins quelques mots avant de demander une amélioration.')
    .max(4000, 'Texte trop long (4000 caractères max).'),
  jobTitle: z
    .string()
    .trim()
    .max(120)
    .nullable()
    .optional()
    .transform((v) => v ?? ''),
  name: z
    .string()
    .trim()
    .max(120)
    .nullable()
    .optional()
    .transform((v) => v ?? ''),
});

aiRouter.post('/improve', async (req, res, next) => {
  try {
    if (!isGeminiConfigured()) {
      throw new HttpError(
        503,
        'L’assistant IA n’est pas encore configuré. Ajoute GEMINI_API_KEY dans .env.local.',
        'AI_NOT_CONFIGURED'
      );
    }

    const body = improveSchema.parse(req.body);
    const ip = getClientIp(req);
    const limit = checkRateLimit(`ai:${ip}`, env.aiRateLimitPerHour);

    res.setHeader('X-RateLimit-Limit', String(env.aiRateLimitPerHour));
    res.setHeader('X-RateLimit-Remaining', String(limit.remaining));

    if (!limit.allowed) {
      res.setHeader('Retry-After', String(limit.retryAfterSec));
      throw new HttpError(
        429,
        `Limite d’améliorations atteinte. Réessaie dans environ ${Math.ceil(limit.retryAfterSec / 60)} min.`,
        'RATE_LIMIT'
      );
    }

    let improved: string;
    try {
      improved = await improveSectionText({
        section: body.section as ImproveSection,
        text: body.text,
        jobTitle: body.jobTitle || undefined,
        name: body.name || undefined,
      });
    } catch (upstream) {
      console.error('[ai] upstream', upstream);
      throw new HttpError(
        502,
        'L’assistant IA est temporairement indisponible. Réessaie dans un instant.',
        'AI_UPSTREAM'
      );
    }

    if (env.dashboardEnabled) {
      recordCvEvent({
        event: 'ai_improve_used',
        ip,
        metadata: { section: body.section },
        timestamp: new Date(),
      });
    }

    res.json({
      section: body.section,
      text: improved,
    });
  } catch (err) {
    next(err);
  }
});
