import React, { useState, useEffect, useRef, useMemo } from 'react';
import { TrendingUp, TrendingDown, Newspaper, Wallet, Activity, AlertTriangle, ChevronDown, Cloud, User, LogOut, Trophy } from 'lucide-react';

// --- Constants & Config ---
const API_BASE = 'https://emails-pharmacy-sunrise-outline.trycloudflare.com/api';
const LEVERAGE = 10;
const TICK_MS = 1000;
const NEWS_INTERVAL_TICKS = 15;

type AssetType = 'OIL' | 'GOLD' | 'SILVER' | 'BR' | 'RU' | 'MA' | 'UR' | 'TBOND';
type ViewMode = 'auto' | 'mobile' | 'desktop';

interface AssetConfig {
  name: string;
  basePrice: number;
  minPrice: number;
  maxPrice: number;
  vol: number;
  icon: string;
  precision: number; // 小数点位数
  step: number;      // 最小变动价位
}

const ASSET_CONFIG: Record<AssetType, AssetConfig> = {
  OIL: { name: '原油', basePrice: 75, minPrice: 20, maxPrice: 150, vol: 0.0025, icon: '🛢️', precision: 2, step: 0.01 },
  GOLD: { name: '黄金', basePrice: 2000, minPrice: 1200, maxPrice: 3000, vol: 0.00012, icon: '✨', precision: 2, step: 0.01 },
  SILVER: { name: '白银', basePrice: 30, minPrice: 15, maxPrice: 60, vol: 0.0015, icon: '🥈', precision: 0, step: 1 },
  BR: { name: '合成胶', basePrice: 12000, minPrice: 8000, maxPrice: 20000, vol: 0.002, icon: '🧪', precision: 0, step: 5 },
  RU: { name: '天然胶', basePrice: 13000, minPrice: 8000, maxPrice: 25000, vol: 0.002, icon: '🌲', precision: 0, step: 5 },
  MA: { name: '甲醇', basePrice: 2500, minPrice: 1500, maxPrice: 4000, vol: 0.002, icon: '🔥', precision: 0, step: 1 },
  UR: { name: '尿素', basePrice: 2200, minPrice: 1500, maxPrice: 3500, vol: 0.0018, icon: '🌾', precision: 0, step: 1 },
  TBOND: { name: '国债', basePrice: 100, minPrice: 80, maxPrice: 120, vol: 0.0005, icon: '📜', precision: 3, step: 0.005 },
};

