import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Wallet, Activity, AlertTriangle } from 'lucide-react';

// --- Constants & Types ---
type AssetType = 'OIL' | 'GOLD' | 'WHEAT';

interface NewsEvent {
  id: number;
  text: string;
  impact: Record<AssetType, number>;
  duration: number;
}

interface Position {
  asset: AssetType;
  direction: 1 | -1; // 1 for Long, -1 for Short
  entryPrice: number;
  size: number;
}

const LEVERAGE = 10;
const TICK_MS = 1000;
const NEWS_INTERVAL_TICKS = 15;

const ASSET_CONFIG: Record<AssetType, { name: string, basePrice: number, vol: number, icon: string }> = {
  OIL: { name: '原油', basePrice: 75, vol: 0.02, icon: '🛢️' },
  GOLD: { name: '黄金', basePrice: 2000, vol: 0.008, icon: '✨' },
  WHEAT: { name: '小麦', basePrice: 600, vol: 0.012, icon: '🌾' },
};

const NEWS_POOL: Omit<NewsEvent, 'id'>[] = [
  { text: "中东局势升级，原油供应链面临严重威胁。", impact: { OIL: 0.15, GOLD: 0.05, WHEAT: 0 }, duration: 10 },
  { text: "美联储暗示将在更长时间内维持高利率。", impact: { OIL: -0.05, GOLD: -0.10, WHEAT: -0.02 }, duration: 15 },
  { text: "美国中西部地区报告小麦产量创历史新高。", impact: { OIL: 0, GOLD: 0, WHEAT: -0.12 }, duration: 12 },
  { text: "全球经济衰退担忧加剧，工业需求疲软。", impact: { OIL: -0.12, GOLD: 0.02, WHEAT: -0.05 }, duration: 20 },
  { text: "南非发现特大型金矿，黄金供应预期大增。", impact: { OIL: 0, GOLD: -0.08, WHEAT: 0 }, duration: 10 },
  { text: "电动汽车电池技术取得突破，长期石油依赖度降低。", impact: { OIL: -0.08, GOLD: 0, WHEAT: 0 }, duration: 25 },
  { text: "南美遭遇严重旱灾，大宗农作物减产严重。", impact: { OIL: 0, GOLD: 0, WHEAT: 0.18 }, duration: 15 },
  { text: "多国央行近期大幅增持黄金储备。", impact: { OIL: 0, GOLD: 0.12, WHEAT: 0 }, duration: 15 },
];

