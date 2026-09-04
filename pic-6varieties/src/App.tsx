import React, { useState, useEffect, useCallback } from 'react';
import UploadZone from './components/UploadZone';
import ResultCard from './components/ResultCard';
import ApiKeyModal from './components/ApiKeyModal';
import { PHOTO_STYLES } from './constants';
import { GeneratedImage, ApiConfig } from './types';
import { generatePortrait } from './services/geminiService';

const STORAGE_KEY_MODE = 'pic6_api_mode';
const STORAGE_KEY_API_KEY = 'pic6_gemini_api_key';
const STORAGE_KEY_BASE_URL = 'pic6_gemini_base_url';
const STORAGE_KEY_MODEL = 'pic6_gemini_model';

const App: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [apiConfig, setApiConfig] = useState<ApiConfig>({
    mode: 'server',
    apiKey: '',
    baseUrl: '',
    model: 'gemini-2.5-flash-image'
  });

  // Load configuration from localStorage on mount
  useEffect(() => {
    const savedMode = (localStorage.getItem(STORAGE_KEY_MODE) as 'server' | 'custom') || 'server';
    const savedKey = localStorage.getItem(STORAGE_KEY_API_KEY) || '';
    const savedBase = localStorage.getItem(STORAGE_KEY_BASE_URL) || '';
    const savedModel = localStorage.getItem(STORAGE_KEY_MODEL) || 'gemini-2.5-flash-image';
    setApiConfig({
      mode: savedMode,
      apiKey: savedKey,
      baseUrl: savedBase,
      model: savedModel
    });
  }, []);

  const handleSaveConfig = (newConfig: ApiConfig) => {
    setApiConfig(newConfig);
    localStorage.setItem(STORAGE_KEY_MODE, newConfig.mode);
    localStorage.setItem(STORAGE_KEY_API_KEY, newConfig.apiKey);
    localStorage.setItem(STORAGE_KEY_BASE_URL, newConfig.baseUrl);
    localStorage.setItem(STORAGE_KEY_MODEL, newConfig.model);
  };

  const [results, setResults] = useState<GeneratedImage[]>(
    PHOTO_STYLES.map(style => ({
      id: style.id,
      styleId: style.id,
      imageUrl: null,
      isLoading: false,
      error: null
    }))
  );

  const generateSingleStyle = useCallback(async (
    base64: string, 
    styleId: string, 
    prompt: string, 
    config: ApiConfig
  ) => {
    setResults(prev => prev.map(item => 
      item.styleId === styleId ? { ...item, isLoading: true, error: null } : item
    ));

    try {
      const generatedImageUrl = await generatePortrait(base64, prompt, config);
      setResults(prev => prev.map(item => 
        item.styleId === styleId 
          ? { ...item, imageUrl: generatedImageUrl, isLoading: false, error: null } 
          : item
      ));
    } catch (err: any) {
      setResults(prev => prev.map(item => 
        item.styleId === styleId 
          ? { ...item, error: err.message || "生成失败", isLoading: false } 
          : item
      ));
    }
  }, []);

  const handleImageSelect = (base64: string) => {
    setSourceImage(base64);

    if (apiConfig.mode === 'custom' && !apiConfig.apiKey.trim()) {
      setIsConfigOpen(true);
      return;
    }

    // Reset results & trigger generation for each style
    setResults(prevResults => prevResults.map(r => ({
      ...r,
      imageUrl: null,
      error: null,
      isLoading: true
    })));

    PHOTO_STYLES.forEach(style => {
      generateSingleStyle(base64, style.id, style.prompt, apiConfig);
    });
  };

  const handleRegenerateSingle = (styleId: string) => {
    if (!sourceImage) return;
    if (apiConfig.mode === 'custom' && !apiConfig.apiKey.trim()) {
      setIsConfigOpen(true);
      return;
    }
    const style = PHOTO_STYLES.find(s => s.id === styleId);
    if (style) {
      generateSingleStyle(sourceImage, style.id, style.prompt, apiConfig);
    }
  };

  const handleRegenerateAll = () => {
    if (!sourceImage) return;
    if (apiConfig.mode === 'custom' && !apiConfig.apiKey.trim()) {
      setIsConfigOpen(true);
      return;
    }
    PHOTO_STYLES.forEach(style => {
      generateSingleStyle(sourceImage, style.id, style.prompt, apiConfig);
    });
  };

  const hasAnyLoading = results.some(r => r.isLoading);
  const completedCount = results.filter(r => r.imageUrl !== null).length;

  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 flex flex-col selection:bg-purple-500 selection:text-white">
      {/* Navbar */}
      <header className="border-b border-gray-800/80 bg-gray-950/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a 
              href="/tools/" 
              title="返回工具列表"
              className="text-gray-400 hover:text-white p-1.5 hover:bg-gray-800 rounded-lg transition-colors flex items-center gap-1 text-sm mr-1"
            >
              <span>←</span>
              <span className="hidden sm:inline">工具箱</span>
            </a>
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <span className="text-base">📸</span>
            </div>
            <div>
              <span className="font-bold text-base sm:text-lg tracking-tight text-white block leading-tight">
                AI Portrait Studio
              </span>
              <span className="text-[11px] text-gray-400 hidden sm:block">
                6 种风格人像写真工坊
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsConfigOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-700 bg-gray-900/80 hover:bg-gray-800 text-xs font-medium transition-all text-gray-200"
            >
              <span className={`w-2 h-2 rounded-full ${
                apiConfig.mode === 'server'
                  ? 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]'
                  : apiConfig.apiKey
                    ? 'bg-purple-400'
                    : 'bg-amber-400 animate-pulse'
              }`}></span>
              <span>{apiConfig.mode === 'server' ? '服务器后端 (免Key)' : '自定义 Key'}</span>
            </button>
            <a
              href="/"
              className="text-xs text-gray-400 hover:text-white hidden md:inline-block transition-colors"
            >
              博客首页
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 w-full">
        {/* Banner if Custom mode without key */}
        {apiConfig.mode === 'custom' && !apiConfig.apiKey && (
          <div className="mb-8 p-4 rounded-2xl bg-amber-950/30 border border-amber-800/60 text-amber-200 text-xs sm:text-sm flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="flex items-center gap-2.5">
              <span className="text-lg">💡</span>
              <span>
                当前处于自定义模式：请填写您的 <strong>Google Gemini API Key</strong>，或切换回【服务器免Key模式】。
              </span>
            </div>
            <button
              onClick={() => setIsConfigOpen(true)}
              className="px-4 py-1.5 rounded-xl bg-amber-500 text-black font-semibold text-xs hover:bg-amber-400 transition-colors whitespace-nowrap shadow"
            >
              配置设置
            </button>
          </div>
        )}

        {/* Hero & Upload */}
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-400 mb-4">
            专业多风格 AI 肖像写真
          </h1>
          <p className="text-sm sm:text-base text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
            上传一张您的个人正脸或半身照片，由 Gemini 自动生成职场、商业时尚、美术馆街拍、黑白艺术、好莱坞复古、夏日海滩 6 种不同场景写真。
          </p>

          <div className="flex flex-col md:flex-row gap-6 items-center justify-center max-w-3xl mx-auto">
            {sourceImage && (
              <div className="w-40 sm:w-44 shrink-0 animate-in fade-in zoom-in duration-300">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-purple-500/50 relative group shadow-2xl bg-gray-900">
                  <img src={sourceImage} alt="原图" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-xs text-white tracking-wider font-mono">上传原图</span>
                  </div>
                </div>
              </div>
            )}

            <div className="flex-1 w-full">
              <UploadZone 
                onImageSelected={handleImageSelect}
                disabled={hasAnyLoading}
              />
            </div>
          </div>

          {sourceImage && (
            <div className="mt-5 flex items-center justify-center gap-4">
              <button
                onClick={handleRegenerateAll}
                disabled={hasAnyLoading}
                className="px-5 py-2 rounded-xl bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/50 text-purple-200 text-xs font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
              >
                <span>🔄</span> 全部重新生成
              </button>
              {completedCount > 0 && (
                <span className="text-xs text-gray-400">
                  已完成 {completedCount} / 6 款写真
                </span>
              )}
            </div>
          )}
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {PHOTO_STYLES.map((style) => {
            const result = results.find(r => r.styleId === style.id);
            if (!result) return null;

            return (
              <ResultCard 
                key={style.id}
                styleConfig={style}
                result={result}
                onRegenerate={() => handleRegenerateSingle(style.id)}
              />
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-900 py-8 text-center text-xs text-gray-600">
        <p>
          由 Google Gemini 提供图像生成能力 · 服务器节点支持全球/国内加速访问
        </p>
        <p className="mt-1">
          &copy; {new Date().getFullYear()} 橡胶童话 (RubberTale) · All Rights Reserved
        </p>
      </footer>

      {/* Config Modal */}
      <ApiKeyModal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        config={apiConfig}
        onSave={handleSaveConfig}
      />
    </div>
  );
};

export default App;
