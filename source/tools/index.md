---
title: 实用小工具箱 (Tools & Dashboards)
date: 2026-08-27 09:50:00
aside: false
---

<style>
/* 强制内容区域全宽与精致间距 */
#content-inner {
  max-width: 100% !important;
  width: 100% !important;
  padding: 0 16px !important;
}
#page {
  width: 100% !important;
  padding: 15px 0 !important;
}
.tools-quick-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin: 15px 0 30px 0;
  padding: 12px 16px;
  background: rgba(125, 125, 125, 0.06);
  border: 1px solid rgba(125, 125, 125, 0.15);
  border-radius: 12px;
}
.quick-nav-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 20px;
  background: var(--btn-bg, #49b1f5);
  color: #fff !important;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none !important;
  transition: all 0.2s ease-in-out;
}
.quick-nav-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(73, 177, 245, 0.35);
  filter: brightness(1.08);
}
.category-intro {
  color: #888;
  font-size: 13.5px;
  margin: -6px 0 16px 2px;
  line-height: 1.6;
}
.flink-list-item {
  width: calc(25% - 15px) !important;
}
@media screen and (max-width: 1200px) {
  .flink-list-item { width: calc(33.333% - 15px) !important; }
}
@media screen and (max-width: 768px) {
  .flink-list-item { width: calc(50% - 15px) !important; }
}
@media screen and (max-width: 500px) {
  .flink-list-item { width: 100% !important; }
}
</style>

欢迎来到「橡胶童话」实用小工具箱！这里集成了期货量化投研模型、天然橡胶全产业数据、产区物候与高精气象预报、前沿 AI 生产力应用及历史人文交互图谱。

<div class="tools-quick-nav">
  <a href="#期货量化与投研分析" class="quick-nav-pill">📈 期货量化投研</a>
  <a href="#全品种全历史日-k-线深研" class="quick-nav-pill">📊 11品种日K复盘</a>
  <a href="#橡胶产业与现货数据" class="quick-nav-pill">🌲 橡胶产业数据</a>
  <a href="#产区物候、气象与卫星遥感" class="quick-nav-pill">🌦️ 产区物候气象</a>
  <a href="#ai-智能与创意工坊" class="quick-nav-pill">🤖 AI与创意工坊</a>
  <a href="#历史地理与时空图谱" class="quick-nav-pill">🗺️ 历史地理图谱</a>
  <a href="#休闲互动与社区交流" class="quick-nav-pill">🎮 休闲与社区</a>
</div>

## 📈 期货量化与投研分析
<p class="category-intro">全市场活跃商品期货量化策略盯市跟踪、多因子胜率打分、产业链配对套利、资金仓位管理及权威投研资讯导航。</p>

