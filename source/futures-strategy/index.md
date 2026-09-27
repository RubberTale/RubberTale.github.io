---
title: 期货公司策略建议
date: 2026-09-27 22:48:00
type: "futures-strategy"
aside: false
comments: true
top_img: false
---

<style>
/* 容器全宽及主题自适应布局 */
#content-inner {
  max-width: 98% !important;
  width: 98% !important;
  padding: 0 12px !important;
}
#page {
  width: 100% !important;
  padding: 12px 0 30px 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

/* 核心变量 */
:root {
  --fs-bg-card: rgba(255, 255, 255, 0.92);
  --fs-border-card: rgba(226, 232, 240, 0.9);
  --fs-text-main: #0f172a;
  --fs-text-sub: #475569;
  --fs-accent-blue: #2563eb;
  --fs-accent-green: #059669;
  --fs-accent-red: #dc2626;
  --fs-accent-amber: #d97706;
  --fs-accent-purple: #7c3aed;
  --fs-badge-bg: rgba(37, 99, 235, 0.08);
  --fs-badge-border: rgba(37, 99, 235, 0.2);
  --fs-shadow-card: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
}
[data-theme="dark"] {
  --fs-bg-card: rgba(17, 24, 39, 0.88);
  --fs-border-card: rgba(55, 65, 81, 0.8);
  --fs-text-main: #f8fafc;
  --fs-text-sub: #94a3b8;
  --fs-accent-blue: #3b82f6;
  --fs-accent-green: #10b981;
  --fs-accent-red: #ef4444;
  --fs-accent-amber: #f59e0b;
  --fs-accent-purple: #8b5cf6;
  --fs-badge-bg: rgba(59, 130, 246, 0.15);
  --fs-badge-border: rgba(59, 130, 246, 0.3);
  --fs-shadow-card: 0 16px 32px -8px rgba(0, 0, 0, 0.5);
}

.fs-wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", "Microsoft YaHei", sans-serif;
  color: var(--fs-text-main);
}

/* 顶部 Hero 展板 */
.fs-hero {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 32px 28px;
  background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 60%, #1e293b 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.12);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.35);
}
.fs-hero::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -10%;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(99, 102, 241, 0.22) 0%, rgba(59, 130, 246, 0.05) 60%, transparent 80%);
  pointer-events: none;
}
.fs-hero-header {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.fs-hero-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px;
}
.fs-tag {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #e2e8f0;
}
.fs-tag.green {
  background: rgba(16, 185, 129, 0.2);
  border-color: rgba(16, 185, 129, 0.4);
  color: #34d399;
}
.fs-tag.amber {
  background: rgba(245, 158, 11, 0.2);
  border-color: rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}
.fs-hero-title {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
  line-height: 1.3;
  color: #ffffff !important;
  border: none !important;
}
.fs-hero-desc {
  font-size: 14.5px;
  line-height: 1.7;
  color: #cbd5e1;
  max-width: 950px;
  margin: 0;
}
.fs-hero-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 14px;
  margin-top: 14px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.fs-meta-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.fs-meta-label {
  font-size: 11.5px;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
.fs-meta-val {
  font-size: 14px;
  font-weight: 700;
  color: #f8fafc;
}

/* 粘性快捷导航条 */
.fs-nav-sticky {
  position: -webkit-sticky;
  position: sticky;
  top: 15px;
  z-index: 80;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--fs-border-card);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow-x: auto;
  scrollbar-width: none;
}
.fs-nav-sticky::-webkit-scrollbar { display: none; }
#page-header.nav-visible ~ #content-inner .fs-nav-sticky,
#page-header.fixed ~ #content-inner .fs-nav-sticky {
  top: 68px;
}
[data-theme="dark"] .fs-nav-sticky {
  background: rgba(17, 24, 39, 0.88);
  border-color: rgba(75, 85, 99, 0.6);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.45);
}
.fs-nav-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 9999px;
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fs-text-sub) !important;
  text-decoration: none !important;
  background: transparent;
  border: 1px solid transparent;
  white-space: nowrap;
  transition: all 0.2s ease;
  cursor: pointer;
}
.fs-nav-btn:hover {
  color: var(--fs-accent-blue) !important;
  background: var(--fs-badge-bg);
  border-color: var(--fs-badge-border);
}
.fs-nav-btn.active {
  color: #fff !important;
  background: var(--fs-accent-blue);
  box-shadow: 0 2px 10px rgba(37, 99, 235, 0.35);
}

/* 通用板块 Card */
.fs-card {
  background: var(--fs-bg-card);
  border: 1px solid var(--fs-border-card);
  border-radius: 18px;
  padding: 24px;
  box-shadow: var(--fs-shadow-card);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}
.fs-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--fs-border-card);
  flex-wrap: wrap;
  gap: 10px;
}
.fs-card-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 18.5px;
  font-weight: 800;
  color: var(--fs-text-main);
  margin: 0;
  border: none !important;
}
.fs-card-title i {
  font-size: 20px;
}

