import React from 'react';
import { VarietyId, CalcTab } from '../types';
import { VARIETY_PRESETS, QUICK_TRADE_TEMPLATES } from '../constants/varieties';
import { Sliders, Shield, Home, Wrench, Sparkles, TrendingUp } from 'lucide-react';

interface HeaderProps {
  variety: VarietyId;
  setVariety: (v: VarietyId) => void;
  activeTab: CalcTab;
  setActiveTab: (t: CalcTab) => void;
  onApplyTemplate: (tpl: (typeof QUICK_TRADE_TEMPLATES)[0]) => void;
}

export const Header: React.FC<HeaderProps> = ({
  variety,
  setVariety,
  activeTab,
  setActiveTab,
  onApplyTemplate,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Top Utility */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-blue-600/20 text-blue-400 flex items-center justify-center font-bold">
            <Shield className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold text-slate-100 text-sm">期货持仓盈亏比与凯利仓位计算器</span>
          <span className="px-2 py-0.5 rounded bg-blue-950/60 text-blue-400 border border-blue-800/60 text-[11px] font-mono">
            资金与风控引擎
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

      {/* Varieties & Version Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        {/* Variety Selector */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          {(['RU', 'NR', 'BR', 'CUSTOM'] as const).map((v) => {
            const cfg = VARIETY_PRESETS[v];
            const isActive = variety === v;
            return (
              <button
                key={v}
                type="button"
                onClick={() => setVariety(v)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm shadow-blue-900/50'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                <span>{cfg.name}</span>
                {v !== 'CUSTOM' && (
                  <span className="text-[10px] opacity-60 font-mono">({cfg.multiplier}t)</span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Switcher: 基础版 vs 进阶版 */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('basic')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'basic'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>基础版 (盈亏比与固定风险仓位)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('advanced')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'advanced'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>进阶版 (凯利公式 / ATR / 回撤预演)</span>
          </button>
        </div>
      </div>

      {/* Quick Setup Templates */}
      <div className="bg-slate-900/50 px-4 sm:px-6 py-2 border-t border-slate-800/60">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            实战策略模版一键套用：
          </span>
          {QUICK_TRADE_TEMPLATES.map((t, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onApplyTemplate(t)}
              className="px-2.5 py-1 rounded-md bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-blue-300 border border-slate-700/60 text-[11px] transition-colors"
            >
              {t.title}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};
