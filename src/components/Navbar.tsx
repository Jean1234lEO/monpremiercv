import React from 'react';
import { Download, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenGuide: () => void;
  onPrint: () => void;
  onScrollToForm: () => void;
  onScrollToPreview: () => void;
  activeTab?: 'edit' | 'preview';
  onTabChange?: (tab: 'edit' | 'preview') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGuide,
  onPrint,
  onScrollToForm,
  onScrollToPreview,
  activeTab,
  onTabChange
}) => {
  return (
    <header className="bg-[#123b65] text-white border-b border-[#0f2e4e] sticky top-0 z-40 no-print shadow-xs w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg sm:text-xl font-extrabold tracking-tight text-white whitespace-nowrap hover:opacity-95 transition-opacity py-2"
          >
            MonPremierCV
          </a>
        </div>

        {/* Zone 2: Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-blue-100">
          <button
            type="button"
            onClick={onScrollToForm}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Formulaire
          </button>
          <button
            type="button"
            onClick={onScrollToPreview}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Aperçu A4
          </button>
          <button
            type="button"
            onClick={onOpenGuide}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-2"
          >
            Conseils sans expérience
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action (with mobile touch target >= 44px) */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onOpenGuide}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-blue-200 hover:text-white p-2 rounded-lg"
            title="Guide sans expérience"
            aria-label="Guide sans expérience"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
          </button>

          <button
            type="button"
            onClick={onPrint}
            className="min-h-[44px] px-3.5 sm:px-4 py-2 bg-white text-[#123b65] hover:bg-blue-50 active:bg-blue-100 text-xs sm:text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Download className="w-4 h-4 text-[#123b65] shrink-0" />
            <span className="hidden sm:inline">Télécharger PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
