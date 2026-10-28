import React, { useRef, useState, useMemo } from 'react';
import { CVData } from '../types';
import { presets } from '../data/presets';
import {
  validateEmail,
  validatePhone,
  validateName,
  validateEducation,
  EmailValidationResult,
  ValidationResult
} from '../utils/validation';
import {
  User,
  GraduationCap,
  Wrench,
  FolderGit2,
  Briefcase,
  Languages,
  RotateCcw,
  Download,
  Upload,
  Plus,
  Info,
  HelpCircle,
  Eye,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  Camera,
  Trash2,
  ImageIcon
} from 'lucide-react';
import { ImproveWithAiButton } from './ImproveWithAiButton';
import { trackEvent } from '../lib/api';

interface CVFormEditorProps {
  data: CVData;
  onChange: (field: keyof CVData, value: string) => void;
  onLoadPreset: (presetData: CVData) => void;
  onReset: () => void;
  onOpenGuide: () => void;
  onPreviewClick: () => void;
}

export const CVFormEditor: React.FC<CVFormEditorProps> = ({
  data,
  onChange,
  onLoadPreset,
  onReset,
  onOpenGuide,
  onPreviewClick
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // Track which fields have been blurred or interacted with
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Validation calculations
  const nameValidation: ValidationResult = useMemo(() => validateName(data.name), [data.name]);
  const emailValidation: EmailValidationResult = useMemo(() => validateEmail(data.email), [data.email]);
  const phoneValidation: ValidationResult = useMemo(() => validatePhone(data.phone), [data.phone]);
  const educationValidation: ValidationResult = useMemo(() => validateEducation(data.education), [data.education]);

  // Insert bullet helper
  const insertBullet = (field: keyof CVData) => {
    const currentVal = data[field] || '';
    const addition = currentVal.trim().length > 0 ? '\n• ' : '• ';
    onChange(field, currentVal + addition);
  };

  // Quick typo fixer for email
  const applyEmailSuggestion = (fixedEmail: string) => {
    onChange('email', fixedEmail);
  };

  // Handle photo upload with client-side canvas compression (max 600px)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image valide (JPG, PNG ou WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_SIZE = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_SIZE) {
            height = Math.round((height * MAX_SIZE) / width);
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width = Math.round((width * MAX_SIZE) / height);
            height = MAX_SIZE;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.88);
          onChange('photo', compressed);
          trackEvent('photo_uploaded');
        }
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Reset input value so re-uploading the same image triggers onChange
    if (e.target) e.target.value = '';
  };

  const handleRemovePhoto = () => {
    onChange('photo', '');
  };

  const handleExportJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mon_premier_cv_${(data.name || 'document').toLowerCase().replace(/\s+/g, '_')}.json`;
    a.click();
    URL.revokeObjectURL(url);
    trackEvent('json_exported');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Security check: limit JSON file size to 2MB max
    if (file.size > 2 * 1024 * 1024) {
      alert('Le fichier JSON est trop volumineux (2 Mo maximum).');
      if (e.target) e.target.value = '';
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const raw = event.target?.result;
        if (typeof raw !== 'string') return;
        const parsed = JSON.parse(raw);
        if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
          const safeString = (val: unknown, maxLen = 4000): string =>
            typeof val === 'string' ? val.slice(0, maxLen) : '';

          const safePhoto = (val: unknown): string => {
            if (typeof val !== 'string') return '';
            // Only allow safe data URI image formats
            return /^data:image\/(jpeg|png|webp);base64,/i.test(val) ? val : '';
          };

          onLoadPreset({
            name: safeString(parsed.name, 120),
            jobTitle: safeString(parsed.jobTitle, 120),
            email: safeString(parsed.email, 120),
            phone: safeString(parsed.phone, 50),
            city: safeString(parsed.city, 100),
            linkedin: safeString(parsed.linkedin, 200),
            website: safeString(parsed.website, 200),
            profile: safeString(parsed.profile, 2000),
            education: safeString(parsed.education, 3000),
            skills: safeString(parsed.skills, 3000),
            projects: safeString(parsed.projects, 3000),
            experience: safeString(parsed.experience, 3000),
            languages: safeString(parsed.languages, 1000),
            interests: safeString(parsed.interests, 1000),
            photo: safePhoto(parsed.photo)
          });
          trackEvent('json_imported');
        } else {
          alert('Format de fichier JSON non reconnu.');
        }
      } catch {
        alert('Erreur lors de la lecture du fichier JSON.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  const handleFormSubmit = () => {
    setTouched({
      name: true,
      email: true,
      phone: true,
      education: true
    });

    if (!nameValidation.isValid) {
      document.getElementById('name')?.focus();
      return;
    }
    if (!emailValidation.isValid) {
      document.getElementById('email')?.focus();
      return;
    }
    if (!phoneValidation.isValid) {
      document.getElementById('phone')?.focus();
      return;
    }
    if (!educationValidation.isValid) {
      document.getElementById('education')?.focus();
      return;
    }

    onPreviewClick();
  };

  return (
    <div className="w-full max-w-full bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 sm:p-6 md:p-7 space-y-6 overflow-hidden">
      {/* Intro Header */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-1.5">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Crée ton CV
          </h2>
          <button
            type="button"
            onClick={onOpenGuide}
            className="min-h-[44px] inline-flex items-center justify-center gap-2 text-xs font-semibold text-[#123b65] hover:text-blue-900 bg-blue-50 active:bg-blue-100 border border-blue-200/60 px-3.5 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
          >
            <HelpCircle className="w-4 h-4 shrink-0 text-[#123b65]" />
            <span>Guide pratique : CV sans expérience</span>
          </button>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
          Remplis les champs ci-dessous. Ton CV se met à jour automatiquement dans l'aperçu.
        </p>
      </div>

      {/* Preset Pickers */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Exemples pour t'inspirer
          </span>
          <span className="text-[10px] text-slate-500">1 clic</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                onLoadPreset(preset.data);
                setTouched({});
              }}
              className="min-h-[48px] text-left p-2.5 rounded-lg bg-white border border-slate-200 active:border-[#123b65] active:bg-blue-50/40 hover:border-[#123b65] transition-all flex flex-col justify-center"
            >
              <div className="font-semibold text-xs text-slate-800 truncate w-full">{preset.title}</div>
              <div className="text-[10px] text-slate-500 truncate w-full">{preset.category}</div>
            </button>
          ))}
        </div>
      </div>

      <form id="cvForm" onSubmit={(e) => { e.preventDefault(); handleFormSubmit(); }} className="space-y-6" noValidate>
        {/* SECTION 1: Informations Personnelles & Photo */}
        <section className="space-y-4 pt-1">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <User className="w-4 h-4 text-[#123b65] shrink-0" />
            <h3 className="text-sm font-bold text-slate-800">1. Informations personnelles & Photo</h3>
          </div>

          {/* Photo Upload Zone (Top-Right of the CV) */}
          <div className="p-3.5 bg-slate-50/90 border border-slate-200 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-[#123b65]" />
                <span>Photo d'identité (facultative)</span>
              </label>
              <span className="text-[11px] font-medium text-slate-500">
                Angle haut droit du CV
              </span>
            </div>

            {data.photo ? (
              <div className="flex items-center gap-3.5 p-2 bg-white rounded-lg border border-slate-200">
                <img
                  src={data.photo}
                  alt="Aperçu photo"
                  className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-md border border-slate-200 shadow-2xs shrink-0"
                />
                <div className="flex-1 space-y-2">
                  <p className="text-xs text-slate-600">
                    Photo ajoutée et visible en haut à droite de ton CV.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => photoInputRef.current?.click()}
                      className="min-h-[44px] px-3 py-1.5 text-xs font-semibold text-[#123b65] bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      <span>Changer</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleRemovePhoto}
                      className="min-h-[44px] px-3 py-1.5 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Supprimer</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                onClick={() => photoInputRef.current?.click()}
                className="cursor-pointer border-2 border-dashed border-slate-300 hover:border-[#123b65] bg-white hover:bg-blue-50/30 rounded-xl p-3 sm:p-4 text-center transition-all flex flex-col items-center justify-center gap-1.5 group"
              >
                <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-blue-100 text-slate-500 group-hover:text-[#123b65] flex items-center justify-center transition-colors">
                  <Camera className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-slate-800 group-hover:text-[#123b65]">
                  Ajouter ma photo de profil
                </div>
                <div className="text-[11px] text-slate-400">
                  Format JPG, PNG ou WebP (optimisation automatique)
                </div>
              </div>
            )}

            <input
              type="file"
              ref={photoInputRef}
              onChange={handlePhotoSelect}
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
            />
          </div>

          <div className="space-y-3.5">
            {/* Nom et prénoms */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="name" className="block text-xs font-semibold text-slate-700">
                  Nom et prénoms <span className="text-rose-600">*</span>
                </label>
              </div>
              <input
                id="name"
                type="text"
                value={data.name}
                onChange={(e) => onChange('name', e.target.value)}
                onBlur={() => handleBlur('name')}
                placeholder="Ex. : Jean Dupont"
                className={`w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
                  touched.name && !nameValidation.isValid
                    ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:border-[#123b65] focus:ring-blue-500/20'
                }`}
                aria-invalid={touched.name && !nameValidation.isValid}
                aria-describedby={touched.name && !nameValidation.isValid ? 'name-error' : undefined}
                required
              />
              {touched.name && !nameValidation.isValid && (
                <p id="name-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5 font-medium animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>{nameValidation.error}</span>
                </p>
              )}
            </div>

            {/* Poste recherché */}
            <div>
              <label htmlFor="jobTitle" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Poste recherché
              </label>
              <input
                id="jobTitle"
                type="text"
                value={data.jobTitle}
                onChange={(e) => onChange('jobTitle', e.target.value)}
                placeholder="Ex. : Technicien en électricité"
                className="w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors"
              />
            </div>

            {/* Adresse e-mail avec détection de fautes de frappe courantes */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Adresse e-mail
              </label>
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => onChange('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                placeholder="Ex. : jean@email.com"
                className={`w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
                  touched.email && !emailValidation.isValid
                    ? emailValidation.suggestion
                      ? 'border-amber-400 focus:border-amber-500 focus:ring-amber-500/20'
                      : 'border-rose-400 focus:border-rose-600 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:border-[#123b65] focus:ring-blue-500/20'
                }`}
                aria-invalid={touched.email && !emailValidation.isValid}
                aria-describedby={touched.email && !emailValidation.isValid ? 'email-error' : undefined}
              />

              {/* Inline suggestion for common domain typo */}
              {touched.email && emailValidation.suggestion && (
                <div className="mt-2 p-2.5 bg-amber-50/90 border border-amber-200/90 rounded-lg text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-2 animate-in fade-in duration-150">
                  <div className="flex items-start gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <span>
                      Faute de frappe détectée : voulais-tu écrire <strong>@{emailValidation.suggestion.suggestedDomain}</strong> ?
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => applyEmailSuggestion(emailValidation.suggestion!.fixedEmail)}
                    className="min-h-[38px] px-3 py-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white font-semibold rounded-md transition-colors flex items-center justify-center gap-1 shrink-0 text-xs self-start sm:self-auto"
                  >
                    <span>Corriger</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Standard inline error for Email */}
              {touched.email && !emailValidation.isValid && !emailValidation.suggestion && (
                <p id="email-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5 font-medium animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>{emailValidation.error}</span>
                </p>
              )}
            </div>

            {/* Numéro de téléphone */}
            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Numéro de téléphone
              </label>
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => onChange('phone', e.target.value)}
                onBlur={() => handleBlur('phone')}
                placeholder="Ex. : +229 01 00 00 00 00 ou 06 12 34 56 78"
                className={`w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border rounded-lg transition-colors focus:outline-hidden focus:ring-2 ${
                  touched.phone && !phoneValidation.isValid
                    ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-500/20'
                    : 'border-slate-300 focus:border-[#123b65] focus:ring-blue-500/20'
                }`}
                aria-invalid={touched.phone && !phoneValidation.isValid}
                aria-describedby={touched.phone && !phoneValidation.isValid ? 'phone-error' : undefined}
              />
              {touched.phone && !phoneValidation.isValid ? (
                <p id="phone-error" className="mt-1.5 text-xs text-rose-600 flex items-center gap-1.5 font-medium animate-in fade-in duration-150">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
                  <span>{phoneValidation.error}</span>
                </p>
              ) : (
                <p className="mt-1 text-[11px] text-slate-400">
                  Accepté avec ou sans indicatif international (+), espaces ou tirets.
                </p>
              )}
            </div>

            {/* Ville de résidence */}
            <div>
              <label htmlFor="city" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Ville de résidence
              </label>
              <input
                id="city"
                type="text"
                value={data.city}
                onChange={(e) => onChange('city', e.target.value)}
                placeholder="Ex. : Cotonou, Bénin"
                className="w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors"
              />
            </div>

            {/* LinkedIn / Portfolio */}
            <div>
              <label htmlFor="linkedin" className="block text-xs font-semibold text-slate-700 mb-1.5">
                LinkedIn ou portfolio (facultatif)
              </label>
              <input
                id="linkedin"
                type="text"
                value={data.linkedin}
                onChange={(e) => onChange('linkedin', e.target.value)}
                placeholder="Ex. : linkedin.com/in/jean-dupont"
                className="w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors"
              />
            </div>
          </div>
        </section>

        {/* SECTION 2: Présentation */}
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 min-w-0">
              <Info className="w-4 h-4 text-[#123b65] shrink-0" />
              <h3 className="text-sm font-bold text-slate-800">2. Présentation</h3>
            </div>
            <ImproveWithAiButton
              section="profile"
              text={data.profile}
              jobTitle={data.jobTitle}
              name={data.name}
              onImproved={(text) => onChange('profile', text)}
            />
          </div>
          <label htmlFor="profile" className="block text-xs font-semibold text-slate-700">
            Présente-toi en quelques phrases
          </label>
          <textarea
            id="profile"
            rows={4}
            value={data.profile}
            onChange={(e) => onChange('profile', e.target.value)}
            placeholder="Ex. : Jeune diplômé en génie électrique, motivé et intéressé par la maintenance des installations électriques. Je souhaite mettre mes connaissances en pratique au sein d'une entreprise."
            className="w-full min-h-[96px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors resize-y leading-relaxed"
          />
          <p className="text-xs text-slate-500">
            Parle de ta formation, de tes points forts et du type de travail recherché.
          </p>
        </section>

        {/* SECTION 3: Formation */}
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 min-w-0">
              <GraduationCap className="w-4 h-4 text-[#123b65] shrink-0" />
              <h3 className="text-sm font-bold text-slate-800">3. Formation</h3>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <ImproveWithAiButton
                section="education"
                text={data.education}
                jobTitle={data.jobTitle}
                name={data.name}
                onImproved={(text) => onChange('education', text)}
              />
              <button
                type="button"
                onClick={() => insertBullet('education')}
                className="min-h-[44px] text-xs font-semibold text-[#123b65] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Puce</span>
              </button>
            </div>
          </div>
          <label htmlFor="education" className="block text-xs font-semibold text-slate-700">
            Diplômes et formations <span className="text-rose-600">*</span>
          </label>
          <textarea
            id="education"
            rows={4}
            value={data.education}
            onChange={(e) => onChange('education', e.target.value)}
            onBlur={() => handleBlur('education')}
            placeholder={"Licence en génie électrique — Université X — 2026\nBaccalauréat scientifique — 2023"}
            className={`w-full min-h-[96px] px-3.5 py-2.5 text-base bg-white border rounded-lg transition-colors resize-y leading-relaxed focus:outline-hidden focus:ring-2 ${
              touched.education && !educationValidation.isValid
                ? 'border-rose-400 focus:border-rose-600 focus:ring-rose-500/20'
                : 'border-slate-300 focus:border-[#123b65] focus:ring-blue-500/20'
            }`}
            aria-invalid={touched.education && !educationValidation.isValid}
            aria-describedby={touched.education && !educationValidation.isValid ? 'education-error' : undefined}
            required
          />
          {touched.education && !educationValidation.isValid ? (
            <p id="education-error" className="mt-1 text-xs text-rose-600 flex items-center gap-1.5 font-medium animate-in fade-in duration-150">
              <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>{educationValidation.error}</span>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Indique le diplôme, l'établissement et l'année. Mets la formation la plus récente en premier.
            </p>
          )}
        </section>

        {/* SECTION 4: Compétences */}
        <section className="space-y-2">
          <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200">
            <div className="flex items-center gap-2 min-w-0">
              <Wrench className="w-4 h-4 text-[#123b65] shrink-0" />
              <h3 className="text-sm font-bold text-slate-800">4. Compétences</h3>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <ImproveWithAiButton
                section="skills"
                text={data.skills}
                jobTitle={data.jobTitle}
                name={data.name}
                onImproved={(text) => onChange('skills', text)}
              />
              <button
                type="button"
                onClick={() => insertBullet('skills')}
                className="min-h-[44px] text-xs font-semibold text-[#123b65] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Puce</span>
              </button>
            </div>
          </div>
          <label htmlFor="skills" className="block text-xs font-semibold text-slate-700">
            Que sais-tu faire ?
          </label>
          <textarea
            id="skills"
            rows={4}
            value={data.skills}
            onChange={(e) => onChange('skills', e.target.value)}
            placeholder={"• Installation électrique\n• Utilisation d'Excel\n• Travail en équipe"}
            className="w-full min-h-[96px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors resize-y leading-relaxed"
          />
          <p className="text-xs text-slate-500">
            Tu peux mentionner les logiciels, les outils et les techniques appris pendant tes études.
          </p>
        </section>

        {/* SECTION 5: Projets et stages */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <FolderGit2 className="w-4 h-4 text-[#123b65] shrink-0" />
            <h3 className="text-sm font-bold text-slate-800">5. Projets et stages</h3>
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label htmlFor="projects" className="block text-xs font-semibold text-slate-700 min-w-0">
                Projets académiques ou mémoire
              </label>
              <div className="flex items-center gap-1.5 shrink-0">
                <ImproveWithAiButton
                  section="projects"
                  text={data.projects}
                  jobTitle={data.jobTitle}
                  name={data.name}
                  onImproved={(text) => onChange('projects', text)}
                />
                <button
                  type="button"
                  onClick={() => insertBullet('projects')}
                  className="min-h-[44px] text-xs font-semibold text-[#123b65] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Puce</span>
                </button>
              </div>
            </div>
            <textarea
              id="projects"
              rows={4}
              value={data.projects}
              onChange={(e) => onChange('projects', e.target.value)}
              placeholder={"Projet de fin d'études : étude d'une installation solaire photovoltaïque.\nDécris brièvement ton travail et ce que tu as réalisé."}
              className="w-full min-h-[96px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors resize-y leading-relaxed"
            />
          </div>

          <div>
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <label htmlFor="experience" className="block text-xs font-semibold text-slate-700 min-w-0">
                Stages ou autres expériences
              </label>
              <div className="flex items-center gap-1.5 shrink-0">
                <ImproveWithAiButton
                  section="experience"
                  text={data.experience}
                  jobTitle={data.jobTitle}
                  name={data.name}
                  onImproved={(text) => onChange('experience', text)}
                />
                <button
                  type="button"
                  onClick={() => insertBullet('experience')}
                  className="min-h-[44px] text-xs font-semibold text-[#123b65] flex items-center gap-1 bg-slate-100 hover:bg-slate-200 px-3 py-2 rounded-lg transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Puce</span>
                </button>
              </div>
            </div>
            <textarea
              id="experience"
              rows={4}
              value={data.experience}
              onChange={(e) => onChange('experience', e.target.value)}
              placeholder={"Stage dans une entreprise — 2 mois\nParticipation à des travaux pratiques ou à des projets collectifs."}
              className="w-full min-h-[96px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors resize-y leading-relaxed"
            />
            <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
              Si tu n'as pas encore fait de stage, laisse cette partie vide. N'invente aucune expérience.
            </p>
          </div>
        </section>

        {/* SECTION 6: Langues */}
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
            <Languages className="w-4 h-4 text-[#123b65] shrink-0" />
            <h3 className="text-sm font-bold text-slate-800">6. Langues</h3>
          </div>

          <div>
            <label htmlFor="languages" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Langues et niveau
            </label>
            <input
              id="languages"
              type="text"
              value={data.languages}
              onChange={(e) => onChange('languages', e.target.value)}
              placeholder="Ex. : Français : courant ; Anglais : intermédiaire"
              className="w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="interests" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Centres d'intérêt (facultatif)
            </label>
            <input
              id="interests"
              type="text"
              value={data.interests}
              onChange={(e) => onChange('interests', e.target.value)}
              placeholder="Ex. : Bricolage, football en club, échecs"
              className="w-full min-h-[46px] px-3.5 py-2.5 text-base bg-white border border-slate-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-[#123b65] transition-colors"
            />
          </div>
        </section>

        {/* Buttons section with >= 44px touch targets */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            id="previewButton"
            onClick={handleFormSubmit}
            className="w-full sm:flex-1 min-h-[48px] px-4 py-3 bg-[#123b65] hover:bg-[#0e2f52] active:bg-[#0a233d] text-white text-sm font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4 shrink-0" />
            <span>Prévisualiser mon CV</span>
          </button>

          <button
            type="button"
            id="resetButton"
            onClick={() => {
              onReset();
              setTouched({});
            }}
            className="w-full sm:w-auto min-h-[48px] px-4 py-3 bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4 shrink-0 text-slate-500" />
            <span>Effacer le formulaire</span>
          </button>
        </div>

        {/* Extra file utilities (Export / Import) with 44px min-height */}
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            type="button"
            onClick={handleExportJSON}
            className="min-h-[44px] px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            title="Télécharger une copie de sauvegarde sur votre téléphone"
          >
            <Download className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span>Sauvegarder JSON</span>
          </button>

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="min-h-[44px] px-3 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
            title="Restaurer un fichier JSON sauvegardé"
          >
            <Upload className="w-3.5 h-3.5 shrink-0 text-slate-500" />
            <span>Restaurer JSON</span>
          </button>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImportJSON}
            accept=".json,application/json"
            className="hidden"
          />
        </div>

        {/* Notice */}
        <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl flex items-start gap-2.5 text-xs text-blue-900 leading-relaxed">
          <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
          <span>
            Tes informations restent dans cette page pendant son utilisation. Cette version ne les envoie pas à un serveur et ne les sauvegarde pas automatiquement après la fermeture.
          </span>
        </div>
      </form>
    </div>
  );
};
