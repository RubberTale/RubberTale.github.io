import { RegionConfig, DayForecast, RegionWeather } from '../types';

export async function fetchRegionWeather(region: RegionConfig): Promise<RegionWeather> {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${region.lat}&longitude=${region.lon}&daily=precipitation_sum,precipitation_probability_max,temperature_2m_max,temperature_2m_min,weather_code&timezone=auto`;

    const res = await fetch(url);
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    const data = await res.json();
    const daily = data.daily;

    const days: DayForecast[] = daily.time.slice(0, 7).map((t: string, idx: number) => {
      const rainMm = daily.precipitation_sum[idx] ?? 0;
      const rainProb = daily.precipitation_probability_max[idx] ?? 0;
      const tempMax = daily.temperature_2m_max[idx] ?? 30;
      const tempMin = daily.temperature_2m_min[idx] ?? 22;
      const weatherCode = daily.weather_code[idx] ?? 0;

      const dateObj = new Date(t);
      const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][dateObj.getDay()];

      let status: DayForecast['status'] = 'SUNNY';
      if (rainMm > 25) status = 'STORM';
      else if (rainMm >= 12) status = 'HEAVY_RAIN';
      else if (rainMm >= 4) status = 'LIGHT_RAIN';

      return {
        date: t.slice(5), // MM-DD
        dayOfWeek,
        rainMm: Math.round(rainMm * 10) / 10,
        rainProb,
        tempMax: Math.round(tempMax),
        tempMin: Math.round(tempMin),
        weatherCode,
        status,
      };
    });

    const total7DayRain = Math.round(days.reduce((sum, d) => sum + d.rainMm, 0) * 10) / 10;
    const disruptionDays = days.filter((d) => d.rainMm >= 5).length;
    const heavyDays = days.filter((d) => d.rainMm >= 15).length;

    // 0 - 100 受阻指数
    const disruptionIndex = Math.min(100, Math.round(disruptionDays * 15 + heavyDays * 20));

    let statusText = '割胶作业正常，气候利于产胶';
    if (disruptionIndex > 60) {
      statusText = '连续强降雨，大面积停割 / 胶乳流失风险高';
    } else if (disruptionIndex > 30) {
      statusText = '局部降水频发，晨间割胶部分受阻，雨冲胶轻微';
    }

    return {
      regionId: region.id,
      loading: false,
      forecast: days,
      total7DayRain,
      disruptionDays,
      disruptionIndex,
      statusText,
    };
  } catch (err) {
    console.warn(`Weather fetch failed for ${region.name}, fallback to simulated data:`, err);
    return getFallbackWeather(region);
  }
}

export function getFallbackWeather(region: RegionConfig): RegionWeather {
  const today = new Date();
  const days: DayForecast[] = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dateStr = `${(d.getMonth() + 1).toString().padStart(2, '0')}-${d
      .getDate()
      .toString()
      .padStart(2, '0')}`;
    const dayOfWeek = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][d.getDay()];

    // Generate realistic tropical baseline rainfall
    const baseRain =
      region.id === 'thailand_south' ? (i % 2 === 0 ? 14.5 : 3.2) : i === 2 || i === 5 ? 18.2 : 2.5;

    let status: DayForecast['status'] = 'SUNNY';
    if (baseRain > 25) status = 'STORM';
    else if (baseRain >= 12) status = 'HEAVY_RAIN';
    else if (baseRain >= 4) status = 'LIGHT_RAIN';

    return {
      date: dateStr,
      dayOfWeek,
      rainMm: baseRain,
      rainProb: baseRain > 10 ? 75 : 25,
      tempMax: 31,
      tempMin: 23,
      weatherCode: baseRain > 10 ? 63 : 1,
      status,
    };
  });

  const total7DayRain = Math.round(days.reduce((sum, d) => sum + d.rainMm, 0) * 10) / 10;
  const disruptionDays = days.filter((d) => d.rainMm >= 5).length;
  const heavyDays = days.filter((d) => d.rainMm >= 15).length;
  const disruptionIndex = Math.min(100, Math.round(disruptionDays * 15 + heavyDays * 20));

  return {
    regionId: region.id,
    loading: false,
    forecast: days,
    total7DayRain,
    disruptionDays,
    disruptionIndex,
    statusText:
      disruptionIndex > 40
        ? '局部降水频发，晨间割胶部分受阻'
        : '割胶作业总体正常，利于产出',
  };
}
