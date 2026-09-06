import React from 'react';
import { SpreadInputs, SpreadResults, VarietyConfig } from '../types';
import { TrendingUp, ArrowUpRight, ArrowDownRight, Compass, HelpCircle, BarChart2 } from 'lucide-react';

interface SpreadCalculatorProps {
  config: VarietyConfig;
  inputs: SpreadInputs;
  onChange: (inputs: SpreadInputs) => void;
  results: SpreadResults;
}

export const SpreadCalculator: React.FC<SpreadCalculatorProps> = ({
  config,
  inputs,
  onChange,
  results,
}) => {
  const update = (field: keyof SpreadInputs, val: any) => {
    onChange({ ...inputs, [field]: val });
  };

  const minPrice = Math.min(inputs.spotPrice, inputs.nearPrice, inputs.farPrice) * 0.96;
  const maxPrice = Math.max(inputs.spotPrice, inputs.nearPrice, inputs.farPrice) * 1.04;
  const range = maxPrice - minPrice || 1;

  const getPercent = (price: number) => {
    return Math.max(10, Math.min(100, ((price - minPrice) / range) * 100));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Inputs Form (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-blue-500" />
              <span>行情数据录入</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{config.fullName}</span>
          </div>

          {/* Spot Price Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">现货主流成交价 (元/吨)</label>
              <span className="text-[11px] text-slate-400">{inputs.spotName}</span>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">¥</span>
              <input
                type="number"
                step="10"
                value={inputs.spotPrice || ''}
                onChange={(e) => update('spotPrice', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-7 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Near Month Contract */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">近月合约代码</label>
              <input
                type="text"
                value={inputs.nearContract}
                onChange={(e) => update('nearContract', e.target.value)}
                placeholder="RU2501"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">近月盘面价 (元/吨)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">¥</span>
                <input
                  type="number"
                  step="5"
                  value={inputs.nearPrice || ''}
                  onChange={(e) => update('nearPrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-7 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Far Month Contract */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">远月合约代码</label>
              <input
                type="text"
                value={inputs.farContract}
                onChange={(e) => update('farContract', e.target.value)}
                placeholder="RU2505"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">远月盘面价 (元/吨)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">¥</span>
                <input
                  type="number"
                  step="5"
                  value={inputs.farPrice || ''}
                  onChange={(e) => update('farPrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-7 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Days Difference */}
          <div className="space-y-1.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">近远月跨期间隔 (自然日)</label>
              <span className="text-xs font-mono text-blue-400">{inputs.daysDiff} 天</span>
            </div>
            <input
              type="range"
              min="30"
              max="240"
              step="10"
              value={inputs.daysDiff}
              onChange={(e) => update('daysDiff', parseInt(e.target.value) || 120)}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>30天 (跨月)</span>
              <span>120天 (01-05 或 05-09)</span>
              <span>240天 (跨年)</span>
            </div>
          </div>
        </div>

        {/* Contract Specs Info Card */}
        <div className="p-4 bg-slate-800/40 border border-slate-800 rounded-xl text-xs text-slate-400 space-y-1.5">
          <div className="font-semibold text-slate-300 flex items-center gap-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-blue-400" />
            <span>交易提示：基差定义公式</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            <strong className="text-slate-200">基差 (Basis) = 现货价格 - 期货价格</strong>。基差为正代表现货升水（强现实），基差为负代表期货升水（Contango 弱现实强预期）。
          </p>
        </div>
      </div>

      {/* Right Column: Output Metrics & Analysis (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Core Metrics Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Calendar Spread */}
          <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="text-xs text-slate-400 font-medium mb-1">跨期价差 (远 - 近)</div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  results.calendarSpread >= 0 ? 'text-amber-400' : 'text-blue-400'
                }`}
              >
                {results.calendarSpread > 0 ? `+${results.calendarSpread}` : results.calendarSpread}
              </span>
              <span className="text-xs text-slate-400 font-mono">元/吨</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              价差率：{results.spreadPercentage > 0 ? `+${results.spreadPercentage.toFixed(2)}%` : `${results.spreadPercentage.toFixed(2)}%`}
            </div>
          </div>

          {/* Annualized Spread Rate */}
          <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg relative overflow-hidden">
            <div className="text-xs text-slate-400 font-medium mb-1">年化升贴水率</div>
            <div className="flex items-baseline gap-1.5">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  results.annualizedSpreadRate >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {results.annualizedSpreadRate > 0
                  ? `+${results.annualizedSpreadRate.toFixed(1)}%`
                  : `${results.annualizedSpreadRate.toFixed(1)}%`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              基于 {inputs.daysDiff} 天折算
            </div>
          </div>

          {/* Market Structure Badge */}
          <div className="col-span-2 sm:col-span-1 p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg flex flex-col justify-between">
            <div className="text-xs text-slate-400 font-medium mb-1">期限结构形态</div>
            <div className="my-auto">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                  results.marketStructure === 'Contango'
                    ? 'bg-amber-950 text-amber-300 border border-amber-700/60'
                    : results.marketStructure === 'Backwardation'
                    ? 'bg-blue-950 text-blue-300 border border-blue-700/60'
                    : 'bg-slate-700 text-slate-300'
                }`}
              >
                {results.marketStructure === 'Contango'
                  ? 'Contango (正向升水)'
                  : results.marketStructure === 'Backwardation'
                  ? 'Backwardation (反向贴水)'
                  : '平水结构 (Flat)'}
              </span>
            </div>
          </div>
        </div>

        {/* Near & Far Basis Detailed Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">近月基差 (现货 - {inputs.nearContract})</div>
              <div
                className={`text-lg font-bold font-mono mt-0.5 ${
                  results.nearBasis >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {results.nearBasis > 0 ? `+${results.nearBasis}` : results.nearBasis} 元/吨
              </div>
            </div>
            <div className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 font-medium">
              {results.nearBasis >= 0 ? '现货升水' : '现货贴水'}
            </div>
          </div>

          <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">远月基差 (现货 - {inputs.farContract})</div>
              <div
                className={`text-lg font-bold font-mono mt-0.5 ${
                  results.farBasis >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {results.farBasis > 0 ? `+${results.farBasis}` : results.farBasis} 元/吨
              </div>
            </div>
            <div className="text-xs px-2 py-0.5 rounded bg-slate-700/60 text-slate-300 font-medium">
              {results.farBasis >= 0 ? '现货升水' : '现货贴水'}
            </div>
          </div>
        </div>

        {/* Visual Price Comparison Bars */}
        <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
              <span>现货与近远月价格阶梯对比 (Price Curve)</span>
            </span>
          </div>

          <div className="space-y-2 pt-2">
            {/* Spot Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">现货：{inputs.spotName}</span>
                <span className="font-bold text-white">¥{inputs.spotPrice}</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercent(inputs.spotPrice)}%` }}
                />
              </div>
            </div>

            {/* Near Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">近月合约：{inputs.nearContract}</span>
                <span className="font-bold text-white">¥{inputs.nearPrice}</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercent(inputs.nearPrice)}%` }}
                />
              </div>
            </div>

            {/* Far Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-mono">
                <span className="text-slate-300">远月合约：{inputs.farContract}</span>
                <span className="font-bold text-white">¥{inputs.farPrice}</span>
              </div>
              <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full transition-all duration-300"
                  style={{ width: `${getPercent(inputs.farPrice)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Professional Commentary */}
        <div className="p-4 bg-gradient-to-br from-slate-800 to-slate-900 border border-blue-900/50 rounded-2xl text-xs space-y-2">
          <div className="font-bold text-blue-300 flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-blue-400" />
            <span>投研策略与盘面诊断</span>
          </div>
          <p className="text-slate-300 leading-relaxed text-xs">{results.commentary}</p>
        </div>
      </div>
    </div>
  );
};
