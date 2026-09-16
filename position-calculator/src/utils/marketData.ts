import { LatestPricesPayload } from '../types';

export async function fetchLatestPrices(): Promise<LatestPricesPayload | null> {
  const possibleUrls = [
    '/tools/data/latest_prices.json',
    '../data/latest_prices.json',
    './data/latest_prices.json',
    './latest_prices.json',
  ];

  for (const url of possibleUrls) {
    try {
      const res = await fetch(`${url}?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.varieties) {
          return data as LatestPricesPayload;
        }
      }
    } catch {
      // try next fallback
    }
  }
  return null;
}
