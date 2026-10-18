---
title: 期货公司策略建议
date: 2026-10-18 22:30:00
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

/* 核心变量体系 */
:root {
  --fs-bg-card: rgba(255, 255, 255, 0.94);
  --fs-border-card: rgba(226, 232, 240, 0.9);
  --fs-text-main: #0f172a;
  --fs-text-sub: #475569;
  --fs-accent-blue: #2563eb;
  --fs-accent-green: #059669;
  --fs-accent-red: #dc2626;
  --fs-accent-amber: #d97706;
  --fs-accent-purple: #7c3aed;
  --fs-accent-cyan: #0891b2;
  --fs-badge-bg: rgba(37, 99, 235, 0.08);
  --fs-badge-border: rgba(37, 99, 235, 0.2);
  --fs-shadow-card: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
}
[data-theme="dark"] {
  --fs-bg-card: rgba(17, 24, 39, 0.90);
  --fs-border-card: rgba(55, 65, 81, 0.8);
  --fs-text-main: #f8fafc;
  --fs-text-sub: #94a3b8;
  --fs-accent-blue: #3b82f6;
  --fs-accent-green: #10b981;
  --fs-accent-red: #ef4444;
  --fs-accent-amber: #f59e0b;
  --fs-accent-purple: #8b5cf6;
  --fs-accent-cyan: #06b6d4;
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
  background: linear-gradient(135deg, #0a0f1d 0%, #171d36 50%, #0f2438 100%);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
}
.fs-hero::after {
  content: '';
  position: absolute;
  top: -40%;
  right: -10%;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(56, 189, 248, 0.22) 0%, rgba(99, 102, 241, 0.08) 60%, transparent 80%);
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
.fs-tag.cyan {
  background: rgba(6, 182, 212, 0.2);
  border-color: rgba(6, 182, 212, 0.4);
  color: #38bdf8;
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
  max-width: 980px;
  margin: 0;
}
.fs-hero-meta {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 14px;
  margin-top: 14px;
  padding-top: 16px;
  border-top: 1px solid rgba(255, 255, 255, 0.12);
}
.fs-meta-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
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

/* 顶部操作横幅 */
.fs-banner-bar {
  background: linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(6, 182, 212, 0.12));
  border: 1px solid rgba(59, 130, 246, 0.35);
  border-radius: 16px;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.08);
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
.fs-badge-warn { background: rgba(217, 119, 6, 0.12); color: #d97706; border: 1px solid rgba(217, 119, 6, 0.3); }

/* 观点演变差异对比标签体系 */
.fs-badge-diff-reversal { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; text-align: center; white-space: nowrap; background: rgba(220, 38, 38, 0.15); color: #ef4444; border: 1px solid rgba(220, 38, 38, 0.35); }
.fs-badge-diff-new { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; text-align: center; white-space: nowrap; background: rgba(16, 185, 129, 0.15); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.35); }
.fs-badge-diff-upgrade { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; text-align: center; white-space: nowrap; background: rgba(245, 158, 11, 0.15); color: #f59e0b; border: 1px solid rgba(245, 158, 11, 0.35); }
.fs-badge-diff-continue { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; text-align: center; white-space: nowrap; background: rgba(59, 130, 246, 0.15); color: #3b82f6; border: 1px solid rgba(59, 130, 246, 0.35); }
.fs-badge-diff-archive { display: inline-block; padding: 4px 10px; border-radius: 6px; font-size: 11.5px; font-weight: 700; text-align: center; white-space: nowrap; background: rgba(100, 116, 139, 0.15); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.3); }

/* 八大落地策略卡片网格 */
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
.fs-plan-card.plan-cyan::before { background: #0891b2; }

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
</style>

<div class="fs-wrapper">

<!-- 顶部 Hero 展板 -->
<div class="fs-hero">
  <div class="fs-hero-header">
    <div class="fs-hero-tags">
      <span class="fs-tag green"><i class="fas fa-check-circle"></i> 研讨实录落地转化版</span>
      <span class="fs-tag"><i class="fas fa-calendar-alt"></i> 2026-10-18 最新研判</span>
      <span class="fs-tag amber"><i class="fas fa-shield-alt"></i> 地缘与宏观信用风控</span>
      <span class="fs-tag cyan"><i class="fas fa-university"></i> 机构投资咨询与策略研发组</span>
    </div>
    <h1 class="fs-hero-title">期货公司策略建议 · 实操落地执行方案</h1>
    <p class="fs-hero-desc">
      本执行方案由 <strong>商品与股指策略研讨会（2026-10-18）</strong> 原始记录稿深度萃取转化。紧密围绕宏观情绪压制、AI资本开支担忧、信用利差扩大负反馈、股指救市反弹定性、有色金属铜铝基本面分化（多铜空铝正套）、原油供应极限与霍尔木兹地缘溢价、高硫燃料油 11 月极低库存逼仓风险、化工品（甲醇/纯苯/苯乙烯/聚烯烃）跨期正套以及贵金属实际利率缓和等，全面量化转化为 <strong>标的合约、入场阈值、止损止盈、资金仓位、期权保护与地缘风控</strong> 的标准化交易台执行手册。
    </p>
    <div class="fs-hero-meta">
      <div class="fs-meta-item">
        <span class="fs-meta-label">研讨主讲与投研团队</span>
        <span class="fs-meta-val">资深产业研究员团队（已脱敏）</span>
      </div>
      <div class="fs-meta-item">
        <span class="fs-meta-label">策略核心配置方向</span>
        <span class="fs-meta-val">多铜空铝正套 · 高硫燃油防逼仓 · 化工逢低正套</span>
      </div>
      <div class="fs-meta-item">
        <span class="fs-meta-label">期权战术指令</span>
        <span class="fs-meta-val">铝下游卖虚值Put收贴水 · 铜买入Put防宏观下杀</span>
      </div>
      <div class="fs-meta-item">
        <span class="fs-meta-label">股指与贵金属评级</span>
        <span class="fs-meta-val" style="color: #fbbf24;">股指防守观望 · 贵金属暂无中期反转信号</span>
      </div>
    </div>
  </div>
</div>

<!-- 实时跟踪入口与往期归档横幅 -->
<div class="fs-banner-bar">
  <div style="display: flex; align-items: center; gap: 14px;">
    <div style="width: 44px; height: 44px; border-radius: 12px; background: #2563eb; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 20px; flex-shrink: 0;">
      <i class="fas fa-crosshairs"></i>
    </div>
    <div>
      <div style="font-weight: 800; font-size: 15.5px; color: var(--fs-text-main);">多品种策略触发雷达与逐日盯市系统运行中</div>
      <div style="font-size: 13px; color: var(--fs-text-sub); margin-top: 2px;">实时监控铜铝月差、高硫燃料油、甲醇正套、苯乙烯正套及期权保护阈值，收盘自动核算盈亏。</div>
    </div>
  </div>
  <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
    <a href="/tools/futures-strategy/" target="_blank" style="padding: 8px 16px; border-radius: 10px; background: #2563eb; color: #fff !important; font-weight: 700; font-size: 13px; text-decoration: none !important; display: inline-flex; align-items: center; gap: 6px; box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35); transition: transform 0.2s;">
      <span>打开盯市跟踪看板</span>
      <i class="fas fa-external-link-alt"></i>
    </a>
    <a href="/futures-strategy/archive-20260927/" style="padding: 8px 14px; border-radius: 10px; background: rgba(100, 116, 139, 0.15); color: var(--fs-text-main) !important; font-weight: 600; font-size: 13px; text-decoration: none !important; display: inline-flex; align-items: center; gap: 6px; border: 1px solid var(--fs-border-card);">
      <i class="fas fa-history"></i>
      <span>往期归档 (2026-09-27)</span>
    </a>
  </div>
</div>

<!-- 粘性快捷导航 -->
<div class="fs-nav-sticky">
  <a href="#fs-sec-diff" class="fs-nav-btn active"><i class="fas fa-exchange-alt"></i> 观点演变与转向对照</a>
  <a href="#fs-sec-matrix" class="fs-nav-btn"><i class="fas fa-table"></i> 策略执行总览矩阵</a>
  <a href="#fs-sec-macro" class="fs-nav-btn"><i class="fas fa-globe-americas"></i> 宏观与信用推演</a>
  <a href="#fs-sec-plans" class="fs-nav-btn"><i class="fas fa-layer-group"></i> 八大实战执行手册</a>
  <a href="#fs-sec-options" class="fs-nav-btn"><i class="fas fa-percentage"></i> 期权战术与风控</a>
  <a href="#fs-sec-risk" class="fs-nav-btn"><i class="fas fa-exclamation-triangle"></i> 地缘大选风控准则</a>
  <a href="#fs-sec-calcs" class="fs-nav-btn"><i class="fas fa-calculator"></i> 交互测算工具</a>
</div>

<!-- 核心板块：策略研判演变与期次观点对照 (Viewpoint Evolution & Diff Matrix) -->
<div class="fs-card" id="fs-sec-diff">
  <div class="fs-card-header">
    <h2 class="fs-card-title"><i class="fas fa-exchange-alt" style="color: var(--fs-accent-blue);"></i> 策略研判演变与期次观点对照 (2026-09-27 vs 2026-10-18)</h2>
    <span class="fs-tag"><i class="fas fa-history"></i> 捕捉边际变化 · 洞察机构逻辑转向</span>
  </div>

  <div style="margin-bottom: 14px; font-size: 13.5px; color: var(--fs-text-sub); line-height: 1.7;">
    <strong>💡 投研视角：</strong>真正的超额收益往往产生于<strong>「机构观点的边际改变与多空逻辑逆转」</strong>。下表深度梳理了 2026-09-27 研讨会与 2026-10-18 最新研讨会在宏观、品种及期权维度的观点演变脉络：
  </div>

  <div class="fs-table-responsive">
    <table class="fs-table">
      <thead>
        <tr>
          <th>品种 / 资产板块</th>
          <th>2026-09-27 会议研判 (往期)</th>
          <th>2026-10-18 会议研判 (最新)</th>
          <th>观点演变性质</th>
          <th>交易台实操转向与应对策略</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>聚烯烃 (L / PP)</strong></td>
          <td><strong>预期开工率上行走反套</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">短期供应压力不大，但受制于上游成本主导与下游亏损，预期装置复产建议反套</span></td>
          <td><strong>美以袭击伊朗风险重估，转向正套</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">美以可能打击伊朗石油石化设施，中东进口受阻风险陡增，重新计价近端溢价</span></td>
          <td><span class="fs-badge-diff-reversal"><i class="fas fa-sync-alt"></i> 重大方向转向<br>(反套 ➔ 正套)</span></td>
          <td><strong>坚决平掉前期反套持仓</strong>，顺应中东地缘溢价，逢回调分批布局买 01 卖 05 正套。</td>
        </tr>
        <tr>
          <td><strong>原油 (SC / WTI)</strong></td>
          <td><strong>地缘溢价逐步挤出</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">美伊冲突难缓和但溢价正逐步消退，高油价压制能化下游，建议以跨期对冲替代单边</span></td>
          <td><strong>供给刚性极限与地缘偏强多头</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">美油达产量极限+新井未增，OPEC+暂停增产，美伊局势紧张致抛储未落实+霍尔木兹紧绷</span></td>
          <td><span class="fs-badge-diff-upgrade"><i class="fas fa-arrow-up"></i> 态度显著转强<br>(由弱转强/逢低多)</span></td>
          <td>供给弹性几乎归零，地缘风险彻底封死大幅回调空间。<strong>严禁摸顶沽空</strong>，以逢低偏多或正套为主。</td>
        </tr>
        <tr>
          <td><strong>甲醇 (MA)</strong></td>
          <td><strong>港口去库与绝对坚挺</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">海外进口缩减及港口显性库存加速去化，低库存护城河支持逢低做正套</span></td>
          <td><strong>MTO集中停车短期累库，但基差强挺正套</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">下游4套MTO装置停车致平衡表转向累库大幅回调；但现货基差强且近端库存优于远端</span></td>
          <td><span class="fs-badge-diff-upgrade"><i class="fas fa-sliders-h"></i> 预期短期翻转<br>(累库逆风下逢低正套)</span></td>
          <td>不再追单边多头。利用 MTO 集中停车砸出的回调窗口，在 0 ~ +25 元/吨低位吸筹 01-05 正套。</td>
        </tr>
        <tr>
          <td><strong>有色金属 (铜铝)</strong></td>
          <td><em>往期研讨未重点讨论有色品种</em></td>
          <td><strong>铜铝基本面深度分化 + 多铜空铝</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">铜绝对低库存+减产预期坚挺；铝海外投产+国内铝水比例提升增产承压，为空配标的</span></td>
          <td><span class="fs-badge-diff-new"><i class="fas fa-plus-circle"></i> 全新核心配置<br>(有色强弱配对)</span></td>
          <td>确立<strong>「多铜空铝跨品种正套」</strong>为本期确定性最高主线；铝下游卖虚值Put降本，铜买Put防宏观下杀。</td>
        </tr>
        <tr>
          <td><strong>能源化工 (高硫燃料油)</strong></td>
          <td><em>往期未列入重点监控清单</em></td>
          <td><strong>11 月极低库存严重逼仓风险预警</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">柴油紧俏+海外发电需求溢价，库存降至历史极低位，11月面临逼仓挤兑</span></td>
          <td><span class="fs-badge-diff-reversal"><i class="fas fa-exclamation-triangle"></i> 极端逼仓预警<br>(防逼仓严禁做空)</span></td>
          <td><strong>绝对禁止逆势摸顶沽空 FU2611 合约</strong>；可轻仓顺势做多或做 FU2611 与远月正套。</td>
        </tr>
        <tr>
          <td><strong>芳烃产业链 (纯苯/PX/EB)</strong></td>
          <td><strong>苯乙烯低库存偏强正套</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">苯乙烯显性库存极低，纯苯成本坚挺，推荐买近卖远正套</span></td>
          <td><strong>纯苯/PX成本支撑与产业链分化</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">纯苯/PX受油品组分成本坚挺支撑，但下游亏损严重；苯乙烯开工下滑+下游节后补货</span></td>
          <td><span class="fs-badge-diff-new"><i class="fas fa-layer-group"></i> 覆盖范围扩充<br>(纳入纯苯与PX正套)</span></td>
          <td>明确组分油成本强支撑 vs 下游负反馈，单边容易受抑制，<strong>最优策略结构依然是跨期正套</strong>。</td>
        </tr>
        <tr>
          <td><strong>股指期货 (IF / IC / IM)</strong></td>
          <td><strong>持币观望 / 0 仓位</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">前期信贷数据未见实质改善，模型给出 10 月观望建议，不盲目隔夜抄底</span></td>
          <td><strong>救市第一步，非反转大底</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">核心宽基ETF放量仅属救市第一阶段，非大底；货币供应放缓缺乏向上动力，下杀难度大但反转未明</span></td>
          <td><span class="fs-badge-diff-continue"><i class="fas fa-check"></i> 逻辑深化验证<br>(防守加固/不搏反弹)</span></td>
          <td>彻底打破左侧抄底幻想，拒绝盲目搏反弹；保持 0 投机持仓，耐心等待 M1/M2 剪刀差改善。</td>
        </tr>
        <tr>
          <td><strong>贵金属 (AU / AG)</strong></td>
          <td><strong>观点偏空 + 领口对冲 (Collar)</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">美债实际利率走高及美债发债放缓压制10月金银，建议买Put+卖Call领口保护</span></td>
          <td><strong>实际利率下行缓和跌势，但未见反转</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">实际利率下行起到一定缓和跌势作用，但目前尚未达到形成中期反转信号的强度</span></td>
          <td><span class="fs-badge-diff-upgrade"><i class="fas fa-pause-circle"></i> 跌势趋缓筑底<br>(暂不追空亦不抄底)</span></td>
          <td>空仓维持区间观望；在持有的黄金领口对冲仓位继续按既定纪律护航，不盲目加码做多。</td>
        </tr>
        <tr>
          <td><strong>农产品/胶/化肥 (棉/胶/尿素)</strong></td>
          <td><strong>棉高空 · 胶多头 · 尿素反套</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">国庆长假攻防三大主力单边与套利策略</span></td>
          <td><strong>焦点转移至宏观信用与能化有色正套</strong><br><span style="font-size: 12px; color: var(--fs-text-sub);">本期会议未重点讨论农产品与化肥，精力全面聚焦于宏观地缘与大选主线</span></td>
          <td><span class="fs-badge-diff-archive"><i class="fas fa-archive"></i> 转入存量跟踪<br>(原雷达继续盯市)</span></td>
          <td>棉花 16000 沽空、橡胶 18450 低吸及尿素反套维持既定触发线监控，不新增风险预算。</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- 第二板块：全景策略执行总览矩阵 -->
<div class="fs-card" id="fs-sec-matrix">
  <div class="fs-card-header">
    <h2 class="fs-card-title"><i class="fas fa-th-list" style="color: var(--fs-accent-blue);"></i> 全景资产配置与策略执行矩阵 (Master Execution Matrix)</h2>
    <span style="font-size: 13px; color: var(--fs-text-sub);">点击各品种锚定实操执行细则</span>
  </div>
  <div class="fs-table-responsive">
    <table class="fs-table">
      <thead>
        <tr>
          <th>资产类别</th>
          <th>核心标的与合约</th>
          <th>策略类型</th>
          <th>交易方向</th>
          <th>入场触发逻辑 / 区间</th>
          <th>防守止损位</th>
          <th>止盈目标区间</th>
          <th>头寸上限</th>
          <th>盈亏比</th>
          <th>执行周期</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>有色金属</strong></td>
          <td><strong>铜铝跨期对冲 (CU-AL)</strong></td>
          <td><span class="fs-cell-badge fs-badge-spread">跨品种月差正套</span></td>
          <td><strong>多铜空铝</strong></td>
          <td>铜去库支撑 + 铝远月增产预期，月差逢回调建仓</td>
          <td>价差比率跌破关键支撑线</td>
          <td>捕捉铜强铝弱趋势溢价</td>
          <td>15% - 20%</td>
          <td>3.2 : 1</td>
          <td>1 - 2 个月</td>
        </tr>
        <tr>
          <td><strong>有色金属</strong></td>
          <td><strong>电解铝 (AL2612/2701)</strong></td>
          <td><span class="fs-cell-badge fs-badge-option">卖出虚值Put</span></td>
          <td><strong>替代买入保值</strong></td>
          <td>海外增产预期+国内铝水比例提升，震荡下跌中收取权利金</td>
          <td>标的跌破深虚行权价止损转换</td>
          <td>全额收取消退权利金</td>
          <td>10% - 15%</td>
          <td>防守型</td>
          <td>1 - 2 个月</td>
        </tr>
        <tr>
          <td><strong>有色金属</strong></td>
          <td><strong>阴极铜 (CU2612/2701)</strong></td>
          <td><span class="fs-cell-badge fs-badge-option">买入Put向下转换</span></td>
          <td><strong>多头防下杀保护</strong></td>
          <td>基本面低库存偏强但宏观承压，期权IV偏低时买入虚值Put</td>
          <td>隐波异动或基差结构破位</td>
          <td>锁定下行断崖尾部风险</td>
          <td>100%对冲多头底仓</td>
          <td>对冲型</td>
          <td>1 - 3 个月</td>
        </tr>
        <tr>
          <td><strong>能源化工</strong></td>
          <td><strong>高硫燃料油 (FU2611/2612)</strong></td>
          <td><span class="fs-cell-badge fs-badge-warn">防逼仓 / 顺势偏多</span></td>
          <td><strong>逢低偏多</strong></td>
          <td>柴油紧+发电需求提升溢价，库存极低，11月逼仓风险高</td>
          <td>跌破关键均线平台支撑</td>
          <td>捕捉逼仓溢价脉冲</td>
          <td>12% - 15%</td>
          <td>3.5 : 1</td>
          <td>1 个月 (11月合约)</td>
        </tr>
        <tr>
          <td><strong>国际原油</strong></td>
          <td><strong>原油 (SC / WTI)</strong></td>
          <td><span class="fs-cell-badge fs-badge-long">偏强震荡</span></td>
          <td><strong>逢低偏多</strong></td>
          <td>美油增产到顶+OPEC+暂停增产+霍尔木兹海峡地缘紧绷</td>
          <td>地缘风险实质消退跳水</td>
          <td>地缘溢价脉冲高点分批止盈</td>
          <td>10%</td>
          <td>2.5 : 1</td>
          <td>2 - 4 周</td>
        </tr>
        <tr>
          <td><strong>化工板块</strong></td>
          <td><strong>甲醇 (MA2701-2705)</strong></td>
          <td><span class="fs-cell-badge fs-badge-spread">逢低跨期正套</span></td>
          <td><strong>买 01 / 卖 05</strong></td>
          <td>MTO停车预期致累库回调，但基差强劲且近端库存优于远端</td>
          <td>价差跌破 -50 元/吨</td>
          <td>+100 ~ +150 元/吨</td>
          <td>15%</td>
          <td>3.0 : 1</td>
          <td>1 - 2 个月</td>
        </tr>
        <tr>
          <td><strong>芳烃板块</strong></td>
          <td><strong>纯苯与苯乙烯 (EB2701-2705)</strong></td>
          <td><span class="fs-cell-badge fs-badge-spread">偏强跨期正套</span></td>
          <td><strong>买 01 / 卖 05</strong></td>
          <td>开工率下滑+下游刚需拿货+石脑油强成本支撑</td>
          <td>价差跌破止损阈值</td>
          <td>+180 ~ +260 元/吨</td>
          <td>15%</td>
          <td>3.2 : 1</td>
          <td>1 - 2 个月</td>
        </tr>
        <tr>
          <td><strong>芳烃/化纤</strong></td>
          <td><strong>纯苯与 PX (PX2701-2705)</strong></td>
          <td><span class="fs-cell-badge fs-badge-spread">跨期正套</span></td>
          <td><strong>买近卖远</strong></td>
          <td>组分油成本端强支撑，但下游亏损严重，正套胜于单边</td>
          <td>近月合约贴水扩大超预期</td>
          <td>近端溢价修复与正套走扩</td>
          <td>10%</td>
          <td>2.6 : 1</td>
          <td>1 个月</td>
        </tr>
        <tr>
          <td><strong>聚烯烃</strong></td>
          <td><strong>塑料与 PP (L / PP)</strong></td>
          <td><span class="fs-cell-badge fs-badge-spread">反套转向正套</span></td>
          <td><strong>转向逢低正套</strong></td>
          <td>美以打击伊朗地缘风险重燃，盘面重估地缘成本并由反套转正套</td>
          <td>地缘局势迅速缓和</td>
          <td>近月地缘风险溢价兑现</td>
          <td>12%</td>
          <td>2.8 : 1</td>
          <td>1 - 2 个月</td>
        </tr>
        <tr>
          <td><strong>贵金属</strong></td>
          <td><strong>黄金 (AU2612) / 白银 (AG)</strong></td>
          <td><span class="fs-cell-badge fs-badge-wait">区间观望</span></td>
          <td><strong>暂不盲目抄底</strong></td>
          <td>实际利率下行缓和跌势，但目前尚未达到中期反转信号强度</td>
          <td>跌破前期平台下沿</td>
          <td>等待日线级别反转形态确认</td>
          <td>0% (空仓跟踪)</td>
          <td>-</td>
          <td>持续观察</td>
        </tr>
        <tr>
          <td><strong>金融期货</strong></td>
          <td><strong>沪深300 / 中证500 (IF/IC)</strong></td>
          <td><span class="fs-cell-badge fs-badge-wait">阶段反弹/观望</span></td>
          <td><strong>不盲目搏反弹</strong></td>
          <td>ETF放量救市属第一步，非大底；货币供应放缓缺乏向上驱动</td>
          <td>前低支撑有效性待验</td>
          <td>等待增量金融信贷数据改善</td>
          <td>0% (空仓)</td>
          <td>-</td>
          <td>跟踪观察</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

<!-- 第二板块：宏观信用大变局与量化推演 -->
<div class="fs-card" id="fs-sec-macro">
  <div class="fs-card-header">
    <h2 class="fs-card-title"><i class="fas fa-globe-americas" style="color: var(--fs-accent-blue);"></i> 宏观环境与信用传导链条：四大核心驱动</h2>
    <span class="fs-tag"><i class="fas fa-project-diagram"></i> 信用利差扩大 · 地缘溢价刚性</span>
  </div>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
    
    <!-- 宏观卡片1 -->
    <div style="background: rgba(0,0,0,0.02); border: 1px solid var(--fs-border-card); border-radius: 14px; padding: 18px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="width: 28px; height: 28px; border-radius: 8px; background: rgba(220,38,38,0.12); color: #dc2626; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold;">01</span>
        <h3 style="margin: 0; font-size: 16px; font-weight: 700;">AI资本开支担忧与科技股估值杀跌</h3>
      </div>
      <p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub); margin: 0;">
        <strong>研讨研判：</strong>市场对科技巨头 AI 资本开支（Capex）的可持续性及下游企业实际盈利增速放缓的担忧持续加深。近期美股科技巨头持续大幅回调，估值泡沫收缩直接外溢至全球风险资产，国内成长风格及股指亦面临沉重的海外抛压传导。
      </p>
    </div>

    <!-- 宏观卡片2 -->
    <div style="background: rgba(0,0,0,0.02); border: 1px solid var(--fs-border-card); border-radius: 14px; padding: 18px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="width: 28px; height: 28px; border-radius: 8px; background: rgba(217,119,6,0.12); color: #d97706; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold;">02</span>
        <h3 style="margin: 0; font-size: 16px; font-weight: 700;">长端美债利率走高与信用利差负反馈</h3>
      </div>
      <p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub); margin: 0;">
        <strong>研讨研判：</strong>美国长端国债利率受粘性通胀预期影响再次走高，直接推高了高发债 AI 科技及发债主体的债务融资利息成本。高收益与投资级信用利差持续走阔，触发了“借贷成本上升—企业盈利受抑—流动性紧缩”的螺旋负反馈，全球权益风险偏好显著承压。
      </p>
    </div>

    <!-- 宏观卡片3 -->
    <div style="background: rgba(0,0,0,0.02); border: 1px solid var(--fs-border-card); border-radius: 14px; padding: 18px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="width: 28px; height: 28px; border-radius: 8px; background: rgba(37,99,235,0.12); color: #2563eb; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold;">03</span>
        <h3 style="margin: 0; font-size: 16px; font-weight: 700;">股指反弹定性：救市第一步而非大底</h3>
      </div>
      <p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub); margin: 0;">
        <strong>研讨研判：</strong>近期国内核心宽基 ETF 放量仅属于政策救市的第一阶段，只能带来技术性、阶段性脉冲反弹，当前点位大概率并非中期真正大底。最新金融数据显示货币供应整体仍在放缓，虽有贷款企稳迹象，但整体缺乏持续向上驱动，切忌盲目激进搏反弹。
      </p>
    </div>

    <!-- 宏观卡片4 -->
    <div style="background: rgba(0,0,0,0.02); border: 1px solid var(--fs-border-card); border-radius: 14px; padding: 18px;">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="width: 28px; height: 28px; border-radius: 8px; background: rgba(5,150,105,0.12); color: #059669; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold;">04</span>
        <h3 style="margin: 0; font-size: 16px; font-weight: 700;">原油供给刚性遇上美伊地缘与大选博弈</h3>
      </div>
      <p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub); margin: 0;">
        <strong>研讨研判：</strong>美国原油产量达物理极限且新井未见增加，OPEC+ 10 月起不再增产，供给弹性极低。美伊冲突严峻致战略抛储未落实，霍尔木兹海峡地缘紧绷叠加美国飓风，WTI走势维持偏强。地缘溢价支撑近月，油价单边做空风险极高。
      </p>
    </div>

  </div>
