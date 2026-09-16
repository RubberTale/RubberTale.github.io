import React, { useState, useEffect, useRef } from 'react';
import { ResumeData } from '../../types';
import { ClassicTemplate } from './Templates/ClassicTemplate';
import { ModernTemplate } from './Templates/ModernTemplate';
import { SidebarTemplate } from './Templates/SidebarTemplate';
import { CreativeTemplate } from './Templates/CreativeTemplate';
import { ZoomIn, ZoomOut, CheckCircle, AlertTriangle, Eye } from 'lucide-react';

interface ResumePreviewProps {
  data: ResumeData;
  onAutoFit?: () => void;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ data, onAutoFit }) => {
  const [zoom, setZoom] = useState<number>(100);
  const [showPageSplit, setShowPageSplit] = useState<boolean>(true);
  const [pageCount, setPageCount] = useState<number>(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Measure if content exceeds 1 A4 page
  // In standard 96 DPI, 297mm is approximately 1122.5 pixels.
  useEffect(() => {
    const checkHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.scrollHeight;
        const a4HeightPx = 1122.5;
        const pages = Math.ceil(height / a4HeightPx);
        setPageCount(pages);
      }
    };

    checkHeight();
    const timer = setTimeout(checkHeight, 300);
    return () => clearTimeout(timer);
  }, [data]);

  const renderTemplate = () => {
    switch (data.theme.template) {
      case 'modern':
        return <ModernTemplate data={data} />;
      case 'sidebar':
        return <SidebarTemplate data={data} />;
      case 'creative':
        return <CreativeTemplate data={data} />;
      case 'classic':
      default:
        return <ClassicTemplate data={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-200/70 relative">
      {/* Top Preview Controls Bar */}
      <div className="no-print bg-white/90 backdrop-blur-md px-4 py-2.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-20 shadow-xs">
        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-700 flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-blue-600" />
            A4 实时预览
          </span>
          <span className="text-slate-300">|</span>
          {pageCount <= 1 ? (
            <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-medium">
              <CheckCircle className="w-3.5 h-3.5" />
              完美单页 (1 页)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              超出单页 (约 {pageCount} 页)
              {onAutoFit && (
                <button
                  onClick={onAutoFit}
                  className="ml-1 underline text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
                >
                  一键紧凑单页
                </button>
              )}
            </span>
          )}
        </div>

        {/* Zoom & Display Controls */}
        <div className="flex items-center gap-2 text-xs">
          <label className="flex items-center gap-1.5 text-slate-600 select-none cursor-pointer mr-2">
            <input
              type="checkbox"
              checked={showPageSplit}
              onChange={(e) => setShowPageSplit(e.target.checked)}
              className="rounded text-blue-600 focus:ring-0"
            />
            <span>分页红线</span>
          </label>

          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded transition-colors"
              title="缩小"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-700 w-10 text-center select-none">
              {zoom}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="p-1 text-slate-600 hover:text-slate-900 rounded transition-colors"
              title="放大"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setZoom(100)}
            className="px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
          >
            100%
          </button>
        </div>
      </div>

      {/* Canvas Viewport Scroll Area */}
      <div className="flex-1 overflow-auto p-4 sm:p-8 flex justify-center print-canvas-wrapper">
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: 'top center',
            transition: 'transform 0.15s ease-out',
          }}
          className="transition-all"
        >
          {/* A4 Paper Dimensions: 210mm x 297mm */}
          <div
            id="resume-canvas"
            ref={containerRef}
            className="resume-paper-container relative bg-white shadow-2xl rounded-sm border border-slate-200/80 overflow-hidden"
            style={{
              width: '210mm',
              minHeight: '297mm',
              boxSizing: 'border-box',
            }}
          >
            {/* Page 1 Break Guideline */}
            {showPageSplit && (
              <div
                className="page-break-line no-print absolute left-0 right-0 border-b-2 border-dashed border-red-400 z-30 pointer-events-none flex justify-end pr-3"
                style={{ top: '297mm' }}
              >
                <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-b font-mono shadow-xs -mt-0.5">
                  第 1 页终止线 (297mm)
                </span>
              </div>
            )}

            {renderTemplate()}
          </div>
        </div>
      </div>
    </div>
  );
};
