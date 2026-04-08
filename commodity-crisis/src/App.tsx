import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Wallet, Activity, AlertTriangle, ChevronDown, Cloud, User, LogOut, Trophy } from 'lucide-react';

// --- Constants & Config ---
const API_BASE = 'https://emails-pharmacy-sunrise-outline.trycloudflare.com/api';
const LEVERAGE = 10;
const TICK_MS = 1000;
const NEWS_INTERVAL_TICKS = 15;

type AssetType = 'OIL' | 'GOLD' | 'WHEAT' | 'MA' | 'CU' | 'RU' | 'TBOND';
type ViewMode = 'auto' | 'mobile' | 'desktop';

const ASSET_CONFIG: Record<AssetType, { name: string, basePrice: number, minPrice: number, maxPrice: number, vol: number, icon: string }> = {
  OIL: { name: '原油', basePrice: 75, minPrice: 20, maxPrice: 150, vol: 0.0025, icon: '🛢️' },
  GOLD: { name: '黄金', basePrice: 2000, minPrice: 1200, maxPrice: 3000, vol: 0.00012, icon: '✨' },
  WHEAT: { name: '小麦', basePrice: 600, minPrice: 300, maxPrice: 1200, vol: 0.00018, icon: '🌾' },
  MA: { name: '甲醇', basePrice: 2500, minPrice: 1500, maxPrice: 4500, vol: 0.00035, icon: '🧪' },
  CU: { name: '沪铜', basePrice: 70000, minPrice: 40000, maxPrice: 100000, vol: 0.0002, icon: '🧱' },
  RU: { name: '橡胶', basePrice: 13000, minPrice: 8000, maxPrice: 25000, vol: 0.0003, icon: '🌲' },
  TBOND: { name: '国债', basePrice: 100, minPrice: 80, maxPrice: 120, vol: 0.0005, icon: '📜' },
};

const NEWS_POOL = [
  { text: "中东局势升级，供应担忧缓解。", impact: { OIL: 0.012, GOLD: 0.004, WHEAT: 0, MA: 0, CU: 0, RU: 0, TBOND: -0.001 } },
  { text: "美联储维持现状，暗示政策转向仍需时日。", impact: { OIL: -0.004, GOLD: -0.008, WHEAT: -0.002, MA: -0.003, CU: -0.005, RU: -0.002, TBOND: -0.004 } },
  { text: "全球最大铜矿进入紧急状态。", impact: { OIL: 0, GOLD: 0, WHEAT: 0, MA: 0, CU: 0.015, RU: 0, TBOND: 0 } },
  { text: "煤化工行业新规发布，产能受限。", impact: { OIL: 0, GOLD: 0, WHEAT: 0, MA: 0.015, CU: 0, RU: 0, TBOND: 0 } },
  { text: "避险需求回落，黄金价格承压。", impact: { OIL: 0.002, GOLD: -0.010, WHEAT: 0, MA: 0.001, CU: 0.003, RU: 0.002, TBOND: -0.002 } },
];