</div>

<!-- 第三板块：八大实战落地执行手册 -->
<div class="fs-card" id="fs-sec-plans">
  <div class="fs-card-header">
    <h2 class="fs-card-title"><i class="fas fa-layer-group" style="color: var(--fs-accent-blue);"></i> 八大核心品种落地执行手册 (Playbooks)</h2>
    <span class="fs-tag green"><i class="fas fa-terminal"></i> 机构交易台参数级细则</span>
  </div>

  <div class="fs-grid-plans">

    <!-- 方案一：铜铝多空对冲正套 -->
    <div class="fs-plan-card plan-spread">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-balance-scale" style="color: #2563eb;"></i> 方案一：铜铝多空配对 (多铜空铝) 跨品种正套</h3>
          <span class="fs-cell-badge fs-badge-spread">强弱配对 · 胜率 75%</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>铜基本面在有色中最坚挺，受绝对低库存与原料减产预期支撑；而铝面临海外电解铝投产预期及国内铝水比例提升带来的铝元素供应扩张，资金视铝为空配品种。多铜空铝跨期与月差正套趋势明确且走势最顺畅。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-exchange-alt"></i> 交易合约配对</span>
            <span class="fs-spec-v">多 CU2612 / CU2701 + 空 AL2612 / AL2701</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-sliders-h"></i> 建议配比</span>
            <span class="fs-spec-v">按市值 1:1 对冲 (或手数 1 手铜对 3.5~4 手铝)</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 防守风控红线</span>
            <span class="fs-spec-v">价比跌破 3.65 或单边波动破位止损</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈区间</span>
            <span class="fs-spec-v" style="color: #059669;">铜铝价比上看 3.90 ~ 4.05 区间</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
            <span class="fs-spec-v">总资金占用 15% - 20%</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>高频监控红线：</strong>1. 跟踪国内电解铜社会去库斜率；2. 监测几内亚铝土矿及海外新增电解铝产能爬坡进度；3. 若宏观出现极端黑天鹅下杀，因铜弹性大于铝，需启动期权保护。
      </div>
    </div>

    <!-- 方案二：铝下游卖虚值看跌期权 -->
    <div class="fs-plan-card plan-option">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-tags" style="color: #7c3aed;"></i> 方案二：铝下游卖出虚值Put (Short OTM Put) 替代买入保值</h3>
          <span class="fs-cell-badge fs-badge-option">权利金降本 · 胜率 80%</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>针对铝单边震荡下跌预期，下游用铝制造企业若直接买入期货保值面临基差或单边回撤风险。研讨会建议下游企业卖出深虚值看跌期权（Delta 约 -0.15 至 -0.25），以权利金直接补贴未来采购成本或实现折价接货。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-bullseye"></i> 标的期权合约</span>
            <span class="fs-spec-v">上期所 AL2612-P 或 AL2701-P 虚值看跌</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-sliders-h"></i> 推荐行权价</span>
            <span class="fs-spec-v" style="color: #7c3aed;">现价下方 3%~5% 强支撑位虚值行权价</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 风险应对措施</span>
            <span class="fs-spec-v">跌破行权价若被行权，按折价低位现货提货入库</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 预期收益</span>
            <span class="fs-spec-v" style="color: #059669;">全额收取时间价值 (年化约 12%~18%)</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
            <span class="fs-spec-v">保证金占用 ≤ 15% (严防被动加杠杆)</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>实操要点：</strong>必须与企业真实原材料采购消耗计划 1:1 挂钩，严禁超出实体消化能力的投机性裸卖看跌期权。
      </div>
    </div>

    <!-- 方案三：铜买入看跌期权防下杀 -->
    <div class="fs-plan-card plan-long">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-shield-alt" style="color: #059669;"></i> 方案三：铜买入看跌期权 (Long Put) 向下转换防宏观下杀</h3>
          <span class="fs-cell-badge fs-badge-long">黑天鹅保险 · 风险锁定</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>铜价当前处于绝对高位且对宏观流动性极其敏感。研讨会明确指出：若全球宏观或科技信用利差暴雷，铜的跌幅弹性可能大于铝。当前期权隐波偏低，持有多单或现货库存者应买入看跌期权进行“向下转换”保护。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-bullseye"></i> 标的期权合约</span>
            <span class="fs-spec-v">CU2612 或 CU2701 浅虚值看跌期权 (Put)</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-sliders-h"></i> Delta 选型</span>
            <span class="fs-spec-v" style="color: #059669;">Delta ≈ -0.25 ~ -0.35 (低IV高性价比)</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 最大下行亏损</span>
            <span class="fs-spec-v">被完全锁死在行权价与权利金之差以内</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 上行参与度</span>
            <span class="fs-spec-v">保留铜基本面坚挺带来的现货/多头全部上涨红利</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 权利金支出预算</span>
            <span class="fs-spec-v">仅占用现货或多头头寸市值的 1.0% ~ 1.5%</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>实操要点：</strong>若美国大选或地缘局势未引发暴跌，在到期前两周可平仓残值或移仓展期，以极低保险费规避宏观毁灭性风险。
      </div>
    </div>

    <!-- 方案四：高硫燃料油防逼仓 -->
    <div class="fs-plan-card plan-short">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-gas-pump" style="color: #dc2626;"></i> 方案四：高硫燃料油 (FU) 11 月极低库存逼仓应对与套利</h3>
          <span class="fs-cell-badge fs-badge-short">逼仓预警 · 高赔率</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>受全球柴油紧俏及海外中东/南亚发电需求提升溢价影响，高硫燃料油库存降至历史极低位。研讨会发出严重预警：<strong>11 月份高硫燃料油大概率面临逼仓行情</strong>，空头面临严峻交割挤兑风险，操作上绝对禁止裸空。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-bullseye"></i> 标的合约</span>
            <span class="fs-spec-v">上期所 FU2611 / FU2612 合约</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-sliders-h"></i> 操作方向</span>
            <span class="fs-spec-v" style="color: #dc2626;">近月逢回调顺势做多，或多 FU2611 空 FU2701 正套</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 防守止损基准</span>
            <span class="fs-spec-v">现货基差拐头走弱或跌破 5 日均线</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈空间</span>
            <span class="fs-spec-v" style="color: #059669;">近月逼仓脉冲溢价兑现即分批撤退</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
            <span class="fs-spec-v">10% - 15% (严控单边风险)</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>极度警惕：</strong>切忌以为高硫油估值偏高而逆势摸顶沽空 11 合约！极低交割仓单结构下，多头逼仓速度极快。
      </div>
    </div>

    <!-- 方案五：甲醇装置停车逆风下的基差正套 -->
    <div class="fs-plan-card plan-spread">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-flask" style="color: #2563eb;"></i> 方案五：甲醇 (MA) MTO停车累库逆风下的基差正套</h3>
          <span class="fs-cell-badge fs-badge-spread">期限正套 · 逢低布局</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>受下游四套 MTO 装置集中停车预期影响，甲醇平衡表短期由去库转向累库，盘面大幅回调。但研讨会指出：甲醇现货基差依然强劲，近端库存结构显著优于远端，中东地缘发酵将进一步支撑近端进口成本，建议以逢回调做正套为主。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-exchange-alt"></i> 交易合约组合</span>
            <span class="fs-spec-v">买 MA2701 空 MA2705 (跨期 1:1)</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-sliders-h"></i> 建议入场价差</span>
            <span class="fs-spec-v" style="color: #2563eb;">MA01-05 价差在 0 ~ +25 元/吨逢回调建仓</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 止损风控红线</span>
            <span class="fs-spec-v">价差有效跌破 -40 元/吨坚决离场</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈空间</span>
            <span class="fs-spec-v" style="color: #059669;">+100 ~ +140 元/吨</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
            <span class="fs-spec-v">12% - 15%</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>监控指标：</strong>跟踪四套 MTO 装置实质检修时间节点及沿海港口甲醇周度真实提货流向。
      </div>
    </div>

    <!-- 方案六：纯苯与苯乙烯成本支撑型正套 -->
    <div class="fs-plan-card plan-spread">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-cubes" style="color: #0891b2;"></i> 方案六：纯苯与苯乙烯 (EB) / PX 成本支撑型跨期正套</h3>
          <span class="fs-cell-badge fs-badge-spread">芳烃正套 · 胜率 70%</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>纯苯和苯乙烯面临海内外装置开工率下滑与下游节后刚需补库，叠加石脑油偏强支撑，液化品整体偏紧。纯苯与PX作为组分油成本强支撑，但下游利润处于深度亏损，单边易受负反馈抑制，因此最佳载体依然是买近卖远正套。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-exchange-alt"></i> 交易合约组合</span>
            <span class="fs-spec-v">买 EB2701 空 EB2705 / 多 PX 近月空远月</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-sliders-h"></i> EB 入场价差</span>
            <span class="fs-spec-v" style="color: #0891b2;">EB01-05 价差在 +40 ~ +90 元/吨分批进场</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 止损风控红线</span>
            <span class="fs-spec-v">EB价差跌破 0 元/吨止损</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈空间</span>
            <span class="fs-spec-v" style="color: #059669;">EB价差目标 +200 ~ +260 元/吨</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
            <span class="fs-spec-v">15%</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>监控指标：</strong>石脑油裂解价差、纯苯华东港口显性库存与下游 PS/ABS 装置开工负荷。
      </div>
    </div>

    <!-- 方案七：聚烯烃地缘溢价转向正套 -->
    <div class="fs-plan-card plan-amber">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-industry" style="color: #d97706;"></i> 方案七：聚烯烃 (L/PP) 地缘溢价重新计价转向正套</h3>
          <span class="fs-cell-badge fs-badge-warn">策略转向 · 顺应地缘</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>聚烯烃此前因预期新装置投产及开工率上行而呈现反套走势。但研讨会强调：在美以可能打击伊朗石油及石化设施的地缘风险下，中东对华聚烯烃进口供应链受阻风险陡增，市场将重新计价近端地缘溢价，策略全面由反套转向正套。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-exchange-alt"></i> 交易合约组合</span>
            <span class="fs-spec-v">多 L2701 空 L2705 / 多 PP2701 空 PP2705</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-sliders-h"></i> 入场时点</span>
            <span class="fs-spec-v" style="color: #d97706;">价差企稳回升时右侧入场买近卖远</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-shield-alt"></i> 止损风控红线</span>
            <span class="fs-spec-v">中东局势实质降温，价差创新低止损</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-flag-checkered"></i> 目标止盈空间</span>
            <span class="fs-spec-v" style="color: #059669;">近端地缘风险溢价脉冲修复</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-pie-chart"></i> 头寸资金占比</span>
            <span class="fs-spec-v">10% - 12%</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>实操提示：</strong>彻底平仓并终结前期的反套持仓，顺应中东地缘冲突对近月能源与石化品价格的脉冲拉动。
      </div>
    </div>

    <!-- 方案八：股指与贵金属防守观望策略 -->
    <div class="fs-plan-card plan-long">
      <div>
        <div class="fs-plan-top">
          <h3 class="fs-plan-title"><i class="fas fa-eye" style="color: #64748b;"></i> 方案八：股指期货与贵金属防守观望与风控配置手册</h3>
          <span class="fs-cell-badge fs-badge-wait">持币观望 · 防守至上</span>
        </div>
        <p class="fs-plan-desc">
          <strong>核心逻辑：</strong>股指核心 ETF 救市放量属第一步，非大底，货币供应放缓缺乏持续动力；贵金属实际利率下行仅起到缓解跌势作用，尚不具备中期反转信号强度。两者均应保持轻仓观望，避免在趋势拐点未确立前充当试错炮灰。
        </p>
        <div class="fs-spec-list">
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-compass"></i> 股指期货操作</span>
            <span class="fs-spec-v">保持 0 投机多头仓位，仅做现货对冲</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-coins"></i> 贵金属操作</span>
            <span class="fs-spec-v">短线区间震荡高抛低吸，不盲目追单边多头</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-binoculars"></i> 核心右侧信号</span>
            <span class="fs-spec-v">M1/M2剪刀差收窄、社融信贷实质性放量</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-percentage"></i> 贵金属反转判定</span>
            <span class="fs-spec-v">美联储降息预期加速与美债收益率形成破位下行</span>
          </div>
          <div class="fs-spec-row">
            <span class="fs-spec-k"><i class="fas fa-wallet"></i> 建议现金闲置率</span>
            <span class="fs-spec-v" style="color: #059669;">账户保留 ≥ 50% 现金储备</span>
          </div>
        </div>
      </div>
      <div class="fs-checkpoint-box">
        <strong>专业纪律：</strong>耐心是顶级交易员的终极护城河。在宏观信号模糊期，空仓也是一种极高确定性的策略。
      </div>
    </div>

  </div>
