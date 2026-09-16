import { ResumeData } from '../types';
import { DEFAULT_RESUME } from '../constants/sampleData';

const STORAGE_KEY = 'rubbertale_resume_data_v1';

export function loadSavedResume(): ResumeData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_RESUME;
    const parsed = JSON.parse(raw);
    // Merge with defaults in case of missing keys
    return {
      ...DEFAULT_RESUME,
      ...parsed,
      personalInfo: { ...DEFAULT_RESUME.personalInfo, ...(parsed.personalInfo || {}) },
      theme: { ...DEFAULT_RESUME.theme, ...(parsed.theme || {}) },
    };
  } catch (e) {
    console.error('Failed to load resume from localStorage:', e);
    return DEFAULT_RESUME;
  }
}

export function saveResume(data: ResumeData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error('Failed to save resume to localStorage:', e);
  }
}

export function clearSavedResume(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error('Failed to clear resume from localStorage:', e);
  }
}
