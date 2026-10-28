import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import dotenv from 'dotenv';

dotenv.config({ path: resolve(process.cwd(), '.env.local') });
dotenv.config({ path: resolve(process.cwd(), '.env') });

const distPath = resolve(process.cwd(), 'dist');

const nodeEnv = process.env.NODE_ENV ?? 'development';
const isProduction =
  nodeEnv === 'production' || process.env.SERVE_STATIC === 'true';

export const env = {
  nodeEnv,
  isProduction,
  port: Number(process.env.PORT ?? (isProduction ? 8080 : 3001)),
  geminiApiKey: process.env.GEMINI_API_KEY?.trim() ?? '',
  geminiModel: process.env.GEMINI_MODEL?.trim() || 'gemini-2.0-flash',
  appUrl: process.env.APP_URL?.trim() || '',
  distPath,
  aiRateLimitPerHour: Number(process.env.AI_RATE_LIMIT_PER_HOUR ?? 30),
  dashboardEnabled: process.env.DASHBOARD_ENABLED !== 'false',
  /** If set, GET /api/dashboard/stats|summary require header X-Dashboard-Token */
  dashboardSecret: process.env.DASHBOARD_SECRET?.trim() || '',
};

export function assertServerReady(): { ok: boolean; warnings: string[] } {
  const warnings: string[] = [];

  if (!env.geminiApiKey || env.geminiApiKey === 'MY_GEMINI_API_KEY') {
    warnings.push(
      'GEMINI_API_KEY manquante ou placeholder : les routes /api/ai/* renverront 503 jusqu’à configuration.'
    );
  }

  if (env.isProduction && !existsSync(env.distPath)) {
    warnings.push('Dossier dist/ introuvable : lance `npm run build` avant `npm start`.');
  }

  if (env.isProduction && !env.appUrl) {
    warnings.push(
      'APP_URL non défini : CORS cross-origin sera refusé (OK si front et API sont same-origin).'
    );
  }

  if (env.dashboardEnabled && env.isProduction && !env.dashboardSecret) {
    warnings.push(
      'DASHBOARD_SECRET non défini : /api/dashboard/stats est public. Définis un secret pour le protéger.'
    );
  }

  return { ok: true, warnings };
}
