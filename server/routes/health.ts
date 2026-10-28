import { Router } from 'express';
import { assertServerReady, env } from '../env';
import { isGeminiConfigured } from '../lib/gemini';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  const readiness = assertServerReady();
  const aiConfigured = isGeminiConfigured();

  res.json({
    status: 'ok',
    service: 'monpremiercv',
    version: '1.0.0',
    env: env.isProduction ? 'production' : 'development',
    // Top-level fields consumed by the frontend client
    aiConfigured,
    warnings: readiness.warnings,
    features: {
      ai: {
        configured: aiConfigured,
        model: aiConfigured ? env.geminiModel : null,
        rateLimit: `${env.aiRateLimitPerHour}/h`,
      },
      dashboard: {
        enabled: env.dashboardEnabled,
        endpoint: '/api/dashboard/stats',
        protected: Boolean(env.dashboardSecret),
      },
    },
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});
