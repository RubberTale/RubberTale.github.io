import React, { useState, useRef } from 'react';
import { ResumeData, TemplateType } from '../types';
import {
  DEFAULT_RESUME,
  PRESET_TECH,
  PRESET_PRODUCT,
} from '../constants/sampleData';
import {
  FileText,
  Printer,
  Download,
  Upload,
  RotateCcw,
  Sparkles,
  ExternalLink,
  ChevronDown,
  LayoutTemplate,
  FileCode,
  Image as ImageIcon,
  Check,
  Wrench,
  Home,
} from 'lucide-react';
import { exportToJson, importFromJson, exportToPng } from '../utils/exportUtils';

interface NavbarProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  onOpenPrintModal: () => void;
  onOpenMarkdownModal: () => void;
  onAutoFit: () => void;
  activeTab: 'edit' | 'preview';
  setActiveTab: (tab: 'edit' | 'preview') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  data,
  onChange,
  onOpenPrintModal,
  onOpenMarkdownModal,
  onAutoFit,
  activeTab,
  setActiveTab,
}) => {
  const [sampleMenuOpen, setSampleMenuOpen] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPreset = (preset: ResumeData) => {
    if (window.confirm('加载新示例将覆盖当前的编辑内容，是否继续？')) {
      onChange(preset);
      setSampleMenuOpen(false);
    }
  };

  const handleJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const imported = await importFromJson(file);
      onChange(imported);
      alert('简历数据导入成功！');
    } catch (err: any) {
      alert('导入失败：' + (err.message || '文件损坏或格式不正确'));
    }
  };

  const handleClear = () => {
    if (window.confirm('确定要清空所有简历内容吗？')) {
      onChange({
        ...DEFAULT_RESUME,
        personalInfo: {
          name: '',
          targetJob: '',
          phone: '',
          email: '',
          location: '',
          experienceYears: '',
          educationLevel: '',
          website: '',
          avatarUrl: '',
          showAvatar: false,
          avatarShape: 'circle',
        },
        summary: '',
        workExperience: [],
        projectExperience: [],
        education: [],
        skills: [],
        awards: [],
        customSections: [],
      });
    }
  };

  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 flex items-center justify-between gap-2">
        {/* Left: Brand & Links */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
              <FileText className="w-4 h-4" />
            </div>
            <div className="hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-sm text-slate-900">智能简历工坊</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-50 text-blue-700 font-semibold border border-blue-100">
                  实用工具
                </span>
              </div>
              <p className="text-[10px] text-slate-400">橡胶童话 · 专业在线排版系统</p>
            </div>
          </div>

          {/* Quick Back to Tools & Home */}
          <div className="hidden md:flex items-center gap-1 pl-2 border-l border-slate-200 text-xs text-slate-500">
            <a
              href="/tools/"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="返回博客实用小工具箱"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>小工具箱</span>
            </a>
            <a
              href="/"
              className="flex items-center gap-1 px-2 py-1 rounded hover:bg-slate-100 hover:text-slate-800 transition-colors"
              title="返回橡胶童话博客首页"
            >
              <Home className="w-3.5 h-3.5" />
              <span>博客首页</span>
            </a>
          </div>
        </div>

        {/* Mobile View Toggle */}
        <div className="flex lg:hidden bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
          <button
            onClick={() => setActiveTab('edit')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'edit' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            编辑内容
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition-colors ${
              activeTab === 'preview' ? 'bg-white font-semibold text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            预览简历
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Sample Data Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setSampleMenuOpen(!sampleMenuOpen)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span className="hidden sm:inline">职业示例</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {sampleMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setSampleMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs animate-fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    点击加载示例模版
                  </div>
                  <button
                    onClick={() => loadPreset(DEFAULT_RESUME)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 flex items-center justify-between"
                  >
                    <span>📊 大宗商品与量化研究员</span>
                  </button>
                  <button
                    onClick={() => loadPreset(PRESET_TECH)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 flex items-center justify-between"
                  >
                    <span>💻 资深全栈/前端开发专家</span>
                  </button>
                  <button
                    onClick={() => loadPreset(PRESET_PRODUCT)}
                    className="w-full text-left px-3 py-2 hover:bg-blue-50 text-slate-800 flex items-center justify-between"
                  >
                    <span>🎯 资深产品总监 / 负责人</span>
                  </button>
                  <div className="border-t border-slate-100 my-1" />
                  <button
                    onClick={() => {
                      setSampleMenuOpen(false);
                      handleClear();
                    }}
                    className="w-full text-left px-3 py-1.5 text-red-600 hover:bg-red-50 flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>清空表单（全新制作）</span>
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Import / Export Menu */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              className="px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 rounded-lg border border-slate-200 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">导入/导出</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {exportMenuOpen && (
              <>
                <div className="fixed inset-0 z-20" onClick={() => setExportMenuOpen(false)} />
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-30 text-xs animate-fade-in">
                  <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    备份与互通
                  </div>
                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      exportToJson(data, `${data.personalInfo.name || '个人'}_简历备份.json`);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-800 flex items-center gap-2"
                  >
                    <Download className="w-3.5 h-3.5 text-blue-600" />
                    <span>导出 JSON 配置文件</span>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      fileInputRef.current?.click();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-800 flex items-center gap-2"
                  >
                    <Upload className="w-3.5 h-3.5 text-emerald-600" />
                    <span>导入 JSON 配置文件</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      onOpenMarkdownModal();
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-800 flex items-center gap-2"
                  >
                    <FileCode className="w-3.5 h-3.5 text-indigo-600" />
                    <span>查看 / 导出 Markdown</span>
                  </button>

                  <button
                    onClick={() => {
                      setExportMenuOpen(false);
                      exportToPng('resume-canvas', `${data.personalInfo.name || '个人'}_简历.png`);
                    }}
                    className="w-full text-left px-3 py-2 hover:bg-slate-50 text-slate-800 flex items-center gap-2"
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-purple-600" />
                    <span>导出高清 PNG 图片</span>
                  </button>
                </div>
              </>
            )}

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleJsonUpload}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Primary Action: Print / PDF */}
          <button
            type="button"
            onClick={onOpenPrintModal}
            className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 active:from-blue-800 active:to-indigo-800 rounded-lg shadow-sm shadow-blue-500/30 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>导出 PDF / 打印</span>
          </button>
        </div>
      </div>
    </header>
  );
};
