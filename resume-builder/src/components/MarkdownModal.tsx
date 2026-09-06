import React, { useState } from 'react';
import { FileText, X, Copy, Check, Download } from 'lucide-react';
import { ResumeData } from '../types';
import { exportToMarkdown, downloadMarkdown } from '../utils/exportUtils';

interface MarkdownModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: ResumeData;
}

export const MarkdownModal: React.FC<MarkdownModalProps> = ({ isOpen, onClose, data }) => {
  const [copied, setCopied] = useState(false);
  if (!isOpen) return null;

  const markdownText = exportToMarkdown(data);

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-slate-800 rounded-lg">
              <FileText className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Markdown 简历文本</h3>
              <p className="text-slate-400 text-xs">可直接复制到 GitHub、博客、Notion 或招聘网站</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-50">
          <pre className="text-xs font-mono text-slate-800 bg-white p-4 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed select-all">
            {markdownText}
          </pre>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => downloadMarkdown(data)}
            className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            下载 .md 文件
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
            >
              关闭
            </button>
            <button
              onClick={handleCopy}
              className="px-4 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  已复制到剪贴板
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  复制全部内容
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
