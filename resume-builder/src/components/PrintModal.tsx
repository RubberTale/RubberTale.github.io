import React from 'react';
import { Printer, X, CheckCircle2, AlertCircle } from 'lucide-react';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPrint: () => void;
}

export const PrintModal: React.FC<PrintModalProps> = ({ isOpen, onClose, onPrint }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 no-print animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-100">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-lg">
              <Printer className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">导出高精度 PDF 简历</h3>
              <p className="text-blue-100 text-xs">通过浏览器打印引擎导出无损矢量 PDF</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900 leading-relaxed">
              <strong className="font-medium text-amber-950">重要打印设置提示：</strong>
              为了让排版达到最佳效果，在接下来弹出的浏览器打印设置窗口中，请务必确认以下 3 项设置：
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-800">1. 目标打印机</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  选择 <span className="font-medium text-blue-600">“另存为 PDF”</span> (Save as PDF)
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-800">2. 边距设置 (关键！)</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  在“更多设置”中，将“边距”设置为 <span className="font-medium text-blue-600">“无” (None)</span>，避免页面出现额外白边或变形
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-slate-800">3. 背景图形</div>
                <div className="text-xs text-slate-600 mt-0.5">
                  务必勾选 <span className="font-medium text-blue-600">“背景图形” (Background graphics)</span>，以完整保留主题色与设计元素
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => {
              onClose();
              setTimeout(onPrint, 250);
            }}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/30 flex items-center gap-2 transition-colors"
          >
            <Printer className="w-4 h-4" />
            开始打印 / 导出 PDF
          </button>
        </div>
      </div>
    </div>
  );
};
