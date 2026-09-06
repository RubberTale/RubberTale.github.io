import { VarietyPreset, VarietyId } from '../types';

export const VARIETY_PRESETS: Record<VarietyId, VarietyPreset> = {
  RU: {
    id: 'RU',
    name: '天然橡胶 (RU)',
    code: 'RU',
    multiplier: 10,
    tickSize: 5,
    defaultPrice: 15850,
    defaultMarginRate: 11, // 11% 保证金
  },
  NR: {
    id: 'NR',
    name: '20号胶 (NR)',
    code: 'NR',
    multiplier: 10,
    tickSize: 5,
    defaultPrice: 13450,
    defaultMarginRate: 10, // 10% 保证金
  },
  BR: {
    id: 'BR',
    name: '合成橡胶/顺丁 (BR)',
    code: 'BR',
    multiplier: 5,
    tickSize: 5,
    defaultPrice: 14500,
    defaultMarginRate: 12, // 12% 保证金
  },
  CUSTOM: {
    id: 'CUSTOM',
    name: '自定义期货品种',
    code: 'CUSTOM',
    multiplier: 10,
    tickSize: 1,
    defaultPrice: 10000,
    defaultMarginRate: 10,
  },
};

export const QUICK_TRADE_TEMPLATES = [
  {
    title: 'RU 橡胶逢低突破多头策略 (盈亏比 3:1)',
    variety: 'RU' as VarietyId,
    direction: 'LONG' as const,
    entryPrice: 15800,
    stopLossPrice: 15600, // 止损 200 点
    takeProfitPrice: 16400, // 止盈 600 点
    winRate: 45,
    atrValue: 180,
  },
  {
    title: 'NR 20号胶震荡区间高抛空头策略 (盈亏比 2.5:1)',
    variety: 'NR' as VarietyId,
    direction: 'SHORT' as const,
    entryPrice: 13600,
    stopLossPrice: 13750, // 止损 150 点
    takeProfitPrice: 13220, // 止盈 380 点
    winRate: 50,
    atrValue: 140,
  },
  {
    title: 'BR 顺丁原料反弹趋势顺势交易 (盈亏比 4:1)',
    variety: 'BR' as VarietyId,
    direction: 'LONG' as const,
    entryPrice: 14300,
    stopLossPrice: 14120, // 止损 180 点
    takeProfitPrice: 15020, // 止盈 720 点
    winRate: 40,
    atrValue: 160,
  },
];
