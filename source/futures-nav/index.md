---
title: 期货大宗商品全景投研导航 (Futures Nav Hub)
date: 2026-09-06 15:00:00
aside: false
comments: false
top_img: false
---

<style>
/* 容器全屏及主题自适应 */
#content-inner {
  max-width: 98% !important;
  width: 98% !important;
  padding: 0 10px !important;
}
#page {
  width: 100% !important;
  padding: 10px 0 !important;
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

/* 导航专属变量 */
:root {
  --fnav-bg-card: rgba(255, 255, 255, 0.85);
  --fnav-border-card: rgba(226, 232, 240, 0.8);
  --fnav-text-primary: #1e293b;
  --fnav-text-secondary: #64748b;
  --fnav-hover-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.08), 0 8px 16px -6px rgba(15, 23, 42, 0.04);
  --fnav-accent-glow: rgba(59, 130, 246, 0.12);
}
[data-theme="dark"] {
  --fnav-bg-card: rgba(30, 41, 59, 0.7);
  --fnav-border-card: rgba(51, 65, 85, 0.7);
  --fnav-text-primary: #f8fafc;
  --fnav-text-secondary: #94a3b8;
  --fnav-hover-shadow: 0 16px 32px -8px rgba(0, 0, 0, 0.5);
  --fnav-accent-glow: rgba(59, 130, 246, 0.25);
}

.fnav-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

/* 顶部搜索与统计横幅 */
.fnav-hero-header {
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  padding: 28px 24px;
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
.fnav-hero-header::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -20%;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%);
  pointer-events: none;
}
.fnav-hero-title-area {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 800px;
}
.fnav-hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 9999px;
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-size: 12px;
  font-weight: 600;
  width: fit-content;
}
.fnav-hero-h1 {
  font-size: 26px;
  font-weight: 800;
  letter-spacing: -0.5px;
  margin: 0;
  color: #ffffff !important;
  border: none !important;
}
.fnav-hero-desc {
  font-size: 13.5px;
  color: #cbd5e1;
  line-height: 1.6;
  margin: 0;
}

/* 实时搜索框 */
.fnav-search-wrapper {
  margin-top: 18px;
  position: relative;
  max-width: 680px;
}
.fnav-search-input {
  width: 100%;
  padding: 13px 44px 13px 46px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  font-size: 14px;
  outline: none;
  transition: all 0.25s ease;
  backdrop-filter: blur(8px);
}
.fnav-search-input::placeholder {
  color: #94a3b8;
}
.fnav-search-input:focus {
  background: rgba(255, 255, 255, 0.16);
  border-color: #38bdf8;
  box-shadow: 0 0 0 4px rgba(56, 189, 248, 0.2);
}
.fnav-search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  font-size: 16px;
  pointer-events: none;
}
.fnav-search-clear {
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: #94a3b8;
  background: transparent;
  border: none;
  font-size: 14px;
  cursor: pointer;
  display: none;
  padding: 4px;
}
.fnav-search-clear:hover {
  color: #ffffff;
}

/* 分类胶囊标签栏 (Sticky Filter Bar) */
.fnav-tabs-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  overflow-x: auto;
  padding: 8px 4px;
  margin-top: 5px;
  white-space: nowrap;
  scrollbar-width: none;
}
.fnav-tabs-bar::-webkit-scrollbar {
  display: none;
}
.fnav-tab-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 10px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: 1px solid var(--fnav-border-card);
  background: var(--fnav-bg-card);
  color: var(--fnav-text-secondary);
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}
.fnav-tab-btn:hover {
  color: var(--fnav-text-primary);
  border-color: #3b82f6;
  transform: translateY(-1px);
}
.fnav-tab-btn.active {
  background: #2563eb !important;
  color: #ffffff !important;
  border-color: #2563eb !important;
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);
}
.fnav-tab-count {
  display: inline-block;
  padding: 1px 6px;
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.08);
  font-size: 11px;
  font-family: monospace;
}
[data-theme="dark"] .fnav-tab-count {
  background: rgba(255, 255, 255, 0.12);
}
.fnav-tab-btn.active .fnav-tab-count {
  background: rgba(255, 255, 255, 0.25);
  color: #fff;
}

/* 分类板块 Header */
.fnav-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 15px;
}
.fnav-section-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(59, 130, 246, 0.2);
}
.fnav-section-title {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 18px;
  font-weight: 700;
  color: var(--fnav-text-primary);
  margin: 0;
}
.fnav-section-title i {
  color: #2563eb;
  font-size: 19px;
}
.fnav-section-desc {
  font-size: 12.5px;
  color: var(--fnav-text-secondary);
}

/* 卡片网格 (Responsive Grid) */
.fnav-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
@media screen and (max-width: 1280px) {
  .fnav-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
@media screen and (max-width: 900px) {
  .fnav-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
}
@media screen and (max-width: 580px) {
  .fnav-grid { grid-template-columns: 1fr; }
}

/* 单个网站卡片 */
.fnav-card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px 18px;
  background: var(--fnav-bg-card);
  border: 1px solid var(--fnav-border-card);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  text-decoration: none !important;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.fnav-card:hover {
  transform: translateY(-3px);
  border-color: #3b82f6;
  box-shadow: var(--fnav-hover-shadow);
}
.fnav-card-top {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 10px;
}
.fnav-card-icon {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}
.fnav-card-meta {
  flex: 1;
  min-width: 0;
}
.fnav-card-name {
  font-size: 14.5px;
  font-weight: 700;
  color: var(--fnav-text-primary);
  line-height: 1.35;
  margin-bottom: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.fnav-card-domain {
  font-size: 11.5px;
  color: var(--fnav-text-secondary);
  font-family: monospace;
}
.fnav-card-badge {
  display: inline-block;
  padding: 2px 7px;
  border-radius: 6px;
  font-size: 10.5px;
  font-weight: 600;
  background: rgba(59, 130, 246, 0.1);
  color: #2563eb;
  border: 1px solid rgba(59, 130, 246, 0.25);
  margin-left: auto;
  white-space: nowrap;
}
[data-theme="dark"] .fnav-card-badge {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-color: rgba(59, 130, 246, 0.4);
}

.fnav-card-desc {
  font-size: 12.5px;
  color: var(--fnav-text-secondary);
  line-height: 1.55;
  margin-bottom: 12px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 38px;
}

.fnav-card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 12px;
}
.fnav-tag-pill {
  font-size: 11px;
  padding: 1px 7px;
  border-radius: 4px;
  background: rgba(0, 0, 0, 0.04);
  color: var(--fnav-text-secondary);
}
[data-theme="dark"] .fnav-tag-pill {
  background: rgba(255, 255, 255, 0.07);
}

.fnav-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 10px;
  border-top: 1px solid var(--fnav-border-card);
  font-size: 12px;
}
.fnav-btn-link {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #2563eb !important;
  font-weight: 600;
  text-decoration: none !important;
  transition: all 0.2s ease;
}
.fnav-btn-link:hover {
  color: #1d4ed8 !important;
  transform: translateX(2px);
}
.fnav-btn-copy {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  background: transparent;
  border: none;
  color: var(--fnav-text-secondary);
  cursor: pointer;
  padding: 3px 6px;
  border-radius: 4px;
  font-size: 11px;
  transition: all 0.2s ease;
}
.fnav-btn-copy:hover {
  background: rgba(0, 0, 0, 0.05);
  color: var(--fnav-text-primary);
}
[data-theme="dark"] .fnav-btn-copy:hover {
  background: rgba(255, 255, 255, 0.1);
}

/* 搜索结果无匹配提示 */
.fnav-empty-state {
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  background: var(--fnav-bg-card);
  border-radius: 20px;
  border: 1px dashed var(--fnav-border-card);
}
.fnav-empty-state i {
  font-size: 48px;
  color: #94a3b8;
  margin-bottom: 14px;
}
.fnav-empty-title {
  font-size: 17px;
  font-weight: 700;
  color: var(--fnav-text-primary);
  margin-bottom: 6px;
}
.fnav-empty-hint {
  font-size: 13px;
  color: var(--fnav-text-secondary);
}

