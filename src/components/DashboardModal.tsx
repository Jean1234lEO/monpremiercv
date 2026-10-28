import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  RefreshCw,
  Download,
  Users,
  Sparkles,
  TrendingUp,
  FileText,
  Camera,
  Layers,
  Clock,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  FileDown
} from 'lucide-react';
import {
  fetchDashboardStats,
  getLocalDashboardStats,
  DashboardStatsResponse,
  DashboardEvent
} from '../lib/api';

interface DashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EVENT_LABELS: Record<DashboardEvent, { label: string; color: string; icon: string }> = {
  cv_downloaded: { label: 'Téléchargement PDF', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: '📥' },
  cv_created: { label: 'Nouveau CV commencé', color: 'bg-blue-100 text-blue-800 border-blue-200', icon: '📝' },
  ai_improve_used: { label: 'Amélioration IA', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: '✨' },
  template_changed: { label: 'Changement modèle', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: '🎨' },
  photo_uploaded: { label: 'Photo ajoutée', color: 'bg-pink-100 text-pink-800 border-pink-200', icon: '📷' },
  cv_previewed: { label: 'Aperçu consulté', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: '👁️' },
  preset_loaded: { label: 'Exemple chargé', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: '📋' },
  json_exported: { label: 'Export JSON', color: 'bg-cyan-100 text-cyan-800 border-cyan-200', icon: '📤' },
  json_imported: { label: 'Import JSON', color: 'bg-teal-100 text-teal-800 border-teal-200', icon: '📥' },
};

const TEMPLATE_NAMES: Record<string, string> = {
  classic: 'Classique',
  modern: 'Moderne',
  'two-column': '2 Colonnes',
  minimalist: 'Minimaliste',
};

const SECTION_NAMES: Record<string, string> = {
  profile: 'Profil',
  skills: 'Compétences',
  projects: 'Projets académiques',
  experience: 'Expériences & Stages',
  education: 'Formation',
};

