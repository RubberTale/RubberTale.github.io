import React from 'react';
import { SectionMeta } from '../../types';
import { ChevronUp, ChevronDown, Eye, EyeOff, GripVertical } from 'lucide-react';

interface SectionOrderEditorProps {
  sections: SectionMeta[];
  onChange: (sections: SectionMeta[]) => void;
}

export const SectionOrderEditor: React.FC<SectionOrderEditorProps> = ({ sections, onChange }) => {
  const toggleEnabled = (index: number) => {
    const updated = [...sections];
    updated[index] = { ...updated[index], enabled: !updated[index].enabled };
    onChange(updated);
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= sections.length) return;
    const updated = [...sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onChange(updated);
  };

  return (
    <div className="space-y-2">
      <div className="text-xs text-slate-500 mb-2">
        可调整各模块在简历中的上下排布顺序，或点击眼睛图标隐藏特定模块：
      </div>
      <div className="space-y-1.5">
        {sections.map((sec, index) => (
          <div
            key={sec.key}
            className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
              sec.enabled ? 'bg-white border-slate-200' : 'bg-slate-50 border-slate-100 opacity-60'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <GripVertical className="w-4 h-4 text-slate-400" />
              <button
                type="button"
                onClick={() => toggleEnabled(index)}
                className={`p-1 rounded transition-colors ${
                  sec.enabled ? 'text-blue-600 hover:bg-blue-50' : 'text-slate-400 hover:bg-slate-200'
                }`}
                title={sec.enabled ? '点击隐藏该模块' : '点击显示该模块'}
              >
                {sec.enabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <span className={`text-xs font-medium ${sec.enabled ? 'text-slate-800' : 'text-slate-500 line-through'}`}>
                {sec.label}
              </span>
            </div>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveSection(index, 'up')}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="上移模块"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={index === sections.length - 1}
                onClick={() => moveSection(index, 'down')}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="下移模块"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
