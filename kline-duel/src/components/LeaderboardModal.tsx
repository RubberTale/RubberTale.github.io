// LeaderboardModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Trophy, Activity, User, ShieldAlert, Award, Calendar, Flame, TrendingUp, TrendingDown, EyeOff, RefreshCw, ChevronRight, ArrowLeft } from 'lucide-react';
import { sounds } from '../soundEngine';

interface LeaderboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
  currentUser: any;
  userToken: string | null;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({
  isOpen,
  onClose,
  apiBase,
  currentUser,
  userToken
}) => {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'public_stream' | 'my_dossier'>('leaderboard');
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [publicTrades, setPublicTrades] = useState<any[]>([]);
  const [myTrades, setMyTrades] = useState<any[]>([]);
  const [myProfile, setMyProfile] = useState<any>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [playerTrades, setPlayerTrades] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard();
      fetchPublicTrades();
      if (userToken) {
        fetchMyProfile();
      }
    }
  }, [isOpen, userToken]);

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/leaderboard`);
      const data = await res.json();
      if (data.leaderboard) {
        setLeaderboard(data.leaderboard);
      }
    } catch (e) {
      console.warn("Failed to load leaderboard:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchPublicTrades = async () => {
    try {
      const res = await fetch(`${apiBase}/public/recent_trades`);
      const data = await res.json();
      if (data.trades) {
        setPublicTrades(data.trades);
      }
    } catch (e) {
      console.warn("Failed to load public trades:", e);
    }
  };

  const fetchMyProfile = async () => {
    if (!userToken) return;
    try {
      const res = await fetch(`${apiBase}/user/profile`, {
        headers: { 'Authorization': `Bearer ${userToken}` }
      });
      const data = await res.json();
      if (data.id) {
        setMyProfile(data);
        if (data.recent_trades) setMyTrades(data.recent_trades);
      }
    } catch (e) {
      console.warn("Failed to load my profile:", e);
    }
  };

  const inspectPlayer = async (username: string) => {
    setSelectedPlayer(username);
    setLoading(true);
    sounds.playTerminalBeep(650, 0.05);
    try {
      const res = await fetch(`${apiBase}/user/trades?username=${encodeURIComponent(username)}`);
      const data = await res.json();
      setPlayerTrades(data.trades || []);
    } catch (e) {
      console.warn("Failed to load player trades:", e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative max-w-3xl w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <Trophy size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide flex items-center gap-2">
                <span>全网风云榜 · 操盘战绩簿</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
                  REAL-TIME
                </span>
              </h2>
              <p className="text-xs text-slate-400">记录全服玩家每笔真实交易收益率与操作细节</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                fetchLeaderboard();
                fetchPublicTrades();
                if (userToken) fetchMyProfile();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="刷新数据"
            >
              <RefreshCw size={16} />
            </button>
            <button
              onClick={() => {
                setSelectedPlayer(null);
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        {!selectedPlayer && (
          <div className="flex border-b border-slate-800 mt-2 shrink-0">
            <button
              onClick={() => setActiveTab('leaderboard')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'leaderboard'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Trophy size={14} /> 英雄榜单
            </button>
            <button
              onClick={() => setActiveTab('public_stream')}
              className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'public_stream'
                  ? 'border-emerald-400 text-emerald-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity size={14} /> 全网战绩流水
            </button>
            {currentUser && (
              <button
                onClick={() => setActiveTab('my_dossier')}
                className={`px-4 py-2.5 text-xs font-bold transition-all border-b-2 cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'my_dossier'
                    ? 'border-sky-400 text-sky-300'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <User size={14} /> 我的操盘档案
              </button>
            )}
          </div>
        )}

        {/* Breadcrumb if inspecting player */}
        {selectedPlayer && (
          <div className="flex items-center gap-2 py-3 px-1 text-xs border-b border-slate-800 shrink-0">
            <button
              onClick={() => setSelectedPlayer(null)}
              className="flex items-center gap-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft size={14} /> 返回榜单
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-amber-400 font-bold">操盘手「{selectedPlayer}」的历史交易档案</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto py-3 space-y-3 pr-1">
          {/* 1. Inspecting a player's trade list */}
          {selectedPlayer ? (
            <div>
              {loading ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">加载交易记录中...</div>
              ) : playerTrades.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">暂无历史交易数据</div>
              ) : (
                <div className="space-y-2">
                  {playerTrades.map(trade => (
                    <div
                      key={trade.id}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 gap-2"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg text-xs font-bold ${
                          trade.action === 'long'
                            ? 'bg-red-950/80 border border-red-500/40 text-red-400'
                            : trade.action === 'short'
                            ? 'bg-emerald-950/80 border border-emerald-500/40 text-emerald-400'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {trade.action === 'long' ? '做多' : trade.action === 'short' ? '做空' : '观望'}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-white text-sm">{trade.variety_name}</span>
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                              {trade.leverage}x
                            </span>
                            {trade.famous_title && (
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950/60 border border-amber-500/30 text-amber-400">
                                名局
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>{trade.trade_time}</span>
                            {trade.verdict && <span>• {trade.verdict}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-right sm:pl-4">
                        <div className={`text-base font-black font-mono ${
                          trade.liquidated
                            ? 'text-red-500'
                            : trade.roi_pct > 0
                            ? 'text-red-400'
                            : trade.roi_pct < 0
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }`}>
                          {trade.liquidated ? '💥 爆仓 -100%' : trade.roi_pct > 0 ? `+${trade.roi_pct}%` : `${trade.roi_pct}%`}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'leaderboard' ? (
            /* 2. Global Leaderboard */
            <div>
              {loading ? (
                <div className="text-center py-12 text-slate-500 text-xs font-mono">加载排行榜中...</div>
              ) : leaderboard.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">
                  暂无榜单记录，注册账户并完成第一局对决即可登榜！
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-12 text-[11px] font-mono text-slate-500 px-3 py-1">
                    <span className="col-span-1">排名</span>
                    <span className="col-span-4">操盘手</span>
                    <span className="col-span-2 text-right">总场次</span>
                    <span className="col-span-2 text-right">胜率</span>
                    <span className="col-span-3 text-right">累计收益率</span>
                  </div>

                  {leaderboard.map((item, idx) => (
                    <div
                      key={item.id}
                      onClick={() => inspectPlayer(item.username)}
                      className={`grid grid-cols-12 items-center p-3 rounded-xl border transition-all cursor-pointer ${
                        idx === 0
                          ? 'border-amber-500/50 bg-amber-950/20 hover:bg-amber-950/40'
                          : idx === 1
                          ? 'border-slate-600 bg-slate-800/40 hover:bg-slate-800/60'
                          : idx === 2
                          ? 'border-amber-800/40 bg-amber-950/10 hover:bg-amber-950/30'
                          : 'border-slate-800 bg-slate-950/50 hover:bg-slate-800/40'
                      }`}
                    >
                      {/* Rank */}
                      <span className="col-span-1 font-mono font-black text-sm">
                        {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}
                      </span>

                      {/* Username */}
                      <div className="col-span-4 flex items-center gap-2">
                        <span className="font-bold text-white text-xs truncate">{item.username}</span>
                        {item.current_streak >= 3 && (
                          <span className="text-[10px] px-1 rounded bg-red-950 border border-red-500/40 text-red-400 font-mono font-bold">
                            {item.current_streak}连胜🔥
                          </span>
                        )}
                      </div>

                      {/* Total Rounds */}
                      <span className="col-span-2 text-right font-mono text-xs text-slate-400">
                        {item.total_rounds} 战
                      </span>

                      {/* Win Rate */}
                      <span className="col-span-2 text-right font-mono text-xs text-emerald-400 font-bold">
                        {item.win_rate}%
                      </span>

                      {/* Total ROI */}
                      <div className="col-span-3 text-right flex items-center justify-end gap-1">
                        <span className={`font-mono font-black text-sm ${
                          item.total_profit_pct >= 0 ? 'text-red-400' : 'text-emerald-400'
                        }`}>
                          {item.total_profit_pct >= 0 ? `+${item.total_profit_pct}%` : `${item.total_profit_pct}%`}
                        </span>
                        <ChevronRight size={14} className="text-slate-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : activeTab === 'public_stream' ? (
            /* 3. Real-time Public Trades Feed */
            <div>
              {publicTrades.length === 0 ? (
                <div className="text-center py-12 text-slate-500 text-xs">暂无公开对局流水</div>
              ) : (
                <div className="space-y-2">
                  {publicTrades.map(trade => (
                    <div
                      key={trade.id}
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/50 hover:bg-slate-800/30 transition-all text-xs font-mono"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`px-2 py-1 rounded text-[11px] font-bold ${
                          trade.action === 'long'
                            ? 'bg-red-950/80 text-red-400 border border-red-500/30'
                            : trade.action === 'short'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {trade.action === 'long' ? '多' : trade.action === 'short' ? '空' : '观望'} {trade.leverage}x
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <b className="text-white">{trade.username}</b>
                            <span className="text-slate-400">对决</span>
                            <b className="text-amber-300">{trade.variety_name}</b>
                          </div>
                          <span className="text-[10px] text-slate-500">{trade.trade_time}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className={`font-mono font-black text-sm ${
                          trade.liquidated
                            ? 'text-red-500'
                            : trade.roi_pct > 0
                            ? 'text-red-400'
                            : trade.roi_pct < 0
                            ? 'text-emerald-400'
                            : 'text-slate-400'
                        }`}>
                          {trade.liquidated ? '💥 爆仓' : trade.roi_pct > 0 ? `+${trade.roi_pct}%` : `${trade.roi_pct}%`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            /* 4. My Personal Dossier */
            myProfile && (
              <div className="space-y-4">
                {/* Stats Summary Card */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-950 p-4 rounded-xl border border-slate-800 text-center font-mono">
                  <div>
                    <span className="text-[11px] text-slate-500">累计收益率</span>
                    <div className={`text-xl font-black ${myProfile.total_profit_pct >= 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {myProfile.total_profit_pct >= 0 ? `+${myProfile.total_profit_pct}%` : `${myProfile.total_profit_pct}%`}
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">总胜率</span>
                    <div className="text-xl font-black text-emerald-400">
                      {myProfile.win_rate}%
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">总对局数</span>
                    <div className="text-xl font-black text-white">
                      {myProfile.total_rounds} 局
                    </div>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">最高连胜</span>
                    <div className="text-xl font-black text-amber-400">
                      {myProfile.max_streak} 🔥
                    </div>
                  </div>
                </div>

                {/* My Recent Trades List */}
                <div>
                  <h3 className="text-xs font-bold text-slate-300 font-mono mb-2 flex items-center gap-1.5">
                    <Activity size={14} className="text-emerald-400" /> 我的历史交易明细流水
                  </h3>
                  {myTrades.length === 0 ? (
                    <div className="text-center py-8 text-slate-500 text-xs">暂无历史明细，马上去决斗一局吧！</div>
                  ) : (
                    <div className="space-y-2">
                      {myTrades.map(trade => (
                        <div
                          key={trade.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-800 bg-slate-950/60 text-xs font-mono"
                        >
                          <div className="flex items-center gap-3">
                            <span className={`px-2 py-0.5 rounded font-bold ${
                              trade.action === 'long'
                                ? 'bg-red-950 text-red-400 border border-red-500/30'
                                : trade.action === 'short'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800 text-slate-400'
                            }`}>
                              {trade.action === 'long' ? '做多' : trade.action === 'short' ? '做空' : '观望'} {trade.leverage}x
                            </span>
                            <div>
                              <div className="text-white font-bold">{trade.variety_name} ({trade.symbol})</div>
                              <div className="text-[10px] text-slate-500">{trade.trade_time}</div>
                            </div>
                          </div>

                          <div className={`font-black text-sm ${
                            trade.liquidated ? 'text-red-500' : trade.roi_pct > 0 ? 'text-red-400' : 'text-emerald-400'
                          }`}>
                            {trade.liquidated ? '-100% 爆仓' : trade.roi_pct > 0 ? `+${trade.roi_pct}%` : `${trade.roi_pct}%`}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
