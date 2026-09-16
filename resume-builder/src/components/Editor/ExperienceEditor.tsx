import React from 'react';
import { WorkExperienceItem } from '../../types';
import { Plus, Trash2, ChevronUp, ChevronDown, PlusCircle } from 'lucide-react';

interface ExperienceEditorProps {
  items: WorkExperienceItem[];
  onChange: (items: WorkExperienceItem[]) => void;
}

export const ExperienceEditor: React.FC<ExperienceEditorProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: WorkExperienceItem = {
      id: 'w_' + Date.now(),
      company: '',
      role: '',
      city: '',
      startDate: '',
      endDate: '至今',
      current: true,
      highlights: ['主导/负责...，通过...手段，使...指标提升了 XX%'],
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

  const updateItem = (index: number, field: keyof WorkExperienceItem, value: any) => {
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
              <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-[10px] font-bold">
                {index + 1}
              </span>
              {item.company || '新工作经历'}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">公司名称</label>
              <input
                type="text"
                value={item.company}
                onChange={(e) => updateItem(index, 'company', e.target.value)}
                placeholder="例如：阿里巴巴 / 某私募基金"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">职位角色</label>
              <input
                type="text"
                value={item.role}
                onChange={(e) => updateItem(index, 'role', e.target.value)}
                placeholder="例如：量化研究员 / 高级前端"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">所在城市</label>
              <input
                type="text"
                value={item.city || ''}
                onChange={(e) => updateItem(index, 'city', e.target.value)}
                placeholder="例如：上海 / 杭州"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">入职时间</label>
              <input
                type="text"
                value={item.startDate}
                onChange={(e) => updateItem(index, 'startDate', e.target.value)}
                placeholder="例如：2021.07"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-slate-600">离职时间</label>
                <label className="flex items-center gap-1 text-[11px] text-slate-500 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={item.current}
                    onChange={(e) => {
                      updateItem(index, 'current', e.target.checked);
                      if (e.target.checked) updateItem(index, 'endDate', '至今');
                    }}
                    className="rounded text-blue-600 focus:ring-0 w-3 h-3"
                  />
                  <span>目前在职</span>
                </label>
              </div>
              <input
                type="text"
                disabled={item.current}
                value={item.endDate}
                onChange={(e) => updateItem(index, 'endDate', e.target.value)}
                placeholder="例如：2023.05 或 至今"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 disabled:bg-slate-100 disabled:text-slate-500"
              />
            </div>
          </div>

          {/* Bullet Points / Highlights */}
          <div className="space-y-2 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700">工作业绩与核心产出 (按点描述)</label>
              <button
                type="button"
                onClick={() => addHighlight(index)}
                className="text-[11px] font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                添加业绩要点
              </button>
            </div>

            {item.highlights.map((hl, hlIdx) => (
              <div key={hlIdx} className="flex items-center gap-2">
                <span className="text-slate-400 text-xs select-none">•</span>
                <input
                  type="text"
                  value={hl}
                  onChange={(e) => updateHighlight(index, hlIdx, e.target.value)}
                  placeholder="例如：通过优化...，使整体系统响应速度提升了 40%，节约服务器成本..."
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
        添加一段工作经历
      </button>
    </div>
  );
};
