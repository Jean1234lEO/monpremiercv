import React from 'react';
import { TemplateId, ThemeColor } from '../types';
import { themeConfigs } from '../data/themes';
import {
  Printer,
  Copy,
  Check,
  Layout,
  Palette,
  Type,
  FileCheck2,
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
    <div className="w-full max-w-full bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 sm:p-5 space-y-4 no-print overflow-hidden">
      {/* Top row: Heading & Download CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Aperçu de ton CV
            </h2>
            <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
              Format A4
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
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

          <button
            type="button"
            id="downloadButton"
            onClick={onPrint}
            className="min-h-[48px] px-4 py-2.5 bg-[#123b65] hover:bg-[#0e2f52] active:bg-[#0a233d] text-white text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4 shrink-0" />
            <span>Télécharger mon CV en PDF</span>
          </button>
        </div>
      </div>

      {/* Controls row: Template, Color, Font */}
      <div className="space-y-3.5 pt-1 text-xs">
        {/* Template Selector */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1.5">
            <Layout className="w-3.5 h-3.5 text-slate-400" />
            <span>Mise en page</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => onChangeTemplate(tpl.id)}
                className={`min-h-[44px] py-2 px-2.5 rounded-lg font-semibold text-center transition-all flex items-center justify-center ${
                  templateId === tpl.id
                    ? 'bg-[#123b65] text-white shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tpl.label}
              </button>
            ))}
          </div>
        </div>

        {/* Color Palette */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1.5">
            <Palette className="w-3.5 h-3.5 text-slate-400" />
            <span>Couleur d'accent</span>
          </div>
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {colors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onChangeTheme(c.id)}
                className={`min-h-[44px] min-w-[44px] rounded-xl transition-all flex items-center justify-center ${
                  themeColor === c.id
                    ? 'ring-2 ring-offset-2 ring-slate-800 scale-105'
                    : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c.primary }}
                title={c.label}
                aria-label={`Thème ${c.label}`}
              >
                {themeColor === c.id && <Check className="w-4 h-4 text-white" />}
              </button>
            ))}
          </div>
        </div>

        {/* Font Family */}
        <div>
          <div className="flex items-center gap-1.5 text-slate-700 font-bold mb-1.5">
            <Type className="w-3.5 h-3.5 text-slate-400" />
            <span>Typographie</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => onChangeFont('sans')}
              className={`min-h-[44px] py-2 px-3 rounded-lg font-semibold text-center transition-all flex items-center justify-center ${
                fontFamily === 'sans'
                  ? 'bg-[#123b65] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Moderne (Sans)
            </button>
            <button
              type="button"
              onClick={() => onChangeFont('serif')}
              className={`min-h-[44px] py-2 px-3 rounded-lg font-semibold text-center transition-all flex items-center justify-center ${
                fontFamily === 'serif'
                  ? 'bg-[#123b65] text-white shadow-xs'
                  : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Élégant (Serif)
            </button>
          </div>
        </div>
      </div>

      {/* Helper notice */}
      <div className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2.5 leading-relaxed">
        <FileCheck2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            Pour télécharger le PDF : clique sur le bouton ci-dessus et choisis destination <strong>« Enregistrer au format PDF »</strong>.
          </p>
          <p className="text-[11px] text-slate-500">
            💡 <strong>Astuce plein écran A4</strong> : dans la fenêtre d'impression, ouvre <em>« Plus de paramètres »</em>, règle <strong>Marges sur « Aucune »</strong> et active <strong>« Graphiques d'arrière-plan »</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
