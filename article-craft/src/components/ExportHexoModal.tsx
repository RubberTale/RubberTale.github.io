import React, { useState } from 'react';
import { X, Copy, Check, Download, FileText } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  content: string;
}

export const ExportHexoModal: React.FC<Props> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  // Infer a title from the first heading if available
  const detectedTitle = content.match(/^#\s+(.+)$/m)?.[1]?.trim() || '未命名深度研报';
  const cleanBody = content.replace(/^#\s+.+$/m, '').trim();

  const [title, setTitle] = useState(detectedTitle);
  const [tags, setTags] = useState('大宗商品, 投研笔记, 量化');
  const [category, setCategory] = useState('投研思考');
  const [copied, setCopied] = useState(false);

  // Format today's date
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:00`;

  const tagArray = tags.split(/[,，]/).map(t => t.trim()).filter(Boolean);
  const frontmatter = `---
title: ${title}
date: ${dateStr}
tags: [${tagArray.join(', ')}]
categories: [${category}]
aside: false
---

${cleanBody}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(frontmatter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([frontmatter], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/[\/\\?%*:|"<>]/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">导出为 Hexo 博客文章</h2>
              <p className="text-xs text-slate-400">已自动生成规范的 Front-matter 元数据头，直接粘贴至博客即可发布</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form & Preview */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">文章标题 (Title)</label>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">文章分类 (Category)</label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">文章标签 (Tags, 逗号分隔)</label>
            <input
              type="text"
              value={tags}
              onChange={e => setTags(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-100 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">带 Front-matter 的 Markdown 完整内容预览</label>
            <textarea
              readOnly
              value={frontmatter}
              rows={12}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-slate-300 focus:outline-none resize-none leading-relaxed"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-200 hover:bg-slate-800 transition"
          >
            <Download className="w-4 h-4 text-slate-400" />
            下载 .md 文件
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
              关闭
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制到剪贴板！' : '一键复制全文'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