const NEWS_POOL = [
  { text: "中东局势升级，原油供应担忧加剧。", impact: { OIL: 0.015, GOLD: 0.005, SILVER: 0.003, BR: 0.002 } as any },
  { text: "美联储维持利率不变，贵金属高位震荡。", impact: { GOLD: -0.002, SILVER: -0.004, TBOND: -0.001 } as any },
  { text: "主产区降雨充沛，天然橡胶供应前景改善。", impact: { RU: -0.012, BR: -0.005 } as any },
  { text: "甲醇港口库存大幅下降，现货挺价意愿强。", impact: { MA: 0.01, UR: 0.003 } as any },
  { text: "化肥出口政策收紧，国内尿素供应增加。", impact: { UR: -0.015, MA: -0.002 } as any },
  { text: "丁二烯价格走高，合成胶成本支撑转强。", impact: { BR: 0.008, RU: 0.003 } as any },
  { text: "全球避险情绪回落，国债收益率小幅回升。", impact: { GOLD: -0.005, SILVER: -0.008, TBOND: -0.003 } as any },
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
  
  const pricesRef = useRef<Record<AssetType, number>>(
    Object.fromEntries(Object.entries(ASSET_CONFIG).map(([k, v]) => [k, v.basePrice])) as any
  );
  const [prices, setPrices] = useState<Record<AssetType, number>>(pricesRef.current);
  
  const [priceHistory, setPriceHistory] = useState<Record<AssetType, number[]>>(
    Object.fromEntries(Object.entries(ASSET_CONFIG).map(([k, v]) => [k, [v.basePrice]])) as any
  );

  const [user, setUser] = useState<{username: string, token: string} | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
  const [authForm, setAuthForm] = useState({ username: '', password: '', isLogin: true });
  const [authMsg, setAuthMsg] = useState('');

  const activeImpactsRef = useRef<Record<AssetType, number>>(
    Object.fromEntries(Object.keys(ASSET_CONFIG).map(k => [k, 0])) as any
  );
  const lastDirectionsRef = useRef<Record<AssetType, number>>(
    Object.fromEntries(Object.keys(ASSET_CONFIG).map(k => [k, 0])) as any
  );

  useEffect(() => {
    console.log("期货风云核心逻辑版本: 3.3 - 拟真报价版 (精度与步长优化)");
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
      if (res.ok) { 
        const data = await res.json(); 
        if (isFinite(data.balance)) setBalance(data.balance); 
      }
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
        if (isFinite(data.balance)) setBalance(data.balance);
        localStorage.setItem('cc_user', JSON.stringify({ username: data.username, token: data.token }));
        setShowAuthModal(false);
      } else {
        setAuthMsg('注册成功，请登录');
        setAuthForm(f => ({ ...f, isLogin: true }));
      }
    } catch (e: any) { setAuthMsg(e.message); }
  };

  const syncBalance = async (newBalance: number) => {
    if (!user || !isFinite(newBalance)) return;
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
    const currentPrice = prices[assetKey];
    const pnl = (currentPrice - position.entryPrice) * position.direction * position.size * LEVERAGE;
    return isFinite(pnl) ? pnl : 0;
  }, [position, prices]);

  const equity = balance + unrealizedPnL;
  const currentUtilization = useMemo(() => {
    if (!position) return 0;
    const util = (position.entryPrice * position.size) / Math.max(0.001, equity);
    return isFinite(util) ? util : 0;
  }, [position, equity]);

  useEffect(() => {
    if (isLiquated) return;
    const timer = setInterval(() => {
      setTicks(t => {
        const nextTick = t + 1;
        
        const newPrices = { ...pricesRef.current };
        (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
          const config = ASSET_CONFIG[asset];
          const prevP = pricesRef.current[asset];
          
          const randomNoise = (Math.random() - 0.5) * 2.5 * config.vol;
          const momentum = lastDirectionsRef.current[asset] * 0.3 * config.vol;
          const reversion = ((config.basePrice - prevP) / config.basePrice) * 0.002;
          const newsPower = (activeImpactsRef.current[asset] || 0) * (0.7 + Math.random() * 0.6);
          
          let delta = randomNoise + momentum + reversion + newsPower;
          delta = Math.max(-0.005, Math.min(0.005, delta));
          
          let p = prevP * (1 + delta);
          
          // 核心修正：按照步长和精度修约价格
          p = Math.round(p / config.step) * config.step;
          
          if (!isFinite(p) || p <= 0) p = config.basePrice;
          p = Math.min(config.maxPrice, Math.max(config.minPrice, p));
          
          newPrices[asset] = p;
          lastDirectionsRef.current[asset] = delta > 0 ? 1 : -1;
          activeImpactsRef.current[asset] *= 0.82;
        });
        
        pricesRef.current = newPrices;
        setPrices(newPrices);
        
        setPriceHistory(prevH => {
          const nextH = { ...prevH };
          (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
            nextH[asset] = [...(prevH[asset] || [ASSET_CONFIG[asset].basePrice]).slice(-49), newPrices[asset]];
          });
          return nextH;
        });

        if (nextTick % NEWS_INTERVAL_TICKS === 0) {
          const rand = Math.random();
          const type = (rand > 0.8 ? 'INVERSE' : (rand > 0.65 ? 'NONE' : 'NORMAL')) as any;
          const rawNews = NEWS_POOL[Math.floor(Math.random() * NEWS_POOL.length)];
          const newEvent = { ...rawNews, id: Date.now(), type };
          setNews(prevN => [newEvent, ...prevN].slice(0, 5));
          
          (Object.keys(ASSET_CONFIG) as AssetType[]).forEach(asset => {
            let impact = (newEvent.impact && (newEvent.impact as any)[asset]) || 0;
            let factor = type === 'INVERSE' ? -0.7 : (type === 'NONE' ? 0.05 : 1);
            setTimeout(() => {
              activeImpactsRef.current[asset] += (impact * factor) / 3;
            }, Math.random() * 2000); 
          });
        }

        return nextTick;
      });
    }, TICK_MS);

    return () => clearInterval(timer);
  }, [isLiquated]);

  useEffect(() => {
    if (currentUtilization > 1.2 && !isLiquated) {
      setIsLiquated(true);
    }
  }, [currentUtilization, isLiquated]);

  const priceChangePercent = useMemo(() => {
    const current = prices[activeAsset];
    const initial = (priceHistory[activeAsset] ? priceHistory[activeAsset][0] : ASSET_CONFIG[activeAsset].basePrice) || ASSET_CONFIG[activeAsset].basePrice;
    const pc = ((current / initial - 1) * 100);
    return isFinite(pc) ? pc.toFixed(2) : "0.00";
  }, [prices, priceHistory, activeAsset]);

  const openPosition = (dir: 1 | -1) => {
    if (position || isLiquated) return;
    const price = pricesRef.current[activeAsset];
    if (price <= 0) return;
    const size = (balance * utilizationRate) / price;
    if (!isFinite(size) || size <= 0) return;
    setPosition({ asset: activeAsset, direction: dir, entryPrice: price, size });
  };

  const closePosition = () => {
    if (position) {
      const pnl = unrealizedPnL;
      const newBalance = balance + pnl;
      if (isFinite(newBalance)) {
        setBalance(newBalance);
        syncBalance(newBalance);
      }
      setPosition(null);
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
            <span className="current-price">
              {prices[activeAsset].toLocaleString(undefined, {
                minimumFractionDigits: ASSET_CONFIG[activeAsset].precision,
                maximumFractionDigits: ASSET_CONFIG[activeAsset].precision
              })}
            </span>
            <span className={`price-change ${prices[activeAsset] >= (priceHistory[activeAsset] ? priceHistory[activeAsset][0] : prices[activeAsset]) ? 'up' : 'down'}`}>
              {priceChangePercent}%
            </span>
          </div>
        </div>
        <div className="chart-container mini-chart">
          <svg width="100%" height="100%" viewBox="0 0 500 300" preserveAspectRatio="none">
            <polyline fill="none" stroke={(priceHistory[activeAsset] && priceHistory[activeAsset][priceHistory[activeAsset].length-1] >= priceHistory[activeAsset][0]) ? "#26a69a" : "#ef5350"} strokeWidth="2"
              points={(priceHistory[activeAsset] || [prices[activeAsset]]).map((p, i) => `${(i / (Math.max(1, (priceHistory[activeAsset] ? priceHistory[activeAsset].length : 1) - 1))) * 500},${300 - ((p - (Math.min(...(priceHistory[activeAsset] || [p]))*0.995)) / (Math.max(...(priceHistory[activeAsset] || [p]))*1.005 - Math.min(...(priceHistory[activeAsset] || [p]))*0.995 + 0.001)) * 300}`).join(' ')} />
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
        </div>
        <div className="news-panel-compact">
          {news.length === 0 && <div className="news-placeholder">等待消息...</div>}
          {news.map((item: any) => (
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
