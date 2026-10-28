import React, { useState } from 'react';
import { Loader2, Sparkles } from 'lucide-react';
import { ApiError, improveCvSection, trackEvent, type AiSection } from '../lib/api';

interface ImproveWithAiButtonProps {
  section: AiSection;
  text: string;
  jobTitle?: string;
  name?: string;
  onImproved: (text: string) => void;
}

export const ImproveWithAiButton: React.FC<ImproveWithAiButtonProps> = ({
  section,
  text,
  jobTitle,
  name,
  onImproved,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setError(null);
    if (text.trim().length < 8) {
      setError('Écris d’abord quelques mots, puis clique pour améliorer.');
      return;
    }

    setLoading(true);
    try {
      const improved = await improveCvSection({
        section,
        text,
        jobTitle,
        name,
      });
      trackEvent('ai_improve_used', { section });
      onImproved(improved);
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : 'Impossible de joindre l’assistant IA pour le moment.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={loading}
        className="min-h-[44px] text-xs font-semibold text-amber-800 flex items-center gap-1.5 bg-amber-50 hover:bg-amber-100 disabled:opacity-60 disabled:cursor-not-allowed border border-amber-200/80 px-3 py-2 rounded-lg transition-colors"
        title="Reformuler avec l’IA (sans inventer d’expérience)"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin shrink-0" />
        ) : (
          <Sparkles className="w-4 h-4 shrink-0 text-amber-600" />
        )}
        <span>{loading ? 'Amélioration…' : 'Améliorer (IA)'}</span>
      </button>
      {error && (
        <p className="text-[11px] text-rose-600 max-w-[220px] text-right leading-snug">{error}</p>
      )}
    </div>
  );
};