</div>

<!-- 第四板块：期权战术与隐波专题 -->
<div class="fs-card" id="fs-sec-options">
  <div class="fs-card-header">
    <h2 class="fs-card-title"><i class="fas fa-percentage" style="color: var(--fs-accent-purple);"></i> 商品期权深度实战战术：两大核心战法</h2>
    <span class="fs-tag"><i class="fas fa-chess-knight"></i> 非线性非对称工具赋能</span>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 18px;">
    
    <!-- 期权战法一：铝卖出虚值看跌期权 -->
    <div style="background: rgba(124, 58, 237, 0.04); border: 1px solid rgba(124, 58, 237, 0.25); border-radius: 14px; padding: 20px;">
      <h3 style="margin-top: 0; font-size: 16px; color: #7c3aed; display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-arrow-circle-down"></i> 战法 A：铝下游“卖虚值 Put 替代直接买入保值”深度拆解
      </h3>
      <p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub);">
        <strong>为什么绝不直接在盘面买多铝期货保值？</strong><br>
        当前海外电解铝投产预期较强，且国内铝水比例提升导致市场流通铝锭元素持续增加，单边呈现阴跌格局。若下游加工企业直接在期货买多保值，极易遭受单边基差与价格双杀。
      </p>
      <div style="background: var(--fs-bg-card); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--fs-border-card); font-size: 13px; line-height: 1.7; margin: 12px 0;">
        <strong>执行结构：</strong><br>
        1. 针对未来 1~2 个月有实体用铝需求的加工厂，在现价下方 3%~5% 的支撑区间卖出虚值 Put；<br>
        2. <strong>情景一（铝价继续阴跌或横盘）：</strong>期权未被行权，企业稳稳收下全部权利金，等效降低原材料采购成本；<br>
        3. <strong>情景二（铝价大幅击穿行权价）：</strong>期权被行权，企业以行权价扣减已收权利金的超低折价买入现货铝锭，达成超预期低成本采购。
      </div>
      <p style="font-size: 12.5px; color: var(--fs-text-sub); margin: 0;">
        ⚠️ <strong>铁律：</strong>严禁投机客户无现货采购需求裸卖看跌，必须有对应实体采购订单为依托。
      </p>
    </div>

    <!-- 期权战法二：铜买入看跌期权防下杀 -->
    <div style="background: rgba(5, 150, 105, 0.04); border: 1px solid rgba(5, 150, 105, 0.25); border-radius: 14px; padding: 20px;">
      <h3 style="margin-top: 0; font-size: 16px; color: #059669; display: flex; align-items: center; gap: 8px;">
        <i class="fas fa-shield-alt"></i> 战法 B：铜多头“买入 Put 向下转换”防范宏观暴跌
      </h3>
      <p style="font-size: 13.5px; line-height: 1.7; color: var(--fs-text-sub);">
        <strong>为什么在当前位置铜多头必须配置买入 Put？</strong><br>
        虽然铜基本面低库存支撑坚挺，但铜作为“宏观博士”对全球信贷与科技泡沫收缩极度敏感。研讨会明确提示：若宏观爆出信用违约或美股深度下杀，铜的下跌弹性将远超铝。
      </p>
      <div style="background: var(--fs-bg-card); padding: 12px 14px; border-radius: 10px; border: 1px solid var(--fs-border-card); font-size: 13px; line-height: 1.7; margin: 12px 0;">
        <strong>战术优势：</strong><br>
        1. <strong>隐波洼地红利：</strong>目前铜期权隐含波动率（IV）处于历史中低分位，看跌期权权利金极其廉价；<br>
        2. <strong>非对称保险：</strong>买入平值或浅虚值 Put，将铜多头头寸的理论最大回撤锁死；<br>
        3. <strong>向下转换灵活：</strong>一旦宏观断崖暴跌，Put 价值爆发式飙升不仅能 100% 抵消期货多单损失，还可获利了结 Put 后在极低位置翻手抄底。
      </div>
      <p style="font-size: 12.5px; color: var(--fs-text-sub); margin: 0;">
        💡 <strong>建议：</strong>按现有多头底仓 1:1 配备 Delta 约 -0.30 的虚值 Put，花费极低权利金换取极致安全。
      </p>
    </div>

  </div>
