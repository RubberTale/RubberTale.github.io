import React, { useState, useEffect } from 'react';
import { X, Tag, Sparkles, Check, BookmarkPlus } from 'lucide-react';
import { PinpointAnnotation } from '../services/llm';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (annotation: Omit<PinpointAnnotation, 'id'>, editId?: string) => void;
  initialData?: {
    id?: string;
    quote: string;
    comment: string;
    tag: string;
  } | null;
}

const QUICK_TAGS = [
  { name: '措辞规范', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30' },
  { name: '细节刻画', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  { name: '对白润色', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30' },
  { name: '动作/神态', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  { name: '明确职责', color: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
  { name: '情节推进', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  { name: '逻辑精简', color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  { name: '强化红线', color: 'bg-rose-500/20 text-rose-300 border-rose-500/30' }
];

export const PinpointModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  initialData
}) => {
  const [quote, setQuote] = useState('');
  const [comment, setComment] = useState('');
  const [tag, setTag] = useState('措辞规范');

  useEffect(() => {
    if (initialData) {
      setQuote(initialData.quote || '');
      setComment(initialData.comment || '');
      setTag(initialData.tag || '措辞规范');
    } else {
      setQuote('');
      setComment('');
      setTag('措辞规范');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    onSave(
      {
        quote: quote.trim(),
        comment: comment.trim(),
        tag,
        enabled: true
      },
      initialData?.id
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <BookmarkPlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">
                {initialData?.id ? '编辑精确顶点批注' : '添加文中精确修改意见'}
              </h3>
              <p className="text-[11px] text-slate-400">大模型将对锚定靶向片段执行精准重塑</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {/* Target Quote Snippet */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              锚定靶向原文片段
            </label>
            <textarea
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="选中的原文片段..."
              rows={2}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-xs text-amber-200/90 font-mono focus:outline-none focus:border-amber-500/60 leading-relaxed"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              此片段用于在正文中精确定位需修改的句子或词段
            </p>
          </div>

          {/* Quick Tag Selector */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              修改类型属性
            </label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_TAGS.map((t) => (
                <button
                  key={t.name}
                  type="button"
                  onClick={() => setTag(t.name)}
                  className={`px-2.5 py-1 rounded-lg text-xs border transition flex items-center gap-1 ${
                    tag === t.name
                      ? `${t.color} font-medium ring-1 ring-white/20`
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {tag === t.name && <Check className="w-3 h-3" />}
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* Specific Modification Instruction */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
              <span>具体修改要求 / 重写建议</span>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> 核心特色功能
              </span>
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="例如：此处措辞口语化，修改为：“由市政务服务管理局牵头，于本周五17:00前完成全量清单梳理，对存在推诿扯皮的严肃通报问责”。"
              rows={4}
              required
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 leading-relaxed placeholder:text-slate-600"
            />
          </div>

          {/* Footer Buttons */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!comment.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-medium shadow-md shadow-blue-900/30 transition"
            >
              <Check className="w-3.5 h-3.5" />
              确定采纳
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
