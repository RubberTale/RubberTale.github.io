import React, { useState } from 'react';
import { ResumeData } from '../../types';
import { PersonalEditor } from './PersonalEditor';
import { SummaryEditor } from './SummaryEditor';
import { ExperienceEditor } from './ExperienceEditor';
import { ProjectsEditor } from './ProjectsEditor';
import { EducationEditor } from './EducationEditor';
import { SkillsEditor } from './SkillsEditor';
import { AwardsEditor } from './AwardsEditor';
import { CustomEditor } from './CustomEditor';
import { ThemeEditor } from './ThemeEditor';
import { SectionOrderEditor } from './SectionOrderEditor';
import {
  User,
  FileText,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Code,
  Award,
  PlusSquare,
  ArrowUpDown,
  Palette,
} from 'lucide-react';

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onAutoFit: () => void;
}

type TabType =
  | 'personal'
  | 'summary'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'awards'
  | 'custom'
  | 'order'
  | 'theme';

export const ResumeEditor: React.FC<ResumeEditorProps> = ({ data, onChange, onAutoFit }) => {
  const [activeTab, setActiveTab] = useState<TabType>('personal');

  const tabs: { id: TabType; label: string; icon: any; count?: number }[] = [
    { id: 'personal', label: '基本信息', icon: User },
    { id: 'summary', label: '个人简介', icon: FileText },
    { id: 'experience', label: '工作经历', icon: Briefcase, count: data.workExperience.length },
    { id: 'projects', label: '重点项目', icon: FolderGit2, count: data.projectExperience.length },
    { id: 'education', label: '教育背景', icon: GraduationCap, count: data.education.length },
    { id: 'skills', label: '专业技能', icon: Code, count: data.skills.length },
    { id: 'awards', label: '证书荣誉', icon: Award, count: data.awards.length },
    { id: 'custom', label: '自定义板块', icon: PlusSquare, count: data.customSections.length },
    { id: 'order', label: '模块排布', icon: ArrowUpDown },
    { id: 'theme', label: '模版配色', icon: Palette },
  ];

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200">
      {/* Scrollable Tab Navigation */}
      <div className="border-b border-slate-200 bg-slate-50/70 px-2 py-1.5 flex items-center gap-1 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 shrink-0 transition-all ${
                isActive
                  ? 'bg-white text-blue-600 shadow-xs border border-slate-200 font-semibold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && tab.count > 0 && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-600'
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Editor Content Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5">
        {activeTab === 'personal' && (
          <PersonalEditor
            data={data.personalInfo}
            onChange={(personalInfo) => onChange({ ...data, personalInfo })}
          />
        )}

        {activeTab === 'summary' && (
          <SummaryEditor
            value={data.summary}
            onChange={(summary) => onChange({ ...data, summary })}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceEditor
            items={data.workExperience}
            onChange={(workExperience) => onChange({ ...data, workExperience })}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsEditor
            items={data.projectExperience}
            onChange={(projectExperience) => onChange({ ...data, projectExperience })}
          />
        )}

        {activeTab === 'education' && (
          <EducationEditor
            items={data.education}
            onChange={(education) => onChange({ ...data, education })}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsEditor
            items={data.skills}
            onChange={(skills) => onChange({ ...data, skills })}
          />
        )}

        {activeTab === 'awards' && (
          <AwardsEditor
            items={data.awards}
            onChange={(awards) => onChange({ ...data, awards })}
          />
        )}

        {activeTab === 'custom' && (
          <CustomEditor
            items={data.customSections}
            onChange={(customSections) => onChange({ ...data, customSections })}
          />
        )}

        {activeTab === 'order' && (
          <SectionOrderEditor
            sections={data.sectionsOrder}
            onChange={(sectionsOrder) => onChange({ ...data, sectionsOrder })}
          />
        )}

        {activeTab === 'theme' && (
          <ThemeEditor
            theme={data.theme}
            onChange={(theme) => onChange({ ...data, theme })}
            onAutoFit={onAutoFit}
          />
        )}
      </div>
    </div>
  );
};
