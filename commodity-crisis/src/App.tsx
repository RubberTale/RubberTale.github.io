import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Wallet, Activity, AlertTriangle } from 'lucide-react';

// --- Constants & Types ---
type AssetType = 'OIL' | 'GOLD' | 'WHEAT' | 'MA' | 'CU' | 'RU' | 'TBOND';
type ViewMode = 'auto' | 'mobile' | 'desktop';

interface NewsEvent {
  id: number;
  text: string;
  impact: Record<AssetType, number>;
  duration: number;
  type: 'NORMAL' | 'INVERSE' | 'NONE'; 
}

interface Position {
  asset: AssetType;
  direction: 1 | -1;
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
  MA: { name: '甲醇', basePrice: 2500, vol: 0.025, icon: '🧪' },
  CU: { name: '沪铜', basePrice: 70000, vol: 0.015, icon: '🧱' },
  RU: { name: '橡胶', basePrice: 13000, vol: 0.022, icon: '🌲' },
  TBOND: { name: '国债', basePrice: 100, vol: 0.003, icon: '📜' },
};

const NEWS_POOL: Omit<NewsEvent, 'id' | 'type'>[] = [
  { text: "中东局势升级，原油供应链面临严重威胁。", impact: { OIL: 0.15, GOLD: 0.05, WHEAT: 0, MA: 0, CU: 0, RU: 0, TBOND: -0.01 }, duration: 10 },
  { text: "美联储暗示将在更长时间内维持高利率。", impact: { OIL: -0.05, GOLD: -0.10, WHEAT: -0.02, MA: -0.04, CU: -0.06, RU: -0.03, TBOND: -0.05 }, duration: 15 },
  { text: "南美遭遇严重旱灾，大宗农作物减产严重。", impact: { OIL: 0, GOLD: 0, WHEAT: 0.18, MA: 0, CU: 0, RU: 0, TBOND: 0 }, duration: 15 },
  { text: "多国央行近期大幅增持黄金储备。", impact: { OIL: 0, GOLD: 0.12, WHEAT: 0, MA: 0, CU: 0, RU: 0, TBOND: 0.01 }, duration: 15 },
  { text: "煤炭价格大幅波动，甲醇生产成本支撑增强。", impact: { OIL: 0, GOLD: 0, WHEAT: 0, MA: 0.12, CU: 0, RU: 0, TBOND: 0 }, duration: 10 },
  { text: "全球最大铜矿罢工，供应中断忧虑加剧。", impact: { OIL: 0, GOLD: 0, WHEAT: 0, MA: 0, CU: 0.18, RU: 0, TBOND: 0 }, duration: 15 },
  { text: "产胶国降雨过多，橡胶收割工作大面积停滞。", impact: { OIL: 0, GOLD: 0, WHEAT: 0, MA: 0, CU: 0, RU: 0.15, TBOND: 0 }, duration: 12 },
  { text: "避险情绪升温，资金疯狂涌入长久期国债。", impact: { OIL: -0.03, GOLD: 0.08, WHEAT: 0, MA: -0.02, CU: -0.04, RU: -0.03, TBOND: 0.06 }, duration: 15 },
  { text: "市场传闻：主要经济体计划联合释放原油储备。", impact: { OIL: -0.10, GOLD: -0.02, WHEAT: 0, MA: -0.03, CU: -0.02, RU: 0, TBOND: 0.01 }, duration: 10 },
  { text: "房地产业复苏迹象明显，工业金属需求看涨。", impact: { OIL: 0.04, GOLD: -0.02, WHEAT: 0, MA: 0.06, CU: 0.12, RU: 0.08, TBOND: -0.03 }, duration: 15 },
];

