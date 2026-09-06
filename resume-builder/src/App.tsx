import React, { useState, useEffect } from 'react';
import { ResumeData } from './types';
import { loadSavedResume, saveResume } from './utils/storage';
import { Navbar } from './components/Navbar';
import { ResumeEditor } from './components/Editor/ResumeEditor';
import { ResumePreview } from './components/Preview/ResumePreview';
import { PrintModal } from './components/PrintModal';
import { MarkdownModal } from './components/MarkdownModal';

export const App: React.FC = () => {
  const [data, setData] = useState<ResumeData>(loadSavedResume);
  const [mobileTab, setMobileTab] = useState<'edit' | 'preview'>('edit');
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isMarkdownModalOpen, setIsMarkdownModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Auto-save on data change
  useEffect(() => {
    saveResume(data);
  }, [data]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Smart Auto-Fit 1-Page algorithm
  const handleAutoFit = () => {
    setData((prev) => ({
      ...prev,
      theme: {
        ...prev.theme,
        fontSize: 'compact',
        lineHeight: 'compact',
        sectionGap: 'compact',
        paperPadding: 'compact',
      },
    }));
    showToast('✨ 已启用紧凑单页排版模式，有效控制在一页 A4 内！');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-100 text-slate-900 font-sans">
      {/* Top Navbar */}
      <Navbar
        data={data}
        onChange={setData}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenMarkdownModal={() => setIsMarkdownModalOpen(true)}
        onAutoFit={handleAutoFit}
        activeTab={mobileTab}
        setActiveTab={setMobileTab}
      />

      {/* Main Dual-Pane Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left: Editor (Visible on lg or when mobileTab === 'edit') */}
        <div
          className={`w-full lg:w-[45%] xl:w-[42%] h-full shrink-0 ${
            mobileTab === 'edit' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResumeEditor data={data} onChange={setData} onAutoFit={handleAutoFit} />
        </div>

        {/* Right: Live A4 Preview (Visible on lg or when mobileTab === 'preview') */}
        <div
          className={`w-full lg:w-[55%] xl:w-[58%] h-full ${
            mobileTab === 'preview' ? 'block' : 'hidden lg:block'
          }`}
        >
          <ResumePreview data={data} onAutoFit={handleAutoFit} />
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/90 text-white px-4 py-2.5 rounded-xl shadow-xl text-xs font-medium z-50 flex items-center gap-2 backdrop-blur-md animate-fade-in">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals */}
      <PrintModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onPrint={handlePrint}
      />

      <MarkdownModal
        isOpen={isMarkdownModalOpen}
        onClose={() => setIsMarkdownModalOpen(false)}
        data={data}
      />
    </div>
  );
};
