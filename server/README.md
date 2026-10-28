# Backend MonPremierCV

API Express qui sert l’IA Gemini (clé serveur), le healthcheck, le dashboard analytics, et le front en production.

## Démarrage

```bash
# Dev (API seule, port 3001)
npm run dev:api

# Dev API + front Vite
npm run dev:all

# Prod
npm run build && npm start
```

## Configuration

Variables dans `.env` ou variables d'environnement de production :

- `GEMINI_API_KEY` : Clé API Google Gemini requise pour `/api/ai/improve`
- `GEMINI_MODEL` : Modèle Gemini (défaut `gemini-2.0-flash`)
- `PORT` : Port d'écoute (`3001` dev, `8080` prod)
- `APP_URL` : Origines autorisées (CORS), séparées par virgule si multiples
- `AI_RATE_LIMIT_PER_HOUR` : Requêtes max par IP / heure (défaut `30`)
- `DASHBOARD_SECRET` : Secret pour sécuriser `/api/dashboard/stats` et `/api/dashboard/summary`
- `DASHBOARD_ENABLED` : Active/désactive les métriques (défaut `true`)

## Routes

| Méthode | Chemin | Rôle | Sécurité |
|---------|--------|------|----------|
| GET | `/api/health` | Statut serveur + IA | Public |
| POST | `/api/ai/improve` | Reformule une section de CV | Rate-limit (30/h) |
| GET | `/api/dashboard/stats` | Stats anonymes (JSON) | Protégé si `DASHBOARD_SECRET` |
| GET | `/api/dashboard/summary` | Résumé texte admin | Protégé si `DASHBOARD_SECRET` |
| POST | `/api/dashboard/event` | Enregistre un événement | Rate-limit (120/h) |

En production, Express sert aussi `dist/` (SPA).
