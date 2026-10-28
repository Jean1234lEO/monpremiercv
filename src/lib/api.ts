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

/**
 * Send an anonymous analytics event to the dashboard.
 * Fire-and-forget: errors are silently ignored to never block the user.
 */
export function trackEvent(
  event: DashboardEvent,
  metadata?: Record<string, unknown>
): void {
  fetch('/api/dashboard/event', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event, metadata }),
  }).catch(() => {
    // Silently ignore — analytics must never degrade UX
  });
}
