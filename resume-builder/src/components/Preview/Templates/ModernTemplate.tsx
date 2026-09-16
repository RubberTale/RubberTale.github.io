import React from 'react';
import { ResumeData } from '../../../types';
import { getThemeClasses } from '../templateHelpers';
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderGit2, Sparkles } from 'lucide-react';

export const ModernTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, workExperience, projectExperience, education, skills, awards, customSections, sectionsOrder, theme } = data;
  const styles = getThemeClasses(theme);

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="resume-section">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              <h2 className={`font-bold tracking-wide text-slate-900 ${styles.sectionHeadingClass}`}>
                个人优势与概览
              </h2>
            </div>
            <p className="text-slate-700 leading-relaxed pl-3.5 border-l-2 border-slate-100 whitespace-pre-wrap">
              {summary}
            </p>
          </section>
        );

      case 'experience':
        if (!workExperience || workExperience.length === 0) return null;
        return (
          <section key="experience" className="resume-section">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              <h2 className={`font-bold tracking-wide text-slate-900 ${styles.sectionHeadingClass}`}>
                职业经历
              </h2>
            </div>
            <div className={styles.itemGapClass}>
              {workExperience.map((exp) => (
                <div key={exp.id} className="relative pl-3.5 border-l-2 border-slate-200 group">
                  <div
                    className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{exp.company}</span>
                      {exp.city && <span className="text-xs text-slate-400">/ {exp.city}</span>}
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {exp.startDate} – {exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold mt-0.5" style={{ color: theme.primaryColor }}>
                    {exp.role}
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-1 text-slate-700 pt-1.5">
                      {exp.highlights.map((hl, i) => (
                        <li key={i} className="leading-relaxed">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'projects':
        if (!projectExperience || projectExperience.length === 0) return null;
        return (
          <section key="projects" className="resume-section">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              <h2 className={`font-bold tracking-wide text-slate-900 ${styles.sectionHeadingClass}`}>
                重点项目
              </h2>
            </div>
            <div className={styles.itemGapClass}>
              {projectExperience.map((proj) => (
                <div key={proj.id} className="relative pl-3.5 border-l-2 border-slate-200">
                  <div
                    className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full ring-2 ring-white"
                    style={{ backgroundColor: theme.primaryColor }}
                  />
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    <span className="text-xs font-medium text-slate-500">
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs mt-0.5">
                    <span className="font-medium text-slate-800">职责：{proj.role}</span>
                    {proj.techStack && (
                      <span className="text-xs px-2 py-0.5 bg-slate-100 text-slate-600 rounded-full font-mono text-[11px]">
                        {proj.techStack}
                      </span>
                    )}
                  </div>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-1 text-slate-700 pt-1.5">
                      {proj.highlights.map((hl, i) => (
                        <li key={i} className="leading-relaxed">
                          {hl}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        );

      case 'education':
        if (!education || education.length === 0) return null;
        return (
          <section key="education" className="resume-section">
            <div className="flex items-center gap-2 mb-2.5">
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              <h2 className={`font-bold tracking-wide text-slate-900 ${styles.sectionHeadingClass}`}>
                教育经历
              </h2>
            </div>
            <div className={styles.itemGapClass}>
              {education.map((edu) => (
                <div key={edu.id} className="flex flex-wrap items-baseline justify-between gap-x-2 pl-3.5">
                  <div>
                    <span className="font-bold text-slate-900">{edu.school}</span>
                    <span className="text-xs text-slate-600 ml-2">
                      {edu.major} · {edu.degree}
                    </span>
                    {edu.gpa && <span className="text-xs text-slate-500 ml-2">({edu.gpa})</span>}
                  </div>
                  <span className="text-xs text-slate-500">
                    {edu.startDate} – {edu.endDate}
                  </span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <section key="skills" className="resume-section">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              <h2 className={`font-bold tracking-wide text-slate-900 ${styles.sectionHeadingClass}`}>
                技能矩阵
              </h2>
            </div>
            <div className="pl-3.5 space-y-1.5">
              {skills.map((s) => (
                <div key={s.id} className="flex items-start gap-2 text-xs">
                  <span className="font-semibold text-slate-800 shrink-0 min-w-[5.5rem]">{s.name}</span>
                  <span className="text-slate-600 leading-relaxed">{s.skills}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'awards':
        if (!awards || awards.length === 0) return null;
        return (
          <section key="awards" className="resume-section">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
              <h2 className={`font-bold tracking-wide text-slate-900 ${styles.sectionHeadingClass}`}>
                资质与荣誉
              </h2>
            </div>
            <div className="pl-3.5 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {awards.map((a) => (
                <div key={a.id} className="flex items-center justify-between text-slate-700">
                  <span>• {a.name}</span>
                  <span className="text-slate-400 text-[11px]">{a.date}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'custom':
        if (!customSections || customSections.length === 0) return null;
        return (
          <div key="custom" className="space-y-3">
            {customSections.map((c) => (
              <section key={c.id} className="resume-section">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-4 rounded-full" style={{ backgroundColor: theme.primaryColor }} />
                  <h2 className={`font-bold tracking-wide text-slate-900 ${styles.sectionHeadingClass}`}>
                    {c.title}
                  </h2>
                </div>
                <p className="text-slate-700 leading-relaxed pl-3.5 text-xs whitespace-pre-wrap">{c.content}</p>
              </section>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  const avatarShapeClass =
    personalInfo.avatarShape === 'circle'
      ? 'rounded-full'
      : personalInfo.avatarShape === 'rounded'
      ? 'rounded-xl'
      : 'rounded-none';

  return (
    <div className={`resume-sheet bg-white text-slate-800 ${styles.fontClass} ${styles.fontSizeClass} ${styles.paddingStyle}`}>
      {/* Header */}
      <header className="pb-5 mb-5 border-b border-slate-100 flex items-center justify-between gap-6">
        <div className="flex-1 space-y-2">
          <div>
            <h1 className={`font-extrabold tracking-tight text-slate-900 ${styles.titleSizeClass}`}>
              {personalInfo.name || '姓名'}
            </h1>
            {personalInfo.targetJob && (
              <div className="inline-block mt-1 px-2.5 py-0.5 rounded text-xs font-semibold text-white shadow-xs" style={{ backgroundColor: theme.primaryColor }}>
                {personalInfo.targetJob}
              </div>
            )}
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-600 pt-1">
            {personalInfo.phone && (
              <span className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.experienceYears && <span>| {personalInfo.experienceYears}</span>}
            {personalInfo.educationLevel && <span>| {personalInfo.educationLevel}</span>}
            {personalInfo.website && (
              <span className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline text-blue-600">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
          </div>
        </div>

        {/* Avatar */}
        {personalInfo.showAvatar && personalInfo.avatarUrl && (
          <div className="shrink-0">
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.name}
              className={`w-20 h-24 object-cover ring-2 ring-slate-100 shadow-md ${avatarShapeClass}`}
            />
          </div>
        )}
      </header>

      {/* Main Sections */}
      <div className={styles.sectionGapClass}>
        {sectionsOrder.filter((s) => s.enabled).map((s) => renderSection(s.key))}
      </div>
    </div>
  );
};