<div class="flink">
  <div class="flink-list">
    <div class="flink-list-item">
      <a href="/tools/strategy-tracker/" title="多品种次日触发量化跟踪器" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:activity.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="多品种次日触发量化跟踪器">
        </div>
        <div class="flink-item-name">多品种次日触发量化跟踪器</div>
        <div class="flink-item-desc">全市场43个活跃商品期货品种胜率多因子打分，次日ATR波动突破触发进场，逐日盯市净值与盈亏曲线自动跟踪。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/arb-tracker/" title="商品套利策略综合看板" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:git-compare-arrows.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="商品套利策略综合看板">
        </div>
        <div class="flink-item-name">商品套利策略综合看板</div>
        <div class="flink-item-desc">产业链配对套利矩阵（6组主流配对）与全市场期限结构展期对冲（Carry Trade）综合前向跟踪平台。市场中性对冲，逐日盯市记账。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/strategy-backtest-2026/" title="2026年度次日触发策略历史回测报告" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:chart-candlestick.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="2026年度策略历史回测报告">
        </div>
        <div class="flink-item-name">2026年度策略历史回测报告</div>
        <div class="flink-item-desc">2026年1月至8月全市场43个商品期货严谨历史回测复盘：160个交易日114笔交易深度剖析、逐月收益、板块贡献与全量交易流水。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/arb-backtest/" title="套利策略历史回测 BU/LU" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:history.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="套利策略历史回测">
        </div>
        <div class="flink-item-name">套利策略历史回测 BU/LU</div>
        <div class="flink-item-desc">同参数在 2020–2026 历史行情上的复盘：5.7 年 25 笔、胜率 76%、净 +1843 元/吨、成本占比 6.8%。这是事后检验，与实时跟踪器分开看。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/kline-combo/" title="全品种 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:layout-dashboard.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="全品种 K 线复盘">
        </div>
        <div class="flink-item-name">全品种 K 线复盘综合看板</div>
        <div class="flink-item-desc">RU 橡胶 / NR 20号胶 / AL 沪铝 / CU 沪铜 / RB 螺纹 / EB 苯乙烯 / AU 沪金 / AG 沪银 / I 铁矿 / TA PTA / M 豆粕 十一品种全历史日 K 线复盘，集成切换对比与阶段深度解读。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/arbitrage-calc/" title="基差与价差套利测算器" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:scale.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="基差与价差套利测算器">
        </div>
        <div class="flink-item-name">基差与价差套利测算器</div>
        <div class="flink-item-desc">天然橡胶、20号胶与顺丁橡胶期现基差、月间价差及全持有成本交割套利在线测算（每日自动同步 MySQL 实盘行情）。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/position-calculator/" title="持仓盈亏比与凯利仓位计算器" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:calculator.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="持仓盈亏比与凯利仓位计算器">
        </div>
        <div class="flink-item-name">持仓盈亏比与凯利仓位计算器</div>
        <div class="flink-item-desc">期货量化资金管理利器，支持自动调取实盘主力收盘价，含多空盈亏比、全/半凯利公式与极端回撤测算。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/report-data-diff/" title="研报数据与平衡表比对提取器" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:file-diff.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="研报数据与平衡表比对提取器">
        </div>
        <div class="flink-item-name">研报数据与平衡表比对提取器</div>
        <div class="flink-item-desc">供需平衡表与高频库存数据多期变动自动对齐、环比差值高亮与投研异动速报一键生成。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/fed-data-card/" title="美联储利率预期 · 数据口径卡" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:percent.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="美联储利率预期">
        </div>
        <div class="flink-item-name">美联储利率预期数据卡</div>
        <div class="flink-item-desc">基于亚特兰大联储市场概率追踪器（SOFR 期权）的加息／不变／降息三分法历史序列：873 个交易日 × 27 个参考季度，附完整数据口径。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/futures-nav/" title="期货大宗商品投研导航" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:compass.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="期货大宗商品投研导航">
        </div>
        <div class="flink-item-name">期货大宗商品投研导航</div>
        <div class="flink-item-desc">全网最全期货投研导航：六大交易所、高频现货报价、橡胶物候气象、CFTC持仓与量化看盘软件一站式检索。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="https://qhkch.com/" title="奇货可查 · 期货大数据分析平台" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:chart-column-increasing.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="奇货可查">
        </div>
        <div class="flink-item-name">奇货可查</div>
        <div class="flink-item-desc">专注于商品期货量化与持仓深度分析平台，提供主力合约席位多空持仓透视、席位四象图与资金沉淀监控。</div>
      </a>
    </div>
  </div>
</div>

### 📊 全品种全历史日 K 线深研
<p class="category-intro">单品种全景全历史日 K 线，回溯上市至今数千个交易日，划分经典牛熊周期与事件标签，点开即看大图与走势深度解读。</p>