const App: React.FC = () => {
  const [balance, setBalance] = useState(10000);
  const [viewMode, setViewMode] = useState<ViewMode>('auto');
  const [prices, setPrices] = useState<Record<AssetType, number>>({
    OIL: ASSET_CONFIG.OIL.basePrice, GOLD: ASSET_CONFIG.GOLD.basePrice, WHEAT: ASSET_CONFIG.WHEAT.basePrice,
    MA: ASSET_CONFIG.MA.basePrice, CU: ASSET_CONFIG.CU.basePrice, RU: ASSET_CONFIG.RU.basePrice, TBOND: ASSET_CONFIG.TBOND.basePrice
  });
  const [priceHistory, setPriceHistory] = useState<Record<AssetType, number[]>>({
    OIL: [ASSET_CONFIG.OIL.basePrice], GOLD: [ASSET_CONFIG.GOLD.basePrice], WHEAT: [ASSET_CONFIG.WHEAT.basePrice],
    MA: [ASSET_CONFIG.MA.basePrice], CU: [ASSET_CONFIG.CU.basePrice], RU: [ASSET_CONFIG.RU.basePrice], TBOND: [ASSET_CONFIG.TBOND.basePrice]
  });
  const [activeAsset, setActiveAsset] = useState<AssetType>('OIL');
  const [position, setPosition] = useState<Position | null>(null);
  const [news, setNews] = useState<NewsEvent[]>([]);
  const [ticks, setTicks] = useState(0);
  const [isLiquated, setIsLiquated] = useState(false);
  const [utilizationRate, setUtilizationRate] = useState(0.8); 

  const activeImpactsRef = useRef<Record<AssetType, number>>({ 
    OIL: 0, GOLD: 0, WHEAT: 0, MA: 0, CU: 0, RU: 0, TBOND: 0 
  });

  const unrealizedPnL = useMemo(() => {
    if (!position) return 0;
    return (prices[position.asset] - position.entryPrice) * position.direction * position.size * LEVERAGE;
  }, [position, prices]);

  const equity = balance + unrealizedPnL;
  const currentUtilization = useMemo(() => {
    if (!position) return 0;
    return (position.entryPrice * position.size) / Math.max(0.001, equity);
  }, [position, equity]);

  useEffect(() => {
    if (isLiquated) return;
    const timer = setInterval(() => {
      setTicks(t => t + 1);
      setPrices(prev => {
        const next = { ...prev };
        (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
          const randomWalk = (Math.random() - 0.5) * 2 * ASSET_CONFIG[asset].vol;
          next[asset] = prev[asset] * (1 + randomWalk + activeImpactsRef.current[asset]);
          activeImpactsRef.current[asset] *= 0.85;
        });
        return next;
      });
      setPriceHistory(prev => {
        const next = { ...prev };
        (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
          next[asset] = [...prev[asset].slice(-49), prices[asset]];
        });
        return next;
      });
      if (ticks > 0 && ticks % NEWS_INTERVAL_TICKS === 0) {
        const rand = Math.random();
        const type = (rand > 0.85 ? 'INVERSE' : (rand > 0.7 ? 'NONE' : 'NORMAL')) as any;
        const newEvent = { ...NEWS_POOL[Math.floor(Math.random() * NEWS_POOL.length)], id: Date.now(), type };
        setNews(prev => [newEvent, ...prev].slice(0, 5));
        (Object.keys(newEvent.impact) as AssetType[]).forEach(asset => {
          let factor = type === 'INVERSE' ? -0.6 : (type === 'NONE' ? 0.05 : 1);
          activeImpactsRef.current[asset] += (newEvent.impact[asset] * factor) / 4; 
        });
      }
      if (currentUtilization > 1.2) { setIsLiquated(true); clearInterval(timer); }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [ticks, prices, isLiquated, currentUtilization]);

  const openPosition = (dir: 1 | -1) => {
    if (position) return;
    const price = prices[activeAsset];
    setPosition({ asset: activeAsset, direction: dir, entryPrice: price, size: (balance * utilizationRate) / price });
  };

  const closePosition = () => { if (position) { setBalance(prev => prev + unrealizedPnL); setPosition(null); } };

  return (
    <div className={`app-container ${viewMode === 'mobile' ? 'force-mobile' : viewMode === 'desktop' ? 'force-desktop' : ''}`}>
      <header className="header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={32} color="#ffd700" />
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>期货风云</h1>
            <div style={{ display: 'flex', gap: '8px', marginTop: '4px', flexWrap: 'wrap' }}>
              <a href="/" style={{ color: '#aaa', fontSize: '12px', textDecoration: 'none', border: '1px solid #444', padding: '2px 8px', borderRadius: '4px' }}>返回首页</a>
              <button onClick={() => setViewMode(prev => prev === 'mobile' ? 'desktop' : 'mobile')} style={{ background: 'none', border: '1px solid #444', color: '#ffd700', fontSize: '12px', padding: '2px 8px', borderRadius: '4px', cursor: 'pointer' }}>
                切至{viewMode === 'mobile' ? '电脑' : '手机'}
              </button>
              <span id="busuanzi_container_page_pv" style={{ color: '#666', fontSize: '12px' }}>访客: <span id="busuanzi_value_page_pv"></span></span>
            </div>
          </div>
        </div>
        <div className="header-stats">
          <div style={{ color: '#888' }}>净资产: <span style={{ color: equity > 10000 ? '#26a69a' : '#ef5350', fontWeight: 'bold' }}>${equity.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></div>
          <div style={{ color: '#888' }}>余额: <span style={{ color: '#fff' }}>${balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
        </div>
      </header>

      <div className="card chart-card">
        <div className="asset-selector">
          {(Object.keys(ASSET_CONFIG) as AssetType[]).map(asset => (
            <div key={asset} className={`asset-tab ${activeAsset === asset ? 'active' : ''}`} onClick={() => setActiveAsset(asset)}>
              {ASSET_CONFIG[asset].icon} {ASSET_CONFIG[asset].name}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{prices[activeAsset].toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
          <div className={prices[activeAsset] >= priceHistory[activeAsset][0] ? 'price-up' : 'price-down'}>
            {((prices[activeAsset] / priceHistory[activeAsset][0] - 1) * 100).toFixed(2)}%
          </div>
        </div>
        <div className="chart-container">
          <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
            <polyline fill="none" stroke={priceHistory[activeAsset][priceHistory[activeAsset].length-1] >= priceHistory[activeAsset][0] ? "#26a69a" : "#ef5350"} strokeWidth="2"
              points={priceHistory[activeAsset].map((p, i) => `${(i / (priceHistory[activeAsset].length - 1)) * 500},${300 - ((p - (Math.min(...priceHistory[activeAsset])*0.99)) / (Math.max(...priceHistory[activeAsset])*1.01 - Math.min(...priceHistory[activeAsset])*0.99)) * 300}`).join(' ')} />
          </svg>
        </div>
      </div>

      <div className="card trading-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <Wallet size={20} color="#ffd700" /><h3 style={{ margin: 0 }}>交易 {ASSET_CONFIG[activeAsset].name}</h3>
        </div>
        <div style={{ fontSize: '14px', color: '#888', marginBottom: '10px' }}>杠杆: {LEVERAGE}x | 使用率: {(utilizationRate * 100).toFixed(0)}%</div>
        <div style={{ display: 'flex', gap: '5px', marginBottom: '15px', flexWrap: 'wrap' }}>
          {[0.1, 0.3, 0.5, 0.8, 1.0].map(rate => (
            <button key={rate} onClick={() => setUtilizationRate(rate)} style={{ flex: 1, padding: '6px', fontSize: '12px', background: utilizationRate === rate ? '#444' : '#222', border: utilizationRate === rate ? '1px solid #ffd700' : '1px solid #444', borderRadius: '4px', color: '#fff', cursor: 'pointer' }}>{rate*100}%</button>
          ))}
        </div>
        <button className="btn btn-long" onClick={() => openPosition(1)} disabled={!!position} style={{ marginBottom: '10px' }}>买入 / 做多</button>
        <button className="btn btn-short" onClick={() => openPosition(-1)} disabled={!!position}>卖出 / 做空</button>
        {position && (
          <div style={{ marginTop: '15px', padding: '15px', background: '#222', borderRadius: '4px', borderLeft: `4px solid ${position.direction === 1 ? '#26a69a' : '#ef5350'}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
              <span>{position.direction === 1 ? '做多' : '做空'} {ASSET_CONFIG[position.asset].name}</span>
              <span className={unrealizedPnL >= 0 ? 'price-up' : 'price-down'}>{unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <button className="btn btn-close" style={{ marginTop: '10px' }} onClick={closePosition}>平仓结算</button>
          </div>
        )}
      </div>

      <div className="card news-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px', color: '#ffd700' }}>
          <Newspaper size={20} /><h3 style={{ margin: 0 }}>实时快讯</h3>
        </div>
        <div className="news-panel">
          {news.length === 0 && <div style={{ color: '#555', textAlign: 'center' }}>等待行情事件...</div>}
          {news.map(item => (
            <div key={item.id} className="news-item">
              <span style={{ color: '#888', marginRight: '8px' }}>[{new Date(item.id).toLocaleTimeString()}]</span>
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <div className="card risk-card">
        <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>实时风控</h3>
        <div style={{ height: '10px', background: '#333', borderRadius: '5px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${Math.min(100, (currentUtilization / 1.2) * 100)}%`, background: currentUtilization > 1.0 ? '#ef5350' : '#26a69a' }} />
        </div>
        <div style={{ fontSize: '12px', color: '#888', marginTop: '10px', textAlign: 'center' }}>资金使用率: {(currentUtilization * 100).toFixed(1)}% / 120%</div>
      </div>

      {isLiquated && (
        <div className="liquidation-overlay">
          <AlertTriangle size={64} color="#ef5350" />
          <h1 style={{ color: '#ef5350', fontSize: '48px', margin: '20px 0' }}>爆仓！</h1>
          <p style={{ fontSize: '20px', color: '#888' }}>您的净资产已亏损殆尽。</p>
          <button className="btn btn-long" style={{ marginTop: '30px', padding: '15px 40px', width: 'auto' }} onClick={() => window.location.reload()}>重新开始职业生涯</button>
        </div>
      )}
    </div>
  );
};

export default App;
