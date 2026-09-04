import React, { useState, useEffect } from 'react';
import { ApiConfig, EngineType } from '../types';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSave: (config: ApiConfig) => void;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  config,
  onSave
}) => {
  const [engine, setEngine] = useState<EngineType>(config.engine || 'pollinations');
  const [pollinationsModel, setPollinationsModel] = useState(config.pollinationsModel || 'flux');
  const [geminiModel, setGeminiModel] = useState(config.geminiModel || 'gemini-2.5-flash-image');
  const [customGeminiKey, setCustomGeminiKey] = useState(config.customGeminiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [storageInfo, setStorageInfo] = useState<{ usedMB: string; maxMB: number; usagePercent: string; fileCount: number } | null>(null);

  useEffect(() => {
    setEngine(config.engine || 'pollinations');
    setPollinationsModel(config.pollinationsModel || 'flux');
    setGeminiModel(config.geminiModel || 'gemini-2.5-flash-image');
    setCustomGeminiKey(config.customGeminiKey || '');
    setTestResult(null);

    if (isOpen) {
      fetch('https://140.245.65.111.sslip.io/api/pic-6varieties/storage')
        .then(r => r.json())
        .then(data => setStorageInfo(data))
        .catch(() => {});
    }
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      engine,
      pollinationsModel,
      geminiModel,
      customGeminiKey: customGeminiKey.trim()
    });
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    try {
      const resp = await fetch('https://140.245.65.111.sslip.io/api/pic-6varieties/health');
      if (resp.ok) {
        const data = await resp.json();
        setTestResult({
          success: true,
          message: `后端连接通畅！已支持引擎：${(data.supportedEngines || []).join('、')}。当前存储：${data.storage?.usedMB}MB / ${data.storage?.maxMB}MB`
        });
        if (data.storage) {
          setStorageInfo(data.storage);
        }
      } else {
        setTestResult({ success: false, message: `服务器返回异常状态: ${resp.status}` });
      }
    } catch (e: any) {
      setTestResult({ success: false, message: `网络连接失败: ${e.message}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold text-white">AI 生成引擎与存储配置</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Engine Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-200">
            选择生成引擎
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Pollinations */}
            <button
              type="button"
              onClick={() => setEngine('pollinations')}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                engine === 'pollinations'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                  : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-purple-300">🎨 Pollinations.ai</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  免费免Key
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                基于顶尖 FLUX 开源模型，构图光影唯美，零门槛随点随出。
              </p>
            </button>

            {/* Gemini */}
            <button
              type="button"
              onClick={() => setEngine('gemini')}
              className={`p-3.5 rounded-xl border text-left transition-all relative ${
                engine === 'gemini'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                  : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-sm text-purple-300">👤 Google Gemini</span>
                <span className="bg-purple-500/20 text-purple-300 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  真人五官保持
                </span>
              </div>
              <p className="text-xs text-gray-300 leading-relaxed">
                精准锁定并保持本人长相与面部细节（需账户具备有效配额）。
              </p>
            </button>
          </div>
        </div>

        {/* Engine Specific Settings */}
        {engine === 'pollinations' ? (
          <div className="space-y-3 bg-gray-950/60 border border-gray-800 rounded-xl p-4 animate-in fade-in duration-200">
            <label className="block text-xs font-semibold text-gray-300">
              Pollinations 模型档位
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setPollinationsModel('flux')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  pollinationsModel === 'flux'
                    ? 'border-purple-500 bg-purple-950/50 text-white'
                    : 'border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-850'
                }`}
              >
                <div className="font-semibold text-purple-200">FLUX (推荐)</div>
                <div className="text-[11px] text-gray-400">大画质、写气质感强</div>
              </button>
              <button
                type="button"
                onClick={() => setPollinationsModel('turbo')}
                className={`p-2.5 rounded-lg border text-xs font-medium text-left transition-all ${
                  pollinationsModel === 'turbo'
                    ? 'border-purple-500 bg-purple-950/50 text-white'
                    : 'border-gray-800 bg-gray-900 text-gray-400 hover:bg-gray-850'
                }`}
              >
                <div className="font-semibold text-purple-200">Turbo (极速)</div>
                <div className="text-[11px] text-gray-400">秒级生成出图</div>
              </button>
            </div>
            <p className="text-[11px] text-emerald-400/90 pt-1">
              ✓ 服务端已配置防并发排队机制，稳定生成 6 种风格，不会报错。
            </p>
          </div>
        ) : (
          <div className="space-y-4 bg-gray-950/60 border border-gray-800 rounded-xl p-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                自定义 Gemini API Key <span className="text-gray-500 font-normal">(可选，默认走服务器内置 Key)</span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={customGeminiKey}
                  onChange={(e) => setCustomGeminiKey(e.target.value)}
                  placeholder="留空则使用服务器内置 Key"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 pr-10 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2 text-xs text-gray-400 hover:text-gray-200"
                >
                  {showKey ? "隐藏" : "显示"}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Gemini 模型标识
              </label>
              <input
                type="text"
                value={geminiModel}
                onChange={(e) => setGeminiModel(e.target.value)}
                placeholder="gemini-2.5-flash-image"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="text-[11px] text-amber-300/90 bg-amber-950/30 p-2.5 rounded-lg border border-amber-900/50 leading-relaxed">
              ⚠️ 提示：Google 官方对图像生成模型要求绑卡结算账户。若遇到配额不足，可直接切回 Pollinations.ai 免费畅享生成。
            </div>
          </div>
        )}

        {/* Storage Quota Section */}
        {storageInfo && (
          <div className="bg-gray-950/70 border border-gray-800 rounded-xl p-3 text-xs text-gray-400 space-y-1.5">
            <div className="flex items-center justify-between text-gray-300">
              <span className="font-medium flex items-center gap-1">💾 服务器存储配额</span>
              <span className="font-mono text-purple-300">{storageInfo.usedMB} MB / {storageInfo.maxMB} MB ({storageInfo.usagePercent})</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full rounded-full transition-all duration-500" 
                style={{ width: storageInfo.usagePercent }}
              ></div>
            </div>
            <p className="text-[11px] text-gray-500 leading-tight">
              现已允许存图（已存 {storageInfo.fileCount} 张）。当存储占用达到 1GB 上限时，系统将自动按先进先出（FIFO）淘汰最旧图片，确保容量永不超标。
            </p>
          </div>
        )}

        {/* Test Connection Output */}
        {testResult && (
          <div className={`p-3 rounded-lg text-xs border ${testResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'}`}>
            {testResult.message}
          </div>
        )}

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testing}
            className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 disabled:opacity-50 transition-colors"
          >
            {testing ? "测试中..." : "测试服务器连接"}
          </button>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium rounded-lg text-gray-300 hover:bg-gray-800 transition-colors"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 text-xs font-semibold rounded-lg bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-lg shadow-purple-600/30 transition-all"
            >
              保存并应用
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
