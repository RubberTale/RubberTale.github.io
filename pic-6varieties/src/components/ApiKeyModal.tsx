import React, { useState, useEffect } from 'react';
import { ApiConfig } from '../types';

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
  const [mode, setMode] = useState<'server' | 'custom'>(config.mode || 'server');
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [model, setModel] = useState(config.model);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setMode(config.mode || 'server');
    setApiKey(config.apiKey);
    setBaseUrl(config.baseUrl);
    setModel(config.model);
    setTestResult(null);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      mode,
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      model: model.trim() || 'gemini-2.5-flash-image'
    });
    onClose();
  };

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    if (mode === 'server') {
      try {
        const resp = await fetch('https://140.245.65.111.sslip.io/api/pic-6varieties/health', { method: 'GET' });
        if (resp.ok) {
          const data = await resp.json();
          setTestResult({ success: true, message: `服务器后端连接正常！服务: ${data.service}，预设模型: ${data.model}` });
        } else {
          setTestResult({ success: false, message: `服务器返回状态异常: ${resp.status}` });
        }
      } catch (e: any) {
        setTestResult({ success: false, message: `无法连接服务器后端: ${e.message}` });
      } finally {
        setTesting(false);
      }
      return;
    }

    // Custom mode
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: "请先输入自定义 API Key" });
      setTesting(false);
      return;
    }

    const rawBaseUrl = baseUrl.trim() || 'https://generativelanguage.googleapis.com';
    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const url = `${cleanBaseUrl}/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`;

    try {
      const resp = await fetch(url, { method: 'GET' });
      if (resp.ok) {
        setTestResult({ success: true, message: "连接成功！自定义 API Key 有效且网络通畅。" });
      } else {
        const err = await resp.json().catch(() => null);
        setTestResult({ success: false, message: `连接失败 (${resp.status}): ${err?.error?.message || resp.statusText}` });
      }
    } catch (e: any) {
      setTestResult({ success: false, message: `网络错误: ${e.message || '无法连接到目标 API，请检查网络或反代设置'}` });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-gray-900 border border-gray-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6 text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">⚙️</span>
            <h2 className="text-lg font-bold text-white">后端与 API 配置</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Mode Selector */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-300">
            运行模式
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => { setMode('server'); setTestResult(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                mode === 'server'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/30'
                  : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="flex items-center gap-1.5 font-semibold text-xs text-purple-300 mb-1">
                <span>🚀 专属服务器模式</span>
                <span className="bg-purple-500/20 text-purple-300 px-1.5 py-0.2 rounded text-[10px]">推荐</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                免填 Key，由博客服务器中继调用 Gemini
              </p>
            </button>

            <button
              type="button"
              onClick={() => { setMode('custom'); setTestResult(null); }}
              className={`p-3 rounded-xl border text-left transition-all ${
                mode === 'custom'
                  ? 'border-purple-500 bg-purple-950/40 text-white shadow-lg shadow-purple-950/30'
                  : 'border-gray-800 bg-gray-950/60 text-gray-400 hover:border-gray-700'
              }`}
            >
              <div className="font-semibold text-xs text-gray-200 mb-1">
                🔑 自定义 Key 模式
              </div>
              <p className="text-[11px] text-gray-400 leading-tight">
                使用自己申请的 Gemini Key 在本地浏览器直连
              </p>
            </button>
          </div>
        </div>

        {/* Custom Key Fields */}
        {mode === 'custom' && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                Gemini API Key <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-200"
                >
                  {showKey ? "隐藏" : "显示"}
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-1.5">
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline"
                >
                  前往 Google AI Studio 免费获取 API Key ↗
                </a>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1.5">
                API 代理地址 (Base URL) <span className="text-gray-500 text-xs font-normal">可选</span>
              </label>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="默认: https://generativelanguage.googleapis.com"
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {mode === 'server' && (
          <div className="bg-gray-950/80 border border-gray-800 rounded-xl p-3.5 text-xs text-gray-300 space-y-1.5">
            <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <span>● 服务器状态：正常运行</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              后端节点运行于本服务器（<code className="text-purple-300">140.245.65.111.sslip.io</code>），由 PM2 守护并配置有全局 Gemini 图像生成凭据，访客可直接使用。
            </p>
          </div>
        )}

        {/* Model Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1.5">
            生成模型 (Model)
          </label>
          <input
            type="text"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder="默认: gemini-2.5-flash-image"
            className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            支持 <code className="text-gray-400">gemini-2.5-flash-image</code>、<code className="text-gray-400">gemini-3.1-flash-image</code> 等。
          </p>
        </div>

        {/* Test Result Display */}
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
            {testing ? "测试中..." : "测试连接"}
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
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
