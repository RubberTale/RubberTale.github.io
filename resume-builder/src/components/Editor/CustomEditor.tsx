import React from 'react';
import { CustomSectionItem } from '../../types';
import { Plus, Trash2 } from 'lucide-react';

interface CustomEditorProps {
  items: CustomSectionItem[];
  onChange: (items: CustomSectionItem[]) => void;
}

export const CustomEditor: React.FC<CustomEditorProps> = ({ items, onChange }) => {
  const addItem = () => {
    const newItem: CustomSectionItem = {
      id: 'c_' + Date.now(),
      title: '自定义板块名称',
      content: '详细内容描述...',
    };
    onChange([...items, newItem]);
  };

  const removeItem = (index: number) => {
    onChange(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof CustomSectionItem, value: string) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id} className="p-3.5 border border-slate-200 rounded-xl bg-white space-y-2 shadow-xs">
          <div className="flex items-center justify-between">
            <input
              type="text"
              value={item.title}
              onChange={(e) => updateItem(index, 'title', e.target.value)}
              placeholder="板块标题（例如：学术论文 / 开源贡献 / 语言水平）"
              className="text-xs font-semibold text-slate-800 px-2.5 py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 w-64"
            />
            <button
              type="button"
              onClick={() => removeItem(index)}
              className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="删除板块"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <textarea
            rows={3}
            value={item.content}
            onChange={(e) => updateItem(index, 'content', e.target.value)}
            placeholder="支持多行文字描述..."
            className="w-full text-xs p-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-slate-50/50 resize-y leading-relaxed"
          />
        </div>
      ))}

      <button
        type="button"
        onClick={addItem}
        className="w-full py-2.5 border-2 border-dashed border-slate-300 hover:border-blue-400 hover:bg-blue-50/50 rounded-xl text-xs font-semibold text-slate-600 hover:text-blue-700 flex items-center justify-center gap-1.5 transition-colors"
      >
        <Plus className="w-4 h-4" />
        添加自定义板块（论文/语言/开源等）
      </button>
    </div>
  );
};
