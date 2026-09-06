import React from 'react';
import { PositionInputs, VarietyPreset, ContractData } from '../types';
import { ArrowUpCircle, ArrowDownCircle, DollarSign, Target, ShieldAlert, Percent, Activity } from 'lucide-react';

interface TradePlanFormProps {
  inputs: PositionInputs;
  onChange: (inputs: PositionInputs) => void;
  preset: VarietyPreset;
  activeContracts?: ContractData[];
}

export const TradePlanForm: React.FC<TradePlanFormProps> = ({ inputs, onChange, preset, activeContracts }) => {
  const update = (field: keyof PositionInputs, val: any) => {
    onChange({ ...inputs, [field]: val });
  };

  return (
    <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-4 shadow-xl">
      <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
        <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <span className="w-2 h-4 rounded-full bg-blue-500" />
          <span>账户风控与入场计划</span>
        </h2>
        <span className="text-xs text-blue-400 font-mono">
          {preset.name} ({inputs.multiplier}吨/手 · 保证金 {inputs.marginRate}%)
        </span>
      </div>

      {/* Account Equity & Max Risk % */}
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            <span>账户可用资金 (元)</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">¥</span>
            <input
              type="number"
              step="5000"
              value={inputs.accountEquity || ''}
              onChange={(e) => update('accountEquity', parseFloat(e.target.value) || 0)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-7 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
              <Percent className="w-3.5 h-3.5 text-amber-400" />
              <span>单笔最大亏损承受</span>
            </label>
            <span className="text-xs text-amber-400 font-mono">{inputs.maxRiskPercent}%</span>
          </div>
          <div className="flex items-center gap-2">
            {[1, 1.5, 2, 3].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => update('maxRiskPercent', pct)}
                className={`flex-1 py-2 rounded-xl text-xs font-mono transition-colors ${
                  inputs.maxRiskPercent === pct
                    ? 'bg-amber-600 text-white font-bold'
                    : 'bg-slate-900 text-slate-400 border border-slate-700 hover:bg-slate-800'
                }`}
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Trade Direction */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-slate-300">交易开仓方向</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => update('direction', 'LONG')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              inputs.direction === 'LONG'
                ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-sm shadow-rose-900/40'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4 text-rose-400" />
            <span>做多 (买入开仓 LONG)</span>
          </button>

          <button
            type="button"
            onClick={() => update('direction', 'SHORT')}
            className={`py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all ${
              inputs.direction === 'SHORT'
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-sm shadow-emerald-900/40'
                : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4 text-emerald-400" />
            <span>做空 (卖出开仓 SHORT)</span>
          </button>
        </div>
      </div>

      {/* Entry Price, Stop Loss, Take Profit */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Activity className="w-3.5 h-3.5 text-blue-400" />
            <span>计划入场点位</span>
          </label>
          <input
            type="number"
            step="5"
            value={inputs.entryPrice || ''}
            onChange={(e) => update('entryPrice', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>防守止损点位</span>
          </label>
          <input
            type="number"
            step="5"
            value={inputs.stopLossPrice || ''}
            onChange={(e) => update('stopLossPrice', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-rose-300 font-mono focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <span>目标止盈点位</span>
          </label>
          <input
            type="number"
            step="5"
            value={inputs.takeProfitPrice || ''}
            onChange={(e) => update('takeProfitPrice', parseFloat(e.target.value) || 0)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-emerald-300 font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Quick Active Contracts Buttons */}
      {activeContracts && activeContracts.length > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-xs">
          <span className="text-slate-400 text-[11px]">实盘收盘价快捷填入:</span>
          {activeContracts.slice(0, 5).map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => {
                const diff = Math.abs(inputs.entryPrice - inputs.stopLossPrice) || 200;
                const targetDiff = Math.abs(inputs.takeProfitPrice - inputs.entryPrice) || diff * 2.5;
                const newEntry = c.close;
                const newStop = inputs.direction === 'LONG' ? newEntry - diff : newEntry + diff;
                const newTarget = inputs.direction === 'LONG' ? newEntry + targetDiff : newEntry - targetDiff;
                onChange({
                  ...inputs,
                  entryPrice: newEntry,
                  stopLossPrice: newStop,
                  takeProfitPrice: newTarget,
                });
              }}
              className={`px-2 py-0.5 rounded font-mono text-[11px] border transition-colors ${
                inputs.entryPrice === c.close
                  ? 'bg-blue-600/30 text-blue-300 border-blue-500/60 font-bold'
                  : 'bg-slate-900 text-slate-400 border-slate-700/60 hover:text-slate-200'
              }`}
            >
              {c.code} (¥{c.close})
            </button>
          ))}
        </div>
      )}

      {/* Win Rate Slider & ATR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-700/60">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-slate-300">预估系统历史胜率 (%)</label>
            <span className="text-xs font-mono text-blue-400">{inputs.winRate}%</span>
          </div>
          <input
            type="range"
            min="25"
            max="75"
            step="1"
            value={inputs.winRate}
            onChange={(e) => update('winRate', parseInt(e.target.value) || 45)}
            className="w-full accent-blue-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>30% (趋势型低胜率)</span>
            <span>50% (中性)</span>
            <span>70% (套利/高胜率)</span>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300">当前日线 ATR 真实波幅 (点)</label>
          <input
            type="number"
            value={inputs.atrValue || ''}
            onChange={(e) => update('atrValue', parseFloat(e.target.value) || 0)}
            placeholder="例如 180 点 (选填)"
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="text-[10px] text-slate-500">用于评估止损点数是否被市场正常日内噪音打穿</div>
        </div>
      </div>

      {/* Custom Variety Extra Inputs if CUSTOM is chosen */}
      {inputs.variety === 'CUSTOM' && (
        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700/60 text-xs">
          <div className="space-y-1">
            <label className="text-slate-400">合约乘数 (吨/手)</label>
            <input
              type="number"
              value={inputs.multiplier}
              onChange={(e) => update('multiplier', parseFloat(e.target.value) || 10)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 font-mono text-white"
            />
          </div>
          <div className="space-y-1">
            <label className="text-slate-400">保证金率 (%)</label>
            <input
              type="number"
              value={inputs.marginRate}
              onChange={(e) => update('marginRate', parseFloat(e.target.value) || 10)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-1.5 font-mono text-white"
            />
          </div>
        </div>
      )}
    </div>
  );
};
