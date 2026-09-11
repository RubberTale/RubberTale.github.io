/**
 * Backend API Client for Article Craft
 * Connects to the secure backend proxy which handles official document generation
 */

export interface PinpointAnnotation {
  id: string;
  quote: string;      // The exact quoted snippet in the original draft
  comment: string;    // The specific modification instruction
  tag: string;        // E.g. "措辞规范", "明确职责", "增补节点", "细化举措"
  enabled: boolean;   // Whether this annotation is active in current round
}

export interface GenerateParams {
  globalPrompt: string;
  draft: string;
  annotations: PinpointAnnotation[];
  round: number;
  onChunk: (text: string) => void;
  onDone: () => void;
  onError: (err: Error) => void;
}

const API_BASE = 'https://140.245.65.111.sslip.io/api/article-craft';

/**
 * Streams the generated official document from the backend
 */
export async function streamOfficialDocument(
  params: GenerateParams,
  abortSignal?: AbortSignal
): Promise<void> {
  const { globalPrompt, draft, annotations, round, onChunk, onDone, onError } = params;

  try {
    const response = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        globalPrompt,
        draft,
        annotations,
        round
      }),
      signal: abortSignal
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`服务端响应异常 (${response.status}): ${errText}`);
    }

    if (!response.body) {
      throw new Error('未收到流式数据响应体');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('data: ')) continue;
        const dataStr = trimmed.slice(6);
        if (dataStr === '[DONE]') {
          onDone();
          return;
        }
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.error) {
            throw new Error(parsed.error);
          }
          if (parsed.text) {
            onChunk(parsed.text);
          }
        } catch (e: any) {
          if (e.message && e.message !== 'Unexpected end of JSON input') {
            throw e;
          }
        }
      }
    }

    onDone();
  } catch (err: any) {
    if (err.name === 'AbortError') {
      onDone();
      return;
    }
    onError(err);
  }
}

/**
 * AI automatically scans the draft and suggests pinpoint annotations
 */
export async function fetchSuggestedAnnotations(
  globalPrompt: string,
  draft: string
): Promise<Array<{ quote: string; comment: string; tag: string }>> {
  const response = await fetch(`${API_BASE}/suggest-annotations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      globalPrompt,
      draft
    })
  });

  if (!response.ok) {
    const errData = await response.json().catch(() => ({}));
    throw new Error(errData.error || `请求失败 (${response.status})`);
  }

  const data = await response.json();
  return data.suggestions || [];
}
