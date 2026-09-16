import React from 'react';
import { StyleConfig, GeneratedImage } from '../types';

interface ResultCardProps {
  styleConfig: StyleConfig;
  result: GeneratedImage;
  onRegenerate?: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ styleConfig, result, onRegenerate }) => {
  const handleDownload = () => {
    if (result.imageUrl) {
      const link = document.createElement('a');
      link.href = result.imageUrl;
      const timestamp = Date.now();
      link.download = `portrait-${styleConfig.id}-${timestamp}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="bg-gray-900/80 border border-gray-800 hover:border-gray-700 transition-all rounded-2xl overflow-hidden shadow-xl flex flex-col h-full group">
      {/* Header */}
      <div className="p-4 border-b border-gray-800/80 bg-gray-900/90 backdrop-blur-sm">
        <div className="flex items-center justify-between gap-2">
          <h3 className="font-semibold text-white text-base truncate" title={styleConfig.title}>
            {styleConfig.title}
          </h3>
          {result.imageUrl && onRegenerate && (
            <button
              onClick={onRegenerate}
              title="重新生成此风格"
              className="text-xs text-gray-400 hover:text-purple-300 p-1 hover:bg-gray-800 rounded transition-colors"
            >
              🔄 重试
            </button>
          )}
        </div>
        <p className="text-xs text-gray-400 mt-1 line-clamp-1" title={styleConfig.description}>
          {styleConfig.description}
        </p>
      </div>

      {/* Image Area */}
      <div className="relative aspect-[3/4] w-full bg-gray-950 flex items-center justify-center overflow-hidden">
        {result.imageUrl ? (
          <>
            <img 
              src={result.imageUrl} 
              alt={styleConfig.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Overlay Actions */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
              <div className="flex items-center gap-2">
                <button 
                  onClick={handleDownload}
                  className="flex-1 bg-white text-gray-950 font-semibold text-xs py-2.5 px-3 rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-1.5 shadow-lg"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                  </svg>
                  下载原图
                </button>
                {onRegenerate && (
                  <button
                    onClick={onRegenerate}
                    className="bg-gray-800/90 hover:bg-gray-700 text-white font-medium text-xs py-2.5 px-3 rounded-xl transition-all flex items-center justify-center gap-1 border border-gray-700"
                    title="重新生成"
                  >
                    🔄
                  </button>
                )}
              </div>
            </div>
          </>
        ) : result.isLoading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-gray-950/90">
            <div className="relative">
              <div className="w-10 h-10 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin"></div>
            </div>
            <p className="text-xs font-medium text-purple-300 animate-pulse">正在生成专属写真...</p>
            <p className="text-[11px] text-gray-500">Gemini 正在细致还原面部特征</p>
          </div>
        ) : result.error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-gray-950">
            <div className="w-9 h-9 rounded-full bg-red-950/50 border border-red-800 flex items-center justify-center text-red-400 mb-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <p className="text-xs font-semibold text-red-400 mb-1">生成遇到问题</p>
            <p className="text-[11px] text-gray-400 max-h-20 overflow-y-auto px-2 mb-3 leading-relaxed">
              {result.error}
            </p>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-950/60 hover:bg-purple-900 border border-purple-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>🔄</span> 单独重试
              </button>
            )}
          </div>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-600 gap-2 p-4 text-center">
            <svg className="w-8 h-8 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span className="text-xs text-gray-500">等待上传肖像照片</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
