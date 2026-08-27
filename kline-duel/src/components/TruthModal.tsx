// TruthModal.tsx
import React, { useEffect } from 'react';
import { Award, Trophy, Skull, Share2, ArrowRight, RotateCcw, Calendar, Layers, BookOpen, ShieldAlert } from 'lucide-react';
import { sounds } from '../soundEngine';

interface TruthData {
  symbol: string;
  exchange: string;
  variety_name: string;
  sector: string;
  variety_desc: string;
  start_date: string;
  split_date: string;
  end_date: string;
  story: string;
  max_long_roi: number;
  max_short_roi: number;
  final_long_roi: number;
}

interface TruthModalProps {
  isOpen: boolean;
  truth: TruthData | null;
  finalRoi: number;
  liquidated: boolean;
  action: 'long' | 'short' | 'skip' | null;
  leverage: number;
  styleTags: string[];
  verdict: string;
  currentUser: any;
  onNextRound: () => void;
  onOpenFamousList: () => void;
  onOpenAuth: () => void;
  onOpenLeaderboard: () => void;
}

export const TruthModal: React.FC<TruthModalProps> = ({
  isOpen,
  truth,
  finalRoi,
  liquidated,
  action,
  leverage,
  styleTags,
  verdict,
  currentUser,
  onNextRound,
  onOpenFamousList,
  onOpenAuth,
  onOpenLeaderboard
}) => {
  useEffect(() => {
    if (isOpen) {
      if (liquidated) {
        sounds.playLiquidationAlarm();
      } else if (finalRoi > 0) {
        sounds.playWinFanfare();
      } else {
        sounds.playTerminalBeep(440, 0.2);
      }
    }
  }, [isOpen, liquidated, finalRoi]);

  if (!isOpen || !truth) return null;

  const isWin = finalRoi > 0 && !liquidated;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative max-w-xl w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-6 md:p-8 shadow-2xl overflow-hidden">
        {/* Glow backdrop ring */}
        <div className={`absolute -top-24 -right-24 w-64 h-64 rounded-full blur-3xl pointer-events-none opacity-20 ${
          liquidated ? 'bg-red-600' : isWin ? 'bg-amber-400' : 'bg-slate-500'
        }`} />

        {/* Header Ribbon & Result Title */}
        <div className="flex flex-col items-center text-center mb-5">
          <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold mb-3 ${
            liquidated
              ? 'bg-red-950 border border-red-500/50 text-red-400'
              : isWin
              ? 'bg-amber-950/80 border border-amber-500/50 text-amber-400'
              : 'bg-slate-800 border border-slate-700 text-slate-300'
          }`}>
            {liquidated ? <Skull size={14} /> : isWin ? <Trophy size={14} /> : <Award size={14} />}
            <span>{liquidated ? '🚨 爆仓清算' : isWin ? '✨ 决战大捷' : '⚔️ 交易结案'}</span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-400 font-mono">最终收益:</span>
            <span className={`text-4xl md:text-5xl font-black font-mono tracking-tight ${
              liquidated ? 'text-red-500' : finalRoi > 0 ? 'text-red-400' : 'text-emerald-400'
            }`}>
              {liquidated ? '-100%' : finalRoi > 0 ? `+${finalRoi.toFixed(1)}%` : `${finalRoi.toFixed(1)}%`}
            </span>
            <span className="text-xs text-slate-400 font-mono">({leverage}x 杠杆)</span>
          </div>

          <p className="text-sm font-medium text-slate-200 mt-2">{verdict}</p>

          {/* Style Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-2.5">
            {styleTags.map((tag, i) => (
              <span key={i} className="px-2.5 py-0.5 rounded-md bg-slate-800 border border-slate-700 text-xs font-mono text-slate-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* The Truth Box: Revealed Secret Info */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800/80 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-white tracking-wide">{truth.variety_name}</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 font-mono text-xs font-bold">
                {truth.symbol}
              </span>
              <span className="text-xs text-slate-400 font-mono">{truth.exchange}</span>
            </div>
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {truth.sector}
            </span>
          </div>

          {/* Date Range */}
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono mb-2">
            <Calendar size={13} className="text-slate-500" />
            <span>决策分界点: <b>{truth.split_date}</b></span>
            <span className="text-slate-600">|</span>
            <span>全周期: {truth.start_date} ~ {truth.end_date}</span>
          </div>

          {/* Market Narrative Story */}
          <div className="flex items-start gap-2 bg-slate-900/60 p-3 rounded-lg border border-slate-800/60 mt-2.5 text-xs text-slate-300 leading-relaxed">
            <BookOpen size={15} className="text-amber-400 shrink-0 mt-0.5" />
            <span>{truth.story}</span>
          </div>

          {/* Theoretical Max Analysis */}
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-slate-800/80 text-[11px] font-mono">
            <div className="text-slate-400">
              做多最大可能收益: <b className="text-red-400">+{truth.max_long_roi}%</b>
            </div>
            <div className="text-slate-400">
              做空最大可能收益: <b className="text-emerald-400">+{truth.max_short_roi}%</b>
            </div>
          </div>
        </div>

        {/* Server Sync / Guest Account Banner */}
        <div className="mb-5">
          {currentUser ? (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-xs font-mono text-emerald-300">
              <span>✅ 战绩已同步至服务器 [操盘手: {currentUser.username}]</span>
              <button
                onClick={onOpenLeaderboard}
                className="underline hover:text-white transition-colors cursor-pointer"
              >
                查看战绩簿 →
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs font-mono text-amber-300">
              <span>💡 游客模式：战绩仅存在本地</span>
              <button
                onClick={onOpenAuth}
                className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-all cursor-pointer"
              >
                注册/登录存盘
              </button>
            </div>
          )}
        </div>

        {/* Action Bottom Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={onNextRound}
            className="w-full sm:flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-95 text-slate-950 font-bold text-sm tracking-wide shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
          >
            <RotateCcw size={16} />
            <span>再抽一个盲盒 (NEXT)</span>
          </button>

          <button
            onClick={onOpenFamousList}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-300 font-medium text-xs tracking-wide transition-all cursor-pointer"
          >
            <Layers size={15} />
            <span>名局谱</span>
          </button>

          <button
            onClick={onOpenLeaderboard}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-slate-700 hover:bg-slate-800 active:scale-95 text-amber-400 font-medium text-xs tracking-wide transition-all cursor-pointer"
          >
            <Trophy size={15} />
            <span>榜单</span>
          </button>
        </div>
      </div>
    </div>
  );
};