/* Toast 提示 */
.fnav-toast {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%) translateY(100px);
  padding: 10px 18px;
  background: #1e293b;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  border-radius: 999px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
  z-index: 9999;
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  align-items: center;
  gap: 8px;
  pointer-events: none;
}
.fnav-toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}
</style>
<div class="fnav-container">
  <div class="fnav-hero-header">
    <div class="fnav-hero-title-area">
      <span class="fnav-hero-badge"><i class="fas fa-compass"></i> 大宗商品投研指南 · 权威收录</span>
      <h1 class="fnav-hero-h1">期货大宗商品全景投研导航</h1>
      <p class="fnav-hero-desc">专为大宗商品交易者、产业套保机构与宏观量化研究员打造的一站式常用站点检索中心。涵盖国内六大期货交易所、全球基准衍生品、高频现货资讯、橡胶物候气象、CFTC持仓与量化开发生态。</p>
    </div>
    <!-- 实时搜索框 -->
    <div class="fnav-search-wrapper">
      <i class="fas fa-search fnav-search-icon"></i>
      <input type="text" id="fnav-search-input" class="fnav-search-input" placeholder="输入关键词实时搜索（如：橡胶、上期所、CFTC、龙虎榜、泰国、开工率、原油...）" oninput="handleFNavSearch(this.value)" />
      <button id="fnav-search-clear" class="fnav-search-clear" onclick="clearFNavSearch()" title="清空搜索"><i class="fas fa-times-circle"></i></button>
    </div>
  </div>
  <!-- 分类筛选栏 -->
  <div class="fnav-tabs-bar" id="fnav-tabs">
    <button class="fnav-tab-btn active" onclick="filterFNavCategory('all', this)"><i class="fas fa-th-large"></i> <span>全部导航</span> <span class="fnav-tab-count">47</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('domestic_exchanges', this)"><i class="fas fa-landmark"></i> <span>国内权威期货交易所</span> <span class="fnav-tab-count">6</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('global_exchanges', this)"><i class="fas fa-globe-americas"></i> <span>国际顶级期货交易所</span> <span class="fnav-tab-count">6</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('spot_industry', this)"><i class="fas fa-chart-bar"></i> <span>现货报价与产业链高频数据</span> <span class="fnav-tab-count">6</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('rubber_weather', this)"><i class="fas fa-seedling"></i> <span>橡胶物候、海外原料与产区气象专区</span> <span class="fnav-tab-count">7</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('macro_capital', this)"><i class="fas fa-coins"></i> <span>宏观流动性、资金持仓与重磅指标</span> <span class="fnav-tab-count">6</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('regulation_safety', this)"><i class="fas fa-shield-alt"></i> <span>监管合规与账户资金安全</span> <span class="fnav-tab-count">4</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('tools_quant', this)"><i class="fas fa-toolbox"></i> <span>投研工具、量化数据与专属看板</span> <span class="fnav-tab-count">7</span></button>
    <button class="fnav-tab-btn" onclick="filterFNavCategory('trading_software', this)"><i class="fas fa-desktop"></i> <span>期货行情分析终端与量化交易软件</span> <span class="fnav-tab-count">5</span></button>
  </div>
  <section class="fnav-section" id="sec-domestic_exchanges" data-cat="domestic_exchanges">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-landmark"></i>        <span>国内权威期货交易所</span>      </div>      <div class="fnav-section-desc">经国务院同意、中国证监会批准设立的六大合法正规场内衍生品交易场所，涵盖大宗商品、金融期权与现货交割</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="domestic_exchanges" data-search="上海期货交易所 (shfe) shfe.com.cn 天然橡胶 (ru)、合成橡胶 (br) 上市场所。提供每日结算行情、指定交割仓库库存、注册仓单日报及会员持仓龙虎榜。 天然橡胶ru 丁二烯橡胶br 仓单日报 有色金属 黄金白银 官方权威 国内权威期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #10b981;">              <i class="fas fa-building"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="上海期货交易所 (SHFE)">上海期货交易所 (SHFE)</div>              <div class="fnav-card-domain">shfe.com.cn</div>            </div>            <span class="fnav-card-badge">官方权威</span>          </div>          <div class="fnav-card-desc" title="天然橡胶 (RU)、合成橡胶 (BR) 上市场所。提供每日结算行情、指定交割仓库库存、注册仓单日报及会员持仓龙虎榜。">天然橡胶 (RU)、合成橡胶 (BR) 上市场所。提供每日结算行情、指定交割仓库库存、注册仓单日报及会员持仓龙虎榜。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#天然橡胶RU</span>
            <span class="fnav-tag-pill">#丁二烯橡胶BR</span>
            <span class="fnav-tag-pill">#仓单日报</span>
            <span class="fnav-tag-pill">#有色金属</span>
            <span class="fnav-tag-pill">#黄金白银</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.shfe.com.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.shfe.com.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="domestic_exchanges" data-search="上海国际能源交易中心 (ine) ine.cn 20号胶 (nr)、原油期货及集运欧线上市交易所。采用“国际平台、净价交易、保税交割、人民币计价”模式，境外交易者可直接参与。 20号胶nr 原油sc 保税交割 集运欧线ec 国际化品种 国内权威期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #f59e0b;">              <i class="fas fa-fire-alt"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="上海国际能源交易中心 (INE)">上海国际能源交易中心 (INE)</div>              <div class="fnav-card-domain">ine.cn</div>            </div>            <span class="fnav-card-badge">国际化品种</span>          </div>          <div class="fnav-card-desc" title="20号胶 (NR)、原油期货及集运欧线上市交易所。采用“国际平台、净价交易、保税交割、人民币计价”模式，境外交易者可直接参与。">20号胶 (NR)、原油期货及集运欧线上市交易所。采用“国际平台、净价交易、保税交割、人民币计价”模式，境外交易者可直接参与。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#20号胶NR</span>
            <span class="fnav-tag-pill">#原油SC</span>
            <span class="fnav-tag-pill">#保税交割</span>
            <span class="fnav-tag-pill">#集运欧线EC</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.ine.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.ine.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="domestic_exchanges" data-search="大连商品交易所 (dce) dce.com.cn 国内主要农产品、黑色冶金及合成树脂期货交易枢纽。涵盖铁矿石、豆粕、棕榈油、生猪及线型低密度聚乙烯等重要工业品。 铁矿石 焦煤焦炭 豆粕豆油 棕榈油 聚丙烯pp 农产/黑色/能化 国内权威期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #3b82f6;">              <i class="fas fa-cubes"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="大连商品交易所 (DCE)">大连商品交易所 (DCE)</div>              <div class="fnav-card-domain">dce.com.cn</div>            </div>            <span class="fnav-card-badge">农产/黑色/能化</span>          </div>          <div class="fnav-card-desc" title="国内主要农产品、黑色冶金及合成树脂期货交易枢纽。涵盖铁矿石、豆粕、棕榈油、生猪及线型低密度聚乙烯等重要工业品。">国内主要农产品、黑色冶金及合成树脂期货交易枢纽。涵盖铁矿石、豆粕、棕榈油、生猪及线型低密度聚乙烯等重要工业品。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#铁矿石</span>
            <span class="fnav-tag-pill">#焦煤焦炭</span>
            <span class="fnav-tag-pill">#豆粕豆油</span>
            <span class="fnav-tag-pill">#棕榈油</span>
            <span class="fnav-tag-pill">#聚丙烯PP</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.dce.com.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.dce.com.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="domestic_exchanges" data-search="郑州商品交易所 (czce) czce.com.cn 新中国首家期货市场试点。纯碱、玻璃、棉花、pta、甲醇、白糖等品种定价中心，仓单有效预报与每日席位成交明细权威发布。 纯碱 玻璃 棉花pta 白糖 苹果 尿素 软商品/建材化工 国内权威期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #8b5cf6;">              <i class="fas fa-seedling"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="郑州商品交易所 (CZCE)">郑州商品交易所 (CZCE)</div>              <div class="fnav-card-domain">czce.com.cn</div>            </div>            <span class="fnav-card-badge">软商品/建材化工</span>          </div>          <div class="fnav-card-desc" title="新中国首家期货市场试点。纯碱、玻璃、棉花、PTA、甲醇、白糖等品种定价中心，仓单有效预报与每日席位成交明细权威发布。">新中国首家期货市场试点。纯碱、玻璃、棉花、PTA、甲醇、白糖等品种定价中心，仓单有效预报与每日席位成交明细权威发布。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#纯碱</span>
            <span class="fnav-tag-pill">#玻璃</span>
            <span class="fnav-tag-pill">#棉花PTA</span>
            <span class="fnav-tag-pill">#白糖</span>
            <span class="fnav-tag-pill">#苹果</span>
            <span class="fnav-tag-pill">#尿素</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.czce.com.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.czce.com.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="domestic_exchanges" data-search="广州期货交易所 (gfex) gfex.com.cn 聚焦绿色低碳与新能源新材料产业链特色衍生品，碳酸锂、工业硅期货与期权定价及指定质押交割仓储信息发布平台。 碳酸锂 工业硅 多晶硅 新能源金属 绿色新能源 国内权威期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #06b6d4;">              <i class="fas fa-bolt"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="广州期货交易所 (GFEX)">广州期货交易所 (GFEX)</div>              <div class="fnav-card-domain">gfex.com.cn</div>            </div>            <span class="fnav-card-badge">绿色新能源</span>          </div>          <div class="fnav-card-desc" title="聚焦绿色低碳与新能源新材料产业链特色衍生品，碳酸锂、工业硅期货与期权定价及指定质押交割仓储信息发布平台。">聚焦绿色低碳与新能源新材料产业链特色衍生品，碳酸锂、工业硅期货与期权定价及指定质押交割仓储信息发布平台。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#碳酸锂</span>
            <span class="fnav-tag-pill">#工业硅</span>
            <span class="fnav-tag-pill">#多晶硅</span>
            <span class="fnav-tag-pill">#新能源金属</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.gfex.com.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.gfex.com.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="domestic_exchanges" data-search="中国金融期货交易所 (cffex) cffex.com.cn 金融衍生品交易主场。涵盖沪深300/中证500/中证1000/上证50股指期货及2年/5年/10年/30年期国债期货，大类资产配置中枢。 沪深300股指 中证1000 国债期货 宏观对冲 金融衍生品 国内权威期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #ef4444;">              <i class="fas fa-chart-pie"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="中国金融期货交易所 (CFFEX)">中国金融期货交易所 (CFFEX)</div>              <div class="fnav-card-domain">cffex.com.cn</div>            </div>            <span class="fnav-card-badge">金融衍生品</span>          </div>          <div class="fnav-card-desc" title="金融衍生品交易主场。涵盖沪深300/中证500/中证1000/上证50股指期货及2年/5年/10年/30年期国债期货，大类资产配置中枢。">金融衍生品交易主场。涵盖沪深300/中证500/中证1000/上证50股指期货及2年/5年/10年/30年期国债期货，大类资产配置中枢。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#沪深300股指</span>
            <span class="fnav-tag-pill">#中证1000</span>
            <span class="fnav-tag-pill">#国债期货</span>
            <span class="fnav-tag-pill">#宏观对冲</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.cffex.com.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.cffex.com.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <section class="fnav-section" id="sec-global_exchanges" data-cat="global_exchanges">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-globe-americas"></i>        <span>国际顶级期货交易所</span>      </div>      <div class="fnav-section-desc">海外大宗商品定价基准与宏观利率风向标，全球跨国企业套期保值与宏观对冲基金主战场</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="global_exchanges" data-search="新加坡交易所 (sgx group) sgx.com 全球天然橡胶国际贸易核心基准——sicom tsr20 交易主场；富时中国 a50 指数期货与新交所铁矿石期货定价发源地。 sicom tsr20 富时中国a50 铁矿石掉期 全球橡胶标杆 国际顶级期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #059669;">              <i class="fas fa-globe-asia"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="新加坡交易所 (SGX Group)">新加坡交易所 (SGX Group)</div>              <div class="fnav-card-domain">sgx.com</div>            </div>            <span class="fnav-card-badge">全球橡胶标杆</span>          </div>          <div class="fnav-card-desc" title="全球天然橡胶国际贸易核心基准——SICOM TSR20 交易主场；富时中国 A50 指数期货与新交所铁矿石期货定价发源地。">全球天然橡胶国际贸易核心基准——SICOM TSR20 交易主场；富时中国 A50 指数期货与新交所铁矿石期货定价发源地。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#SICOM TSR20</span>
            <span class="fnav-tag-pill">#富时中国A50</span>
            <span class="fnav-tag-pill">#铁矿石掉期</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.sgx.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.sgx.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="global_exchanges" data-search="芝加哥商业交易所集团 (cme group) cmegroup.com 涵盖 cbot、nymex、comex 的全球最大衍生品交易所。wti 美原油、黄金白银、美豆玉米及美联储加息预期观测器所在地。 wti美原油 comex黄金 cbot农产品 fedwatch利率 全球最大衍生品 国际顶级期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #2563eb;">              <i class="fas fa-chart-line"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="芝加哥商业交易所集团 (CME Group)">芝加哥商业交易所集团 (CME Group)</div>              <div class="fnav-card-domain">cmegroup.com</div>            </div>            <span class="fnav-card-badge">全球最大衍生品</span>          </div>          <div class="fnav-card-desc" title="涵盖 CBOT、NYMEX、COMEX 的全球最大衍生品交易所。WTI 美原油、黄金白银、美豆玉米及美联储加息预期观测器所在地。">涵盖 CBOT、NYMEX、COMEX 的全球最大衍生品交易所。WTI 美原油、黄金白银、美豆玉米及美联储加息预期观测器所在地。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#WTI美原油</span>
            <span class="fnav-tag-pill">#COMEX黄金</span>
            <span class="fnav-tag-pill">#CBOT农产品</span>
            <span class="fnav-tag-pill">#FedWatch利率</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.cmegroup.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.cmegroup.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="global_exchanges" data-search="洲际交易所 (ice) ice.com 国际原油定价基准布伦特原油 (brent)、ice 美元指数 (dx) 及原糖、棉花、欧洲碳配额 (eua) 交易中心。 布伦特原油brent 美元指数dx 11号原糖 碳配额eua 能源外汇核心 国际顶级期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #4f46e5;">              <i class="fas fa-gem"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="洲际交易所 (ICE)">洲际交易所 (ICE)</div>              <div class="fnav-card-domain">ice.com</div>            </div>            <span class="fnav-card-badge">能源外汇核心</span>          </div>          <div class="fnav-card-desc" title="国际原油定价基准布伦特原油 (Brent)、ICE 美元指数 (DX) 及原糖、棉花、欧洲碳配额 (EUA) 交易中心。">国际原油定价基准布伦特原油 (Brent)、ICE 美元指数 (DX) 及原糖、棉花、欧洲碳配额 (EUA) 交易中心。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#布伦特原油Brent</span>
            <span class="fnav-tag-pill">#美元指数DX</span>
            <span class="fnav-tag-pill">#11号原糖</span>
            <span class="fnav-tag-pill">#碳配额EUA</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.ice.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.ice.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="global_exchanges" data-search="伦敦金属交易所 (lme) lme.com 全球工业金属现货贸易与套保定价圣地。lme 铜、铝、铅、锌、锡、镍每日官方结算价及全球交割仓库注销仓单透明披露。 lme铜 lme铝/镍/锌 全球金属仓单 注销仓单比率 有色定价圣地 国际顶级期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #d97706;">              <i class="fas fa-layer-group"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="伦敦金属交易所 (LME)">伦敦金属交易所 (LME)</div>              <div class="fnav-card-domain">lme.com</div>            </div>            <span class="fnav-card-badge">有色定价圣地</span>          </div>          <div class="fnav-card-desc" title="全球工业金属现货贸易与套保定价圣地。LME 铜、铝、铅、锌、锡、镍每日官方结算价及全球交割仓库注销仓单透明披露。">全球工业金属现货贸易与套保定价圣地。LME 铜、铝、铅、锌、锡、镍每日官方结算价及全球交割仓库注销仓单透明披露。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#LME铜</span>
            <span class="fnav-tag-pill">#LME铝/镍/锌</span>
            <span class="fnav-tag-pill">#全球金属仓单</span>
            <span class="fnav-tag-pill">#注销仓单比率</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.lme.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.lme.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="global_exchanges" data-search="香港交易及结算所 (hkex) hkex.com.hk 连接中国内地与全球资本市场的超级门户，提供恒生指数期货、恒生科技指数衍生品及美元兑离岸人民币 (usd/cnh) 期货。 恒生指数期货 恒生科技hstech 离岸人民币cnh 离岸人民币枢纽 国际顶级期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0284c7;">              <i class="fas fa-city"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="香港交易及结算所 (HKEX)">香港交易及结算所 (HKEX)</div>              <div class="fnav-card-domain">hkex.com.hk</div>            </div>            <span class="fnav-card-badge">离岸人民币枢纽</span>          </div>          <div class="fnav-card-desc" title="连接中国内地与全球资本市场的超级门户，提供恒生指数期货、恒生科技指数衍生品及美元兑离岸人民币 (USD/CNH) 期货。">连接中国内地与全球资本市场的超级门户，提供恒生指数期货、恒生科技指数衍生品及美元兑离岸人民币 (USD/CNH) 期货。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#恒生指数期货</span>
            <span class="fnav-tag-pill">#恒生科技HSTECH</span>
            <span class="fnav-tag-pill">#离岸人民币CNH</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.hkex.com.hk/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.hkex.com.hk/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="global_exchanges" data-search="日本交易所集团 (jpx / tocom / ose) jpx.co.jp 大阪交易所 (ose) 与东京商品交易所 (tocom)。亚洲历史最悠久的天然橡胶 rss3 烟胶片国际基准市场与日经225股指交易主场。 日胶rss3 大阪交易所 日经225期货 烟胶片定价 国际顶级期货交易所">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #dc2626;">              <i class="fas fa-torii-gate"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="日本交易所集团 (JPX / TOCOM / OSE)">日本交易所集团 (JPX / TOCOM / OSE)</div>              <div class="fnav-card-domain">jpx.co.jp</div>            </div>            <span class="fnav-card-badge">烟胶片定价</span>          </div>          <div class="fnav-card-desc" title="大阪交易所 (OSE) 与东京商品交易所 (TOCOM)。亚洲历史最悠久的天然橡胶 RSS3 烟胶片国际基准市场与日经225股指交易主场。">大阪交易所 (OSE) 与东京商品交易所 (TOCOM)。亚洲历史最悠久的天然橡胶 RSS3 烟胶片国际基准市场与日经225股指交易主场。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#日胶RSS3</span>
            <span class="fnav-tag-pill">#大阪交易所</span>
            <span class="fnav-tag-pill">#日经225期货</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.jpx.co.jp/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.jpx.co.jp/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <section class="fnav-section" id="sec-spot_industry" data-cat="spot_industry">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-chart-bar"></i>        <span>现货报价与产业链高频数据</span>      </div>      <div class="fnav-section-desc">现货主流成交均价、工厂开工负荷、交割仓库与社会库存周报、基差套利第一手情报</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="spot_industry" data-search="隆众资讯 (oilchem) oilchem.net 大宗商品与能源化工现货资讯权威。橡胶周度库存、中国半钢胎/全钢胎样本企业产能利用率及华东顺丁出厂价第一手来源。 全乳胶/泰混现货 青岛保税区库存 轮胎企业开工率 炼化装置 橡胶能化龙头 现货报价与产业链高频数据">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #16a34a;">              <i class="fas fa-oil-can"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="隆众资讯 (OilChem)">隆众资讯 (OilChem)</div>              <div class="fnav-card-domain">oilchem.net</div>            </div>            <span class="fnav-card-badge">橡胶能化龙头</span>          </div>          <div class="fnav-card-desc" title="大宗商品与能源化工现货资讯权威。橡胶周度库存、中国半钢胎/全钢胎样本企业产能利用率及华东顺丁出厂价第一手来源。">大宗商品与能源化工现货资讯权威。橡胶周度库存、中国半钢胎/全钢胎样本企业产能利用率及华东顺丁出厂价第一手来源。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#全乳胶/泰混现货</span>
            <span class="fnav-tag-pill">#青岛保税区库存</span>
            <span class="fnav-tag-pill">#轮胎企业开工率</span>
            <span class="fnav-tag-pill">#炼化装置</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.oilchem.net/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.oilchem.net/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="spot_industry" data-search="百川盈孚 (baiinfo) baiinfo.com 深度追踪大宗工业原料市场，提供每日现货参考报价、石化装置开工检修排期、产业链吨利差及进出口物流高频监测。 现货均价指数 厂家装置检修 上下游利润差 进出口追踪 工业原料深研 现货报价与产业链高频数据">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0ea5e9;">              <i class="fas fa-industry"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="百川盈孚 (Baiinfo)">百川盈孚 (Baiinfo)</div>              <div class="fnav-card-domain">baiinfo.com</div>            </div>            <span class="fnav-card-badge">工业原料深研</span>          </div>          <div class="fnav-card-desc" title="深度追踪大宗工业原料市场，提供每日现货参考报价、石化装置开工检修排期、产业链吨利差及进出口物流高频监测。">深度追踪大宗工业原料市场，提供每日现货参考报价、石化装置开工检修排期、产业链吨利差及进出口物流高频监测。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#现货均价指数</span>
            <span class="fnav-tag-pill">#厂家装置检修</span>
            <span class="fnav-tag-pill">#上下游利润差</span>
            <span class="fnav-tag-pill">#进出口追踪</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.baiinfo.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.baiinfo.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="spot_industry" data-search="我的钢铁网 / 钢联数据 (mysteel) mysteel.com 黑色系产业链权威平台，提供全国重点港口铁矿石库存、钢厂日均铁水产量、螺纹钢表观消费及能化品种周度平衡表。 高频港口库存 铁水产量 螺纹钢表观消费 能化农产品 黑色大宗权威 现货报价与产业链高频数据">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #ea580c;">              <i class="fas fa-hammer"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="我的钢铁网 / 钢联数据 (Mysteel)">我的钢铁网 / 钢联数据 (Mysteel)</div>              <div class="fnav-card-domain">mysteel.com</div>            </div>            <span class="fnav-card-badge">黑色大宗权威</span>          </div>          <div class="fnav-card-desc" title="黑色系产业链权威平台，提供全国重点港口铁矿石库存、钢厂日均铁水产量、螺纹钢表观消费及能化品种周度平衡表。">黑色系产业链权威平台，提供全国重点港口铁矿石库存、钢厂日均铁水产量、螺纹钢表观消费及能化品种周度平衡表。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#高频港口库存</span>
            <span class="fnav-tag-pill">#铁水产量</span>
            <span class="fnav-tag-pill">#螺纹钢表观消费</span>
            <span class="fnav-tag-pill">#能化农产品</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.mysteel.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.mysteel.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="spot_industry" data-search="卓创资讯 (sci99) sci99.com 专注于石油、化工、塑料、橡胶、有色、农产品现货价格采集与分析，国家发改委价格监测合作单位，基差核算重要参照。 橡塑制品 石油化工 农副产品 产业链供需周报 现货基准价格 现货报价与产业链高频数据">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #6366f1;">              <i class="fas fa-flask"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="卓创资讯 (Sci99)">卓创资讯 (Sci99)</div>              <div class="fnav-card-domain">sci99.com</div>            </div>            <span class="fnav-card-badge">现货基准价格</span>          </div>          <div class="fnav-card-desc" title="专注于石油、化工、塑料、橡胶、有色、农产品现货价格采集与分析，国家发改委价格监测合作单位，基差核算重要参照。">专注于石油、化工、塑料、橡胶、有色、农产品现货价格采集与分析，国家发改委价格监测合作单位，基差核算重要参照。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#橡塑制品</span>
            <span class="fnav-tag-pill">#石油化工</span>
            <span class="fnav-tag-pill">#农副产品</span>
            <span class="fnav-tag-pill">#产业链供需周报</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.sci99.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.sci99.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="spot_industry" data-search="生意社 (100ppi) 100ppi.com 提供大宗商品供需指数 (bci)、全品种现货交易均价及历史期现基差图表走势，直观展示上下游成本传导路径。 大宗商品供需指数bci 基差监控看板 价格传导链 期现基差图表 现货报价与产业链高频数据">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #8b5cf6;">              <i class="fas fa-balance-scale-right"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="生意社 (100ppi)">生意社 (100ppi)</div>              <div class="fnav-card-domain">100ppi.com</div>            </div>            <span class="fnav-card-badge">期现基差图表</span>          </div>          <div class="fnav-card-desc" title="提供大宗商品供需指数 (BCI)、全品种现货交易均价及历史期现基差图表走势，直观展示上下游成本传导路径。">提供大宗商品供需指数 (BCI)、全品种现货交易均价及历史期现基差图表走势，直观展示上下游成本传导路径。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#大宗商品供需指数BCI</span>
            <span class="fnav-tag-pill">#基差监控看板</span>
            <span class="fnav-tag-pill">#价格传导链</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.100ppi.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.100ppi.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="spot_industry" data-search="中国海关总署数据在线查询平台 customs.gov.cn 中国海关官方大宗商品进出口权威数据库。支持按 hs 编码查询天然橡胶、合成橡胶、混合胶进口量及轮胎出口目的国统计。 hs海关编码 橡胶进口量 轮胎出口金额 月度明细 官方进出口统计 现货报价与产业链高频数据">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0d9488;">              <i class="fas fa-ship"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="中国海关总署数据在线查询平台">中国海关总署数据在线查询平台</div>              <div class="fnav-card-domain">customs.gov.cn</div>            </div>            <span class="fnav-card-badge">官方进出口统计</span>          </div>          <div class="fnav-card-desc" title="中国海关官方大宗商品进出口权威数据库。支持按 HS 编码查询天然橡胶、合成橡胶、混合胶进口量及轮胎出口目的国统计。">中国海关官方大宗商品进出口权威数据库。支持按 HS 编码查询天然橡胶、合成橡胶、混合胶进口量及轮胎出口目的国统计。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#HS海关编码</span>
            <span class="fnav-tag-pill">#橡胶进口量</span>
            <span class="fnav-tag-pill">#轮胎出口金额</span>
            <span class="fnav-tag-pill">#月度明细</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://stats.customs.gov.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://stats.customs.gov.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <section class="fnav-section" id="sec-rubber_weather" data-cat="rubber_weather">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-seedling"></i>        <span>橡胶物候、海外原料与产区气象专区</span>      </div>      <div class="fnav-section-desc">聚焦天然橡胶核心基本面：泰国/印尼原料市场竞标、国际橡胶组织供需平衡表、国内外林地降雨与厄尔尼诺</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="rubber_weather" data-search="泰国中心橡胶市场 (thainr) thainr.com 泰国宋卡、素叻他尼、洛坤三大中心市场每日官方现货竞标成交价。天然橡胶现货成本最底层的绝对源头指标。 生胶片uss 田间生胶水 杯胶价格 三大中心市场 泰国原料竞拍 橡胶物候、海外原料与产区气象专区">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #10b981;">              <i class="fas fa-tree"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="泰国中心橡胶市场 (ThaiNR)">泰国中心橡胶市场 (ThaiNR)</div>              <div class="fnav-card-domain">thainr.com</div>            </div>            <span class="fnav-card-badge">泰国原料竞拍</span>          </div>          <div class="fnav-card-desc" title="泰国宋卡、素叻他尼、洛坤三大中心市场每日官方现货竞标成交价。天然橡胶现货成本最底层的绝对源头指标。">泰国宋卡、素叻他尼、洛坤三大中心市场每日官方现货竞标成交价。天然橡胶现货成本最底层的绝对源头指标。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#生胶片USS</span>
            <span class="fnav-tag-pill">#田间生胶水</span>
            <span class="fnav-tag-pill">#杯胶价格</span>
            <span class="fnav-tag-pill">#三大中心市场</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.thainr.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.thainr.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="rubber_weather" data-search="天然橡胶生产国联合会 (anrpc) anrpc.org 涵盖泰国、印尼、马来、中国、越南、印度等主产国的政府间权威组织，月度发布全球天然橡胶产销供需平衡表与预测。 全球90%产量 割胶开割面积 月度平衡表 减产预估 全球供需平衡表 橡胶物候、海外原料与产区气象专区">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #059669;">              <i class="fas fa-leaf"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="天然橡胶生产国联合会 (ANRPC)">天然橡胶生产国联合会 (ANRPC)</div>              <div class="fnav-card-domain">anrpc.org</div>            </div>            <span class="fnav-card-badge">全球供需平衡表</span>          </div>          <div class="fnav-card-desc" title="涵盖泰国、印尼、马来、中国、越南、印度等主产国的政府间权威组织，月度发布全球天然橡胶产销供需平衡表与预测。">涵盖泰国、印尼、马来、中国、越南、印度等主产国的政府间权威组织，月度发布全球天然橡胶产销供需平衡表与预测。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#全球90%产量</span>
            <span class="fnav-tag-pill">#割胶开割面积</span>
            <span class="fnav-tag-pill">#月度平衡表</span>
            <span class="fnav-tag-pill">#减产预估</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.anrpc.org/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.anrpc.org/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="rubber_weather" data-search="国际橡胶研究组织 (irsg) rubberstudy.org 联合国贸发会议下的政府间橡胶专门机构，发布全球天胶与合成橡胶宏观供需长期趋势，轮胎替换率与汽车产业需求展望。 长期替代趋势 全球轮胎配套 合成橡胶比率 国际统计 全球宏观研报 橡胶物候、海外原料与产区气象专区">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #047857;">              <i class="fas fa-globe"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="国际橡胶研究组织 (IRSG)">国际橡胶研究组织 (IRSG)</div>              <div class="fnav-card-domain">rubberstudy.org</div>            </div>            <span class="fnav-card-badge">全球宏观研报</span>          </div>          <div class="fnav-card-desc" title="联合国贸发会议下的政府间橡胶专门机构，发布全球天胶与合成橡胶宏观供需长期趋势，轮胎替换率与汽车产业需求展望。">联合国贸发会议下的政府间橡胶专门机构，发布全球天胶与合成橡胶宏观供需长期趋势，轮胎替换率与汽车产业需求展望。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#长期替代趋势</span>
            <span class="fnav-tag-pill">#全球轮胎配套</span>
            <span class="fnav-tag-pill">#合成橡胶比率</span>
            <span class="fnav-tag-pill">#国际统计</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.rubberstudy.org/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.rubberstudy.org/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="rubber_weather" data-search="中国橡胶工业协会 (cria) cria.org.cn 国内橡胶工业自律组织，统计公布中国各大轮胎生产基地月度产销存、外贸出口交货值及行业安全环保政策执行情况。 中国轮胎总产量 行业开工调查 橡胶助剂与骨架材料 下游需求协会 橡胶物候、海外原料与产区气象专区">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #2563eb;">              <i class="fas fa-truck-moving"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="中国橡胶工业协会 (CRIA)">中国橡胶工业协会 (CRIA)</div>              <div class="fnav-card-domain">cria.org.cn</div>            </div>            <span class="fnav-card-badge">下游需求协会</span>          </div>          <div class="fnav-card-desc" title="国内橡胶工业自律组织，统计公布中国各大轮胎生产基地月度产销存、外贸出口交货值及行业安全环保政策执行情况。">国内橡胶工业自律组织，统计公布中国各大轮胎生产基地月度产销存、外贸出口交货值及行业安全环保政策执行情况。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#中国轮胎总产量</span>
            <span class="fnav-tag-pill">#行业开工调查</span>
            <span class="fnav-tag-pill">#橡胶助剂与骨架材料</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.cria.org.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.cria.org.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="rubber_weather" data-search="中央气象台·橡胶产区预报 (nmc) nmc.cn 中央气象台官方频道，西双版纳与海南两大产区未来 7~15 天逐日降雨量、强对流雷阵雨预警与雷达云图直击。 云南景洪勐腊 海南白沙儋州 7天精准降雨 台风卫星云图 国内主产区 橡胶物候、海外原料与产区气象专区">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0284c7;">              <i class="fas fa-cloud-sun-rain"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="中央气象台·橡胶产区预报 (NMC)">中央气象台·橡胶产区预报 (NMC)</div>              <div class="fnav-card-domain">nmc.cn</div>            </div>            <span class="fnav-card-badge">国内主产区</span>          </div>          <div class="fnav-card-desc" title="中央气象台官方频道，西双版纳与海南两大产区未来 7~15 天逐日降雨量、强对流雷阵雨预警与雷达云图直击。">中央气象台官方频道，西双版纳与海南两大产区未来 7~15 天逐日降雨量、强对流雷阵雨预警与雷达云图直击。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#云南景洪勐腊</span>
            <span class="fnav-tag-pill">#海南白沙儋州</span>
            <span class="fnav-tag-pill">#7天精准降雨</span>
            <span class="fnav-tag-pill">#台风卫星云图</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.nmc.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.nmc.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="rubber_weather" data-search="泰国气象局 (tmd) tmd.go.th 泰国气象局官方网站，泰南核心橡胶种植府（surat thani, songkhla, trang）多普勒雷达图、季风低压与降水实况追踪。 素叻他尼雷达 宋卡雷达回波 季风降雨带 割胶天气受阻 泰南降雨雷达 橡胶物候、海外原料与产区气象专区">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0ea5e9;">              <i class="fas fa-umbrella"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="泰国气象局 (TMD)">泰国气象局 (TMD)</div>              <div class="fnav-card-domain">tmd.go.th</div>            </div>            <span class="fnav-card-badge">泰南降雨雷达</span>          </div>          <div class="fnav-card-desc" title="泰国气象局官方网站，泰南核心橡胶种植府（Surat Thani, Songkhla, Trang）多普勒雷达图、季风低压与降水实况追踪。">泰国气象局官方网站，泰南核心橡胶种植府（Surat Thani, Songkhla, Trang）多普勒雷达图、季风低压与降水实况追踪。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#素叻他尼雷达</span>
            <span class="fnav-tag-pill">#宋卡雷达回波</span>
            <span class="fnav-tag-pill">#季风降雨带</span>
            <span class="fnav-tag-pill">#割胶天气受阻</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.tmd.go.th/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.tmd.go.th/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="rubber_weather" data-search="美国国家海洋和大气管理局 (noaa enso) noaa.gov 全球气候周期总阀门。监测赤道太平洋海温异动、南方涛动指数 (soi) 与海洋厄尔尼诺指数 (oni)，影响东南亚降水周期。 厄尔尼诺 拉尼娜 南方涛动指数soi 海洋温度oni 气候总控指标 橡胶物候、海外原料与产区气象专区">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #3b82f6;">              <i class="fas fa-water"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="美国国家海洋和大气管理局 (NOAA ENSO)">美国国家海洋和大气管理局 (NOAA ENSO)</div>              <div class="fnav-card-domain">noaa.gov</div>            </div>            <span class="fnav-card-badge">气候总控指标</span>          </div>          <div class="fnav-card-desc" title="全球气候周期总阀门。监测赤道太平洋海温异动、南方涛动指数 (SOI) 与海洋厄尔尼诺指数 (ONI)，影响东南亚降水周期。">全球气候周期总阀门。监测赤道太平洋海温异动、南方涛动指数 (SOI) 与海洋厄尔尼诺指数 (ONI)，影响东南亚降水周期。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#厄尔尼诺</span>
            <span class="fnav-tag-pill">#拉尼娜</span>
            <span class="fnav-tag-pill">#南方涛动指数SOI</span>
            <span class="fnav-tag-pill">#海洋温度ONI</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.cpc.ncep.noaa.gov/products/analysis_monitoring/enso_advisory/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <section class="fnav-section" id="sec-macro_capital" data-cat="macro_capital">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-coins"></i>        <span>宏观流动性、资金持仓与重磅指标</span>      </div>      <div class="fnav-section-desc">CFTC持仓变动、美联储降息预期、交易所持仓龙虎榜、全球宏观日历与原油商业库存</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="macro_capital" data-search="东方财富网·期货数据中心 eastmoney.com 国内最详尽的期货盘后龙虎榜追踪。每日汇总前20大主力席位（永安、中信、国泰君安等）净多空头寸变化及仓单日报。 席位多空持仓 永安/中信头寸 交易所仓单 基差历史 持仓龙虎榜 宏观流动性、资金持仓与重磅指标">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #f97316;">              <i class="fas fa-list-ol"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="东方财富网·期货数据中心">东方财富网·期货数据中心</div>              <div class="fnav-card-domain">eastmoney.com</div>            </div>            <span class="fnav-card-badge">持仓龙虎榜</span>          </div>          <div class="fnav-card-desc" title="国内最详尽的期货盘后龙虎榜追踪。每日汇总前20大主力席位（永安、中信、国泰君安等）净多空头寸变化及仓单日报。">国内最详尽的期货盘后龙虎榜追踪。每日汇总前20大主力席位（永安、中信、国泰君安等）净多空头寸变化及仓单日报。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#席位多空持仓</span>
            <span class="fnav-tag-pill">#永安/中信头寸</span>
            <span class="fnav-tag-pill">#交易所仓单</span>
            <span class="fnav-tag-pill">#基差历史</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://data.eastmoney.com/ifdata/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://data.eastmoney.com/ifdata/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="macro_capital" data-search="cftc 美国商品期货委员会 (cot 持仓) cftc.gov 每周五发布全球对冲基金在美原油、美铜、农产品及外汇期货上的多空仓位分布，全球宏观对冲与趋势跟踪核心依据。 非商业净多头 对冲基金managed money 商业套保商 周报 全球投机风向 宏观流动性、资金持仓与重磅指标">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #059669;">              <i class="fas fa-file-contract"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="CFTC 美国商品期货委员会 (COT 持仓)">CFTC 美国商品期货委员会 (COT 持仓)</div>              <div class="fnav-card-domain">cftc.gov</div>            </div>            <span class="fnav-card-badge">全球投机风向</span>          </div>          <div class="fnav-card-desc" title="每周五发布全球对冲基金在美原油、美铜、农产品及外汇期货上的多空仓位分布，全球宏观对冲与趋势跟踪核心依据。">每周五发布全球对冲基金在美原油、美铜、农产品及外汇期货上的多空仓位分布，全球宏观对冲与趋势跟踪核心依据。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#非商业净多头</span>
            <span class="fnav-tag-pill">#对冲基金Managed Money</span>
            <span class="fnav-tag-pill">#商业套保商</span>
            <span class="fnav-tag-pill">#周报</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="macro_capital" data-search="cme 美联储利率观测器 (fedwatch tool) cmegroup.com 基于 30 天联邦基金期货价格计算的下一次 fomc 会议利率调整概率，全球大宗商品资金流动性与美元走势晴雨表。 fomc议息会议 降息概率 加息路径 联邦基金期货 美元流动性 宏观流动性、资金持仓与重磅指标">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #2563eb;">              <i class="fas fa-tachometer-alt"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="CME 美联储利率观测器 (FedWatch Tool)">CME 美联储利率观测器 (FedWatch Tool)</div>              <div class="fnav-card-domain">cmegroup.com</div>            </div>            <span class="fnav-card-badge">美元流动性</span>          </div>          <div class="fnav-card-desc" title="基于 30 天联邦基金期货价格计算的下一次 FOMC 会议利率调整概率，全球大宗商品资金流动性与美元走势晴雨表。">基于 30 天联邦基金期货价格计算的下一次 FOMC 会议利率调整概率，全球大宗商品资金流动性与美元走势晴雨表。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#FOMC议息会议</span>
            <span class="fnav-tag-pill">#降息概率</span>
            <span class="fnav-tag-pill">#加息路径</span>
            <span class="fnav-tag-pill">#联邦基金期货</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.cmegroup.com/markets/interest-rates/cme-fedwatch-tool.html')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="macro_capital" data-search="金十数据 (jin10) jin10.com 极具时效性的全球财经实时快讯与宏观财经日历，重大非农、cpi、地缘政治异动毫秒级推送与实时解读。 全球宏观日历 重磅突发 央行决议 实时快讯 7x24快讯 宏观流动性、资金持仓与重磅指标">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #eab308;">              <i class="fas fa-bolt"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="金十数据 (Jin10)">金十数据 (Jin10)</div>              <div class="fnav-card-domain">jin10.com</div>            </div>            <span class="fnav-card-badge">7x24快讯</span>          </div>          <div class="fnav-card-desc" title="极具时效性的全球财经实时快讯与宏观财经日历，重大非农、CPI、地缘政治异动毫秒级推送与实时解读。">极具时效性的全球财经实时快讯与宏观财经日历，重大非农、CPI、地缘政治异动毫秒级推送与实时解读。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#全球宏观日历</span>
            <span class="fnav-tag-pill">#重磅突发</span>
            <span class="fnav-tag-pill">#央行决议</span>
            <span class="fnav-tag-pill">#实时快讯</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.jin10.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.jin10.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="macro_capital" data-search="trading economics (全球宏观日历) tradingeconomics.com 涵盖全球 196 个国家的历史 gdp、通胀率、进出口与制造业 pmi，支持长达 30 年的大宗商品长周期历史图表对照。 196国经济指标 长周期gdp/cpi pmi调查 大宗图库 跨国宏观数据库 宏观流动性、资金持仓与重磅指标">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #6366f1;">              <i class="fas fa-calendar-alt"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="Trading Economics (全球宏观日历)">Trading Economics (全球宏观日历)</div>              <div class="fnav-card-domain">tradingeconomics.com</div>            </div>            <span class="fnav-card-badge">跨国宏观数据库</span>          </div>          <div class="fnav-card-desc" title="涵盖全球 196 个国家的历史 GDP、通胀率、进出口与制造业 PMI，支持长达 30 年的大宗商品长周期历史图表对照。">涵盖全球 196 个国家的历史 GDP、通胀率、进出口与制造业 PMI，支持长达 30 年的大宗商品长周期历史图表对照。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#196国经济指标</span>
            <span class="fnav-tag-pill">#长周期GDP/CPI</span>
            <span class="fnav-tag-pill">#PMI调查</span>
            <span class="fnav-tag-pill">#大宗图库</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://tradingeconomics.com/calendar" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://tradingeconomics.com/calendar')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="macro_capital" data-search="美国能源信息署 (eia) eia.gov 每周三晚公布美国商业原油库存、战略石油储备 (spr) 及炼厂开工率周报，全球化工品与顺丁/合成橡胶源头成本之锚。 eia每周三周报 库欣库存 原油产量与进出口 汽油柴油 原油商业库存 宏观流动性、资金持仓与重磅指标">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0d9488;">              <i class="fas fa-gas-pump"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="美国能源信息署 (EIA)">美国能源信息署 (EIA)</div>              <div class="fnav-card-domain">eia.gov</div>            </div>            <span class="fnav-card-badge">原油商业库存</span>          </div>          <div class="fnav-card-desc" title="每周三晚公布美国商业原油库存、战略石油储备 (SPR) 及炼厂开工率周报，全球化工品与顺丁/合成橡胶源头成本之锚。">每周三晚公布美国商业原油库存、战略石油储备 (SPR) 及炼厂开工率周报，全球化工品与顺丁/合成橡胶源头成本之锚。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#EIA每周三周报</span>
            <span class="fnav-tag-pill">#库欣库存</span>
            <span class="fnav-tag-pill">#原油产量与进出口</span>
            <span class="fnav-tag-pill">#汽油柴油</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.eia.gov/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.eia.gov/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <section class="fnav-section" id="sec-regulation_safety" data-cat="regulation_safety">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-shield-alt"></i>        <span>监管合规与账户资金安全</span>      </div>      <div class="fnav-section-desc">国家级监管机构、统一交易结算账单查询、全国统一开户平台与行业自律管理</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="regulation_safety" data-search="中国证券监督管理委员会 (csrc) csrc.gov.cn 中国资本市场与衍生品市场的国家最高行政监管部门，审批期货新品种上市，发布期货交易管理法规与风险警示。 政策法规 新品种上市审批 合规监管公示 证监会令 国家最高监管 监管合规与账户资金安全">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #dc2626;">              <i class="fas fa-landmark"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="中国证券监督管理委员会 (CSRC)">中国证券监督管理委员会 (CSRC)</div>              <div class="fnav-card-domain">csrc.gov.cn</div>            </div>            <span class="fnav-card-badge">国家最高监管</span>          </div>          <div class="fnav-card-desc" title="中国资本市场与衍生品市场的国家最高行政监管部门，审批期货新品种上市，发布期货交易管理法规与风险警示。">中国资本市场与衍生品市场的国家最高行政监管部门，审批期货新品种上市，发布期货交易管理法规与风险警示。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#政策法规</span>
            <span class="fnav-tag-pill">#新品种上市审批</span>
            <span class="fnav-tag-pill">#合规监管公示</span>
            <span class="fnav-tag-pill">#证监会令</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.csrc.gov.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.csrc.gov.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="regulation_safety" data-search="中国期货市场监控中心 (cfmmc) cfmmc.com 官方唯一合法投资者期货对账单查询系统。保障客户保证金安全存管，提供每日交易确认单、资金余额与持仓明细权威校验。 每日结算账单 保证金安全存管 统一开户云平台 权威对账 账单安全查询 监管合规与账户资金安全">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #16a34a;">              <i class="fas fa-user-shield"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="中国期货市场监控中心 (CFMMC)">中国期货市场监控中心 (CFMMC)</div>              <div class="fnav-card-domain">cfmmc.com</div>            </div>            <span class="fnav-card-badge">账单安全查询</span>          </div>          <div class="fnav-card-desc" title="官方唯一合法投资者期货对账单查询系统。保障客户保证金安全存管，提供每日交易确认单、资金余额与持仓明细权威校验。">官方唯一合法投资者期货对账单查询系统。保障客户保证金安全存管，提供每日交易确认单、资金余额与持仓明细权威校验。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#每日结算账单</span>
            <span class="fnav-tag-pill">#保证金安全存管</span>
            <span class="fnav-tag-pill">#统一开户云平台</span>
            <span class="fnav-tag-pill">#权威对账</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.cfmmc.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.cfmmc.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="regulation_safety" data-search="中国期货业协会 (cfa) cfachina.org 中国期货行业的全国性自律组织。公示全国期货公司分类评价结果、合规诚信档案、从业人员资质及大宗商品市场年报。 期货公司评级公示 从业资格注册 行业统计年报 投资者教育 行业自律管理 监管合规与账户资金安全">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #2563eb;">              <i class="fas fa-users-cog"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="中国期货业协会 (CFA)">中国期货业协会 (CFA)</div>              <div class="fnav-card-domain">cfachina.org</div>            </div>            <span class="fnav-card-badge">行业自律管理</span>          </div>          <div class="fnav-card-desc" title="中国期货行业的全国性自律组织。公示全国期货公司分类评价结果、合规诚信档案、从业人员资质及大宗商品市场年报。">中国期货行业的全国性自律组织。公示全国期货公司分类评价结果、合规诚信档案、从业人员资质及大宗商品市场年报。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#期货公司评级公示</span>
            <span class="fnav-tag-pill">#从业资格注册</span>
            <span class="fnav-tag-pill">#行业统计年报</span>
            <span class="fnav-tag-pill">#投资者教育</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="http://www.cfachina.org/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('http://www.cfachina.org/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="regulation_safety" data-search="国际期货业协会 (fia) fia.org 全球期货、期权和集中清算衍生品交易主要行业组织，发布全球交易所年度与月度成交量排名及跨境监管规则分析。 全球交易所成交排行 衍生品清算规则 行业技术白皮书 国际衍生品组织 监管合规与账户资金安全">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #6366f1;">              <i class="fas fa-globe"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="国际期货业协会 (FIA)">国际期货业协会 (FIA)</div>              <div class="fnav-card-domain">fia.org</div>            </div>            <span class="fnav-card-badge">国际衍生品组织</span>          </div>          <div class="fnav-card-desc" title="全球期货、期权和集中清算衍生品交易主要行业组织，发布全球交易所年度与月度成交量排名及跨境监管规则分析。">全球期货、期权和集中清算衍生品交易主要行业组织，发布全球交易所年度与月度成交量排名及跨境监管规则分析。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#全球交易所成交排行</span>
            <span class="fnav-tag-pill">#衍生品清算规则</span>
            <span class="fnav-tag-pill">#行业技术白皮书</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.fia.org/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.fia.org/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <section class="fnav-section" id="sec-tools_quant" data-cat="tools_quant">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-toolbox"></i>        <span>投研工具、量化数据与专属看板</span>      </div>      <div class="fnav-section-desc">Python开源数据API、本站定制实盘套利测算器、风控凯利仓位模型与物候日历看板</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="tools_quant" data-search="akshare 财经开源数据接口库 akshare.akfamily.xyz 国内广受好评的 python 金融开源数据工具库，轻量免注册抓取各大交易所历史行情、持仓排名、交割仓单及外盘商品数据。 python接口 全市场期货日线/分时 仓单库存接口 完全开源免费 开源量化首选 投研工具、量化数据与专属看板">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0ea5e9;">              <i class="fab fa-python"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="AkShare 财经开源数据接口库">AkShare 财经开源数据接口库</div>              <div class="fnav-card-domain">akshare.akfamily.xyz</div>            </div>            <span class="fnav-card-badge">开源量化首选</span>          </div>          <div class="fnav-card-desc" title="国内广受好评的 Python 金融开源数据工具库，轻量免注册抓取各大交易所历史行情、持仓排名、交割仓单及外盘商品数据。">国内广受好评的 Python 金融开源数据工具库，轻量免注册抓取各大交易所历史行情、持仓排名、交割仓单及外盘商品数据。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#Python接口</span>
            <span class="fnav-tag-pill">#全市场期货日线/分时</span>
            <span class="fnav-tag-pill">#仓单库存接口</span>
            <span class="fnav-tag-pill">#完全开源免费</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://akshare.akfamily.xyz/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://akshare.akfamily.xyz/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="tools_quant" data-search="tushare 金融大数据开放社区 tushare.pro 面向金融量化爱好者的标准数据平台，提供期货标准日线、主力连续合约、基差走势与宏观指标的高质量 api。 大宗商品行情 量化回测 积分接口api 高校机构生态 量化投研社区 投研工具、量化数据与专属看板">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #f59e0b;">              <i class="fas fa-database"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="Tushare 金融大数据开放社区">Tushare 金融大数据开放社区</div>              <div class="fnav-card-domain">tushare.pro</div>            </div>            <span class="fnav-card-badge">量化投研社区</span>          </div>          <div class="fnav-card-desc" title="面向金融量化爱好者的标准数据平台，提供期货标准日线、主力连续合约、基差走势与宏观指标的高质量 API。">面向金融量化爱好者的标准数据平台，提供期货标准日线、主力连续合约、基差走势与宏观指标的高质量 API。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#大宗商品行情</span>
            <span class="fnav-tag-pill">#量化回测</span>
            <span class="fnav-tag-pill">#积分接口API</span>
            <span class="fnav-tag-pill">#高校机构生态</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://tushare.pro/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://tushare.pro/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="tools_quant" data-search="【本站专属】期货基差与价差套利测算器 rubbertale tools 本博客研发的专业级期现套利在线工具。自动调取 mysql 实盘行情，快速测算仓单交割无套利线、利息仓储杂费与年化 irr。 现货基差 跨期价差 年化升贴水 全持有交割利润 自动调取mysql实盘 投研工具、量化数据与专属看板">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #10b981;">              <i class="fas fa-balance-scale"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="【本站专属】期货基差与价差套利测算器">【本站专属】期货基差与价差套利测算器</div>              <div class="fnav-card-domain">RubberTale Tools</div>            </div>            <span class="fnav-card-badge">自动调取MySQL实盘</span>          </div>          <div class="fnav-card-desc" title="本博客研发的专业级期现套利在线工具。自动调取 MySQL 实盘行情，快速测算仓单交割无套利线、利息仓储杂费与年化 IRR。">本博客研发的专业级期现套利在线工具。自动调取 MySQL 实盘行情，快速测算仓单交割无套利线、利息仓储杂费与年化 IRR。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#现货基差</span>
            <span class="fnav-tag-pill">#跨期价差</span>
            <span class="fnav-tag-pill">#年化升贴水</span>
            <span class="fnav-tag-pill">#全持有交割利润</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="/tools/arbitrage-calc/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('/tools/arbitrage-calc/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="tools_quant" data-search="【本站专属】持仓盈亏比与凯利仓位计算器 rubbertale tools 期货资金风控量化引擎。自动带入当日实盘收盘价，提供多空盈亏比评估、保本胜率、凯利模型防爆仓手数及 5 连败回撤测算。 数学期望ev 全/半凯利公式 固定风险仓位 回撤压力测试 自动调取mysql实盘 投研工具、量化数据与专属看板">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #2563eb;">              <i class="fas fa-calculator"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="【本站专属】持仓盈亏比与凯利仓位计算器">【本站专属】持仓盈亏比与凯利仓位计算器</div>              <div class="fnav-card-domain">RubberTale Tools</div>            </div>            <span class="fnav-card-badge">自动调取MySQL实盘</span>          </div>          <div class="fnav-card-desc" title="期货资金风控量化引擎。自动带入当日实盘收盘价，提供多空盈亏比评估、保本胜率、凯利模型防爆仓手数及 5 连败回撤测算。">期货资金风控量化引擎。自动带入当日实盘收盘价，提供多空盈亏比评估、保本胜率、凯利模型防爆仓手数及 5 连败回撤测算。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#数学期望EV</span>
            <span class="fnav-tag-pill">#全/半凯利公式</span>
            <span class="fnav-tag-pill">#固定风险仓位</span>
            <span class="fnav-tag-pill">#回撤压力测试</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="/tools/position-calculator/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('/tools/position-calculator/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="tools_quant" data-search="【本站专属】橡胶产区气象与割胶物候看板 rubbertale tools 国内外五大主产区全年割胶物候与落叶开割周期对比看板，集成未来7天降雨预报与连续暴雨减产情景交互模拟。 西双版纳/海南/泰南 割胶日历 7天精准降水 减产情景模拟 物候与气象模型 投研工具、量化数据与专属看板">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #059669;">              <i class="fas fa-calendar-alt"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="【本站专属】橡胶产区气象与割胶物候看板">【本站专属】橡胶产区气象与割胶物候看板</div>              <div class="fnav-card-domain">RubberTale Tools</div>            </div>            <span class="fnav-card-badge">物候与气象模型</span>          </div>          <div class="fnav-card-desc" title="国内外五大主产区全年割胶物候与落叶开割周期对比看板，集成未来7天降雨预报与连续暴雨减产情景交互模拟。">国内外五大主产区全年割胶物候与落叶开割周期对比看板，集成未来7天降雨预报与连续暴雨减产情景交互模拟。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#西双版纳/海南/泰南</span>
            <span class="fnav-tag-pill">#割胶日历</span>
            <span class="fnav-tag-pill">#7天精准降水</span>
            <span class="fnav-tag-pill">#减产情景模拟</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="/tools/rubber-weather-calendar/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('/tools/rubber-weather-calendar/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="tools_quant" data-search="【本站专属】研报数据与平衡表比对提取器 rubbertale tools 供需平衡表与高频库存数据多期变动自动对齐、环比差值高亮与投研异动速报一键生成。 供需平衡表比对 高频库存对齐 环比差值高亮 异动速报一键生成 投研数据核算 投研工具、量化数据与专属看板">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #8b5cf6;">              <i class="fas fa-file-invoice"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="【本站专属】研报数据与平衡表比对提取器">【本站专属】研报数据与平衡表比对提取器</div>              <div class="fnav-card-domain">RubberTale Tools</div>            </div>            <span class="fnav-card-badge">投研数据核算</span>          </div>          <div class="fnav-card-desc" title="供需平衡表与高频库存数据多期变动自动对齐、环比差值高亮与投研异动速报一键生成。">供需平衡表与高频库存数据多期变动自动对齐、环比差值高亮与投研异动速报一键生成。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#供需平衡表比对</span>
            <span class="fnav-tag-pill">#高频库存对齐</span>
            <span class="fnav-tag-pill">#环比差值高亮</span>
            <span class="fnav-tag-pill">#异动速报一键生成</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="/tools/report-data-diff/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('/tools/report-data-diff/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="tools_quant" data-search="【本站专属】powerbi 橡胶主要数据大屏 rubbertale powerbi 本站部署的 powerbi 全景交互看板，一屏穿透橡胶全产业链宏观供需、现货价格走势与进出口口径微观变动。 全球供需 进出口结构 青岛库存变动 基差历史 多维交互大屏 投研工具、量化数据与专属看板">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #eab308;">              <i class="fas fa-chart-pie"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="【本站专属】PowerBI 橡胶主要数据大屏">【本站专属】PowerBI 橡胶主要数据大屏</div>              <div class="fnav-card-domain">RubberTale PowerBI</div>            </div>            <span class="fnav-card-badge">多维交互大屏</span>          </div>          <div class="fnav-card-desc" title="本站部署的 PowerBI 全景交互看板，一屏穿透橡胶全产业链宏观供需、现货价格走势与进出口口径微观变动。">本站部署的 PowerBI 全景交互看板，一屏穿透橡胶全产业链宏观供需、现货价格走势与进出口口径微观变动。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#全球供需</span>
            <span class="fnav-tag-pill">#进出口结构</span>
            <span class="fnav-tag-pill">#青岛库存变动</span>
            <span class="fnav-tag-pill">#基差历史</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="/powerbi/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('/powerbi/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <section class="fnav-section" id="sec-trading_software" data-cat="trading_software">    <div class="fnav-section-header">      <div class="fnav-section-title">        <i class="fas fa-desktop"></i>        <span>期货行情分析终端与量化交易软件</span>      </div>      <div class="fnav-section-desc">主力期货看盘软件、日内高频快捷交易终端、CTA策略程序化研发与开源量化框架</div>    </div>    <div class="fnav-grid">
      <div class="fnav-card" data-cat="trading_software" data-search="文华财经 (wenhua / wh6 / 随身行) wenhua.com.cn 国内主流专业期货行情交易软件。界面经典、指标库丰富、支持麦语言自定义策略模型与回测，手机随身行体验极佳。 赢顺云wh6 随身行移动端 麦语言量化 多屏多周期 市场占有率最高 期货行情分析终端与量化交易软件">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #0284c7;">              <i class="fas fa-laptop"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="文华财经 (Wenhua / WH6 / 随身行)">文华财经 (Wenhua / WH6 / 随身行)</div>              <div class="fnav-card-domain">wenhua.com.cn</div>            </div>            <span class="fnav-card-badge">市场占有率最高</span>          </div>          <div class="fnav-card-desc" title="国内主流专业期货行情交易软件。界面经典、指标库丰富、支持麦语言自定义策略模型与回测，手机随身行体验极佳。">国内主流专业期货行情交易软件。界面经典、指标库丰富、支持麦语言自定义策略模型与回测，手机随身行体验极佳。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#赢顺云WH6</span>
            <span class="fnav-tag-pill">#随身行移动端</span>
            <span class="fnav-tag-pill">#麦语言量化</span>
            <span class="fnav-tag-pill">#多屏多周期</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.wenhua.com.cn/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.wenhua.com.cn/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="trading_software" data-search="博易大师 (pengbo / 掌上财富) pawaa.com 老牌经典看盘终端。软件轻巧、响应速度极快，自带独创的闪电手下单面板与期权全景多空波动率 t 型报价。 闪电手快速下单 博易大师pc 期权t型报价 轻量极速 经典老牌看盘 期货行情分析终端与量化交易软件">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #2563eb;">              <i class="fas fa-tv"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="博易大师 (PengBo / 掌上财富)">博易大师 (PengBo / 掌上财富)</div>              <div class="fnav-card-domain">pawaa.com</div>            </div>            <span class="fnav-card-badge">经典老牌看盘</span>          </div>          <div class="fnav-card-desc" title="老牌经典看盘终端。软件轻巧、响应速度极快，自带独创的闪电手下单面板与期权全景多空波动率 T 型报价。">老牌经典看盘终端。软件轻巧、响应速度极快，自带独创的闪电手下单面板与期权全景多空波动率 T 型报价。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#闪电手快速下单</span>
            <span class="fnav-tag-pill">#博易大师PC</span>
            <span class="fnav-tag-pill">#期权T型报价</span>
            <span class="fnav-tag-pill">#轻量极速</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.pawaa.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.pawaa.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="trading_software" data-search="快期 (shinnytech / qhwing) shinnytech.com 专为日内高频与炒单交易者打造的极速下单系统。支持键盘纯盲打快捷下单、极速撤单，毫秒级指令直达交易所核心。 快期v2/v3 键盘快捷报单 微秒级穿透 日内波段利器 炒手极速交易 期货行情分析终端与量化交易软件">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #ea580c;">              <i class="fas fa-bolt"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="快期 (Shinnytech / Qhwing)">快期 (Shinnytech / Qhwing)</div>              <div class="fnav-card-domain">shinnytech.com</div>            </div>            <span class="fnav-card-badge">炒手极速交易</span>          </div>          <div class="fnav-card-desc" title="专为日内高频与炒单交易者打造的极速下单系统。支持键盘纯盲打快捷下单、极速撤单，毫秒级指令直达交易所核心。">专为日内高频与炒单交易者打造的极速下单系统。支持键盘纯盲打快捷下单、极速撤单，毫秒级指令直达交易所核心。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#快期V2/V3</span>
            <span class="fnav-tag-pill">#键盘快捷报单</span>
            <span class="fnav-tag-pill">#微秒级穿透</span>
            <span class="fnav-tag-pill">#日内波段利器</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.shinnytech.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.shinnytech.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="trading_software" data-search="交易开拓者 (tradeblazer / tbquant) tradeblazer.net 国内历史悠久的专业期货量化交易平台。支持复杂多品种多周期组合策略研发、全自动化无人值守实盘风控与执行。 tb语言策略开发 多合约组合回测 自动跟单风控 机构级cta 专业cta量化 期货行情分析终端与量化交易软件">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #7c3aed;">              <i class="fas fa-code-branch"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="交易开拓者 (TradeBlazer / TBQuant)">交易开拓者 (TradeBlazer / TBQuant)</div>              <div class="fnav-card-domain">tradeblazer.net</div>            </div>            <span class="fnav-card-badge">专业CTA量化</span>          </div>          <div class="fnav-card-desc" title="国内历史悠久的专业期货量化交易平台。支持复杂多品种多周期组合策略研发、全自动化无人值守实盘风控与执行。">国内历史悠久的专业期货量化交易平台。支持复杂多品种多周期组合策略研发、全自动化无人值守实盘风控与执行。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#TB语言策略开发</span>
            <span class="fnav-tag-pill">#多合约组合回测</span>
            <span class="fnav-tag-pill">#自动跟单风控</span>
            <span class="fnav-tag-pill">#机构级CTA</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.tradeblazer.net/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.tradeblazer.net/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
      <div class="fnav-card" data-cat="trading_software" data-search="vn.py 企业级开源量化交易框架 vnpy.com 基于 python 开发的企业级开源量化交易系统。提供各期货交易所官方 ctp 接口直连、cta 策略引擎、分布式回测与实盘交易。 ctp柜台直连 python3开发 多策略引擎 完全开源自主可控 开源python生态 期货行情分析终端与量化交易软件">        <div>          <div class="fnav-card-top">            <div class="fnav-card-icon" style="background: #059669;">              <i class="fab fa-python"></i>            </div>            <div class="fnav-card-meta">              <div class="fnav-card-name" title="VN.PY 企业级开源量化交易框架">VN.PY 企业级开源量化交易框架</div>              <div class="fnav-card-domain">vnpy.com</div>            </div>            <span class="fnav-card-badge">开源Python生态</span>          </div>          <div class="fnav-card-desc" title="基于 Python 开发的企业级开源量化交易系统。提供各期货交易所官方 CTP 接口直连、CTA 策略引擎、分布式回测与实盘交易。">基于 Python 开发的企业级开源量化交易系统。提供各期货交易所官方 CTP 接口直连、CTA 策略引擎、分布式回测与实盘交易。</div>          <div class="fnav-card-tags">
            <span class="fnav-tag-pill">#CTP柜台直连</span>
            <span class="fnav-tag-pill">#Python3开发</span>
            <span class="fnav-tag-pill">#多策略引擎</span>
            <span class="fnav-tag-pill">#完全开源自主可控</span>
          </div>        </div>        <div class="fnav-card-footer">          <a href="https://www.vnpy.com/" target="_blank" rel="noopener noreferrer" class="fnav-btn-link" title="在新标签页访问官网">            <span>直达官网</span> <i class="fas fa-external-link-alt" style="font-size: 11px;"></i>          </a>          <button type="button" class="fnav-btn-copy" onclick="copyFNavUrl('https://www.vnpy.com/')" title="复制链接地址">            <i class="far fa-copy"></i> <span>复制网址</span>          </button>        </div>      </div>
    </div>  </section>
  <div class="fnav-empty-state" id="fnav-empty">
    <i class="fas fa-search-minus"></i>
    <div class="fnav-empty-title">未找到与关键词匹配的站点</div>
    <div class="fnav-empty-hint">请尝试更换检索词，例如：橡胶、原油、持仓、交易所、开工率、API...</div>
  </div>
  <div class="fnav-toast" id="fnav-toast">
    <i class="fas fa-check-circle" style="color: #34d399;"></i>
    <span id="fnav-toast-msg">已成功复制网址到剪贴板</span>
  </div>
