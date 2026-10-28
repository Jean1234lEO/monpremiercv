export type AiSection = 'profile' | 'skills' | 'projects' | 'experience' | 'education';

export type DashboardEvent =
  | 'cv_created'
  | 'cv_downloaded'
  | 'cv_previewed'
  | 'template_changed'
  | 'ai_improve_used'
  | 'preset_loaded'
  | 'json_exported'
  | 'json_imported'
  | 'photo_uploaded';

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code = 'ERROR') {
    super(message);
    this.status = status;
    this.code = code;
  }
}

async function parseError(res: Response): Promise<ApiError> {
  try {
    const data = (await res.json()) as { error?: string; code?: string };
    return new ApiError(
      res.status,
      data.error || 'Une erreur est survenue.',
      data.code || 'ERROR'
    );
  } catch {
    return new ApiError(res.status, 'Une erreur est survenue.');
  }
}

export async function fetchHealth(): Promise<{
  status: string;
  aiConfigured: boolean;
  warnings: string[];
}> {
  const res = await fetch('/api/health');
  if (!res.ok) throw await parseError(res);
  return res.json();
}

export async function improveCvSection(params: {
  section: AiSection;
  text: string;
  jobTitle?: string;
  name?: string;
}): Promise<string> {
  const res = await fetch('/api/ai/improve', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });

  if (!res.ok) throw await parseError(res);

  const data = (await res.json()) as { text?: string };
  if (!data.text) {
    throw new ApiError(500, 'Réponse IA incomplete.', 'EMPTY_RESPONSE');
  }
  return data.text;
}

export interface DashboardStatsResponse {
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
  conversionRate?: number;
  templates?: Record<string, number>;
  aiSections?: Record<string, number>;
  recentEvents: Array<{
    event: DashboardEvent;
    timestamp: string;
    metadata?: Record<string, unknown>;
  }>;
  server?: {
    env?: string;
    platform?: string;
    aiConfigured: boolean;
    uptime?: number;
    memoryMB?: number;
  };
}

export async function fetchDashboardStats(token?: string): Promise<DashboardStatsResponse> {
  const headers: Record<string, string> = {};
  if (token) {
    headers['X-Dashboard-Token'] = token;
  }
  const url = token
    ? `/api/dashboard/stats?token=${encodeURIComponent(token)}`
    : '/api/dashboard/stats';

  const res = await fetch(url, { headers });
  if (!res.ok) throw await parseError(res);
  return res.json();
}

const LOCAL_EVENTS_KEY = 'monpremiercv_analytics_events';

/**
 * Send an anonymous analytics event to the dashboard.
 * Fire-and-forget: errors are silently ignored to never block the user.
 * Also keeps a local mirror so the dashboard works even offline or in static deploy.
 */
export function trackEvent(
  event: DashboardEvent,
  metadata?: Record<string, unknown>
): void {
  // 1. Mirror locally in browser storage
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({
      event,
      timestamp: new Date().toISOString(),
      metadata,
    });
    // Keep max 500 local events
    if (list.length > 500) list.splice(0, list.length - 500);
    localStorage.setItem(LOCAL_EVENTS_KEY, JSON.stringify(list));
  } catch {
    // Ignore storage issues
  }

  // 2. Transmit to backend
  fetch('/api/dashboard/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, metadata }),
  }).catch(() => {
    // Silently ignore — analytics must never degrade UX
  });
}

/**
 * Read local analytics if server is unreachable
 */
export function getLocalDashboardStats(): DashboardStatsResponse {
  try {
    const raw = localStorage.getItem(LOCAL_EVENTS_KEY);
    const list: Array<{ event: DashboardEvent; timestamp: string; metadata?: Record<string, unknown> }> = raw
      ? JSON.parse(raw)
      : [];

    const count = (type: DashboardEvent) => list.filter((e) => e.event === type).length;
    const cvsCreated = count('cv_created');
    const downloads = count('cv_downloaded');

    const templates: Record<string, number> = { classic: 0, modern: 0, 'two-column': 0, minimalist: 0 };
    const aiSections: Record<string, number> = { profile: 0, skills: 0, projects: 0, experience: 0, education: 0 };

    for (const e of list) {
      if (e.metadata?.templateId && typeof e.metadata.templateId === 'string') {
        templates[e.metadata.templateId] = (templates[e.metadata.templateId] || 0) + 1;
      }
      if (e.event === 'ai_improve_used' && e.metadata?.section && typeof e.metadata.section === 'string') {
        aiSections[e.metadata.section] = (aiSections[e.metadata.section] || 0) + 1;
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
      uniqueUsers: 1,
      conversionRate,
      templates,
      aiSections,
      recentEvents: list.slice(-30).reverse(),
      server: {
        aiConfigured: false,
        platform: 'navigateur-local',
      },
    };
  } catch {
    return {
      totalCvsCreated: 0,
      totalDownloads: 0,
      totalAiImprovements: 0,
      totalPresetsLoaded: 0,
      totalJsonExports: 0,
      totalJsonImports: 0,
      totalPhotoUploads: 0,
      totalTemplateChanges: 0,
      totalPreviews: 0,
      uniqueUsers: 0,
      recentEvents: [],
    };
  }
}
