import mammoth from "mammoth";
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
  Upload,
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
    EXAMPLE_DRAFTS[0]?.globalPrompt || '这是一份正式文稿。要求主旨明确、措辞严谨、条理清晰，严格遵循行文体例规范，坚决落实精准批注，彻底消除初稿中的瑕疵与口语化表达。'
  );
  const [selectedPresetId, setSelectedPresetId] = useState<string>('notice');

  // Genre helpers
  const isNovel = selectedPresetId === 'novel';
  const isClassicPoem = selectedPresetId === 'classic-poem';
  const isModernPoem = selectedPresetId === 'modern-poem';
  const isPoetry = isClassicPoem || isModernPoem;

  const getDocTypeLabel = () => {
    if (isNovel) return '小说故事';
    if (isClassicPoem) return '古典诗词';
    if (isModernPoem) return '现代诗歌';
    return '文章';
  };

  // Draft and Round
  const [draft, setDraft] = useState<string>(EXAMPLE_DRAFTS[0].content);
  const [round, setRound] = useState<number>(1);
  const [draftMode, setDraftMode] = useState<'edit' | 'preview' | 'annotated'>('edit');
  const [selectedTextareaQuote, setSelectedTextareaQuote] = useState<string | null>(null);

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
  const [preserveOriginal, setPreserveOriginal] = useState<boolean>(true);

  // Export Modal
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Abort controller
  const abortControllerRef = useRef<AbortController | null>(null);
  const leftTextareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const sampleMenuRef = useRef<HTMLDivElement>(null);
  const rightColumnRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [sampleMenuOpen, setSampleMenuOpen] = useState<boolean>(false);

  // Close sample menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (sampleMenuRef.current && !sampleMenuRef.current.contains(e.target as Node)) {
        setSampleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Handle file import (.docx, .md, .txt)
  const handleFileImport = async (file: File) => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!['docx', 'md', 'markdown', 'txt'].includes(ext || '')) {
      showToast('仅支持导入 .docx, .md, .txt 格式文档');
      return;
    }

    showToast(`📄 正在解析导入「${file.name}」...`);

    try {
      let importedText = '';

      if (ext === 'docx') {
        const arrayBuffer = await file.arrayBuffer();
        const res = await mammoth.convertToMarkdown({ arrayBuffer });
        importedText = res.value;
        if (!importedText.trim()) {
          const raw = await mammoth.extractRawText({ arrayBuffer });
          importedText = raw.value;
        }
      } else {
        importedText = await file.text();
      }

      if (!importedText.trim()) {
        showToast('导入失败：文档内容为空');
        return;
      }

      setDraft(importedText);
      setAnnotations([]);
      setRound(1);
      setRevisedText('');
      setDraftMode('edit');
      showToast(`🎉 成功导入「${file.name}」（${importedText.length} 字）！已载入并可直接编辑`);
    } catch (err: any) {
      console.error('File import error:', err);
      showToast('文档解析失败: ' + (err.message || '未知错误'));
    }
  };

  // Handle preset prompt click
  const handlePresetSelect = (preset: typeof DOCUMENT_TYPE_PRESETS[0]) => {
    setSelectedPresetId(preset.id);

    const matchingSample = EXAMPLE_DRAFTS.find((d) => d.presetId === preset.id);
    const isSampleDraft = !draft.trim() || EXAMPLE_DRAFTS.some((d) => d.content.trim() === draft.trim());

    if (!isSampleDraft && matchingSample) {
      const confirmLoad = window.confirm(
        `检测到您已有正在编辑的文稿。\n\n切换文种为「${preset.name}」时，是否同步载入该文种的【专属范文初稿与批注示范】？\n\n【确定】：载入「${preset.name}」专属范文与批注（替换当前文稿）\n【取消】：仅切换文种顶层提示词，保留您当前编辑的内容`
      );
      if (confirmLoad) {
        setDraft(matchingSample.content);
        setAnnotations(matchingSample.initialAnnotations);
        setGlobalPrompt(matchingSample.globalPrompt || preset.prompt);
        setRevisedText('');
        setRound(1);
        showToast(`已切换至「${preset.name}」，并载入配套专属范文与批注`);
      } else {
        setGlobalPrompt(preset.prompt);
        showToast(`已应用「${preset.name}」顶层指令（保留当前文稿）`);
      }
      return;
    }

    if (matchingSample) {
      setDraft(matchingSample.content);
      setAnnotations(matchingSample.initialAnnotations);
      setGlobalPrompt(matchingSample.globalPrompt || preset.prompt);
      setRevisedText('');
      setRound(1);
      showToast(`已切换至「${preset.name}」，并载入配套专属范文与批注`);
    } else {
      setGlobalPrompt(preset.prompt);
      showToast(`已应用「${preset.name}」顶层指令与提示词`);
    }
  };

  // Handle load sample draft
  const handleLoadSample = (sample: ExampleDraft) => {
    setDraft(sample.content);
    setGlobalPrompt(sample.globalPrompt);
    setSelectedPresetId(sample.presetId || 'notice');
    setAnnotations(sample.initialAnnotations);
    setRound(1);
    setRevisedText('');
    setSampleMenuOpen(false);
    showToast(`已载入「${sample.docType}」配套范文：《${sample.title}》`);
  };

  // Clear draft & annotations
  const handleClearDraft = () => {
    if (!draft.trim() && annotations.length === 0) {
      showToast('左侧文稿已为空');
      return;
    }
    if (window.confirm('确定要清空左侧文稿与所有批注吗？清空后可重新输入或导入新文稿。')) {
      setDraft('');
      setAnnotations([]);
      setRevisedText('');
      setRound(1);
      setSelectedTextareaQuote(null);
      showToast('已清空草稿与所有批注');
    }
  };

  // Trigger pinpoint modal from text selection
  const handleAddAnnotationForQuote = (quote: string) => {
    let defaultTag = '措辞规范';
    if (isNovel) defaultTag = '细节刻画';
    else if (isClassicPoem) defaultTag = '炼字推敲';
    else if (isModernPoem) defaultTag = '意象淬炼';

    setEditingAnnotation({
      quote,
      comment: '',
      tag: defaultTag
    });
    setPinpointModalOpen(true);
  };

  // Handle text selection inside the live editable textarea
  const handleTextareaSelect = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    if (start !== end && end - start >= 2) {
      const text = target.value.substring(start, end).trim();
      if (text.length >= 2 && text.length <= 300) {
        setSelectedTextareaQuote(text);
        return;
      }
    }
    setSelectedTextareaQuote(null);
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
      showToast(`请先输入或粘贴${getDocTypeLabel()}草稿`);
      return;
    }

    setIsSuggesting(true);
    showToast(
      isNovel
        ? '🤖 AI 文学顾问正在通读故事并挖掘细节优化点...'
        : isClassicPoem
        ? '🤖 AI 诗词名家正在审度平仄声律并推敲炼字...'
        : isModernPoem
        ? '🤖 AI 诗人正在通读诗作并淬炼意象张力...'
        : '🤖 AI 文章专家正在通读草稿并标出瑕疵与修改建议...'
    );

    try {
      const suggestions = await fetchSuggestedAnnotations(globalPrompt, draft, selectedPresetId);
      if (suggestions && suggestions.length > 0) {
        let fallbackTag = '措辞规范';
        if (isNovel) fallbackTag = '细节刻画';
        else if (isClassicPoem) fallbackTag = '炼字推敲';
        else if (isModernPoem) fallbackTag = '意象淬炼';

        const newItems: PinpointAnnotation[] = suggestions.map((s, idx) => ({
          id: `ai-sug-${Date.now()}-${idx}`,
          quote: s.quote,
          comment: s.comment,
          tag: s.tag || fallbackTag,
          enabled: true
        }));
        setAnnotations((prev) => [...newItems, ...prev]);
        showToast(`✨ 成功生成 ${suggestions.length} 处${getDocTypeLabel()}精准修改建言！`);
      } else {
        showToast(`草稿整体质量良好，未发现显著需修改处`);
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
        docType: selectedPresetId,
        preserveOriginal,
        onChunk: (chunk) => {
          setRevisedText((prev) => prev + chunk);
        },
        onDone: () => {
          setIsGenerating(false);
          showToast(`🎉 第 ${round} 轮${getDocTypeLabel()}精修完成！`);
        },
        onError: (err) => {
          setIsGenerating(false);
          showToast('精修生成失败: ' + err.message);
        }
      },
      controller.signal
    );
  };

  // Dedicated Surgical Generation: strictly based on left draft + pinpoint annotations, strictly preserving un-annotated text
  const handleGenerateStrictSurgical = async () => {
    if (!draft.trim()) {
      showToast('草稿内容不能为空');
      return;
    }

    if (isGenerating) {
      abortControllerRef.current?.abort();
      setIsGenerating(false);
      showToast('已停止生成');
      return;
    }

    const activeCount = annotations.filter((a) => a && a.enabled !== false && a.comment?.trim()).length;
    if (activeCount === 0) {
      showToast('当前无有效批注，将为您严格保留全文呈现于右侧。您也可随时在草稿中划选文字添加批注！');
    }

    setIsGenerating(true);
    setRevisedText('');
    setViewMode('preview');

    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Scroll to right side on smaller screens
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        rightColumnRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }

    const surgicalInstruction = isNovel
      ? '请完全根据左侧提供的小说故事原文，结合文中所列的批注提示词进行修改。批注提示词没有涉及的部分，全部100%原样保留原文；批注提示词涉及的部分，严格按照要求修改。'
      : isPoetry
      ? '请完全根据左侧提供的诗词草稿原文，结合文中所列的批注提示词进行修改。批注提示词没有涉及的部分，全部100%原样保留原有诗句与排版；批注提示词涉及的部分，严格按照要求精修改进。'
      : '请完全根据左侧提供的文章草稿原文，结合文中所列的批注提示词进行修改。批注提示词没有涉及的部分，全部100%原样保留原文；批注提示词涉及的部分，严格按照要求修改。';

    await streamOfficialDocument(
      {
        globalPrompt: surgicalInstruction,
        draft,
        annotations,
        round,
        docType: selectedPresetId,
        preserveOriginal: true,
        onChunk: (chunk) => {
          setRevisedText((prev) => prev + chunk);
        },
        onDone: () => {
          setIsGenerating(false);
          showToast(`🎉 第 ${round} 轮精准生文完成！未涉及内容已全部保留在右侧`);
        },
        onError: (err) => {
          setIsGenerating(false);
          showToast('精准生文失败: ' + err.message);
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
    setDraftMode('edit');
    showToast(`🔄 已成功升级为第 ${nextRound} 版草稿！支持直接编辑与添加批注`);
  };

  // Copy revised text
  const handleCopyResult = () => {
    if (!revisedText) return;
    navigator.clipboard.writeText(revisedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast(`${getDocTypeLabel()}全文已复制到剪贴板`);
  };

  // Download md
  const handleDownloadMd = () => {
    if (!revisedText) return;
    const blob = new Blob([revisedText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${getDocTypeLabel()}精修稿_V${round}.md`;
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
            <span className="text-lg">
              {selectedPresetId === 'novel' ? '📖' : isPoetry ? '🖋️' : '📝'}
            </span>
            <span className="font-bold text-sm sm:text-base text-white tracking-tight">
              WriteBuddy · {selectedPresetId === 'novel' ? '灵作笔友' : isPoetry ? '诗韵笔友' : '妙笔智匠'}
            </span>
            <span className="hidden sm:inline-block text-[11px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
              {selectedPresetId === 'novel'
                ? '小说文学精修 · 精确顶点批注'
                : isPoetry
                ? '诗词格律精炼 · 精确炼字推敲'
                : '全品类文章写作精修 · 外科手术式修改'}
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
                  <span>
                    {selectedPresetId === 'novel'
                      ? '📖 顶部小说/文学创作总指令 (Prompt)'
                      : isPoetry
                      ? '🖋️ 顶部诗词创作与推敲总指令 (Prompt)'
                      : '📝 顶部文章总提示词 / 写作总指令 (Prompt)'}
                  </span>
                  <span className="text-[10px] text-blue-400 font-normal">
                    {selectedPresetId === 'novel'
                      ? '(统领故事主旨、文风基调、叙事视角与节奏)'
                      : isPoetry
                      ? '(统领诗词格律、韵调、意象与炼字取向)'
                      : '(统领全篇文章主旨、文风基调与逻辑架构)'}
                  </span>
                </h2>
              </div>
            </div>

            {/* Quick Document Type Chips & Surgical Precision Toggle */}
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

              <div className="h-3.5 w-[1px] bg-slate-700 mx-1 shrink-0 hidden sm:block" />

              {/* Surgical Precision Toggle */}
              <button
                type="button"
                onClick={() => {
                  setPreserveOriginal((prev) => !prev);
                  showToast(!preserveOriginal ? '已启用「严格保留未改原文」模式（仅改批注处）' : '已切换为「通篇重构改写」模式');
                }}
                className={`px-2 py-0.5 rounded-lg text-xs transition whitespace-nowrap flex items-center gap-1.5 border shrink-0 ${
                  preserveOriginal
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                    : 'bg-slate-800/70 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
                title={
                  preserveOriginal
                    ? '【当前：严格保留模式】草稿中未批注的部分100%一字不差保留，仅对批注点进行外科手术式精准替换'
                    : '【当前：全篇重构模式】AI将根据顶层提示词对整篇草稿进行通篇重写润色'
                }
              >
                <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${preserveOriginal ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                <span>{preserveOriginal ? '🎯 严格保留未改原文' : '⚡ 通篇重构改写'}</span>
              </button>
            </div>
          </div>

          {/* Prompt Input & Execute Button */}
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 relative">
              <textarea
                value={globalPrompt}
                onChange={(e) => setGlobalPrompt(e.target.value)}
                rows={2}
                placeholder={
                  selectedPresetId === 'novel'
                    ? '在此输入小说创作指令（如：故事基调、悬疑节奏、白描与感官细节要求、人物口吻风格、特定叙事视角等）...'
                    : isClassicPoem
                    ? '在此输入古典诗词推敲指令（如：韵部声律、平仄协调、对仗工稳、炼字取向、高远意境等）...'
                    : isModernPoem
                    ? '在此输入现代诗创作指令（如：意象淬炼、语言张力、隐喻与陌生化、情感克制与留白等）...'
                    : '在此输入顶层文章提示词（如：文章类型、核心主旨、目标受众、重点论据、行文口吻与逻辑架构等）...'
                }
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
                  <span>
                    {preserveOriginal
                      ? '🎯 按照总提示词与精确批注一键精准生文 (严格保留未改处)'
                      : `⚡ 按照总提示词与批注通篇重构${getDocTypeLabel()}`}
                  </span>
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
              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".docx,.md,.markdown,.txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileImport(file);
                  e.target.value = '';
                }}
                className="hidden"
              />

              {/* Import File Button */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 font-medium transition"
                title="导入 Word (.docx)、Markdown (.md) 或纯文本 (.txt)"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>导入文件</span>
              </button>

              {/* Load Sample Draft Dropdown */}
              <div className="relative" ref={sampleMenuRef}>
                <button
                  onClick={() => setSampleMenuOpen((prev) => !prev)}
                  className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                  title="选择并载入写作范例初稿"
                >
                  <span>范例初稿</span>
                  <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${sampleMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {sampleMenuOpen && (
                  <div className="absolute right-0 mt-1.5 w-80 max-h-[30rem] overflow-y-auto bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/95 backdrop-blur-sm z-10">
                      <span>文种专属配套范文库（7套）</span>
                      <span className="text-[10px] text-slate-500 font-normal">点击即载入</span>
                    </div>
                    {EXAMPLE_DRAFTS.map((sample) => {
                      const isCurrent = selectedPresetId === sample.presetId;
                      return (
                        <button
                          key={sample.id}
                          onClick={() => handleLoadSample(sample)}
                          className={`w-full text-left px-3 py-2.5 hover:bg-slate-800/80 transition flex flex-col gap-1 border-b border-slate-800/50 last:border-b-0 ${
                            isCurrent ? 'bg-blue-950/40 border-l-2 border-l-blue-500' : ''
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1.5">
                            <span className={`font-medium truncate ${isCurrent ? 'text-blue-300' : 'text-slate-200'}`}>
                              {sample.title}
                            </span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-medium ${
                              sample.presetId === 'novel'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            }`}>
                              {sample.docType}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            预置 {sample.initialAnnotations.length} 处典型精准批注示范
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Clear Draft Button */}
              <button
                onClick={handleClearDraft}
                className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 font-medium transition"
                title="清空当前草稿与所有批注"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>清空</span>
              </button>

              {/* Mode Toggle Tabs */}
              <div className="flex items-center bg-slate-950 rounded-lg p-0.5 border border-slate-800">
                <button
                  onClick={() => setDraftMode('edit')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                    draftMode === 'edit'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="实时编辑模式：直接在左侧修改文字，修改后即视同最新原文"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>实时编辑</span>
                </button>
                <button
                  onClick={() => setDraftMode('preview')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                    draftMode === 'preview'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="排版预览模式：优雅呈现 Markdown 标题、排版与段落效果"
                >
                  <Eye className="w-3 h-3" />
                  <span>排版预览</span>
                </button>
                <button
                  onClick={() => setDraftMode('annotated')}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1 ${
                    draftMode === 'annotated'
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                  title="批注对照模式：直观查看已设批注的黄色高亮与序号标记"
                >
                  <BookmarkPlus className="w-3 h-3" />
                  <span>批注对照</span>
                </button>
              </div>
            </div>
          </div>

          {/* Draft Display Area with Drag & Drop */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const file = e.dataTransfer.files?.[0];
              if (file) handleFileImport(file);
            }}
            className="h-[380px] bg-slate-950/40 relative border-b border-slate-800 flex flex-col"
          >
            {/* Direct Edit Helper Bar */}
            <div className="px-3.5 py-1.5 bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-between text-[11px] select-none">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>
                  {draftMode === 'edit'
                    ? '左侧实时编辑区 · 任何修改直接视同最新原文（可直接打字或划选批注）'
                    : draftMode === 'preview'
                    ? '左侧排版预览区 · 当前原文排版与段落渲染视图'
                    : '左侧批注对照区 · 高亮显示已标记的精准批注与锚定句'}
                </span>
              </span>
              <span className="text-[10px] text-slate-500 hidden sm:inline">
                {draftMode === 'edit'
                  ? '选中文中文字可直接添加精准批注'
                  : draftMode === 'preview'
                  ? 'Markdown 格式排版渲染'
                  : '点击高亮处可快速查看修改意见'}
              </span>
            </div>

            {/* Drag & Drop Visual Overlay */}
            {isDragging && (
              <div className="absolute inset-0 z-50 bg-blue-950/90 backdrop-blur-sm border-2 border-dashed border-blue-400 rounded-xl flex flex-col items-center justify-center gap-2 text-blue-200 pointer-events-none animate-in fade-in zoom-in duration-150">
                <Upload className="w-10 h-10 text-blue-400 animate-bounce" />
                <div className="text-sm font-semibold">松开鼠标即可导入此文件</div>
                <div className="text-xs text-blue-300/80">支持 Word (.docx) / Markdown (.md) / 纯文本 (.txt)</div>
              </div>
            )}

            {draftMode === 'edit' ? (
              <div className="relative flex-1 h-full overflow-hidden">
                <textarea
                  ref={leftTextareaRef}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onSelect={handleTextareaSelect}
                  onMouseUp={handleTextareaSelect}
                  onKeyUp={handleTextareaSelect}
                  placeholder={
                    selectedPresetId === 'novel'
                      ? '在此直接编写或编辑小说故事（编辑后的文字直接视同原文）... 选中文中任意语句可直接添加精确批注'
                      : isClassicPoem
                      ? '在此直接编写或编辑古典诗词（编辑后的文字直接视同原文）... 选中诗句可添加炼字或格律批注'
                      : isModernPoem
                      ? '在此直接编写或编辑现代诗歌（编辑后的文字直接视同原文）... 选中诗句可添加意象与张力批注'
                      : '在此直接编写或编辑文章初稿（编辑后的文字直接视同原文）... 选中文中任意文字可点击下方按钮添加精确批注'
                  }
                  className="w-full h-full p-4 bg-transparent text-slate-100 text-xs md:text-sm font-sans leading-relaxed focus:outline-none resize-none selection:bg-amber-500/30 selection:text-amber-200"
                />

                {/* Floating Add Annotation Button for Textarea Selection */}
                {selectedTextareaQuote && (
                  <div className="absolute bottom-3 right-4 z-30 animate-in fade-in zoom-in-95 duration-150">
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        handleAddAnnotationForQuote(selectedTextareaQuote);
                        setSelectedTextareaQuote(null);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-2xl shadow-amber-950/80 border border-amber-300 transition hover:scale-105 cursor-pointer"
                    >
                      <BookmarkPlus className="w-4 h-4 text-slate-950" />
                      <span>对选中文本添加修改意见</span>
                      <span className="text-[10px] bg-slate-950/20 px-1.5 py-0.5 rounded text-slate-900 truncate max-w-[130px]">
                        「{selectedTextareaQuote}」
                      </span>
                    </button>
                  </div>
                )}
              </div>
            ) : draftMode === 'preview' ? (
              <div className="flex-1 h-full overflow-y-auto p-4 md:p-6 bg-slate-950/30">
                {draft.trim() ? (
                  <div
                    className="prose prose-invert prose-slate max-w-none text-xs md:text-sm leading-relaxed font-sans"
                    dangerouslySetInnerHTML={{ __html: marked.parse(draft) as string }}
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs gap-2">
                    <FileText className="w-8 h-8 opacity-40" />
                    <span>文章草稿为空，请切换到「实时编辑」选项卡输入或导入内容</span>
                  </div>
                )}
              </div>
            ) : (
              <AnnotatedDraftView
                draft={draft}
                annotations={annotations}
                onAddAnnotationForQuote={handleAddAnnotationForQuote}
                onAnnotationClick={(ann) => {
                  setEditingAnnotation(ann);
                  setPinpointModalOpen(true);
                }}
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
                  title={
                    selectedPresetId === 'novel'
                      ? '大模型通读故事，自动挖掘情节推进、对话神态、环境描摹的精修亮点'
                      : isClassicPoem
                      ? '大模型通读古诗，推敲平仄格律、炼字炼句与深远意境'
                      : isModernPoem
                      ? '大模型通读现代诗，淬炼诗意意象、隐喻与语言张力'
                      : '大模型自动通读草稿，在文中找出瑕疵薄弱点并标出精准修改意见'
                  }
                >
                  <Sparkles className="w-3 h-3 text-purple-400" />
                  <span>
                    {isSuggesting
                      ? '推敲审读中...'
                      : selectedPresetId === 'novel'
                      ? '💡 AI 文学润色建言'
                      : isClassicPoem
                      ? '💡 AI 诗词炼字建言'
                      : isModernPoem
                      ? '💡 AI 现代诗意建言'
                      : '💡 AI 智能精修建言'}
                  </span>
                </button>

                {/* Manual Add Button */}
                <button
                  onClick={() => {
                    setEditingAnnotation(null);
                    setPinpointModalOpen(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-medium transition"
                  title="手动输入原文引用语句添加批注"
                >
                  <BookmarkPlus className="w-3 h-3 text-blue-400" />
                  <span>手动添加</span>
                </button>
              </div>
            </div>

            {/* Annotations List */}
            <div className="space-y-2.5 max-h-[360px] overflow-y-auto pr-1">
              {annotations.length === 0 ? (
                <div className="py-8 text-center text-slate-500 text-xs border border-dashed border-slate-800 rounded-xl bg-slate-950/20">
                  <BookmarkPlus className="w-6 h-6 mx-auto mb-2 opacity-30 text-slate-400" />
                  <p>暂无修改批注</p>
                  <p className="text-[10px] text-slate-600 mt-1">
                    在左侧草稿中划选文字，或点击上方「AI 智能建言」自动分析
                  </p>
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

            {/* Dedicated Generation Action Bar Under Modification Panel (修改板块下方的生文按钮) */}
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-950/70 p-3 rounded-xl border border-slate-800/90 shadow-sm">
              <div className="flex flex-col gap-0.5">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>修改板块专属生文 · 保留未改原文</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  完全根据左侧原文与批注提示词进行修改；未涉及部分 100% 严格保留，成文置于右侧。
                </div>
              </div>

              <button
                type="button"
                onClick={handleGenerateStrictSurgical}
                className={`px-4 py-2.5 rounded-xl font-semibold text-xs md:text-sm transition flex items-center justify-center gap-2 shadow-lg whitespace-nowrap shrink-0 ${
                  isGenerating
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/40'
                    : 'bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-950/60 hover:scale-[1.02]'
                }`}
                title="完全根据左侧草稿与批注提示词修改，未涉及部分一字不差全部保留，生成成文呈现在右侧"
              >
                {isGenerating ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current animate-spin" />
                    <span>停止生成</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-100" />
                    <span>⚡ 依据批注精准生文 (严格保留未改处)</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: 成文成品与对比 ================= */}
        <div ref={rightColumnRef} className="flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl shadow-xl overflow-hidden min-h-[640px] flex-1">
          {/* Header */}
          <div className="px-4 py-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                selectedPresetId === 'novel'
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                  : isPoetry
                  ? 'bg-purple-500/10 text-purple-300 border border-purple-500/20'
                  : 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
              }`}>
                {getDocTypeLabel()}成文第 {round} 版
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
                  {selectedPresetId === 'novel' ? '文学排版' : isPoetry ? '诗词排版' : '文章排版'}
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
                    title={`复制${getDocTypeLabel()}全文`}
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
                <div className="text-sm font-medium">
                  {selectedPresetId === 'novel'
                    ? '文学大师正在对照批注精心雕琢场景沉浸感与对白...'
                    : isClassicPoem
                    ? '诗词名家正在推敲平仄格律、炼字炼句与深远意境...'
                    : isModernPoem
                    ? '诗人正在淬炼现代意象、打破陈词俗套与语言张力...'
                    : '编辑专家正在对照文章要求与顶点批注精心润色...'}
                </div>
                <div className="text-xs text-slate-500">
                  {selectedPresetId === 'novel'
                    ? '严密落实每处细节刻画批注，重塑戏剧张力与画面感'
                    : isPoetry
                    ? '落实每一处炼字与意象批注，铸就凝练诗韵'
                    : '严密落实每一处精确批注，重塑规范文章体例'}
                </div>
              </div>
            ) : !revisedText ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 gap-3 py-24 select-none">
                <FileText className="w-10 h-10 text-slate-700" />
                <div className="text-xs text-slate-400">
                  {selectedPresetId === 'novel'
                    ? '右侧是小说故事精修成文展示区。'
                    : isPoetry
                    ? '右侧是诗词精修成文展示区。'
                    : '右侧是文章精修成文展示区。'}
                </div>
                <div className="text-[11px] text-slate-600 max-w-sm text-center">
                  在左侧草稿中划选文字添加精确批注后，点击「⚡ 依据批注精准生文」或顶部按钮启动！
                </div>
              </div>
            ) : viewMode === 'preview' ? (
              <div className="bg-slate-950/60 p-6 rounded-2xl border border-slate-800 shadow-inner">
                {/* Visual Accent */}
                {selectedPresetId === 'novel' ? (
                  <div className="flex items-center justify-between pb-3 mb-5 border-b border-amber-500/30">
                    <span className="text-xs font-medium text-amber-300/90 flex items-center gap-1.5">
                      <span>📖</span>
                      <span>文学故事 · 沉浸精修成文</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      Show, don't tell · 画面白描
                    </span>
                  </div>
                ) : isPoetry ? (
                  <div className="flex items-center justify-between pb-3 mb-5 border-b border-purple-500/30">
                    <span className="text-xs font-medium text-purple-300/90 flex items-center gap-1.5">
                      <span>🖋️</span>
                      <span>{isClassicPoem ? '古典诗词 · 韵律精修成文' : '现代诗歌 · 意象淬炼成文'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {isClassicPoem ? '格律谐协 · 炼字入微' : '意象奇崛 · 语言张力'}
                    </span>
                  </div>
                ) : (
                  <div className="w-full h-1 bg-blue-600/80 mb-6 rounded-full" />
                )}
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
