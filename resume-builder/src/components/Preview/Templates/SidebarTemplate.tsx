import React from 'react';
import { ResumeData } from '../../../types';
import { getThemeClasses } from '../templateHelpers';
import { Phone, Mail, MapPin, Globe, Award, Briefcase, GraduationCap, Code, FolderGit2, User } from 'lucide-react';

export const SidebarTemplate: React.FC<{ data: ResumeData }> = ({ data }) => {
  const { personalInfo, summary, workExperience, projectExperience, education, skills, awards, customSections, sectionsOrder, theme } = data;
  const styles = getThemeClasses(theme);

  const avatarShapeClass =
    personalInfo.avatarShape === 'circle'
      ? 'rounded-full'
      : personalInfo.avatarShape === 'rounded'
      ? 'rounded-2xl'
      : 'rounded-none';

  return (
    <div className={`resume-sheet bg-white text-slate-800 ${styles.fontClass} ${styles.fontSizeClass} flex flex-col md:flex-row min-h-[297mm] shadow-sm`}>
      {/* Left Sidebar (approx 32%) */}
      <aside className="w-full md:w-[32%] bg-slate-50 border-r border-slate-200 p-6 md:p-7 flex flex-col space-y-6 shrink-0">
        {/* Profile Card */}
        <div className="flex flex-col items-center text-center space-y-3">
          {personalInfo.showAvatar && personalInfo.avatarUrl && (
            <img
              src={personalInfo.avatarUrl}
              alt={personalInfo.name}
              className={`w-24 h-28 object-cover shadow-md border-2 ${avatarShapeClass}`}
              style={{ borderColor: theme.primaryColor }}
            />
          )}
          <div>
            <h1 className={`font-bold text-slate-900 ${styles.titleSizeClass}`}>
              {personalInfo.name || '姓名'}
            </h1>
            {personalInfo.targetJob && (
              <p className="text-xs font-semibold mt-1" style={{ color: theme.primaryColor }}>
                {personalInfo.targetJob}
              </p>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-2.5 text-xs text-slate-600 border-t border-b border-slate-200 py-3.5">
          {personalInfo.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{personalInfo.phone}</span>
            </div>
          )}
          {personalInfo.email && (
            <div className="flex items-center gap-2 break-all">
              <Mail className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{personalInfo.email}</span>
            </div>
          )}
          {personalInfo.location && (
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <span>{personalInfo.location}</span>
            </div>
          )}
          {personalInfo.experienceYears && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 text-center text-slate-400">💼</span>
              <span>{personalInfo.experienceYears}</span>
            </div>
          )}
          {personalInfo.educationLevel && (
            <div className="flex items-center gap-2">
              <span className="w-3.5 text-center text-slate-400">🎓</span>
              <span>{personalInfo.educationLevel}</span>
            </div>
          )}
          {personalInfo.website && (
            <div className="flex items-center gap-2 break-all">
              <Globe className="w-3.5 h-3.5 shrink-0 text-slate-400" />
              <a href={personalInfo.website} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                {personalInfo.website.replace(/^https?:\/\//, '')}
              </a>
            </div>
          )}
        </div>

        {/* Sidebar Sections: Education, Skills, Awards */}
        {education && education.length > 0 && (
          <div className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200"
              style={{ color: theme.primaryColor }}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>教育背景</span>
            </h3>
            <div className="space-y-2.5">
              {education.map((edu) => (
                <div key={edu.id} className="text-xs">
                  <div className="font-bold text-slate-800">{edu.school}</div>
                  <div className="text-slate-600 text-[11px]">
                    {edu.major} · {edu.degree}
                  </div>
                  <div className="text-slate-400 text-[11px]">
                    {edu.startDate} - {edu.endDate}
                  </div>
                  {edu.gpa && <div className="text-slate-500 text-[10px] mt-0.5">GPA: {edu.gpa}</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {skills && skills.length > 0 && (
          <div className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200"
              style={{ color: theme.primaryColor }}
            >
              <Code className="w-3.5 h-3.5" />
              <span>专业技能</span>
            </h3>
            <div className="space-y-2 text-xs">
              {skills.map((s) => (
                <div key={s.id}>
                  <div className="font-semibold text-slate-800 text-[11px] mb-0.5">{s.name}</div>
                  <div className="text-slate-600 leading-relaxed text-[11px]">{s.skills}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {awards && awards.length > 0 && (
          <div className="space-y-2">
            <h3
              className="text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200"
              style={{ color: theme.primaryColor }}
            >
              <Award className="w-3.5 h-3.5" />
              <span>证书与荣誉</span>
            </h3>
            <div className="space-y-1 text-xs">
              {awards.map((a) => (
                <div key={a.id} className="text-[11px]">
                  <div className="font-medium text-slate-800">• {a.name}</div>
                  <div className="text-slate-400 text-[10px] pl-2">{a.date}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </aside>

      {/* Right Main Column (approx 68%) */}
      <main className="flex-1 p-6 md:p-8 space-y-5">
        {/* Summary */}
        {summary && (
          <section className="resume-section">
            <h2
              className={`font-bold flex items-center gap-1.5 border-b pb-1 mb-2 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <User className="w-4 h-4" />
              <span>个人概况</span>
            </h2>
            <p className="text-slate-700 leading-relaxed text-xs sm:text-sm whitespace-pre-wrap">{summary}</p>
          </section>
        )}

        {/* Work Experience */}
        {workExperience && workExperience.length > 0 && (
          <section className="resume-section">
            <h2
              className={`font-bold flex items-center gap-1.5 border-b pb-1 mb-2.5 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <Briefcase className="w-4 h-4" />
              <span>工作经历</span>
            </h2>
            <div className={styles.itemGapClass}>
              {workExperience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="font-bold text-slate-900">{exp.company}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {exp.startDate} - {exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-semibold text-slate-700">
                    {exp.role} {exp.city && <span className="font-normal text-slate-400">({exp.city})</span>}
                  </div>
                  {exp.highlights && exp.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-1 text-slate-700 pt-0.5 text-xs">
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
        )}

        {/* Project Experience */}
        {projectExperience && projectExperience.length > 0 && (
          <section className="resume-section">
            <h2
              className={`font-bold flex items-center gap-1.5 border-b pb-1 mb-2.5 ${styles.sectionHeadingClass}`}
              style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
            >
              <FolderGit2 className="w-4 h-4" />
              <span>重点项目</span>
            </h2>
            <div className={styles.itemGapClass}>
              {projectExperience.map((proj) => (
                <div key={proj.id} className="space-y-1">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                    <span className="font-bold text-slate-900">{proj.name}</span>
                    <span className="text-xs text-slate-500 font-medium">
                      {proj.startDate} - {proj.endDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-700 font-medium">{proj.role}</span>
                    {proj.techStack && (
                      <span className="text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] font-mono">
                        {proj.techStack}
                      </span>
                    )}
                  </div>
                  {proj.highlights && proj.highlights.length > 0 && (
                    <ul className="list-disc list-outside ml-3.5 space-y-1 text-slate-700 pt-0.5 text-xs">
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
        )}

        {/* Custom Sections */}
        {customSections && customSections.length > 0 && (
          <div className="space-y-4">
            {customSections.map((c) => (
              <section key={c.id} className="resume-section">
                <h2
                  className={`font-bold border-b pb-1 mb-2 ${styles.sectionHeadingClass}`}
                  style={{ borderColor: theme.primaryColor, color: theme.primaryColor }}
                >
                  {c.title}
                </h2>
                <p className="text-slate-700 leading-relaxed text-xs whitespace-pre-wrap">{c.content}</p>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};
