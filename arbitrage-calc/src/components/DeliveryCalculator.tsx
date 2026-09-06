import React, { useState } from 'react';
import { DeliveryInputs, DeliveryResults, VarietyConfig } from '../types';
import { Layers, ShieldCheck, AlertOctagon, CheckCircle2, Copy, Check, Info, DollarSign } from 'lucide-react';

interface DeliveryCalculatorProps {
  config: VarietyConfig;
  inputs: DeliveryInputs;
  onChange: (inputs: DeliveryInputs) => void;
  results: DeliveryResults;
}

export const DeliveryCalculator: React.FC<DeliveryCalculatorProps> = ({
  config,
  inputs,
  onChange,
  results,
}) => {
  const [copied, setCopied] = useState(false);

  const update = (field: keyof DeliveryInputs, val: any) => {
    onChange({ ...inputs, [field]: val });
  };

  const handleCopyReport = () => {
    const totalTons = inputs.positionLots * config.multiplier;
    const reportText = `【${config.name} 期现全持有成本交割套利测算】
- 现货采购价：¥${inputs.spotBuyPrice} 元/吨
- 期货交割卖价：¥${inputs.futuresSellPrice} 元/吨
- 持有期限：${inputs.holdingDays} 天 | 开仓规模：${inputs.positionLots} 手 (${totalTons} 吨)
- 资金占用利息：¥${results.financingCost.toFixed(1)} 元/吨 (年化 ${inputs.annualInterestRate}%)
- 仓储累计费用：¥${results.storageCost.toFixed(1)} 元/吨 (${inputs.storageFeePerDay} 元/吨/天)
- 质检与杂费：¥${results.miscCost.toFixed(1)} 元/吨
- 理论全交割成本：¥${results.totalCarryCost.toFixed(1)} 元/吨
- 无套利保本期货线：¥${results.breakevenFuturesPrice.toFixed(1)} 元/吨
----------------------------------------
★ 单吨净套利利润：${results.netProfitPerTon >= 0 ? '+' : ''}${results.netProfitPerTon.toFixed(1)} 元/吨
★ 总净利润测算：${results.totalNetProfit >= 0 ? '+' : ''}¥${results.totalNetProfit.toLocaleString()} 元
★ 年化无风险收益率 (IRR)：${results.annualizedIRR.toFixed(1)}%
★ 决策建议：${results.recommendation}`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left Column: Cost Inputs (5 cols) */}
      <div className="lg:col-span-5 space-y-4">
        <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl space-y-4 shadow-xl">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-3">
            <h2 className="font-bold text-sm text-slate-100 flex items-center gap-2">
              <span className="w-2 h-4 rounded-full bg-emerald-500" />
              <span>期现套利与交割参数设置</span>
            </h2>
            <span className="text-xs text-emerald-400 font-mono">
              {config.id} · {config.multiplier}吨/手
            </span>
          </div>

          {/* Spot Purchase Price & Futures Sell Price */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">现货采购价 (元/吨)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">¥</span>
                <input
                  type="number"
                  step="10"
                  value={inputs.spotBuyPrice || ''}
                  onChange={(e) => update('spotBuyPrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-7 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">期货锁定卖价 (元/吨)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs font-mono">¥</span>
                <input
                  type="number"
                  step="5"
                  value={inputs.futuresSellPrice || ''}
                  onChange={(e) => update('futuresSellPrice', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-7 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Holding Days & Position Lots */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">持仓交割周期 (天)</label>
              <input
                type="number"
                min="1"
                max="365"
                value={inputs.holdingDays || ''}
                onChange={(e) => update('holdingDays', parseInt(e.target.value) || 1)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">测算规模 (开仓手数)</label>
              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={inputs.positionLots || ''}
                  onChange={(e) => update('positionLots', parseInt(e.target.value) || 1)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <span className="absolute right-3 top-2.5 text-slate-400 text-xs font-mono">
                  = {inputs.positionLots * config.multiplier} 吨
                </span>
              </div>
            </div>
          </div>

          {/* Holding Cost Details Accordion / Subfields */}
          <div className="pt-2 border-t border-slate-700/60 space-y-3">
            <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>持有及交割全成本拆解参数</span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400">资金年化利息率 (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.annualInterestRate || ''}
                  onChange={(e) => update('annualInterestRate', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">仓单仓储费 (元/吨/天)</label>
                <input
                  type="number"
                  step="0.1"
                  value={inputs.storageFeePerDay || ''}
                  onChange={(e) => update('storageFeePerDay', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">质检化验费 (元/吨)</label>
                <input
                  type="number"
                  step="1"
                  value={inputs.inspectionFee || ''}
                  onChange={(e) => update('inspectionFee', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">出入库/装卸杂费 (元/吨)</label>
                <input
                  type="number"
                  step="1"
                  value={inputs.inOutFee || ''}
                  onChange={(e) => update('inOutFee', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">交割及交易手续费 (元/吨)</label>
                <input
                  type="number"
                  step="1"
                  value={inputs.commissionFee || ''}
                  onChange={(e) => update('commissionFee', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400">增值税/贴水发票调整 (元/吨)</label>
                <input
                  type="number"
                  step="5"
                  value={inputs.vatAdjustment || ''}
                  onChange={(e) => update('vatAdjustment', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 font-mono text-white text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Output Metrics & Analysis (7 cols) */}
      <div className="lg:col-span-7 space-y-4">
        {/* Signal Banner */}
        <div
          className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-lg ${
            results.signal === 'STRONG_PROFIT'
              ? 'bg-emerald-950/80 border-emerald-700/80 text-emerald-200'
              : results.signal === 'FAIR_ZONE'
              ? 'bg-blue-950/80 border-blue-700/80 text-blue-200'
              : 'bg-rose-950/80 border-rose-700/80 text-rose-200'
          }`}
        >
          {results.signal === 'STRONG_PROFIT' ? (
            <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          ) : results.signal === 'FAIR_ZONE' ? (
            <CheckCircle2 className="w-6 h-6 text-blue-400 shrink-0 mt-0.5" />
          ) : (
            <AlertOctagon className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1 text-xs">
            <div className="font-bold text-sm tracking-tight text-white">
              {results.signal === 'STRONG_PROFIT'
                ? '无风险套利窗口打开 (建议执行买现抛期)'
                : results.signal === 'FAIR_ZONE'
                ? '处于无套利均衡区间 (微利/安全垫不足)'
                : '反向挤仓或现货溢价 (不宜进行正向交割套利)'}
            </div>
            <p className="leading-relaxed opacity-90">{results.recommendation}</p>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Net Profit per Ton */}
          <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 mb-1">单吨净套利利润</div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  results.netProfitPerTon >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {results.netProfitPerTon > 0 ? `+${results.netProfitPerTon.toFixed(1)}` : results.netProfitPerTon.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-mono">元/吨</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              净利润率：{results.netProfitMargin.toFixed(2)}%
            </div>
          </div>

          {/* Annualized IRR */}
          <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 mb-1">年化套利收益率 (IRR)</div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  results.annualizedIRR >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {results.annualizedIRR > 0 ? `+${results.annualizedIRR.toFixed(1)}` : results.annualizedIRR.toFixed(1)}
              </span>
              <span className="text-xs text-slate-400 font-mono">%</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              基于 {inputs.holdingDays} 天无风险锁定
            </div>
          </div>

          {/* Total Net Profit */}
          <div className="col-span-2 sm:col-span-1 p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
            <div className="text-xs text-slate-400 mb-1">
              总净利润 ({inputs.positionLots}手 / {inputs.positionLots * config.multiplier}吨)
            </div>
            <div className="flex items-baseline gap-1">
              <span
                className={`text-2xl font-black font-mono tracking-tight ${
                  results.totalNetProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {results.totalNetProfit >= 0 ? `+¥${results.totalNetProfit.toLocaleString()}` : `-¥${Math.abs(results.totalNetProfit).toLocaleString()}`}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 font-mono">
              需资金：约 ¥{(results.capitalRequired / 10000).toFixed(1)} 万元
            </div>
          </div>
        </div>

        {/* Detailed Cost Breakdown Table */}
        <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2">
            <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-400" />
              <span>单吨交割持有全成本拆解 (Carry Cost Breakdown)</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              保本线：¥{results.breakevenFuturesPrice.toFixed(1)} 元
            </span>
          </div>

          <div className="divide-y divide-slate-700/40 text-xs">
            <div className="py-2 flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                资金占用利息成本 ({inputs.annualInterestRate}% 年化 / {inputs.holdingDays}天)
              </span>
              <span className="font-mono text-slate-200">¥{results.financingCost.toFixed(1)} 元/吨</span>
            </div>

            <div className="py-2 flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                仓单累计仓储费 ({inputs.storageFeePerDay} 元/天 × {inputs.holdingDays}天)
              </span>
              <span className="font-mono text-slate-200">¥{results.storageCost.toFixed(1)} 元/吨</span>
            </div>

            <div className="py-2 flex justify-between items-center text-slate-300">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400" />
                质检、出入库、交割手续费及税差
              </span>
              <span className="font-mono text-slate-200">¥{results.miscCost.toFixed(1)} 元/吨</span>
            </div>

            <div className="py-2.5 flex justify-between items-center font-bold text-emerald-300 bg-slate-900/40 px-2 rounded-lg mt-1">
              <span>合计持有全交割成本 (Total Carry)</span>
              <span className="font-mono text-sm">¥{results.totalCarryCost.toFixed(1)} 元/吨</span>
            </div>
          </div>
        </div>

        {/* Copy Report Action Bar */}
        <div className="flex items-center justify-end">
          <button
            type="button"
            onClick={handleCopyReport}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white rounded-xl flex items-center gap-2 transition-colors shadow-xs"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>测算简报已复制</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>一键复制投研套利测算简报</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
