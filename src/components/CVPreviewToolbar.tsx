import React from 'react';
import { TemplateId, ThemeColor } from '../types';
import { themeConfigs } from '../data/themes';
import {
  Download,
  Copy,
  Check,
  Layout,
  Palette,
  Type,
  Info,
  Edit3
} from 'lucide-react';

interface CVPreviewToolbarProps {
  templateId: TemplateId;
  onChangeTemplate: (t: TemplateId) => void;
  themeColor: ThemeColor;
  onChangeTheme: (c: ThemeColor) => void;
  fontFamily: 'sans' | 'serif';
  onChangeFont: (f: 'sans' | 'serif') => void;
  onPrint: () => void;
  onCopyText: () => void;
  hasCopied: boolean;
  onEditClick?: () => void;
}

// Mini visual preview icons for each template
const TemplateIcon: React.FC<{ id: TemplateId; active: boolean }> = ({ id, active }) => {
  const color = active ? 'rgba(255,255,255,0.9)' : '#94a3b8';
  const accent = active ? 'rgba(255,255,255,0.55)' : '#cbd5e1';

  if (id === 'classic') {
    return (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="shrink-0">
        <rect x="1" y="1" width="22" height="3" rx="1" fill={color} />
        <rect x="1" y="6" width="14" height="1.5" rx="0.75" fill={accent} />
        <rect x="1" y="9" width="16" height="1.5" rx="0.75" fill={accent} />
        <rect x="1" y="12" width="10" height="1.5" rx="0.75" fill={accent} />
        <rect x="1" y="15" width="20" height="1.5" rx="0.75" fill={accent} />
        <rect x="1" y="18" width="14" height="1.5" rx="0.75" fill={accent} />
      </svg>
    );
  }
  if (id === 'modern') {
    return (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="shrink-0">
        <rect x="1" y="1" width="22" height="4" rx="2" fill={color} />
        <rect x="1" y="7" width="7" height="1.5" rx="0.75" fill={color} />
        <rect x="1" y="10" width="14" height="1.5" rx="0.75" fill={accent} />
        <rect x="1" y="12.5" width="16" height="1.5" rx="0.75" fill={accent} />
        <rect x="1" y="15" width="10" height="1.5" rx="0.75" fill={accent} />
        <rect x="1" y="17.5" width="18" height="1.5" rx="0.75" fill={accent} />
      </svg>
    );
  }
  if (id === 'two-column') {
    return (
      <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="shrink-0">
        <rect x="1" y="1" width="9" height="18" rx="1" fill={accent} />
        <rect x="12" y="1" width="11" height="3" rx="0.75" fill={color} />
        <rect x="12" y="6" width="11" height="1.5" rx="0.75" fill={accent} />
        <rect x="12" y="9" width="8" height="1.5" rx="0.75" fill={accent} />
        <rect x="12" y="12" width="11" height="1.5" rx="0.75" fill={accent} />
        <rect x="12" y="15" width="7" height="1.5" rx="0.75" fill={accent} />
      </svg>
    );
  }
  // minimalist
  return (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" className="shrink-0">
      <rect x="1" y="1" width="16" height="2.5" rx="0.75" fill={color} />
      <rect x="1" y="5" width="8" height="1" rx="0.5" fill={accent} />
      <rect x="0" y="8" width="23" height="0.5" rx="0.25" fill={accent} />
      <rect x="1" y="11" width="14" height="1.5" rx="0.75" fill={accent} />
      <rect x="1" y="14" width="16" height="1.5" rx="0.75" fill={accent} />
      <rect x="1" y="17" width="10" height="1.5" rx="0.75" fill={accent} />
    </svg>
  );
};