const App: React.FC = () => {
  // --- State ---
  const [balance, setBalance] = useState(10000);
  const [prices, setPrices] = useState<Record<AssetType, number>>({
    OIL: ASSET_CONFIG.OIL.basePrice,
    GOLD: ASSET_CONFIG.GOLD.basePrice,
    WHEAT: ASSET_CONFIG.WHEAT.basePrice,
  });
  const [priceHistory, setPriceHistory] = useState<Record<AssetType, number[]>>({
    OIL: [ASSET_CONFIG.OIL.basePrice],
    GOLD: [ASSET_CONFIG.GOLD.basePrice],
    WHEAT: [ASSET_CONFIG.WHEAT.basePrice],
  });
  const [activeAsset, setActiveAsset] = useState<AssetType>('OIL');
  const [position, setPosition] = useState<Position | null>(null);
  const [news, setNews] = useState<NewsEvent[]>([]);
  const [ticks, setTicks] = useState(0);
  const [isLiquidated, setIsLiquated] = useState(false);

  // --- Refs ---
  const activeImpactsRef = useRef<Record<AssetType, number>>({ OIL: 0, GOLD: 0, WHEAT: 0 });

  // --- Calculations ---
  const unrealizedPnL = useMemo(() => {
    if (!position) return 0;
    const currentPrice = prices[position.asset];
    return (currentPrice - position.entryPrice) * position.direction * position.size * LEVERAGE;
  }, [position, prices]);

  const equity = balance + unrealizedPnL;
  const marginUsed = position ? (position.entryPrice * position.size) : 0;

  // --- Market Engine ---
  useEffect(() => {
    if (isLiquidated) return;

    const timer = setInterval(() => {
      setTicks(t => t + 1);

      setPrices(prevPrices => {
        const nextPrices = { ...prevPrices };
        
        (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
          const config = ASSET_CONFIG[asset];
          const randomWalk = (Math.random() - 0.5) * 2 * config.vol;
          const newsImpact = activeImpactsRef.current[asset];
          
          // Apply movement
          nextPrices[asset] = prevPrices[asset] * (1 + randomWalk + newsImpact);
          
          // Slowly decay news impact
          activeImpactsRef.current[asset] *= 0.9;
        });

        return nextPrices;
      });

      // Update History
      setPriceHistory(prev => {
        const next = { ...prev };
        (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
          next[asset] = [...prev[asset].slice(-49), prices[asset]];
        });
        return next;
      });

      // Spawn News
      if (ticks > 0 && ticks % NEWS_INTERVAL_TICKS === 0) {
        const randomNews = NEWS_POOL[Math.floor(Math.random() * NEWS_POOL.length)];
        const newEvent = { ...randomNews, id: Date.now() };
        setNews(prev => [newEvent, ...prev].slice(0, 5));
        
        // Apply immediate impact
        (Object.keys(newEvent.impact) as AssetType[]).forEach(asset => {
          activeImpactsRef.current[asset] += newEvent.impact[asset] / 5; // Spread impact
        });
      }

      // Check Liquidation
      if (equity <= 0) {
        setIsLiquated(true);
        clearInterval(timer);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [ticks, prices, isLiquidated, equity]);

  // --- Trading Actions ---
  const openPosition = (dir: 1 | -1) => {
    if (position) return;
    const currentPrice = prices[activeAsset];
    const size = (balance * 0.8) / currentPrice; // Use 80% of balance for margin
    setPosition({
      asset: activeAsset,
      direction: dir,
      entryPrice: currentPrice,
      size: size
    });
  };

  const closePosition = () => {
    if (!position) return;
    setBalance(prev => prev + unrealizedPnL);
    setPosition(null);
  };

  // --- Rendering Helpers ---
  const renderChart = () => {
    const data = priceHistory[activeAsset];
    const min = Math.min(...data) * 0.99;
    const max = Math.max(...data) * 1.01;
    const range = max - min;

    return (
      <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
        <polyline
          fill="none"
          stroke={data[data.length-1] >= data[0] ? "#26a69a" : "#ef5350"}
          strokeWidth="2"
          points={data.map((p, i) => `${(i / (data.length - 1)) * 500},${300 - ((p - min) / range) * 300}`).join(' ')}
        />
      </svg>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <Activity size={32} color="#ffd700" />
          <h1 style={{ margin: 0, fontSize: '24px' }}>期货风云</h1>
        </div>
        <div style={{ display: 'flex', gap: '30px', fontSize: '18px' }}>
          <div style={{ color: '#888' }}>净资产: <span style={{ color: equity > 10000 ? '#26a69a' : '#ef5350' }}>${equity.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</span></div>
          <div style={{ color: '#888' }}>可用余额: <span style={{ color: '#fff' }}>${balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
        </div>
      </header>

      <main className="main-content">
        <div className="card chart-container">
          <div className="asset-selector">
            {(Object.keys(ASSET_CONFIG) as AssetType[]).map(asset => (
              <div 
                key={asset} 
                className={`asset-tab ${activeAsset === asset ? 'active' : ''}`}
                onClick={() => setActiveAsset(asset)}
              >
                {ASSET_CONFIG[asset].icon} {ASSET_CONFIG[asset].name}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
              {prices[activeAsset].toLocaleString(undefined, {minimumFractionDigits: 2})}
            </div>
            <div className={prices[activeAsset] >= priceHistory[activeAsset][0] ? 'price-up' : 'price-down'}>
              {((prices[activeAsset] / priceHistory[activeAsset][0] - 1) * 100).toFixed(2)}%
            </div>
          </div>
          <div style={{ height: '300px', width: '100%', background: '#111', borderRadius: '4px' }}>
            {renderChart()}
          </div>
        </div>

        <div className="card news-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#ffd700' }}>
            <Newspaper size={20} />
            <h3 style={{ margin: 0 }}>实时新闻快讯</h3>
          </div>
          {news.length === 0 && <div style={{ color: '#555', textAlign: 'center', marginTop: '20px' }}>等待市场行情事件...</div>}
          {news.map(item => (
            <div key={item.id} className="news-item">
              <span style={{ color: '#888', marginRight: '10px' }}>[{new Date(item.id).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'})}]</span>
              {item.text}
            </div>
          ))}
        </div>
      </main>

      <aside className="sidebar">
        <div className="card trading-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <Wallet size={20} color="#ffd700" />
            <h3 style={{ margin: 0 }}>交易 {ASSET_CONFIG[activeAsset].name}</h3>
          </div>
          
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>杠杆倍数: {LEVERAGE}x</div>
          
          <button 
            className="btn btn-long" 
            onClick={() => openPosition(1)}
            disabled={!!position}
          >
            买入 / 做多
          </button>
          <button 
            className="btn btn-short" 
            onClick={() => openPosition(-1)}
            disabled={!!position}
          >
            卖出 / 做空
          </button>

          {position && (
            <div style={{ marginTop: '20px', padding: '15px', background: '#222', borderRadius: '4px', borderLeft: `4px solid ${position.direction === 1 ? '#26a69a' : '#ef5350'}` }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span>{position.direction === 1 ? '做多' : '做空'} {ASSET_CONFIG[position.asset].name}</span>
                <span className={unrealizedPnL >= 0 ? 'price-up' : 'price-down'}>
                  {unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>开仓价: ${position.entryPrice.toFixed(2)}</div>
              <button className="btn btn-close" style={{ width: '100%', marginTop: '15px' }} onClick={closePosition}>
                平仓
              </button>
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>风险水平</h3>
          <div style={{ height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ 
              height: '100%', 
              width: `${Math.min(100, (Math.abs(unrealizedPnL) / balance) * 100)}%`, 
              background: unrealizedPnL < 0 ? '#ef5350' : '#26a69a' 
            }} />
          </div>
          <div style={{ fontSize: '12px', color: '#888', marginTop: '10px', textAlign: 'center' }}>
            浮动盈亏占本金比例
          </div>
        </div>
      </aside>

      {isLiquidated && (
        <div className="liquidation-overlay">
          <AlertTriangle size={64} color="#ef5350" />
          <h1 style={{ color: '#ef5350', fontSize: '48px', margin: '20px 0' }}>爆仓！</h1>
          <p style={{ fontSize: '20px', color: '#888' }}>您的净资产已亏损殆尽，账户已被强制平仓。</p>
          <button className="btn btn-long" style={{ marginTop: '30px', padding: '15px 40px' }} onClick={() => window.location.reload()}>
            重新开始职业生涯
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
