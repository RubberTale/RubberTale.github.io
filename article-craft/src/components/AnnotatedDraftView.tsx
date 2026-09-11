import React, { useState, useRef } from 'react';
import { PinpointAnnotation } from '../services/llm';
import { BookmarkPlus, Sparkles } from 'lucide-react';

interface Props {
  draft: string;
  annotations: PinpointAnnotation[];
  onAddAnnotationForQuote: (quote: string) => void;
  onAnnotationClick: (ann: PinpointAnnotation) => void;
}

export const AnnotatedDraftView: React.FC<Props> = ({
  draft,
  annotations,
  onAddAnnotationForQuote,
  onAnnotationClick
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedQuote, setSelectedQuote] = useState<string | null>(null);
  const [buttonPos, setButtonPos] = useState<{ x: number; y: number } | null>(null);

  const handleMouseUp = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) {
      setSelectedQuote(null);
      setButtonPos(null);
      return;
    }

    const text = selection.toString().trim();
    if (text && text.length >= 2 && text.length <= 300) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = containerRef.current?.getBoundingClientRect();

      if (containerRect) {
        setSelectedQuote(text);
        setButtonPos({
          x: Math.max(10, rect.left - containerRect.left + rect.width / 2 - 80),
          y: Math.max(10, rect.top - containerRect.top - 40)
        });
        return;
      }
    }

    setSelectedQuote(null);
    setButtonPos(null);
  };

  const handleTriggerAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selectedQuote) {
      onAddAnnotationForQuote(selectedQuote);
      setSelectedQuote(null);
      setButtonPos(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  // Render paragraphs with embedded annotation highlights
  const activeAnnotations = annotations.filter(a => a.enabled && a.quote && a.quote.trim());
  const paragraphs = draft.split('\n');

  return (
    <div
      ref={containerRef}
      onMouseUp={handleMouseUp}
      className="relative h-full overflow-y-auto p-4 select-text leading-relaxed font-sans text-xs md:text-sm text-slate-200"
    >
      {/* Floating Selection Action Tooltip */}
      {selectedQuote && buttonPos && (
        <div
          style={{ left: `${buttonPos.x}px`, top: `${buttonPos.y}px` }}
          className="absolute z-30 animate-in fade-in zoom-in duration-150"
        >
          <button
            onMouseDown={(e) => e.preventDefault()} // prevent blur
            onClick={handleTriggerAdd}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-xl shadow-amber-950/60 border border-amber-300 transition cursor-pointer"
          >
            <BookmarkPlus className="w-3.5 h-3.5" />
            <span>对此选中文本添加修改意见</span>
          </button>
        </div>
      )}

      {/* Paragraphs */}
      <div className="space-y-3 pb-8">
        {paragraphs.map((para, pIdx) => {
          if (!para.trim()) {
            return <div key={pIdx} className="h-2" />;
          }

          const isHeading = para.startsWith('#');
          if (isHeading) {
            return (
              <div
                key={pIdx}
                className="font-bold text-slate-100 text-sm md:text-base border-b border-slate-800/80 pb-1 pt-1"
              >
                {para}
              </div>
            );
          }

          // Search quotes in paragraph
          type Segment = { text: string; isHighlight: boolean; annotation?: PinpointAnnotation; index?: number };
          let segments: Segment[] = [{ text: para, isHighlight: false }];

          activeAnnotations.forEach((ann, aIdx) => {
            const quote = ann.quote.trim();
            if (!quote) return;

            const nextSegments: Segment[] = [];
            segments.forEach((seg) => {
              if (seg.isHighlight) {
                nextSegments.push(seg);
                return;
              }

              let start = 0;
              let matchIdx = seg.text.indexOf(quote, start);
              if (matchIdx === -1) {
                nextSegments.push(seg);
                return;
              }

              while (matchIdx !== -1) {
                if (matchIdx > start) {
                  nextSegments.push({ text: seg.text.slice(start, matchIdx), isHighlight: false });
                }
                nextSegments.push({
                  text: seg.text.slice(matchIdx, matchIdx + quote.length),
                  isHighlight: true,
                  annotation: ann,
                  index: aIdx
                });
                start = matchIdx + quote.length;
                matchIdx = seg.text.indexOf(quote, start);
              }

              if (start < seg.text.length) {
                nextSegments.push({ text: seg.text.slice(start), isHighlight: false });
              }
            });

            segments = nextSegments;
          });

          return (
            <p key={pIdx} className="leading-relaxed">
              {segments.map((seg, sIdx) => {
                if (!seg.isHighlight || !seg.annotation) {
                  return <span key={sIdx}>{seg.text}</span>;
                }

                const ann = seg.annotation;
                return (
                  <mark
                    key={sIdx}
                    onClick={(e) => {
                      e.stopPropagation();
                      onAnnotationClick(ann);
                    }}
                    className="bg-amber-500/20 text-amber-200 border-b-2 border-amber-400 px-1 py-0.5 rounded cursor-pointer hover:bg-amber-500/35 transition inline-flex items-center gap-1 font-medium group"
                    title={`修改意见：${ann.comment}`}
                  >
                    <span>{seg.text}</span>
                    <span className="text-[10px] font-mono font-bold px-1 rounded bg-amber-500/30 text-amber-300 group-hover:bg-amber-500 group-hover:text-slate-950 transition select-none">
                      #{(seg.index || 0) + 1}
                    </span>
                  </mark>
                );
              })}
            </p>
          );
        })}
      </div>
    </div>
  );
};
