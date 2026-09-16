import React from 'react';
import { ArrowLeftRight, Trash2, HelpCircle, FileSpreadsheet, Sparkles } from 'lucide-react';

interface DataInputPanesProps {
  oldLabel: string;
  setOldLabel: (v: string) => void;
  newLabel: string;
  setNewLabel: (v: string) => void;
  rawOldText: string;
  setRawOldText: (v: string) => void;
  rawNewText: string;
  setRawNewText: (v: string) => void;
  onClear: () => void;
}

export const DataInputPanes: React.FC<DataInputPanesProps> = ({
  oldLabel,
  setOldLabel,
  newLabel,
  setNewLabel,
  rawOldText,
  setRawOldText,
  rawNewText,
  setRawNewText,
  onClear,
}) => {
  const handleSwap = () => {
    const tempLabel = oldLabel;
    const tempText = rawOldText;
    setOldLabel(newLabel);
    setRawOldText(rawNewText);
    setNewLabel(tempLabel);
    setRawNewText(tempText);
  };

  return (
    <div className="space-y-4">
      {/* Zero Token OCR & Explanatory Tip Banner */}
      <div className="p-3.5 bg-blue-950/40 border border-blue-800/60 rounded-xl text-xs space-y-1.5 text-blue-200">
        <div className="flex items-center justify-between font-semibold text-blue-300">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>智能对齐提示与常见问题说明</span>
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleSwap}
              className="px-2 py-0.5 bg-blue-900/60 hover:bg-blue-800 rounded text-[11px] flex items-center gap-1 text-white transition-colors"
              title="交换前后两期数据"
            >
              <ArrowLeftRight className="w-3 h-3" />
              <span>左右互换</span>
            </button>
            <button
              type="button"
              onClick={onClear}
              className="px-2 py-0.5 bg-slate-800 hover:bg-rose-900/50 rounded text-[11px] flex items-center gap-1 text-slate-300 hover:text-rose-300 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>清空输入</span>
            </button>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-blue-200/90">
          <strong>问：网页端 OCR 识图提取会消耗我的 Token 吗？</strong>
          <br />
          答：<strong>完全不会！</strong>浏览器采用的是纯前端 WebAssembly 本地计算技术，直接在您的浏览器内存中解析文字与数字，<strong>0 Token 消耗、完全免费且 100% 本地隐私安全</strong>。您可以直接从 Excel、PDF、研报微信公众号中复制两期表格内容，直接粘贴到下方左右文本框中即可毫秒级自动对齐比对！
        </p>
      </div>

      {/* Two Panes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Left: Old / Period 1 */}
        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-3 rounded-full bg-slate-400" />
              <input
                type="text"
                value={oldLabel}
                onChange={(e) => setOldLabel(e.target.value)}
                placeholder="基期/前序研报"
                className="bg-transparent text-xs font-bold text-slate-200 border-b border-dashed border-slate-600 focus:outline-none focus:border-blue-400 px-1 py-0.5 w-40"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {rawOldText.split('\n').filter((l) => l.trim()).length} 行数据
            </span>
          </div>

          <textarea
            rows={7}
            value={rawOldText}
            onChange={(e) => setRawOldText(e.target.value)}
            placeholder="支持从 Excel / 研报复制粘贴，格式如：&#10;国内总产量(万吨)	85.5&#10;进口量(万吨)	582.0&#10;轮胎消费(万吨)	395.0"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
          />
        </div>

        {/* Right: New / Period 2 */}
        <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-3 rounded-full bg-blue-500" />
              <input
                type="text"
                value={newLabel}
                onChange={(e) => setNewLabel(e.target.value)}
                placeholder="最新/当期研报"
                className="bg-transparent text-xs font-bold text-slate-200 border-b border-dashed border-slate-600 focus:outline-none focus:border-blue-400 px-1 py-0.5 w-40"
              />
            </div>
            <span className="text-[11px] text-slate-400 font-mono">
              {rawNewText.split('\n').filter((l) => l.trim()).length} 行数据
            </span>
          </div>

          <textarea
            rows={7}
            value={rawNewText}
            onChange={(e) => setRawNewText(e.target.value)}
            placeholder="支持从 Excel / 研报复制粘贴，格式如：&#10;国内总产量(万吨)	81.2&#10;进口量(万吨)	608.5&#10;轮胎消费(万吨)	388.0"
            className="w-full p-3 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono text-slate-200 focus:outline-none focus:ring-1 focus:ring-blue-500 leading-relaxed resize-y"
          />
        </div>
      </div>
    </div>
  );
};
