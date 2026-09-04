import { ApiConfig } from '../types';

export const BACKEND_ENDPOINT = 'https://140.245.65.111.sslip.io/api/pic-6varieties/generate';

/**
 * 调度后端生成写真：
 * - engine = 'pollinations'：调用免费开源 FLUX / Turbo 模型
 * - engine = 'gemini'：调用 Google Gemini 2.5 Flash Image 真实人脸重构
 */
export const generatePortrait = async (
  base64Image: string,
  prompt: string,
  config: ApiConfig
): Promise<string> => {
  const engine = config.engine || 'pollinations';
  const model = engine === 'pollinations' 
    ? (config.pollinationsModel || 'flux') 
    : (config.geminiModel || 'gemini-2.5-flash-image');

  try {
    const response = await fetch(BACKEND_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        base64Image,
        prompt,
        engine,
        model,
        customApiKey: (config.customGeminiKey || '').trim(),
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => null);
      const errMsg = errData?.error || `请求失败 (${response.status}: ${response.statusText})`;
      throw new Error(errMsg);
    }

    const data = await response.json();
    if (!data.imageUrl) {
      throw new Error("服务未返回图片数据");
    }

    return data.imageUrl;
  } catch (error: any) {
    console.error("Generate Portrait Error:", error);
    throw new Error(error.message || "生成请求异常");
  }
};
