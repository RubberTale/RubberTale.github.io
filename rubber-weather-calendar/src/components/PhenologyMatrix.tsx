import React from 'react';
import { REGION_CONFIGS, PHENOLOGY_INFO } from '../constants/regions';
import { RegionId, PhenologyStage } from '../types';
import { Calendar, Globe2, Info, Compass } from 'lucide-react';

export const PhenologyMatrix: React.FC = () => {
  const currentMonth = new Date().getMonth() + 1; // 1-12
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const regionKeys = Object.keys(REGION_CONFIGS) as RegionId[];

  return (
    <div className="space-y-6">
      {/* Top Description & Current Month Status */}
      <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="text-xs text-slate-400 font-medium">全球天然橡胶主产区供需周期全景</div>
          <div className="text-lg font-bold text-white flex items-center gap-2">
            <span>当前时点：公历 {currentMonth} 月</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 font-medium">
              ★ 北半球与赤道主产区全面进入季节性高产旺季
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
            天然橡胶具有极其鲜明的季风农业物候特征。每年 9-11 月，中、泰、越、印尼主产区单树出胶量均处于年内峰值，是全年度原料供给最充沛、胶水收购价格弹性最大的关键博弈窗口期。
          </p>
        </div>

        <div className="shrink-0 flex flex-wrap gap-2">
          {(['OFF', 'START', 'RISING', 'PEAK', 'FALLING'] as PhenologyStage[]).map((stage) => {
            const info = PHENOLOGY_INFO[stage];
            return (
              <div
                key={stage}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border flex items-center gap-1.5 ${info.bg} ${info.color}`}
              >
                <span>{info.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 12-Month Matrix Table */}
      <div className="p-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl shadow-xl overflow-x-auto">
        <div className="min-w-[760px] space-y-3">
          {/* Header Months */}
          <div className="grid grid-cols-13 gap-1.5 text-center text-xs font-semibold text-slate-400 pb-2 border-b border-slate-700/60">
            <div className="text-left font-bold text-slate-200">主产区与占比</div>
            {months.map((m) => (
              <div
                key={m}
                className={`py-1 rounded-lg font-mono ${
                  m === currentMonth ? 'bg-emerald-600 text-white font-bold shadow-sm' : ''
                }`}
              >
                {m}月
                {m === currentMonth && <span className="block text-[9px] -mt-0.5 font-normal">当前</span>}
              </div>
            ))}
          </div>

          {/* Region Rows */}
          {regionKeys.map((k) => {
            const reg = REGION_CONFIGS[k];
            return (
              <div key={k} className="grid grid-cols-13 gap-1.5 items-center text-xs py-1">
                {/* Region Meta */}
                <div className="space-y-0.5 pr-2">
                  <div className="font-bold text-slate-100 flex items-center gap-1.5 truncate">
                    <span>{reg.flag}</span>
                    <span>{reg.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between">
                    <span>全球约 {reg.globalShare}%</span>
                    <span className="font-mono">{reg.annualTappingDays}天/年</span>
                  </div>
                </div>

                {/* 12 Months Cells */}
                {months.map((m) => {
                  const stage = reg.monthlyPhenology[m];
                  const info = PHENOLOGY_INFO[stage];
                  const isCurrent = m === currentMonth;

                  return (
                    <div
                      key={m}
                      className={`h-12 rounded-lg border flex flex-col items-center justify-center p-1 transition-all ${
                        info.bg
                      } ${isCurrent ? 'ring-2 ring-emerald-400 scale-105 z-10' : ''}`}
                      title={`${reg.name} ${m}月：${info.label} (${info.desc})`}
                    >
                      <span className={`text-[11px] font-bold ${info.color}`}>{info.label}</span>
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      {/* Seasonal Insights & Phenology Guide */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2.5 text-xs">
          <div className="font-bold text-emerald-400 flex items-center gap-1.5 text-sm">
            <Globe2 className="w-4 h-4" />
            <span>全球产区季节性交替规律</span>
          </div>
          <ul className="space-y-2 text-slate-300 leading-relaxed text-[11px]">
            <li>
              <strong className="text-white">● 3-4 月（全球绝对供给低谷）：</strong>{' '}
              中国西双版纳与海南全面休割；泰国南部与越南大面积落叶停割。现货流通主要消耗前一年保税区与社会库存，盘面基差易在此期间走强。
            </li>
            <li>
              <strong className="text-white">● 5-7 月（逐步复割增产）：</strong>{' '}
              新叶完全老熟，各产区陆续全面开刀。雨水若过早来临可能延缓早期开割进度，但整体供应呈现爬坡态势。
            </li>
            <li>
              <strong className="text-white">● 9-11 月（全年中泰越旺产大顶）：</strong>{' '}
              月度全球胶水产出达到顶峰，原料收购价格往往承压。需密切跟踪极端台风、暴雨导致的雨冲胶停割事件。
            </li>
            <li>
              <strong className="text-white">● 12-次年 1 月（国内停割，泰南赶产）：</strong>{' '}
              国内低温全面停割，泰国南部进入气温适宜的高产冲刺阶段，随后在 2 月中下旬逐渐迎来落叶期。
            </li>
          </ul>
        </div>

        <div className="p-5 bg-slate-800/60 border border-slate-700/60 rounded-2xl space-y-2.5 text-xs">
          <div className="font-bold text-blue-400 flex items-center gap-1.5 text-sm">
            <Compass className="w-4 h-4" />
            <span>大宗商品投研策略应用</span>
          </div>
          <ul className="space-y-2 text-slate-300 leading-relaxed text-[11px]">
            <li>
              <strong className="text-white">● 季节性买 01 抛 05 / 买 05 抛 09：</strong>{' '}
              01 合约对应停割前仓单集中注销与新胶交割，05 合约对应春季落叶停割低谷，跨期价差往往跟随物候周期呈现规律性波动。
            </li>
            <li>
              <strong className="text-white">● 胶水与杯胶价差监控：</strong>{' '}
              泰国原料价格（生胶片、田间胶水、杯胶）的溢价情况，反映加工厂对高品质全乳/浓乳 vs 20号标胶的分流博弈。
            </li>
            <li>
              <strong className="text-white">● 气候异动风险溢价：</strong>{' '}
              厄尔尼诺（干旱推迟开割）与拉尼娜（暴雨洪涝阻碍割胶）是诱发盘面脉冲式上涨的最核心天气外生变量。
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
