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
  const [hfModel, setHfModel] = useState(config.hfModel || 'black-forest-labs/FLUX.1-schnell');
  const [customHfToken, setCustomHfToken] = useState(config.customHfToken || '');
  const [geminiModel, setGeminiModel] = useState(config.geminiModel || 'gemini-2.5-flash-image');
  const [customGeminiKey, setCustomGeminiKey] = useState(config.customGeminiKey || '');
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [storageInfo, setStorageInfo] = useState<{ usedMB: string; maxMB: number; usagePercent: string; fileCount: number } | null>(null);

  useEffect(() => {
    setEngine(config.engine || 'pollinations');
    setPollinationsModel(config.pollinationsModel || 'flux');
    setHfModel(config.hfModel || 'black-forest-labs/FLUX.1-schnell');
    setCustomHfToken(config.customHfToken || '');
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
      hfModel,
      customHfToken: customHfToken.trim(),
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
          message: `后端连接通畅！已挂载引擎：${(data.supportedEngines || []).join('、')}。HF: ${data.hasHfToken ? '已配置' : '未配置'}，Gemini: ${data.hasGeminiKey ? '已配置' : '未配置'}`
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
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-gray-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold text-white">AI 生成引擎与系统配置</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Engine Selection (3 Cards) */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-gray-200">
            选择生成引擎
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {/* Pollinations */}
            <button
              type="button"
              onClick={() => setEngine('pollinations')}
              className={`p-3 rounded-xl border text-left transition-all ${
                engine === 'pollinations'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                  : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="font-bold text-xs text-purple-300 mb-1">
                🎨 Pollinations
              </div>
              <p className="text-[11px] text-gray-300 leading-tight">
                完全免费免Key，开源 FLUX/Turbo
              </p>
            </button>

            {/* Hugging Face */}
            <button
              type="button"
              onClick={() => setEngine('huggingface')}
              className={`p-3 rounded-xl border text-left transition-all ${
                engine === 'huggingface'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                  : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="font-bold text-xs text-amber-300 mb-1">
                🤗 Hugging Face
              </div>
              <p className="text-[11px] text-gray-300 leading-tight">
                官方 FLUX.1 极速，独享稳定通道
              </p>
            </button>

            {/* Gemini */}
            <button
              type="button"
              onClick={() => setEngine('gemini')}
              className={`p-3 rounded-xl border text-left transition-all ${
                engine === 'gemini'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/40 ring-1 ring-purple-500'
                  : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="font-bold text-xs text-pink-300 mb-1">
                👤 Google Gemini
              </div>
              <p className="text-[11px] text-gray-300 leading-tight">
                真人五官保持，需绑卡有效额度
              </p>
            </button>
          </div>
        </div>

        {/* Engine Specific Settings */}
        {engine === 'pollinations' && (
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
                    : 'border-gray-800 bg-gray-900 text-gray-400'
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
                    : 'border-gray-800 bg-gray-900 text-gray-400'
                }`}
              >
                <div className="font-semibold text-purple-200">Turbo (极速)</div>
                <div className="text-[11px] text-gray-400">秒级生成出图</div>
              </button>
            </div>
          </div>
        )}

        {engine === 'huggingface' && (
          <div className="space-y-3 bg-gray-950/60 border border-gray-800 rounded-xl p-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Hugging Face 模型
              </label>
              <input
                type="text"
                value={hfModel}
                onChange={(e) => setHfModel(e.target.value)}
                placeholder="black-forest-labs/FLUX.1-schnell"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                自定义 HF Token <span className="text-gray-500 font-normal">(可选，默认已内置您的专属 Token)</span>
              </label>
              <input
                type="password"
                value={customHfToken}
                onChange={(e) => setCustomHfToken(e.target.value)}
                placeholder="留空则使用服务器默认配置的 Token"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
              <p className="text-[11px] text-emerald-400/90 mt-1">
                ✓ 服务器已绑定您的 HF Token，由官方 Inference 服务极速出图。
              </p>
            </div>
          </div>
        )}

        {engine === 'gemini' && (
          <div className="space-y-3 bg-gray-950/60 border border-gray-800 rounded-xl p-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                自定义 Gemini API Key <span className="text-gray-500 font-normal">(可选，默认走服务器 Key)</span>
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
              当前已存 {storageInfo.fileCount} 张图片。当超过 1GB 上限时，系统将自动按 FIFO 淘汰旧图片。
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
