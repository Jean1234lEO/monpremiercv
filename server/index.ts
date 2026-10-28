import express from 'express';
import path from 'node:path';
import { assertServerReady, env } from './env';
import { corsMiddleware } from './middleware/cors';
import { securityHeaders } from './middleware/security';
import { requestLogger } from './middleware/logger';
import { errorHandler } from './middleware/errorHandler';
import { aiRouter } from './routes/ai';
import { healthRouter } from './routes/health';
import { dashboardRouter } from './routes/dashboard';

const app = express();

app.disable('x-powered-by');
app.set('trust proxy', 1);

// ── Security & logging ──────────────────────────────────────────────
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(requestLogger);

app.use(express.json({ limit: '120kb' }));

// ── API routes ──────────────────────────────────────────────────────
app.use('/api/health', healthRouter);
app.use('/api/ai', aiRouter);
app.use('/api/dashboard', dashboardRouter);

// ── Production: serve Vite build ────────────────────────────────────
if (env.isProduction) {
  app.use(
    express.static(env.distPath, {
      index: false,
      maxAge: '1h',
      setHeaders(res, filePath) {
        if (filePath.endsWith('index.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        }
      },
    })
  );

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api/')) {
      next();
      return;
    }
    res.sendFile(path.join(env.distPath, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
} else {
  app.get('/', (_req, res) => {
    res.json({
      message: 'API MonPremierCV (dev). Le front tourne sur Vite (port 3000) avec proxy /api.',
      health: '/api/health',
      routes: {
        ai: '/api/ai/improve',
        dashboard: '/api/dashboard/stats',
        health: '/api/health',
      },
    });
  });
}

// ── Unmatched API routes (JSON 404) ─────────────────────────────────
app.all('/api/*', (_req, res) => {
  res.status(404).json({
    error: 'Route API introuvable.',
    code: 'NOT_FOUND',
  });
});

app.use(errorHandler);

// ── Boot ────────────────────────────────────────────────────────────
const readiness = assertServerReady();
for (const warning of readiness.warnings) {
  console.warn(`[warn] ${warning}`);
}

const server = app.listen(env.port, '0.0.0.0', () => {
  console.log(
    `[monpremiercv] API ${env.isProduction ? 'prod' : 'dev'} sur http://0.0.0.0:${env.port}`
  );
  console.log(`[monpremiercv] IA : ${env.geminiApiKey ? 'clé détectée' : 'non configurée'}`);
  console.log(`[monpremiercv] Dashboard : /api/dashboard/stats`);
});

// ── Graceful shutdown ───────────────────────────────────────────────
function gracefulShutdown(signal: string): void {
  console.log(`[monpremiercv] Signal ${signal} reçu, arrêt gracieux...`);
  server.close(() => {
    console.log('[monpremiercv] Serveur arrêté proprement.');
    process.exit(0);
  });

  // Force exit after 10s if active sockets stall
  setTimeout(() => {
    console.error('[monpremiercv] Timeout dépassé, arrêt forcé.');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
