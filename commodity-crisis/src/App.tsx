import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Wallet, Activity, AlertTriangle, ChevronDown } from 'lucide-react';

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
        <div className="header-left">
          <Activity size={24} color="#ffd700" />
          <h1 style={{ margin: 0, fontSize: '20px' }}>期货风云</h1>
          <div className="header-actions">
            <a href="/" className="small-link">返回</a>
            <button onClick={() => setViewMode(prev => prev === 'mobile' ? 'desktop' : 'mobile')} className="small-btn">
              {viewMode === 'mobile' ? '电脑' : '手机'}
            </button>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-line">资产: <span style={{ color: equity > 10000 ? '#26a69a' : '#ef5350' }}>${equity.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
          <div className="stat-line">余额: <span>${balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
        </div>
      </header>

      <div className="card chart-card">
        <div className="chart-header">
          <div className="select-wrapper">
            <select value={activeAsset} onChange={(e) => setActiveAsset(e.target.value as AssetType)} className="styled-select">
              {(Object.keys(ASSET_CONFIG) as AssetType[]).map(asset => (
                <option key={asset} value={asset}>{ASSET_CONFIG[asset].icon} {ASSET_CONFIG[asset].name}</option>
              ))}
            </select>
            <ChevronDown size={14} className="select-icon" />
          </div>
          <div className="chart-price-box">
            <span className="current-price">{prices[activeAsset].toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            <span className={`price-change ${prices[activeAsset] >= priceHistory[activeAsset][0] ? 'up' : 'down'}`}>
              {((prices[activeAsset] / priceHistory[activeAsset][0] - 1) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
        <div className="chart-container mini-chart">
          <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
            <polyline fill="none" stroke={priceHistory[activeAsset][priceHistory[activeAsset].length-1] >= priceHistory[activeAsset][0] ? "#26a69a" : "#ef5350"} strokeWidth="2"
              points={priceHistory[activeAsset].map((p, i) => `${(i / (priceHistory[activeAsset].length - 1)) * 500},${300 - ((p - (Math.min(...priceHistory[activeAsset])*0.99)) / (Math.max(...priceHistory[activeAsset])*1.01 - Math.min(...priceHistory[activeAsset])*0.99)) * 300}`).join(' ')} />
          </svg>
        </div>
      </div>

      <div className="card trading-card">
        <div className="trading-header">
          <div className="trading-title">
            <Wallet size={18} color="#ffd700" />
            <span className="asset-name">{ASSET_CONFIG[activeAsset].name}</span>
          </div>
          <div className="trading-buttons-inline">
            <button className="mini-btn btn-long" onClick={() => openPosition(1)} disabled={!!position}>做多</button>
            <button className="mini-btn btn-short" onClick={() => openPosition(-1)} disabled={!!position}>做空</button>
          </div>
        </div>
        
        <div className="trading-settings">
          <span className="label">杠杆: {LEVERAGE}x</span>
          <div className="select-wrapper">
            <select value={utilizationRate} onChange={(e) => setUtilizationRate(parseFloat(e.target.value))} className="styled-select-small">
              {[0.1, 0.3, 0.5, 0.8, 1.0].map(rate => (
                <option key={rate} value={rate}>仓位: {rate*100}%</option>
              ))}
            </select>
            <ChevronDown size={12} className="select-icon" />
          </div>
        </div>

        {position && (
          <div className="active-position">
            <div className="pos-info">
              <span>{position.direction === 1 ? '多' : '空'} {ASSET_CONFIG[position.asset].name}</span>
              <span className={unrealizedPnL >= 0 ? 'price-up' : 'price-down'}>{unrealizedPnL >= 0 ? '+' : ''}{unrealizedPnL.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>
            <button className="btn-close-compact" onClick={closePosition}>平仓</button>
          </div>
        )}
      </div>

      <div className="card news-card">
        <div className="news-header-mini">
          <Newspaper size={16} /> <span>快讯</span>
          <span id="busuanzi_container_page_pv" className="visitor-count"> 访客: <span id="busuanzi_value_page_pv"></span></span>
        </div>
        <div className="news-panel-compact">
          {news.length === 0 && <div className="news-placeholder">等待市场消息...</div>}
          {news.map(item => (
            <div key={item.id} className="news-item-mini">
              {item.text}
            </div>
          ))}
        </div>
      </div>

      <div className="card risk-card-mini">
        <div className="risk-header">
          <span>风险: {(currentUtilization * 100).toFixed(1)}%</span>
          <div className="risk-bar-container">
            <div className="risk-bar" style={{ width: `${Math.min(100, (currentUtilization / 1.2) * 100)}%`, background: currentUtilization > 1.0 ? '#ef5350' : '#26a69a' }} />
          </div>
        </div>
      </div>

      {isLiquated && (
        <div className="liquidation-overlay">
          <AlertTriangle size={48} color="#ef5350" />
          <h1 style={{ color: '#ef5350', fontSize: '36px', margin: '15px 0' }}>爆仓！</h1>
          <p style={{ fontSize: '16px', color: '#888' }}>账户净资产已亏损殆尽。</p>
          <button className="btn btn-long" style={{ marginTop: '20px', padding: '12px 30px', width: 'auto' }} onClick={() => window.location.reload()}>重新开始</button>
        </div>
      )}
    </div>
  );
};

export default App;
