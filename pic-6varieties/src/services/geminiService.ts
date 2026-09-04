import { ApiConfig } from '../types';

export const SERVER_ENDPOINT = 'https://140.245.65.111.sslip.io/api/pic-6varieties/generate';

/**
 * 生成特定风格写真照片：
 * 1. 默认走博客专属服务器后端（免Key直接调用）；
 * 2. 如果用户配置了自定义 API Key，则直接在客户端调用 Google Gemini 官方 API。
 */
export const generatePortrait = async (
  base64Image: string,
  prompt: string,
  config: ApiConfig
): Promise<string> => {
  // 模式 1：使用博客服务器后端
  if (config.mode === 'server' || (!config.apiKey.trim() && config.mode !== 'custom')) {
    const response = await fetch(SERVER_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        prompt,
        model: config.model || 'gemini-2.5-flash-image',
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errMsg = errorData?.error || `后端服务响应错误 (${response.status}: ${response.statusText})`;
      throw new Error(errMsg);
    }

    const data = await response.json();
    if (!data.imageUrl) {
      throw new Error("后端未返回图片内容");
    }
    return data.imageUrl;
  }

  // 模式 2：使用用户自定义的 Gemini API Key 直连
  const apiKey = (config.apiKey || '').trim();
  if (!apiKey) {
    throw new Error("未检测到 API Key，请点击右上角【API 设置】配置。");
  }

  const rawBaseUrl = (config.baseUrl || '').trim() || 'https://generativelanguage.googleapis.com';
  const baseUrl = rawBaseUrl.replace(/\/+$/, '');
  const model = (config.model || '').trim() || 'gemini-2.5-flash-image';

  // 提取真实图片 mimeType 及纯 base64 字符串
  const matches = base64Image.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/);
  let mimeType = 'image/jpeg';
  let cleanBase64 = base64Image;

  if (matches && matches.length === 3) {
    mimeType = matches[1];
    cleanBase64 = matches[2];
  } else {
    cleanBase64 = base64Image.replace(/^data:image\/\w+;base64,/, '');
  }

  const endpoint = `${baseUrl}/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  const requestBody = {
    contents: [
      {
        parts: [
          {
            text: `${prompt}\n\nImportant: Maintain the exact facial features, expression, and identity of the person in the provided reference image. Generate a high-quality, photorealistic image.`
          },
          {
            inlineData: {
              mimeType: mimeType,
              data: cleanBase64
            }
          }
        ]
      }
    ]
  };

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errMsg = errorData?.error?.message || `请求失败 (${response.status}: ${response.statusText})`;
      throw new Error(errMsg);
    }

    const data = await response.json();
    const candidate = data.candidates?.[0];

    if (!candidate) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`提示词被安全策略拦截: ${data.promptFeedback.blockReason}`);
      }
      throw new Error("模型未返回任何有效结果");
    }

    if (candidate.finishReason && candidate.finishReason !== "STOP") {
      if (candidate.finishReason === "SAFETY") {
        throw new Error("生成内容被安全审核策略拦截 (SAFETY)");
      }
    }

    if (candidate.content && candidate.content.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const outMime = part.inlineData.mimeType || 'image/png';
          return `data:${outMime};base64,${part.inlineData.data}`;
        }
      }

      const textPart = candidate.content.parts.find((p: any) => p.text)?.text;
      if (textPart) {
        throw new Error(`模型返回了文本而非图片: ${textPart.slice(0, 100)}...`);
      }
    }

    throw new Error("响应数据中未包含有效图像内容");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "请求 Gemini API 失败");
  }
};