<div class="flink">
  <div class="flink-list">
    <div class="flink-list-item">
      <a href="/tools/ru-main-kline/" title="RU 橡胶主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:chart-candlestick.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="RU 全历史 K 线">
        </div>
        <div class="flink-item-name">RU 橡胶全历史 K 线</div>
        <div class="flink-item-desc">2005 年至今五千多个交易日的橡胶主力日 K，自动划分十九段行情；点图上的标签即可展开该阶段的走势解读。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/nr-main-kline/" title="NR 20号胶主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:candlestick-chart.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="NR 全历史 K 线">
        </div>
        <div class="flink-item-name">NR 20号胶全历史 K 线</div>
        <div class="flink-item-desc">2019 年上市至今 1700 多个交易日的 20 号胶主力日 K，划分二十六段行情；从挂牌起步、疫情大底到 EUDR 与产能天花板。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/al-main-kline/" title="AL 沪铝主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:chart-no-axes-candlestick.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="AL 全历史 K 线">
        </div>
        <div class="flink-item-name">AL 沪铝全历史 K 线</div>
        <div class="flink-item-desc">2005 年至今五千多个交易日的沪铝主力日 K，划分四十八段行情；从商品超级周期、金融危机到产能天花板与新能源需求。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/cu-main-kline/" title="CU 沪铜主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:line-chart.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="CU 全历史 K 线">
        </div>
        <div class="flink-item-name">CU 沪铜全历史 K 线</div>
        <div class="flink-item-desc">2005 年至今五千多个交易日的沪铜主力日 K，划分四十一段行情；从国储逼空、金融危机历史低点到十万元突破与 AI 金属叙事。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/rb-main-kline/" title="RB 螺纹钢主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:anvil.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="RB 全历史 K 线">
        </div>
        <div class="flink-item-name">RB 螺纹钢全历史 K 线</div>
        <div class="flink-item-desc">2009 年上市至今 4200 多个交易日的螺纹钢主力日 K，划分三十一段行情；从四万亿基建、1618 白菜价长夜到双碳 6208 历史天花板。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/eb-main-kline/" title="EB 苯乙烯主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:flask-conical.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="EB 全历史 K 线">
        </div>
        <div class="flink-item-name">EB 苯乙烯全历史 K 线</div>
        <div class="flink-item-desc">2019 年上市至今 1600 多个交易日的苯乙烯主力日 K，划分十九段行情；从挂牌起步、疫情深坑、德州极寒到大炼化产能出清。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/au-main-kline/" title="AU 沪金主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:coins.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="AU 全历史 K 线">
        </div>
        <div class="flink-item-name">AU 沪金全历史 K 线</div>
        <div class="flink-item-desc">2008 年上市至今 4500 多个交易日的沪金主力日 K，划分二十五段行情；从次贷海啸、十年大牛市到去美元化与千元历史神话。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/ag-main-kline/" title="AG 沪银主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:gem.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="AG 全历史 K 线">
        </div>
        <div class="flink-item-name">AG 沪银全历史 K 线</div>
        <div class="flink-item-desc">2012 年上市至今近 3500 个交易日的沪银主力日 K，划分二十段行情；从三年长熊、散户逼空大战到光伏银浆与实物交割超级逼空。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/i-main-kline/" title="I 铁矿石主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:pickaxe.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="I 全历史 K 线">
        </div>
        <div class="flink-item-name">I 铁矿石全历史 K 线</div>
        <div class="flink-item-desc">2013 年上市至今 3100 多个交易日的铁矿石主力日 K，划分三十五段行情；从 282 极寒底、供给侧暴利、淡水河谷溃坝到地产减量博弈。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/ta-main-kline/" title="TA PTA主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:atom.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="TA 全历史 K 线">
        </div>
        <div class="flink-item-name">TA PTA全历史 K 线</div>
        <div class="flink-item-desc">2006 年上市至今 4800 多个交易日的 PTA 主力日 K，划分三十五段行情；从次贷大熊、12400 棉花联动大牛市到民营大炼化产能重构。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/m-main-kline/" title="M 豆粕主力全历史日 K 线复盘" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:sprout.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="M 全历史 K 线">
        </div>
        <div class="flink-item-name">M 豆粕全历史 K 线</div>
        <div class="flink-item-desc">2005 年上市至今近 5300 个交易日的豆粕主力日 K，划分三十八段行情；从南美旱灾大牛市、非洲猪瘟、中美贸易摩擦到丰产压制。</div>
      </a>
    </div>
  </div>
</div>

## 🌲 橡胶产业与现货数据
<p class="category-intro">立足天然橡胶与合成胶全产业链，收录海内外主流贸易商名录、上期所交割品牌标准及核心宏观供需动态大屏。</p>

<div class="flink">
  <div class="flink-list">
    <div class="flink-list-item">
      <a href="/tools/rubber-traders/" title="全球与中国主流橡胶贸易商名录" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:handshake.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="全球与中国主流橡胶贸易商名录">
        </div>
        <div class="flink-item-name">橡胶贸易商名录大全</div>
        <div class="flink-item-desc">全面收录全球与中国主流橡胶贸易商、跨国种植商、期货风险管理期现商、综合商社及石化巨头，支持多维网格陈列与业务模式透视。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/delivery-brands/" title="橡胶期货交割注册品牌大全" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:stamp.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="橡胶期货交割注册品牌大全">
        </div>
        <div class="flink-item-name">橡胶交割品牌与升贴水标准</div>
        <div class="flink-item-desc">全面收录上期所 RU、上期能源 NR（含非洲替代品）与 BR 顺丁橡胶官方注册交割品牌与升贴水速查手册。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/powerbi/" title="橡胶主要数据图表看板" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:pie-chart.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="橡胶主要数据图表看板">
        </div>
        <div class="flink-item-name">橡胶主要数据图表 (PowerBI)</div>
        <div class="flink-item-desc">整合中国橡胶工业协会、海关总署及交易所数据，提供全产业链进出口、社会库存、轮胎开工率等多维动态交互看板。</div>
      </a>
    </div>
  </div>
