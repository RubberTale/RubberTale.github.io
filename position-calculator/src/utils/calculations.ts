import { PositionInputs, CalculationResults } from '../types';

export function calculatePosition(inputs: PositionInputs): CalculationResults {
  const isLong = inputs.direction === 'LONG';

  // 止损与止盈点数计算
  const riskPerTon = isLong
    ? Math.max(1, inputs.entryPrice - inputs.stopLossPrice)
    : Math.max(1, inputs.stopLossPrice - inputs.entryPrice);

  const rewardPerTon = isLong
    ? Math.max(1, inputs.takeProfitPrice - inputs.entryPrice)
    : Math.max(1, inputs.entryPrice - inputs.takeProfitPrice);

  const riskRewardRatio = rewardPerTon / riskPerTon;
  const breakevenWinRate = (1 / (1 + riskRewardRatio)) * 100;

  const p = inputs.winRate / 100;
  const q = 1 - p;
  const expectedValuePerTon = p * rewardPerTon - q * riskPerTon;

  const riskPerLot = riskPerTon * inputs.multiplier;
  const rewardPerLot = rewardPerTon * inputs.multiplier;
  const marginPerLot = inputs.entryPrice * inputs.multiplier * (inputs.marginRate / 100);

  // 1. 固定风险模型
  const maxAllowedLoss = inputs.accountEquity * (inputs.maxRiskPercent / 100);
  const fixedRiskLots = riskPerLot > 0 ? Math.max(0, Math.floor(maxAllowedLoss / riskPerLot)) : 0;
  const fixedRiskMarginUsed = fixedRiskLots * marginPerLot;
  const fixedRiskMarginRatio =
    inputs.accountEquity > 0 ? (fixedRiskMarginUsed / inputs.accountEquity) * 100 : 0;
  const leverageRatio =
    inputs.accountEquity > 0
      ? (fixedRiskLots * inputs.entryPrice * inputs.multiplier) / inputs.accountEquity
      : 0;

  // 2. 凯利公式模型: f* = (b*p - q) / b
  const rawKellyFraction = riskRewardRatio > 0 ? (riskRewardRatio * p - q) / riskRewardRatio : 0;

  // 考虑期货保证金限制，单笔保证金占用不超过总资金 65% 作为硬风控红线
  const maxMarginLots = marginPerLot > 0 ? Math.floor((inputs.accountEquity * 0.65) / marginPerLot) : 0;

  let fullKellyLots = 0;
  let halfKellyLots = 0;
  let quarterKellyLots = 0;

  if (rawKellyFraction > 0 && riskPerLot > 0) {
    const rawLots = Math.floor((inputs.accountEquity * rawKellyFraction) / riskPerLot);
    fullKellyLots = Math.min(maxMarginLots, Math.max(1, rawLots));
    halfKellyLots = Math.min(maxMarginLots, Math.max(1, Math.floor(fullKellyLots * 0.5)));
    quarterKellyLots = Math.min(maxMarginLots, Math.max(1, Math.floor(fullKellyLots * 0.25)));
  }

  // 3. ATR 波动率模型
  const atrMultiple = inputs.atrValue > 0 ? riskPerTon / inputs.atrValue : 1;
  const atrRiskPerLot = inputs.atrValue > 0 ? inputs.atrValue * 2 * inputs.multiplier : riskPerLot;
  const atrSuggestedLots =
    atrRiskPerLot > 0 ? Math.min(maxMarginLots, Math.max(0, Math.floor(maxAllowedLoss / atrRiskPerLot))) : 0;

  // 综合交易质量诊断
  let tradeQuality: 'EXCELLENT' | 'GOOD' | 'POOR' | 'UNACCEPTABLE' = 'GOOD';
  let diagnosis = '';

  if (expectedValuePerTon <= 0) {
    tradeQuality = 'UNACCEPTABLE';
    diagnosis = `⚠️【负期望交易，建议放弃】在当前胜率 (${inputs.winRate}%) 与盈亏比 (${riskRewardRatio.toFixed(
      2
    )}:1) 下，单吨数学期望为 -¥${Math.abs(expectedValuePerTon).toFixed(
      1
    )}。长期执行此策略账户资金将必然缩水，不建议入场！`;
  } else if (riskRewardRatio >= 3.0 && inputs.winRate >= 40) {
    tradeQuality = 'EXCELLENT';
    diagnosis = `💎【极佳高性价比交易】盈亏比高达 ${riskRewardRatio.toFixed(
      2
    )}:1，理论保本胜率只需 ${breakevenWinRate.toFixed(1)}%。单吨正向数学期望 +¥${expectedValuePerTon.toFixed(
      1
    )}，具备丰厚的收益回撤比空间，严格执行止损即可。`;
  } else if (riskRewardRatio >= 1.8) {
    tradeQuality = 'GOOD';
    diagnosis = `✅【合格的趋势/波段交易】盈亏比达到 ${riskRewardRatio.toFixed(
      2
    )}:1，保本胜率要求为 ${breakevenWinRate.toFixed(1)}%。建议采取固定风险模型 (单笔风险 ${
      inputs.maxRiskPercent
    }%) 开仓 ${fixedRiskLots} 手，或稳健型半凯利仓位开仓 ${halfKellyLots} 手。`;
  } else {
    tradeQuality = 'POOR';
    diagnosis = `⚡【低盈亏比预警】盈亏比仅为 ${riskRewardRatio.toFixed(
      2
    )}:1，需要达到 ${breakevenWinRate.toFixed(
      1
    )}% 以上的高胜率才能实现不亏损。容错率低，容易因连续假突破而吞噬利润，建议寻找更优入场点以缩短止损距离。`;
  }

  return {
    riskPerTon,
    rewardPerTon,
    riskRewardRatio,
    breakevenWinRate,
    expectedValuePerTon,
    riskPerLot,
    rewardPerLot,
    marginPerLot,
    maxAllowedLoss,
    fixedRiskLots,
    fixedRiskMarginUsed,
    fixedRiskMarginRatio,
    leverageRatio,
    rawKellyFraction,
    fullKellyLots,
    halfKellyLots,
    quarterKellyLots,
    atrMultiple,
    atrSuggestedLots,
    tradeQuality,
    diagnosis,
  };
}
