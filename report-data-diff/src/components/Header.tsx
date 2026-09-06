import React from 'react';
import { PRESET_BALANCE_SHEETS } from '../constants/presets';
import { PresetBalanceSheet } from '../types';
import { FileDiff, Sparkles, Home, Wrench } from 'lucide-react';

interface HeaderProps {
  onSelectPreset: (preset: PresetBalanceSheet) => void;
}

export const Header: React.FC<HeaderProps> = ({ onSelectPreset }) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Top Utility */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
            <FileDiff className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-100 text-sm">研报数据与平衡表比对提取器</span>
          <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/60 text-[11px] font-mono">
            投研效率利器
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <a
            href="/tools/"
            className="flex items-center gap-1 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            <Wrench className="w-3.5 h-3.5 text-slate-500" />
            <span>博客小工具</span>
          </a>
          <span>·</span>
          <a
            href="/"
            className="flex items-center gap-1 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-slate-500" />
            <span>博客首页</span>
          </a>
        </div>
      </div>

      {/* Preset Templates */}
      <div className="bg-slate-900/50 px-4 sm:px-6 py-2.5">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            标准投研平衡表范例：
          </span>
          {PRESET_BALANCE_SHEETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => onSelectPreset(preset)}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-blue-300 border border-slate-700/60 text-[11px] transition-colors"
              title={preset.desc}
            >
              {preset.title.split(' (')[0]}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
