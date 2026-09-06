export type VarietyId = 'RU' | 'NR' | 'BR' | 'CUSTOM';

export interface VarietyPreset {
  id: VarietyId;
  name: string;
  code: string;
  multiplier: number; // 吨/手
  tickSize: number; // 元/吨
  defaultPrice: number;
  defaultMarginRate: number; // %
}

export type TradeDirection = 'LONG' | 'SHORT';
export type CalcTab = 'basic' | 'advanced';

export interface PositionInputs {
  variety: VarietyId;
  multiplier: number;
  tickSize: number;
  marginRate: number; // %
  accountEquity: number; // 账户总资金 元
  maxRiskPercent: number; // 单笔最大风险容忍度 %
  direction: TradeDirection;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  winRate: number; // 预估胜率 % (30% - 70%)
  atrValue: number; // ATR 真实波动幅度
}

export interface CalculationResults {
  riskPerTon: number; // 单吨风险点数
  rewardPerTon: number; // 单吨盈利点数
  riskRewardRatio: number; // 盈亏比 (R:R)
  breakevenWinRate: number; // 理论保本胜率 %
  expectedValuePerTon: number; // 单吨数学期望收益 EV
  riskPerLot: number; // 单手最大亏损金额
  rewardPerLot: number; // 单手目标盈利金额
  marginPerLot: number; // 单手占用保证金

  // 固定风险比例模型
  maxAllowedLoss: number; // 允许最大亏损金额
  fixedRiskLots: number; // 建议开仓手数
  fixedRiskMarginUsed: number; // 占用保证金
  fixedRiskMarginRatio: number; // 保证金占比 %
  leverageRatio: number; // 真实持仓杠杆倍数

  // 凯利公式模型
  rawKellyFraction: number; // 凯利最优比例 (可为负)
  fullKellyLots: number; // 全凯利手数
  halfKellyLots: number; // 半凯利手数 (机构常用推荐)
  quarterKellyLots: number; // 1/4 凯利防爆仓手数

  // ATR 波动率仓位
  atrMultiple: number; // 止损距离相当于几个 ATR
  atrSuggestedLots: number; // 基于 2*ATR 建议手数

  // 综合评级
  tradeQuality: 'EXCELLENT' | 'GOOD' | 'POOR' | 'UNACCEPTABLE';
  diagnosis: string;
}
