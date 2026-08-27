// App.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Swords, Sparkles, RefreshCw, Layers, Trophy, HelpCircle, AlertCircle } from 'lucide-react';
import { IntroPrologue } from './components/IntroPrologue';
import { TradingChart, CandleData } from './components/TradingChart';
import { HUD } from './components/HUD';
import { TruthModal } from './components/TruthModal';
import { FamousModal, FamousBattleItem } from './components/FamousModal';
import { sounds } from './soundEngine';

// Backend API URL
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://127.0.0.1:8088'
  : 'https://140.245.65.111.sslip.io/api/kline-duel';

export function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  // Game data state
  const [gameId, setGameId] = useState<string>("");
  const [codeAlias, setCodeAlias] = useState<string>("未知标的");
  const [visibleCandles, setVisibleCandles] = useState<CandleData[]>([]);
  const [allCandles, setAllCandles] = useState<CandleData[]>([]);
  const [secretCandles, setSecretCandles] = useState<CandleData[]>([]);
  const [entryPrice, setEntryPrice] = useState<number>(100);

  // Gameplay state
  const [gameState, setGameState] = useState<'loading' | 'decision' | 'playing' | 'revealed'>('loading');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [leverage, setLeverage] = useState<number>(5);
  const [playerAction, setPlayerAction] = useState<'long' | 'short' | 'skip' | null>(null);
  const [playbackIdx, setPlaybackIdx] = useState<number>(0);
  const [currentPnL, setCurrentPnL] = useState<number>(0);

  // Settle result state
  const [truthResult, setTruthResult] = useState<any>(null);
  const [isTruthModalOpen, setIsTruthModalOpen] = useState<boolean>(false);
  const [isFamousModalOpen, setIsFamousModalOpen] = useState<boolean>(false);
  const [famousBattles, setFamousBattles] = useState<FamousBattleItem[]>([]);
  const [activeFamousTitle, setActiveFamousTitle] = useState<string | null>(null);

  const [speed, setSpeed] = useState<number>(() => {
    const saved = localStorage.getItem('kline_duel_speed');
    return saved ? parseFloat(saved) || 1.0 : 1.0;
  });
  const speedRef = useRef<number>(speed);

  const handleSetSpeed = (newSpeed: number) => {
    setSpeed(newSpeed);
    speedRef.current = newSpeed;
    localStorage.setItem('kline_duel_speed', String(newSpeed));
    sounds.playTerminalBeep(600 + newSpeed * 100, 0.05);
  };

  // Overall player stats
  const [stats, setStats] = useState({
    totalRounds: 0,
    wins: 0,
    totalProfitPct: 0.0,
    maxStreak: 0,
    currentStreak: 0,
  });

  const timerRef = useRef<any>(null);
  const playbackTimerRef = useRef<any>(null);
  const stepRef = useRef<number>(0);
  const secretsRef = useRef<CandleData[]>([]);
  const settlementDataRef = useRef<any>(null);
  const initialVisibleCountRef = useRef<number>(0);

  // Fetch famous battles catalog on mount
  useEffect(() => {
    fetch(`${API_BASE}/famous_list`)
      .then(res => res.json())
      .then(data => {
        if (data.battles) setFamousBattles(data.battles);
      })
      .catch(err => console.warn("Failed to load famous battles:", err));
  }, []);

  // Fetch new blind box
  const fetchNewGame = async (famousId?: string) => {
    setGameState('loading');
    setPlayerAction(null);
    setTruthResult(null);
    setIsTruthModalOpen(false);
    setCurrentPnL(0);
    setTimeLeft(30);

    if (timerRef.current) clearInterval(timerRef.current);
    if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);

    try {
      const url = famousId ? `${API_BASE}/draw_famous?id=${famousId}` : `${API_BASE}/draw`;
      const res = await fetch(url);
      const data = await res.json();

      setGameId(data.game_id);
      setCodeAlias(data.code_alias);
      setVisibleCandles(data.visible_candles);
      setAllCandles(data.visible_candles);
      setEntryPrice(data.entry_baseline_price || data.visible_candles[data.visible_candles.length - 1].close);
      setActiveFamousTitle(data.famous_title || null);

      setGameState('decision');
      startCountdown();
    } catch (err) {
      console.error("Error drawing blind box:", err);
      // Fallback mock if server unreachable
      alert("连接数据引擎失败，请检查网络！");
      setGameState('decision');
    }
  };

  // 30s Countdown timer
  const startCountdown = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimeLeft(30);

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTrade('skip'); // Auto skip on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle Trade Decision
  const handleTrade = async (action: 'long' | 'short' | 'skip') => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPlayerAction(action);
    sounds.playOrderSound(action);

    setGameState('playing');

    // Request settlement & secret trajectory from backend
    try {
      const res = await fetch(`${API_BASE}/settle`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          game_id: gameId,
          action,
          leverage,
        })
      });
      const data = await res.json();
      setTruthResult(data);
      setSecretCandles(data.secret_candles || []);

      // Start fast playback with configurable speed (default 180ms base)
      startFastPlayback(data.secret_candles || [], data);
    } catch (err) {
      console.error("Settlement error:", err);
      alert("结算失败，请重试");
    }
  };

  // Fast Playback Animation Loop
  const startFastPlayback = (secrets: CandleData[], settlementData: any) => {
    stepRef.current = 0;
    secretsRef.current = secrets;
    settlementDataRef.current = settlementData;
    initialVisibleCountRef.current = visibleCandles.length;

    if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);

    const stepTick = () => {
      const step = stepRef.current;
      const allSecrets = secretsRef.current;
      const data = settlementDataRef.current;
      const initialCount = initialVisibleCountRef.current;

      if (step < allSecrets.length) {
        const nextCandle = allSecrets[step];
        setAllCandles(prev => [...prev, nextCandle]);
        setPlaybackIdx(initialCount + step);

        // Update live PnL ticker
        if (data.pnl_track && data.pnl_track[step] !== undefined) {
          setCurrentPnL(data.pnl_track[step]);
        }

        // Sound tick
        sounds.playCandleTick(nextCandle.close >= nextCandle.open);

        // Check if stopped or liquidated early
        if (data.liquidated && step >= (data.liq_step || 0)) {
          finishRound(data);
          return;
        }

        stepRef.current = step + 1;
        // Base delay is 180ms (slowed down from original 100ms)
        const delay = Math.max(30, Math.round(180 / (speedRef.current || 1.0)));
        playbackTimerRef.current = setTimeout(stepTick, delay);
      } else {
        finishRound(data);
      }
    };

    const initialDelay = Math.max(30, Math.round(180 / (speedRef.current || 1.0)));
    playbackTimerRef.current = setTimeout(stepTick, initialDelay);
  };

  // Finish Round & Reveal
  const finishRound = (settlementData: any) => {
    if (playbackTimerRef.current) clearTimeout(playbackTimerRef.current);
    setGameState('revealed');
    setIsTruthModalOpen(true);

    // Update stats
    const isWin = settlementData.final_roi > 0 && !settlementData.liquidated;
    setStats(prev => {
      const newStreak = isWin ? prev.currentStreak + 1 : 0;
      return {
        totalRounds: prev.totalRounds + 1,
        wins: prev.wins + (isWin ? 1 : 0),
        totalProfitPct: Math.round((prev.totalProfitPct + settlementData.final_roi) * 10) / 10,
        currentStreak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
      };
    });
  };

  // Emergency exit button during playback
  const handleEmergencyExit = () => {
    if (playbackTimerRef.current) {
      clearTimeout(playbackTimerRef.current);
    }
    sounds.playTerminalBeep(500, 0.1);
    if (truthResult) {
      finishRound(truthResult);
    }
  };

  const toggleSound = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex flex-col justify-between select-none">
      {/* Plan A: Cinematic Intro Sequence */}
      {showIntro && (
        <IntroPrologue
          onComplete={() => {
            setShowIntro(false);
            fetchNewGame();
          }}
        />
      )}

      {/* Navigation Top Header */}
      <header className="w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md px-4 py-3 flex items-center justify-between z-30">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-base md:text-lg font-black tracking-tight text-white flex items-center gap-2">
              <span>K线盲盒 · 极速决斗</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                PRO
              </span>
            </h1>
          </div>

          {activeFamousTitle ? (
            <div className="hidden sm:flex items-center gap-1 text-xs font-mono px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300">
              <Swords size={13} />
              <span>{activeFamousTitle}</span>
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-1 text-xs font-mono text-slate-400 px-2 py-1 rounded bg-slate-900 border border-slate-800">
              <span>{codeAlias}</span>
            </div>
          )}
        </div>

        {/* Global Stats HUD */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="hidden md:flex items-center gap-4 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            <div>
              <span className="text-slate-400">总胜率: </span>
              <b className="text-emerald-400">
                {stats.totalRounds > 0 ? `${Math.round((stats.wins / stats.totalRounds) * 100)}%` : '0%'}
              </b>
              <span className="text-slate-500 text-[10px] ml-1">({stats.wins}/{stats.totalRounds})</span>
            </div>
            <div className="text-slate-700">|</div>
            <div>
              <span className="text-slate-400">累计收益: </span>
              <b className={stats.totalProfitPct >= 0 ? 'text-red-400' : 'text-emerald-400'}>
                {stats.totalProfitPct >= 0 ? `+${stats.totalProfitPct}%` : `${stats.totalProfitPct}%`}
              </b>
            </div>
            <div className="text-slate-700">|</div>
            <div>
              <span className="text-slate-400">连胜: </span>
              <b className="text-amber-400">{stats.currentStreak} 🔥</b>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsFamousModalOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-amber-400 transition-all cursor-pointer"
              title="切换历史名局专题"
            >
              <Layers size={14} />
              <span className="hidden sm:inline">名局谱</span>
            </button>

            <button
              onClick={() => fetchNewGame()}
              className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="重新抽取盲盒"
            >
              <RefreshCw size={15} />
            </button>

            <button
              onClick={toggleSound}
              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                isMuted
                  ? 'bg-slate-900 border-slate-800 text-slate-500'
                  : 'bg-slate-900 border-slate-700 text-emerald-400'
              }`}
              title={isMuted ? "取消静音" : "静音"}
            >
              {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Duel Arena */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-3 md:p-6 flex flex-col gap-4">
        {/* Trading Canvas Chart */}
        <div className="flex-1 w-full min-h-[420px]">
          <TradingChart
            candles={allCandles}
            entryIdx={visibleCandles.length - 1}
            action={playerAction}
            playbackIdx={playbackIdx}
            isRevealing={gameState === 'playing' || gameState === 'revealed'}
          />
        </div>

        {/* HUD Control Area */}
        <HUD
          timeLeft={timeLeft}
          gameState={gameState === 'loading' ? 'decision' : gameState}
          leverage={leverage}
          setLeverage={setLeverage}
          speed={speed}
          setSpeed={handleSetSpeed}
          onTrade={handleTrade}
          currentPnL={currentPnL}
          onEmergencyExit={handleEmergencyExit}
          action={playerAction}
        />
      </main>

      {/* Footer info */}
      <footer className="w-full py-2 border-t border-slate-900 text-center text-[11px] font-mono text-slate-600">
        行情数据来自 MySQL · 真实历史切片 · 去量纲脱敏运算 · 极速盘感训练引擎
      </footer>

      {/* The Big Reveal Truth Modal */}
      <TruthModal
        isOpen={isTruthModalOpen}
        truth={truthResult?.truth || null}
        finalRoi={truthResult?.final_roi || 0}
        liquidated={truthResult?.liquidated || false}
        action={playerAction}
        leverage={leverage}
        styleTags={truthResult?.style_tags || []}
        verdict={truthResult?.verdict || ""}
        onNextRound={() => fetchNewGame()}
        onOpenFamousList={() => {
          setIsTruthModalOpen(false);
          setIsFamousModalOpen(true);
        }}
      />

      {/* Famous Battles List Modal */}
      <FamousModal
        isOpen={isFamousModalOpen}
        onClose={() => setIsFamousModalOpen(false)}
        battles={famousBattles}
        onSelectBattle={(id) => fetchNewGame(id)}
      />
    </div>
  );
}
