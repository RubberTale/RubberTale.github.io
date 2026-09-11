import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import {
  Sparkles,
  RotateCcw,
  Copy,
  Download,
  Settings,
  History,
  FileText,
  CheckCircle2,
  Trash2,
  Plus,
  ArrowRight,
  TrendingUp,
  Feather,
  Smartphone,
  GraduationCap,
  Eye,
  Code2,
  GitCompare,
  Lightbulb,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

import {
  ApiConfig,
  DEFAULT_API_CONFIG,
  callRefineArticle,
  generateAiAnnotations
} from './services/llm';
import { STYLE_PRESETS, EXAMPLE_DRAFTS, StylePreset } from './data/presets';
import { SettingsModal } from './components/SettingsModal';
import { ExportHexoModal } from './components/ExportHexoModal';
import { DiffViewer } from './components/DiffViewer';

interface AnnotationItem {
  id: string;
  text: string;
  enabled: boolean;
}

interface HistoryItem {
  version: number;
  baseDraft: string;
  annotations: string[];
  revisedText: string;
  timestamp: string;
}

export default function App() {
  // Config & Modals
  const [apiConfig, setApiConfig] = useState<ApiConfig>(() => {
    const saved = localStorage.getItem('article_craft_api_config');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return DEFAULT_API_CONFIG;
  });
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Core Editor State
  const [originalDraft, setOriginalDraft] = useState('');
  const [draftVersion, setDraftVersion] = useState(1);
  const [annotations, setAnnotations] = useState<AnnotationItem[]>([]);
  const [newAnnotationInput, setNewAnnotationInput] = useState('');
  
  // Top Prompts & Style
  const [topPrompt, setTopPrompt] = useState('提升语言的专业度与逻辑深度，精简多余套话，强化论点与数据结合');
  const [selectedStyle, setSelectedStyle] = useState<StylePreset>(STYLE_PRESETS[0]);

  // Right Output State
  const [revisedText, setRevisedText] = useState('');
  const [revisedVersion, setRevisedVersion] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'raw' | 'diff'>('preview');

  // Iteration History
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Save config
  const handleSaveConfig = (cfg: ApiConfig) => {
    setApiConfig(cfg);
    localStorage.setItem('article_craft_api_config', JSON.stringify(cfg));
    showToast('API 配置已保存到浏览器本地');
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Keyboard shortcut Ctrl+Enter to run
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        if (!isGenerating && originalDraft.trim()) {
          handleRunRefine();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isGenerating, originalDraft, annotations, topPrompt, selectedStyle, apiConfig]);

  // Add Annotation
  const handleAddAnnotation = (text?: string) => {
    const content = text || newAnnotationInput.trim();
    if (!content) return;
    setAnnotations(prev => [
      ...prev,
      { id: Date.now().toString() + Math.random().toString(36).substring(2, 5), text: content, enabled: true }
    ]);
    if (!text) setNewAnnotationInput('');
  };

  const handleDeleteAnnotation = (id: string) => {
    setAnnotations(prev => prev.filter(a => a.id !== id));
  };

  const handleToggleAnnotation = (id: string) => {
    setAnnotations(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  // Load Example Draft
  const handleLoadExample = (index: number) => {
    const example = EXAMPLE_DRAFTS[index];
    if (!example) return;
    setOriginalDraft(example.content);
    setAnnotations(example.annotations.map(a => ({ ...a })));
    setTopPrompt(example.prompt);
    setDraftVersion(1);
    setRevisedText('');
    setRevisedVersion(1);
    showToast(`已载入示例：《${example.title}》`);
  };

  // AI Critique helper
  const handleAiCritique = async () => {
    if (!originalDraft.trim()) {
      showToast('请先在左侧输入或粘贴文章原文！');
      return;
    }
    setIsAnalyzing(true);
    showToast('AI 正在深度审阅原文并提炼批注建议...');
    try {
      const suggestions = await generateAiAnnotations({ config: apiConfig, draft: originalDraft });
      suggestions.forEach(s => handleAddAnnotation(s));
      showToast(`已自动注入 ${suggestions.length} 条专业审校批注！`);
    } catch (e: any) {
      showToast(`生成建议失败: ${e.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Run Refinement Stream
  const handleRunRefine = async () => {
    if (!originalDraft.trim()) {
      showToast('请先在左侧输入需要精修的文章原文！');
      return;
    }

    setIsGenerating(true);
    setRevisedText('');
    setViewMode('preview');

    const enabledAnnotations = annotations.filter(a => a.enabled).map(a => a.text);
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const finalResult = await callRefineArticle({
        config: apiConfig,
        systemPrompt: selectedStyle.systemPrompt,
        topPrompt,
        baseDraft: originalDraft,
        annotations: enabledAnnotations,
        onChunk: (chunk) => setRevisedText(chunk),
        signal: controller.signal
      });

      // Push to history
      const now = new Date();
      const timeStr = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
      const newHistoryItem: HistoryItem = {
        version: draftVersion,
        baseDraft: originalDraft,
        annotations: enabledAnnotations,
        revisedText: finalResult,
        timestamp: timeStr
      };
      setHistory(prev => [newHistoryItem, ...prev]);
      showToast('✨ 成文重塑完成！如果满意可直接导出，不满意可一键回传迭代。');
    } catch (e: any) {
      if (e.name !== 'AbortError') {
        showToast(`精修出错: ${e.message}`);
      }
    } finally {
      setIsGenerating(false);
      abortControllerRef.current = null;
    }
  };

  // CANCEL stream
  const handleCancelGenerate = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setIsGenerating(false);
      showToast('已中断本次生成');
    }
  };

  // ⭐ KEY LOOP: 回传至左侧草稿 (THE EDITORIAL LOOP)
  const handleSendBackToDraft = () => {
    if (!revisedText.trim()) {
      showToast('右侧尚无成文内容可回传！');
      return;
    }

    const nextVer = draftVersion + 1;
    // Overwrite left draft
    setOriginalDraft(revisedText);
    setDraftVersion(nextVer);
    setRevisedVersion(nextVer);

    // Clear active annotations, leaving a blank slate for round 2 comments
    setAnnotations([]);
    setNewAnnotationInput('');

    showToast(`🔄 已成功将右侧成文回传为【草稿 V${nextVer}】！旧批注已归档，请在左侧输入新一轮修改意见。`);
  };

  // Copy revised
  const handleCopyRevised = () => {
    if (!revisedText) return;
    navigator.clipboard.writeText(revisedText);
    showToast('成文内容已复制到剪贴板！');
  };

  // Download md
  const handleDownloadMd = () => {
    if (!revisedText) return;
    const blob = new Blob([revisedText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ArticleCraft_V${revisedVersion}_${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Markdown 文件已开始下载');
  };

  return (
    <div className="flex flex-col h-screen bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-medium shadow-2xl shadow-blue-500/40 border border-blue-400/30 flex items-center gap-2 animate-fade-in">
          <Sparkles className="w-4 h-4 text-blue-200" />
          <span>{toast}</span>
        </div>
      )}

      {/* ── 1. 顶部控制栏 (Top Bar) ───────────────────────── */}
      <header className="flex-shrink-0 bg-slate-900/90 border-b border-slate-800 px-4 py-2.5 backdrop-blur-md z-20">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2.5">
          {/* Brand & Mode */}
          <div className="flex items-center justify-between lg:justify-start gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
                <Feather className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold tracking-tight text-white">WorkBuddy</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">
                    写作精修版
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">双栏迭代审校流 · 原文 + 批注 $\rightarrow$ 成文回传</div>
              </div>
            </div>

            {/* Link back to blog tools */}
            <a
              href="/tools/"
              className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 transition px-2 py-1 rounded hover:bg-slate-800"
            >
              <span>工具箱</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>

          {/* Prompt & Style Controls */}
          <div className="flex-1 flex flex-col md:flex-row items-stretch md:items-center gap-2 max-w-4xl">
            {/* Style Selector */}
            <div className="relative flex-shrink-0">
              <select
                value={selectedStyle.id}
                onChange={(e) => {
                  const s = STYLE_PRESETS.find(x => x.id === e.target.value);
                  if (s) setSelectedStyle(s);
                }}
                className="w-full md:w-auto px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-700/90 text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-medium"
              >
                {STYLE_PRESETS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {/* Overall Prompt Input */}
            <div className="flex-1 relative">
              <input
                type="text"
                value={topPrompt}
                onChange={(e) => setTopPrompt(e.target.value)}
                placeholder="输入全局精修大方向，如：突出橡胶供需基本面，文字严谨犀利，去除口水话..."
                className="w-full px-3.5 py-1.5 rounded-xl bg-slate-950 border border-slate-700/90 text-xs text-slate-100 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Action & Settings Buttons */}
          <div className="flex items-center gap-2 justify-end">
            <button
              onClick={() => setSettingsOpen(true)}
              title="配置 AI 接口与模型"
              className="p-2 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-xs"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-mono">{apiConfig.model.split('/').pop()?.slice(0, 12)}</span>
            </button>

            {isGenerating ? (
              <button
                onClick={handleCancelGenerate}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-500/20 transition"
              >
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                停止生成
              </button>
            ) : (
              <button
                onClick={handleRunRefine}
                disabled={!originalDraft.trim()}
                title="快捷键: Ctrl + Enter"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition disabled:opacity-40 disabled:cursor-not-allowed group"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200 group-hover:rotate-12 transition" />
                <span>智能精修成文</span>
                <span className="text-[10px] opacity-70 font-mono hidden sm:inline">Ctrl+↵</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ── 2. 主体双栏区域 (Split Canvas) ──────────────────────── */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">

        {/* ── 左栏：基底原文与批注审校区 ──────────────────── */}
        <section className="flex-1 flex flex-col border-b md:border-b-0 md:border-r border-slate-800 bg-slate-950/70 overflow-hidden">
          {/* Left Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                草稿 V{draftVersion}
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {originalDraft.length} 字
              </span>
            </div>

            {/* Quick Loaders & Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleLoadExample(0)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                投研示例
              </button>
              <button
                onClick={() => handleLoadExample(1)}
                className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition"
              >
                随笔示例
              </button>
              {originalDraft && (
                <button
                  onClick={() => setOriginalDraft('')}
                  title="清空原文"
                  className="p-1 text-slate-400 hover:text-slate-200 rounded hover:bg-slate-800"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Left Upper: 原文输入区 */}
          <div className="flex-1 p-3 overflow-hidden flex flex-col">
            <textarea
              value={originalDraft}
              onChange={(e) => setOriginalDraft(e.target.value)}
              placeholder="在此处粘贴你的原创草稿，或从右上角载入投研/随笔示例..."
              className="w-full h-full p-3.5 rounded-xl bg-slate-900/50 border border-slate-800/80 text-slate-100 text-xs md:text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-500/70 resize-none"
            />
          </div>

          {/* Left Lower: 核心修改批注栏 (Annotations) */}
          <div className="h-[240px] border-t border-slate-800 bg-slate-900/30 p-3 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-200">📌 修改批注与审校意见</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-500/20 text-blue-300 font-mono">
                  {annotations.filter(a => a.enabled).length}/{annotations.length}
                </span>
              </div>
              <button
                onClick={handleAiCritique}
                disabled={isAnalyzing || !originalDraft.trim()}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 hover:bg-indigo-500/25 text-indigo-300 text-[11px] transition disabled:opacity-40"
              >
                <Lightbulb className="w-3 h-3 text-indigo-400" />
                <span>{isAnalyzing ? 'AI 审校中...' : 'AI 智能建言'}</span>
              </button>
            </div>

            {/* Input to add custom annotation */}
            <div className="flex items-center gap-1.5 mb-2">
              <input
                type="text"
                value={newAnnotationInput}
                onChange={e => setNewAnnotationInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddAnnotation()}
                placeholder="添加一条具体批改要求（如：第三段缺少橡胶库存数据，补充上去）..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={() => handleAddAnnotation()}
                className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition flex-shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Annotations List */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
              {annotations.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-500 text-xs">
                  暂无批注。你可以自己手动添加意见，或点击上方「AI 智能建言」自动推荐。
                </div>
              ) : (
                annotations.map((item, idx) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-2 p-2 rounded-lg border text-xs transition ${
                      item.enabled
                        ? 'bg-slate-900/80 border-slate-700/70 text-slate-200'
                        : 'bg-slate-950/40 border-slate-800 text-slate-500 line-through'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={item.enabled}
                      onChange={() => handleToggleAnnotation(item.id)}
                      className="mt-0.5 rounded border-slate-700 text-blue-600 focus:ring-0 cursor-pointer"
                    />
                    <span className="flex-1 leading-normal break-words select-text">
                      <span className="font-mono text-slate-500 mr-1.5">#{idx + 1}</span>
                      {item.text}
                    </span>
                    <button
                      onClick={() => handleDeleteAnnotation(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* ── 右栏：成文成果画布与回传回路 ─────────────────── */}
        <section className="flex-1 flex flex-col bg-slate-950/90 overflow-hidden">
          {/* Right Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800 bg-slate-900/40 text-xs">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md font-mono text-[11px] font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                成文成品 V{revisedVersion}.0
              </span>
              <span className="text-slate-400 font-mono text-[11px]">
                {revisedText.length} 字
              </span>
              {originalDraft && revisedText && (
                <span className="text-[10px] text-emerald-400/80 font-mono hidden sm:inline">
                  (比草稿 {revisedText.length >= originalDraft.length ? '+' : ''}{revisedText.length - originalDraft.length} 字)
                </span>
              )}
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-lg border border-slate-800">
              <button
                onClick={() => setViewMode('preview')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition ${
                  viewMode === 'preview' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Eye className="w-3 h-3" />
                <span>预览</span>
              </button>
              <button
                onClick={() => setViewMode('raw')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition ${
                  viewMode === 'raw' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Code2 className="w-3 h-3" />
                <span>源码</span>
              </button>
              <button
                onClick={() => setViewMode('diff')}
                className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition ${
                  viewMode === 'diff' ? 'bg-blue-600 text-white font-medium' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <GitCompare className="w-3 h-3" />
                <span>差异对比</span>
              </button>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="flex-1 p-4 overflow-y-auto">
            {isGenerating && !revisedText ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3">
                <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
                <div className="text-xs">AI 正在深度结合原文与批注重塑成文...</div>
              </div>
            ) : !revisedText ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-2 select-none">
                <FileText className="w-8 h-8 text-slate-700" />
                <div className="text-xs">右侧是成文展示区。配置好左侧草稿与批注后，点击顶部「智能精修成文」启动！</div>
              </div>
            ) : viewMode === 'preview' ? (
              <div
                className="prose prose-invert prose-slate max-w-none text-xs md:text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: marked.parse(revisedText) as string }}
              />
            ) : viewMode === 'raw' ? (
              <textarea
                value={revisedText}
                onChange={(e) => setRevisedText(e.target.value)}
                className="w-full h-full p-3 rounded-xl bg-slate-900/50 border border-slate-800 text-slate-200 text-xs md:text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-500/70 resize-none"
              />
            ) : (
              <DiffViewer oldText={originalDraft} newText={revisedText} />
            )}
          </div>

          {/* ── 3. 关键闭环动作栏 (The Feedback Loop Bar) ─────── */}
          <div className="border-t border-slate-800 bg-slate-900/60 p-3 flex flex-wrap items-center justify-between gap-2.5">
            {/* ⭐ THE CORE LOOP BUTTON: 回传至左侧草稿 */}
            <button
              onClick={handleSendBackToDraft}
              disabled={!revisedText.trim() || isGenerating}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition disabled:opacity-40 disabled:cursor-not-allowed group"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-950 group-hover:-rotate-45 transition" />
              <span>不满意？成文回传至左侧 (升级草稿 V{draftVersion + 1})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>

            {/* Export & Actions */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleCopyRevised}
                disabled={!revisedText.trim()}
                title="复制全文 Markdown"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition disabled:opacity-40"
              >
                <Copy className="w-3.5 h-3.5 text-slate-400" />
                <span>复制</span>
              </button>
              <button
                onClick={handleDownloadMd}
                disabled={!revisedText.trim()}
                title="下载为 .md 文件"
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs transition disabled:opacity-40"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>下载</span>
              </button>
              <button
                onClick={() => setExportOpen(true)}
                disabled={!revisedText.trim()}
                title="生成 Hexo 博客文章并复制"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 transition disabled:opacity-40"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>导出博客草稿</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Modals */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        config={apiConfig}
        onSave={handleSaveConfig}
      />

      <ExportHexoModal
        isOpen={exportOpen}
        onClose={() => setExportOpen(false)}
        content={revisedText}
      />
    </div>
  );
}
