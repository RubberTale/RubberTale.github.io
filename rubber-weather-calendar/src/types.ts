export type RegionId =
  | 'xishuangbanna'
  | 'hainan'
  | 'thailand_south'
  | 'vietnam'
  | 'indonesia';

export type PhenologyStage =
  | 'OFF' // 休割停割 (落叶抽叶)
  | 'START' // 试割/开割初期
  | 'RISING' // 增产期
  | 'PEAK' // 旺产高峰期
  | 'FALLING'; // 减产衰退期

export interface RegionConfig {
  id: RegionId;
  name: string;
  subName: string;
  country: string;
  flag: string;
  globalShare: number; // 全球产量占比 %
  lat: number;
  lon: number;
  monthlyPhenology: Record<number, PhenologyStage>; // 1-12 月
  annualTappingDays: number;
  description: string;
}

export interface DayForecast {
  date: string;
  dayOfWeek: string;
  rainMm: number;
  rainProb: number;
  tempMax: number;
  tempMin: number;
  weatherCode: number;
  status: 'SUNNY' | 'LIGHT_RAIN' | 'HEAVY_RAIN' | 'STORM';
}

export interface RegionWeather {
  regionId: RegionId;
  loading: boolean;
  error?: string;
  forecast: DayForecast[];
  total7DayRain: number;
  disruptionDays: number;
  disruptionIndex: number; // 0 - 100 割胶受阻指数
  statusText: string;
}

export interface SimulatorState {
  monthlyRainDays: number; // 月度降雨天数
  heavyRainDays: number; // 其中大雨暴雨天数
  diseaseLevel: 'NONE' | 'LIGHT' | 'SEVERE'; // 落叶白粉病/炭疽病
}
