import React from 'react';
import { SkillCategory } from '../../types';
import { Plus, Trash2, ChevronUp, ChevronDown } from 'lucide-react';

interface SkillsEditorProps {
  items: SkillCategory[];
  onChange: (items: SkillCategory[]) => void;
}

export const SkillsEditor: React.FC<SkillsEditorProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: SkillCategory = {
      id: 's_' + Date.now(),
      name: '技能类别',
      skills: '技能点1, 技能点2, 技能点3',
    };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof SkillCategory, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;
    const newItems = [...items];
    const [moved] = newItems.splice(index, 1);
    newItems.splice(targetIndex, 0, moved);
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="p-3 border border-slate-200 rounded-xl bg-white space-y-2 shadow-xs"
        >
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              placeholder="分类名称（如：前端开发 / 编程语言）"
              className="text-xs font-semibold text-slate-800 px-2 py-1 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 w-48"
            />

            <div className="flex items-center gap-1">
              <button
                type="button"
                disabled={index === 0}
                onClick={() => moveItem(index, 'up')}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="上移"
              >
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                disabled={index === items.length - 1}
                onClick={() => moveItem(index, 'down')}
                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded transition-colors"
                title="下移"
              >
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => removeItem(index)}
                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                title="删除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <textarea
            rows={2}
            value={item.skills}
            onChange={(e) => updateItem(index, 'skills', e.target.value)}
            placeholder="填写具体技能项，如：Python (Pandas, NumPy), C++, Git, Docker, Linux..."
            className="w-full text-xs p-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 resize-y"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        添加技能类别
      </button>
    </div>
  );
};
