import React from 'react';
import { EducationItem } from '../../types';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface EducationEditorProps {
  items: EducationItem[];
  onChange: (items: EducationItem[]) => void;
}

export const EducationEditor: React.FC<EducationEditorProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: EducationItem = {
      id: 'e_' + Date.now(),
      school: '',
      major: '',
      degree: '本科',
      startDate: '',
      endDate: '',
      gpa: '',
      details: '',
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

  const updateItem = (index: number, field: keyof EducationItem, value: any) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="p-4 border border-slate-200 rounded-xl bg-white space-y-3 relative shadow-xs"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <span className="font-semibold text-xs text-slate-800 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-bold">
                {index + 1}
              </span>
              {item.school || '新教育经历'}
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

          {/* Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">院校名称</label>
              <input
                type="text"
                value={item.school}
                onChange={(e) => updateItem(index, 'school', e.target.value)}
                placeholder="例如：北京大学 / 清华大学"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">主修专业</label>
              <input
                type="text"
                value={item.major}
                onChange={(e) => updateItem(index, 'major', e.target.value)}
                placeholder="例如：计算机科学与技术 / 金融学"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">学位 / 学历</label>
              <input
                type="text"
                value={item.degree}
                onChange={(e) => updateItem(index, 'degree', e.target.value)}
                placeholder="例如：学士 / 硕士 / 博士"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">在校时间</label>
              <div className="flex items-center gap-1">
                <input
                  type="text"
                  value={item.startDate}
                  onChange={(e) => updateItem(index, 'startDate', e.target.value)}
                  placeholder="2018.09"
                  className="w-1/2 text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                />
                <span className="text-slate-400 text-xs">-</span>
                <input
                  type="text"
                  value={item.endDate}
                  onChange={(e) => updateItem(index, 'endDate', e.target.value)}
                  placeholder="2022.06"
                  className="w-1/2 text-xs px-2 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">GPA / 专业排名 (选填)</label>
              <input
                type="text"
                value={item.gpa || ''}
                onChange={(e) => updateItem(index, 'gpa', e.target.value)}
                placeholder="例如：3.8 / 4.0 (前 5%)"
                className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">主修课程 / 荣誉奖学金 (选填)</label>
            <input
              type="text"
              value={item.details || ''}
              onChange={(e) => updateItem(index, 'details', e.target.value)}
              placeholder="例如：主修高级算法、分布式系统；获国家奖学金一次、优秀毕业生"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        添加一段教育背景
      </button>
    </div>
  );
};
