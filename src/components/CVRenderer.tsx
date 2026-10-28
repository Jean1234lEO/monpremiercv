import React from 'react';
import { CVData, TemplateId, ThemeColor } from '../types';
import { themeConfigs } from '../data/themes';
import { Mail, Phone, MapPin, Globe, Linkedin } from 'lucide-react';

interface CVRendererProps {
  data: CVData;
  templateId: TemplateId;
  themeColor: ThemeColor;
  fontFamily: 'sans' | 'serif';
}

export const CVRenderer: React.FC<CVRendererProps> = ({
  data,
  templateId,
  themeColor,
  fontFamily
}) => {
  const theme = themeConfigs[themeColor] || themeConfigs.navy;
  const isSerif = fontFamily === 'serif';

  // Contact items helper
  const contactParts: { icon: typeof Mail; text: string }[] = [];
  if (data.email) contactParts.push({ icon: Mail, text: data.email });
  if (data.phone) contactParts.push({ icon: Phone, text: data.phone });
  if (data.city) contactParts.push({ icon: MapPin, text: data.city });
  if (data.linkedin) contactParts.push({ icon: Linkedin, text: data.linkedin });
  if (data.website) contactParts.push({ icon: Globe, text: data.website });

  const renderMultiLine = (text: string, emptyFallback: string) => {
    if (!text || !text.trim()) {
      return <p className="text-slate-400 italic text-xs leading-relaxed">{emptyFallback}</p>;
    }

    const lines = text.split('\n');
    return (
      <div className="space-y-1.5 text-slate-700 text-xs sm:text-[13px] leading-relaxed break-words">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) {
            return <div key={idx} className="h-1.5" />;
          }
          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
            return (
              <div key={idx} className="flex items-start gap-2 pl-0.5">
                <span className="text-slate-400 select-none shrink-0">•</span>
                <span className="flex-1 break-words">{trimmed.replace(/^[•\-]\s*/, '')}</span>
              </div>
            );
          }
          return (
            <p
              key={idx}
              className={`break-words ${
                trimmed.includes('—') || trimmed.includes(':') ? 'font-medium text-slate-800' : ''
              }`}
            >
              {line}
            </p>
          );
        })}
      </div>
    );
  };

  // --- TEMPLATE 1: CLASSIQUE (Signature MonPremierCV style) ---
  if (templateId === 'classic') {
    return (
      <div
        id="cv-printable"
        className={`w-full max-w-full bg-white text-slate-800 p-4 sm:p-8 md:p-10 shadow-xs border border-slate-200 transition-all overflow-hidden break-words ${
          isSerif ? 'font-serif' : 'font-sans'
        }`}
        style={{ minHeight: '600px' }}
      >
        {/* Header with Photo in Top-Right Corner */}
        <div
          className="pb-4 sm:pb-5 mb-5 sm:mb-6"
          style={{ borderBottom: `3px solid ${theme.primary}` }}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1
                className="text-xl sm:text-2xl md:text-3xl font-extrabold uppercase tracking-wide mb-1 break-words leading-tight"
                style={{ color: theme.primary }}
              >
                {data.name.trim() || 'TON NOM ET PRÉNOMS'}
              </h1>
              <p className="text-sm sm:text-base font-bold text-slate-700 mb-2 break-words">
                {data.jobTitle.trim() || 'Poste recherché'}
              </p>
              <div className="text-xs text-slate-600 flex flex-wrap items-center gap-x-2 gap-y-1 break-all">
                {contactParts.length > 0 ? (
                  contactParts.map((item, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-slate-300 font-bold select-none">·</span>}
                      <span className="break-all">{item.text}</span>
                    </React.Fragment>
                  ))
                ) : (
                  <span className="text-slate-400 italic">E-mail · Téléphone · Ville</span>
                )}
              </div>
            </div>

            {/* Photo in Top-Right Corner */}
            {data.photo && (
              <div className="shrink-0">
                <img
                  src={data.photo}
                  alt={data.name || 'Photo de profil'}
                  className="w-18 h-22 sm:w-24 sm:h-28 md:w-26 md:h-32 object-cover rounded-lg border-2 border-white shadow-xs ring-1 ring-slate-300"
                />
              </div>
            )}
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-4 sm:space-y-5">
          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2"
              style={{
                color: theme.primary,
                borderBottom: '1px solid #cbd5e1'
              }}
            >
              Profil professionnel
            </h2>
            {renderMultiLine(data.profile, 'Ta présentation apparaîtra ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2"
              style={{
                color: theme.primary,
                borderBottom: '1px solid #cbd5e1'
              }}
            >
              Formation
            </h2>
            {renderMultiLine(data.education, 'Tes diplômes et formations apparaîtront ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2"
              style={{
                color: theme.primary,
                borderBottom: '1px solid #cbd5e1'
              }}
            >
              Compétences
            </h2>
            {renderMultiLine(data.skills, 'Tes compétences apparaîtront ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2"
              style={{
                color: theme.primary,
                borderBottom: '1px solid #cbd5e1'
              }}
            >
              Projets académiques ou mémoire
            </h2>
            {renderMultiLine(data.projects, 'Tes projets apparaîtront ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2"
              style={{
                color: theme.primary,
                borderBottom: '1px solid #cbd5e1'
              }}
            >
              Stages et autres expériences
            </h2>
            {renderMultiLine(data.experience, 'Tes stages et expériences apparaîtront ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2"
              style={{
                color: theme.primary,
                borderBottom: '1px solid #cbd5e1'
              }}
            >
              Langues
            </h2>
            {renderMultiLine(data.languages, 'Tes langues apparaîtront ici.')}
          </section>

          {data.interests.trim() && (
            <section className="print-page-break-avoid">
              <h2
                className="text-xs font-bold uppercase tracking-wider pb-1.5 mb-2"
                style={{
                  color: theme.primary,
                  borderBottom: '1px solid #cbd5e1'
                }}
              >
                Centres d'intérêt
              </h2>
              {renderMultiLine(data.interests, '')}
            </section>
          )}
        </div>
      </div>
    );
  }

  // --- TEMPLATE 2: MODERNE ÉPURÉ ---
  if (templateId === 'modern') {
    return (
      <div
        id="cv-printable"
        className={`w-full max-w-full bg-white text-slate-800 shadow-xs border border-slate-200 transition-all overflow-hidden break-words ${
          isSerif ? 'font-serif' : 'font-sans'
        }`}
        style={{ minHeight: '600px' }}
      >
        {/* Modern Accent Header with Photo in Top-Right Corner */}
        <div
          className="p-4 sm:p-7 md:p-8 text-white break-words"
          style={{ backgroundColor: theme.primary }}
        >
          <div className="flex items-start justify-between gap-3 sm:gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold tracking-tight mb-1 break-words leading-tight">
                {data.name.trim() || 'TON NOM ET PRÉNOMS'}
              </h1>
              <p className="text-xs sm:text-sm font-semibold opacity-95 text-slate-100 mb-2.5 break-words">
                {data.jobTitle.trim() || 'Poste recherché'}
              </p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs opacity-90 text-slate-100 break-all">
                {contactParts.length > 0 ? (
                  contactParts.map((item, idx) => (
                    <span key={idx} className="flex items-center gap-1.5 break-all">
                      <item.icon className="w-3.5 h-3.5 opacity-80 shrink-0" />
                      <span className="break-all">{item.text}</span>
                    </span>
                  ))
                ) : (
                  <span>E-mail · Téléphone · Ville</span>
                )}
              </div>
            </div>

            {/* Photo in Top-Right Corner */}
            {data.photo && (
              <div className="shrink-0">
                <img
                  src={data.photo}
                  alt={data.name || 'Photo de profil'}
                  className="w-18 h-22 sm:w-24 sm:h-28 md:w-26 md:h-32 object-cover rounded-xl border-2 border-white/80 shadow-md ring-1 ring-black/10"
                />
              </div>
            )}
          </div>
        </div>

        <div className="p-4 sm:p-7 md:p-8 space-y-5">
          <section className="print-page-break-avoid">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                Profil
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>
            <div className="pl-3 sm:pl-4">
              {renderMultiLine(data.profile, 'Ta présentation apparaîtra ici.')}
            </div>
          </section>

          <section className="print-page-break-avoid">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                Formation & Diplômes
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>
            <div className="pl-3 sm:pl-4">
              {renderMultiLine(data.education, 'Tes diplômes et formations apparaîtront ici.')}
            </div>
          </section>

          <section className="print-page-break-avoid">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                Compétences Clés
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>
            <div className="pl-3 sm:pl-4">
              {renderMultiLine(data.skills, 'Tes compétences apparaîtront ici.')}
            </div>
          </section>

          <section className="print-page-break-avoid">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                Projets Académiques & Réalisations
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>
            <div className="pl-3 sm:pl-4">
              {renderMultiLine(data.projects, 'Tes projets apparaîtront ici.')}
            </div>
          </section>

          <section className="print-page-break-avoid">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                Stages & Expériences
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>
            <div className="pl-3 sm:pl-4">
              {renderMultiLine(data.experience, 'Tes expériences apparaîtront ici.')}
            </div>
          </section>

          <section className="print-page-break-avoid">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
              <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                Langues
              </h2>
              <div className="flex-1 h-[1px] bg-slate-200" />
            </div>
            <div className="pl-3 sm:pl-4">
              {renderMultiLine(data.languages, 'Tes langues apparaîtront ici.')}
            </div>
          </section>

          {data.interests.trim() && (
            <section className="print-page-break-avoid">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: theme.primary }} />
                <h2 className="text-xs font-bold uppercase tracking-wider" style={{ color: theme.primary }}>
                  Centres d'intérêt
                </h2>
                <div className="flex-1 h-[1px] bg-slate-200" />
              </div>
              <div className="pl-3 sm:pl-4">
                {renderMultiLine(data.interests, '')}
              </div>
            </section>
          )}
        </div>
      </div>
    );
  }

  // --- TEMPLATE 3: DEUX COLONNES COMPACT ---
  if (templateId === 'two-column') {
    return (
      <div
        id="cv-printable"
        className={`w-full max-w-full bg-white text-slate-800 shadow-xs border border-slate-200 grid grid-cols-1 md:grid-cols-12 min-h-[600px] transition-all overflow-hidden break-words ${
          isSerif ? 'font-serif' : 'font-sans'
        }`}
      >
        {/* Left Sidebar */}
        <aside
          className="md:col-span-4 p-4 sm:p-6 text-slate-800 break-words"
          style={{ backgroundColor: theme.primaryLight }}
        >
          <div className="flex items-center gap-3 md:block mb-4">
            {/* If photo is uploaded, we display photo or initials */}
            {data.photo ? (
              <img
                src={data.photo}
                alt={data.name || 'Photo de profil'}
                className="w-14 h-16 sm:w-16 sm:h-20 object-cover rounded-lg border-2 border-white shadow-xs md:mb-4 shrink-0"
              />
            ) : (
              <div
                className="w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center font-bold text-white text-base md:mb-4 shadow-xs shrink-0"
                style={{ backgroundColor: theme.primary }}
              >
                {data.name
                  ? data.name
                      .split(' ')
                      .map((w) => w[0])
                      .filter(Boolean)
                      .slice(0, 2)
                      .join('')
                      .toUpperCase()
                  : 'CV'}
              </div>
            )}
            <div className="md:hidden">
              <h1 className="text-base font-extrabold uppercase" style={{ color: theme.primary }}>
                {data.name.trim() || 'TON NOM ET PRÉNOMS'}
              </h1>
              <p className="text-xs font-semibold text-slate-600">
                {data.jobTitle.trim() || 'Poste recherché'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ color: theme.primary, borderColor: 'rgba(0,0,0,0.1)' }}
              >
                Contact
              </h3>
              <div className="space-y-1.5 text-xs text-slate-700 break-all">
                {contactParts.length > 0 ? (
                  contactParts.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2 break-all">
                      <item.icon className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-500" />
                      <span className="break-all">{item.text}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-slate-400 italic">E-mail, téléphone, ville</p>
                )}
              </div>
            </div>

            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ color: theme.primary, borderColor: 'rgba(0,0,0,0.1)' }}
              >
                Compétences
              </h3>
              {renderMultiLine(data.skills, 'Tes compétences')}
            </div>

            <div>
              <h3
                className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                style={{ color: theme.primary, borderColor: 'rgba(0,0,0,0.1)' }}
              >
                Langues
              </h3>
              {renderMultiLine(data.languages, 'Tes langues')}
            </div>

            {data.interests.trim() && (
              <div>
                <h3
                  className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
                  style={{ color: theme.primary, borderColor: 'rgba(0,0,0,0.1)' }}
                >
                  Centres d'intérêt
                </h3>
                {renderMultiLine(data.interests, '')}
              </div>
            )}
          </div>
        </aside>

        {/* Right Main Column with Photo in Top-Right Corner */}
        <main className="md:col-span-8 p-4 sm:p-6 space-y-4 break-words">
          <div className="hidden md:flex items-start justify-between gap-4 border-b border-slate-200 pb-3">
            <div className="flex-1 min-w-0">
              <h1
                className="text-2xl font-extrabold uppercase tracking-tight break-words"
                style={{ color: theme.primary }}
              >
                {data.name.trim() || 'TON NOM ET PRÉNOMS'}
              </h1>
              <p className="text-sm font-bold text-slate-600 mt-1 break-words">
                {data.jobTitle.trim() || 'Poste recherché'}
              </p>
            </div>
            {data.photo && (
              <div className="shrink-0">
                <img
                  src={data.photo}
                  alt={data.name || 'Photo de profil'}
                  className="w-18 h-22 sm:w-22 sm:h-26 object-cover rounded-lg border-2 border-white shadow-xs ring-1 ring-slate-300"
                />
              </div>
            )}
          </div>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: theme.primary, borderColor: '#cbd5e1' }}
            >
              Profil Professionnel
            </h2>
            {renderMultiLine(data.profile, 'Ta présentation apparaîtra ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: theme.primary, borderColor: '#cbd5e1' }}
            >
              Formation
            </h2>
            {renderMultiLine(data.education, 'Tes diplômes et formations apparaîtront ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: theme.primary, borderColor: '#cbd5e1' }}
            >
              Projets Académiques & Réalisations
            </h2>
            {renderMultiLine(data.projects, 'Tes projets apparaîtront ici.')}
          </section>

          <section className="print-page-break-avoid">
            <h2
              className="text-xs font-bold uppercase tracking-wider pb-1 mb-2 border-b"
              style={{ color: theme.primary, borderColor: '#cbd5e1' }}
            >
              Stages & Expériences
            </h2>
            {renderMultiLine(data.experience, 'Tes stages et expériences apparaîtront ici.')}
          </section>
        </main>
      </div>
    );
  }

  // --- TEMPLATE 4: MINIMALISTE ---
  return (
    <div
      id="cv-printable"
      className={`w-full max-w-full bg-white text-slate-800 p-4 sm:p-8 md:p-10 shadow-xs border border-slate-200 transition-all overflow-hidden break-words ${
        isSerif ? 'font-serif' : 'font-sans'
      }`}
      style={{ minHeight: '600px' }}
    >
      <div className="pb-4 mb-5 border-b border-slate-200 break-words flex items-start justify-between gap-3 sm:gap-4">
        <div className="flex-1 min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mb-1 text-slate-900 break-words leading-tight">
            {data.name.trim() || 'TON NOM ET PRÉNOMS'}
          </h1>
          <p className="text-xs sm:text-sm font-semibold mb-2 break-words" style={{ color: theme.primary }}>
            {data.jobTitle.trim() || 'Poste recherché'}
          </p>
          <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-2.5 gap-y-1 break-all">
            {contactParts.length > 0 ? (
              contactParts.map((item, idx) => (
                <React.Fragment key={idx}>
                  {idx > 0 && <span className="text-slate-300 select-none">/</span>}
                  <span className="break-all">{item.text}</span>
                </React.Fragment>
              ))
            ) : (
              <span className="italic">E-mail / Téléphone / Ville</span>
            )}
          </div>
        </div>

        {/* Photo in Top-Right Corner */}
        {data.photo && (
          <div className="shrink-0">
            <img
              src={data.photo}
              alt={data.name || 'Photo de profil'}
              className="w-18 h-22 sm:w-22 sm:h-26 object-cover rounded-md border border-slate-200 shadow-xs"
            />
          </div>
        )}
      </div>

      <div className="space-y-4 sm:space-y-5">
        <section className="print-page-break-avoid">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            01. Profil
          </h2>
          {renderMultiLine(data.profile, 'Ta présentation apparaîtra ici.')}
        </section>

        <section className="print-page-break-avoid">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            02. Formation
          </h2>
          {renderMultiLine(data.education, 'Tes diplômes et formations apparaîtront ici.')}
        </section>

        <section className="print-page-break-avoid">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            03. Compétences
          </h2>
          {renderMultiLine(data.skills, 'Tes compétences apparaîtront ici.')}
        </section>

        <section className="print-page-break-avoid">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            04. Projets & Études
          </h2>
          {renderMultiLine(data.projects, 'Tes projets apparaîtront ici.')}
        </section>

        <section className="print-page-break-avoid">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            05. Stages & Expériences
          </h2>
          {renderMultiLine(data.experience, 'Tes stages et expériences apparaîtront ici.')}
        </section>

        <section className="print-page-break-avoid">
          <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
            06. Langues
          </h2>
          {renderMultiLine(data.languages, 'Tes langues apparaîtront ici.')}
        </section>

        {data.interests.trim() && (
          <section className="print-page-break-avoid">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              07. Centres d'intérêt
            </h2>
            {renderMultiLine(data.interests, '')}
          </section>
        )}
      </div>
    </div>
  );
};
