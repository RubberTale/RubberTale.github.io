import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Wallet, Activity, AlertTriangle } from 'lucide-react';

// --- Constants & Types ---
type AssetType = 'OIL' | 'GOLD' | 'WHEAT' | 'MA' | 'CU' | 'RU' | 'TBOND';

interface NewsEvent {
  id: number;
  text: string;
  impact: Record<AssetType, number>;
  duration: number;
  type: 'NORMAL' | 'INVERSE' | 'NONE'; // 新增新闻类型
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
  // --- State ---
  const [balance, setBalance] = useState(10000);
  const [prices, setPrices] = useState<Record<AssetType, number>>({
    OIL: ASSET_CONFIG.OIL.basePrice,
    GOLD: ASSET_CONFIG.GOLD.basePrice,
    WHEAT: ASSET_CONFIG.WHEAT.basePrice,
    MA: ASSET_CONFIG.MA.basePrice,
    CU: ASSET_CONFIG.CU.basePrice,
    RU: ASSET_CONFIG.RU.basePrice,
    TBOND: ASSET_CONFIG.TBOND.basePrice,
  });
  const [priceHistory, setPriceHistory] = useState<Record<AssetType, number[]>>({
    OIL: [ASSET_CONFIG.OIL.basePrice],
    GOLD: [ASSET_CONFIG.GOLD.basePrice],
    WHEAT: [ASSET_CONFIG.WHEAT.basePrice],
    MA: [ASSET_CONFIG.MA.basePrice],
    CU: [ASSET_CONFIG.CU.basePrice],
    RU: [ASSET_CONFIG.RU.basePrice],
    TBOND: [ASSET_CONFIG.TBOND.basePrice],
  });
  const [activeAsset, setActiveAsset] = useState<AssetType>('OIL');
  const [position, setPosition] = useState<Position | null>(null);
  const [news, setNews] = useState<NewsEvent[]>([]);
  const [ticks, setTicks] = useState(0);
  const [isLiquidated, setIsLiquated] = useState(false);
  const [utilizationRate, setUtilizationRate] = useState(0.8); // 默认80%使用率

  // --- Refs ---
  const activeImpactsRef = useRef<Record<AssetType, number>>({ 
    OIL: 0, GOLD: 0, WHEAT: 0, MA: 0, CU: 0, RU: 0, TBOND: 0 
  });

  // --- Calculations ---
  const unrealizedPnL = useMemo(() => {
    if (!position) return 0;
    const currentPrice = prices[position.asset];
    return (currentPrice - position.entryPrice) * position.direction * position.size * LEVERAGE;
  }, [position, prices]);

  const equity = balance + unrealizedPnL;

  // 实时资金使用率计算：(开仓占用的保证金 / 当前净资产)
  const currentUtilization = useMemo(() => {
    if (!position) return 0;
    const initialMargin = position.entryPrice * position.size;
    return initialMargin / Math.max(0.001, equity); // 避免除以0
  }, [position, equity]);

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
          
          // 模拟市场多变性：小概率新闻被其他隐性因素抵消或反转
          nextPrices[asset] = prevPrices[asset] * (1 + randomWalk + newsImpact);
          
          // 缓慢衰减新闻影响
          activeImpactsRef.current[asset] *= 0.85;
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
        
        // 随机分配新闻质量：NORMAL(正常), INVERSE(反转), NONE(失效)
        const rand = Math.random();
        const type = rand > 0.85 ? 'INVERSE' : (rand > 0.7 ? 'NONE' : 'NORMAL');
        
        const newEvent = { ...randomNews, id: Date.now(), type };
        setNews(prev => [newEvent, ...prev].slice(0, 5));
        
        // Apply immediate impact based on type
        (Object.keys(newEvent.impact) as AssetType[]).forEach(asset => {
          let factor = 1;
          if (type === 'INVERSE') factor = -0.6; // 反着来，且程度稍轻
          if (type === 'NONE') factor = 0.05;    // 几乎没反应
          
          activeImpactsRef.current[asset] += (newEvent.impact[asset] * factor) / 4; 
        });
      }

      // Check Liquidation: 资金使用率超过 120% 爆仓
      if (currentUtilization > 1.2) {
        setIsLiquidated(true);
        clearInterval(timer);
      }
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [ticks, prices, isLiquidated, currentUtilization]);

  // --- Trading Actions ---
  const openPosition = (dir: 1 | -1) => {
    if (position) return;
    const currentPrice = prices[activeAsset];
    const size = (balance * utilizationRate) / currentPrice; // 使用自定义使用率
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
          <div>
            <h1 style={{ margin: 0, fontSize: '24px' }}>期货风云</h1>
            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <a href="/" style={{ color: '#aaa', fontSize: '12px', textDecoration: 'none', border: '1px solid #444', padding: '2px 8px', borderRadius: '4px' }}>返回博客主页</a>
              <span id="busuanzi_container_page_pv" style={{ color: '#666', fontSize: '12px', display: 'none' }}>
                访客: <span id="busuanzi_value_page_pv"></span>
              </span>
            </div>
          </div>
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

          <div style={{ marginBottom: '15px' }}>
            <div style={{ fontSize: '12px', color: '#888', marginBottom: '8px' }}>资金使用率: {(utilizationRate * 100).toFixed(0)}%</div>
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[0.1, 0.3, 0.5, 0.8, 1.0].map(rate => (
                <button 
                  key={rate}
                  onClick={() => setUtilizationRate(rate)}
                  style={{ 
                    padding: '4px 6px', 
                    fontSize: '11px', 
                    background: utilizationRate === rate ? '#444' : '#222',
                    border: utilizationRate === rate ? '1px solid #ffd700' : '1px solid #444',
                    borderRadius: '4px',
                    color: '#fff',
                    cursor: 'pointer',
                    flex: '1 0 30%'
                  }}
                >
                  {rate * 100}%
                </button>
              ))}
            </div>
          </div>
          
          <button 
            className="btn btn-long" 
            onClick={() => openPosition(1)}
            disabled={!!position}
            style={{ width: '100%', marginBottom: '10px' }}
          >
            买入 / 做多
          </button>
          <button 
            className="btn btn-short" 
            onClick={() => openPosition(-1)}
            disabled={!!position}
            style={{ width: '100%' }}
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
