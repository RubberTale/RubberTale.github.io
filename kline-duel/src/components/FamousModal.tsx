// FamousModal.tsx
import React from 'react';
import { X, Swords, Flame, Sparkles } from 'lucide-react';
import { sounds } from '../soundEngine';

export interface FamousBattleItem {
  id: string;
  title: string;
  tag: string;
  difficulty: string;
}

interface FamousModalProps {
  isOpen: boolean;
  onClose: () => void;
  battles: FamousBattleItem[];
  onSelectBattle: (id: string) => void;
}

export const FamousModal: React.FC<FamousModalProps> = ({
  isOpen,
  onClose,
  battles,
  onSelectBattle
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in font-sans">
      <div className="relative max-w-2xl w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-6 shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-400">
              <Swords size={18} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-wide">历史名场面 · 战役名局</h2>
              <p className="text-xs text-slate-400">挑战大宗商品期货史上的标志性史诗波段</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* List of battles */}
        <div className="flex-1 overflow-y-auto py-4 space-y-3 pr-1">
          {battles.map(b => (
            <div
              key={b.id}
              onClick={() => {
                sounds.playOrderSound('long');
                onSelectBattle(b.id);
                onClose();
              }}
              className="group flex items-center justify-between p-4 rounded-xl border border-slate-800 bg-slate-950/60 hover:border-amber-500/50 hover:bg-slate-800/60 transition-all cursor-pointer shadow-sm hover:shadow-md"
            >
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                    {b.title}
                  </span>
                  <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                    {b.tag}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                  <span>难度评级:</span>
                  <span className="text-amber-400 tracking-widest">{b.difficulty}</span>
                </div>
              </div>

              <button className="px-3.5 py-1.5 rounded-lg bg-slate-800 group-hover:bg-amber-500 text-slate-300 group-hover:text-slate-950 text-xs font-bold font-mono transition-all">
                决斗 ⚔️
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