</div>

<!-- 第五板块：地缘大选黑天鹅与资金管理守则 -->
<div class="fs-card" id="fs-sec-risk">
  <div class="fs-card-header">
    <h2 class="fs-card-title"><i class="fas fa-shield-virus" style="color: var(--fs-accent-red);"></i> 地缘局势与美国大选窗口期：资金管理三铁律</h2>
    <span class="fs-tag amber"><i class="fas fa-exclamation-triangle"></i> 极端跳空应对与仓位防线</span>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
    
    <div style="background: rgba(220, 38, 38, 0.04); border-left: 4px solid #dc2626; padding: 16px; border-radius: 0 12px 12px 0;">
      <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: var(--fs-text-main);">铁律一：以跨期套利/对冲为主，压缩裸单边敞口</h4>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: var(--fs-text-sub);">
        当前正值美国大选关键决战期与中东美以伊冲突敏感节点，单边资产隔夜跳空概率极高。除高硫燃料油具备逼仓极度低库存驱动外，其余化工品（甲醇/苯乙烯/聚烯烃）及有色金属（铜铝）均应以买近卖远正套或强弱对冲为主。
      </p>
    </div>

    <div style="background: rgba(217, 119, 6, 0.04); border-left: 4px solid #d97706; padding: 16px; border-radius: 0 12px 12px 0;">
      <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: var(--fs-text-main);">铁律二：账户总保证金占用强制控制在 45% 以下</h4>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: var(--fs-text-sub);">
        在地缘与大选消息漫天飞舞阶段，外盘原油、美股、美债动辄出现 3%~5% 脉冲跳空。国内账户必须预留至少 55% 的可用流动资金，确保即使遭遇连续两个方向相反的极限跳空，也绝不触及追加保证金通知线。
      </p>
    </div>

    <div style="background: rgba(5, 150, 105, 0.04); border-left: 4px solid #059669; padding: 16px; border-radius: 0 12px 12px 0;">
      <h4 style="margin: 0 0 6px 0; font-size: 15px; font-weight: 700; color: var(--fs-text-main);">铁律三：股指与贵金属拒绝左侧博弈，静待右侧</h4>
      <p style="margin: 0; font-size: 13px; line-height: 1.6; color: var(--fs-text-sub);">
        股指救市 ETF 放量仅能撑起结构性脉冲，货币供应与私营信贷未见拐点前坚决不猜底；贵金属实际利率下行未达反转阈值。管住双手，把弹药集中在确定性极高的“多铜空铝月差”与“化工低估值正套”上。
      </p>
    </div>

  </div>