const App: React.FC = () => {
  const [balance, setBalance] = useState(10000);
  const [viewMode, setViewMode] = useState<ViewMode>('auto');
  const [activeAsset, setActiveAsset] = useState<AssetType>('OIL');
  const [position, setPosition] = useState<any>(null);
  const [news, setNews] = useState<any[]>([]);
  const [ticks, setTicks] = useState(0);
  const [isLiquated, setIsLiquated] = useState(false);
  const [utilizationRate, setUtilizationRate] = useState(0.8);
  const [prices, setPrices] = useState<Record<AssetType, number>>(() => 
    Object.fromEntries(Object.entries(ASSET_CONFIG).map(([k, v]) => [k, v.basePrice])) as any
  );
  const [priceHistory, setPriceHistory] = useState<Record<AssetType, number[]>>(() => 
    Object.fromEntries(Object.entries(ASSET_CONFIG).map(([k, v]) => [k, [v.basePrice]])) as any
  );

  const [user, setUser] = useState<{username: string, token: string} | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [authForm, setAuthForm] = useState({ username: '', password: '', isLogin: true });
  const [authMsg, setAuthMsg] = useState('');

  const activeImpactsRef = useRef<Record<AssetType, number>>({ OIL: 0, GOLD: 0, WHEAT: 0, MA: 0, CU: 0, RU: 0, TBOND: 0 });
  const lastDirectionsRef = useRef<Record<AssetType, number>>({ OIL: 0, GOLD: 0, WHEAT: 0, MA: 0, CU: 0, RU: 0, TBOND: 0 });

  useEffect(() => {
    const saved = localStorage.getItem('cc_user');
    if (saved) {
      const parsed = JSON.parse(saved);
      setUser(parsed);
      fetchProfile(parsed.token);
    }
  }, []);

  const fetchProfile = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE}/user/profile`, { headers: { 'Authorization': `Bearer ${token}` } });
      if (res.ok) { const data = await res.json(); setBalance(data.balance); }
    } catch (e) { console.error('Profile fetch failed'); }
  };

  const fetchLeaderboard = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/leaderboard`);
      if (res.ok) { const data = await res.json(); setLeaderboardData(data); setShowLeaderboard(true); }
    } catch (e) { console.error('Leaderboard fetch failed'); }
  };

  const handleAuth = async () => {
    setAuthMsg('请求中...');
    const path = authForm.isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await fetch(`${API_BASE}${path}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: authForm.username, password: authForm.password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || '请求失败');
      if (authForm.isLogin) {
        setUser({ username: data.username, token: data.token });
        setBalance(data.balance);
        localStorage.setItem('cc_user', JSON.stringify({ username: data.username, token: data.token }));
        setShowAuthModal(false);
      } else {
        setAuthMsg('注册成功，请登录');
        setAuthForm(f => ({ ...f, isLogin: true }));
      }
    } catch (e: any) { setAuthMsg(e.message); }
  };

  const syncBalance = async (newBalance: number) => {
    if (!user) return;
    try {
      await fetch(`${API_BASE}/user/save-balance`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
        body: JSON.stringify({ balance: newBalance })
      });
    } catch (e) { console.error('Sync failed'); }
  };

  const logout = () => { setUser(null); localStorage.removeItem('cc_user'); };

  const unrealizedPnL = useMemo(() => {
    if (!position) return 0;
    const assetKey = position.asset as AssetType;
    return (prices[assetKey] - position.entryPrice) * position.direction * position.size * LEVERAGE;
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
      
      let nextPrices: Record<AssetType, number>;
      
      setPrices(prev => {
        const next = { ...prev };
        (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
          const config = ASSET_CONFIG[asset];
          const randomNoise = (Math.random() - 0.5) * 2.5 * config.vol;
          const momentum = lastDirectionsRef.current[asset] * 0.3 * config.vol;
          
          // 数学修正：拉力改为基于百分比，防止黄金/沪铜等高价品种产生超巨额拉力
          const reversion = ((config.basePrice - prev[asset]) / config.basePrice) * 0.002;
          
          const newsPower = activeImpactsRef.current[asset] * (0.7 + Math.random() * 0.6);
          const delta = randomNoise + momentum + reversion + newsPower;
          
          let p = prev[asset] * (1 + delta);
          p = Math.min(config.maxPrice, Math.max(config.minPrice, p));
          next[asset] = p;
          
          lastDirectionsRef.current[asset] = delta > 0 ? 1 : -1;
          activeImpactsRef.current[asset] *= 0.82;
        });
        nextPrices = next;
        return next;
      });

      setPriceHistory(prev => {
        const next = { ...prev };
        (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
          const currentP = nextPrices ? nextPrices[asset] : ASSET_CONFIG[asset].basePrice;
          next[asset] = [...prev[asset].slice(-49), currentP];
        });
        return next;
      });

      if (ticks > 0 && ticks % NEWS_INTERVAL_TICKS === 0) {
        const rand = Math.random();
        const type = (rand > 0.8 ? 'INVERSE' : (rand > 0.65 ? 'NONE' : 'NORMAL')) as any;
        const rawNews = NEWS_POOL[Math.floor(Math.random() * NEWS_POOL.length)];
        const newEvent = { ...rawNews, id: Date.now(), type };
        setNews(prev => [newEvent, ...prev].slice(0, 5));
        
        (Object.keys(newEvent.impact) as AssetType[]).forEach(asset => {
          let factor = type === 'INVERSE' ? -0.7 : (type === 'NONE' ? 0.05 : 1);
          setTimeout(() => {
            activeImpactsRef.current[asset] += (newEvent.impact[asset as AssetType] * factor) / 3;
          }, Math.random() * 2000); 
        });
      }
      if (currentUtilization > 1.2) { setIsLiquated(true); clearInterval(timer); }
    }, TICK_MS);
    return () => clearInterval(timer);
  }, [ticks, isLiquated, currentUtilization]);

  const priceChangePercent = useMemo(() => {
    const current = prices[activeAsset];
    const initial = priceHistory[activeAsset][0] || ASSET_CONFIG[activeAsset].basePrice;
    return ((current / initial - 1) * 100).toFixed(2);
  }, [prices, priceHistory, activeAsset]);

  const openPosition = (dir: 1 | -1) => {
    if (position) return;
    const price = prices[activeAsset];
    setPosition({ asset: activeAsset, direction: dir, entryPrice: price, size: (balance * utilizationRate) / price });
  };

  const closePosition = () => {
    if (position) {
      const newBalance = balance + unrealizedPnL;
      setBalance(newBalance); setPosition(null); syncBalance(newBalance);
    }
  };

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
            {user ? (
              <button onClick={logout} className="small-btn" title="退出"><LogOut size={12} /></button>
            ) : (
              <button onClick={() => setShowAuthModal(true)} className="small-btn" style={{ color: '#ffd700' }}><Cloud size={12} />存档</button>
            )}
            <button onClick={fetchLeaderboard} className="small-btn" style={{ color: '#ffd700' }}><Trophy size={12} />榜单</button>
          </div>
        </div>
        <div className="header-stats">
          <div className="stat-line">资产: <span style={{ color: equity > 10000 ? '#26a69a' : '#ef5350' }}>${equity.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
          <div className="stat-line">{user ? user.username : '游客'}余额: <span>${balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</span></div>
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
              {priceChangePercent}%
            </span>
          </div>
        </div>
        <div className="chart-container mini-chart">
          <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
            <polyline fill="none" stroke={priceHistory[activeAsset][priceHistory[activeAsset].length-1] >= priceHistory[activeAsset][0] ? "#26a69a" : "#ef5350"} strokeWidth="2"
              points={priceHistory[activeAsset].map((p, i) => `${(i / (priceHistory[activeAsset].length - 1)) * 500},${300 - ((p - (Math.min(...priceHistory[activeAsset])*0.995)) / (Math.max(...priceHistory[activeAsset])*1.005 - Math.min(...priceHistory[activeAsset])*0.995)) * 300}`).join(' ')} />
          </svg>
        </div>
      </div>

      <div className="card trading-card">
        <div className="trading-header">
          <div className="trading-title"><Wallet size={18} color="#ffd700" /><span className="asset-name">{ASSET_CONFIG[activeAsset].name}</span></div>
          <div className="trading-buttons-inline">
            <button className="mini-btn btn-long" onClick={() => openPosition(1)} disabled={!!position}>做多</button>
            <button className="mini-btn btn-short" onClick={() => openPosition(-1)} disabled={!!position}>做空</button>
          </div>
        </div>
        <div className="trading-settings">
          <span className="label">杠杆: {LEVERAGE}x</span>
          <div className="select-wrapper">
            <select value={utilizationRate} onChange={(e) => setUtilizationRate(parseFloat(e.target.value))} className="styled-select-small">
              {[0.1, 0.3, 0.5, 0.8, 1.0].map(rate => (<option key={rate} value={rate}>仓位: {rate*100}%</option>))}
            </select>
            <ChevronDown size={12} className="select-icon" />
          </div>
        </div>
        {position && (
          <div className="active-position">
            <div className="pos-info">
              <span>{position.direction === 1 ? '多' : '空'} {ASSET_CONFIG[position.asset as AssetType].name}</span>
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
          {news.length === 0 && <div className="news-placeholder">等待消息...</div>}
          {news.map(item => (
            <div key={item.id} className="news-item-mini">{item.text}</div>
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

      {showLeaderboard && (
        <div className="auth-overlay">
          <div className="auth-card" style={{ maxWidth: '400px' }}>
            <h3 style={{ color: '#ffd700', marginBottom: '15px' }}><Trophy size={20} style={{ verticalAlign: 'middle', marginRight: '8px' }}/>财富排行榜</h3>
            <div style={{ maxHeight: '300px', overflowY: 'auto', marginBottom: '20px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead><tr style={{ borderBottom: '1px solid #444', color: '#888' }}><th style={{ padding: '8px', textAlign: 'left' }}>排名</th><th style={{ padding: '8px', textAlign: 'left' }}>玩家</th><th style={{ padding: '8px', textAlign: 'right' }}>净资产</th></tr></thead>
                <tbody>{leaderboardData.map((row, i) => (<tr key={i} style={{ borderBottom: '1px solid #222' }}><td style={{ padding: '10px 8px' }}>{i + 1}</td><td style={{ padding: '10px 8px', fontWeight: 'bold' }}>{row.username}</td><td style={{ padding: '10px 8px', textAlign: 'right', color: '#26a69a' }}>${row.balance.toLocaleString(undefined, {maximumFractionDigits: 0})}</td></tr>))}</tbody>
              </table>
            </div>
            <button className="btn btn-long" onClick={() => setShowLeaderboard(false)}>关闭</button>
          </div>
        </div>
      )}

      {showAuthModal && (
        <div className="auth-overlay">
          <div className="auth-card">
            <h3>{authForm.isLogin ? '登录云端' : '创建账户'}</h3>
            <p style={{ color: '#ef5350', fontSize: '12px' }}>{authMsg}</p>
            <input type="text" placeholder="用户名" className="auth-input" value={authForm.username} onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))}/>
            <input type="password" placeholder="密码" className="auth-input" value={authForm.password} onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))}/>
            <button className="btn btn-long" style={{ marginTop: '10px' }} onClick={handleAuth}>{authForm.isLogin ? '立即登录' : '立即注册'}</button>
            <button className="small-btn" style={{ marginTop: '15px', border: 'none' }} onClick={() => setAuthForm(f => ({ ...f, isLogin: !f.isLogin }))}>{authForm.isLogin ? '没有账号？去注册' : '已有账号？去登录'}</button>
            <button className="small-btn" style={{ marginTop: '10px' }} onClick={() => setShowAuthModal(false)}>取消</button>
          </div>
        </div>
      )}

      {isLiquated && (
        <div className="liquidation-overlay">
          <AlertTriangle size={48} color="#ef5350" /><h1 style={{ color: '#ef5350', fontSize: '36px', margin: '15px 0' }}>爆仓！</h1>
          <p style={{ fontSize: '16px', color: '#888' }}>账户净资产已亏损殆尽。</p>
          <button className="btn btn-long" style={{ marginTop: '20px', padding: '12px 30px', width: 'auto' }} onClick={() => {
            setIsLiquated(false); setBalance(10000); syncBalance(10000); window.location.reload();
          }}>重新开始</button>
        </div>
      )}
    </div>
  );
};

export default App;
