import { ThemeColor, ThemeConfig } from '../types';

export const themeConfigs: Record<ThemeColor, ThemeConfig> = {
  navy: {
    id: 'navy',
    label: 'Bleu Marine',
    primary: '#123b65',
    primaryLight: '#eff6ff',
    primaryDark: '#0b2644',
    accentBorder: '#123b65',
    headerBg: '#123b65',
    tagBg: '#e0e7ff'
  },
  blue: {
    id: 'blue',
    label: 'Bleu Cobalt',
    primary: '#1d4ed8',
    primaryLight: '#eff6ff',
    primaryDark: '#1e40af',
    accentBorder: '#1d4ed8',
    headerBg: '#1d4ed8',
    tagBg: '#dbeafe'
  },
  emerald: {
    id: 'emerald',
    label: 'Vert Émeraude',
    primary: '#047857',
    primaryLight: '#ecfdf5',
    primaryDark: '#065f46',
    accentBorder: '#047857',
    headerBg: '#047857',
    tagBg: '#d1fae5'
  },
  burgundy: {
    id: 'burgundy',
    label: 'Bordeaux Élégant',
    primary: '#881337',
    primaryLight: '#fff1f2',
    primaryDark: '#701a31',
    accentBorder: '#881337',
    headerBg: '#881337',
    tagBg: '#ffe4e6'
  },
  slate: {
    id: 'slate',
    label: 'Gris Anthracite',
    primary: '#1e293b',
    primaryLight: '#f8fafc',
    primaryDark: '#0f172a',
    accentBorder: '#334155',
    headerBg: '#1e293b',
    tagBg: '#f1f5f9'
  },
  amber: {
    id: 'amber',
    label: 'Ambre Chaud',
    primary: '#92400e',
    primaryLight: '#fffbeb',
    primaryDark: '#78350f',
    accentBorder: '#92400e',
    headerBg: '#92400e',
    tagBg: '#fef3c7'
  }
};