</div>

<!-- 第六板块：交互测算工具箱 -->
<div class="fs-card" id="fs-sec-calcs">
  <div class="fs-card-header">
    <h2 class="fs-card-title"><i class="fas fa-calculator" style="color: var(--fs-accent-blue);"></i> 策略落地辅助测算工具箱 (Live Simulators)</h2>
    <span class="fs-tag"><i class="fas fa-laptop-code"></i> 实时参数敏感性推演</span>
  </div>

  <div class="fs-calc-container">
    
    <!-- 工具一：铜铝跨品种套利价差与对冲比率模拟器 -->
    <div class="fs-calc-box">
      <div>
        <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: var(--fs-accent-blue);">
          <i class="fas fa-balance-scale"></i> 工具 A：铜铝跨品种对冲配比与价比测算器
        </h3>
        <p style="font-size: 12.5px; color: var(--fs-text-sub); margin: 0;">测算当前铜铝期货价格下的价比、市值中性配比手数与目标收益。</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">铜期货价格 (元/吨)</label>
          <input type="number" id="calc-cu-price" class="fs-calc-input" value="77000" step="100">
        </div>
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">铝期货价格 (元/吨)</label>
          <input type="number" id="calc-al-price" class="fs-calc-input" value="20600" step="50">
        </div>
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">做多铜手数 (手，5吨/手)</label>
          <input type="number" id="calc-cu-lots" class="fs-calc-input" value="2" step="1">
        </div>
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">预期目标铜铝价比</label>
          <input type="number" id="calc-target-ratio" class="fs-calc-input" value="3.95" step="0.05">
        </div>
      </div>

      <div class="fs-calc-result-panel">
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">当前铜铝价比 (CU/AL):</span>
          <span id="res-cu-al-ratio" class="fs-calc-res-val" style="color: var(--fs-accent-blue);">3.738</span>
        </div>
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">市值中性对应空铝手数 (5吨/手):</span>
          <span id="res-al-lots" class="fs-calc-res-val">约 7.5 手 (取 7 或 8 手)</span>
        </div>
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">组合市值规模 (元):</span>
          <span id="res-combo-val" class="fs-calc-res-val">约 770,000 元</span>
        </div>
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">达目标价比预估正套收益:</span>
          <span id="res-spread-pnl" class="fs-calc-res-val" style="color: #059669;">+43,600 元 (+5.66%)</span>
        </div>
      </div>
    </div>

    <!-- 工具二：铝下游卖出虚值看跌期权安全边际计算器 -->
    <div class="fs-calc-box">
      <div>
        <h3 style="margin: 0 0 6px 0; font-size: 16px; font-weight: 700; color: var(--fs-accent-purple);">
          <i class="fas fa-tags"></i> 工具 B：铝下游卖出虚值Put (Short Put) 安全垫与收益测算器
        </h3>
        <p style="font-size: 12.5px; color: var(--fs-text-sub); margin: 0;">测算下游企业通过卖出虚值看跌期权能够获得的折价提货成本与安全缓冲垫。</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">铝当前市价 (元/吨)</label>
          <input type="number" id="calc-spot-al" class="fs-calc-input" value="20600" step="50">
        </div>
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">拟卖出行权价 (元/吨)</label>
          <input type="number" id="calc-put-k" class="fs-calc-input" value="19800" step="50">
        </div>
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">收到权利金单价 (元/吨)</label>
          <input type="number" id="calc-put-premium" class="fs-calc-input" value="260" step="10">
        </div>
        <div class="fs-calc-input-group">
          <label class="fs-calc-label">保值采购规模 (吨)</label>
          <input type="number" id="calc-al-tons" class="fs-calc-input" value="100" step="20">
        </div>
      </div>

      <div class="fs-calc-result-panel">
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">净权利金总收入:</span>
          <span id="res-total-premium" class="fs-calc-res-val" style="color: var(--fs-accent-purple);">+26,000 元</span>
        </div>
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">被行权时的实际接货净成本:</span>
          <span id="res-net-buy-cost" class="fs-calc-res-val" style="color: #059669;">19,540 元/吨</span>
        </div>
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">相对于当前现价的安全缓冲垫:</span>
          <span id="res-buffer-pct" class="fs-calc-res-val" style="color: var(--fs-accent-blue); font-size: 16px;">-1,060 元/吨 (-5.15%)</span>
        </div>
        <div class="fs-calc-res-item">
          <span style="color: var(--fs-text-sub);">未被行权时年化收益率预估 (30天):</span>
          <span id="res-annual-yield" class="fs-calc-res-val" style="color: #059669;">约 15.1%</span>
        </div>
      </div>
    </div>

  </div>
