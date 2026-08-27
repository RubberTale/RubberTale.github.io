// HUD.tsx
import React, { useEffect } from 'react';
import { TrendingUp, TrendingDown, EyeOff, Flame, AlertCircle, RefreshCw, XCircle, Gauge } from 'lucide-react';
import { sounds } from '../soundEngine';

interface HUDProps {
  timeLeft: number;
  gameState: 'decision' | 'playing' | 'revealed';
  leverage: number;
  setLeverage: (lev: number) => void;
  speed: number;
  setSpeed: (speed: number) => void;
  onTrade: (action: 'long' | 'short' | 'skip') => void;
  currentPnL: number;
  onEmergencyExit?: () => void;
  onReversePosition?: () => void;
  action: 'long' | 'short' | 'skip' | null;
}

export const HUD: React.FC<HUDProps> = ({
  timeLeft,
  gameState,
  leverage,
  setLeverage,
  speed,
  setSpeed,
  onTrade,
  currentPnL,
  onEmergencyExit,
  onReversePosition,
  action
}) => {
  // Heartbeat sound warning when timer <= 5s
  useEffect(() => {
    if (gameState === 'decision' && timeLeft <= 5 && timeLeft > 0) {
      sounds.playHeartbeat(75 + (5 - timeLeft) * 15);
    }
  }, [timeLeft, gameState]);

  return (
    <div className="w-full bg-slate-900/95 border border-slate-800 rounded-xl p-4 shadow-xl backdrop-blur-md">
      {gameState === 'decision' && (
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* 30s Countdown Clock */}
          <div className="flex items-center gap-3 w-full lg:w-auto justify-start">
            <div className={`relative flex items-center justify-center w-14 h-14 rounded-xl border font-mono font-black text-2xl transition-all shrink-0 ${
              timeLeft <= 5 
                ? 'border-red-500 bg-red-950/40 text-red-400 animate-pulse shadow-[0_0_20px_rgba(239,68,68,0.5)]' 
                : 'border-emerald-500/40 bg-emerald-950/20 text-emerald-400'
            }`}>
              {timeLeft}s
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-300">观察期倒计时</span>
              <span className="text-[11px] text-slate-500">审视前50根K线形态与量价</span>
            </div>
          </div>

          {/* Controls: Leverage & Speed Selectors */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {/* Leverage Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Flame size={14} className="text-amber-400" /> 杠杆:
              </span>
              {[1, 5, 10, 20].map(lev => (
                <button
                  key={lev}
                  onClick={() => {
                    sounds.playTerminalBeep(500 + lev * 40, 0.05);
                    setLeverage(lev);
                  }}
                  className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition-all ${
                    leverage === lev
                      ? 'bg-amber-500 text-slate-950 shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {lev}x
                </button>
              ))}
            </div>

            {/* Speed Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                <Gauge size={14} className="text-sky-400" /> 速度:
              </span>
              {[0.5, 1.0, 1.5, 2.0].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 rounded text-xs font-mono font-bold transition-all ${
                    speed === s
                      ? 'bg-sky-500 text-slate-950 shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {s === 1 ? '1.0x' : `${s}x`}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <button
              onClick={() => onTrade('long')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-red-600 hover:bg-red-500 active:scale-95 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(239,68,68,0.4)] transition-all cursor-pointer"
            >
              <TrendingUp size={18} />
              <span>全仓做多</span>
            </button>

            <button
              onClick={() => onTrade('short')}
              className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-bold text-sm tracking-wide shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all cursor-pointer"
            >
              <TrendingDown size={18} />
              <span>全仓做空</span>
            </button>

            <button
              onClick={() => onTrade('skip')}
              className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 active:scale-95 text-slate-300 text-sm font-medium transition-all cursor-pointer"
              title="放弃本局盲盒，空仓观望"
            >
              <EyeOff size={16} />
              <span className="hidden sm:inline">观望</span>
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in">
          {/* Live PnL ticker */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-950 font-mono text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>翻牌演播中... (极速走完半年行情)</span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">当前浮盈:</span>
              <span className={`text-2xl font-black font-mono tracking-tight ${
                currentPnL > 0 ? 'text-red-400' : currentPnL < 0 ? 'text-emerald-400' : 'text-slate-300'
              }`}>
                {currentPnL > 0 ? `+${currentPnL.toFixed(1)}%` : `${currentPnL.toFixed(1)}%`}
              </span>
            </div>
          </div>

          {/* Real-time Intervention & Speed Control */}
          <div className="flex flex-wrap items-center gap-3">
            {/* On-the-fly Speed Selector */}
            <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800">
              <Gauge size={13} className="text-sky-400 mr-1" />
              {[0.5, 1.0, 1.5, 2.0].map(s => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded text-xs font-mono font-bold transition-all ${
                    speed === s
                      ? 'bg-sky-500 text-slate-950 shadow-md scale-105'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {s === 1 ? '1.0x' : `${s}x`}
                </button>
              ))}
            </div>

            <button
              onClick={onEmergencyExit}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 active:scale-95 text-slate-950 font-bold text-xs tracking-wide shadow-lg transition-all cursor-pointer"
            >
              <XCircle size={16} />
              <span>紧急止盈/止损平仓</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