/* 策略矩阵表格 */
.fs-table-responsive {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
  border: 1px solid var(--fs-border-card);
  margin-top: 10px;
}
.fs-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 13.5px;
}
.fs-table th {
  background: rgba(15, 23, 42, 0.05);
  color: var(--fs-text-sub);
  font-weight: 700;
  padding: 12px 14px;
  white-space: nowrap;
  border-bottom: 1px solid var(--fs-border-card);
}
[data-theme="dark"] .fs-table th {
  background: rgba(255, 255, 255, 0.05);
}
.fs-table td {
  padding: 14px;
  border-bottom: 1px solid var(--fs-border-card);
  vertical-align: middle;
}
.fs-table tr:last-child td {
  border-bottom: none;
}
.fs-table tr:hover td {
  background: rgba(59, 130, 246, 0.03);
}
[data-theme="dark"] .fs-table tr:hover td {
  background: rgba(59, 130, 246, 0.08);
}
.fs-cell-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11.5px;
  font-weight: 700;
  text-align: center;
  white-space: nowrap;
}
.fs-badge-short { background: rgba(220, 38, 38, 0.12); color: #dc2626; border: 1px solid rgba(220, 38, 38, 0.3); }
.fs-badge-long { background: rgba(5, 150, 105, 0.12); color: #059669; border: 1px solid rgba(5, 150, 105, 0.3); }
.fs-badge-spread { background: rgba(37, 99, 235, 0.12); color: #2563eb; border: 1px solid rgba(37, 99, 235, 0.3); }
.fs-badge-option { background: rgba(124, 58, 237, 0.12); color: #7c3aed; border: 1px solid rgba(124, 58, 237, 0.3); }
.fs-badge-wait { background: rgba(100, 116, 139, 0.15); color: #64748b; border: 1px solid rgba(100, 116, 139, 0.3); }

/* 六大落地策略卡片网格 */
.fs-grid-plans {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
@media screen and (max-width: 980px) {
  .fs-grid-plans { grid-template-columns: 1fr; }
}

.fs-plan-card {
  border: 1px solid var(--fs-border-card);
  border-radius: 16px;
  background: var(--fs-bg-card);
  padding: 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}
.fs-plan-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 5px;
  height: 100%;
}
.fs-plan-card.plan-short::before { background: #dc2626; }
.fs-plan-card.plan-long::before { background: #059669; }
.fs-plan-card.plan-spread::before { background: #2563eb; }
.fs-plan-card.plan-option::before { background: #7c3aed; }
.fs-plan-card.plan-amber::before { background: #d97706; }

.fs-plan-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 14px;
}
.fs-plan-title {
  font-size: 17px;
  font-weight: 800;
  margin: 0;
  color: var(--fs-text-main);
  display: flex;
  align-items: center;
  gap: 8px;
}
.fs-plan-desc {
  font-size: 13.5px;
  line-height: 1.6;
  color: var(--fs-text-sub);
  margin-bottom: 14px;
}

/* 参数规格指标列表 */
.fs-spec-list {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--fs-border-card);
  border-radius: 10px;
  padding: 12px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 14px;
}
[data-theme="dark"] .fs-spec-list {
  background: rgba(255, 255, 255, 0.03);
}
.fs-spec-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.fs-spec-k {
  color: var(--fs-text-sub);
  display: flex;
  align-items: center;
  gap: 6px;
}
.fs-spec-v {
  font-weight: 700;
  font-family: monospace;
}

/* 监控预警红线与实操要点 */
.fs-checkpoint-box {
  background: rgba(37, 99, 235, 0.04);
  border-left: 3px solid var(--fs-accent-blue);
  border-radius: 0 8px 8px 0;
  padding: 10px 14px;
  font-size: 12.5px;
  line-height: 1.6;
  color: var(--fs-text-sub);
}
.fs-checkpoint-box strong {
  color: var(--fs-text-main);
}

/* 交互测算工具箱 */
.fs-calc-container {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}
@media screen and (max-width: 900px) {
  .fs-calc-container { grid-template-columns: 1fr; }
}
.fs-calc-box {
  background: rgba(0, 0, 0, 0.02);
  border: 1px solid var(--fs-border-card);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
[data-theme="dark"] .fs-calc-box {
  background: rgba(255, 255, 255, 0.03);
}
.fs-calc-input-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.fs-calc-label {
  font-size: 12.5px;
  font-weight: 600;
  color: var(--fs-text-sub);
}
.fs-calc-input {
  width: 100%;
  padding: 9px 12px;
  border-radius: 8px;
  border: 1px solid var(--fs-border-card);
  background: var(--fs-bg-card);
  color: var(--fs-text-main);
  font-size: 14px;
  font-family: monospace;
  outline: none;
}
.fs-calc-input:focus {
  border-color: var(--fs-accent-blue);
}
.fs-calc-result-panel {
  background: rgba(37, 99, 235, 0.06);
  border: 1px solid var(--fs-badge-border);
  border-radius: 10px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.fs-calc-res-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
}
.fs-calc-res-val {
  font-size: 15px;
  font-weight: 800;
  font-family: monospace;
}

/* 原始纪要对照与图片展板 */
.fs-source-preview {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  flex-wrap: wrap;
}
.fs-source-img-wrap {
  flex: 0 0 280px;
  max-width: 100%;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid var(--fs-border-card);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  cursor: zoom-in;
}
.fs-source-img-wrap img {
  width: 100%;
  display: block;
  transition: transform 0.3s ease;
}
.fs-source-img-wrap:hover img {
  transform: scale(1.03);
}
.fs-source-text {
  flex: 1;
  min-width: 280px;
  font-size: 13.5px;
  line-height: 1.8;
  color: var(--fs-text-sub);
}

/* 免责声明 */
.fs-disclaimer {
  background: rgba(100, 116, 139, 0.08);
  border: 1px solid rgba(100, 116, 139, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  font-size: 12px;
  line-height: 1.7;
  color: var(--fs-text-sub);
}
</style>

<div class="fs-wrapper">

<!-- 顶部 Hero 展板 -->
<div class="fs-hero">
<div class="fs-hero-header">
<div class="fs-hero-tags">
<span class="fs-tag green"><i class="fas fa-check-circle"></i> 研讨实录落地转化版</span>
<span class="fs-tag"><i class="fas fa-calendar-alt"></i> 2026-09-27 研判</span>
<span class="fs-tag amber"><i class="fas fa-shield-alt"></i> 国庆长假专项风控</span>
<span class="fs-tag"><i class="fas fa-university"></i> 国联期货投资咨询与策略研发组</span>
</div>
<h1 class="fs-hero-title">期货公司策略建议 · 实操落地执行方案</h1>
<p class="fs-hero-desc">
本执行方案由 <strong>国联期货 2026-09-27 大宗商品热点研讨会</strong> 原始记录稿深度萃取转化。将宏观地缘局势（中美缓和300亿对等降税、美伊冲突溢价挤出）、棉花、化工品（甲醇/苯乙烯/尿素/聚烯烃）、橡胶与沥青等基本面研判，全面量化转化为 <strong>标的合约、入场阈值、止损止盈、资金仓位、期权保护与长假风控</strong> 的标准化执行手册。
</p>
<div class="fs-hero-meta">
<div class="fs-meta-item">
<span class="fs-meta-label">会议主讲导师团</span>
<span class="fs-meta-val">徐亚光 · 王军龙 · 徐智龙 · 黎伟</span>
</div>
<div class="fs-meta-item">
<span class="fs-meta-label">策略主线定位</span>
<span class="fs-meta-val">棉高空 · 化工逢低正套 · 尿素反套 · 胶多头</span>
</div>
<div class="fs-meta-item">
<span class="fs-meta-label">期权战术指令</span>
<span class="fs-meta-val">贵金属领口 (Collar) · 禁裸买化工期权</span>
</div>
<div class="fs-meta-item">
<span class="fs-meta-label">建议长假保证金占用</span>
<span class="fs-meta-val" style="color: #34d399;">≤ 40% (预留充裕抗跳空资金)</span>
</div>
</div>
</div>
</div>

<!-- 实时前向盯市跟踪入口横幅 -->
<div style="background: linear-gradient(135deg, rgba(37, 99, 235, 0.15), rgba(99, 102, 241, 0.15)); border: 1px solid rgba(59, 130, 246, 0.35); border-radius: 16px; padding: 16px 20px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 14px; box-shadow: 0 4px 15px rgba(37, 99, 235, 0.08);">
<div style="display: flex; align-items: center; gap: 14px;">
<div style="width: 44px; height: 44px; border-radius: 12px; background: #2563eb; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; flex-shrink: 0;">
<i class="fas fa-crosshairs"></i>
</div>
<div>
<div style="font-weight: 800; font-size: 15.5px; color: var(--fs-text-main);">下周入场触发雷达与逐日盯市跟踪看板已上线！</div>
<div style="font-size: 13px; color: var(--fs-text-sub); margin-top: 2px;">实时监控棉花/橡胶/甲醇/苯乙烯/尿素/黄金领口入场点位，每日收盘自动核算盈亏与标准记账流水。</div>
</div>
</div>
<a href="/tools/futures-strategy/" target="_blank" style="padding: 9px 18px; border-radius: 10px; background: #2563eb; color: #fff !important; font-weight: 700; font-size: 13.5px; text-decoration: none !important; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); transition: transform 0.2s;">
<span>打开前向盯市跟踪器</span>
<i class="fas fa-arrow-right"></i>
</a>
</div>

<!-- 粘性快捷导航 -->
<div class="fs-nav-sticky">
<a href="#fs-sec-matrix" class="fs-nav-btn active"><i class="fas fa-table"></i> 策略执行总览矩阵</a>
<a href="#fs-sec-macro" class="fs-nav-btn"><i class="fas fa-globe-americas"></i> 宏观与地缘推演</a>
<a href="#fs-sec-plans" class="fs-nav-btn"><i class="fas fa-layer-group"></i> 六大实战执行手册</a>
<a href="#fs-sec-options" class="fs-nav-btn"><i class="fas fa-percentage"></i> 期权战术与隐波专题</a>
<a href="#fs-sec-risk" class="fs-nav-btn"><i class="fas fa-exclamation-triangle"></i> 长假资金与风控准则</a>
<a href="#fs-sec-calcs" class="fs-nav-btn"><i class="fas fa-calculator"></i> 交互测算工具</a>
<a href="#fs-sec-source" class="fs-nav-btn"><i class="fas fa-file-contract"></i> 原始纪要与合规说明</a>
</div>

<!-- 第一板块：全景策略执行总览矩阵 -->
<div class="fs-card" id="fs-sec-matrix">
<div class="fs-card-header">
<h2 class="fs-card-title"><i class="fas fa-th-list" style="color: var(--fs-accent-blue);"></i> 全景资产配置与策略执行矩阵 (Master Execution Matrix)</h2>
<span style="font-size: 13px; color: var(--fs-text-sub);">点击各品种可快速锚定对应实操细则</span>
</div>
<div class="fs-table-responsive">
<table class="fs-table">
<thead>
<tr>
<th>资产类别</th>
<th>核心品种与合约</th>
<th>策略类型</th>
<th>交易方向</th>
<th>入场触发区间</th>
<th>防守止损位</th>
<th>止盈目标区间</th>
<th>头寸上限</th>
<th>盈亏比</th>
<th>执行周期</th>
</tr>
</thead>
<tbody>
<tr>
<td><strong>农产品板块</strong></td>
<td><strong>棉花 (CF2701)</strong></td>
<td><span class="fs-cell-badge fs-badge-short">趋势高空</span></td>
<td><strong>逢高做空</strong></td>
<td>16000 - 16200 分批沽空</td>
<td>16500 (日线收盘)</td>
<td>第一目标 15500 / 终极 15000</td>
<td>15% - 20%</td>
<td>3.5 : 1</td>
<td>3 - 6 周</td>
</tr>
<tr>
<td><strong>能化板块</strong></td>
<td><strong>甲醇 (MA01-05)</strong></td>
<td><span class="fs-cell-badge fs-badge-spread">跨期正套</span></td>
<td><strong>买 01 / 卖 05</strong></td>
<td>MA01-05 价差在 0 ~ +30 元/吨</td>
<td>价差跌破 -50 元/吨</td>
<td>+120 ~ +180 元/吨</td>
<td>15%</td>
<td>3.0 : 1</td>
<td>1 - 2 个月</td>
</tr>
<tr>
<td><strong>能化板块</strong></td>
<td><strong>苯乙烯 (EB01-05)</strong></td>
<td><span class="fs-cell-badge fs-badge-spread">跨期正套</span></td>
<td><strong>买 01 / 卖 05</strong></td>
<td>EB01-05 价差在 30 ~ 80 元/吨</td>
<td>价差跌破 0 元/吨</td>
<td>+200 ~ +280 元/吨</td>
<td>15%</td>
<td>3.2 : 1</td>
<td>1 - 2 个月</td>
</tr>
<tr>
<td><strong>化肥板块</strong></td>
<td><strong>尿素 (UR01-05)</strong></td>
<td><span class="fs-cell-badge fs-badge-short">跨期反套</span></td>
<td><strong>卖 01 / 买 05</strong></td>
<td>UR01-05 价差在 -30 ~ 0 元/吨</td>
<td>价差突破 +40 元/吨</td>
<td>-120 ~ -160 元/吨</td>
<td>12% - 15%</td>
<td>2.8 : 1</td>
<td>2 - 3 个月</td>
</tr>
<tr>
<td><strong>橡胶产业</strong></td>
<td><strong>天然橡胶 (RU2701)</strong></td>
<td><span class="fs-cell-badge fs-badge-long">战略多头</span></td>
<td><strong>逢低吸筹</strong></td>
<td>18350 - 18500 回踩试多</td>
<td>18000 支撑关口</td>
<td>第一目标 19500 / 轮储预期 20200-20500</td>
<td>20% - 25%</td>
<td>3.9 : 1</td>
<td>1 - 3 个月</td>
</tr>
<tr>
<td><strong>黑色与建材</strong></td>
<td><strong>沥青 (BU2612-2706)</strong></td>
<td><span class="fs-cell-badge fs-badge-spread">跨期套利</span></td>
<td><strong>近远月配对</strong></td>
<td>旺季延后赶工窗口价差偏离</td>
<td>单边或价差回撤 40 点</td>
<td>把握赶工基差与近月估值修复</td>
<td>10%</td>
<td>2.5 : 1</td>
<td>1 - 2 个月</td>
</tr>
<tr>
<td><strong>贵金属板块</strong></td>
<td><strong>黄金 (AU2612) / 白银</strong></td>
<td><span class="fs-cell-badge fs-badge-option">领口保护 Collar</span></td>
<td><strong>多头持仓对冲</strong></td>
<td>持有现货/期货 + 买Put + 卖Call</td>
<td>零成本或微成本封死下行</td>
<td>锁定极端跳空风险并保留适度上行</td>
<td>100% 对冲底仓</td>
<td>防守型</td>
<td>覆盖十一长假</td>
</tr>
<tr>
<td><strong>金融期货</strong></td>
<td><strong>沪深300 / 中证500</strong></td>
<td><span class="fs-cell-badge fs-badge-wait">持币观望</span></td>
<td><strong>无开仓建议</strong></td>
<td>前期信贷数据未见实质改善</td>
<td>不盲目左侧抄底</td>
<td>待节后增量政策与流动性明朗</td>
<td>0% (空仓)</td>
<td>-</td>
<td>节后重评</td>
</tr>
</tbody>
</table>
</div>
</div>

<!-- 第二板块：宏观地缘大变局与量化推演 -->
<div class="fs-card" id="fs-sec-macro">
<div class="fs-card-header">
<h2 class="fs-card-title"><i class="fas fa-globe-americas" style="color: var(--fs-accent-blue);"></i> 宏观与地缘局势复盘：实战逻辑传导链条</h2>
<span class="fs-tag"><i class="fas fa-project-diagram"></i> 宏观定基调 · 产业定矛盾</span>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">

<!-- 中美关系与经贸安排 -->
<div style="background: rgba(37, 99, 235, 0.04); border: 1px solid var(--fs-border-card); border-radius: 14px; padding: 18px;">
<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
<span style="width: 32px; height: 32px; border-radius: 8px; background: rgba(37, 99, 235, 0.15); display: flex; align-items: center; justify-content: center; color: var(--fs-accent-blue); font-weight: 800;">1</span>
<h3 style="margin: 0; font-size: 16px; font-weight: 700;">中美博弈趋缓与 300 亿美元对等降税</h3>
</div>
<p style="font-size: 13px; line-height: 1.6; color: var(--fs-text-sub); margin-bottom: 10px;">
<strong>会议研判：</strong>双方同意构建基于尊重公平对等的中美建设性战略稳定关系，并达成 300 亿美元对等降税安排，为后续经贸磋商奠定基础。
</p>
<div class="fs-checkpoint-box">
<strong>落地实操推演：</strong>
降税预期显著提振了工业品外需预期（如轮胎、出口型聚烯烃注塑制品的终端订单）。然而对农产品（尤其是棉花），降税预期与外盘农产品联动虽促发了阶段性情绪反弹，但难以改变国内棉花种植丰产与节后订单季节性走弱的过剩本质。因此，<strong>反弹是情绪估值修复，更是提供给空头的绝佳高点建仓良机</strong>。
</div>
</div>

<!-- 美伊冲突与霍尔木兹海峡 -->
<div style="background: rgba(220, 38, 38, 0.04); border: 1px solid var(--fs-border-card); border-radius: 14px; padding: 18px;">
<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
<span style="width: 32px; height: 32px; border-radius: 8px; background: rgba(220, 38, 38, 0.15); display: flex; align-items: center; justify-content: center; color: var(--fs-accent-red); font-weight: 800;">2</span>
<h3 style="margin: 0; font-size: 16px; font-weight: 700;">美伊中东僵局与原油地缘溢价挤出</h3>
</div>
<p style="font-size: 13px; line-height: 1.6; color: var(--fs-text-sub); margin-bottom: 10px;">
<strong>会议研判：</strong>美伊冲突短期难实质性缓和，霍尔木兹海峡通航仍存较大不确定性，油价受此影响虽有回落但易反复，地缘溢价正逐步挤出。
</p>
<div class="fs-checkpoint-box" style="border-left-color: var(--fs-accent-red);">
<strong>落地实操推演：</strong>
高油价虽然在成本端给予聚烯烃、苯乙烯及甲醇上游一定支撑，但下游深加工利润已陷入全面严重亏损（MTO开工承压、下游衍生品无力提价）。地缘溢价挤出过程往往伴随原油剧烈双向宽幅震荡。单边做多能化易受下游负反馈反噬，做空又面临地缘黑天鹅脉冲，<strong>最坚固的表达方式就是跨期正套（利用近端低库存壁垒抗跌，远端消化利润倒挂）</strong>。
</div>
</div>

<!-- 美债利率与贵金属压制 -->
<div style="background: rgba(217, 119, 6, 0.04); border: 1px solid var(--fs-border-card); border-radius: 14px; padding: 18px;">
<div style="display: flex; align-items: center; gap: 8px; margin-bottom: 10px;">
<span style="width: 32px; height: 32px; border-radius: 8px; background: rgba(217, 119, 6, 0.15); display: flex; align-items: center; justify-content: center; color: var(--fs-accent-amber); font-weight: 800;">3</span>
<h3 style="margin: 0; font-size: 16px; font-weight: 700;">美债实际利率走高与 10 月贵金属偏空</h3>
</div>
<p style="font-size: 13px; line-height: 1.6; color: var(--fs-text-sub); margin-bottom: 10px;">
<strong>会议研判：</strong>受美债实际利率、美联储货币政策预期及美债余额增速放缓等因子偏空影响，在原油居高不下的态势下，下个月贵金属观点偏空。
</p>
<div class="fs-checkpoint-box" style="border-left-color: var(--fs-accent-amber);">
<strong>落地实操推演：</strong>
持有贵金属实物或长线多头的产业机构在十一长假将面临巨大海外宏观暴露风险。一旦长假期间美联储鹰派预期升温或美国宏观数据超预期强劲，国内休市期间无法平仓，节后可能遭遇大幅向下跳空。因此，<strong>必须在节前建立买入 Put、卖出 Call 的领口策略（Collar）进行完全风险锁定</strong>。
</div>
</div>

</div>
</div>

<!-- 第三板块：六大实战落地执行手册 -->
<div class="fs-card" id="fs-sec-plans">
<div class="fs-card-header">
<h2 class="fs-card-title"><i class="fas fa-layer-group" style="color: var(--fs-accent-blue);"></i> 六大品种与资产实地转化执行细则 (Playbooks)</h2>
<span class="fs-tag green"><i class="fas fa-terminal"></i> 机构交易台级参数</span>
</div>

<div class="fs-grid-plans">

<!-- 方案一：棉花高空 -->
<div class="fs-plan-card plan-short">
<div>
<div class="fs-plan-top">
<h3 class="fs-plan-title"><i class="fas fa-cloud-meatball" style="color: #dc2626;"></i> 方案一：棉花主力 (CF2701) 逢高趋势做空</h3>
<span class="fs-cell-badge fs-badge-short">单边高空 · 胜率 65%</span>
</div>
<p class="fs-plan-desc">
<strong>核心逻辑：</strong>降税预期与局部减产传闻促发阶段性反弹，但全疆实际种植面积减幅有限，产量确定性高；十一长假后纺织服装旺季进入尾声，消费负反馈持续加大。16000 点之上是不容错过的做空窗口。
</p>
<div class="fs-spec-list">
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-bullseye"></i> 标的合约</span>
<span class="fs-spec-v">郑商所 CF2701 (主力和次主力)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-arrow-circle-down"></i> 建议建仓区间</span>
<span class="fs-spec-v" style="color: #dc2626;">16000 - 16250 点 (逢反弹分批试空)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 严格止损基准</span>
<span class="fs-spec-v">16500 (日线收盘突破坚决止损)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈位</span>
<span class="fs-spec-v" style="color: #059669;">第一目标 15500 / 终极目标 14800-15000</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
<span class="fs-spec-v">首期试仓 10%，触及16200加仓至 15%-20%</span>
</div>
</div>
</div>
<div class="fs-checkpoint-box">
<strong>高频监控红线：</strong>1. 重点跟踪新疆阿克苏、喀什等主产区籽棉开秤收购价；2. 监测下游轻纺城纯棉纱及坯布库存天数（若库存拐头累积则右侧破位加仓）；3. 仓单生成节奏若不及预期，在 15500 附近平仓 50% 保护利润。
</div>
</div>

<!-- 方案二：甲醇/苯乙烯正套 -->
<div class="fs-plan-card plan-spread">
<div>
<div class="fs-plan-top">
<h3 class="fs-plan-title"><i class="fas fa-flask" style="color: #2563eb;"></i> 方案二：甲醇/苯乙烯 (MA/EB) 逢低跨期正套</h3>
<span class="fs-cell-badge fs-badge-spread">期限套利 · 胜率 72%</span>
</div>
<p class="fs-plan-desc">
<strong>核心逻辑：</strong>甲醇受海外进口缩减及港口显性库存加速去化支撑；苯乙烯处于极低社会库存与纯苯成本坚挺的双重支撑。近端低库存抗跌，远端面临下游需求负反馈，适合买近月卖远月的正套架构（Bull Calendar Spread）。
</p>
<div class="fs-spec-list">
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-exchange-alt"></i> 交易合约组合</span>
<span class="fs-spec-v">多 MA2701 空 MA2705 / 多 EB2701 空 EB2705</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-sliders-h"></i> MA 正套入场区间</span>
<span class="fs-spec-v" style="color: #2563eb;">MA01-05 价差在 0 ~ +30 元/吨建仓</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-sliders-h"></i> EB 正套入场区间</span>
<span class="fs-spec-v" style="color: #2563eb;">EB01-05 价差在 +30 ~ +80 元/吨逢回调建仓</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 止损风控红线</span>
<span class="fs-spec-v">MA价差跌破 -50 止损 / EB价差跌破 0 止损</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈空间</span>
<span class="fs-spec-v" style="color: #059669;">MA目标 +150~+180 / EB目标 +220~+280</span>
</div>
</div>
</div>
<div class="fs-checkpoint-box">
<strong>高频监控红线：</strong>1. 跟踪江苏太仓及华南港口甲醇周度提货速度与封航排船；2. 监测下游 MTO 装置现金流开工动态，防止下游装置大面积停工导致近月承压；3. 伊朗主要装置秋季检修进度。
</div>
</div>

<!-- 方案三：尿素反套 -->
<div class="fs-plan-card plan-short">
<div>
<div class="fs-plan-top">
<h3 class="fs-plan-title"><i class="fas fa-seedling" style="color: #d97706;"></i> 方案三：尿素 (UR) 01-05 逢高跨期反套</h3>
<span class="fs-cell-badge fs-badge-short">反套价差空头 · 胜率 68%</span>
</div>
<p class="fs-plan-desc">
<strong>核心逻辑：</strong>尿素深陷高日产与历史高位社会库存压制，秋肥与出口发运仅为短期环比改善，供需格局未根本转变。近月01直接承受交割与高库存压制，而供需出清预计延后至2705合约解决，05合约表现确定性强于01。
</p>
<div class="fs-spec-list">
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-exchange-alt"></i> 交易合约组合</span>
<span class="fs-spec-v">卖出 UR2701 + 买入 UR2705 (配比 1:1)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-arrow-circle-down"></i> 建议反套入场区间</span>
<span class="fs-spec-v" style="color: #d97706;">UR01-05 价差在 -30 ~ 0 元/吨逢高做空价差</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 严格止损位</span>
<span class="fs-spec-v">价差若被拉升超过 +40 元/吨则止损</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈区间</span>
<span class="fs-spec-v" style="color: #059669;">-120 ~ -160 元/吨 (Contango结构进一步深化)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
<span class="fs-spec-v">总资金占用 12% - 15%</span>
</div>
</div>
</div>
<div class="fs-checkpoint-box">
<strong>高频监控红线：</strong>1. 跟踪国内尿素日产是否维持在 18 万吨以上高位；2. 密切警惕北方环保限产及天然气气头企业冬季检修节奏是否超预期提前；3. 出口法检政策松紧动态。
</div>
</div>

<!-- 方案四：橡胶战略多头与轮储博弈 -->
<div class="fs-plan-card plan-long">
<div>
<div class="fs-plan-top">
<h3 class="fs-plan-title"><i class="fas fa-tree" style="color: #059669;"></i> 方案四：天然橡胶 (RU) 战略多头与轮储博弈</h3>
<span class="fs-cell-badge fs-badge-long">战略多头 · 胜率 75% · 赔率高</span>
</div>
<p class="fs-plan-desc">
<strong>核心逻辑：</strong>20号胶库存加速去化，全钢胎社会库存降至5年新低（临近库容荒），半钢胎库存止升。顺丁亏损收窄至1600-1800元成本挺价。前期国家抛储未实现轮储计划，若后续查验社会库存极度见底，国家层面补库概率极高，RU赢面极大。
</p>
<div class="fs-spec-list">
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-bullseye"></i> 标的合约</span>
<span class="fs-spec-v">上期所 RU2701 (最新收盘 18670) / 配套 NR2701 (现价约15880)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-arrow-circle-up"></i> 建议建仓区间</span>
<span class="fs-spec-v" style="color: #059669;">18350 - 18500 点回踩分批吸筹 (触及 18450 触发)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 严格防守止损位</span>
<span class="fs-spec-v">18000 (跌破关键整数日线支撑平台离场)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈区间</span>
<span class="fs-spec-v" style="color: #059669;">第一目标 19500 / 轮储落地预期 20200 - 20500</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-coins"></i> 期权增强战术</span>
<span class="fs-spec-v" style="color: #7c3aed;">买入平值/微虚值 RU2701 行权价 19000 或 19500 看涨期权</span>
</div>
</div>
</div>
<div class="fs-checkpoint-box">
<strong>高频监控红线：</strong>1. 青岛保税区区内外总库存去化斜率；2. 泰国南部产区 10-11 月降雨天气对原料胶水收购价的影响；3. 国家物资储备局轮储公告及传闻；4. RU 与 NR 升贴水价差（当前升水维持在 2600-2800 元/吨合理区间）。
</div>
</div>

<!-- 方案五：沥青旺季延后套利 -->
<div class="fs-plan-card plan-amber">
<div>
<div class="fs-plan-top">
<h3 class="fs-plan-title"><i class="fas fa-road" style="color: #d97706;"></i> 方案五：沥青 (BU) 旺季延后 2612 与 2706 跨期套利</h3>
<span class="fs-cell-badge fs-badge-spread">旺季驱动 · 胜率 60%</span>
</div>
<p class="fs-plan-desc">
<strong>核心逻辑：</strong>10 月国内化工排产计划环比预计增加 15%~20%，但当前沥青仍处于持续去库态势，现货维持在 6100 元/吨高位，基差强势。低库存基数加上北方赶工旺季延后，单边做空风险极大，建议把握 2612 与 2706 合约的跨期套利机会。
</p>
<div class="fs-spec-list">
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-exchange-alt"></i> 跨期合约配对</span>
<span class="fs-spec-v">上期所 BU2612 与 BU2706 跨期组合</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-sliders-h"></i> 核心套利驱动</span>
<span class="fs-spec-v">近月现货 6100+ 高基差保护 vs 排产增量博弈</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 风控防守阈值</span>
<span class="fs-spec-v">价差单日异常逆转超过 40 元/吨减仓</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 策略退出窗口</span>
<span class="fs-spec-v" style="color: #059669;">10月下旬北方气温骤降、道路铺设停工前获利离场</span>
</div>
</div>
</div>
<div class="fs-checkpoint-box">
<strong>高频监控红线：</strong>1. 跟踪山东及华东主力地炼沥青开工率与出货通畅度；2. 监测北方 10 月初寒潮与降温时间节点（直接决定赶工窗口关闭时间）；3. 原油及高硫燃料油价格波动。
</div>
</div>

<!-- 方案六：贵金属期权领口保护 -->
<div class="fs-plan-card plan-option">
<div>
<div class="fs-plan-top">
<h3 class="fs-plan-title"><i class="fas fa-shield-alt" style="color: #7c3aed;"></i> 方案六：贵金属期权领口保护策略 (Collar Hedge)</h3>
<span class="fs-cell-badge fs-badge-option">零成本领口 · 防黑天鹅</span>
</div>
<p class="fs-plan-desc">
<strong>核心逻辑：</strong>受美债实际利率、美联储货币政策预期及美债余额增速放缓等因子压制，原油高企下 10 月贵金属观点偏空。十一长假海外交易不停歇，为规避外盘流动性冲击与突发跳空暴跌，持有多头必须构建“买Put+卖Call”的领口对冲体系。
</p>
<div class="fs-spec-list">
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-cube"></i> 底层现货/多头</span>
<span class="fs-spec-v">持有黄金 (AU2612) 多头或黄金现货</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 买入下行保护</span>
<span class="fs-spec-v" style="color: #dc2626;">买入 Delta ≈ -0.25 的浅虚值看跌期权 (Put)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-hand-holding-usd"></i> 卖出权利金补贴</span>
<span class="fs-spec-v" style="color: #059669;">卖出 Delta ≈ +0.22 的虚值看涨期权 (Call)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-balance-scale"></i> 净权利金成本</span>
<span class="fs-spec-v" style="color: #2563eb;">≈ 0 元 (实现完全零成本锁定下行)</span>
</div>
<div class="fs-spec-row">
<span class="fs-spec-k"><i class="fas fa-lock"></i> 下行最大亏损</span>
<span class="fs-spec-v" style="color: #dc2626;">被完全锁定在 -3% 至 -4% 以内，彻底杜绝爆仓</span>
</div>
</div>
</div>
<div class="fs-checkpoint-box">
<strong>领口实操细则：</strong>买入看跌期权锁死了金价断崖下跌的深坑；卖出看涨期权放弃了小概率的暴涨暴利，但换取了昂贵的看跌保护费。节后开盘若外盘剧烈暴跌，看跌期权爆赚将全额弥补现货亏损！
</div>
</div>

</div>
</div>

<!-- 第四板块：期权战术与隐波专题分析 -->
<div class="fs-card" id="fs-sec-options">
<div class="fs-card-header">
<h2 class="fs-card-title"><i class="fas fa-percentage" style="color: var(--fs-accent-purple);"></i> 商品期权战术专题：为什么绝不裸买化工期权？</h2>
<span class="fs-tag amber"><i class="fas fa-coins"></i> 波动率估值与买方数学期望</span>
</div>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 18px; margin-bottom: 20px;">

<!-- 化工品期权陷阱 -->
<div style="background: rgba(220, 38, 38, 0.05); border: 1px solid rgba(220, 38, 38, 0.2); border-radius: 14px; padding: 20px;">
<h3 style="margin-top: 0; font-size: 16px; color: #dc2626; display: flex; align-items: center; gap: 8px;">
<i class="fas fa-ban"></i> 化工期权买方陷阱：隐波严重溢价
</h3>
<p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub);">
<strong>研报量化数据：</strong>多数化工品期权隐含波动率（IV）存在显著地缘溢价。以原油及能化期权为例，由于长假期间长达 7-9 天的<strong>时间价值衰减（Theta 极速流逝）</strong>，长假后标的资产必须：
</p>
<ul style="font-size: 13px; color: var(--fs-text-sub); line-height: 1.8; padding-left: 20px; margin: 8px 0;">
<li><strong style="color: #dc2626;">高开或低开 3% 以上</strong> 才能勉强覆盖时间价值与隐波暴跌（IV Crush）实现保本；</li>
<li><strong style="color: #dc2626;">高开或低开 5% 以上</strong> 才能产生明显实际盈利。</li>
</ul>
<div class="fs-checkpoint-box" style="border-left-color: #dc2626; margin-top: 10px;">
<strong>交易台禁令：</strong>普通投资者长假前盲目“买跨式（Long Straddle）”赌单边跳空，在数学期望上是极亏的。<strong>严格禁止任何长假裸买化工期权的行为！</strong>
</div>
</div>

<!-- 橡胶期权红利 -->
<div style="background: rgba(5, 150, 105, 0.05); border: 1px solid rgba(5, 150, 105, 0.2); border-radius: 14px; padding: 20px;">
<h3 style="margin-top: 0; font-size: 16px; color: #059669; display: flex; align-items: center; gap: 8px;">
<i class="fas fa-gem"></i> 橡胶期权高性价比：隐波定价未充分
</h3>
<p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub);">
<strong>研报量化数据：</strong>与能化原油形成鲜明对比的是，天然橡胶期权隐含波动率（IV）增加明显偏低，历史分位数仅处于 35%-40% 附近，市场尚未对全钢胎库容荒和国储战略补库进行充分定价。
</p>
<div class="fs-checkpoint-box" style="border-left-color: #059669; margin-top: 10px;">
<strong>交易台推荐战术：</strong>
1. 采用小资金（总仓位 2%-3%）买入 <strong>RU2701 行权价 19000 或 19500 看涨期权</strong>；<br>
2. 若节后橡胶因供需库容危机或政策催化向上爆发，期权将享受 <strong>Delta + Gamma + Vega（隐波暴涨）三击</strong>，盈亏比极度诱人。
</div>
</div>

</div>

</div>

<!-- 第五板块：十一长假资金管理与应急预案 -->
<div class="fs-card" id="fs-sec-risk">
<div class="fs-card-header">
<h2 class="fs-card-title"><i class="fas fa-shield-virus" style="color: var(--fs-accent-red);"></i> 十一长假专项资金管理守则与黑天鹅预案</h2>
<span class="fs-tag red" style="color:#ef4444;"><i class="fas fa-exclamation-triangle"></i> 留足弹药 · 杜绝强平</span>
</div>

<div style="font-size: 14px; line-height: 1.8; color: var(--fs-text-sub);">
<p>
国庆假期国内期货市场休市长达 7 个自然日，但国际外盘（LME有色金属、NYMEX原油、CBOT农产品、COMEX黄金）照常交易。各期货交易所惯例会在节前最后交易日结算时将保证金比例<strong>上调 3% 至 5%</strong>。如果节前保证金占用超过 60%，交易所提保后风险度将瞬间逼近 85%-90%，一旦节后大幅跳空将直接面临被动强平。
</p>

<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 14px; margin-top: 16px;">
<div style="background: rgba(0,0,0,0.02); border: 1px solid var(--fs-border-card); border-radius: 12px; padding: 14px;">
<h4 style="margin: 0 0 6px 0; font-size: 14.5px; color: var(--fs-accent-blue);"><i class="fas fa-battery-half"></i> 1. 仓位压降红线</h4>
<div style="font-size: 13px;">节前最后一个交易日 14:30 之前，单边投机仓位保证金占用必须压降至 <strong>40% 以下</strong>；套利及领口对冲头寸可放宽至 <strong>50%</strong>。</div>
</div>
<div style="background: rgba(0,0,0,0.02); border: 1px solid var(--fs-border-card); border-radius: 12px; padding: 14px;">
<h4 style="margin: 0 0 6px 0; font-size: 14.5px; color: var(--fs-accent-green);"><i class="fas fa-user-lock"></i> 2. 股指期货全面观望</h4>
<div style="font-size: 13px;">前期公布的信贷及货币供给数据无实质性超预期改善，模型结果显示 10 月观望。长假期间严禁隔夜重仓股指，保持 <strong>0 头寸</strong>。</div>
</div>
<div style="background: rgba(0,0,0,0.02); border: 1px solid var(--fs-border-card); border-radius: 12px; padding: 14px;">
<h4 style="margin: 0 0 6px 0; font-size: 14.5px; color: var(--fs-accent-red);"><i class="fas fa-bolt"></i> 3. 节后开盘跳空预案</h4>
<div style="font-size: 13px;">若节后标的同向跳空达到目标位，开盘立即获利兑现 50%；若反向跳空跌破止损点，执行程序化集合竞价平仓，绝不抱侥幸死扛。</div>
</div>
</div>
</div>
</div>

<!-- 第六板块：交互测算工具箱 -->
<div class="fs-card" id="fs-sec-calcs">
<div class="fs-card-header">
<h2 class="fs-card-title"><i class="fas fa-calculator" style="color: var(--fs-accent-blue);"></i> 策略执行辅助工具箱 (Live Simulators)</h2>
<span class="fs-tag"><i class="fas fa-sliders-h"></i> 实时前端动态计算</span>
</div>

<div class="fs-calc-container">

<!-- 工具一：贵金属领口期权损益模拟器 -->
<div class="fs-calc-box">
<div>
<h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: var(--fs-accent-purple);">
<i class="fas fa-shield-alt"></i> 工具 A：贵金属领口保护 (Collar) 损益模拟器
</h3>
<p style="font-size: 12.5px; color: var(--fs-text-sub); margin: 0;">测算持有现货/多头底仓时，配置买Put与卖Call的净成本与最大封死亏损。</p>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
<div class="fs-calc-input-group">
<label class="fs-calc-label">标的建仓均价 (元/克)</label>
<input type="number" id="collar-spot" class="fs-calc-input" value="780" step="1">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">持有总克数 (克)</label>
<input type="number" id="collar-qty" class="fs-calc-input" value="1000" step="100">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">买入Put行权价 (元/克)</label>
<input type="number" id="collar-put-k" class="fs-calc-input" value="755" step="1">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">买入Put权利金 (元/克)</label>
<input type="number" id="collar-put-p" class="fs-calc-input" value="8.5" step="0.1">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">卖出Call行权价 (元/克)</label>
<input type="number" id="collar-call-k" class="fs-calc-input" value="815" step="1">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">卖出Call权利金 (元/克)</label>
<input type="number" id="collar-call-p" class="fs-calc-input" value="8.2" step="0.1">
</div>
</div>

<div class="fs-calc-result-panel">
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">净权利金支出 (Net Cost):</span>
<span id="collar-net-premium" class="fs-calc-res-val" style="color: var(--fs-accent-blue);">0.30 元/克 (几乎零成本)</span>
</div>
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">下行最坏亏损 (Max Loss):</span>
<span id="collar-max-loss" class="fs-calc-res-val" style="color: #dc2626;">-25,300 元 (-3.24%)</span>
</div>
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">上行封顶收益 (Max Gain):</span>
<span id="collar-max-gain" class="fs-calc-res-val" style="color: #059669;">+34,700 元 (+4.45%)</span>
</div>
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">盈亏平衡价格 (Breakeven):</span>
<span id="collar-breakeven" class="fs-calc-res-val">780.30 元/克</span>
</div>
</div>
</div>

<!-- 工具二：长假交易所提保压力测试器 -->
<div class="fs-calc-box">
<div>
<h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: var(--fs-accent-red);">
<i class="fas fa-exclamation-triangle"></i> 工具 B：十一长假提保压力测试计算器
</h3>
<p style="font-size: 12.5px; color: var(--fs-text-sub); margin: 0;">测算交易所提保 3%~5% 后，您的账户风险度是否突破安全警戒线。</p>
</div>

<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
<div class="fs-calc-input-group">
<label class="fs-calc-label">账户总权益 (元)</label>
<input type="number" id="margin-equity" class="fs-calc-input" value="1000000" step="50000">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">当前保证金占用 (元)</label>
<input type="number" id="margin-used" class="fs-calc-input" value="450000" step="20000">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">当前平均保证金率 (%)</label>
<input type="number" id="margin-curr-rate" class="fs-calc-input" value="12" step="1">
</div>
<div class="fs-calc-input-group">
<label class="fs-calc-label">长假交易所提保幅度 (%)</label>
<input type="number" id="margin-add-rate" class="fs-calc-input" value="4" step="0.5">
</div>
</div>

<div class="fs-calc-result-panel">
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">当前保证金占用率:</span>
<span id="margin-curr-ratio" class="fs-calc-res-val">45.00%</span>
</div>
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">提保后预计保证金占用:</span>
<span id="margin-after-val" class="fs-calc-res-val" style="color: var(--fs-accent-red);">600,000 元</span>
</div>
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">提保后账户风险度:</span>
<span id="margin-after-ratio" class="fs-calc-res-val" style="color: #dc2626; font-size: 17px;">60.00% (警惕)</span>
</div>
<div class="fs-calc-res-item">
<span style="color: var(--fs-text-sub);">达到 40% 安全线需平仓:</span>
<span id="margin-need-reduce" class="fs-calc-res-val" style="color: #059669;">约 33.3% 仓位</span>
</div>
</div>
</div>

</div>
</div>

<!-- 第七板块：原始研讨纪要与合规声明 -->
<div class="fs-card" id="fs-sec-source">
<div class="fs-card-header">
<h2 class="fs-card-title"><i class="fas fa-file-contract" style="color: var(--fs-accent-blue);"></i> 研报原始记录稿对照与免责声明</h2>
<span class="fs-tag"><i class="fas fa-stamp"></i> 来源可溯 · 实证对照</span>
</div>

<div class="fs-source-preview">
<div class="fs-source-img-wrap" title="点击查看原始会议记录稿高清原图" onclick="window.open('/img/2026-09-27-futures-strategy-meeting.jpg', '_blank')">
<img src="/img/2026-09-27-futures-strategy-meeting.jpg" alt="国联期货20260927会议摘要记录稿">
</div>
<div class="fs-source-text">
<h4 style="margin: 0 0 8px 0; color: var(--fs-text-main); font-size: 15px;">《会议摘要记录稿 20260927》原始档案备忘</h4>
<ul style="padding-left: 20px; margin: 0 0 14px 0;">
<li><strong>会议主题：</strong>大宗商品热点策略会</li>
<li><strong>主讲人：</strong>徐亚光、王军龙、徐智龙、黎伟</li>
<li><strong>主办机构：</strong>国联期货股份有限公司（Guolian Futures）</li>
<li><strong>核心研讨范围：</strong>宏观中美/美伊地缘局势、棉花、化工品强弱排序（甲醇/苯乙烯/尿素/聚烯烃）、天然橡胶去库与国储轮储、沥青排产与基差、商品期权及长假贵金属/股指风控提示。</li>
</ul>
<div class="fs-disclaimer">
<strong>免责声明与版权提示：</strong><br>
本页面内容由国联期货公开研讨会纪要转化整理，仅供学习、交流与量化投研参考，并不构成对所述期货/期权合约的绝对买卖要约。本报告所载观点、数据及预测反映报告日期的专业判断，市场有风险，投资需谨慎。投资者应根据自身的风险偏好、资金体量与风险承受能力独立决策并自负盈亏。
</div>
</div>
</div>
</div>

</div>

{% raw %}
<script>
(function() {
// 领口期权模拟器计算
function calcCollar() {
var spot = parseFloat(document.getElementById('collar-spot').value) || 0;
var qty = parseFloat(document.getElementById('collar-qty').value) || 0;
var putK = parseFloat(document.getElementById('collar-put-k').value) || 0;
var putP = parseFloat(document.getElementById('collar-put-p').value) || 0;
var callK = parseFloat(document.getElementById('collar-call-k').value) || 0;
var callP = parseFloat(document.getElementById('collar-call-p').value) || 0;

var netPremiumPerUnit = putP - callP;
var totalCost = spot * qty;

// 最坏亏损：价格暴跌到 0 或低于 Put 行权价
var worstSpotLoss = (putK - spot) * qty;
var maxLossTotal = worstSpotLoss - (netPremiumPerUnit * qty);
var maxLossPct = totalCost > 0 ? (maxLossTotal / totalCost * 100) : 0;

// 最高盈利：价格暴涨到无穷大或高于 Call 行权价
var bestSpotGain = (callK - spot) * qty;
var maxGainTotal = bestSpotGain - (netPremiumPerUnit * qty);
var maxGainPct = totalCost > 0 ? (maxGainTotal / totalCost * 100) : 0;

var breakeven = spot + netPremiumPerUnit;

var netEl = document.getElementById('collar-net-premium');
if (netEl) {
var costSign = netPremiumPerUnit >= 0 ? '+' : '';
netEl.innerText = costSign + netPremiumPerUnit.toFixed(2) + ' 元/克 (' + (Math.abs(netPremiumPerUnit) <= 0.5 ? '接近零成本' : (netPremiumPerUnit > 0 ? '净支出' : '净收取')) + ')';
}

var lossEl = document.getElementById('collar-max-loss');
if (lossEl) {
lossEl.innerText = maxLossTotal.toLocaleString('en-US', {maximumFractionDigits: 0}) + ' 元 (' + maxLossPct.toFixed(2) + '%)';
}

var gainEl = document.getElementById('collar-max-gain');
if (gainEl) {
gainEl.innerText = '+' + maxGainTotal.toLocaleString('en-US', {maximumFractionDigits: 0}) + ' 元 (+' + maxGainPct.toFixed(2) + '%)';
}

var beEl = document.getElementById('collar-breakeven');
if (beEl) {
beEl.innerText = breakeven.toFixed(2) + ' 元/克';
}
}

// 保证金提保压力测试
function calcMargin() {
var equity = parseFloat(document.getElementById('margin-equity').value) || 1;
var used = parseFloat(document.getElementById('margin-used').value) || 0;
var currRate = parseFloat(document.getElementById('margin-curr-rate').value) || 12;
var addRate = parseFloat(document.getElementById('margin-add-rate').value) || 4;

var currRatio = (used / equity) * 100;
var newRate = currRate + addRate;
var newUsed = currRate > 0 ? (used * (newRate / currRate)) : used;
var newRatio = (newUsed / equity) * 100;

var targetUsed = equity * 0.40;
var needReducePct = 0;
if (newUsed > targetUsed && newUsed > 0) {
needReducePct = ((newUsed - targetUsed) / newUsed) * 100;
}

var currRatioEl = document.getElementById('margin-curr-ratio');
if (currRatioEl) currRatioEl.innerText = currRatio.toFixed(2) + '%';

var afterValEl = document.getElementById('margin-after-val');
if (afterValEl) afterValEl.innerText = Math.round(newUsed).toLocaleString() + ' 元';

var afterRatioEl = document.getElementById('margin-after-ratio');
if (afterRatioEl) {
var statusText = newRatio > 70 ? ' (高危!)' : (newRatio > 50 ? ' (偏高，建议减仓)' : ' (安全)');
afterRatioEl.innerText = newRatio.toFixed(2) + '%' + statusText;
afterRatioEl.style.color = newRatio > 70 ? '#dc2626' : (newRatio > 50 ? '#d97706' : '#059669');
}

var reduceEl = document.getElementById('margin-need-reduce');
if (reduceEl) {
if (needReducePct > 0) {
reduceEl.innerText = '需减仓约 ' + needReducePct.toFixed(1) + '%';
reduceEl.style.color = '#dc2626';
} else {
reduceEl.innerText = '仓位安全，无需强制平仓';
reduceEl.style.color = '#059669';
}
}
}

// 绑定事件
['collar-spot', 'collar-qty', 'collar-put-k', 'collar-put-p', 'collar-call-k', 'collar-call-p'].forEach(function(id) {
var el = document.getElementById(id);
if (el) el.addEventListener('input', calcCollar);
});

['margin-equity', 'margin-used', 'margin-curr-rate', 'margin-add-rate'].forEach(function(id) {
var el = document.getElementById(id);
if (el) el.addEventListener('input', calcMargin);
});

// 粘性导航高亮与平滑滚动
function setupNav() {
var nav = document.querySelector('.fs-nav-sticky');
if (!nav) return;
var links = nav.querySelectorAll('.fs-nav-btn');

links.forEach(function(link) {
link.addEventListener('click', function(e) {
var href = this.getAttribute('href');
if (href && href.startsWith('#')) {
var target = document.querySelector(href);
if (target) {
e.preventDefault();
target.scrollIntoView({ behavior: 'smooth' });
links.forEach(function(l) { l.classList.remove('active'); });
this.classList.add('active');
}
}
});
});
}

// 页面加载就绪后初始化
if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', function() {
calcCollar();
calcMargin();
setupNav();
});
} else {
calcCollar();
calcMargin();
setupNav();
}
})();
</script>
{% endraw %}
