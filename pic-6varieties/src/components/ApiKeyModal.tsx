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
  const [apiKey, setApiKey] = useState(config.apiKey);
  const [baseUrl, setBaseUrl] = useState(config.baseUrl);
  const [model, setModel] = useState(config.model);
  const [showKey, setShowKey] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    setApiKey(config.apiKey);
    setBaseUrl(config.baseUrl);
    setModel(config.model);
    setTestResult(null);
  }, [config, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    onSave({
      apiKey: apiKey.trim(),
      baseUrl: baseUrl.trim(),
      model: model.trim() || 'gemini-2.5-flash-image'
    });
    onClose();
  };

  const handleClear = () => {
    setApiKey('');
    setBaseUrl('');
    setModel('gemini-2.5-flash-image');
    setTestResult(null);
    onSave({
      apiKey: '',
      baseUrl: '',
      model: 'gemini-2.5-flash-image'
    });
  };

  const handleTestConnection = async () => {
    if (!apiKey.trim()) {
      setTestResult({ success: false, message: "请先输入 API Key" });
      return;
    }

    setTesting(true);
    setTestResult(null);

    const rawBaseUrl = baseUrl.trim() || 'https://generativelanguage.googleapis.com';
    const cleanBaseUrl = rawBaseUrl.replace(/\/+$/, '');
    const url = `${cleanBaseUrl}/v1beta/models?key=${encodeURIComponent(apiKey.trim())}`;

    try {
      const resp = await fetch(url, { method: 'GET' });
      if (resp.ok) {
        setTestResult({ success: true, message: "连接成功！API Key 有效且网络畅通。" });
      } else {
        const err = await resp.json().catch(() => null);
        setTestResult({ success: false, message: `连接失败 (${resp.status}): ${err?.error?.message || resp.statusText}` });
      }
    } catch (e: any) {
      setTestResult({ success: false, message: `网络错误: ${e.message || '无法连接到 API 地址，请检查网络或反代'}` });
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
            <span className="text-xl">🔑</span>
            <h2 className="text-lg font-bold text-white">Gemini API 配置</h2>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Form Body */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              Google Gemini API Key <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 pr-10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-200"
              >
                {showKey ? "隐藏" : "显示"}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
              <span>还没有 Key？</span>
              <a 
                href="https://aistudio.google.com/app/apikey" 
                target="_blank" 
                rel="noreferrer"
                className="text-purple-400 hover:text-purple-300 underline underline-offset-2"
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
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              若国内直连受限，可填入自建的 Cloudflare Worker 或反向代理地址。
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">
              图像生成模型 (Model) <span className="text-gray-500 text-xs font-normal">可选</span>
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="默认: gemini-2.5-flash-image"
              className="w-full bg-gray-950 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
            <p className="text-xs text-gray-400 mt-1">
              默认使用 <code className="bg-gray-800 px-1 py-0.5 rounded text-purple-300">gemini-2.5-flash-image</code>。
            </p>
          </div>

          {/* Test connection output */}
          {testResult && (
            <div className={`p-3 rounded-lg text-xs border ${testResult.success ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300' : 'bg-rose-950/60 border-rose-800 text-rose-300'}`}>
              {testResult.message}
            </div>
          )}

          {/* Privacy Note */}
          <div className="bg-gray-950/70 border border-gray-800 rounded-lg p-3 text-xs text-gray-400 space-y-1">
            <div className="flex items-center gap-1.5 text-purple-300 font-medium">
              <span>🔒 本地隐私保护</span>
            </div>
            <p>
              所有 Key 和设置仅保存在您的浏览器本地（localStorage），图片生成请求由前端直接发送至 Google 官方 API，绝不会经过任何中间服务器转存。
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing || !apiKey.trim()}
              className="px-3 py-2 text-xs font-medium rounded-lg border border-gray-700 hover:bg-gray-800 text-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {testing ? "测试中..." : "测试连接"}
            </button>
            {config.apiKey && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 text-xs font-medium rounded-lg text-red-400 hover:bg-red-950/30 transition-colors"
              >
                清除配置
              </button>
            )}
          </div>
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
