// IntroPrologue.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, FastForward, Terminal, Sparkles, Volume2, ShieldAlert } from 'lucide-react';
import { sounds } from '../soundEngine';

interface IntroPrologueProps {
  onComplete: () => void;
  onOpenAuth: () => void;
  user: any;
}

const NARRATIVE_LINES = [
  "正在连接大宗商品全历史数据库 [1,127,511 根真实K线] ...",
  "每一根蜡烛图的跳动，都是千万交易者真金白银的博弈与信仰。",
  "当隐去品种名称与时间坐标，撕下所有的先入为主……",
  "直面最原始的K线形态与量价博弈，你的盘感，还灵验吗？",
  "30秒一次生死抉择。准备好迎接历史风暴了吗？"
];

export const IntroPrologue: React.FC<IntroPrologueProps> = ({ onComplete, onOpenAuth, user }) => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentLineIdx, setCurrentLineIdx] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingDone, setIsTypingDone] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background Canvas: Flowing Cyber K-lines & Floating Price Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Mock flowing candlestick bars in background
    const barsCount = Math.floor(width / 16);
    const bars = Array.from({ length: barsCount }, (_, i) => ({
      x: i * 16,
      open: 100 + Math.sin(i * 0.2) * 30 + Math.random() * 10,
      close: 100 + Math.sin(i * 0.2) * 30 + Math.random() * 20 - 10,
      high: 140,
      low: 70,
      speed: 0.5 + Math.random() * 0.5
    }));

    const render = () => {
      ctx.fillStyle = 'rgba(2, 6, 23, 0.25)';
      ctx.fillRect(0, 0, width, height);

      // Draw faint cyber grid
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.04)';
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw glowing drifting K-lines
      const midY = height * 0.55;
      bars.forEach(b => {
        const isUp = b.close >= b.open;
        const color = isUp ? 'rgba(34, 197, 94, 0.35)' : 'rgba(239, 68, 68, 0.35)';
        const glow = isUp ? 'rgba(34, 197, 94, 0.6)' : 'rgba(239, 68, 68, 0.6)';

        const yOpen = midY - (b.open - 100) * 3;
        const yClose = midY - (b.close - 100) * 3;
        const yHigh = Math.min(yOpen, yClose) - 10;
        const yLow = Math.max(yOpen, yClose) + 10;

        ctx.strokeStyle = glow;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(b.x + 4, yHigh);
        ctx.lineTo(b.x + 4, yLow);
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.fillRect(b.x + 1, Math.min(yOpen, yClose), 7, Math.max(3, Math.abs(yClose - yOpen)));

        // Shift left
        b.x -= 0.8;
        if (b.x < -20) {
          b.x = width + 10;
          b.open = 100 + Math.random() * 40 - 20;
          b.close = b.open + (Math.random() * 20 - 10);
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  // Typewriter effect logic
  useEffect(() => {
    if (!hasStarted) return;

    if (currentLineIdx >= NARRATIVE_LINES.length) {
      setIsTypingDone(true);
      const timer = setTimeout(() => {
        onComplete();
      }, 1200);
      return () => clearTimeout(timer);
    }

    const currentLine = NARRATIVE_LINES[currentLineIdx] || "";
    let charIdx = 0;
    setDisplayedText("");

    const interval = setInterval(() => {
      charIdx++;
      if (charIdx <= currentLine.length) {
        setDisplayedText(currentLine.substring(0, charIdx));
        if (charIdx % 3 === 0) {
          sounds.playTerminalBeep(700 + charIdx * 8, 0.03);
        }
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setCurrentLineIdx(prev => prev + 1);
        }, 1200);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [hasStarted, currentLineIdx, onComplete]);

  const handleStartAudioAndIntro = () => {
    sounds.setMuted(false);
    sounds.startBGM();
    sounds.playWinFanfare();
    setHasStarted(true);
  };

  const handleSkip = () => {
    sounds.playTerminalBeep(990, 0.1);
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-slate-100 overflow-hidden font-sans select-none">
      {/* Background dynamic canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />

      {/* Cyber scanline overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(to_bottom,rgba(255,255,255,0),rgba(255,255,255,0)_50%,rgba(0,0,0,0.4)_50%,rgba(0,0,0,0.4))] bg-[length:100%_4px] opacity-40" />

      {/* Skip button in upper right */}
      {hasStarted && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-20 flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-900/80 backdrop-blur-md text-xs font-mono text-slate-400 hover:text-emerald-400 hover:border-emerald-500/50 transition-all shadow-lg active:scale-95"
        >
          <FastForward size={14} />
          跳过序幕 [ESC / 点击]
        </button>
      )}

      {/* Main Narrative Container */}
      <div className="relative z-10 max-w-2xl w-full px-6 flex flex-col items-center text-center">
        {!hasStarted ? (
          /* Initial Screen to activate audio on user interaction */
          <div className="flex flex-col items-center animate-fade-in w-full max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400 text-xs font-mono mb-4 tracking-wider">
              <Sparkles size={14} className="animate-spin text-emerald-400" />
              HISTORICAL MARKET BLIND BOX v1.1
            </div>

            <h1 className="text-3xl md:text-5xl font-black tracking-tight mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-emerald-400 drop-shadow-sm">
              K线盲盒 · 极速决斗
            </h1>

            <p className="text-slate-400 text-xs md:text-sm max-w-md mb-6 leading-relaxed">
              随机抽取真实历史切片 · 去除代码与时间 · 30秒极限交易博弈
            </p>

            {/* Mode selection guide card */}
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6 text-left">
              {/* Guest Card */}
              <div className="p-3.5 rounded-xl border border-slate-800 bg-slate-900/60 backdrop-blur-sm flex flex-col justify-between">
                <div>
                  <div className="text-xs font-bold text-amber-400 flex items-center gap-1 mb-1">
                    ⚡ 游客极速模式
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    免注册、免登录、0 门槛随时玩。战绩仅保存于本地浏览器。
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-slate-500 font-mono">
                  适合：随时刷一把练习盘感
                </div>
              </div>

              {/* Account Card */}
              <div className={`p-3.5 rounded-xl border transition-all flex flex-col justify-between ${
                user
                  ? 'border-emerald-500/50 bg-emerald-950/30'
                  : 'border-slate-800 bg-slate-900/60 hover:border-emerald-500/40'
              }`}>
                <div>
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1 mb-1">
                    🏆 专属操盘账户
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    {user
                      ? `已登录: ${user.username} (${user.phone})`
                      : '手机号注册登录。每笔交易收益率永久存档于服务器，冲击全网榜单！'}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-emerald-500 font-mono">
                  {user ? '✅ 云端档案已连接' : '适合：记录长期战绩与公开展示'}
                </div>
              </div>
            </div>

            {/* Start / Login Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <button
                onClick={handleStartAudioAndIntro}
                className="w-full sm:w-auto group relative inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-sm tracking-wide bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 shadow-[0_0_30px_rgba(16,185,129,0.4)] hover:shadow-[0_0_40px_rgba(16,185,129,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                <Terminal size={18} className="group-hover:rotate-12 transition-transform" />
                <span>{user ? '进入时空决斗 (已登录)' : '直接开始 (游客体验)'}</span>
              </button>

              {!user && (
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-800/80 active:scale-95 text-xs font-bold text-slate-300 hover:text-emerald-400 transition-all cursor-pointer"
                >
                  注册 / 登录账户
                </button>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-5">
              <Volume2 size={13} />
              <span>建议戴上耳机体验完整音效</span>
            </div>
          </div>
        ) : (
          /* Cinematic Typewriter Prologue */
          <div className="w-full flex flex-col items-center">
            {/* Hologram Terminal Header */}
            <div className="flex items-center gap-3 px-4 py-1.5 rounded-lg border border-slate-800 bg-slate-900/90 text-xs font-mono text-slate-400 mb-8 backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>ARCHIVE RECORD #{currentLineIdx + 1}/5</span>
            </div>

            {/* Typewriter text display */}
            <div className="min-h-[140px] flex items-center justify-center">
              <p className="text-lg md:text-2xl font-medium tracking-wide text-slate-100 font-mono leading-relaxed drop-shadow-md">
                {displayedText}
                <span className="inline-block w-2.5 h-6 ml-1.5 bg-emerald-400 animate-pulse align-middle" />
              </p>
            </div>

            {/* Progress bar dots */}
            <div className="flex items-center gap-2 mt-8">
              {NARRATIVE_LINES.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === currentLineIdx
                      ? 'w-8 bg-emerald-400'
                      : i < currentLineIdx
                      ? 'w-3 bg-emerald-800'
                      : 'w-2 bg-slate-800'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