</div>

<script>
let currentCategory = 'all';
let currentSearchQuery = '';

function filterFNavCategory(catId, btn) {
  currentCategory = catId;
  
  // 更新 Tabs 按钮激活样式
  const buttons = document.querySelectorAll('.fnav-tab-btn');
  buttons.forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');

  applyFNavFilters();
}

function handleFNavSearch(query) {
  currentSearchQuery = (query || '').trim().toLowerCase();
  
  const clearBtn = document.getElementById('fnav-search-clear');
  if (clearBtn) {
    clearBtn.style.display = currentSearchQuery.length > 0 ? 'block' : 'none';
  }

  applyFNavFilters();
}

function clearFNavSearch() {
  const input = document.getElementById('fnav-search-input');
  if (input) {
    input.value = '';
    input.focus();
  }
  handleFNavSearch('');
}

function applyFNavFilters() {
  const cards = document.querySelectorAll('.fnav-card');
  const sections = document.querySelectorAll('.fnav-section');
  const emptyState = document.getElementById('fnav-empty');
  let totalVisible = 0;

  sections.forEach(sec => {
    const secCat = sec.getAttribute('data-cat');
    let sectionHasVisibleCard = false;

    // 如果当前选了具体分类且不是本分类，整个板块直接隐藏
    if (currentCategory !== 'all' && currentCategory !== secCat) {
      sec.style.display = 'none';
      return;
    }

    const secCards = sec.querySelectorAll('.fnav-card');
    secCards.forEach(card => {
      const cardSearchData = (card.getAttribute('data-search') || '').toLowerCase();
      
      const matchCategory = (currentCategory === 'all' || currentCategory === secCat);
      const matchSearch = (!currentSearchQuery || cardSearchData.includes(currentSearchQuery));

      if (matchCategory && matchSearch) {
        card.style.display = 'flex';
        sectionHasVisibleCard = true;
        totalVisible++;
      } else {
        card.style.display = 'none';
      }
    });

    if (sectionHasVisibleCard) {
      sec.style.display = 'flex';
    } else {
      sec.style.display = 'none';
    }
  });

  if (emptyState) {
    emptyState.style.display = (totalVisible === 0) ? 'flex' : 'none';
  }
}

function copyFNavUrl(url) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(url).then(() => {
      showToast('已复制网址：' + url);
    }).catch(() => {
      fallbackCopy(url);
    });
  } else {
    fallbackCopy(url);
  }
}

function fallbackCopy(url) {
  const textArea = document.createElement('textarea');
  textArea.value = url;
  textArea.style.position = 'fixed';
  textArea.style.opacity = '0';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  try {
    document.execCommand('copy');
    showToast('已复制网址：' + url);
  } catch (err) {
    showToast('网址：' + url);
  }
  document.body.removeChild(textArea);
}

function showToast(msg) {
  const toast = document.getElementById('fnav-toast');
  const msgEl = document.getElementById('fnav-toast-msg');
  if (toast && msgEl) {
    msgEl.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window.__toastTimer);
    window.__toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2200);
  }
}
</script>