</div>

## 🌦️ 产区物候、气象与卫星遥感
<p class="category-intro">聚焦全球橡胶核心种植带，结合德国气象局数值模拟与主产区实时气象监测，提供割胶物候日历、短临强降水与卫星遥感云系追踪。</p>

<div class="flink">
  <div class="flink-list">
    <div class="flink-list-item">
      <a href="/tools/rubber-weather-calendar/" title="橡胶产区气象与割胶物候看板" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:cloud-sun-rain.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="橡胶产区气象与割胶物候看板">
        </div>
        <div class="flink-item-name">橡胶产区气象与割胶物候看板</div>
        <div class="flink-item-desc">西双版纳、海南、泰南、越南与印尼主产区全年割胶物候对比、未来7天降水预报与减产模拟。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/rubber/weather_forecast/" title="重点资源区域卫星云图观察" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:satellite.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="重点资源区域卫星云图观察">
        </div>
        <div class="flink-item-name">重点资源区域卫星云图观察</div>
        <div class="flink-item-desc">基于德国气象局 DWD ICON 13km 高精模型，逐 2 小时跟踪东南亚、中国、西非等六大关键产区降水云系演变与指标联动。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="https://www.nmc.cn/publish/forecast/AYN/jinghong.html" title="云南景洪 7 天降雨预报" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:cloud-rain.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="景洪降雨预报">
        </div>
        <div class="flink-item-name">景洪市降水预报 · 中央气象台</div>
        <div class="flink-item-desc">西双版纳州府所在地未来 7 天逐日天气预报、精细化降水概率与小时级雷达回波动态。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="https://www.nmc.cn/publish/forecast/AYN/zuola.html" title="云南勐腊 7 天降雨预报" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:cloud-rain.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="勐腊降雨预报">
        </div>
        <div class="flink-item-name">勐腊县降水预报 · 中央气象台</div>
        <div class="flink-item-desc">中国天然橡胶核心核心产区勐腊县气象局权威预报，监控晨间降水与雨冲胶对胶乳收购影响。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="https://www.nmc.cn/publish/forecast/AHI/baisha.html" title="海南白沙 7 天降雨预报" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:cloud-rain.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="海南白沙降雨">
        </div>
        <div class="flink-item-name">海南白沙降水预报 · 中央气象台</div>
        <div class="flink-item-desc">海南橡胶核心种植基地白沙黎族自治县气象预警，跟踪热带低压、台风风雨及雨日停割情况。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="https://www.nmc.cn/publish/forecast/AHI/zuozhou.html" title="海南儋州 7 天降雨预报" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:cloud-rain.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="海南儋州降雨">
        </div>
        <div class="flink-item-name">海南儋州降水预报 · 中央气象台</div>
        <div class="flink-item-desc">海南天然橡胶重要集散地儋州天气预报，提供湿度、风速预报及开割适宜度评估。</div>
      </a>
    </div>
  </div>
</div>

## 🤖 AI 智能与创意工坊
<p class="category-intro">基于前沿多模态大语言模型与扩散生成技术的站内知识库、精准公文创作、专业简历设计与音视频多媒体工具。</p>

