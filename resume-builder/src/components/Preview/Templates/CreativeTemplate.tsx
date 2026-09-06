import React from 'react';
import { ResumeData } from '../../../types';
import { getThemeClasses } from '../templateHelpers';
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderGit2, Sparkles, Compass } from 'lucide-react';

export const CreativeTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, workExperience, projectExperience, education, skills, awards, customSections, sectionsOrder, theme } = data;
  const styles = getThemeClasses(theme);

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="resume-section">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Compass className="w-4 h-4" />
              </span>
              <h2 className={`font-bold tracking-tight text-slate-900 ${styles.sectionHeadingClass}`}>
                个人亮点与定位
              </h2>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 text-slate-700 leading-relaxed whitespace-pre-wrap">
              {summary}
            </div>
          </section>
        );

      case 'experience':
        if (!workExperience || workExperience.length === 0) return null;
        return (
          <section key="experience" className="resume-section">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Briefcase className="w-4 h-4" />
              </span>
              <h2 className={`font-bold tracking-tight text-slate-900 ${styles.sectionHeadingClass}`}>
                工作经历
              </h2>
            </div>
            <div className={styles.itemGapClass}>
              {workExperience.map((exp) => (
                <div key={exp.id} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-xs space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{exp.company}</span>
                      {exp.city && <span className="text-xs text-slate-500">· {exp.city}</span>}
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-bold" style={{ color: theme.primaryColor }}>
                    {exp.role}
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 pt-1 text-xs">
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
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <FolderGit2 className="w-4 h-4" />
              </span>
              <h2 className={`font-bold tracking-tight text-slate-900 ${styles.sectionHeadingClass}`}>
                重点项目成果
              </h2>
            </div>
            <div className={styles.itemGapClass}>
              {projectExperience.map((proj) => (
                <div key={proj.id} className="p-3.5 rounded-xl border border-slate-100 bg-white shadow-xs space-y-1.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {proj.startDate} - {proj.endDate}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-700">项目角色：{proj.role}</span>
                    {proj.techStack && (
                      <span className="text-xs px-2 py-0.5 bg-slate-100 rounded text-slate-600 font-mono text-[11px]">
                        {proj.techStack}
                      </span>
                    )}
                  </div>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 pt-1 text-xs">
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
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <GraduationCap className="w-4 h-4" />
              </span>
              <h2 className={`font-bold tracking-tight text-slate-900 ${styles.sectionHeadingClass}`}>
                教育经历
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {education.map((edu) => (
                <div key={edu.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/70">
                  <div className="font-bold text-slate-900">{edu.school}</div>
                  <div className="text-xs text-slate-700 mt-0.5">
                    {edu.major} · {edu.degree}
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5">
                    {edu.startDate} - {edu.endDate}
                  </div>
                  {edu.gpa && <div className="text-[11px] text-slate-500 mt-1">GPA: {edu.gpa}</div>}
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
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Code className="w-4 h-4" />
              </span>
              <h2 className={`font-bold tracking-tight text-slate-900 ${styles.sectionHeadingClass}`}>
                专业技能
              </h2>
            </div>
            <div className="space-y-2">
              {skills.map((s) => (
                <div key={s.id} className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row sm:items-baseline gap-1.5 text-xs">
                  <span className="font-bold text-slate-900 shrink-0 min-w-[5rem]">{s.name}</span>
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
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                style={{ backgroundColor: theme.primaryColor }}
              >
                <Award className="w-4 h-4" />
              </span>
              <h2 className={`font-bold tracking-tight text-slate-900 ${styles.sectionHeadingClass}`}>
                资质与证书
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {awards.map((a) => (
                <div key={a.id} className="p-2 rounded-lg border border-slate-100 flex items-center justify-between">
                  <span className="font-medium text-slate-800">• {a.name}</span>
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
                  <span
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs shadow-xs"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </span>
                  <h2 className={`font-bold tracking-tight text-slate-900 ${styles.sectionHeadingClass}`}>
                    {c.title}
                  </h2>
                </div>
                <p className="text-slate-700 leading-relaxed text-xs p-3 rounded-lg border border-slate-100 whitespace-pre-wrap">
                  {c.content}
                </p>
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
      ? 'rounded-2xl'
      : 'rounded-none';

  return (
    <div className={`resume-sheet bg-white text-slate-800 ${styles.fontClass} ${styles.fontSizeClass} overflow-hidden shadow-sm`}>
      {/* Top Banner Header */}
      <header
        className="px-8 py-7 text-white flex flex-col sm:flex-row items-center justify-between gap-6"
        style={{
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, #1e293b 100%)`,
        }}
      >
        <div className="space-y-2 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
            <h1 className={`font-black tracking-tight text-white ${styles.titleSizeClass}`}>
              {personalInfo.name || '姓名'}
            </h1>
            {personalInfo.targetJob && (
              <span className="text-xs sm:text-sm font-medium px-3 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-xs">
                {personalInfo.targetJob}
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-1.5 text-xs text-slate-200 pt-1">
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-white/70" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-white/70" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-white/70" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.experienceYears && <span>• {personalInfo.experienceYears}</span>}
            {personalInfo.educationLevel && <span>• {personalInfo.educationLevel}</span>}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5 text-white/70" />
                <a href={personalInfo.website} target="_blank" rel="noreferrer" className="hover:underline text-cyan-200">
                  {personalInfo.website.replace(/^https?:\/\//, '')}
                </a>
              </span>
            )}
          </div>
        </div>

        {personalInfo.showAvatar && personalInfo.avatarUrl && (
          <img
            src={personalInfo.avatarUrl}
            alt={personalInfo.name}
            className={`w-20 h-24 sm:w-24 sm:h-28 object-cover ring-4 ring-white/30 shadow-lg ${avatarShapeClass}`}
          />
        )}
      </header>

      {/* Body */}
      <div className={`p-7 sm:p-9 ${styles.sectionGapClass}`}>
        {sectionsOrder.filter((s) => s.enabled).map((s) => renderSection(s.key))}
      </div>
    </div>
  );
};
