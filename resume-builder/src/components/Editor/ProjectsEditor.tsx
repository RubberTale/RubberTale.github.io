import React from 'react';
import { ProjectExperienceItem } from '../../types';
import { Plus, Trash2, ChevronUp, ChevronDown, PlusCircle } from 'lucide-react';

interface ProjectsEditorProps {
  items: ProjectExperienceItem[];
  onChange: (items: ProjectExperienceItem[]) => void;
}

export const ProjectsEditor: React.FC<ProjectsEditorProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: ProjectExperienceItem = {
      id: 'p_' + Date.now(),
      name: '',
      role: '核心开发 / 项目负责人',
      startDate: '',
      endDate: '',
      techStack: '',
      highlights: ['实现...模块，解决...难点，带来...效益'],
    };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange(newItems);
  };

  const updateItem = (index: number, field: keyof ProjectExperienceItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const updateHighlight = (itemIndex: number, hlIndex: number, value: string) => {
    const newItems = [...items];
    const newHighlights = [...newItems[itemIndex].highlights];
    newHighlights[hlIndex] = value;
    newItems[itemIndex].highlights = newHighlights;
    onChange(newItems);
  };

  const addHighlight = (itemIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].highlights = [...newItems[itemIndex].highlights, ''];
    onChange(newItems);
  };

  const removeHighlight = (itemIndex: number, hlIndex: number) => {
    const newItems = [...items];
    newItems[itemIndex].highlights = newItems[itemIndex].highlights.filter((_, i) => i !== hlIndex);
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="p-4 border border-slate-200 rounded-xl bg-white space-y-3 relative group shadow-xs"
        >
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] font-bold">
                {index + 1}
              </span>
              {item.name || '新项目'}
            </span>

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveItem(index, 'up')}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="上移"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 'down')}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="下移"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="删除此项"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">项目名称</label>
              <input
                type="text"
                value={item.name}
                onChange={(e) => updateItem(index, 'name', e.target.value)}
                placeholder="例如：橡胶产业链量化套利系统"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">担任角色</label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => updateItem(index, 'role', e.target.value)}
                placeholder="例如：项目负责人 / 算法架构师"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Dates and Tech Stack */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">起止时间</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(e) => updateItem(index, 'startDate', e.target.value)}
                  placeholder="2023.01"
                  className="w-1/2 text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="text"
                  value={item.endDate}
                  onChange={(e) => updateItem(index, 'endDate', e.target.value)}
                  placeholder="2023.10"
                  className="w-1/2 text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-600 mb-1">主要技术栈 / 工具库</label>
              <input
                type="text"
                value={item.techStack || ''}
                onChange={(e) => updateItem(index, 'techStack', e.target.value)}
                placeholder="例如：Python / Pandas / FastApi / ClickHouse"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 font-mono"
              />
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">项目成果与亮点描述</label>
              <button
                type="button"
                onClick={() => addHighlight(index)}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                添加成果要点
              </button>
            </div>

            {item.highlights.map((hl, hlIdx) => (
              <div key={hlIdx} className="flex items-center gap-2">
                <span className="text-slate-400 text-xs select-none">•</span>
                <input
                  type="text"
                  value={hl}
                  onChange={(e) => updateHighlight(index, hlIdx, e.target.value)}
                  placeholder="项目中的关键行动、技术难题攻坚及具体量化指标..."
                  className="flex-1 text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                />
                <button
                  type="button"
                  disabled={item.highlights.length <= 1}
                  onClick={() => removeHighlight(index, hlIdx)}
                  className="p-1 text-slate-300 hover:text-red-500 disabled:opacity-20 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        添加一个重点项目
      </button>
    </div>
  );
};
