export interface ApiConfig {
  provider: 'gemini' | 'openai-compatible' | 'demo';
  apiKey: string;
  baseUrl: string;
  model: string;
}

export const DEFAULT_API_CONFIG: ApiConfig = {
  provider: 'gemini',
  apiKey: '',
  baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
  model: 'gemini-1.5-flash',
};

export const PROVIDER_OPTIONS = [
  {
    id: 'gemini',
    name: 'Google Gemini (官方推荐 · 免费极速)',
    defaultBaseUrl: 'https://generativelanguage.googleapis.com/v1beta',
    defaultModel: 'gemini-1.5-flash',
    models: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'],
    hint: '支持直接输入 Google AI Studio 免费申请的 API Key，纯前端直连。'
  },
  {
    id: 'openai-compatible',
    name: 'OpenAI 兼容平台 (FreeLLMAPI / DeepSeek / 智谱 / Kimi等)',
    defaultBaseUrl: 'https://api.deepseek.com/v1',
    defaultModel: 'deepseek-chat',
    models: ['deepseek-chat', 'deepseek-reasoner', 'glm-4-flash', 'moonshot-v1-8k', 'step-1-8k'],
    hint: '填入任意 OpenAI 规范的端点（例如你的本地 FreeLLMAPI: http://127.0.0.1:3005/v1 或官方云地址）。'
  },
  {
    id: 'demo',
    name: '演示体验模式 (无需 Key · 本地模拟)',
    defaultBaseUrl: '',
    defaultModel: 'demo-curator',
    models: ['demo-curator'],
    hint: '无需任何 API Key，体验完整的审校、批注重写与回传闭环工作流。'
  }
];

export async function callRefineArticle(params: {
  config: ApiConfig;
  systemPrompt: string;
  topPrompt: string;
  baseDraft: string;
  annotations: string[];
  onChunk: (text: string) => void;
  signal?: AbortSignal;
}): Promise<string> {
  const { config, systemPrompt, topPrompt, baseDraft, annotations, onChunk, signal } = params;

  // Build the structured user prompt
  let annotationsBlock = '';
  if (annotations.length > 0) {
    annotationsBlock = `### 审校修改批注与具体要求（必须逐条严格落实）：\n` +
      annotations.map((note, index) => `${index + 1}. ${note}`).join('\n');
  } else {
    annotationsBlock = `（未指定特定微观批注，请根据总体提示词进行全篇升级优化）`;
  }

  const userContent = `你现在正在执行专业出版级的【文章深度重构与审校精修】任务。

### 待精修的基底原文：
\`\`\`markdown
${baseDraft}
\`\`\`

### 总体优化方向 / 核心提示词：
${topPrompt || '全面提升文笔品质，增强逻辑严密性，优化段落过渡与节奏感。'}

${annotationsBlock}

---
### 交付要求：
1. 请输出一份**完整、连贯、已完成所有批注修改后的最终成品成文**（直接输出 Markdown 正文，不要有任何多余的客套话或前言后语，不要输出“这是修改后的文章”等废话）。
2. 保留原文章的核心论点，但深度融合批注中提到的所有修正、补充数据与文风要求。
3. 排版需赏心悦目，善用精炼小标题、关键处加粗与优雅的引用金句块。`;

  // Demo / Mock Mode
  if (config.provider === 'demo' || !config.apiKey) {
    return runDemoStream(baseDraft, topPrompt, annotations, onChunk, signal);
  }

  // Google Gemini API
  if (config.provider === 'gemini') {
    return runGeminiStream(config, systemPrompt, userContent, onChunk, signal);
  }

  // OpenAI Compatible
  return runOpenAICompatStream(config, systemPrompt, userContent, onChunk, signal);
}

