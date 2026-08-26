// TradingChart.tsx
import React, { useRef, useEffect, useState } from 'react';

export interface CandleData {
  idx: number;
  real_date: string;
  open: number;
  high: number;
  low: number;
  close: number;
  raw_open?: number;
  raw_high?: number;
  raw_low?: number;
  raw_close?: number;
  volume: number;
  open_interest?: number;
  ma5?: number | null;
  ma10?: number | null;
  ma20?: number | null;
}

interface TradingChartProps {
  candles: CandleData[];
  entryIdx?: number;
  action?: 'long' | 'short' | 'skip' | null;
  playbackIdx?: number;
  isRevealing?: boolean;
}

export const TradingChart: React.FC<TradingChartProps> = ({
  candles,
  entryIdx,
  action,
  playbackIdx,
  isRevealing
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Render chart on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container || candles.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = container.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    ctx.scale(dpr, dpr);

    // Color definitions (Chinese Standard: Red Up, Green Down)
    const UP_COLOR = '#ef4444';   // Red
    const DOWN_COLOR = '#10b981'; // Emerald Green
    const MA5_COLOR = '#fbbf24';  // Amber
    const MA10_COLOR = '#38bdf8'; // Sky Blue
    const MA20_COLOR = '#c084fc'; // Purple

    // Layout partitions
    const padding = { top: 25, right: 65, bottom: 25, left: 15 };
    const chartHeight = height - padding.top - padding.bottom;
    const mainChartHeight = chartHeight * 0.72;
    const volumeChartHeight = chartHeight * 0.22;
    const volumeChartTop = padding.top + mainChartHeight + chartHeight * 0.06;

    // Price Bounds
    const activeCandles = candles;
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    let maxVol = 0;

    activeCandles.forEach(c => {
      if (c.low < minPrice) minPrice = c.low;
      if (c.high > maxPrice) maxPrice = c.high;
      if (c.ma5 && c.ma5 < minPrice) minPrice = c.ma5;
      if (c.ma5 && c.ma5 > maxPrice) maxPrice = c.ma5;
      if (c.ma20 && c.ma20 < minPrice) minPrice = c.ma20;
      if (c.ma20 && c.ma20 > maxPrice) maxPrice = c.ma20;
      if (c.volume > maxVol) maxVol = c.volume;
    });

    if (minPrice === Infinity) minPrice = 90;
    if (maxPrice === -Infinity) maxPrice = 110;
    const priceMargin = (maxPrice - minPrice) * 0.08 || 2;
    minPrice -= priceMargin;
    maxPrice += priceMargin;
    const priceRange = maxPrice - minPrice || 1;

    // Coordinate conversion helpers
    const availableWidth = width - padding.left - padding.right;
    const candleSpacing = availableWidth / Math.max(candles.length, 1);
    const candleWidth = Math.max(3, Math.min(14, candleSpacing * 0.65));

    const getX = (i: number) => padding.left + i * candleSpacing + candleSpacing / 2;
    const getY = (val: number) => padding.top + (1 - (val - minPrice) / priceRange) * mainChartHeight;
    const getVolY = (vol: number) => volumeChartTop + volumeChartHeight - (vol / (maxVol || 1)) * volumeChartHeight;

    // Clear canvas
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.6;

    // Horizontal Price Grids
    const gridSteps = 5;
    for (let i = 0; i <= gridSteps; i++) {
      const p = minPrice + (priceRange / gridSteps) * i;
      const y = getY(p);
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      // Right axis labels
      ctx.fillStyle = '#64748b';
      ctx.font = '10px JetBrains Mono, monospace';
      ctx.textAlign = 'left';
      ctx.fillText(p.toFixed(2), width - padding.right + 6, y + 3);
    }

    // Horizontal Volume line
    ctx.beginPath();
    ctx.moveTo(padding.left, volumeChartTop);
    ctx.lineTo(width - padding.right, volumeChartTop);
    ctx.stroke();

    // Draw Volume Bars
    activeCandles.forEach((c, i) => {
      const isUp = c.close >= c.open;
      const color = isUp ? UP_COLOR : DOWN_COLOR;
      const x = getX(i);
      const vY = getVolY(c.volume);
      const vH = volumeChartTop + volumeChartHeight - vY;

      ctx.fillStyle = color + '66'; // semi-transparent
      ctx.fillRect(x - candleWidth / 2, vY, candleWidth, vH);
    });

    // Draw MA Indicator Lines
    const drawLine = (prop: 'ma5' | 'ma10' | 'ma20', strokeColor: string) => {
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      let started = false;

      activeCandles.forEach((c, i) => {
        const val = c[prop];
        if (val !== undefined && val !== null) {
          const x = getX(i);
          const y = getY(val);
          if (!started) {
            ctx.moveTo(x, y);
            started = true;
          } else {
            ctx.lineTo(x, y);
          }
        }
      });
      ctx.stroke();
    };

    drawLine('ma5', MA5_COLOR);
    drawLine('ma10', MA10_COLOR);
    drawLine('ma20', MA20_COLOR);

    // Draw Candlesticks
    activeCandles.forEach((c, i) => {
      const isUp = c.close >= c.open;
      const color = isUp ? UP_COLOR : DOWN_COLOR;
      const x = getX(i);

      const yOpen = getY(c.open);
      const yClose = getY(c.close);
      const yHigh = getY(c.high);
      const yLow = getY(c.low);

      // High-low wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x, yHigh);
      ctx.lineTo(x, yLow);
      ctx.stroke();

      // Body box
      const bodyTop = Math.min(yOpen, yClose);
      const bodyHeight = Math.max(2, Math.abs(yOpen - yClose));
      ctx.fillStyle = color;
      ctx.fillRect(x - candleWidth / 2, bodyTop, candleWidth, bodyHeight);
    });

    // Draw Decision Entry Vertical Line & Badge
    if (entryIdx !== undefined && entryIdx >= 0 && entryIdx < candles.length) {
      const eX = getX(entryIdx);
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(eX, padding.top);
      ctx.lineTo(eX, height - padding.bottom);
      ctx.stroke();
      ctx.setLineDash([]);

      // Badge on top
      if (action) {
        const badgeColor = action === 'long' ? UP_COLOR : action === 'short' ? DOWN_COLOR : '#64748b';
        const badgeText = action === 'long' ? '🚀 多单介入' : action === 'short' ? '🔻 空单介入' : '⏸️ 观望';
        ctx.fillStyle = badgeColor;
        ctx.beginPath();
        ctx.roundRect(eX - 35, padding.top - 18, 70, 18, 4);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 10px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(badgeText, eX, padding.top - 5);
      }
    }

    // Draw Current Playback Head Marker
    if (playbackIdx !== undefined && playbackIdx < candles.length) {
      const pX = getX(playbackIdx);
      const currCandle = candles[playbackIdx];
      const pY = getY(currCandle.close);

      // Glowing dot
      ctx.fillStyle = '#38bdf8';
      ctx.shadowColor = '#38bdf8';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(pX, pY, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }

    // Draw Crosshair if hovering
    if (hoverIndex !== null && hoverIndex >= 0 && hoverIndex < candles.length) {
      const c = candles[hoverIndex];
      const hX = getX(hoverIndex);
      const hY = getY(c.close);

      ctx.strokeStyle = 'rgba(148, 163, 184, 0.4)';
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      ctx.moveTo(hX, padding.top);
      ctx.lineTo(hX, height - padding.bottom);
      ctx.moveTo(padding.left, hY);
      ctx.lineTo(width - padding.right, hY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

  }, [candles, entryIdx, action, playbackIdx, hoverIndex]);

  // Handle Mouse movement for tooltips
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left - 15;
    const availableWidth = rect.width - 80;
    const spacing = availableWidth / candles.length;
    const idx = Math.floor(x / spacing);
    if (idx >= 0 && idx < candles.length) {
      setHoverIndex(idx);
    } else {
      setHoverIndex(null);
    }
  };

  const activeCandle = hoverIndex !== null && candles[hoverIndex] ? candles[hoverIndex] : candles[candles.length - 1];

  return (
    <div className="relative w-full h-full flex flex-col bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Legend and Info Header Bar */}
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-950/80 border-b border-slate-800/80 text-xs font-mono">
        <div className="flex items-center gap-3">
          <span className="text-slate-400">Day #{activeCandle?.idx || 1}</span>
          <span className="text-slate-200">开: <b className="font-bold">{activeCandle?.open.toFixed(2)}</b></span>
          <span className="text-slate-200">高: <b className="text-red-400 font-bold">{activeCandle?.high.toFixed(2)}</b></span>
          <span className="text-slate-200">低: <b className="text-emerald-400 font-bold">{activeCandle?.low.toFixed(2)}</b></span>
          <span className="text-slate-200">收: <b className="font-bold">{activeCandle?.close.toFixed(2)}</b></span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="text-amber-400">MA5: {activeCandle?.ma5 ? activeCandle.ma5.toFixed(2) : '-'}</span>
          <span className="text-sky-400">MA10: {activeCandle?.ma10 ? activeCandle.ma10.toFixed(2) : '-'}</span>
          <span className="text-purple-400">MA20: {activeCandle?.ma20 ? activeCandle.ma20.toFixed(2) : '-'}</span>
          <span className="text-slate-400">量: {activeCandle?.volume.toLocaleString()}</span>
        </div>
      </div>

      {/* Main Canvas Area */}
      <div ref={containerRef} className="flex-1 w-full h-full min-h-[360px] relative">
        <canvas
          ref={canvasRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverIndex(null)}
          className="w-full h-full block cursor-crosshair"
        />
      </div>
    </div>
  );
};
