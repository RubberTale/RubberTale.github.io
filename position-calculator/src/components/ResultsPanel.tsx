import React, { useState } from 'react';
import { PositionInputs, CalculationResults, CalcTab, VarietyPreset } from '../types';
import {
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  Flame,
  Scale,
  Copy,
  Check,
  Percent,
  Sliders,
  AlertOctagon,
} from 'lucide-react';

interface ResultsPanelProps {
  inputs: PositionInputs;
  results: CalculationResults;
  activeTab: CalcTab;
  preset: VarietyPreset;
}

export const ResultsPanel: React.FC<ResultsPanelProps> = ({
  inputs,
  results,
  activeTab,
  preset,
}) => {
  const [copied, setCopied] = useState(false);

  // Consecutive losses calculation
  const lossPerTrade = results.fixedRiskLots * results.riskPerLot;
  const equityAfter3Losses = Math.max(0, inputs.accountEquity - lossPerTrade * 3);
  const equityAfter5Losses = Math.max(0, inputs.accountEquity - lossPerTrade * 5);

  const handleCopyPlan = () => {
    const isLong = inputs.direction === 'LONG';
    const text = `【${preset.name} 交易计划与风控测算表】
- 开仓方向：${isLong ? '买入做多 (LONG)' : '卖出做空 (SHORT)'}
- 入场价：¥${inputs.entryPrice} | 止损价：¥${inputs.stopLossPrice} | 目标止盈：¥${inputs.takeProfitPrice}
- 盈亏比 (R:R)：${results.riskRewardRatio.toFixed(2)} : 1 (理论保本胜率：${results.breakevenWinRate.toFixed(1)}%)
- 账户总资金：¥${inputs.accountEquity.toLocaleString()} | 单笔风险额度：${inputs.maxRiskPercent}% (¥${results.maxAllowedLoss.toLocaleString()})
----------------------------------------
★ 建议开仓手数：${results.fixedRiskLots} 手 (共 ${results.fixedRiskLots * inputs.multiplier} 吨)
★ 保证金占用：¥${results.fixedRiskMarginUsed.toLocaleString()} (${results.fixedRiskMarginRatio.toFixed(1)}% 资金占比)
★ 真实持仓杠杆：${results.leverageRatio.toFixed(2)} 倍
★ 凯利仓位参考：半凯利推荐 ${results.halfKellyLots} 手 | 1/4 凯利防守 ${results.quarterKellyLots} 手
★ 触及止盈预期收益：+¥${(results.fixedRiskLots * results.rewardPerLot).toLocaleString()} 元
★ 触及止损预期亏损：-¥${lossPerTrade.toLocaleString()} 元
★ 综合诊断：${results.diagnosis}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Risk Reward Ratio Banner */}
      <div
        className={`p-5 rounded-2xl border shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
          results.tradeQuality === 'EXCELLENT'
            ? 'bg-gradient-to-r from-emerald-950/90 to-slate-900 border-emerald-700/80'
            : results.tradeQuality === 'GOOD'
            ? 'bg-gradient-to-r from-blue-950/90 to-slate-900 border-blue-700/80'
            : results.tradeQuality === 'POOR'
            ? 'bg-gradient-to-r from-amber-950/90 to-slate-900 border-amber-700/80'
            : 'bg-gradient-to-r from-rose-950/90 to-slate-900 border-rose-700/80'
        }`}
      >
        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium">策略核心风险报酬比 (R:R Ratio)</div>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-4xl font-black font-mono tracking-tight ${
                results.riskRewardRatio >= 2.5
                  ? 'text-emerald-400'
                  : results.riskRewardRatio >= 1.8
                  ? 'text-blue-400'
                  : 'text-amber-400'
              }`}
            >
              {results.riskRewardRatio.toFixed(2)} : 1
            </span>
            <span className="text-xs text-slate-300 font-semibold px-2 py-0.5 rounded-full bg-white/10">
              保本胜率只需 {results.breakevenWinRate.toFixed(1)}%
            </span>
          </div>
          <p className="text-xs text-slate-300 opacity-90 max-w-xl">{results.diagnosis}</p>
        </div>

        <div className="shrink-0 flex sm:flex-col items-center sm:items-end gap-2 text-right">
          <div className="text-[11px] text-slate-400">单吨数学期望 (EV)</div>
          <div
            className={`text-lg font-mono font-bold ${
              results.expectedValuePerTon >= 0 ? 'text-emerald-400' : 'text-rose-400'
            }`}
          >
            {results.expectedValuePerTon >= 0 ? '+' : ''}¥{results.expectedValuePerTon.toFixed(1)} 元
          </div>
        </div>
      </div>

      {/* Basic Sizing Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 mb-1">建议开仓手数</div>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black font-mono text-white">{results.fixedRiskLots}</span>
            <span className="text-xs text-slate-400">手</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            = {results.fixedRiskLots * inputs.multiplier} 吨
          </div>
        </div>

        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 mb-1">单手止损亏损</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-rose-400">
              -¥{results.riskPerLot.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">单吨风险 {results.riskPerTon} 点</div>
        </div>

        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 mb-1">单手目标盈利</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-emerald-400">
              +¥{results.rewardPerLot.toLocaleString()}
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">单吨盈利 {results.rewardPerTon} 点</div>
        </div>

        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 mb-1">保证金占用</div>
          <div className="flex items-baseline gap-1">
            <span className="text-xl font-bold font-mono text-blue-400">
              {results.fixedRiskMarginRatio.toFixed(1)}%
            </span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1 font-mono">
            约 ¥{(results.fixedRiskMarginUsed / 1000).toFixed(1)}k
          </div>
        </div>
      </div>

      {/* Detailed Sizing Comparison: Fixed Risk vs Kelly */}
      <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
          <div className="font-bold text-xs text-slate-200 flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-400" />
            <span>专业资金管理模型仓位对比</span>
          </div>
          <span className="text-xs text-slate-400">账户规模 ¥{inputs.accountEquity.toLocaleString()}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Fixed Fractional Sizing */}
          <div className="p-3.5 rounded-xl border border-blue-500/40 bg-blue-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-300">固定比例风险法</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300">
                主观常用
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-white">
              {results.fixedRiskLots} <span className="text-xs font-normal text-slate-400">手</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              单笔亏损严格控制在资金的 {inputs.maxRiskPercent}% (¥{results.maxAllowedLoss.toLocaleString()}) 以内。
            </p>
          </div>

          {/* Half Kelly */}
          <div className="p-3.5 rounded-xl border border-emerald-500/40 bg-emerald-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-300">半凯利公式 (Half Kelly)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                量化推荐
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-white">
              {results.halfKellyLots} <span className="text-xs font-normal text-slate-400">手</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              华尔街量化对冲基金标配，在最大几何增长率与波动率之间取得最佳均衡。
            </p>
          </div>

          {/* Quarter Kelly */}
          <div className="p-3.5 rounded-xl border border-indigo-500/40 bg-indigo-950/20 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-300">1/4 凯利 (防守型)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300">
                防爆仓
              </span>
            </div>
            <div className="text-2xl font-mono font-black text-white">
              {results.quarterKellyLots} <span className="text-xs font-normal text-slate-400">手</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-tight">
              极度防守风格，平滑资金收益回撤曲线，适合初学者或高波动品种。
            </p>
          </div>
        </div>
      </div>

      {/* Advanced Tab: Stress Test & ATR Volatility Check */}
      {activeTab === 'advanced' && (
        <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl space-y-4 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-700/60 pb-2.5">
            <div className="font-bold text-xs text-indigo-300 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-400" />
              <span>极端连续亏损压力测试 (Stress Test)</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">
              杠杆率：{results.leverageRatio.toFixed(2)}x
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl space-y-1">
              <div className="text-slate-400">遭遇连续 3 次假突破触发止损</div>
              <div className="text-sm font-mono text-slate-200">
                累计亏损：<span className="text-rose-400">-¥{(lossPerTrade * 3).toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                账户剩余净值：¥{equityAfter3Losses.toLocaleString()} (回撤{' '}
                {((lossPerTrade * 3) / inputs.accountEquity * 100).toFixed(1)}%)
              </div>
            </div>

            <div className="p-3 bg-slate-900/60 border border-slate-700/60 rounded-xl space-y-1">
              <div className="text-slate-400">遭遇连续 5 次假突破极端行情</div>
              <div className="text-sm font-mono text-slate-200">
                累计亏损：<span className="text-rose-400">-¥{(lossPerTrade * 5).toLocaleString()}</span>
              </div>
              <div className="text-[11px] text-slate-400">
                账户剩余净值：¥{equityAfter5Losses.toLocaleString()} (回撤{' '}
                {((lossPerTrade * 5) / inputs.accountEquity * 100).toFixed(1)}%)
              </div>
            </div>
          </div>

          {/* ATR Check */}
          {inputs.atrValue > 0 && (
            <div className="p-3.5 bg-slate-900/80 border border-slate-700/80 rounded-xl space-y-1 text-xs">
              <div className="font-semibold text-slate-200">ATR 波动率安全度验证：</div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                当前止损点数 ({results.riskPerTon} 点) 相当于{' '}
                <strong className="text-blue-400">{results.atrMultiple.toFixed(2)} 倍 ATR</strong>
                。
                {results.atrMultiple < 1.0 ? (
                  <span className="text-amber-400 ml-1">
                    ⚠️ 止损距离小于 1 个日线 ATR，极容易被日内正常噪音打穿，建议适当拉开止损或缩小仓位！
                  </span>
                ) : (
                  <span className="text-emerald-400 ml-1">
                    ✅ 止损距离充分超越了日内噪音波动区间，具备良好的抗洗盘能力。
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Copy Plan Bar */}
      <div className="flex items-center justify-end">
        <button
          type="button"
          onClick={handleCopyPlan}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 hover:text-white rounded-xl flex items-center gap-2 transition-colors shadow-xs"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>交易计划已复制</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>一键复制入场与风控测算计划</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
