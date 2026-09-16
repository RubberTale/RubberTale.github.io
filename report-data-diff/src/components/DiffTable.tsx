import React, { useState } from 'react';
import { DataRow, DiffSummary } from '../types';
import {
  generateMarkdownTable,
  generateExecutiveReport,
} from '../utils/diffParser';
import {
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Copy,
  Check,
  Download,
  Filter,
  FileSpreadsheet,
} from 'lucide-react';

interface DiffTableProps {
  rows: DataRow[];
  summary: DiffSummary;
  oldLabel: string;
  newLabel: string;
}

export const DiffTable: React.FC<DiffTableProps> = ({
  rows,
  summary,
  oldLabel,
  newLabel,
}) => {
  const [filterChangesOnly, setFilterChangesOnly] = useState(false);
  const [threshold, setThreshold] = useState<number>(3); // 默认标红大于 3% 的变动
  const [copiedMd, setCopiedMd] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  const displayedRows = filterChangesOnly ? rows.filter((r) => r.direction !== 'EQUAL') : rows;

  const handleCopyMarkdown = () => {
    const md = generateMarkdownTable(displayedRows, oldLabel, newLabel);
    navigator.clipboard.writeText(md);
    setCopiedMd(true);
    setTimeout(() => setCopiedMd(false), 2000);
  };

  const handleCopyReport = () => {
    const text = generateExecutiveReport(rows, summary, oldLabel, newLabel);
    navigator.clipboard.writeText(text);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  const handleExportCsv = () => {
    let csv = `\uFEFF指标名称,单位,${oldLabel},${newLabel},变动差值(Δ),变动幅度(Δ%),趋势\n`;
    displayedRows.forEach((r) => {
      const sign = r.delta > 0 ? `+${r.delta}` : `${r.delta}`;
      const pct = r.deltaPercent > 0 ? `+${r.deltaPercent}%` : `${r.deltaPercent}%`;
      const trend = r.direction === 'UP' ? '增加' : r.direction === 'DOWN' ? '减少' : '持平';
      csv += `"${r.metric}","${r.unit}",${r.oldVal},${r.newVal},"${sign}","${pct}","${trend}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `研报平衡表比对_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Diff Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 mb-1">比对有效指标</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-white">{summary.totalRows}</span>
            <span className="text-xs text-slate-400">项</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            持平 {summary.unchangedRows} 项
          </div>
        </div>

        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 mb-1">环比上调 / 增加</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-emerald-400">
              +{summary.increasedRows}
            </span>
            <span className="text-xs text-slate-400">项</span>
          </div>
          <div className="text-[11px] text-emerald-400/80 truncate mt-1">
            {summary.maxIncreaseItem ? `最高: ${summary.maxIncreaseItem.metric} (+${summary.maxIncreaseItem.deltaPercent}%)` : '-'}
          </div>
        </div>

        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg">
          <div className="text-xs text-slate-400 mb-1">环比下调 / 减少</div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black font-mono text-rose-400">
              -{summary.decreasedRows}
            </span>
            <span className="text-xs text-slate-400">项</span>
          </div>
          <div className="text-[11px] text-rose-400/80 truncate mt-1">
            {summary.maxDecreaseItem ? `最高: ${summary.maxDecreaseItem.metric} (${summary.maxDecreaseItem.deltaPercent}%)` : '-'}
          </div>
        </div>

        <div className="p-4 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-lg flex flex-col justify-between">
          <div className="text-xs text-slate-400 font-medium">显著异动阈值高亮</div>
          <div className="flex items-center gap-2 mt-1">
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <span className="text-xs font-mono text-blue-400 font-bold w-10 text-right">
              ≥{threshold}%
            </span>
          </div>
        </div>
      </div>

      {/* Table & Actions Toolbar */}
      <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl space-y-4">
        {/* Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-700/60 pb-3">
          <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 select-none">
            <input
              type="checkbox"
              checked={filterChangesOnly}
              onChange={(e) => setFilterChangesOnly(e.target.checked)}
              className="rounded text-blue-500 focus:ring-0"
            />
            <span>仅显示有变动的指标项 ({rows.filter((r) => r.direction !== 'EQUAL').length} 项)</span>
          </label>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleExportCsv}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出 CSV 表格</span>
            </button>

            <button
              type="button"
              onClick={handleCopyMarkdown}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-700 border border-slate-700 text-xs font-medium text-slate-300 hover:text-white rounded-lg flex items-center gap-1.5 transition-colors"
            >
              {copiedMd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedMd ? '已复制 Markdown' : '复制 Markdown'}</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReport}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-xs font-medium text-white rounded-lg flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedReport ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <FileSpreadsheet className="w-3.5 h-3.5" />}
              <span>{copiedReport ? '速报已复制' : '复制投研异动速报'}</span>
            </button>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-700/80 text-slate-400 font-semibold">
                <th className="py-2.5 px-3">指标名称</th>
                <th className="py-2.5 px-3 text-center">{oldLabel}</th>
                <th className="py-2.5 px-3 text-center">{newLabel}</th>
                <th className="py-2.5 px-3 text-right">变动差值 (Δ)</th>
                <th className="py-2.5 px-3 text-right">变动幅度 (Δ%)</th>
                <th className="py-2.5 px-3 text-center">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/40">
              {displayedRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    暂无匹配数据，请检查上方左右两期输入内容。
                  </td>
                </tr>
              ) : (
                displayedRows.map((r) => {
                  const isSignificant = Math.abs(r.deltaPercent) >= threshold;

                  return (
                    <tr
                      key={r.id}
                      className={`hover:bg-slate-700/30 transition-colors ${
                        isSignificant && r.direction === 'UP'
                          ? 'bg-emerald-950/20'
                          : isSignificant && r.direction === 'DOWN'
                          ? 'bg-rose-950/20'
                          : ''
                      }`}
                    >
                      <td className="py-2.5 px-3 font-medium text-slate-200">
                        {r.metric}
                        {r.unit && <span className="text-[11px] text-slate-400 ml-1">({r.unit})</span>}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-center text-slate-400">
                        {r.oldVal.toLocaleString()}
                      </td>

                      <td className="py-2.5 px-3 font-mono text-center text-white font-semibold">
                        {r.newVal.toLocaleString()}
                      </td>

                      <td
                        className={`py-2.5 px-3 font-mono text-right font-bold ${
                          r.direction === 'UP'
                            ? 'text-emerald-400'
                            : r.direction === 'DOWN'
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {r.delta > 0 ? `+${r.delta}` : r.delta}
                      </td>

                      <td
                        className={`py-2.5 px-3 font-mono text-right font-bold ${
                          r.direction === 'UP'
                            ? 'text-emerald-400'
                            : r.direction === 'DOWN'
                            ? 'text-rose-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {r.deltaPercent > 0 ? `+${r.deltaPercent}%` : `${r.deltaPercent}%`}
                      </td>

                      <td className="py-2.5 px-3 text-center">
                        {r.direction === 'UP' ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/80">
                            <ArrowUpRight className="w-3 h-3" />
                            <span>增加</span>
                          </span>
                        ) : r.direction === 'DOWN' ? (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-950 text-rose-300 border border-rose-800/80">
                            <ArrowDownRight className="w-3 h-3" />
                            <span>减少</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400">
                            <Minus className="w-3 h-3" />
                            <span>持平</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
