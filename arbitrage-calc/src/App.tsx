import React, { useState } from 'react';
import { RubberVariety, CalcMode, SpreadInputs, DeliveryInputs } from './types';
import { VARIETY_CONFIGS, PRESET_SCENARIOS } from './constants/varieties';
import { calculateSpread, calculateDelivery } from './utils/calculations';
import { Header } from './components/Header';
import { SpreadCalculator } from './components/SpreadCalculator';
import { DeliveryCalculator } from './components/DeliveryCalculator';

export const App: React.FC = () => {
  const [variety, setVariety] = useState<RubberVariety>('RU');
  const [mode, setMode] = useState<CalcMode>('spread');

  const currentConfig = VARIETY_CONFIGS[variety];

  const [spreadInputs, setSpreadInputs] = useState<SpreadInputs>({
    variety: 'RU',
    spotPrice: currentConfig.defaultSpotPrice,
    spotName: currentConfig.defaultSpotName,
    nearContract: currentConfig.defaultNearContract,
    nearPrice: currentConfig.defaultNearPrice,
    farContract: currentConfig.defaultFarContract,
    farPrice: currentConfig.defaultFarPrice,
    daysDiff: 120,
  });

  const [deliveryInputs, setDeliveryInputs] = useState<DeliveryInputs>({
    variety: 'RU',
    spotBuyPrice: currentConfig.defaultSpotPrice,
    futuresSellPrice: currentConfig.defaultFarPrice,
    holdingDays: 120,
    annualInterestRate: 3.5, // 3.5% 年化融资利息
    storageFeePerDay: currentConfig.defaultStorageFee,
    inspectionFee: 25, // 质检费 25 元/吨
    inOutFee: 35, // 倒垛出入库 35 元/吨
    commissionFee: 15, // 交割手续费 15 元/吨
    vatAdjustment: 0,
    positionLots: 10,
  });

  // Handle switching variety
  const handleSwitchVariety = (newVar: RubberVariety) => {
    setVariety(newVar);
    const cfg = VARIETY_CONFIGS[newVar];
    setSpreadInputs((prev) => ({
      ...prev,
      variety: newVar,
      spotPrice: cfg.defaultSpotPrice,
      spotName: cfg.defaultSpotName,
      nearContract: cfg.defaultNearContract,
      nearPrice: cfg.defaultNearPrice,
      farContract: cfg.defaultFarContract,
      farPrice: cfg.defaultFarPrice,
    }));

    setDeliveryInputs((prev) => ({
      ...prev,
      variety: newVar,
      spotBuyPrice: cfg.defaultSpotPrice,
      futuresSellPrice: cfg.defaultFarPrice,
      storageFeePerDay: cfg.defaultStorageFee,
    }));
  };

  // Handle preset scenario
  const handleApplyScenario = (scenario: (typeof PRESET_SCENARIOS)[0]) => {
    setVariety(scenario.variety);
    const cfg = VARIETY_CONFIGS[scenario.variety];
    setSpreadInputs({
      variety: scenario.variety,
      spotPrice: scenario.spotPrice,
      spotName: cfg.defaultSpotName,
      nearContract: scenario.nearContract,
      nearPrice: scenario.nearPrice,
      farContract: scenario.farContract,
      farPrice: scenario.farPrice,
      daysDiff: scenario.daysDiff,
    });

    setDeliveryInputs((prev) => ({
      ...prev,
      variety: scenario.variety,
      spotBuyPrice: scenario.spotPrice,
      futuresSellPrice: scenario.farPrice,
      holdingDays: scenario.daysDiff,
      storageFeePerDay: cfg.defaultStorageFee,
    }));
  };

  const spreadResults = calculateSpread(spreadInputs);
  const deliveryResults = calculateDelivery(deliveryInputs, currentConfig.multiplier);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header
        mode={mode}
        setMode={setMode}
        variety={variety}
        setVariety={handleSwitchVariety}
        onApplyScenario={handleApplyScenario}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {mode === 'spread' ? (
          <SpreadCalculator
            config={currentConfig}
            inputs={spreadInputs}
            onChange={setSpreadInputs}
            results={spreadResults}
          />
        ) : (
          <DeliveryCalculator
            config={currentConfig}
            inputs={deliveryInputs}
            onChange={setDeliveryInputs}
            results={deliveryResults}
          />
        )}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-5 text-xs text-slate-500 text-center space-y-1">
        <p>橡胶童话 · 大宗商品投研与量化研究工具箱 | 天然橡胶 (RU) · 20号胶 (NR) · 丁二烯橡胶 (BR)</p>
        <p className="text-[11px] text-slate-600">
          注：所有测算结果仅供宏观研判与交割策略参考，实盘交易请以交易所最新标准仓单规则与银行实际资金成本为准。
        </p>
      </footer>
    </div>
  );
};
