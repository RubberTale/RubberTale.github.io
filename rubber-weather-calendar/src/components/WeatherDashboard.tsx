import React from 'react';
import { REGION_CONFIGS } from '../constants/regions';
import { RegionId, RegionWeather, DayForecast } from '../types';
import { CloudRain, ExternalLink, AlertTriangle, CheckCircle2, Droplets, Thermometer, ShieldAlert } from 'lucide-react';

interface WeatherDashboardProps {
  weatherMap: Record<RegionId, RegionWeather>;
}

export const WeatherDashboard: React.FC<WeatherDashboardProps> = ({ weatherMap }) => {
  const regionKeys = Object.keys(REGION_CONFIGS) as RegionId[];

  const getStatusBadge = (status: DayForecast['status'], rainMm: number) => {
    if (status === 'STORM') {
      return { label: '暴雨', bg: 'bg-rose-950/80 text-rose-300 border-rose-700/80' };
    }
    if (status === 'HEAVY_RAIN') {
      return { label: '大雨', bg: 'bg-orange-950/80 text-orange-300 border-orange-700/80' };
    }
    if (status === 'LIGHT_RAIN') {
      return { label: '小雨', bg: 'bg-amber-950/80 text-amber-300 border-amber-700/80' };
    }
    return { label: '适宜', bg: 'bg-emerald-950/80 text-emerald-300 border-emerald-700/80' };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="p-4 bg-slate-800/80 border border-slate-700/80 rounded-2xl flex items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-2 text-slate-300">
          <CloudRain className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            数据源：Open-Meteo 全球高精度数值天气预报系统（ECMWF / GFS 混合同化分析，每日自动更新）。
          </span>
        </div>
        <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px] shrink-0">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> &lt;5mm 正常割胶
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" /> 5-15mm 晨割推迟
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" /> &gt;15mm 停割/雨冲胶
          </span>
        </div>
      </div>

      {/* Region Weather Cards Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {regionKeys.map((k) => {
          const reg = REGION_CONFIGS[k];
          const w = weatherMap[k];

          return (
            <div
              key={k}
              className="p-5 bg-slate-800/90 border border-slate-700/80 rounded-2xl shadow-xl space-y-4 relative overflow-hidden"
            >
              {/* Header Info */}
              <div className="flex items-start justify-between border-b border-slate-700/60 pb-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{reg.flag}</span>
                    <h3 className="font-bold text-sm text-slate-100">{reg.name}</h3>
                    <span className="text-xs text-slate-400 font-mono">({reg.subName})</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    GPS 坐标: {reg.lat}°N, {reg.lon}°E · 全球产量占比: {reg.globalShare}%
                  </div>
                </div>

                {/* 7-Day Cumulative Rain Metric */}
                <div className="text-right">
                  <div className="text-[11px] text-slate-400">未来 7 天累计雨量</div>
                  <div className="text-xl font-bold font-mono text-blue-400">
                    {w?.total7DayRain ?? 0} <span className="text-xs text-slate-400">mm</span>
                  </div>
                </div>
              </div>

              {/* Disruption Level Badge */}
              <div className="flex items-center justify-between bg-slate-900/60 p-2.5 rounded-xl border border-slate-700/60 text-xs">
                <div className="flex items-center gap-2">
                  {w?.disruptionIndex > 50 ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : w?.disruptionIndex > 25 ? (
                    <Droplets className="w-4 h-4 text-amber-400" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  )}
                  <span className="text-slate-200 font-medium">{w?.statusText || '评估中...'}</span>
                </div>
                <div className="text-slate-400 font-mono text-[11px]">
                  受阻天数: <span className="text-white font-bold">{w?.disruptionDays || 0}</span> / 7 天
                </div>
              </div>

              {/* 7 Days Daily Breakdown Bar */}
              <div className="grid grid-cols-7 gap-2 pt-1 text-center">
                {w?.forecast.map((day, idx) => {
                  const badge = getStatusBadge(day.status, day.rainMm);
                  const maxBarHeight = 45; // px
                  const barHeight = Math.min(maxBarHeight, Math.max(4, (day.rainMm / 35) * maxBarHeight));

                  return (
                    <div
                      key={idx}
                      className="p-2 rounded-xl bg-slate-900/50 border border-slate-700/50 flex flex-col justify-between space-y-1.5"
                    >
                      <div className="text-[11px] font-medium text-slate-300">{day.dayOfWeek}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{day.date}</div>

                      {/* Visual Rain Bar */}
                      <div className="h-12 flex items-end justify-center py-1">
                        <div
                          className={`w-3 rounded-t-sm transition-all duration-300 ${
                            day.rainMm >= 25
                              ? 'bg-rose-500'
                              : day.rainMm >= 12
                              ? 'bg-orange-500'
                              : day.rainMm >= 4
                              ? 'bg-amber-400'
                              : 'bg-emerald-400'
                          }`}
                          style={{ height: `${barHeight}px` }}
                          title={`降雨量: ${day.rainMm} mm`}
                        />
                      </div>

                      <div className="font-mono text-xs font-bold text-white">{day.rainMm}mm</div>

                      <div className={`text-[10px] px-1 py-0.2 rounded border font-semibold ${badge.bg}`}>
                        {badge.label}
                      </div>

                      <div className="text-[10px] text-slate-400 font-mono">
                        {day.tempMin}°~{day.tempMax}°
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
