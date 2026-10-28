import React from 'react';
import { X, Sparkles, CheckCircle2, AlertCircle, BookOpen, HeartHandshake, Award } from 'lucide-react';

interface AdviceGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySnippet?: (field: string, snippet: string) => void;
}

export const AdviceGuideModal: React.FC<AdviceGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-xs modal-overlay">
      <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl max-w-2xl w-full max-h-[88vh] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 sm:slide-in-from-bottom-0 duration-200">
        {/* Modal Header */}
        <div className="px-4 py-3.5 sm:px-6 sm:py-4 bg-[#123b65] text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
            <div>
              <h2 className="font-bold text-sm sm:text-base text-white">Guide : Réussir son CV sans expérience</h2>
              <p className="text-[11px] sm:text-xs text-blue-100">Astuces concrètes pour valoriser ton parcours</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] flex items-center justify-center rounded-lg text-blue-200 hover:text-white hover:bg-white/10 active:bg-white/20 transition-colors"
            title="Fermer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 sm:space-y-6 text-xs sm:text-sm text-slate-700">
          {/* Card 1: Projets académiques */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
              <BookOpen className="w-4 h-4 text-[#123b65] shrink-0" />
              <h3 className="text-xs sm:text-sm">1. Vos projets de classe sont de vraies expériences</h3>
            </div>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              Un recruteur cherche à savoir si vous savez appliquer la théorie. Vos exposés, travaux pratiques (TP), projets de fin d'études ou mémoires démontrent votre méthode.
            </p>
            <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold text-slate-800">Formule gagnante :</span> Nom du projet + Objectif / Problème résolu + Outils mobilisés + Résultat obtenu.
            </div>
          </div>

          {/* Card 2: Bénévolat & Activités extra-scolaires */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
              <HeartHandshake className="w-4 h-4 text-[#123b65] shrink-0" />
              <h3 className="text-xs sm:text-sm">2. Le bénévolat, le sport et la vie associative</h3>
            </div>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              Avez-vous aidé à organiser une fête de quartier, entraîné des plus jeunes dans un club, gardé des enfants ou tenu un stand ? Ces activités prouvent votre sens des responsabilités et votre fiabilité.
            </p>
            <ul className="text-xs space-y-1.5 list-disc list-inside text-slate-600">
              <li><strong className="text-slate-800">Babysitting :</strong> sens des responsabilités, ponctualité, réactivité.</li>
              <li><strong className="text-slate-800">Sport collectif :</strong> esprit d'équipe, persévérance, discipline.</li>
              <li><strong className="text-slate-800">Club ou association :</strong> gestion de budget, prise de parole, organisation.</li>
            </ul>
          </div>

          {/* Card 3: Compétences & Outils */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50/50">
            <div className="flex items-center gap-2 mb-2 font-semibold text-slate-900">
              <Award className="w-4 h-4 text-[#123b65] shrink-0" />
              <h3 className="text-xs sm:text-sm">3. Vos compétences numériques et transversales (Soft Skills)</h3>
            </div>
            <p className="text-xs text-slate-600 mb-2 leading-relaxed">
              Même sans emploi formel, vous maîtrisez des logiciels essentiels ou des aptitudes humaines très prisées :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">Outils & Techniques :</span> Pack Office (Excel, Word), Canva, réseaux sociaux, retouche photo, codage, matériel technique.
              </div>
              <div className="p-2.5 bg-white rounded-lg border border-slate-200">
                <span className="font-semibold text-slate-800">Savoir-être :</span> Ponctualité, curiosité d'apprentissage, dynamisme, courtoisie, rigueur.
              </div>
            </div>
          </div>

          {/* Checklist Do & Don't */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800 mb-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>À faire absolument</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                <li>Tenir votre CV sur 1 seule page A4.</li>
                <li>Faire relire l'orthographe par un proche.</li>
                <li>Utiliser une adresse email sobre (prenom.nom@...).</li>
                <li>Adapter le titre du CV au poste visé.</li>
              </ul>
            </div>

            <div className="p-3 bg-rose-50/60 border border-rose-200 rounded-xl">
              <div className="flex items-center gap-1.5 font-semibold text-rose-800 mb-1.5">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>À éviter</span>
              </div>
              <ul className="space-y-1.5 text-slate-700 list-disc list-inside">
                <li>N'inventez jamais de faux stages ou diplômes.</li>
                <li>Évitez les barres de pourcentage subjectives.</li>
                <li>Ne laissez pas de fautes de frappe ou d'accord.</li>
                <li>Ne surchargez pas avec des couleurs criardes.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer with Safe Area */}
        <div className="px-4 py-3 sm:px-6 bg-slate-50 border-t border-slate-200 flex justify-end shrink-0 safe-bottom-bar">
          <button
            onClick={onClose}
            className="w-full sm:w-auto min-h-[48px] px-5 py-2.5 bg-[#123b65] hover:bg-[#0e2f52] active:bg-[#0a233d] text-white text-xs sm:text-sm font-semibold rounded-xl transition-colors flex items-center justify-center"
          >
            J'ai compris, retour à mon CV
          </button>
        </div>
      </div>
    </div>
  );
};
