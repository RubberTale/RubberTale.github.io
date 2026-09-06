export type RubberVariety = 'RU' | 'NR' | 'BR';

export interface VarietyConfig {
  id: RubberVariety;
  name: string;
  fullName: string;
  exchange: string;
  multiplier: number; // 吨/手
  tickSize: number; // 最小变动价位 元/吨
  defaultSpotName: string;
  defaultSpotPrice: number;
  defaultNearContract: string;
  defaultNearPrice: number;
  defaultFarContract: string;
  defaultFarPrice: number;
  defaultStorageFee: number; // 元/吨/天
}

export type CalcMode = 'spread' | 'delivery';

export interface SpreadInputs {
  variety: RubberVariety;
  spotPrice: number;
  spotName: string;
  nearContract: string;
  nearPrice: number;
  farContract: string;
  farPrice: number;
  daysDiff: number;
}

export interface DeliveryInputs {
  variety: RubberVariety;
  spotBuyPrice: number;
  futuresSellPrice: number;
  holdingDays: number;
  annualInterestRate: number; // %
  storageFeePerDay: number; // 元/吨/天
  inspectionFee: number; // 质检费 元/吨
  inOutFee: number; // 出入库杂费 元/吨
  commissionFee: number; // 交割手续费 元/吨
  vatAdjustment: number; // 增值税发票差额 元/吨
  positionLots: number; // 测算开仓手数
}

export interface SpreadResults {
  nearBasis: number; // 现货 - 近月
  farBasis: number; // 现货 - 远月
  calendarSpread: number; // 远月 - 近月
  spreadPercentage: number; // 价差比例 %
  annualizedSpreadRate: number; // 年化升贴水率 %
  marketStructure: 'Contango' | 'Backwardation' | 'Flat';
  commentary: string;
}

export interface DeliveryResults {
  financingCost: number;
  storageCost: number;
  miscCost: number;
  totalCarryCost: number;
  breakevenFuturesPrice: number;
  netProfitPerTon: number;
  totalNetProfit: number;
  capitalRequired: number;
  netProfitMargin: number; // %
  annualizedIRR: number; // %
  signal: 'STRONG_PROFIT' | 'FAIR_ZONE' | 'DEEP_DISCOUNT';
  recommendation: string;
}
