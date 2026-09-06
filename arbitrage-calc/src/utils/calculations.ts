import { SpreadInputs, SpreadResults, DeliveryInputs, DeliveryResults } from '../types';

export function calculateSpread(inputs: SpreadInputs): SpreadResults {
  const nearBasis = inputs.spotPrice - inputs.nearPrice;
  const farBasis = inputs.spotPrice - inputs.farPrice;
  const calendarSpread = inputs.farPrice - inputs.nearPrice;
  const spreadPercentage = inputs.nearPrice > 0 ? (calendarSpread / inputs.nearPrice) * 100 : 0;
  const annualizedSpreadRate =
    inputs.nearPrice > 0 && inputs.daysDiff > 0
      ? (calendarSpread / inputs.nearPrice) * (365 / inputs.daysDiff) * 100
      : 0;

  let marketStructure: 'Contango' | 'Backwardation' | 'Flat' = 'Flat';
  let commentary = '';

  if (calendarSpread > 30) {
    marketStructure = 'Contango';
    commentary = `当前呈现典型的【正向升水市场 (Contango)】结构，远月较近月升水 ${calendarSpread.toFixed(
      0
    )} 元/吨 (折合年化升水率 ${annualizedSpreadRate.toFixed(1)}%)。若跨期价差大于全持有成本，适合采用买近月抛远月 (正套) 或买现货抛盘面期现套利。`;
  } else if (calendarSpread < -30) {
    marketStructure = 'Backwardation';
    commentary = `当前呈现【反向贴水市场 (Backwardation)】结构，远月贴水 ${Math.abs(
      calendarSpread
    ).toFixed(
      0
    )} 元/吨。反映现货原料阶段性紧俏或近端需求偏强，远端预期悲观，正套空间收窄，需注意现货多头边际安全垫。`;
  } else {
    marketStructure = 'Flat';
    commentary = `近远月价差近乎平水（相差仅 ${calendarSpread.toFixed(
      0
    )} 元/吨），期限曲线结构平缓，基差与跨期套利无风险空间有限，建议关注产业供需驱动。`;
  }

  return {
    nearBasis,
    farBasis,
    calendarSpread,
    spreadPercentage,
    annualizedSpreadRate,
    marketStructure,
    commentary,
  };
}

export function calculateDelivery(inputs: DeliveryInputs, multiplier: number): DeliveryResults {
  const tons = Math.max(1, inputs.positionLots) * multiplier;
  const financingCost =
    inputs.spotBuyPrice * (inputs.annualInterestRate / 100) * (inputs.holdingDays / 365);
  const storageCost = inputs.storageFeePerDay * inputs.holdingDays;
  const miscCost =
    inputs.inspectionFee + inputs.inOutFee + inputs.commissionFee + inputs.vatAdjustment;
  const totalCarryCost = financingCost + storageCost + miscCost;

  const breakevenFuturesPrice = inputs.spotBuyPrice + totalCarryCost;
  const netProfitPerTon = inputs.futuresSellPrice - breakevenFuturesPrice;
  const totalNetProfit = netProfitPerTon * tons;
  const capitalRequired = (inputs.spotBuyPrice + totalCarryCost * 0.4) * tons;

  const netProfitMargin = inputs.spotBuyPrice > 0 ? (netProfitPerTon / inputs.spotBuyPrice) * 100 : 0;
  const annualizedIRR =
    inputs.spotBuyPrice > 0 && inputs.holdingDays > 0
      ? (netProfitPerTon / inputs.spotBuyPrice) * (365 / inputs.holdingDays) * 100
      : 0;

  let signal: 'STRONG_PROFIT' | 'FAIR_ZONE' | 'DEEP_DISCOUNT' = 'FAIR_ZONE';
  let recommendation = '';

  if (netProfitPerTon >= 150) {
    signal = 'STRONG_PROFIT';
    recommendation = `【强推荐套利】盘面升水充分覆盖了资金、仓储与交割杂费，单吨净无风险套利利润高达 ${netProfitPerTon.toFixed(
      1
    )} 元，折合年化内部回报率 (IRR) 达 ${annualizedIRR.toFixed(
      1
    )}%。满足“买现货入库注册标准仓单 + 卖出期货合约交割”的正套条件。`;
  } else if (netProfitPerTon >= 0) {
    signal = 'FAIR_ZONE';
    recommendation = `【无套利平衡区】盘面价格略高于持仓全成本，单吨理论微利 ${netProfitPerTon.toFixed(
      1
    )} 元 (年化 ${annualizedIRR.toFixed(
      1
    )}%)。受现货贴水质量、交割库库容紧张度及出入库排队摩擦影响，无风险套利安全边际一般，需谨慎参与。`;
  } else {
    signal = 'DEEP_DISCOUNT';
    recommendation = `【无正套利润】盘面价格低于理论交割全成本 ${Math.abs(
      netProfitPerTon
    ).toFixed(
      1
    )} 元/吨。此时买现货卖期货交割将发生亏损；若反向具备现货采购需求的企业，可考虑直接在盘面买入近月合约接单交割，成本优于现货市场。`;
  }

  return {
    financingCost,
    storageCost,
    miscCost,
    totalCarryCost,
    breakevenFuturesPrice,
    netProfitPerTon,
    totalNetProfit,
    capitalRequired,
    netProfitMargin,
    annualizedIRR,
    signal,
    recommendation,
  };
}
