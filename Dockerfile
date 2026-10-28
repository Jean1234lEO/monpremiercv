# ╔══════════════════════════════════════════════════════════════════════╗
# ║  MonPremierCV — Dockerfile multi-stage optimisé                     ║
# ╚══════════════════════════════════════════════════════════════════════╝

# ── Stage 1: Build ───────────────────────────────────────────────────
FROM node:22-alpine AS build
WORKDIR /app

# Install deps first (Docker cache layer: uses npm ci if lockfile exists, else npm install)
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --ignore-scripts; else npm install --ignore-scripts; fi

# Copy source and build
COPY . .
RUN npm run build

# ── Stage 2: Production runtime ─────────────────────────────────────
FROM node:22-alpine AS runtime
WORKDIR /app

# Security: run as non-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

ENV NODE_ENV=production
ENV PORT=8080

# Production deps only
COPY package.json package-lock.json* ./
RUN if [ -f package-lock.json ]; then npm ci --omit=dev --ignore-scripts; else npm install --omit=dev --ignore-scripts; fi && npm cache clean --force

# Copy built artifacts
COPY --from=build /app/dist ./dist
COPY --from=build /app/server.js ./server.js

# Switch to non-root user
USER appuser

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:8080/api/health || exit 1

CMD ["node", "server.js"]
