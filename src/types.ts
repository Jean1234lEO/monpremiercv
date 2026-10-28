export interface CVData {
  name: string;
  jobTitle: string;
  email: string;
  phone: string;
  city: string;
  linkedin: string;
  website: string;
  profile: string;
  education: string;
  skills: string;
  projects: string;
  experience: string;
  languages: string;
  interests: string;
  photo?: string;
}

export type TemplateId = 'classic' | 'modern' | 'two-column' | 'minimalist';

export type ThemeColor = 'navy' | 'blue' | 'emerald' | 'burgundy' | 'slate' | 'amber';

export interface ThemeConfig {
  id: ThemeColor;
  label: string;
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accentBorder: string;
  headerBg?: string;
  tagBg: string;
}

export interface PresetCV {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  data: CVData;
}
