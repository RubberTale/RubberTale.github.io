// AuthModal.tsx
import React, { useState } from 'react';
import { X, User, Phone, Lock, Sparkles, ShieldCheck, CheckCircle2, AlertCircle, LogIn, UserPlus } from 'lucide-react';
import { sounds } from '../soundEngine';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  apiBase: string;
  onLoginSuccess: (user: any, token: string) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  apiBase,
  onLoginSuccess
}) => {
  const [isLogin, setIsLogin] = useState<boolean>(true);
  const [username, setUsername] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [account, setAccount] = useState<string>(''); // For login
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [successMsg, setSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (isLogin) {
        if (!account.trim() || !password.trim()) {
          throw new Error('请输入账号（手机号或用户名）和密码');
        }

        const res = await fetch(`${apiBase}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ account: account.trim(), password })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.error || '登录失败');

        sounds.playWinFanfare();
        onLoginSuccess(data.user, data.token);
        onClose();
      } else {
        // Register
        if (!username.trim() || username.trim().length < 2) {
          throw new Error('用户名长度需在 2 到 20 个字符之间');
        }
        if (!/^1[3-9]\d{9}$/.test(phone.trim())) {
          throw new Error('请输入有效的 11 位手机号码');
        }
        if (!password || password.length < 6) {
          throw new Error('密码长度不能少于 6 位');
        }

        const res = await fetch(`${apiBase}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: username.trim(),
            phone: phone.trim(),
            password
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.detail || data.error || '注册失败');

        sounds.playWinFanfare();
        onLoginSuccess(data.user, data.token);
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || '网络请求失败');
      sounds.playTerminalBeep(300, 0.2);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative max-w-md w-full bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs font-mono mb-2">
            <ShieldCheck size={14} />
            <span>操盘手身份认证中心</span>
          </div>
          <h2 className="text-xl font-black text-white tracking-wide">
            {isLogin ? '登录专属操盘档案' : '注册专属操盘账户'}
          </h2>
        </div>

        {/* Mode Explanation Notice */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 mb-5 text-xs leading-relaxed text-slate-300">
          <div className="font-bold text-amber-400 mb-1 flex items-center gap-1">
            <Sparkles size={13} /> 账户模式 vs 游客模式说明:
          </div>
          <ul className="space-y-1 text-slate-400 text-[11px]">
            <li>• <b className="text-slate-200">⚡ 游客模式：</b>免注册即开即玩，战绩仅存于当前浏览器。</li>
            <li>• <b className="text-emerald-400">🏆 注册账户：</b>每笔对局收益率与品种<b className="text-slate-200">永久存于服务器</b>，支持查看历史明细并登顶全网英雄榜！</li>
          </ul>
        </div>

        {/* Switch Tabs */}
        <div className="flex border-b border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setErrorMsg(''); }}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              isLogin
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <LogIn size={14} /> 登录账户
            </span>
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setErrorMsg(''); }}
            className={`flex-1 pb-2.5 text-xs font-bold text-center border-b-2 transition-all cursor-pointer ${
              !isLogin
                ? 'border-emerald-500 text-emerald-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="flex items-center justify-center gap-1.5">
              <UserPlus size={14} /> 注册新档案
            </span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {errorMsg && (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-400 text-xs">
              <AlertCircle size={14} className="shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {isLogin ? (
            <>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">手机号 或 玩家昵称</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="输入注册手机号或用户名"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">登录密码</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="输入密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">操盘手昵称 (全网公开)</label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="例如: 利弗莫尔、大宗猎手"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">手机号码 (唯一身份识别)</label>
                <div className="relative">
                  <Phone size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="请输入 11 位手机号码"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
                <span className="text-[10px] text-slate-500 mt-1 block">
                  * 手机号码仅用于账号唯一归属与找回，榜单上将自动脱敏显示为 138****1234
                </span>
              </div>

              <div>
                <label className="block text-[11px] font-mono text-slate-400 mb-1">设置密码 (≥6位)</label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-3 text-slate-500" />
                  <input
                    type="password"
                    required
                    minLength={6}
                    placeholder="设置 6 位以上密码"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 transition-colors font-mono"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs tracking-wider shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? '处理中...' : isLogin ? '立即登录' : '立即注册并绑定档案'}
          </button>
        </form>

        {/* Guest Skip Option */}
        <div className="mt-4 pt-3 border-t border-slate-800 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-slate-400 hover:text-slate-200 transition-colors underline cursor-pointer"
          >
            暂不登录，继续以【游客身份】随时体验
          </button>
        </div>
      </div>
    </div>
  );
};
