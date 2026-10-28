/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { CVData, TemplateId, ThemeColor } from './types';
import { initialCVData, emptyCVData } from './data/presets';
import { validateName, validateEmail, validatePhone, validateEducation } from './utils/validation';
import { trackEvent } from './lib/api';
import { Navbar } from './components/Navbar';
import { CVFormEditor } from './components/CVFormEditor';
import { CVPreviewToolbar } from './components/CVPreviewToolbar';
import { CVRenderer } from './components/CVRenderer';
import { AdviceGuideModal } from './components/AdviceGuideModal';
import { DashboardModal } from './components/DashboardModal';
import {
  FileText,
  CheckCircle2,
  ShieldCheck,
  Eye,
  Edit3,
  Download
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'monpremiercv_saved_data';
const LOCAL_STORAGE_SETTINGS = 'monpremiercv_settings';

export default function App() {
  // Load initial data from localStorage if exists
  const [data, setData] = useState<CVData>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // fallback
    }
    return initialCVData;
  });

  const [templateId, setTemplateId] = useState<TemplateId>(() => {
    try {
      const settings = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
      if (settings) {
        const parsed = JSON.parse(settings);
        if (parsed.templateId) return parsed.templateId;
      }
    } catch {
      // fallback
    }
    return 'classic';
  });

  const [themeColor, setThemeColor] = useState<ThemeColor>(() => {
    try {
      const settings = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
      if (settings) {
        const parsed = JSON.parse(settings);
        if (parsed.themeColor) return parsed.themeColor;
      }
    } catch {
      // fallback
    }
    return 'navy';
  });

  const [fontFamily, setFontFamily] = useState<'sans' | 'serif'>('sans');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<'edit' | 'preview'>('edit');
  const [hasCopied, setHasCopied] = useState(false);

  // Open dashboard if URL hash is #admin or #dashboard
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin' || window.location.hash === '#dashboard') {
        setIsDashboardOpen(true);
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const previewSectionRef = useRef<HTMLDivElement>(null);

  // Auto-save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
    } catch {
      // ignore
    }
  }, [data]);

  useEffect(() => {
    try {
      localStorage.setItem(
        LOCAL_STORAGE_SETTINGS,
        JSON.stringify({ templateId, themeColor, fontFamily })
      );
    } catch {
      // ignore
    }
  }, [templateId, themeColor, fontFamily]);

  // Track session start once
  useEffect(() => {
    try {
      const hasTracked = sessionStorage.getItem('cv_session_created');
      if (!hasTracked) {
        trackEvent('cv_created');
        sessionStorage.setItem('cv_session_created', 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const handleFieldChange = (field: keyof CVData, value: string) => {
    setData((prev) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLoadPreset = (presetData: CVData) => {
    setData(presetData);
    trackEvent('preset_loaded');
  };

  const handleReset = () => {
    const confirmed = window.confirm(
      'Veux-tu vraiment effacer toutes les informations saisies ?'
    );
    if (confirmed) {
      setData(emptyCVData);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const checkValidation = () => {
    const nameRes = validateName(data.name);
    const emailRes = validateEmail(data.email);
    const phoneRes = validatePhone(data.phone);
    const eduRes = validateEducation(data.education);

    if (!nameRes.isValid) {
      return { isValid: false, field: 'name' };
    }
    if (!emailRes.isValid) {
      return { isValid: false, field: 'email' };
    }
    if (!phoneRes.isValid) {
      return { isValid: false, field: 'phone' };
    }
    if (!eduRes.isValid) {
      return { isValid: false, field: 'education' };
    }
    return { isValid: true };
  };

  const handlePrint = () => {
    const val = checkValidation();
    if (!val.isValid && val.field) {
      setActiveMobileTab('edit');
      setTimeout(() => {
        const el = document.getElementById(val.field!);
        el?.focus();
        el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
      return;
    }
    window.print();
    trackEvent('cv_downloaded');
  };

  const handleCopyText = async () => {
    const textLines = [
      data.name.toUpperCase(),
      data.jobTitle,
      `Contact : ${[data.email, data.phone, data.city].filter(Boolean).join(' | ')}`,
      data.linkedin ? `LinkedIn : ${data.linkedin}` : '',
      '',
      '--- PROFIL PROFESSIONNEL ---',
      data.profile,
      '',
      '--- FORMATION ---',
      data.education,
      '',
      '--- COMPÉTENCES ---',
      data.skills,
      '',
      data.projects ? '--- PROJETS ACADÉMIQUES ---' : '',
      data.projects,
      '',
      data.experience ? '--- EXPÉRIENCES & STAGES ---' : '',
      data.experience,
      '',
      '--- LANGUES ---',
      data.languages,
      data.interests ? `\n--- CENTRES D'INTÉRÊT ---\n${data.interests}` : ''
    ]
      .filter((line) => line !== undefined)
      .join('\n');

    try {
      await navigator.clipboard.writeText(textLines);
      setHasCopied(true);
      setTimeout(() => setHasCopied(false), 2200);
    } catch {
      alert('Impossible de copier automatiquement dans le presse-papiers.');
    }
  };

  const switchToEdit = () => {
    setActiveMobileTab('edit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const switchToPreview = () => {
    const val = checkValidation();
    if (!val.isValid && val.field) {
      const el = document.getElementById(val.field!);
      el?.focus();
      el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setActiveMobileTab('preview');
    trackEvent('cv_previewed');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f1f5f9] text-slate-800 w-full max-w-full overflow-x-hidden">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onPrint={handlePrint}
        onScrollToForm={switchToEdit}
        onScrollToPreview={switchToPreview}
        activeTab={activeMobileTab}
        onTabChange={setActiveMobileTab}
      />

      {/* Hero Mission Banner */}
      <section className="bg-gradient-to-b from-[#123b65] to-[#0f2e4e] text-white pt-5 pb-6 sm:pt-8 sm:pb-10 px-3.5 sm:px-6 no-print w-full max-w-full overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight mb-2 sm:mb-3 text-white leading-tight">
              Crée ton premier CV professionnel
            </h1>
            <p className="text-xs sm:text-base text-blue-100/90 leading-relaxed mb-3">
              Même sans expérience professionnelle, valorise tes projets, tes compétences et tes diplômes.
            </p>
            {/* Zero-pill metadata */}
            <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] sm:text-xs text-blue-200">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>100% Gratuit</span>
              </span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-300 shrink-0" />
                <span>Sans inscription</span>
              </span>
              <span aria-hidden="true" className="opacity-50">·</span>
              <span className="flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>Format A4 recruteur</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Two-Column / Mobile Tabbed Container */}
      <main className="max-w-7xl mx-auto px-2.5 sm:px-6 py-4 sm:py-8 flex-1 w-full max-w-full overflow-x-hidden safe-bottom-padding">
        {/* Mobile View Segmented Switch (Top of main, >= 44px tap targets) */}
        <div className="lg:hidden mb-4 no-print">
          <div className="flex items-center justify-center p-1 bg-slate-200/90 rounded-xl">
            <button
              type="button"
              onClick={switchToEdit}
              className={`flex-1 min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeMobileTab === 'edit'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Edit3 className="w-4 h-4 shrink-0" />
              <span>1. Formulaire</span>
            </button>
            <button
              type="button"
              onClick={switchToPreview}
              className={`flex-1 min-h-[44px] py-2.5 px-3 text-xs sm:text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeMobileTab === 'preview'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>2. Aperçu (A4)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-8 items-start w-full max-w-full">
          {/* Column 1: Form Editor */}
          <div
            ref={formSectionRef}
            className={`w-full max-w-full lg:col-span-5 ${
              activeMobileTab === 'edit' ? 'block' : 'hidden lg:block'
            }`}
          >
            <CVFormEditor
              data={data}
              onChange={handleFieldChange}
              onLoadPreset={handleLoadPreset}
              onReset={handleReset}
              onOpenGuide={() => setIsGuideOpen(true)}
              onPreviewClick={switchToPreview}
            />
          </div>

          {/* Column 2: Live Preview & Toolbar */}
          <div
            ref={previewSectionRef}
            className={`w-full max-w-full lg:col-span-7 space-y-4 print-container ${
              activeMobileTab === 'preview' ? 'block' : 'hidden lg:block'
            }`}
          >
            <CVPreviewToolbar
              templateId={templateId}
              onChangeTemplate={(newTemplate) => {
                setTemplateId(newTemplate);
                trackEvent('template_changed', { templateId: newTemplate });
              }}
              themeColor={themeColor}
              onChangeTheme={setThemeColor}
              fontFamily={fontFamily}
              onChangeFont={setFontFamily}
              onPrint={handlePrint}
              onCopyText={handleCopyText}
              hasCopied={hasCopied}
              onEditClick={switchToEdit}
            />

            {/* A4 Document Rendering Container (constrained, no horizontal scroll) */}
            <div className="rounded-xl overflow-hidden shadow-xs border border-slate-200/80 bg-white w-full max-w-full">
              <CVRenderer
                data={data}
                templateId={templateId}
                themeColor={themeColor}
                fontFamily={fontFamily}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Guide Modal */}
      <AdviceGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Admin Dashboard Modal */}
      <DashboardModal
        isOpen={isDashboardOpen}
        onClose={() => {
          setIsDashboardOpen(false);
          if (window.location.hash === '#admin' || window.location.hash === '#dashboard') {
            history.replaceState(null, '', window.location.pathname);
          }
        }}
      />

      {/* Footer */}
      <footer className="mt-auto py-6 px-4 border-t border-slate-200 bg-white text-center text-xs text-slate-500 no-print safe-bottom-padding lg:pb-6">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <p className="font-semibold text-slate-700">
            MonPremierCV — Un premier pas vers ton premier emploi.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-slate-400 text-[11px]">
            <span>Conçu pour étudiants & débutants</span>
            <span aria-hidden="true">·</span>
            <span>Sauvegarde automatique locale</span>
            <span aria-hidden="true">·</span>
            <span>Format PDF A4</span>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsDashboardOpen(true)}
              className="hover:text-slate-600 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Statistiques & Dashboard 📊
            </button>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Thumb Action Bar (Thumb zone at bottom, safe for notch devices) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-xl px-3 pt-2.5 safe-bottom-bar mobile-bottom-bar no-print">
        {activeMobileTab === 'edit' ? (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={switchToPreview}
              className="flex-1 min-h-[48px] px-4 py-3 bg-[#123b65] hover:bg-[#0e2f52] active:bg-[#0a233d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 shrink-0" />
              <span>Voir mon CV (Aperçu)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="min-h-[48px] px-3.5 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-[#123b65] text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
              title="Télécharger PDF"
              aria-label="Télécharger PDF"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>PDF</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={switchToEdit}
              className="min-h-[48px] px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 text-xs sm:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Edit3 className="w-4 h-4 shrink-0 text-slate-600" />
              <span>Modifier</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="flex-1 min-h-[48px] px-4 py-3 bg-[#123b65] hover:bg-[#0e2f52] active:bg-[#0a233d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4 shrink-0" />
              <span>Télécharger PDF</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
