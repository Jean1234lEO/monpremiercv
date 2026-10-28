import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';

/**
 * Dashboard analytics store with file-backed persistence.
 */

export interface CvEvent {
  event:
    | 'cv_created'
    | 'cv_downloaded'
    | 'cv_previewed'
    | 'template_changed'
    | 'ai_improve_used'
    | 'preset_loaded'
    | 'json_exported'
    | 'json_imported'
    | 'photo_uploaded';
  ip: string;
  metadata?: Record<string, string | number | boolean>;
  timestamp: Date;
}

export interface PublicRecentEvent {
  event: CvEvent['event'];
  timestamp: string;
  metadata?: Record<string, string | number | boolean>;
}

const events: CvEvent[] = [];
const MAX_EVENTS = 10_000;
const DATA_DIR = resolve(process.cwd(), 'data');
const DATA_FILE = resolve(DATA_DIR, 'events.json');

// Restore persisted events on startup if file exists
try {
  if (existsSync(DATA_FILE)) {
    const raw = readFileSync(DATA_FILE, 'utf8');
    const parsed = JSON.parse(raw) as Array<Omit<CvEvent, 'timestamp'> & { timestamp: string }>;
    if (Array.isArray(parsed)) {
      for (const item of parsed.slice(-MAX_EVENTS)) {
        events.push({
          ...item,
          timestamp: new Date(item.timestamp),
        });
      }
      console.log(`[dashboard] ${events.length} événements historiques chargés.`);
    }
  }
} catch (e) {
  console.warn('[dashboard] Impossible de charger les données historiques:', e);
}

let saveTimeout: NodeJS.Timeout | null = null;
function schedulePersist(): void {
  if (saveTimeout) return;
  saveTimeout = setTimeout(() => {
    saveTimeout = null;
    try {
      if (!existsSync(DATA_DIR)) {
        mkdirSync(DATA_DIR, { recursive: true });
      }
      writeFileSync(DATA_FILE, JSON.stringify(events.slice(-5000), null, 2), 'utf8');
    } catch {
      // Ignored in read-only filesystems (e.g. serverless)
    }
  }, 3000);
  saveTimeout.unref?.();
}

export function recordCvEvent(event: CvEvent): void {
  events.push(event);
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }
  schedulePersist();
}

export interface DashboardStats {
  totalCvsCreated: number;
  totalDownloads: number;
  totalAiImprovements: number;
  totalPresetsLoaded: number;
  totalJsonExports: number;
  totalJsonImports: number;
  totalPhotoUploads: number;
  totalTemplateChanges: number;
  totalPreviews: number;
  uniqueUsers: number;
  conversionRate: number;
  templates: Record<string, number>;
  aiSections: Record<string, number>;
  /** Never includes raw IPs */
  recentEvents: PublicRecentEvent[];
}

export function getDashboardStats(): DashboardStats {
  const count = (type: CvEvent['event']) =>
    events.filter((e) => e.event === type).length;

  const uniqueIps = new Set(events.map((e) => e.ip));
  const cvsCreated = count('cv_created');
  const downloads = count('cv_downloaded');

  // Breakdown by template
  const templates: Record<string, number> = {
    classic: 0,
    modern: 0,
    'two-column': 0,
    minimalist: 0,
  };

  // Breakdown by AI section
  const aiSections: Record<string, number> = {
    profile: 0,
    skills: 0,
    projects: 0,
    experience: 0,
    education: 0,
  };

  for (const e of events) {
    if (e.metadata?.templateId && typeof e.metadata.templateId === 'string') {
      const t = e.metadata.templateId;
      templates[t] = (templates[t] || 0) + 1;
    }
    if (e.event === 'ai_improve_used' && e.metadata?.section && typeof e.metadata.section === 'string') {
      const s = e.metadata.section;
      aiSections[s] = (aiSections[s] || 0) + 1;
    }
  }

  const conversionRate = cvsCreated > 0
    ? Math.round((downloads / cvsCreated) * 100)
    : downloads > 0 ? 100 : 0;

  return {
    totalCvsCreated: cvsCreated,
    totalDownloads: downloads,
    totalAiImprovements: count('ai_improve_used'),
    totalPresetsLoaded: count('preset_loaded'),
    totalJsonExports: count('json_exported'),
    totalJsonImports: count('json_imported'),
    totalPhotoUploads: count('photo_uploaded'),
    totalTemplateChanges: count('template_changed'),
    totalPreviews: count('cv_previewed'),
    uniqueUsers: uniqueIps.size,
    conversionRate,
    templates,
    aiSections,
    recentEvents: events
      .slice(-30)
      .reverse()
      .map((e) => ({
        event: e.event,
        timestamp: e.timestamp.toISOString(),
        ...(e.metadata ? { metadata: e.metadata } : {}),
      })),
  };
}

setInterval(() => {
  const cutoff = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let i = 0;
  while (i < events.length && events[i].timestamp.getTime() < cutoff) {
    i++;
  }
  if (i > 0) {
    events.splice(0, i);
    schedulePersist();
  }
}, 60 * 60 * 1000).unref?.();