export const CVPreviewToolbar: React.FC<CVPreviewToolbarProps> = ({
  templateId,
  onChangeTemplate,
  themeColor,
  onChangeTheme,
  fontFamily,
  onChangeFont,
  onPrint,
  onCopyText,
  hasCopied,
  onEditClick
}) => {
  const templates: { id: TemplateId; label: string }[] = [
    { id: 'classic', label: 'Classique' },
    { id: 'modern', label: 'Moderne' },
    { id: 'two-column', label: '2 Colonnes' },
    { id: 'minimalist', label: 'Minimaliste' }
  ];

  const colors = Object.values(themeConfigs);

  return (
    <div className="w-full max-w-full bg-white rounded-2xl border border-slate-200/80 shadow-md p-4 sm:p-5 space-y-4 no-print overflow-hidden">
      {/* Top row: Heading & Download CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Aperçu de ton CV
            </h2>
            <span className="text-[11px] font-semibold text-[#123b65] bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
              Format A4
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Mise en page prête pour l'impression ou l'enregistrement PDF
          </p>
        </div>

        {/* Action buttons on desktop / tablet */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {onEditClick && (
            <button
              type="button"
              id="editButton"
              onClick={onEditClick}
              className="min-h-[44px] px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Modifier mon CV</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCopyText}
            className="min-h-[44px] px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 rounded-xl transition-colors flex items-center justify-center gap-1.5"
          >
            {hasCopied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-700">Texte copié !</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-500" />
                <span>Copier le texte</span>
              </>
            )}
          </button>

          {/* Primary Download CTA with gradient shimmer */}
          <button
            type="button"
            id="downloadButton"
            onClick={onPrint}
            className="shimmer-btn group relative min-h-[48px] px-5 py-2.5 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-2 overflow-hidden"
            style={{ boxShadow: '0 4px 16px rgba(18,59,101,0.30)' }}
          >
            {/* Shimmer sweep overlay */}
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.4s linear infinite',
              }}
            />
            <Download className="w-4 h-4 shrink-0 relative z-10" />
            <span className="relative z-10">Télécharger mon CV en PDF</span>
          </button>
        </div>
      </div>

      {/* Controls row: Template, Color, Font */}
      <div className="space-y-4 pt-0.5 text-xs">
        {/* Template Selector */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-2">
            <Layout className="w-3.5 h-3.5 text-[#123b65]/60" />
            <span>Mise en page</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChangeTemplate(tpl.id)}
                className={`min-h-[52px] py-2 px-2.5 rounded-xl font-semibold text-center transition-all flex flex-col items-center justify-center gap-1.5 ${
                  templateId === tpl.id
                    ? 'text-white shadow-md'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 hover:border-slate-300'
                }`}
                style={
                  templateId === tpl.id
                    ? { background: 'linear-gradient(135deg, #123b65 0%, #1a5a9e 100%)' }
                    : undefined
                }
              >
                <TemplateIcon id={tpl.id} active={templateId === tpl.id} />
                <span className="text-[11px]">{tpl.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-2">
            <Palette className="w-3.5 h-3.5 text-[#123b65]/60" />
            <span>Couleur d'accent</span>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            {colors.map((c) => (
              <div key={c.id} className="relative group">
                <button
                  type="button"
                  onClick={() => onChangeTheme(c.id)}
                  className={`w-10 h-10 rounded-xl transition-all flex items-center justify-center ${
                    themeColor === c.id
                      ? 'ring-2 ring-offset-2 ring-slate-700 scale-110 shadow-md'
                      : 'hover:scale-110 hover:shadow-sm'
                  }`}
                  style={{ backgroundColor: c.primary }}
                  title={c.label}
                  aria-label={`Thème ${c.label}`}
                >
                  {themeColor === c.id && <Check className="w-4 h-4 text-white drop-shadow" />}
                </button>
                {/* Tooltip */}
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-medium text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-white px-1.5 py-0.5 rounded shadow-sm border border-slate-100 z-10">
                  {c.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-2">
            <Type className="w-3.5 h-3.5 text-[#123b65]/60" />
            <span>Typographie</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeFont('sans')}
              className={`min-h-[44px] py-2 px-3 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                fontFamily === 'sans'
                  ? 'text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              style={
                fontFamily === 'sans'
                  ? { background: 'linear-gradient(135deg, #123b65 0%, #1a5a9e 100%)' }
                  : undefined
              }
            >
              <span className="text-base font-sans leading-none">Aa</span>
              <span>Moderne (Sans)</span>
            </button>
            <button
              type="button"
              onClick={() => onChangeFont('serif')}
              className={`min-h-[44px] py-2 px-3 rounded-xl font-semibold text-center transition-all flex items-center justify-center gap-1.5 ${
                fontFamily === 'serif'
                  ? 'text-white shadow-md'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
              style={
                fontFamily === 'serif'
                  ? { background: 'linear-gradient(135deg, #123b65 0%, #1a5a9e 100%)' }
                  : undefined
              }
            >
              <span className="text-base font-serif leading-none">Aa</span>
              <span>Élégant (Serif)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Helper notice — styled card */}
      <div
        className="rounded-xl p-3.5 flex items-start gap-3 leading-relaxed"
        style={{
          background: 'linear-gradient(135deg, #f0f7ff 0%, #e8f4fd 100%)',
          border: '1px solid #bfdbfe',
        }}
      >
        <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
          <Info className="w-4 h-4 text-[#123b65]" />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-slate-700 font-semibold">Comment télécharger votre PDF ?</p>
          <p className="text-xs text-slate-600">
            Cliquez sur <strong>« Télécharger mon CV en PDF »</strong> puis choisissez la destination{' '}
            <strong>« Enregistrer au format PDF »</strong>.
          </p>
          <p className="text-[11px] text-slate-500">
            💡 <strong>Astuce A4 plein écran</strong> : dans la fenêtre d'impression, ouvre{' '}
            <em>« Plus de paramètres »</em>, règle <strong>Marges sur « Aucune »</strong> et active{' '}
            <strong>« Graphiques d'arrière-plan »</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
