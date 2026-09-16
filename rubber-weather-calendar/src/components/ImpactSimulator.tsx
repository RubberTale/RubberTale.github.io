import React, { useState } from 'react';
import { Sliders, AlertOctagon, TrendingUp, ShieldCheck, Flame, Info } from 'lucide-react';
import { SimulatorState } from '../types';

export const ImpactSimulator: React.FC = () => {
  const [state, setState] = useState<SimulatorState>({
    monthlyRainDays: 8,
    heavyRainDays: 3,
    diseaseLevel: 'NONE',
  });

  // Calculation:
  // Normal month has around 22-25 tapping days in peak season.
  const baselineDays = 22;
  const lostDays = state.monthlyRainDays * 0.6 + state.heavyRainDays * 0.8;
  const effectiveDays = Math.max(2, Math.round(baselineDays - lostDays));
  const operatingRate = Math.min(100, Math.max(10, Math.round((effectiveDays / baselineDays) * 100)));

  // Disease penalty
  const diseasePenalty = state.diseaseLevel === 'SEVERE' ? 15 : state.diseaseLevel === 'LIGHT' ? 5 : 0;
  const totalProductionImpact = Math.min(65, Math.round((100 - operatingRate) * 0.8 + diseasePenalty));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Form: Sliders (5 cols) */}
      <div className="lg:col-span-5 p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl space-y-5">
        <div className="border-b border-slate-700/60 pb-3">
          <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <span>产区天气与病害情景推演设置</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            动态模拟当月降雨受阻天数及落叶病害对全月产出的折损幅度。
          </p>
        </div>

        {/* Rain Days Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">月度小/中雨受阻天数 (≥5mm)</span>
            <span className="font-mono text-emerald-400 font-bold">{state.monthlyRainDays} 天/月</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={state.monthlyRainDays}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                monthlyRainDays: parseInt(e.target.value) || 0,
                heavyRainDays: Math.min(s.heavyRainDays, parseInt(e.target.value) || 0),
              }))
            }
            className="w-full accent-emerald-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0天 (持续干旱)</span>
            <span>8天 (常年月均)</span>
            <span>25天 (极端多雨)</span>
          </div>
        </div>

        {/* Heavy Rain / Storm Days Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">其中连续大雨/台风停割天数 (≥15mm)</span>
            <span className="font-mono text-rose-400 font-bold">{state.heavyRainDays} 天/月</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={state.heavyRainDays}
            onChange={(e) =>
              setState((s) => ({
                ...s,
                heavyRainDays: Math.min(s.monthlyRainDays, parseInt(e.target.value) || 0),
              }))
            }
            className="w-full accent-rose-500 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>0天 (无极端暴雨)</span>
            <span>3天 (轻微台风)</span>
            <span>12天 (严重洪涝灾害)</span>
          </div>
        </div>

        {/* Leaf Fall / Disease */}
        <div className="space-y-2 pt-1 border-t border-slate-700/60">
          <label className="text-xs font-semibold text-slate-300">白粉病 / 炭疽病落叶灾害等级</label>
          <div className="grid grid-cols-3 gap-2 text-xs">
            {[
              { id: 'NONE', label: '正常无病害' },
              { id: 'LIGHT', label: '局部轻度散发 (-5%)' },
              { id: 'SEVERE', label: '重度落叶病 (-15%)' },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setState((s) => ({ ...s, diseaseLevel: item.id as any }))}
                className={`py-2 px-2 rounded-xl text-center font-medium border transition-colors ${
                  state.diseaseLevel === item.id
                    ? 'bg-emerald-600 border-emerald-500 text-white shadow-sm'
                    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Output: Impact Evaluation (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Core Impact Indicator */}
        <div
          className={`p-5 rounded-2xl border shadow-xl ${
            totalProductionImpact >= 25
              ? 'bg-gradient-to-r from-rose-950/90 to-slate-900 border-rose-700/80'
              : totalProductionImpact >= 12
              ? 'bg-gradient-to-r from-amber-950/90 to-slate-900 border-amber-700/80'
              : 'bg-gradient-to-r from-emerald-950/90 to-slate-900 border-emerald-700/80'
          }`}
        >
          <div className="text-xs text-slate-400 font-medium mb-1">推演结论：当月产出预期偏差</div>
          <div className="flex items-baseline gap-3">
            <span
              className={`text-4xl font-black font-mono tracking-tight ${
                totalProductionImpact >= 25
                  ? 'text-rose-400'
                  : totalProductionImpact >= 12
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              -{totalProductionImpact}%
            </span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/10 text-slate-200">
              {totalProductionImpact >= 25
                ? '严重减产，供需平衡表趋紧'
                : totalProductionImpact >= 12
                ? '局部供求扰动，支撑现货升水'
                : '产出总体平稳，季节性供给充沛'}
            </span>
          </div>
          <p className="text-xs text-slate-300 mt-2 leading-relaxed">
            {totalProductionImpact >= 25
              ? '【极端天气冲击情景】：连续暴雨侵袭叠加密集停割，将显著打乱加工厂原料到货节奏，推高原料胶水收购升水，利好期货近月合约及正向套利头寸。'
              : totalProductionImpact >= 12
              ? '【常态降水扰动情景】：晨间割胶受阻主要引发阶段性雨冲胶，导致短期入库节奏推迟，但中长期对全年度总供应量的实质削减相对可控。'
              : '【气候平顺丰产情景】：气温与水热条件理想，单树胶水产量与干含维持高位，加工厂开工率饱满，压制原料上行弹性。'}
          </p>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 mb-1">有效割胶天数</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono text-white">{effectiveDays}</span>
              <span className="text-xs text-slate-400">/ 22天</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">因雨损失约 {lostDays.toFixed(1)} 天</div>
          </div>

          <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 mb-1">胶园综合开工率</div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black font-mono text-blue-400">{operatingRate}%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">较满负荷下降 {100 - operatingRate}%</div>
          </div>

          <div className="col-span-2 sm:col-span-1 p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 mb-1">盘面情绪溢价倾向</div>
            <div className="my-1">
              <span
                className={`inline-block px-2.5 py-1 rounded-lg text-xs font-bold ${
                  totalProductionImpact >= 25
                    ? 'bg-rose-950 text-rose-300 border border-rose-700'
                    : totalProductionImpact >= 12
                    ? 'bg-amber-950 text-amber-300 border border-amber-700'
                    : 'bg-emerald-950 text-emerald-300 border border-emerald-700'
                }`}
              >
                {totalProductionImpact >= 25
                  ? '强烈做多情绪 (+200~400点)'
                  : totalProductionImpact >= 12
                  ? '温和抗跌支撑 (+50~150点)'
                  : '中性/承压波动'}
              </span>
            </div>
          </div>
        </div>

        {/* Historical Analogy */}
        <div className="p-4 bg-slate-800/60 border border-slate-700/60 rounded-xl text-xs text-slate-300 space-y-1.5">
          <div className="font-bold text-slate-100 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>历史行情复盘对照：</span>
          </div>
          <p className="leading-relaxed text-[11px]">
            回顾 2020 年 10 月海南热带低压及 2023 年 11 月泰国南部极端暴雨事件，当月有效割胶天数均跌破 12 天，直接诱发盘面一波 800-1200 点级别的天气题材溢价交易。
          </p>
        </div>
      </div>
    </div>
  );
};
