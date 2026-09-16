import React, { useState } from 'react';
import { PRESET_BALANCE_SHEETS } from './constants/presets';
import { PresetBalanceSheet } from './types';
import { parseAndDiff } from './utils/diffParser';
import { Header } from './components/Header';
import { DataInputPanes } from './components/DataInputPanes';
import { DiffTable } from './components/DiffTable';

export const App: React.FC = () => {
  const initialPreset = PRESET_BALANCE_SHEETS[0];
  const [oldLabel, setOldLabel] = useState<string>(initialPreset.oldLabel);
  const [newLabel, setNewLabel] = useState<string>(initialPreset.newLabel);
  const [rawOldText, setRawOldText] = useState<string>(initialPreset.rawOldText);
  const [rawNewText, setRawNewText] = useState<string>(initialPreset.rawNewText);

  const handleSelectPreset = (preset: PresetBalanceSheet) => {
    setOldLabel(preset.oldLabel);
    setNewLabel(preset.newLabel);
    setRawOldText(preset.rawOldText);
    setRawNewText(preset.rawNewText);
  };

  const handleClear = () => {
    setRawOldText('');
    setRawNewText('');
  };

  const { rows, summary } = parseAndDiff(rawOldText, rawNewText);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header onSelectPreset={handleSelectPreset} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        <DataInputPanes
          oldLabel={oldLabel}
          setOldLabel={setOldLabel}
          newLabel={newLabel}
          setNewLabel={setNewLabel}
          rawOldText={rawOldText}
          setRawOldText={setRawOldText}
          rawNewText={rawNewText}
          setRawNewText={setRawNewText}
          onClear={handleClear}
        />

        <DiffTable
          rows={rows}
          summary={summary}
          oldLabel={oldLabel}
          newLabel={newLabel}
        />
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-5 text-xs text-slate-500 text-center space-y-1">
        <p>橡胶童话 · 研报数据与供需平衡表比对工作台 | 支持 Excel 复制对齐与变动自动汇总</p>
        <p className="text-[11px] text-slate-600">
          所有数据计算与解析均在本地浏览器内存中即时完成，不向外部服务器传输任何文本，零 Token 消耗，保护商业与研究隐私。
        </p>
      </footer>
    </div>
  );
};
