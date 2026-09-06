import React from 'react';
import { ThemeConfig, TemplateType } from '../../types';
import { COLOR_PALETTES } from '../../constants/sampleData';
import { Sparkles, LayoutTemplate, Palette, Type, MoveVertical, Minimize2 } from 'lucide-react';

interface ThemeEditorProps {
  theme: ThemeConfig;
  onChange: (theme: ThemeConfig) => void;
  onAutoFit: () => void;
}

export const ThemeEditor: React.FC<ThemeEditorProps> = ({ theme, onChange, onAutoFit }) => {
  const update = (field: keyof ThemeConfig, val: any) => {
    onChange({ ...theme, [field]: val });
  };

  const templates: { id: TemplateType; title: string; desc: string }[] = [
    { id: 'classic', title: '经典商务', desc: 'HR 首选，ATS 友好，结构严谨层次分明' },
    { id: 'modern', title: '现代极简', desc: '精致侧边色块与时间线，大方清爽' },
    { id: 'sidebar', title: '左右双栏', desc: '左侧技能与信息，右侧核心经历，信息密度高' },
    { id: 'creative', title: '创意精英', desc: '优雅顶部横幅，卡片式模块，产品/设计推荐' },
  ];

  return (
    <div className="space-y-5">
      {/* Auto-Fit Button Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-3.5 text-white flex items-center justify-between shadow-xs">
        <div className="space-y-0.5 pr-2">
          <div className="flex items-center gap-1.5 font-bold text-xs">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>智能单页适配 (Smart Fit 1-Page)</span>
          </div>
          <p className="text-[11px] text-blue-100">
            自动微调字号、行距与内边距，让简历内容恰好占满标准 A4 纸一页。
          </p>
        </div>
        <button
          type="button"
          onClick={onAutoFit}
          className="shrink-0 px-3 py-1.5 bg-white text-blue-700 hover:bg-blue-50 active:bg-blue-100 rounded-lg text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Minimize2 className="w-3.5 h-3.5" />
          一键适配
        </button>
      </div>

      {/* Template Selection */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <LayoutTemplate className="w-4 h-4 text-slate-500" />
          <span>选择简历排版模版</span>
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => update('template', t.id)}
              className={`p-3 rounded-xl border text-left transition-all relative ${
                theme.template === t.id
                  ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600 shadow-xs'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-xs text-slate-900">{t.title}</span>
                {theme.template === t.id && (
                  <span className="w-2 h-2 rounded-full bg-blue-600" />
                )}
              </div>
              <p className="text-[11px] text-slate-500 leading-tight">{t.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Theme Color */}
      <div className="space-y-2">
        <label className="text-xs font-semibold text-slate-800 flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-slate-500" />
          <span>主题配色 (Accent Color)</span>
        </label>
        <div className="flex flex-wrap items-center gap-2">
          {COLOR_PALETTES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => update('primaryColor', c.value)}
              title={c.label}
              className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                theme.primaryColor === c.value ? 'scale-110 ring-2 ring-offset-2 ring-slate-400' : 'hover:scale-105'
              }`}
              style={{ backgroundColor: c.value }}
            >
              {theme.primaryColor === c.value && (
                <span className="w-2 h-2 rounded-full bg-white shadow-xs" />
              )}
            </button>
          ))}
          <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200 text-xs text-slate-600">
            <span>自定义:</span>
            <input
              type="color"
              value={theme.primaryColor}
              onChange={(e) => update('primaryColor', e.target.value)}
              className="w-7 h-7 rounded cursor-pointer border border-slate-200 p-0"
            />
          </div>
        </div>
      </div>

      {/* Typography: Font Family & Size */}
      <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1.5">
            <Type className="w-3.5 h-3.5 text-slate-500" />
            <span>字体样式</span>
          </label>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white p-0.5 text-xs">
            {(['sans', 'serif', 'mono'] as const).map((font) => (
              <button
                key={font}
                type="button"
                onClick={() => update('fontFamily', font)}
                className={`flex-1 py-1 text-center rounded transition-colors ${
                  theme.fontFamily === font ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {font === 'sans' ? '无衬线' : font === 'serif' ? '宋体' : '等宽'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 flex items-center gap-1 mb-1.5">
            <MoveVertical className="w-3.5 h-3.5 text-slate-500" />
            <span>基准字号</span>
          </label>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white p-0.5 text-xs">
            {(['compact', 'normal', 'comfortable'] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => update('fontSize', sz)}
                className={`flex-1 py-1 text-center rounded transition-colors ${
                  theme.fontSize === sz ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {sz === 'compact' ? '紧凑' : sz === 'normal' ? '标准' : '宽松'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacing Controls */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">模块间距</label>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white p-0.5 text-xs">
            {(['compact', 'normal', 'relaxed'] as const).map((gap) => (
              <button
                key={gap}
                type="button"
                onClick={() => update('sectionGap', gap)}
                className={`flex-1 py-1 text-center rounded transition-colors ${
                  theme.sectionGap === gap ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {gap === 'compact' ? '紧凑' : gap === 'normal' ? '适中' : '宽松'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-slate-700 block mb-1.5">页面边距</label>
          <div className="flex rounded-lg border border-slate-200 overflow-hidden bg-white p-0.5 text-xs">
            {(['compact', 'normal', 'relaxed'] as const).map((pad) => (
              <button
                key={pad}
                type="button"
                onClick={() => update('paperPadding', pad)}
                className={`flex-1 py-1 text-center rounded transition-colors ${
                  theme.paperPadding === pad ? 'bg-blue-600 text-white font-medium' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pad === 'compact' ? '紧凑' : pad === 'normal' ? '标准' : '宽松'}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
