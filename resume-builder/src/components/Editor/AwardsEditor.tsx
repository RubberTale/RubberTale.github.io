import React from 'react';
import { AwardItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface AwardsEditorProps {
  items: AwardItem[];
  onChange: (items: AwardItem[]) => void;
}

export const AwardsEditor: React.FC<AwardsEditorProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: AwardItem = {
      id: 'a_' + Date.now(),
      name: '',
      date: '',
      issuer: '',
    };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof AwardItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="p-3 border border-slate-200 rounded-xl bg-white flex flex-col sm:flex-row items-start sm:items-center gap-2 shadow-xs"
        >
          <div className="flex-1 w-full">
            <input
              type="text"
              value={item.name}
              onChange={(e) => updateItem(index, 'name', e.target.value)}
              placeholder="证书/奖项名称 (例如：CET-6 / 计算机二级 / 优秀毕业生)"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
          <div className="w-full sm:w-28">
            <input
              type="text"
              value={item.date}
              onChange={(e) => updateItem(index, 'date', e.target.value)}
              placeholder="时间 (2023.05)"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
          <div className="w-full sm:w-36">
            <input
              type="text"
              value={item.issuer || ''}
              onChange={(e) => updateItem(index, 'issuer', e.target.value)}
              placeholder="颁发机构 (选填)"
              className="w-full text-xs px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50"
            />
          </div>
          <button
            type="button"
            onClick={() => removeItem(index)}
            className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition-colors self-end sm:self-center"
            title="删除"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        添加荣誉 / 资格证书
      </button>
    </div>
  );
};
