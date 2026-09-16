import React from 'react';
import * as Diff from 'diff';

interface Props {
  oldText: string;
  newText: string;
}

export const DiffViewer: React.FC<Props> = ({ oldText, newText }) => {
  if (!oldText.trim() && !newText.trim()) {
    return <div className="text-center text-xs text-slate-500 py-12">暂无对比内容</div>;
  }

  const diffResult = Diff.diffLines(oldText, newText);

  return (
    <div className="font-mono text-xs leading-relaxed overflow-x-auto rounded-xl border border-slate-800 bg-slate-950 p-4 space-y-0.5 select-text">
      {diffResult.map((part, index) => {
        const color = part.added
          ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 pl-2'
          : part.removed
          ? 'bg-rose-950/40 text-rose-400 line-through border-l-2 border-rose-500 pl-2 opacity-75'
          : 'text-slate-300 pl-2.5';

        const prefix = part.added ? '+ ' : part.removed ? '- ' : '  ';

        return (
          <div key={index} className={`py-0.5 whitespace-pre-wrap break-words ${color}`}>
            <span className="select-none text-slate-600 mr-2">{prefix}</span>
            {part.value}
          </div>
        );
      })}
    </div>
  );
};
