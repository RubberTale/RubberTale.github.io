export interface PersonalInfo {
  name: string;
  targetJob: string;
  phone: string;
  email: string;
  location: string;
  experienceYears: string;
  educationLevel: string;
  website: string;
  avatarUrl: string;
  showAvatar: boolean;
  avatarShape: 'circle' | 'rounded' | 'square';
}

export interface WorkExperienceItem {
  id: string;
  company: string;
  role: string;
  city?: string;
  startDate: string;
  endDate: string;
  current: boolean;
  highlights: string[];
}

export interface ProjectExperienceItem {
  id: string;
  name: string;
  role: string;
  startDate: string;
  endDate: string;
  techStack?: string;
  highlights: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  major: string;
  degree: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  details?: string;
}

export interface SkillCategory {
  id: string;
  name: string;
  skills: string;
}

export interface AwardItem {
  id: string;
  name: string;
  date: string;
  issuer?: string;
}

export interface CustomSectionItem {
  id: string;
  title: string;
  content: string;
}

export type SectionKey =
  | 'summary'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'awards'
  | 'custom';

export interface SectionMeta {
  key: SectionKey;
  label: string;
  enabled: boolean;
}

export type TemplateType = 'classic' | 'modern' | 'sidebar' | 'creative';

export interface ThemeConfig {
  template: TemplateType;
  primaryColor: string;
  fontFamily: 'sans' | 'serif' | 'mono';
  fontSize: 'compact' | 'normal' | 'comfortable';
  lineHeight: 'compact' | 'normal' | 'relaxed';
  sectionGap: 'compact' | 'normal' | 'relaxed';
  paperPadding: 'compact' | 'normal' | 'relaxed';
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  workExperience: WorkExperienceItem[];
  projectExperience: ProjectExperienceItem[];
  education: EducationItem[];
  skills: SkillCategory[];
  awards: AwardItem[];
  customSections: CustomSectionItem[];
  sectionsOrder: SectionMeta[];
  theme: ThemeConfig;
}
