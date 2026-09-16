import React, { useState, useEffect, useCallback } from 'react';
import { VarietyId, CalcTab, PositionInputs, LatestPricesPayload } from './types';
import { VARIETY_PRESETS, QUICK_TRADE_TEMPLATES } from './constants/varieties';
import { calculatePosition } from './utils/calculations';
import { fetchLatestPrices } from './utils/marketData';
import { Header } from './components/Header';
import { TradePlanForm } from './components/TradePlanForm';
import { ResultsPanel } from './components/ResultsPanel';

export const App: React.FC = () => {
  const [variety, setVariety] = useState<VarietyId>('RU');
  const [activeTab, setActiveTab] = useState<CalcTab>('basic');
  const [marketData, setMarketData] = useState<LatestPricesPayload | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const currentPreset = VARIETY_PRESETS[variety];

  const [inputs, setInputs] = useState<PositionInputs>({
    variety: 'RU',
    multiplier: currentPreset.multiplier,
    tickSize: currentPreset.tickSize,
    marginRate: currentPreset.defaultMarginRate,
    accountEquity: 200000, // 20万资金
    maxRiskPercent: 2, // 2% 风险
    direction: 'LONG',
    entryPrice: currentPreset.defaultPrice,
    stopLossPrice: currentPreset.defaultPrice - 200,
    takeProfitPrice: currentPreset.defaultPrice + 600,
    winRate: 45, // 45% 胜率
    atrValue: 180,
  });

  const applyMarketPriceToInputs = useCallback((data: LatestPricesPayload, v: VarietyId) => {
    if (v === 'CUSTOM') return;
    const vData = data.varieties[v];
    if (vData && vData.nearPrice) {
      const p = VARIETY_PRESETS[v];
      const entry = vData.nearPrice;
      setInputs((prev) => ({
        ...prev,
        variety: v,
        multiplier: p.multiplier,
        tickSize: p.tickSize,
        marginRate: p.defaultMarginRate,
        entryPrice: entry,
        stopLossPrice: prev.direction === 'LONG' ? entry - 200 : entry + 200,
        takeProfitPrice: prev.direction === 'LONG' ? entry + 600 : entry - 600,
      }));
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    const data = await fetchLatestPrices();
    if (data) {
      setMarketData(data);
      applyMarketPriceToInputs(data, variety);
    }
    setLoading(false);
  }, [variety, applyMarketPriceToInputs]);

  useEffect(() => {
    loadData();
  }, []);

  const handleSwitchVariety = (v: VarietyId) => {
    setVariety(v);
    const p = VARIETY_PRESETS[v];
    if (v !== 'CUSTOM' && marketData && marketData.varieties[v]) {
      const entry = marketData.varieties[v].nearPrice;
      setInputs((prev) => ({
        ...prev,
        variety: v,
        multiplier: p.multiplier,
        tickSize: p.tickSize,
        marginRate: p.defaultMarginRate,
        entryPrice: entry,
        stopLossPrice: prev.direction === 'LONG' ? entry - 200 : entry + 200,
        takeProfitPrice: prev.direction === 'LONG' ? entry + 600 : entry - 600,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        variety: v,
        multiplier: p.multiplier,
        tickSize: p.tickSize,
        marginRate: p.defaultMarginRate,
        entryPrice: p.defaultPrice,
        stopLossPrice: prev.direction === 'LONG' ? p.defaultPrice - 200 : p.defaultPrice + 200,
        takeProfitPrice: prev.direction === 'LONG' ? p.defaultPrice + 600 : p.defaultPrice - 600,
      }));
    }
  };

  const handleApplyTemplate = (tpl: (typeof QUICK_TRADE_TEMPLATES)[0]) => {
    setVariety(tpl.variety);
    const p = VARIETY_PRESETS[tpl.variety];
    setInputs((prev) => ({
      ...prev,
      variety: tpl.variety,
      multiplier: p.multiplier,
      tickSize: p.tickSize,
      marginRate: p.defaultMarginRate,
      direction: tpl.direction,
      entryPrice: tpl.entryPrice,
      stopLossPrice: tpl.stopLossPrice,
      takeProfitPrice: tpl.takeProfitPrice,
      winRate: tpl.winRate,
      atrValue: tpl.atrValue,
    }));
  };

  const results = calculatePosition(inputs);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header
        variety={variety}
        setVariety={handleSwitchVariety}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onApplyTemplate={handleApplyTemplate}
        marketData={marketData}
        loading={loading}
        onRefresh={loadData}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5">
          <TradePlanForm
            inputs={inputs}
            onChange={setInputs}
            preset={currentPreset}
            activeContracts={variety !== 'CUSTOM' ? marketData?.active_contracts?.[variety] : undefined}
          />
        </div>
        <div className="lg:col-span-7">
          <ResultsPanel
            inputs={inputs}
            results={results}
            activeTab={activeTab}
            preset={currentPreset}
          />
        </div>
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-5 text-xs text-slate-500 text-center space-y-1">
        <p>橡胶童话 · 期货资金与量化风控工具箱 | 严格执行止损纪律是长期稳健盈利的唯一基石</p>
        <p className="text-[11px] text-slate-600">
          注：本工具所有仓位与凯利模型计算仅供交易者参考，期货交易具备高杠杆属性，请严格评估自身风险承受能力。
        </p>
      </footer>
    </div>
  );
};
