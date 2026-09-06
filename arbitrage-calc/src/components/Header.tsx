import React from 'react';
import { CalcMode, RubberVariety } from '../types';
import { VARIETY_CONFIGS, PRESET_SCENARIOS } from '../constants/varieties';
import { TrendingUp, Layers, ChevronRight, Home, Wrench, Sparkles } from 'lucide-react';

interface HeaderProps {
  mode: CalcMode;
  setMode: (mode: CalcMode) => void;
  variety: RubberVariety;
  setVariety: (v: RubberVariety) => void;
  onApplyScenario: (scenario: (typeof PRESET_SCENARIOS)[0]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  setMode,
  variety,
  setVariety,
  onApplyScenario,
}) => {
  const currentConfig = VARIETY_CONFIGS[variety];

  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            RU
          </div>
          <span className="font-bold text-slate-100 text-sm">期货基差与价差套利在线测算器</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-[11px] font-mono">
            橡胶投研利器
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

      {/* Main Controls: Variety Tabs + Mode Toggle */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Variety Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['RU', 'NR', 'BR'] as const).map((v) => {
            const cfg = VARIETY_CONFIGS[v];
            const isActive = variety === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVariety(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{cfg.id}</span>
                <span className="text-[11px] opacity-80 hidden sm:inline">{cfg.name.split(' ')[1]}</span>
                <span className="text-[10px] opacity-60 font-mono">({cfg.multiplier}t/手)</span>
              </button>
            );
          })}
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setMode('spread')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              mode === 'spread'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>基差与跨期价差 (Basis & Spread)</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('delivery')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              mode === 'delivery'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>全持有成本交割套利 (Full Carry)</span>
          </button>
        </div>
      </div>

      {/* Preset Scenarios Banner */}
      <div className="bg-slate-900/50 px-4 sm:px-6 py-2 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            典型行情场景：
          </span>
          {PRESET_SCENARIOS.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onApplyScenario(s)}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-emerald-300 border border-slate-700/60 text-[11px] transition-colors"
              title={s.desc}
            >
              {s.title}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
