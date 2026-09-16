import { DataRow, DiffSummary } from '../types';

interface ParsedLine {
  metric: string;
  unit: string;
  val: number;
}

function parseSingleLine(line: string): ParsedLine | null {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#') || trimmed.startsWith('//')) return null;

  // Attempt split by Tab, Comma, Colon, or multiple spaces
  let parts = trimmed.split(/[\t,，:：]|\s{2,}/).map((p) => p.trim()).filter(Boolean);

  if (parts.length === 1) {
    // Single space fallback
    const spaceParts = trimmed.split(/\s+/);
    if (spaceParts.length >= 2) {
      parts = [spaceParts.slice(0, -1).join(' '), spaceParts[spaceParts.length - 1]];
    }
  }

  if (parts.length < 2) return null;

  const rawMetric = parts[0];
  const rawVal = parts[1];

  // Extract unit from metric name if enclosed in parentheses e.g. "产量(万吨)"
  let metric = rawMetric;
  let unit = '';
  const unitMatch = rawMetric.match(/[（(]([^()（）]+)[)）]/);
  if (unitMatch) {
    unit = unitMatch[1];
    metric = rawMetric.replace(/[（(][^()（）]+[)）]/, '').trim();
  }

  // Parse numeric value (strip possible %, commas)
  const numCleaned = rawVal.replace(/[,，%]/g, '');
  const val = parseFloat(numCleaned);

  if (isNaN(val)) return null;

  return { metric, unit, val };
}

export function parseAndDiff(rawOld: string, rawNew: string): { rows: DataRow[]; summary: DiffSummary } {
  const oldLines = rawOld.split('\n').map(parseSingleLine).filter(Boolean) as ParsedLine[];
  const newLines = rawNew.split('\n').map(parseSingleLine).filter(Boolean) as ParsedLine[];

  const oldMap = new Map<string, ParsedLine>();
  oldLines.forEach((item) => oldMap.set(item.metric, item));

  const rows: DataRow[] = [];

  // Track matched
  const matchedOldKeys = new Set<string>();

  newLines.forEach((newItem, idx) => {
    const oldItem = oldMap.get(newItem.metric);
    const oldVal = oldItem ? oldItem.val : 0;
    const newVal = newItem.val;
    const delta = Math.round((newVal - oldVal) * 100) / 100;
    const deltaPercent = oldVal !== 0 ? Math.round(((newVal - oldVal) / Math.abs(oldVal)) * 1000) / 10 : 0;

    let direction: 'UP' | 'DOWN' | 'EQUAL' = 'EQUAL';
    if (delta > 0.0001) direction = 'UP';
    else if (delta < -0.0001) direction = 'DOWN';

    if (oldItem) {
      matchedOldKeys.add(newItem.metric);
    }

    rows.push({
      id: `row_${idx}`,
      metric: newItem.metric,
      unit: newItem.unit || oldItem?.unit || '',
      oldVal,
      newVal,
      delta,
      deltaPercent,
      direction,
    });
  });

  // Add any old items that didn't appear in new
  oldLines.forEach((oldItem, idx) => {
    if (!matchedOldKeys.has(oldItem.metric)) {
      rows.push({
        id: `old_only_${idx}`,
        metric: oldItem.metric,
        unit: oldItem.unit,
        oldVal: oldItem.val,
        newVal: 0,
        delta: -oldItem.val,
        deltaPercent: -100,
        direction: 'DOWN',
      });
    }
  });

  // Calculate summary stats
  const totalRows = rows.length;
  const increasedRows = rows.filter((r) => r.direction === 'UP').length;
  const decreasedRows = rows.filter((r) => r.direction === 'DOWN').length;
  const unchangedRows = rows.filter((r) => r.direction === 'EQUAL').length;

  let maxIncreaseItem: DataRow | undefined;
  let maxDecreaseItem: DataRow | undefined;

  rows.forEach((r) => {
    if (r.direction === 'UP') {
      if (!maxIncreaseItem || r.deltaPercent > maxIncreaseItem.deltaPercent) {
        maxIncreaseItem = r;
      }
    } else if (r.direction === 'DOWN') {
      if (!maxDecreaseItem || r.deltaPercent < maxDecreaseItem.deltaPercent) {
        maxDecreaseItem = r;
      }
    }
  });

  return {
    rows,
    summary: {
      totalRows,
      increasedRows,
      decreasedRows,
      unchangedRows,
      maxIncreaseItem,
      maxDecreaseItem,
    },
  };
}

export function generateMarkdownTable(
  rows: DataRow[],
  oldLabel = '前期基期',
  newLabel = '最新本期'
): string {
  let md = `| 指标名称 | ${oldLabel} | ${newLabel} | 变动差值 (Δ) | 变动幅度 (Δ%) | 趋势 |\n`;
  md += `| :--- | :---: | :---: | :---: | :---: | :---: |\n`;

  rows.forEach((r) => {
    const deltaSign = r.delta > 0 ? `+${r.delta}` : `${r.delta}`;
    const pctSign = r.deltaPercent > 0 ? `+${r.deltaPercent}%` : `${r.deltaPercent}%`;
    const icon = r.direction === 'UP' ? '🔺 增' : r.direction === 'DOWN' ? '🔻 降' : '➖ 平';
    const unitStr = r.unit ? ` (${r.unit})` : '';

    md += `| ${r.metric}${unitStr} | ${r.oldVal} | ${r.newVal} | ${deltaSign} | ${pctSign} | ${icon} |\n`;
  });

  return md;
}

export function generateExecutiveReport(
  rows: DataRow[],
  summary: DiffSummary,
  oldLabel = '前期',
  newLabel = '最新'
): string {
  const significantChanges = rows
    .filter((r) => Math.abs(r.deltaPercent) >= 3)
    .sort((a, b) => Math.abs(b.deltaPercent) - Math.abs(a.deltaPercent));

  let text = `【研报数据与平衡表比对关键异动速报】\n`;
  text += `- 样本总指标数：${summary.totalRows} 项 (上涨/增加: ${summary.increasedRows} 项, 下跌/缩减: ${summary.decreasedRows} 项, 持平: ${summary.unchangedRows} 项)\n`;

  if (summary.maxIncreaseItem) {
    text += `- 最大增量指标：${summary.maxIncreaseItem.metric} (环比 +${summary.maxIncreaseItem.deltaPercent}%)\n`;
  }
  if (summary.maxDecreaseItem) {
    text += `- 最大减量指标：${summary.maxDecreaseItem.metric} (环比 ${summary.maxDecreaseItem.deltaPercent}%)\n`;
  }

  text += `\n关键调整明细（变动≥3%）：\n`;
  significantChanges.slice(0, 6).forEach((c) => {
    const sign = c.delta > 0 ? '+' : '';
    text += `• ${c.metric}：由 ${c.oldVal} 调整为 ${c.newVal} ${c.unit} (环比 ${sign}${c.deltaPercent}%)\n`;
  });

  return text;
}
