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
  const detectedTitle = content.match(/^#\s+(.+)$/m)?.[1]?.trim() || '未命名文章';
  const cleanBody = content.replace(/^#\s+.+$/m, '').trim();

  const [title, setTitle] = useState(detectedTitle);
  const [tags, setTags] = useState('文章写作, 文本精修, 优质创作');
  const [category, setCategory] = useState('写作工作台');
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
              <h3 className="text-base font-semibold text-white">导出为 Hexo 博客文章</h3>
              <p className="text-xs text-slate-400">自动注入标准 YAML Front-matter 元数据头</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">文章标题 (title)</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">分类 (categories)</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">标签 (tags，用逗号分隔)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950/70 border border-slate-800 rounded-xl text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Front-matter 实时预览</label>
            <pre className="p-3 bg-slate-950 border border-slate-800/80 rounded-xl text-xs font-mono text-emerald-400/90 overflow-x-auto max-h-48">
              {frontmatter.slice(0, 500)}...
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/40">
          <div className="text-xs text-slate-500">
            可直接复制保存至博客 <code className="text-slate-400">source/_posts/</code> 目录下
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              {copied ? '已复制到剪贴板' : '一键复制全文'}
            </button>
            <button
              onClick={handleDownload}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium shadow-lg shadow-emerald-900/30 transition"
            >
              <Download className="w-4 h-4" />
              下载 .md 文件
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
