import React, { useState, useRef, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  RefreshCw,
  Copy,
  Download,
  Check,
  Tag,
  Trash2,
  Edit3,
  BookmarkPlus,
  Send,
  Square,
  Eye,
  GitCompare,
  Code2,
  Share2,
  ChevronDown,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';
import { marked } from 'marked';
import {
  PinpointAnnotation,
  streamOfficialDocument,
  fetchSuggestedAnnotations
} from './services/llm';
import {
  DOCUMENT_TYPE_PRESETS,
  EXAMPLE_DRAFTS,
  ExampleDraft
} from './data/presets';
import { DiffViewer } from './components/DiffViewer';
import { ExportHexoModal } from './components/ExportHexoModal';
import { PinpointModal } from './components/PinpointModal';
import { AnnotatedDraftView } from './components/AnnotatedDraftView';

export const App: React.FC = () => {
  // Global Prompt
  const [globalPrompt, setGlobalPrompt] = useState<string>(
    '这是一份市级直属机关发给下属各区县局的正式公文。要求主旨明确、措辞严谨、条理清晰，严格遵循国家党政公文格式标准（一、 (一) 1. (1)），坚决落实精准批注，彻底消除初稿中的口语化表达。'
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>('notice');

  // Draft and Round
  const [draft, setDraft] = useState<string>(EXAMPLE_DRAFTS[0].content);
  const [round, setRound] = useState<number>(1);
  const [draftMode, setDraftMode] = useState<'interactive' | 'raw'>('interactive');

  // Pinpoint Annotations
  const [annotations, setAnnotations] = useState<PinpointAnnotation[]>(
    EXAMPLE_DRAFTS[0].initialAnnotations
  );

  // Modal states
  const [pinpointModalOpen, setPinpointModalOpen] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState<{
    id?: string;
    quote: string;
    comment: string;
    tag: string;
  } | null>(null);

  // Result and Stream
  const [revisedText, setRevisedText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [isSuggesting, setIsSuggesting] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'preview' | 'diff' | 'raw'>('preview');

  // Export Modal
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Abort controller
  const abortControllerRef = useRef<AbortController | null>(null);
  const leftTextareaRef = useRef<HTMLTextAreaElement>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle preset prompt click
  const handlePresetSelect = (preset: typeof DOCUMENT_TYPE_PRESETS[0]) => {
    setSelectedPresetId(preset.id);
    setGlobalPrompt(preset.prompt);
    showToast(`已应用「${preset.name}」顶层公文提示词`);
  };

  // Handle load sample draft
  const handleLoadSample = (sample: ExampleDraft) => {
    setDraft(sample.content);
    setGlobalPrompt(sample.globalPrompt);
    setAnnotations(sample.initialAnnotations);
    setRound(1);
    setRevisedText('');
    showToast(`已载入示例初稿：《${sample.title}》`);
  };

  // Trigger pinpoint modal from text selection
  const handleAddAnnotationForQuote = (quote: string) => {
    setEditingAnnotation({
      quote,
      comment: '',
      tag: '措辞规范'
    });
    setPinpointModalOpen(true);
  };

  // Save annotation
  const handleSaveAnnotation = (
    data: Omit<PinpointAnnotation, 'id'>,
    editId?: string
  ) => {
    if (editId) {
      setAnnotations((prev) =>
        prev.map((a) => (a.id === editId ? { ...a, ...data } : a))
      );
      showToast('批注已更新');
    } else {
      const newAnn: PinpointAnnotation = {
        id: `ann-${Date.now()}`,
        ...data
      };
      setAnnotations((prev) => [newAnn, ...prev]);
      showToast('精确批注已添加');
    }
  };

  // Delete annotation
  const handleDeleteAnnotation = (id: string) => {
    setAnnotations((prev) => prev.filter((a) => a.id !== id));
    showToast('批注已删除');
  };

  // Toggle annotation
  const handleToggleAnnotation = (id: string) => {
    setAnnotations((prev) =>
      prev.map((a) => (a.id === id ? { ...a, enabled: !a.enabled } : a))
    );
  };

  // AI Suggest Annotations
  const handleAISuggestAnnotations = async () => {
    if (!draft.trim()) {
      showToast('请先输入或粘贴公文草稿');
      return;
    }

    setIsSuggesting(true);
    showToast('🤖 AI 公文专家正在通读草稿并标出瑕疵...');

    try {
      const suggestions = await fetchSuggestedAnnotations(globalPrompt, draft);
      if (suggestions && suggestions.length > 0) {
        const newItems: PinpointAnnotation[] = suggestions.map((s, idx) => ({
          id: `ai-sug-${Date.now()}-${idx}`,
          quote: s.quote,
          comment: s.comment,
          tag: s.tag || '公文规范',
          enabled: true
        }));
        setAnnotations((prev) => [...newItems, ...prev]);
        showToast(`✨ 成功生成 ${suggestions.length} 处公文精确审校批注！`);
      } else {
        showToast('草稿整体规范度较高，未发现显著需修改处');
      }
    } catch (err: any) {
      showToast('生成建议失败: ' + err.message);
    } finally {
      setIsSuggesting(false);
    }
  };

  // Run Generation
  const handleGenerate = async () => {
    if (!draft.trim()) {
      showToast('草稿内容不能为空');
      return;
    }

    if (isGenerating) {
      // Stop
      abortControllerRef.current?.abort();
      setIsGenerating(false);
      showToast('已停止生成');
      return;
    }

    setIsGenerating(true);
    setRevisedText('');
    setViewMode('preview');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    await streamOfficialDocument(
      {
        globalPrompt,
        draft,
        annotations,
        round,
        onChunk: (chunk) => {
          setRevisedText((prev) => prev + chunk);
        },
        onDone: () => {
          setIsGenerating(false);
          showToast(`🎉 第 ${round} 轮公文精修完成！`);
        },
        onError: (err) => {
          setIsGenerating(false);
          showToast('精修生成失败: ' + err.message);
        }
      },
      controller.signal
    );
  };

  // Loop back: transfer right to left for next round
  const handleTransferBackToDraft = () => {
    if (!revisedText.trim()) return;

    const nextRound = round + 1;
    setDraft(revisedText);
    setRound(nextRound);
    setRevisedText('');
    setAnnotations([]); // clear annotations for new round
    setDraftMode('interactive');
    showToast(`🔄 已成功升级为第 ${nextRound} 版草稿！您可继续在左侧添加精确批注`);
  };

  // Copy revised text
  const handleCopyResult = () => {
    if (!revisedText) return;
    navigator.clipboard.writeText(revisedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('公文全文已复制到剪贴板');
  };

  // Download md
  const handleDownloadMd = () => {
    if (!revisedText) return;
    const blob = new Blob([revisedText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `公文精修稿_V${round}.md`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('已下载 Markdown 文档');
  };

  const activeAnnotationCount = annotations.filter((a) => a.enabled).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-4 py-2 rounded-xl bg-blue-600/90 text-white text-xs md:text-sm font-medium shadow-2xl backdrop-blur-md border border-blue-400/40 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-200" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* 1. Header Bar */}
      <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40 px-4 sm:px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <a
            href="/tools/"
            className="flex items-center gap-1 text-slate-400 hover:text-blue-400 text-xs font-medium transition"
          >
            ← 小工具箱
          </a>
          <span className="text-slate-700">/</span>
          <div className="flex items-center gap-2">
            <span className="text-lg">🏛️</span>
            <span className="font-bold text-sm sm:text-base text-white tracking-tight">
              WriteBuddy · 公文智匠
            </span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              精确顶点审校 · 多轮闭环迭代
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="https://rubbertale.github.io"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-slate-400 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
          >
            博客首页
          </a>
        </div>
      </header>

      {/* 2. Top Prompt Section (极其显眼的顶部提示词区) */}
      <section className="border-b border-slate-800/80 bg-slate-900/40 px-4 sm:px-6 py-4">
        <div className="max-w-7xl mx-auto space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="p-1 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs sm:text-sm font-semibold text-white flex items-center gap-2">
                  <span>📝 顶部公文总提示词 / 发文总指令 (Prompt)</span>
                  <span className="text-[10px] text-blue-400 font-normal">
                    (统领全篇行文格局与政策导向)
                  </span>
                </h2>
              </div>
            </div>

            {/* Quick Document Type Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
              <span className="text-[11px] text-slate-500 whitespace-nowrap">
                文种模板：
              </span>
              {DOCUMENT_TYPE_PRESETS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handlePresetSelect(p)}
                  className={`px-2 py-0.5 rounded-lg text-xs transition whitespace-nowrap ${
                    selectedPresetId === p.id
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'bg-slate-800/70 text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                  title={p.description}
                >
                  {p.name}
                </button>
              ))}
            </div>
          </div>

          {/* Prompt Input & Execute Button */}
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 relative">
              <textarea
                value={globalPrompt}
                onChange={(e) => setGlobalPrompt(e.target.value)}
                rows={2}
                placeholder="在此输入顶层公文提示词（如：发文文种、核心主旨、发文机关层级、重点解决的堵点问题、行文口吻等）..."
                className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs md:text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-blue-500/70 transition leading-relaxed resize-none font-sans"
              />
            </div>

            {/* Primary Action Button */}
            <button
              onClick={handleGenerate}
              className={`px-6 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-xl whitespace-nowrap ${
                isGenerating
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-900/40 hover:scale-[1.01]'
              }`}
            >
              {isGenerating ? (
                <>
                  <Square className="w-4 h-4 fill-current animate-spin" />
                  <span>停止生成</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>🚀 按照总提示词与精确批注一键精修成文</span>
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* 3. Main Workspace: Dual Columns (左草稿+精确顶点修改，右成文成品) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* ================= LEFT COLUMN: 原文草稿与精确批注 ================= */}
        <div className="flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[640px] flex-1">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-xs font-semibold">
                草稿第 {round} 版
              </span>
              <span className="text-xs text-slate-400">
                {draft.length} 字 · {activeAnnotationCount} 处精确顶点批注
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Load Sample Draft */}
              <button
                onClick={() => handleLoadSample(EXAMPLE_DRAFTS[0])}
                className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                title="载入公文范例初稿"
              >
                范例初稿
              </button>

              {/* Mode Toggle */}
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={() => setDraftMode('interactive')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                    draftMode === 'interactive'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="高亮显示已设批注，用鼠标划选文字即可直接添加精确修改意见"
                >
                  🎯 顶点标注
                </button>
                <button
                  onClick={() => setDraftMode('raw')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition ${
                    draftMode === 'raw'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="纯文本编辑模式，可直接粘贴大段文本"
                >
                  ✏️ 编辑源码
                </button>
              </div>
            </div>
          </div>

          {/* Draft Display Area */}
          <div className="h-[360px] bg-slate-950/40 relative border-b border-slate-800">
            {draftMode === 'interactive' ? (
              <AnnotatedDraftView
                draft={draft}
                annotations={annotations}
                onAddAnnotationForQuote={handleAddAnnotationForQuote}
                onAnnotationClick={(ann) => {
                  setEditingAnnotation(ann);
                  setPinpointModalOpen(true);
                }}
              />
            ) : (
              <textarea
                ref={leftTextareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="在此粘贴或输入公文初稿... 选中文中任意文字可点击下方按钮添加精确批注"
                className="w-full h-full p-4 bg-transparent text-slate-200 text-xs md:text-sm font-mono leading-relaxed focus:outline-none resize-none"
              />
            )}
          </div>

          {/* Pinpoint Annotations Tray (核心特色区) */}
          <div className="p-4 flex-1 flex flex-col bg-slate-900/30">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <BookmarkPlus className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs sm:text-sm font-semibold text-white">
                  📌 文中精确顶点修改清单
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-300 font-medium">
                  {annotations.length} 项
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* AI Suggest Button */}
                <button
                  onClick={handleAISuggestAnnotations}
                  disabled={isSuggesting}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-[11px] font-medium transition disabled:opacity-50"
                  title="大模型自动通读草稿，在文中找出不规范之处并标出精准修改意见"
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>{isSuggesting ? '审校中...' : '💡 AI 智能审校建言'}</span>
                </button>

                {/* Manual Add Button */}
                <button
                  onClick={() => {
                    setEditingAnnotation(null);
                    setPinpointModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
                >
                  + 手工添加
                </button>
              </div>
            </div>

            {/* Hint Box */}
            <div className="mb-3 px-3 py-2 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-300/80 leading-relaxed flex items-center gap-2">
              <span className="text-amber-400 text-sm">💡</span>
              <span>
                <strong>精确顶点修改特色</strong>：用鼠标在上方草稿中<strong>划选任意文字</strong>，会立即弹出添加批注按钮；AI 将对标靶语句实现“精准指哪改哪、无缝融入正文”。
              </span>
            </div>

            {/* Annotations List */}
            <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
              {annotations.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-500 border border-dashed border-slate-800 rounded-xl">
                  暂无精确批注。请在草稿中划选文字添加，或点击右上角「💡 AI 智能审校建言」自动排查。
                </div>
              ) : (
                annotations.map((ann, idx) => (
                  <div
                    key={ann.id}
                    className={`p-3 rounded-xl border transition flex flex-col gap-1.5 ${
                      ann.enabled
                        ? 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                        : 'bg-slate-950/30 border-slate-900 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 overflow-hidden">
                        <input
                          type="checkbox"
                          checked={ann.enabled}
                          onChange={() => handleToggleAnnotation(ann.id)}
                          className="w-3.5 h-3.5 rounded text-blue-600 bg-slate-900 border-slate-700 focus:ring-0 cursor-pointer"
                        />
                        <span className="text-[11px] font-mono font-bold text-amber-300">
                          #{idx + 1}
                        </span>
                        {ann.tag && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                            {ann.tag}
                          </span>
                        )}
                        {ann.quote && (
                          <span
                            className="text-[11px] text-slate-400 truncate max-w-[180px] sm:max-w-[240px]"
                            title={ann.quote}
                          >
                            原句：<code className="text-amber-200/90 font-mono">「{ann.quote}」</code>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => {
                            setEditingAnnotation(ann);
                            setPinpointModalOpen(true);
                          }}
                          className="p-1 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded transition"
                          title="编辑批注"
                        >
                          <Edit3 className="w-3 h-3" />
                        </button>
                        <button
                          onClick={() => handleDeleteAnnotation(ann.id)}
                          className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition"
                          title="删除批注"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-slate-200 pl-5 leading-relaxed font-sans">
                      {ann.comment}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: 成文成品与对比 ================= */}
        <div className="flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[640px] flex-1">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-xs font-semibold">
                成文成品第 {round} 版
              </span>
              {revisedText && (
                <span className="text-xs text-slate-400">
                  {revisedText.length} 字
                </span>
              )}
            </div>

            {/* Views & Export */}
            <div className="flex items-center gap-2">
              {/* View Switcher */}
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={() => setViewMode('preview')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                    viewMode === 'preview'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Eye className="w-3 h-3" />
                  公文排版
                </button>
                <button
                  onClick={() => setViewMode('diff')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                    viewMode === 'diff'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <GitCompare className="w-3 h-3" />
                  差异对比
                </button>
                <button
                  onClick={() => setViewMode('raw')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                    viewMode === 'raw'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-3 h-3" />
                  Markdown
                </button>
              </div>

              {/* Actions */}
              {revisedText && (
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopyResult}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="复制公文全文"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <button
                    onClick={handleDownloadMd}
                    className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    title="下载 Markdown 文件"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setExportModalOpen(true)}
                    className="p-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition"
                    title="导出为 Hexo 博客文章"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Feedback Loop Banner (成文不满意回传升级) */}
          {revisedText && !isGenerating && (
            <div className="px-4 py-3 bg-gradient-to-r from-blue-950/60 via-indigo-950/40 to-slate-900 border-b border-blue-900/40 flex items-center justify-between gap-3">
              <div className="text-xs text-blue-200 flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-blue-400 shrink-0" />
                <span>成文还需调整？一键将右侧成文回传为左侧新草稿继续精确批修</span>
              </div>
              <button
                onClick={handleTransferBackToDraft}
                className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-900/30 transition flex items-center gap-1.5 shrink-0 hover:scale-[1.02]"
              >
                <span>🔄 回传至左侧 (升级草稿 V{round + 1})</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Content Area */}
          <div className="flex-1 p-5 overflow-y-auto max-h-[580px]">
            {isGenerating && !revisedText ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-3 py-20 select-none">
                <Sparkles className="w-8 h-8 text-blue-400 animate-pulse" />
                <div className="text-sm font-medium">大秘正在对照国家公文规范与顶点批注精心润色...</div>
                <div className="text-xs text-slate-500">
                  严密落实每一处精确批注，重塑规范公文架构
                </div>
              </div>
            ) : !revisedText ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-24 select-none">
                <FileText className="w-10 h-10 text-slate-700" />
                <div className="text-xs text-slate-400">
                  右侧是规范公文成文展示区。
                </div>
                <div className="text-[11px] text-slate-600 max-w-sm text-center">
                  在左侧草稿中划选文字添加精确批注后，点击顶部「🚀 按照总提示词与精确批注一键精修成文」启动！
                </div>
              </div>
            ) : viewMode === 'preview' ? (
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 shadow-inner">
                {/* Official Red Line Accent */}
                <div className="w-full h-1 bg-rose-600/80 mb-6 rounded-full" />
                <div
                  className="prose prose-invert prose-slate max-w-none text-xs md:text-sm leading-relaxed font-sans"
                  dangerouslySetInnerHTML={{ __html: marked.parse(revisedText) as string }}
                />
              </div>
            ) : viewMode === 'raw' ? (
              <textarea
                value={revisedText}
                onChange={(e) => setRevisedText(e.target.value)}
                className="w-full h-full p-4 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs md:text-sm font-mono leading-relaxed focus:outline-none focus:border-blue-500 resize-none"
              />
            ) : (
              <DiffViewer oldText={draft} newText={revisedText} />
            )}
          </div>
        </div>
      </main>

      {/* Pinpoint Modal */}
      <PinpointModal
        isOpen={pinpointModalOpen}
        onClose={() => {
          setPinpointModalOpen(false);
          setEditingAnnotation(null);
        }}
        onSave={handleSaveAnnotation}
        initialData={editingAnnotation}
      />

      {/* Export Hexo Modal */}
      <ExportHexoModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        content={revisedText}
      />
    </div>
  );
};

export default App;