// Google Gemini REST Streaming
async function runGeminiStream(
  config: ApiConfig,
  systemPrompt: string,
  userContent: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const model = config.model || 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${config.apiKey}&alt=sse`;

  const payload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: userContent }]
      }
    ],
    systemInstruction: {
      parts: [{ text: systemPrompt }]
    },
    generationConfig: {
      temperature: 0.7,
    }
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || `Google API 报错 (HTTP ${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.replace(/^data:\s*/, '').trim();
        if (jsonStr) {
          try {
            const data = JSON.parse(jsonStr);
            const textChunk = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (textChunk) {
              fullText += textChunk;
              onChunk(fullText);
            }
          } catch (e) {
            // Ignore partial SSE chunks
          }
        }
      }
    }
  }

  return fullText;
}

// OpenAI Compatible Streaming
async function runOpenAICompatStream(
  config: ApiConfig,
  systemPrompt: string,
  userContent: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const baseUrl = config.baseUrl.replace(/\/+$/, '');
  const url = `${baseUrl}/chat/completions`;

  const payload = {
    model: config.model || 'deepseek-chat',
    stream: true,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userContent }
    ],
    temperature: 0.7
  };

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.apiKey}`
    },
    body: JSON.stringify(payload),
    signal
  });

  if (!response.ok) {
    const errorJson = await response.json().catch(() => ({}));
    throw new Error(errorJson?.error?.message || errorJson?.message || `API 端点报错 (HTTP ${response.status})`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error('无法读取响应流');

  const decoder = new TextDecoder('utf-8');
  let fullText = '';
  let buffer = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split('\n');
    buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const jsonStr = line.replace(/^data:\s*/, '').trim();
        if (jsonStr === '[DONE]') break;
        if (jsonStr) {
          try {
            const data = JSON.parse(jsonStr);
            const delta = data.choices?.[0]?.delta?.content || '';
            if (delta) {
              fullText += delta;
              onChunk(fullText);
            }
          } catch (e) {
            // Ignore partial SSE chunk
          }
        }
      }
    }
  }

  return fullText;
}

// AI 智能建议批注生成器
export async function generateAiAnnotations(params: {
  config: ApiConfig;
  draft: string;
}): Promise<string[]> {
  const { config, draft } = params;
  if (!draft.trim()) return [];

  // If demo mode or no key, return high quality mock suggestions
  if (config.provider === 'demo' || !config.apiKey) {
    await new Promise(r => setTimeout(r, 600));
    return [
      '开篇段落论据偏单薄，建议补充具体的量化周期指标与宏观环境背景',
      '中间段落逻辑推进略显跳跃，建议增加承上启下的产业传导机制说明',
      '结尾缺少有力的核心定性概括，建议提炼一句掷地有声的总结金句'
    ];
  }

  const prompt = `请作为一位资深主编，审阅下面这篇文章草稿，提出 3 条具体、深刻、极具可操作性的【修改批注建议】（如语言润色、逻辑死穴纠错、补充事实数据、结构优化等）。

### 原文草稿：
${draft}

### 输出要求：
严格输出为 JSON 字符串数组，例如：
["第一条修改建议...", "第二条修改建议...", "第三条修改建议..."]
不要有任何其他解释文字。`;

  try {
    let rawOutput = '';
    if (config.provider === 'gemini') {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${config.model || 'gemini-1.5-flash'}:generateContent?key=${config.apiKey}`;
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseMimeType: 'application/json' }
        })
      });
      const data = await res.json();
      rawOutput = data.candidates?.[0]?.content?.parts?.[0]?.text || '[]';
    } else {
      const url = `${config.baseUrl.replace(/\/+$/, '')}/chat/completions`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.apiKey}`
        },
        body: JSON.stringify({
          model: config.model || 'deepseek-chat',
          messages: [{ role: 'user', content: prompt }]
        })
      });
      const data = await res.json();
      rawOutput = data.choices?.[0]?.message?.content || '[]';
    }

    const match = rawOutput.match(/\[[\s\S]*\]/);
    if (match) {
      const parsed = JSON.parse(match[0]);
      if (Array.isArray(parsed)) return parsed.map(s => String(s)).slice(0, 4);
    }
  } catch (e) {
    console.error('Failed to generate AI annotations:', e);
  }

  return [
    '建议强化段落间的因果论证链条，减少主观断言',
    '建议在关键论点处补充最新产业链调研或高频指标佐证',
    '结尾段落建议精简收敛，拔高投研哲学与风控意蕴'
  ];
}

// Simulated Streaming for Demo Mode
async function runDemoStream(
  baseDraft: string,
  topPrompt: string,
  annotations: string[],
  onChunk: (text: string) => void,
  signal?: AbortSignal
): Promise<string> {
  const isCommodity = baseDraft.includes('橡胶') || baseDraft.includes('期货') || topPrompt.includes('投研');
  
  let refinedContent = '';
  if (isCommodity) {
    refinedContent = `# 天然橡胶：基差深贴水收敛与四季度估值重塑

