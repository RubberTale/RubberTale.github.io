import React, { useState, useEffect } from 'react';
import { ActiveTab, Header } from './components/Header';
import { PhenologyMatrix } from './components/PhenologyMatrix';
import { WeatherDashboard } from './components/WeatherDashboard';
import { ImpactSimulator } from './components/ImpactSimulator';
import { REGION_CONFIGS } from './constants/regions';
import { RegionId, RegionWeather } from './types';
import { fetchRegionWeather, getFallbackWeather } from './utils/weatherService';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('calendar');
  const [refreshing, setRefreshing] = useState<boolean>(false);

  // Initialize weatherMap with fallback data so there's never an empty screen
  const [weatherMap, setWeatherMap] = useState<Record<RegionId, RegionWeather>>(() => {
    const initial: any = {};
    for (const key of Object.keys(REGION_CONFIGS) as RegionId[]) {
      initial[key] = getFallbackWeather(REGION_CONFIGS[key]);
    }
    return initial;
  });

  const loadAllWeather = async () => {
    setRefreshing(true);
    const keys = Object.keys(REGION_CONFIGS) as RegionId[];
    const promises = keys.map((k) => fetchRegionWeather(REGION_CONFIGS[k]));
    const results = await Promise.all(promises);

    const updated: any = {};
    results.forEach((r) => {
      updated[r.regionId] = r;
    });

    setWeatherMap(updated);
    setRefreshing(false);
  };

  useEffect(() => {
    loadAllWeather();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRefreshWeather={loadAllWeather}
        refreshing={refreshing}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'calendar' && <PhenologyMatrix />}
        {activeTab === 'weather' && <WeatherDashboard weatherMap={weatherMap} />}
        {activeTab === 'simulator' && <ImpactSimulator />}
      </main>

      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-5 text-xs text-slate-500 text-center space-y-1">
        <p>橡胶童话 · 橡胶产业气象与物候大数据看板 | 跟踪全球主产区天气异动与季节性供需周期</p>
        <p className="text-[11px] text-slate-600">
          气象数据来源于 Open-Meteo 全球数值预报系统。农业产出受树龄、病害、割胶劳工等多重微观变量综合决定，测算结果供投研参考。
        </p>
      </footer>
    </div>
  );
};
