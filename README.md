# MonPremierCV

Crée un CV professionnel (format A4), même sans expérience. Gratuit, sans inscription, sauvegarde locale.

## Prérequis

- Node.js 20+
- Une clé [Google AI Studio](https://aistudio.google.com/apikey) pour l’assistant IA (optionnel pour l’édition manuelle + PDF)

## Installation

```bash
npm install
cp .env.example .env.local
```

Édite `.env.local` et renseigne `GEMINI_API_KEY=...`.

## Développement

Lance API + front (recommandé) :

```bash
npm run dev:all
```

- Front : http://localhost:3000  
- API : http://localhost:3001 (`/api/health`, `/api/ai/improve`)  
- Vite proxy `/api` → API

Séparé :

```bash
npm run dev:api
npm run dev
```

## Production (mise en ligne)

```bash
npm run build
npm start
```

Le serveur Express sert le front (`dist/`) et l’API sur `PORT` (défaut **8080** en prod).

Variables utiles :

| Variable | Rôle |
|----------|------|
| `GEMINI_API_KEY` | Clé Gemini (serveur uniquement) |
| `GEMINI_MODEL` | Modèle (défaut `gemini-2.0-flash`) |
| `PORT` | Port d’écoute (défaut `8080` en prod, `3001` en dev) |
| `APP_URL` | URL publique pour CORS (optionnel si front & API same-origin) |
| `AI_RATE_LIMIT_PER_HOUR` | Limite d'améliorations IA / IP (défaut `30`) |
| `DASHBOARD_SECRET` | Token secret protégeant `/api/dashboard/stats` et `/api/dashboard/summary` |
| `DASHBOARD_ENABLED` | Active/désactive les métriques (défaut `true`) |

### Déploiement en 1 clic

- **Render** : Dépose le dépôt sur GitHub/GitLab, Render lit directement `render.yaml`. Renseigne juste `GEMINI_API_KEY` dans le tableau de bord Render.
- **Railway** : Nouveau projet > déployer depuis GitHub. Railway détecte le `Dockerfile` et configure le healthcheck automatiquement via `railway.json`.
- **Docker / VPS** :
  ```bash
  docker compose up -d --build
  ```

## API

- `GET /api/health` — Statut santé, version, uptime et statut IA
- `POST /api/ai/improve` — Body `{ section, text, jobTitle?, name? }` → `{ section, text }`
- `GET /api/dashboard/stats` — Statistiques anonymes (nécessite `X-Dashboard-Token`, `Authorization: Bearer <secret>` ou `?token=<secret>` si `DASHBOARD_SECRET` est défini)
- `GET /api/dashboard/summary` — Résumé texte formaté du tableau de bord
- `POST /api/dashboard/event` — Enregistrement d'événements de télémétrie anonymes

L’IA **reformule** uniquement : elle n’invente pas d’expériences.

## Export PDF

Bouton « Télécharger PDF » → impression navigateur (A4). Aucune dépendance serveur pour l’export.
