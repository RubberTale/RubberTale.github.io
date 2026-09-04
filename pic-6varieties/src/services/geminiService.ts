import { ApiConfig } from '../types';

/**
 * 直接在客户端调用 Google Gemini API 生成特定风格写真照片
 */
export const generatePortrait = async (
  base64Image: string,
  prompt: string,
  config: ApiConfig
): Promise<string> => {
  const apiKey = (config.apiKey || '').trim();
  if (!apiKey) {
    throw new Error("未检测到 API Key，请点击右上角【API Key 设置】填写您的 Google Gemini Key。");
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
        throw new Error(`提示词被安全过滤拦截: ${data.promptFeedback.blockReason}`);
      }
      throw new Error("模型未返回任何结果");
    }

    if (candidate.finishReason && candidate.finishReason !== "STOP") {
      if (candidate.finishReason === "SAFETY") {
        throw new Error("生成内容因安全审核策略被拦截 (SAFETY)");
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
        throw new Error(`模型返回说明而非图片: ${textPart.slice(0, 100)}...`);
      }
    }

    throw new Error("响应数据中未包含有效图像内容");
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    throw new Error(error.message || "请求 Gemini API 失败");
  }
};
