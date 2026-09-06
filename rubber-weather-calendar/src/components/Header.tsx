import React from 'react';
import { CloudRain, Calendar, Sliders, Home, Wrench, RefreshCw } from 'lucide-react';

export type ActiveTab = 'calendar' | 'weather' | 'simulator';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onRefreshWeather: () => void;
  refreshing: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  onRefreshWeather,
  refreshing,
}) => {
  return (
    <header className="border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-30">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            🌿
          </div>
          <span className="font-bold text-slate-100 text-sm">橡胶产区气象与割胶物候看板</span>
          <span className="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 text-[11px] font-mono">
            全产业链供给侧监测
          </span>
        </div>

        <div className="flex items-center gap-2 text-slate-400">
          <button
            type="button"
            onClick={onRefreshWeather}
            disabled={refreshing}
            className="flex items-center gap-1 hover:text-white px-2 py-1 rounded hover:bg-slate-800 transition-colors disabled:opacity-50 text-emerald-400"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? '气象数据刷新中...' : '刷新气象'}</span>
          </button>
          <span>·</span>
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

      {/* Main Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3 overflow-x-auto">
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'calendar'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>全年割胶物候对比日历 (1-12月)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('weather')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'weather'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>核心产区 7 天降雨预报</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`px-3.5 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
              activeTab === 'simulator'
                ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-900/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>天气减产情景模拟器</span>
          </button>
        </div>
      </div>
    </header>
  );
};