> **核心逻辑**：宏观预期定价已充分计提，产业微观供需拐点悄然浮现。青岛保税区去库斜率拐头，产区物候扰动与浓乳原料争夺强化成本支撑，深贴水格局下基差收敛修复的赔率正在显著放大。

---

## 一、 宏观与微观错配：万五关口的多空博弈本质

当前天然橡胶期货主力合约在 15,000 元/吨整数关口反复争夺。市场普遍的悲观叙事多聚焦于终端乘用车内需走弱，然而，**若仅以静态宏观视角观照商品，极易错失微观供需边际好转的结构性阿尔法**。

从基本面演变节奏来看，当前橡胶市场正处于典型的“预期悲观与现实韧性”的碰撞阶段。海外主产区气候异动与国内老胶集中注销交织，使得现有的深贴水定价包含了过度的风险溢价。

---

## 二、 产区物候与原料争夺：不可忽视的成本刚性支撑

根据近三年东南亚主产区降雨偏离度历史追踪：
* **泰国东北部及南部产区**：近期受季风低压带影响暴雨频发，降雨量较历史同期均值偏高约 18.5%，多地出现割胶间断甚至停割；
* **原料分流冲击**：下游手套厂采购回暖带动原料浓乳收购价居高不下，浓乳对干胶形成持续的升水溢价（价差维持在 1,200~1,500 元/吨高位），胶农割胶优先制胶乳，直接挤压了标胶交割品的产出意愿；
* **国内产区现状**：海南与云南产区虽已全面开割，但人工采胶成本刚性推升底部，原料坚挺对盘面构成了坚实的安全垫。

---

## 三、 库存拐点初现：青岛保税区去库斜率的信号意义

近期高频跟踪显示，青岛保税区区内与区外天然橡胶总库存出现连续数周的去库迹象。
虽然绝对库存基数仍处于历史中位偏上区间，但**去库斜率的变轨，往往比绝对库存数字更能提前预告现货买盘的韧性**：

| 细分维度 | 运行指标 | 产业解读与影响 |
| :--- | :--- | :--- |
| **半钢胎开工率** | 71.4% (高位维稳) | 得益于高性价比乘用车及海外出口订单支撑，用胶需求稳健 |
| **全钢胎开工率** | 59.8% (底部平稳) | 物流货运需求平缓，以刚性刚需补库为主，未见进一步断崖 |
| **保税区总库存** | 拐头去化 1.2% | 港口入库放缓，深贴水现货对下游工厂具备极强吸引力 |

---

## 四、 期限结构解析：基差深贴水的收敛路径与套利边界

当前盘面的核心矛盾集中体现在基差深贴水结构上。全乳胶现货对主力合约长期处于高贴水状态，其背后主因是仓单流转机制与临近 11 月老胶集中注销的交割博弈。

