import React from 'react';
import { Sparkles, HelpCircle } from 'lucide-react';

interface SummaryEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export const SummaryEditor: React.FC<SummaryEditorProps> = ({ value, onChange }) => {
  const ACTION_WORDS = [
    '主导',
    '推进',
    '重构',
    '搭建',
    '攻坚',
    '降低成本',
    '提升效率',
    '实现增长',
    '0到1孵化',
  ];

  const insertWord = (word: string) => {
    onChange((value ? value + ' ' : '') + word);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold text-slate-700">个人简介 / 核心优势陈述</label>
        <span className="text-[11px] text-slate-400 font-mono">{value.length} 字</span>
      </div>

      <textarea
        rows={5}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="简明扼要概括您的核心竞争力、工作年限、擅长领域、技术栈或标杆项目业绩。建议控制在 100-200 字以内，突出成果量化数据..."
        className="w-full text-xs p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-white leading-relaxed resize-y"
      />

      {/* Writing Tips & Action Verbs */}
      <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 text-xs space-y-2">
        <div className="flex items-center gap-1.5 font-semibold text-blue-900">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>高分简历技巧 (STAR 法则)</span>
        </div>
        <p className="text-blue-800/80 leading-relaxed text-[11px]">
          建议遵循 “情境(S) + 任务(T) + 行动(A) + 结果(R)” 逻辑。多使用动词引导句式，并提供具体的量化数字（如百分比、资金规模、耗时对比）。
        </p>
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-blue-900/70 text-[11px]">快速插入动词：</span>
          {ACTION_WORDS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => insertWord(w)}
              className="px-2 py-0.5 bg-white border border-blue-200 text-blue-700 hover:bg-blue-100/50 rounded text-[11px] font-medium transition-colors"
            >
              +{w}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