export const DashboardModal: React.FC<DashboardModalProps> = ({ isOpen, onClose }) => {
  const [stats, setStats] = useState<DashboardStatsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string>(() => sessionStorage.getItem('dash_secret_token') || '');
  const [source, setSource] = useState<'server' | 'local'>('server');

  const loadStats = useCallback(async (authToken?: string) => {
    setLoading(true);
    setError(null);
    try {
      const activeToken = authToken !== undefined ? authToken : token;
      const data = await fetchDashboardStats(activeToken);
      setStats(data);
      setSource('server');
    } catch {
      // Fallback to local mirror if backend is offline or static
      const localData = getLocalDashboardStats();
      setStats(localData);
      setSource('local');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (isOpen) {
      loadStats();
    }
  }, [isOpen, loadStats]);

  if (!isOpen) return null;

  const handleTokenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem('dash_secret_token', token);
    loadStats(token);
  };

  const handleExportJSON = () => {
    if (!stats) return;
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `monpremiercv_analytics_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const timeAgo = (isoDate: string) => {
    try {
      const diff = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
      if (diff < 60) return `À l'instant`;
      if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
      if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)} h`;
      return new Date(isoDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });
    } catch {
      return isoDate;
    }
  };

  const totalTemplateUsage = stats?.templates
    ? Object.values(stats.templates).reduce((a, b) => a + b, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-slate-50 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        
        {/* Top Header */}
        <div className="px-5 py-4 bg-[#123b65] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-bold text-amber-300">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">Tableau de Bord & Métriques</h2>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  {source === 'server' ? 'Serveur Live' : 'Miroir Local'}
                </span>
              </div>
              <p className="text-xs text-blue-100">
                Suivi des créations de CV, téléchargements PDF et utilisation de l'IA
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => loadStats()}
              disabled={loading}
              className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors disabled:opacity-50"
              title="Actualiser les métriques"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-blue-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
              title="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Secret token protection toolbar (collapsible / lightweight) */}
        <div className="bg-slate-100/90 border-b border-slate-200 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <form onSubmit={handleTokenSubmit} className="flex items-center gap-2 flex-1 min-w-[240px]">
            <span className="text-slate-600 font-semibold whitespace-nowrap">Clé admin (optionnelle) :</span>
            <input
              type="password"
              placeholder="DASHBOARD_SECRET..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="px-2.5 py-1 text-xs bg-white border border-slate-300 rounded-md flex-1 max-w-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-3 py-1 bg-[#123b65] text-white rounded-md font-semibold hover:bg-blue-900 transition-colors"
            >
              Déverrouiller
            </button>
          </form>

          {stats && (
            <button
              onClick={handleExportJSON}
              className="flex items-center gap-1.5 px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-md font-semibold transition-colors"
            >
              <FileDown className="w-3.5 h-3.5 text-slate-500" />
              <span>Exporter en JSON</span>
            </button>
          )}
        </div>

        {/* Main Content Area */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 4 Main KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* KPI 1: Downloads */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Téléchargements PDF</span>
                <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Download className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.totalDownloads ?? 0}
              </div>
              <p className="text-[11px] text-emerald-700 mt-1 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> CV finalisés avec succès
              </p>
            </div>

            {/* KPI 2: CV Created / Sessions */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">CV Initiés</span>
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.totalCvsCreated ?? 0}
              </div>
              <p className="text-[11px] text-blue-700 mt-1 font-semibold flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> Taux de succès : {stats?.conversionRate ?? 0}%
              </p>
            </div>

            {/* KPI 3: AI Improvements */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Assistance IA</span>
                <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.totalAiImprovements ?? 0}
              </div>
              <p className="text-[11px] text-amber-700 mt-1 font-semibold">
                Reformulations Gemini générées
              </p>
            </div>

            {/* KPI 4: Photos & Presets */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Photos & Presets</span>
                <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {stats?.totalPhotoUploads ?? 0}
              </div>
              <p className="text-[11px] text-purple-700 mt-1 font-semibold">
                {stats?.totalPresetsLoaded ?? 0} exemples préremplis chargés
              </p>
            </div>
          </div>

          {/* Breakdowns Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Template Popularity */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Layers className="w-4 h-4 text-[#123b65]" />
                <h3>Modèles les plus utilisés</h3>
              </div>
              
              <div className="space-y-2.5 pt-1">
                {stats?.templates && Object.entries(stats.templates).map(([key, count]) => {
                  const pct = totalTemplateUsage > 0 ? Math.round((count / totalTemplateUsage) * 100) : 0;
                  return (
                    <div key={key} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-700">{TEMPLATE_NAMES[key] || key}</span>
                        <span className="text-slate-500 font-semibold">{count} ({pct}%)</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#123b65] h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* AI Sections Breakdown */}
            <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <h3>Sections les plus reformulées par l'IA</h3>
              </div>

              <div className="space-y-2.5 pt-1">
                {stats?.aiSections && Object.entries(stats.aiSections).map(([key, count]) => {
                  const totalAi = stats.totalAiImprovements || 1;
                  const pct = Math.round((count / totalAi) * 100);
                  return (
                    <div key={key} className="space-y-1 text-xs">
                      <div className="flex justify-between font-medium">
                        <span className="text-slate-700">{SECTION_NAMES[key] || key}</span>
                        <span className="text-slate-500 font-semibold">{count} fois ({pct}%)</span>
                      </div>
                      <div className="w-full bg-amber-50 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-amber-500 h-full rounded-full transition-all duration-300"
                          style={{ width: `${Math.max(4, pct)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Real-time Activity Feed */}
          <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Clock className="w-4 h-4 text-[#123b65]" />
                <h3>Activités récentes en direct</h3>
              </div>
              <span className="text-[11px] text-slate-500">
                {stats?.recentEvents?.length ?? 0} derniers événements
              </span>
            </div>

            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {stats?.recentEvents && stats.recentEvents.length > 0 ? (
                stats.recentEvents.map((item, idx) => {
                  const meta = EVENT_LABELS[item.event] || {
                    label: item.event,
                    color: 'bg-slate-100 text-slate-700 border-slate-200',
                    icon: '📌'
                  };

                  let detail = '';
                  if (item.metadata?.templateId) {
                    detail = `(Modèle : ${TEMPLATE_NAMES[String(item.metadata.templateId)] || item.metadata.templateId})`;
                  } else if (item.metadata?.section) {
                    detail = `(Section : ${SECTION_NAMES[String(item.metadata.section)] || item.metadata.section})`;
                  }

                  return (
                    <div key={idx} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="text-sm select-none">{meta.icon}</span>
                        <span className={`px-2 py-0.5 rounded-full border text-[11px] font-semibold ${meta.color}`}>
                          {meta.label}
                        </span>
                        {detail && (
                          <span className="text-slate-500 text-[11px] truncate">
                            {detail}
                          </span>
                        )}
                      </div>
                      <span className="text-slate-400 text-[11px] whitespace-nowrap shrink-0">
                        {timeAgo(item.timestamp)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="py-6 text-center text-slate-400 text-xs italic">
                  Aucun événement enregistré pour le moment.
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