根据全持有成本无风险交割套利模型测算：
$$\text{理论无风险套利边际} = \text{现货升贴水} + \text{仓储交割费} + \text{资金利息成本}$$
当实际贴水幅度超越该临界点时，期现正向套利盘将逐步进场锁定货源，从而封死深跌空间。在四季度传统停割期到来前，基差深贴水的修复存在两条路径：**要么现货坚挺推升，要么盘面以震荡夯实底部，基差回归是确定性极高的数理收敛过程**。

---

## 五、 结语与交易心智

> “商品周期的魅力，恰恰在于它从不顺从线性的悲观预期，而是在极度贴水与产业沉默中完成自我救赎。”

面对当前的橡胶盘面，切忌在深贴水极值区盲目杀跌。在底仓风险预算受控的前提下，紧盯保税区去库节奏与旺产季停割信号，静待基差回归带来的稳健左侧红利。`;
  } else {
    refinedContent = `# 在概率的迷雾中：一个交易者的止损哲学与心性修行

> **题记**：橡树在狂风中折断，因为执着于刚强；芦苇在疾风中倾伏，因敬畏未知而得以长青。交易的真谛，从来不是征服市场，而是在概率的荒原上，学会体面而从容地向不确定性躬身。

---

## 一、 执念之殇：为什么我们总无法坦然接受亏损？

在投机市场上行色匆匆十数载，我见过太多天赋异禀、智力绝伦的交易者，最终轰然倒在市场的风暴之中。探究其本源，绝大多数悲剧并非源于不懂技术形态，亦非缺乏宏观眼界，而是**灵魂深处无法接纳“亏损”这一客观事实的自负**。

每一次建仓前，大脑的贪婪机制总在低语：“这一单是完美的，它必将带来丰厚奖赏。”于是，当行情背道而驰时，交易者本能地生出抗拒与嗔怒——不甘心浮亏、抱侥幸心理死扛，直至保证金在黑天鹅中灰飞烟灭。

市场并不是为你我开设的剧场，它是一片冷酷而中立的随机漫步之海。**行情往哪走都有可能，而坚信自己能每一次都预测正确的想法，是交易者最致命的精神毒药。**

---

## 二、 止损即期权费：凯利公式与正期望的大数定律

从数理统计的本质剖析，**止损从来不是承认失败的耻辱柱，而是一张继续留在牌桌上的门票，是一笔换取未来巨额非对称收益的“看涨期权费”**。

在著名的凯利公式与期望收益模型中：
$$\mathbb{E}[R] = p \cdot W - (1 - p) \cdot L$$
* 只要你的交易系统盈亏比能够达到 **$3 : 1$** 甚至更高；
* 哪怕你的胜率 $p$ 仅仅只有 **40%**；
* 你的长期数学期望依旧是稳健且巨大的正值：
$$\mathbb{E}[R] = 0.4 \times 3 - 0.6 \times 1 = +0.6$$

这意味着，每一次干脆利落的止损，在数学大数定律的视野下，都不过是一次正常的方差波动。你付出了极其微小的确定性代价，截断了可能吞噬本金的肥尾风险，守住了能够捕捉下一轮波澜壮阔大行情的全部火种。

---

## 三、 向内求索：在不确定性中优雅自持

坚决执行止损，本质上是一场向内求索的心性修行。

它要求我们在骄傲的人类天性面前，学会臣服于客观世界深不可测的概率；它要求我们在损失厌恶的本能冲动面前，践行钢铁般的纪律。**向概率致敬，向市场未知的深渊行礼，这并非软弱，而是一种饱经沧桑后的从容自洽。**

在充满迷雾与巨浪的市场中行走，愿我们都能握紧风控的罗盘，在不确定性中笃定前行，静待属于你的时代周期与概率盛宴。`;
  }

  // Simulate streaming
  const step = 20;
  for (let i = 0; i < refinedContent.length; i += step) {
    if (signal?.aborted) break;
    onChunk(refinedContent.slice(0, i + step));
    await new Promise(r => setTimeout(r, 25));
  }

  return refinedContent;
}
