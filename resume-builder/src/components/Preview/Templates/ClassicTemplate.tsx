import React from 'react';
import { ResumeData } from '../../../types';
import { getThemeClasses } from '../templateHelpers';
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderGit2, User } from 'lucide-react';

export const ClassicTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, workExperience, projectExperience, education, skills, awards, customSections, sectionsOrder, theme } = data;
  const styles = getThemeClasses(theme);

  const renderSection = (key: string) => {
    switch (key) {
      case 'summary':
        if (!summary) return null;
        return (
          <section key="summary" className="resume-section">
            <h2
              className={`font-bold flex items-center gap-2 border-b pb-1 mb-2 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <User className="w-4 h-4 shrink-0" />
              <span>个人简介</span>
            </h2>
            <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{summary}</p>
          </section>
        );

      case 'experience':
        if (!workExperience || workExperience.length === 0) return null;
        return (
          <section key="experience" className="resume-section">
            <h2
              className={`font-bold flex items-center gap-2 border-b pb-1 mb-2.5 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <Briefcase className="w-4 h-4 shrink-0" />
              <span>工作经历</span>
            </h2>
            <div className={styles.itemGapClass}>
              {workExperience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 font-medium">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{exp.company}</span>
                      {exp.city && <span className="text-xs text-slate-500">· {exp.city}</span>}
                    </div>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">{exp.role}</div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 pt-0.5">
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
            <h2
              className={`font-bold flex items-center gap-2 border-b pb-1 mb-2.5 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <FolderGit2 className="w-4 h-4 shrink-0" />
              <span>项目经历</span>
            </h2>
            <div className={styles.itemGapClass}>
              {projectExperience.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2 font-medium">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {proj.startDate} - {proj.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="font-medium text-slate-800">角色：{proj.role}</span>
                    {proj.techStack && (
                      <span className="text-slate-500 font-mono bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded text-[11px]">
                        {proj.techStack}
                      </span>
                    )}
                  </div>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-4 space-y-1 text-slate-700 pt-0.5">
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
            <h2
              className={`font-bold flex items-center gap-2 border-b pb-1 mb-2.5 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <GraduationCap className="w-4 h-4 shrink-0" />
              <span>教育背景</span>
            </h2>
            <div className={styles.itemGapClass}>
              {education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{edu.school}</span>
                      <span className="text-xs text-slate-600">
                        · {edu.major} ({edu.degree})
                      </span>
                    </div>
                    <span className="text-xs text-slate-600">
                      {edu.startDate} - {edu.endDate}
                    </span>
                  </div>
                  {edu.gpa && <div className="text-xs text-slate-600">GPA / 成绩：{edu.gpa}</div>}
                  {edu.details && <div className="text-xs text-slate-600 leading-relaxed">{edu.details}</div>}
                </div>
              ))}
            </div>
          </section>
        );

      case 'skills':
        if (!skills || skills.length === 0) return null;
        return (
          <section key="skills" className="resume-section">
            <h2
              className={`font-bold flex items-center gap-2 border-b pb-1 mb-2 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <Code className="w-4 h-4 shrink-0" />
              <span>专业技能</span>
            </h2>
            <div className="space-y-1.5 text-slate-700">
              {skills.map((s) => (
                <div key={s.id} className="flex items-start gap-2">
                  <span className="font-semibold text-slate-900 shrink-0 min-w-[5rem] text-xs">
                    {s.name}：
                  </span>
                  <span className="leading-relaxed text-xs">{s.skills}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'awards':
        if (!awards || awards.length === 0) return null;
        return (
          <section key="awards" className="resume-section">
            <h2
              className={`font-bold flex items-center gap-2 border-b pb-1 mb-2 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <Award className="w-4 h-4 shrink-0" />
              <span>证书与荣誉</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-slate-700 text-xs">
              {awards.map((a) => (
                <div key={a.id} className="flex items-center justify-between gap-2 pr-2">
                  <span className="font-medium text-slate-900">• {a.name}</span>
                  <span className="text-slate-500 shrink-0 text-[11px]">{a.date}</span>
                </div>
              ))}
            </div>
          </section>
        );

      case 'custom':
        if (!customSections || customSections.length === 0) return null;
        return (
          <div key="custom" className="space-y-4">
            {customSections.map((c) => (
              <section key={c.id} className="resume-section">
                <h2
                  className={`font-bold flex items-center gap-2 border-b pb-1 mb-2 ${styles.sectionHeadingClass}`}
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                >
                  <span>{c.title}</span>
                </h2>
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-xs">{c.content}</p>
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
      <header className="border-b-2 pb-4 mb-4 flex items-center justify-between gap-6" style={{ borderColor: theme.primaryColor }}>
        <div className="flex-1 space-y-1.5">
          <div className="flex items-baseline gap-3">
            <h1 className={`font-extrabold tracking-tight text-slate-900 ${styles.titleSizeClass}`}>
              {personalInfo.name || '姓名'}
            </h1>
            {personalInfo.targetJob && (
              <span className="font-semibold text-sm" style={{ color: theme.primaryColor }}>
                {personalInfo.targetJob}
              </span>
            )}
          </div>

          {/* Contact Details */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 pt-1">
            {personalInfo.phone && (
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.phone}
              </span>
            )}
            {personalInfo.email && (
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.email}
              </span>
            )}
            {personalInfo.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {personalInfo.location}
              </span>
            )}
            {personalInfo.experienceYears && <span>• {personalInfo.experienceYears}</span>}
            {personalInfo.educationLevel && <span>• {personalInfo.educationLevel}</span>}
            {personalInfo.website && (
              <span className="flex items-center gap-1">
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
              className={`w-20 h-24 object-cover border-2 shadow-sm ${avatarShapeClass}`}
              style={{ borderColor: theme.primaryColor }}
            />
          </div>
        )}
      </header>

      {/* Sections based on sectionsOrder */}
      <div className={styles.sectionGapClass}>
        {sectionsOrder.filter((s) => s.enabled).map((s) => renderSection(s.key))}
      </div>
    </div>
  );
};