<div class="flink">
  <div class="flink-list">
    <div class="flink-list-item">
      <a href="/tools/blog-chat/" title="问问这个博客 · 站内问答助手" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:message-circle-question.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="问问这个博客">
        </div>
        <div class="flink-item-name">问问这个博客 (AI 助手)</div>
        <div class="flink-item-desc">直接向博客提问：基于站内数百篇原创文章，深度解答橡胶投研、大宗商品、宏观地缘与 AI 观察。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/article-craft/" title="WriteBuddy · 公文智匠" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:feather.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="WriteBuddy · 公文智匠">
        </div>
        <div class="flink-item-name">WriteBuddy · 写作智匠</div>
        <div class="flink-item-desc">党政公文规范与小说文学创作工作台：顶部设定总指令，草稿划选实现精确顶点修改，AI智能审校建言。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/resume/" title="智能简历工坊" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:file-text.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="智能简历工坊">
        </div>
        <div class="flink-item-name">智能简历工坊</div>
        <div class="flink-item-desc">专业在线简历制作工具，支持多款高颜值排版、一键单页适配、实时预览与高清 PDF/图片导出。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/edge-tts/" title="语音智坊 · 神经语音合成工坊" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:mic.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="语音智坊">
        </div>
        <div class="flink-item-name">语音智坊 (Edge-TTS)</div>
        <div class="flink-item-desc">免费、无限量的微软高品质神经语音合成工具：支持晓晓、云扬、云希等多种自然音色，支持语速微调与一键导出高质 MP3。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/pic-6varieties/" title="AI 人像写真工坊" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:camera.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="AI 人像写真工坊">
        </div>
        <div class="flink-item-name">AI 人像写真工坊</div>
        <div class="flink-item-desc">上传一张个人肖像，一键生成职场、时尚、街拍、艺术等 6 种不同风格的高清摄影写真。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/comic-avatar/" title="AI 漫画头像工坊" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:sparkles.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="AI 漫画头像工坊">
        </div>
        <div class="flink-item-name">AI 漫画头像工坊</div>
        <div class="flink-item-desc">上传自拍或肖像，多模态大模型智能提取面容神态，FLUX.1 扩散引擎秒级定制 7 种风格漫画头像。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/tools/reverse-app/" title="文本倒序转换器" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:repeat.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="文本倒序转换器">
        </div>
        <div class="flink-item-name">文本倒序转换器</div>
        <div class="flink-item-desc">轻量文本小工具，一键将任意输入的文本或长字符串进行反向倒序排列输出。</div>
      </a>
    </div>
  </div>
</div>

## 🗺️ 历史地理与时空图谱
<p class="category-intro">跨越千年的时空坐标轴与欧洲王权地缘政治演变交互图谱，以宏大视野透视历史长河中的秩序重组与地缘博弈。</p>

<div class="flink">
  <div class="flink-list">
    <div class="flink-list-item">
      <a href="/roman/" title="罗马历史演进交互地图" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:map-pin.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="罗马历史地图">
        </div>
        <div class="flink-item-name">罗马历史演进交互地图</div>
        <div class="flink-item-desc">从台伯河畔王政城邦到横跨欧亚非的地中海大帝国，交互式滑动时间轴洞察千年疆域变迁与行省扩张。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/world-history/" title="世界文明史横向对照地图" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:globe.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="世界史对照地图">
        </div>
        <div class="flink-item-name">世界文明史横向对照地图</div>
        <div class="flink-item-desc">全球各大主要文明与帝国兴衰历程时空对照表，一目了然看清同一时期华夏、地中海、近东与欧陆演进进程。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/royal-genealogy/" title="欧洲王室世系血统谱系" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:crown.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="欧洲王室谱系">
        </div>
        <div class="flink-item-name">欧洲王室世系血统图谱</div>
        <div class="flink-item-desc">详尽梳理欧洲哈布斯堡、波旁、金雀花等主要王族世系血统网络与跨国联姻地缘政治传承。</div>
      </a>
    </div>
  </div>
</div>

## 🎮 休闲互动与社区交流
<p class="category-intro">在严肃投研与高强度代码之余的放松角落，包含站外自由交流讨论区与复古经典轻量网页小游戏。</p>

<div class="flink">
  <div class="flink-list">
    <div class="flink-list-item">
      <a href="https://pkuai.run.place/forum/" title="燕园叽喳 · 论坛讨论区" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:messages-square.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="燕园叽喳">
        </div>
        <div class="flink-item-name">燕园叽喳 · 论坛讨论区</div>
        <div class="flink-item-desc">大家一起聊天的地方。博客之外的自由讨论区：与文章互补的随口闲谈、读者交流与思想碰撞。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/games/" title="经典小游戏工坊" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:gamepad-2.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="经典小游戏工坊">
        </div>
        <div class="flink-item-name">经典小游戏工坊</div>
        <div class="flink-item-desc">集合俄罗斯方块、商品危机模拟、K线对战等数款极简耐玩的复古网页小游戏，劳逸结合。</div>
      </a>
    </div>
    <div class="flink-list-item">
      <a href="/sponsor/" title="赞赏支持作者" target="_blank">
        <div class="flink-item-icon">
          <img src="https://api.iconify.design/lucide:coffee.svg" onerror='this.onerror=null;this.src="/img/friend_404.gif"' alt="赞赏支持">
        </div>
        <div class="flink-item-name">赞赏支持</div>
        <div class="flink-item-desc">如果您觉得本博客的文章、投研模型与实用小工具对您有所启发或帮助，欢迎请作者喝一杯咖啡。</div>
      </a>
    </div>
  </div>
</div>
