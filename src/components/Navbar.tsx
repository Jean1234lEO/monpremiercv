import React from 'react';
import { Download, Sparkles, BarChart3 } from 'lucide-react';

interface NavbarProps {
  onOpenGuide: () => void;
  onOpenDashboard?: () => void;
  onPrint: () => void;
  onScrollToForm: () => void;
  onScrollToPreview: () => void;
  activeTab?: 'edit' | 'preview';
  onTabChange?: (tab: 'edit' | 'preview') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenGuide,
  onOpenDashboard,
  onPrint,
  onScrollToForm,
  onScrollToPreview,
}) => {
  return (
    <header
      className="sticky top-0 z-40 no-print w-full max-w-full overflow-hidden"
      style={{
        background: 'rgba(12, 40, 72, 0.88)',
        backdropFilter: 'blur(16px) saturate(1.6)',
        WebkitBackdropFilter: 'blur(16px) saturate(1.6)',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.22)',
      }}
    >
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 h-15 sm:h-16 flex items-center justify-between gap-2 sm:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Animated pulse indicator */}
          <span
            className="hidden sm:block w-2.5 h-2.5 rounded-full shrink-0"
            style={{
              background: 'linear-gradient(135deg, #0ea5c8, #38bdf8)',
              animation: 'pulse-ring 2s ease-in-out infinite',
            }}
          />
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="text-lg sm:text-xl font-extrabold tracking-tight whitespace-nowrap hover:opacity-90 transition-opacity py-2 gradient-text"
          >
            MonPremierCV
          </a>
        </div>

        {/* Zone 2: Nav Links (Desktop) */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-blue-200/80">
          <button
            type="button"
            onClick={onScrollToForm}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 relative group"
          >
            Formulaire
            <span className="absolute bottom-1.5 left-0 right-0 h-px bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
          <button
            type="button"
            onClick={onScrollToPreview}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 relative group"
          >
            Aperçu A4
            <span className="absolute bottom-1.5 left-0 right-0 h-px bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
          <button
            type="button"
            onClick={onOpenGuide}
            className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 relative group"
          >
            Conseils sans expérience
            <span className="absolute bottom-1.5 left-0 right-0 h-px bg-blue-400 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
          </button>
          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="hover:text-white transition-colors whitespace-nowrap shrink-0 py-2 flex items-center gap-1.5 text-blue-200/80 relative group"
            >
              <BarChart3 className="w-3.5 h-3.5 text-amber-300" />
              <span>Statistiques</span>
              <span className="absolute bottom-1.5 left-0 right-0 h-px bg-amber-300 scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
            </button>
          )}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {onOpenDashboard && (
            <button
              type="button"
              onClick={onOpenDashboard}
              className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-blue-200 hover:text-white p-2 rounded-lg transition-colors"
              title="Statistiques & Dashboard"
              aria-label="Statistiques & Dashboard"
            >
              <BarChart3 className="w-5 h-5 text-amber-300" />
            </button>
          )}

          <button
            type="button"
            onClick={onOpenGuide}
            className="md:hidden min-h-[44px] min-w-[44px] flex items-center justify-center text-blue-200 hover:text-white p-2 rounded-lg transition-colors"
            title="Guide sans expérience"
            aria-label="Guide sans expérience"
          >
            <Sparkles className="w-5 h-5 text-amber-300" />
          </button>

          {/* Download PDF — gradient shimmer button */}
          <button
            type="button"
            onClick={onPrint}
            className="shimmer-btn min-h-[44px] px-3.5 sm:px-5 py-2 text-white text-xs sm:text-sm font-bold rounded-xl flex items-center justify-center gap-1.5 whitespace-nowrap shrink-0"
            style={{
              boxShadow: '0 2px 12px rgba(14,165,200,0.30)',
            }}
          >
            <Download className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Télécharger PDF</span>
            <span className="sm:hidden">PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
