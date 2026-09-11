import React, { useState } from 'react';
import { ApiConfig, PROVIDER_OPTIONS } from '../services/llm';
import { Key, Globe, Cpu, Check, X, ShieldAlert, Sparkles } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  config: ApiConfig;
  onSave: (config: ApiConfig) => void;
}

export const SettingsModal: React.FC<Props> = ({ isOpen, onClose, config, onSave }) => {
  if (!isOpen) return null;

  const [form, setForm] = useState<ApiConfig>({ ...config });
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'failed'>('idle');
  const [testMsg, setTestMsg] = useState('');

  const currentProvider = PROVIDER_OPTIONS.find(p => p.id === form.provider) || PROVIDER_OPTIONS[0];

  const handleProviderChange = (providerId: string) => {
    const p = PROVIDER_OPTIONS.find(x => x.id === providerId);
    if (!p) return;
    setForm(prev => ({
      ...prev,
      provider: p.id as any,
      baseUrl: p.defaultBaseUrl,
      model: p.defaultModel,
    }));
    setTestStatus('idle');
  };

  const handleTest = async () => {
    if (form.provider === 'demo') {
      setTestStatus('success');
      setTestMsg('演示模式无需测试，随时可用！');
      return;
    }
    if (!form.apiKey) {
      setTestStatus('failed');
      setTestMsg('请先输入 API 密钥！');
      return;
    }

    setTestStatus('testing');
    setTestMsg('正在发送测试探针...');

    try {
      if (form.provider === 'gemini') {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${form.model}:generateContent?key=${form.apiKey}`;
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'hi' }] }],
          }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || `HTTP ${res.status}`);
        }
      } else {
        const url = `${form.baseUrl.replace(/\/+$/, '')}/chat/completions`;
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${form.apiKey}`
          },
          body: JSON.stringify({
            model: form.model,
            messages: [{ role: 'user', content: 'hi' }],
            max_tokens: 5
          })
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err?.error?.message || err?.message || `HTTP ${res.status}`);
        }
      }
      setTestStatus('success');
      setTestMsg('连接成功！模型与密钥验证通过！');
    } catch (e: any) {
      setTestStatus('failed');
      setTestMsg(`连接失败: ${e.message}`);
    }
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-slate-100">AI 模型与算力配置</h2>
              <p className="text-xs text-slate-400">密钥保存在浏览器本地，纯前端直连，绝不上云</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Provider Selection */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">选择模型渠道平台</label>
            <div className="grid grid-cols-1 gap-2">
              {PROVIDER_OPTIONS.map((p) => (
                <div
                  key={p.id}
                  onClick={() => handleProviderChange(p.id)}
                  className={`p-3 rounded-xl border text-left cursor-pointer transition flex items-start gap-3 ${
                    form.provider === p.id
                      ? 'border-blue-500/80 bg-blue-500/10 text-white shadow-sm'
                      : 'border-slate-800 bg-slate-950/40 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className={`mt-0.5 p-1 rounded-md ${form.provider === p.id ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">{p.name}</div>
                    <div className="text-xs text-slate-400 mt-0.5 leading-relaxed">{p.hint}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {form.provider !== 'demo' && (
            <>
              {/* API Key */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-medium text-slate-300">API 密钥 (API Key)</label>
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    {showKey ? '隐藏' : '显示'}
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={form.apiKey}
                    onChange={(e) => {
                      setForm({ ...form, apiKey: e.target.value.trim() });
                      setTestStatus('idle');
                    }}
                    placeholder={form.provider === 'gemini' ? 'AIzaSy...' : 'sk-...'}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>

              {/* Base URL (only for openai-compatible) */}
              {form.provider === 'openai-compatible' && (
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    接口端点地址 (Base URL)
                  </label>
                  <div className="relative">
                    <Globe className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      value={form.baseUrl}
                      onChange={(e) => setForm({ ...form, baseUrl: e.target.value.trim() })}
                      placeholder="https://api.deepseek.com/v1 或 http://127.0.0.1:3005/v1"
                      className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    若使用本地 FreeLLMAPI 网关，请填入 <code className="text-blue-400">http://127.0.0.1:3005/v1</code>
                  </p>
                </div>
              )}

              {/* Model selection */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  模型名称 (Model ID)
                </label>
                <div className="relative">
                  <Cpu className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={form.model}
                    onChange={(e) => setForm({ ...form, model: e.target.value.trim() })}
                    placeholder="gemini-1.5-flash / deepseek-chat"
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-slate-100 text-sm focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
                {currentProvider.models && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    <span className="text-[11px] text-slate-400 py-0.5">推荐：</span>
                    {currentProvider.models.map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setForm({ ...form, model: m })}
                        className={`text-[11px] px-2 py-0.5 rounded-md border font-mono transition ${
                          form.model === m
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/50'
                            : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                        }`}
                      >
                        {m}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {/* Test Status feedback */}
          {testStatus !== 'idle' && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
                testStatus === 'success'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : testStatus === 'failed'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}
            >
              {testStatus === 'success' && <Check className="w-4 h-4 flex-shrink-0 text-emerald-400 mt-0.5" />}
              {testStatus === 'failed' && <ShieldAlert className="w-4 h-4 flex-shrink-0 text-rose-400 mt-0.5" />}
              {testStatus === 'testing' && (
                <div className="w-4 h-4 flex-shrink-0 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mt-0.5" />
              )}
              <div className="break-all">{testMsg}</div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/60">
          <button
            type="button"
            onClick={handleTest}
            disabled={testStatus === 'testing'}
            className="px-4 py-2 rounded-xl border border-slate-700 text-xs font-medium text-slate-300 hover:bg-slate-800 transition disabled:opacity-50"
          >
            {testStatus === 'testing' ? '正在连接...' : '测试连接'}
          </button>
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-slate-200 transition"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
            >
              保存配置
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