</div>

</div>

{% raw %}
<script>
(function() {
  // 铜铝对冲计算
  function calcCuAl() {
    var cuPrice = parseFloat(document.getElementById('calc-cu-price').value) || 77000;
    var alPrice = parseFloat(document.getElementById('calc-al-price').value) || 20600;
    var cuLots = parseFloat(document.getElementById('calc-cu-lots').value) || 2;
    var targetRatio = parseFloat(document.getElementById('calc-target-ratio').value) || 3.95;

    var currRatio = cuPrice / (alPrice || 1);
    var cuVal = cuPrice * cuLots * 5;
    var alLotsExact = (cuVal / (alPrice * 5));
    var alLotsRound = Math.round(alLotsExact);

    var ratioEl = document.getElementById('res-cu-al-ratio');
    if (ratioEl) ratioEl.innerText = currRatio.toFixed(3);

    var alLotsEl = document.getElementById('res-al-lots');
    if (alLotsEl) alLotsEl.innerText = '精确 ' + alLotsExact.toFixed(1) + ' 手 (建议 ' + alLotsRound + ' 手)';

    var comboValEl = document.getElementById('res-combo-val');
    if (comboValEl) comboValEl.innerText = (cuVal * 2).toLocaleString() + ' 元';

    var ratioGainPct = ((targetRatio - currRatio) / currRatio) * 100;
    var estPnl = cuVal * (targetRatio - currRatio) / currRatio;

    var pnlEl = document.getElementById('res-spread-pnl');
    if (pnlEl) {
      pnlEl.innerText = (estPnl >= 0 ? '+' : '') + Math.round(estPnl).toLocaleString() + ' 元 (' + (ratioGainPct >= 0 ? '+' : '') + ratioGainPct.toFixed(2) + '%)';
    }
  }

  // 铝期权测算
  function calcAlOption() {
    var spot = parseFloat(document.getElementById('calc-spot-al').value) || 20600;
    var strike = parseFloat(document.getElementById('calc-put-k').value) || 19800;
    var premium = parseFloat(document.getElementById('calc-put-premium').value) || 260;
    var tons = parseFloat(document.getElementById('calc-al-tons').value) || 100;

    var totalPrem = premium * tons;
    var netCost = strike - premium;
    var bufferDiff = netCost - spot;
    var bufferPct = (bufferDiff / spot) * 100;
    var annualYield = ((premium / strike) * (365 / 30)) * 100;

    var totEl = document.getElementById('res-total-premium');
    if (totEl) totEl.innerText = '+' + Math.round(totalPrem).toLocaleString() + ' 元';

    var costEl = document.getElementById('res-net-buy-cost');
    if (costEl) costEl.innerText = netCost.toLocaleString() + ' 元/吨';

    var bufEl = document.getElementById('res-buffer-pct');
    if (bufEl) bufEl.innerText = bufferDiff.toFixed(0) + ' 元/吨 (' + bufferPct.toFixed(2) + '%)';

    var yieldEl = document.getElementById('res-annual-yield');
    if (yieldEl) yieldEl.innerText = '约 ' + annualYield.toFixed(1) + '%';
  }

  // 事件监听
  ['calc-cu-price', 'calc-al-price', 'calc-cu-lots', 'calc-target-ratio'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', calcCuAl);
  });

  ['calc-spot-al', 'calc-put-k', 'calc-put-premium', 'calc-al-tons'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('input', calcAlOption);
  });

  // 粘性导航平滑滚动
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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      calcCuAl();
      calcAlOption();
      setupNav();
    });
  } else {
    calcCuAl();
    calcAlOption();
    setupNav();
  }
})();
</script>
{% endraw %}
