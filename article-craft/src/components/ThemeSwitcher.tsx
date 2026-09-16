import React, { useEffect, useRef, useState } from 'react';
import { Palette, Check, ChevronDown } from 'lucide-react';
import { THEMES, ThemeId, applyTheme, getTheme, readSavedTheme } from '../themes';

interface ThemeSwitcherProps {
  /** 切换成功后弹个 toast（复用 App 的提示条） */
  onToast?: (msg: string) => void;
}

/**
 * 顶栏配色主题切换器
 * - 点击展开主题面板，每套主题给出色板预览
 * - 选择后立即生效并写入 localStorage，下次打开自动沿用
 */
export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ onToast }) => {
  const [themeId, setThemeId] = useState<ThemeId>(() => readSavedTheme());
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  // 挂载时与引导脚本对齐（引导脚本已在 <head> 里设置过 <html>）
  useEffect(() => {
    const saved = readSavedTheme();
    setThemeId(saved);
    applyTheme(saved, { persist: false, animate: false });
  }, []);

  // 点击外部 / Esc 关闭面板
  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const current = getTheme(themeId);

  const choose = (id: ThemeId) => {
    const next = getTheme(id);
    setThemeId(id);
    applyTheme(id);
    setOpen(false);
    onToast?.(`已切换配色主题：${next.emoji} ${next.name}（已记住）`);
  };

  return (
    <div className="relative" ref={wrapRef}>
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 hover:bg-slate-800 transition"
        title={`页面配色主题：${current.emoji} ${current.name}　共 ${THEMES.length} 套可选，选择后自动记住`}
        aria-haspopup="true"
        aria-expanded={open}
      >
        <Palette className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">
          {current.emoji} {current.name}
        </span>
        <ChevronDown className={`w-3 h-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1.5 w-[17.5rem] bg-slate-900 border border-slate-700 rounded-xl shadow-2xl py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100">
          <div className="px-3 py-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800 flex items-center justify-between">
            <span>页面配色主题（{THEMES.length} 套）</span>
            <span className="text-[10px] text-slate-500 font-normal">选择后自动记住</span>
          </div>

          <div className="max-h-[24rem] overflow-y-auto">
            {THEMES.map((t) => {
              const active = themeId === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => choose(t.id)}
                  title={t.desc}
                  className={`w-full text-left px-3 py-2 transition flex flex-col gap-1 border-b border-slate-800/50 last:border-b-0 hover:bg-slate-800/80 ${
                    active ? 'bg-blue-950/40 border-l-2 border-l-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {/* 色板预览：底 / 面板 / 强调 / 文字 */}
                    <span className="flex -space-x-1 shrink-0">
                      {t.swatch.map((c, i) => (
                        <span
                          key={i}
                          className="w-3.5 h-3.5 rounded-full ring-1 ring-slate-700/70"
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </span>
                    <span className={`text-xs font-medium truncate ${active ? 'text-blue-300' : 'text-slate-200'}`}>
                      {t.emoji} {t.name}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded border shrink-0 font-medium ${
                        t.mode === 'light'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                          : 'bg-slate-800/80 text-slate-400 border-slate-700'
                      }`}
                    >
                      {t.mode === 'light' ? '浅色' : '深色'}
                    </span>
                    {active && <Check className="w-3.5 h-3.5 text-blue-400 ml-auto shrink-0" />}
                  </div>
                  <span className="text-[11px] text-slate-400 pl-[1.375rem] leading-snug">{t.desc}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ThemeSwitcher;
