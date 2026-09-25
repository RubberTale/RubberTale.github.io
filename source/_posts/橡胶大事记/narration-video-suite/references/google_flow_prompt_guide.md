# Google Flow 视频生成提示词指南 (7层公式与词库)

## 一、Google Flow / Veo 核心 7 层提示词公式

```text
[1. 摄像机与镜头] + [2. 主体] + [3. 动作与物理规律] + [4. 环境与背景] + [5. 灯光与氛围] + [6. 风格与美学] + [7. 音效与音频描述]
```

### 1. 摄像机与镜头 (Camera & Shot)
- `Cinematic extreme macro close-up`（超微距特写）
- `Slow dolly-in / Push-in camera movement`（缓慢推镜头）
- `Smooth orbital rotation camera movement`（平滑环绕运镜）
- `Macro tracking shot along the cutting blade path`（沿刀刃轨迹动态追踪）
- `Phantom high-speed slow-motion shot (1000 fps)`（1000帧高速微慢动作）
- `3D anatomical cutaway animation`（3D解剖剖面透视）
- `Epic cinematic drone aerial sweep and descent`（史诗级航拍大俯冲）
- `Shot on 100mm macro anamorphic lens, shallow depth of field`（100毫米微距变形镜头，浅景深）

### 2. 物理与流体运动 (Action & Physics)
- `Thick, viscous, pure milky-white latex oozing smoothly`（浓稠纯白乳胶顺滑渗出）
- `Liquid droplet detaching and splashing gently`（液滴脱落并轻柔飞溅）
- `Constant Brownian motion suspension`（持续布朗运动悬浮）
- `Tangled molecular coils forcibly stretched into orderly bundles then snapping back instantaneously`（盘绕线团拉直并瞬间弹回）
- `High velocity jet driven by immense internal turgor pressure`（高内膨压驱动的高速激射）

### 3. 灯光与色彩 (Lighting & Color)
- `Moody atmospheric dawn twilight, volumetric fog`（朦胧黎明晨光，丁达尔体积雾）
- `Ethereal god rays breaking through misty jungle canopy`（圣光穿透薄雾林冠）
- `Sharp edge highlights, key lighting, dark ambient void`（锐利边缘光，深邃暗黑背景）
- `Fluorescent bioluminescent microscopy visual style`（荧光生物显微风格）

### 4. 风格与质感 (Style & Aesthetics)
- `BBC Nature Documentary & National Geographic cinematic style`（BBC/国家地理纪录片质感）
- `Hyper-realistic 8k resolution, Arri Alexa Mini LF aesthetic, 35mm film grain`（8K超写实，阿莱电影机质感，胶片颗粒）
- `Scientific American / IMAX scientific visualization`（科学美国人 / IMAX 科普视觉）

### 5. 音效提示 (Audio Cue for Google Flow)
- `Ambient rainforest morning sounds, distant crickets, faint metallic scraping, soft liquid drop sound`
- `Deep ambient drone of nature awakening`
- `Subtle pulsating fluid sound effects`

---

## 二、生成参数强制约定（来自 1.1 / 1.2 实战教训）

| 参数 | 取值 | 说明 |
|---|---|---|
| **画幅** | `16:9` | 横屏纪录片，B站/YouTube 通用 |
| **分辨率** | **`1080p`** | ⚠️ 1.2 有 16/18 个片段误生成为 720p，成片放大发糊。**必须锁死 1080p** |
| **帧率** | `24fps` | 电影感。注意 1.1 成片用的是 30fps，两集混剪时需统一 |
| **片段时长** | **`12s`（优先）** | ⚠️ 现有素材是 24fps×240帧 = 正好 10.0s，切一半只剩 5s 不够用。**12s 留裁切余量** |
| **素材音轨** | **丢弃** | 素材自带 AAC 空音轨（时长 0:00），合成时必须 `-an` 或只取 `v:0`，否则可能音画不同步 |

**全局风格基调串**（各条提示词可省略的公共前缀）：
```text
BBC Nature Documentary & National Geographic cinematic style, hyper-realistic, 
Arri Alexa Mini LF aesthetic, 35mm film grain, 8k, anamorphic lens, cinematic color grading
```

## 三、Scene 数量换算公式

> **Scene 数 ≥ 旁白分钟数 × 3**

- 实测：**每 5–6 秒旁白 = 1 个 Scene**（1.2 是 7:14 / 18 Scene ≈ 24 秒/Scene，偏长；1.3 是 6:40 / 15 Scene）
- 6.5 分钟旁白 → **≥ 18 个 Scene**
- 7.5 分钟旁白 → **≥ 22 个 Scene**
- ⚠️ 若 Scene 数不足，单个 Scene 要扛太长的解说，**画面必然与解说脱节，剪辑时只能重复用镜** —— 这是 1.2 最大的实操痛点。

## 四、历史/人文题材镜头语汇（第三集起会用）

拍「人类与橡胶相遇」这类历史场景，需要的镜头类型与自然题材完全不同：

**文明与文物**
- `Slow lateral tracking shot across colossal Olmec basalt stone head, raking sidelight`（横移扫过奥尔梅克巨型石头像，侧逆光）
- `Macro detail of carved Mesoamerican ballgame relief, shallow depth of field`（中美洲球赛浮雕微距）
- `Museum artifact display of ancient rubber ball, soft museum lighting`

**考古与球场**
- `Epic drone aerial sweep over ancient stone ballcourt, low golden-hour sun`（无人机俯扫古代石球场，黄金时刻低角度光）
- `Slow push-in through ruined stone ring of Mesoamerican ballcourt`

**人物与动作**
- `Phantom high-speed 1000fps slow motion of a solid black rubber ball bouncing on stone pavement`（1000帧超慢镜橡胶球弹跳）
- `Low-angle tracking shot of a player striking a heavy rubber ball with hip`（低角度跟拍球员胯部顶球）
- `Silhouetted ritual figures around fire at dusk, embers rising`

**技术工艺**
- `Macro close-up of morning glory vine sap dripping into a bowl of white latex`（牵牛花藤汁滴入乳胶——第三集金句镜）
- `Bare feet stepping into a pool of white latex, half-submerged macro shot`（赤脚踩进乳胶半浸没特写）
- `Thick smoke from a smoldering palm-nut fire curing a dark rubber mass`（棕榈果火堆浓烟熏烤橡胶）

**航海与殖民**
- `Wide shot of a 15th century Spanish caravel sailing into misty horizon, dawn light`（15世纪西班牙帆船驶入雾中地平线）
- `Aged parchment map of the New World, slow zoom, candlelight flicker`

**风格化说明**：AI 生成历史人物/文物容易出现「不像真的」或「过度电影化」。建议在提示词里加
`archaeological documentary reconstruction, historically accurate costume and material`，
并在成片中用**字幕卡 / 年代表 / 地图动画**穿插，弱化对单一实拍感的依赖。
