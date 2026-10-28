/**
 * In-memory dashboard analytics store (process-scoped, resets on restart).
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

export function recordCvEvent(event: CvEvent): void {
  events.push(event);
  if (events.length > MAX_EVENTS) {
    events.splice(0, events.length - MAX_EVENTS);
  }
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
  /** Never includes raw IPs */
  recentEvents: PublicRecentEvent[];
}

export function getDashboardStats(): DashboardStats {
  const count = (type: CvEvent['event']) =>
    events.filter((e) => e.event === type).length;

  const uniqueIps = new Set(events.map((e) => e.ip));

  return {
    totalCvsCreated: count('cv_created'),
    totalDownloads: count('cv_downloaded'),
    totalAiImprovements: count('ai_improve_used'),
    totalPresetsLoaded: count('preset_loaded'),
    totalJsonExports: count('json_exported'),
    totalJsonImports: count('json_imported'),
    totalPhotoUploads: count('photo_uploaded'),
    totalTemplateChanges: count('template_changed'),
    totalPreviews: count('cv_previewed'),
    uniqueUsers: uniqueIps.size,
    recentEvents: events
      .slice(-20)
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
  }
}, 60 * 60 * 1000).unref?.();
