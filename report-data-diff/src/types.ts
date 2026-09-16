export interface DataRow {
  id: string;
  metric: string;
  unit: string;
  oldVal: number;
  newVal: number;
  delta: number;
  deltaPercent: number;
  direction: 'UP' | 'DOWN' | 'EQUAL';
}

export interface PresetBalanceSheet {
  id: string;
  title: string;
  oldLabel: string;
  newLabel: string;
  rawOldText: string;
  rawNewText: string;
  desc: string;
}

export interface DiffSummary {
  totalRows: number;
  increasedRows: number;
  decreasedRows: number;
  unchangedRows: number;
  maxIncreaseItem?: DataRow;
  maxDecreaseItem?: DataRow;
}
