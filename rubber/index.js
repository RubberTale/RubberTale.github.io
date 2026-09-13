const THEME = {
    blue: '#6fa8ff',
    blueBg: 'rgba(111, 168, 255, 0.22)',
    cyan: '#70d4ff',
    gold: '#c9a45e',
    goldBg: 'rgba(201, 164, 94, 0.22)',
    green: '#4ecb92',
    greenBg: 'rgba(78, 203, 146, 0.2)',
    red: '#ea6d75',
    redBg: 'rgba(234, 109, 117, 0.18)',
    gridLines: 'rgba(166, 186, 214, 0.08)',
    textMuted: '#8da1bd',
    textMain: '#edf3ff'
};

const COLORS = [THEME.gold, THEME.blue, THEME.green, THEME.red, '#8c7df2', THEME.cyan];
let raotMeta = null;
let selectedRaotType = 'Field Latex';
let aiSummaryText = '正在读取边际情况...';
let aiSummaryUnlocked = false;
let quoteRefreshTimer = null;
let initialQuoteFocusApplied = false;
let agriUreaEnsoChartInstance = null;
let agriUreaEnsoNinoChartInstance = null;
let iodDmiChartInstance = null;
let tradeFlowChartInstances = {};
let agriUreaEnsoData = null;
let agriUreaEnsoMode = 'indexed';
let agriUreaEnsoWindow = 'all';
let agriUreaEnsoControlsBound = false;
let siteRefreshPollTimer = null;
let siteRefreshReloading = false;
const AI_SUMMARY_PASSWORD = 'shenqihao';
const AI_SUMMARY_UNLOCK_KEY = 'macroRubberAiSummaryUnlocked';
const QUOTE_REFRESH_MS = 30000;
const SITE_REFRESH_POLL_MS = 5000;
const SITE_REFRESH_PENDING_KEY = 'macroRubberManualRefreshPending';
const NITROGEN_FRAMEWORK = [
    {
        label: '玉米',
        key: 'corn',
        nKgPerTon: 21.9,
        rigidity: 92,
        pressureNote: '高成本压力',
        rigidityNote: '高刚性',
    },
    {
        label: '白糖',
        key: 'sugar',
        nKgPerTon: 20.7,
        rigidity: 76,
        pressureNote: '中高成本压力',
        rigidityNote: '中高',
    },
    {
        label: '天胶',
        key: 'rubber',
        nKgPerTon: 66.7,
        rigidity: 58,
        pressureNote: '中高成本压力',
        rigidityNote: '中等滞后',
    },
    {
        label: '棕榈油',
        key: 'palm_oil',
        nKgPerTon: 27.6,
        rigidity: 52,
        pressureNote: '中等成本压力',
        rigidityNote: '钾肥联动',
    },
];
const RAOT_PRODUCT_BRIEFS = {
    'Field Latex': {
        title: '胶水FieldLatex',
        form: '割胶后直接收集的鲜乳胶，最接近原料端即时供需与天气扰动。',
        role: '处在产业链最上游，价格和成交量最能反映收胶强弱与现货紧张度。',
        signal: '适合观察短周期现货张力，是判断原料端是否先于期货走强的核心锚点。'
    },
    'Cup lump (DRC 100%)': {
        title: '杯凝胶CupLump',
        form: '树杯内自然凝固形成的块状胶，含水和杂质更高，属于偏初级原料。',
        role: '更能反映收胶意愿、基层供给与初加工利润，对成本底部更敏感。',
        signal: '适合看低端原料供给是否宽松，量价走弱往往先指向原料端压力释放。'
    },
    'Ribbed smoked sheet3': {
        title: 'RSS3烟片胶',
        form: '凝固后压片并烘烟处理的标准化片胶，品质更稳定，可贸易性更强。',
        role: '与出口、标准品定价和期现体系联系更紧，国际比较价值更高。',
        signal: '适合看标准品估值与外盘联动，价格强弱对出口预期和替代价差更敏感。'
    },
    'Unsmoked sheet': {
        title: 'USS生胶片',
        form: '未熏烟的片胶，处于鲜乳胶向标准片胶过渡的初加工阶段。',
        role: '兼具原料属性和初加工属性，能反映加工利润与供给转换效率。',
        signal: '适合观察原料向标准品传导是否顺畅，常用于验证加工环节是否扩产接货。'
    },
    Crepe: {
        title: '绉片胶Crepe',
        form: '经清洗、压绉形成的片状胶，分级较细，终端用途更具结构性。',
        role: '价格和成交量更容易受到细分需求、品质偏好和订单结构影响。',
        signal: '适合看结构性需求冷热，不宜简单等同主流大宗胶种的方向判断。'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    refreshEmbeddedDashboards(selectedRaotType);
    configureCharts();
    initAgriUreaEnsoControls();
    document.getElementById('last-update').textContent = new Date().toLocaleString('zh-CN');
    fetchData();
    fetchAgriUreaEnso(false);
    fetchRaotMeta();
    fetchEnsoMeta();
    fetchIodMeta();
    fetchWeatherMeta();
    fetchWeatherMapMeta();
    fetchDomesticInventory();
    fetchDomesticFuturesSeasonality();
    fetchRubberTradeFlow();
    initAiSummaryGate();
    fetchAiSummary();
    initWeatherModule();
    initSiteRefreshControls();
    startQuoteAutoRefresh();

    document.getElementById('refresh-quotes-btn').addEventListener('click', () => {
        const container = document.getElementById('futures-ticker-container');
        container.innerHTML = '<div class="loading-spinner">Updating...</div>';
        fetchQuotes();
    });

    const navItems = document.querySelectorAll('.nav-menu li');
    const navTargets = [
        null,
        'module-agri-urea-enso',
        'module-thai-supply',
        'module-enso',
        'module-weather',
        'module-thai',
        'module-trade-flow',
        'module-inventory',
        'module-kline',
        'module-volume-seasonal',
        'module-af'
    ];
    navItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            navItems.forEach((node) => node.classList.remove('active'));
            item.classList.add('active');

            if (index === 0) {
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const target = document.getElementById(navTargets[index]);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
});

function startQuoteAutoRefresh() {
    if (quoteRefreshTimer) window.clearInterval(quoteRefreshTimer);
    quoteRefreshTimer = window.setInterval(fetchQuotes, QUOTE_REFRESH_MS);
}

function initSiteRefreshControls() {
    const button = document.getElementById('site-refresh-btn');
    if (!button) return;
    button.addEventListener('click', startManualSiteRefresh);
    fetchSiteRefreshStatus(true);
}

function setSiteRefreshStatus(text, tone = '') {
    const status = document.getElementById('site-refresh-status');
    if (!status) return;
    status.textContent = text;
    status.dataset.tone = tone;
}

function setSiteRefreshBusy(isBusy) {
    const button = document.getElementById('site-refresh-btn');
    if (!button) return;
    button.disabled = isBusy;
    button.textContent = isBusy ? '刷新中' : '主动刷新';
}

async function startManualSiteRefresh() {
    const password = window.prompt('请输入刷新密码');
    if (password === null) return;
    if (!password.trim()) {
        setSiteRefreshStatus('请输入有效密码', 'warning');
        return;
    }

    setSiteRefreshBusy(true);
    setSiteRefreshStatus('正在提交云端刷新任务...', 'loading');
    try {
        const response = await fetch('/api/site-refresh/start', {
            method: 'POST',
            cache: 'no-store',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || result.ok === false) {
            throw new Error(result.error || result.message || '刷新任务提交失败');
        }
        window.sessionStorage.setItem(SITE_REFRESH_PENDING_KEY, '1');
        setSiteRefreshStatus(result.message || '刷新任务已启动', 'loading');
        pollSiteRefreshStatus();
    } catch (error) {
        console.warn('Manual site refresh failed:', error);
        setSiteRefreshBusy(false);
        setSiteRefreshStatus(error.message || '刷新接口不可用', 'danger');
    }
}

function pollSiteRefreshStatus() {
    if (siteRefreshPollTimer) window.clearInterval(siteRefreshPollTimer);
    fetchSiteRefreshStatus(false);
    siteRefreshPollTimer = window.setInterval(() => fetchSiteRefreshStatus(false), SITE_REFRESH_POLL_MS);
}

async function fetchSiteRefreshStatus(silent = false) {
    try {
        const response = await fetch(`/api/site-refresh/status?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('status unavailable');
        const status = await response.json();
        renderSiteRefreshStatus(status, silent);
    } catch (error) {
        if (!silent) {
            setSiteRefreshBusy(false);
            setSiteRefreshStatus('刷新状态读取失败', 'warning');
        }
    }
}

function renderSiteRefreshStatus(status = {}, silent = false) {
    const state = status.state || 'idle';
    const updatedAt = status.updated_at ? ` · ${status.updated_at}` : '';
    if (state === 'queued' || state === 'running') {
        setSiteRefreshBusy(true);
        setSiteRefreshStatus(`${status.message || '云端刷新执行中'}${updatedAt}`, 'loading');
        if (!siteRefreshPollTimer) pollSiteRefreshStatus();
        return;
    }

    setSiteRefreshBusy(false);
    if (siteRefreshPollTimer) {
        window.clearInterval(siteRefreshPollTimer);
        siteRefreshPollTimer = null;
    }

    if (state === 'success') {
        setSiteRefreshStatus(`${status.message || '最近刷新完成'}${updatedAt}`, 'success');
        if (window.sessionStorage.getItem(SITE_REFRESH_PENDING_KEY) === '1' && !siteRefreshReloading) {
            siteRefreshReloading = true;
            window.sessionStorage.removeItem(SITE_REFRESH_PENDING_KEY);
            window.setTimeout(() => {
                const nextUrl = new URL(window.location.href);
                nextUrl.searchParams.set('refresh', String(Date.now()));
                window.location.replace(nextUrl.toString());
            }, 1200);
        }
        return;
    }

    if (state === 'failed') {
        window.sessionStorage.removeItem(SITE_REFRESH_PENDING_KEY);
        setSiteRefreshStatus(`${status.message || '最近刷新失败'}${updatedAt}`, 'danger');
        return;
    }

    if (!silent) setSiteRefreshStatus('暂无手动刷新任务', '');
}

async function fetchWeatherMapMeta() {
    const dateNodes = document.querySelectorAll('[data-weather-map-date]');
    if (!dateNodes.length) return;

    try {
        const response = await fetch(`weather_assets/soil_maps/weather_map_metadata.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('weather map metadata unavailable');
        const meta = await response.json();
        dateNodes.forEach((node) => {
            const key = node.dataset.weatherMapDate;
            const date = meta[key]?.date;
            if (date) node.textContent = date;
        });
        const version = encodeURIComponent(meta.updated_at?.value || meta.cpc_soil?.date || Date.now());
        document.querySelectorAll('img[src^="weather_assets/soil_maps/"]').forEach((image) => {
            const src = image.getAttribute('src') || '';
            const cleanSrc = src.split('?')[0];
            image.setAttribute('src', `${cleanSrc}?v=${version}`);
        });
    } catch (error) {
        console.warn('Weather map metadata load failed:', error);
    }
}

async function fetchAgriUreaEnso(forceRefresh = false) {
    const status = document.getElementById('agri-enso-status');
    const setStatus = (text, tone = '') => {
        if (!status) return;
        status.textContent = text;
        status.dataset.tone = tone;
    };

    if (forceRefresh) {
        try {
            setStatus('正在拉取 ChoiceAPI、World Bank 和 NOAA CPC 最新数据...', 'loading');
            const response = await fetch('/api/agri-urea-enso/refresh', {
                method: 'POST',
                cache: 'no-store'
            });
            if (!response.ok) throw new Error('本地刷新接口不可用');
            const result = await response.json();
            if (result.ok === false) throw new Error(result.error || '刷新失败');
        } catch (error) {
            console.warn('Agri/urea/ENSO live refresh unavailable:', error);
            setStatus('本地刷新接口不可用，展示最近一次生成的静态底稿。', 'warning');
        }
    }

    try {
        const response = await fetch(`agri_urea_enso/data.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('agri_urea_enso/data.json not found');
        const data = await response.json();
        renderAgriUreaEnso(data);
    } catch (error) {
        console.error('Error fetching agri/urea/ENSO data:', error);
        setStatus('农产品/尿素/ENSO 模块读取失败，请先运行 update_agri_urea_enso.py。', 'danger');
    }
}

function renderAgriUreaEnso(data) {
    const chart = document.getElementById('agri-enso-chart');
    const status = document.getElementById('agri-enso-status');
    const specs = document.getElementById('agri-enso-specs');
    const latest = document.getElementById('agri-enso-latest');
    agriUreaEnsoData = data;

    setUpdateBadge('agri-enso-updated', data.updated_at);

    if (chart && data.chart?.png) {
        chart.src = `${data.chart.png}?v=${Date.now()}`;
    }
    if (status) {
        const ureaDate = data.latest?.urea?.date || data.latest?.urea?.month || '--';
        const quoteDate = data.domestic_latest_quote_date || data.domestic_latest_trade_date || '--';
        const curveDate = data.domestic_latest_trade_date || '--';
        status.textContent = [
            `商品最新价至 ${quoteDate}`,
            `曲线底稿至 ${curveDate}`,
            `尿素日频至 ${ureaDate}`,
            `ENSO官方月频至 ${data.official_complete_month || '--'}`
        ].join('；');
        status.dataset.tone = getAgriFreshnessTone(data);
    }
    if (specs) {
        specs.innerHTML = renderSpecPills([
            `更新：${formatDateOnly(data.updated_at)}`,
            `最新价：${data.domestic_latest_quote_date || data.domestic_latest_trade_date || '--'}`,
            `曲线：${data.domestic_latest_trade_date || '--'}`,
            `尿素：${data.latest?.urea?.date || data.latest?.urea?.month || '--'}`,
            `ENSO：${data.official_complete_month || '--'}`,
        ]);
    }
    if (latest) {
        const items = [
            ['玉米', data.latest?.corn],
            ['棕榈油', data.latest?.palm_oil],
            ['白糖', data.latest?.sugar],
            ['天胶', data.latest?.rubber],
            ['尿素', data.latest?.urea],
            ['Nino3.4', data.latest?.nino34],
        ];
        latest.innerHTML = items.map(([label, item]) => renderAgriMetric(label, item)).join('');
    }
    renderAgriUreaEnsoInteractiveChart();
    renderNitrogenFramework(data.latest || {});
}

function getAgriFreshnessTone(data) {
    const freshnessDate = data?.domestic_latest_quote_date || data?.domestic_latest_trade_date;
    if (!freshnessDate) return 'warning';
    const latestDate = new Date(`${freshnessDate}T00:00:00`);
    if (Number.isNaN(latestDate.getTime())) return '';
    const now = new Date();
    const diffDays = (now - latestDate) / (24 * 60 * 60 * 1000);
    return diffDays > 7 ? 'warning' : '';
}

function initAgriUreaEnsoControls() {
    if (agriUreaEnsoControlsBound) return;
    agriUreaEnsoControlsBound = true;

    document.querySelectorAll('[data-agri-chart-mode]').forEach((button) => {
        button.addEventListener('click', () => {
            agriUreaEnsoMode = button.dataset.agriChartMode || 'indexed';
            updateAgriUreaEnsoControls();
            renderAgriUreaEnsoInteractiveChart();
        });
    });

    document.querySelectorAll('[data-agri-chart-window]').forEach((button) => {
        button.addEventListener('click', () => {
            agriUreaEnsoWindow = button.dataset.agriChartWindow || 'all';
            updateAgriUreaEnsoControls();
            renderAgriUreaEnsoInteractiveChart();
        });
    });

    updateAgriUreaEnsoControls();
}

function updateAgriUreaEnsoControls() {
    document.querySelectorAll('[data-agri-chart-mode]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.agriChartMode === agriUreaEnsoMode);
    });
    document.querySelectorAll('[data-agri-chart-window]').forEach((button) => {
        button.classList.toggle('is-active', button.dataset.agriChartWindow === agriUreaEnsoWindow);
    });
}

const AGRI_ENSO_SERIES = [
    {
        key: 'corn_continuous_cny_t',
        sourceKey: 'corn_continuous_cny_t_source',
        label: '玉米（代理/期货）',
        color: '#b87a27',
        unit: '元/吨折算',
        axis: 'domestic'
    },
    {
        key: 'palm_oil_continuous_cny_t',
        sourceKey: 'palm_oil_continuous_cny_t_source',
        label: '棕榈油（代理/期货）',
        color: '#2c8d7d',
        unit: '元/吨折算',
        axis: 'domestic'
    },
    {
        key: 'sugar_continuous_cny_t',
        sourceKey: 'sugar_continuous_cny_t_source',
        label: '白糖（代理/期货）',
        color: '#7357a6',
        unit: '元/吨折算',
        axis: 'domestic',
        emphasize: true
    },
    {
        key: 'rubber_continuous_cny_t',
        sourceKey: 'rubber_continuous_cny_t_source',
        label: '天胶（代理/期货）',
        color: '#4c78a8',
        unit: '元/吨折算',
        axis: 'domestic'
    },
    {
        key: 'urea_world_bank_usd_t',
        label: '国际尿素',
        color: '#c96132',
        unit: '美元/吨',
        axis: 'urea'
    }
];

const agriEnsoBandPlugin = {
    id: 'agriEnsoBands',
    beforeDatasetsDraw(chart, _args, options) {
        const rows = options?.rows || [];
        if (!rows.length) return;
        const { ctx, chartArea, scales } = chart;
        if (!chartArea || !scales.x) return;
        const labels = chart.data.labels || [];
        const width = labels.length > 1
            ? (scales.x.getPixelForValue(1) - scales.x.getPixelForValue(0))
            : chartArea.right - chartArea.left;

        ctx.save();
        rows.forEach((row, index) => {
            if (!row?.enso_band_by_nino34) return;
            const isElNino = row.enso_band_by_nino34.includes('> 0.75');
            const isLaNina = row.enso_band_by_nino34.includes('< -0.75');
            if (!isElNino && !isLaNina) return;
            const center = scales.x.getPixelForValue(index);
            const left = Math.max(chartArea.left, center - Math.abs(width) / 2);
            const right = Math.min(chartArea.right, center + Math.abs(width) / 2);
            ctx.fillStyle = isElNino ? 'rgba(219, 111, 83, 0.11)' : 'rgba(95, 178, 205, 0.12)';
            ctx.fillRect(left, chartArea.top, Math.max(1, right - left), chartArea.bottom - chartArea.top);
        });
        ctx.restore();
    }
};

const agriNinoThresholdPlugin = {
    id: 'agriNinoThresholds',
    afterDatasetsDraw(chart) {
        const { ctx, chartArea, scales } = chart;
        const yScale = scales.y;
        if (!chartArea || !yScale) return;

        const lines = [
            { value: 0.75, label: '+0.75', color: 'rgba(190, 91, 61, 0.72)' },
            { value: -0.75, label: '-0.75', color: 'rgba(54, 135, 166, 0.72)' },
            { value: 0, label: '0', color: 'rgba(73, 89, 84, 0.45)' },
        ];

        ctx.save();
        ctx.font = '11px IBM Plex Sans, sans-serif';
        lines.forEach((line) => {
            const y = yScale.getPixelForValue(line.value);
            if (y < chartArea.top || y > chartArea.bottom) return;
            ctx.setLineDash(line.value === 0 ? [] : [5, 5]);
            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.value === 0 ? 1 : 1.2;
            ctx.beginPath();
            ctx.moveTo(chartArea.left, y);
            ctx.lineTo(chartArea.right, y);
            ctx.stroke();
            ctx.setLineDash([]);
            ctx.fillStyle = line.color;
            ctx.textAlign = 'right';
            ctx.fillText(line.label, chartArea.right - 4, y - 4);
        });
        ctx.restore();
    }
};

function renderAgriUreaEnsoInteractiveChart() {
    const canvas = document.getElementById('agri-enso-interactive-chart');
    const ninoCanvas = document.getElementById('agri-enso-nino-chart');
    const fallback = document.getElementById('agri-enso-chart');
    const caption = document.getElementById('agri-enso-chart-caption');
    const rows = Array.isArray(agriUreaEnsoData?.rows) ? agriUreaEnsoData.rows : [];
    if (!canvas || !ninoCanvas || typeof Chart === 'undefined' || !rows.length) {
        if (fallback) fallback.classList.add('is-visible');
        if (canvas) canvas.classList.add('is-hidden');
        if (ninoCanvas) ninoCanvas.classList.add('is-hidden');
        if (caption) caption.textContent = '交互图加载失败，已切换为静态图兜底。';
        return;
    }

    const visibleRows = getAgriVisibleRows(rows);
    const labels = visibleRows.map((row) => row.month);
    const isIndexed = agriUreaEnsoMode === 'indexed';
    const priceDatasets = AGRI_ENSO_SERIES.map((series) => buildAgriSeriesDataset(series, visibleRows, isIndexed));

    if (agriUreaEnsoChartInstance) agriUreaEnsoChartInstance.destroy();
    fallback?.classList.remove('is-visible');
    canvas.classList.remove('is-hidden');
    ninoCanvas.classList.remove('is-hidden');

    agriUreaEnsoChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: priceDatasets
        },
        plugins: [agriEnsoBandPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            normalized: true,
            scales: buildAgriChartScales(isIndexed),
            elements: {
                line: { borderJoinStyle: 'round' }
            },
            plugins: {
                agriEnsoBands: { rows: visibleRows },
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        pointStyle: 'line',
                        padding: 14
                    }
                },
                tooltip: {
                    callbacks: {
                        title(context) {
                            return `${context[0].label} | 农产品 / 尿素 / ENSO`;
                        },
                        label(context) {
                            const dataset = context.dataset;
                            const rawValue = dataset.rawValues?.[context.dataIndex];
                            const source = dataset.sources?.[context.dataIndex];
                            const sourceText = source ? ` | ${source}` : '';
                            if (rawValue == null) return `${dataset.label}: --`;
                            if (isIndexed) {
                                return `${dataset.label}: ${formatNumber(context.parsed.y, 1)} | 实际 ${formatNumber(rawValue, dataset.unit === '美元/吨' ? 1 : 0)} ${dataset.unit}${sourceText}`;
                            }
                            return `${dataset.label}: ${formatNumber(rawValue, dataset.unit === '美元/吨' ? 1 : 0)} ${dataset.unit}${sourceText}`;
                        },
                        afterBody(context) {
                            const row = visibleRows[context[0].dataIndex];
                            return row?.enso_band_by_nino34 ? [`ENSO区间：${row.enso_band_by_nino34}`] : [];
                        }
                    }
                }
            }
        }
    });

    renderAgriNinoSubChart(visibleRows);

    if (caption) {
        const windowText = agriUreaEnsoWindow === 'all' ? '全周期' : `近${Number(agriUreaEnsoWindow) / 12}年`;
        caption.textContent = isIndexed
            ? `${windowText}相对指数视图：1982 年起，期货上市前使用 World Bank 现货代理折算，上市后切换 ChoiceAPI 国内连续期货；下图为 Nino3.4 官方月频。`
            : `${windowText}绝对价格视图：代理段按首个可用期货月缩放为元/吨折算值，期货段为 ChoiceAPI 国内连续；下图为 Nino3.4 官方月频。`;
    }
}

function renderAgriNinoSubChart(rows) {
    const canvas = document.getElementById('agri-enso-nino-chart');
    const note = document.getElementById('agri-enso-nino-note');
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = rows.map((row) => row.month);
    const rawValues = rows.map((row) => numberOrNull(row.nino34_anom_c));
    const latest = findLatestNinoRow(rows);
    if (note) {
        note.textContent = latest
            ? `官方最新 ${latest.month}: ${formatSignedNumber(latest.value, 2)}°C；未发布月份不补 0`
            : '官方月频未发布；不使用 0 或手工值';
    }

    if (agriUreaEnsoNinoChartInstance) agriUreaEnsoNinoChartInstance.destroy();
    agriUreaEnsoNinoChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [{
                label: 'Nino3.4 anomaly',
                data: rawValues,
                borderColor: '#2f8aad',
                backgroundColor: 'rgba(47, 138, 173, 0.08)',
                yAxisID: 'y',
                borderWidth: 2,
                tension: 0.24,
                spanGaps: false,
                pointRadius: rawValues.map((value, index) => (value != null && rows[index]?.month === latest?.month ? 3.5 : 1.4)),
                pointHoverRadius: 5,
                rawValues,
                unit: '°C'
            }]
        },
        plugins: [agriEnsoBandPlugin, agriNinoThresholdPlugin],
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            normalized: true,
            scales: {
                x: {
                    grid: { color: 'rgba(55, 74, 70, 0.08)' },
                    ticks: { maxTicksLimit: 12 }
                },
                y: {
                    min: -2.5,
                    max: 3,
                    title: { display: true, text: 'Nino3.4 anomaly (°C)' },
                    grid: { color: 'rgba(55, 74, 70, 0.08)' }
                }
            },
            plugins: {
                agriEnsoBands: { rows },
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title(context) {
                            return `${context[0].label} | NOAA CPC Nino3.4`;
                        },
                        label(context) {
                            const rawValue = context.dataset.rawValues?.[context.dataIndex];
                            if (rawValue == null) return 'Nino3.4: 未发布，不补 0';
                            return `Nino3.4: ${formatSignedNumber(rawValue, 2)} °C`;
                        },
                        afterBody(context) {
                            const row = rows[context[0].dataIndex];
                            return row?.enso_band_by_nino34 ? [`ENSO区间：${row.enso_band_by_nino34}`] : [];
                        }
                    }
                }
            }
        }
    });
}

function findLatestNinoRow(rows) {
    for (let index = rows.length - 1; index >= 0; index -= 1) {
        const value = numberOrNull(rows[index].nino34_anom_c);
        if (value != null) return { month: rows[index].month, value };
    }
    return null;
}

function getAgriVisibleRows(rows) {
    if (agriUreaEnsoWindow === 'all') return rows;
    const months = Number.parseInt(agriUreaEnsoWindow, 10);
    if (!Number.isFinite(months) || months <= 0) return rows;
    return rows.slice(Math.max(0, rows.length - months));
}

function buildAgriSeriesDataset(series, rows, isIndexed) {
    const rawValues = rows.map((row) => numberOrNull(row[series.key]));
    const sources = rows.map((row) => row[series.sourceKey] || '');
    const firstValid = rawValues.find((value) => value != null && value !== 0);
    const data = isIndexed
        ? rawValues.map((value) => (value == null || !firstValid ? null : (value / firstValid) * 100))
        : rawValues;
    return {
        label: series.label,
        data,
        borderColor: series.color,
        backgroundColor: 'transparent',
        yAxisID: isIndexed ? 'index' : series.axis,
        borderWidth: series.emphasize ? 3 : 2,
        tension: 0.22,
        spanGaps: true,
        pointRadius: 0,
        pointHoverRadius: series.emphasize ? 5 : 4,
        rawValues,
        sources,
        unit: series.unit
    };
}

function buildAgriChartScales(isIndexed) {
    if (isIndexed) {
        return {
            x: {
                grid: { color: 'rgba(55, 74, 70, 0.08)' },
                ticks: { maxTicksLimit: 12 }
            },
            index: {
                position: 'left',
                title: { display: true, text: '价格指数（窗口起点=100）' },
                grid: { color: 'rgba(55, 74, 70, 0.08)' }
            }
        };
    }

    return {
        x: {
            grid: { color: 'rgba(55, 74, 70, 0.08)' },
            ticks: { maxTicksLimit: 12 }
        },
        domestic: {
            position: 'left',
            title: { display: true, text: '代理折算 / 国内期货（元/吨）' },
            grid: { color: 'rgba(55, 74, 70, 0.08)' }
        },
        urea: {
            position: 'right',
            title: { display: true, text: '尿素（美元/吨）' },
            grid: { drawOnChartArea: false }
        }
    };
}

function numberOrNull(value) {
    if (value === null || value === undefined || value === '') return null;
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
}

async function fetchWeatherMeta() {
    try {
        const response = await fetch(`weather_multi_country.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load weather metadata');
        const data = await response.json();
        setUpdateBadge('weather-updated', data.updated_at);
    } catch (error) {
        console.warn('Weather metadata unavailable:', error);
        setUpdateBadge('weather-updated', '--');
    }
}

function formatDateOnly(value) {
    if (!value) return '--';
    return String(value).slice(0, 10);
}

function renderAgriMetric(label, item) {
    if (!item) {
        return `<div class="agri-enso-metric"><span>${label}</span><strong>--</strong><em>等待数据</em></div>`;
    }
    const value = typeof item.value === 'number'
        ? item.value.toLocaleString('zh-CN', { maximumFractionDigits: label === 'Nino3.4' ? 2 : 1 })
        : '--';
    const unit = item.unit || '';
    const period = item.date || item.month || '--';
    return `
        <div class="agri-enso-metric">
            <span>${label}</span>
            <strong>${value}</strong>
            <em>${period} · ${unit}</em>
        </div>
    `;
}

function renderNitrogenFramework(latest) {
    const container = document.getElementById('urea-intensity-bars');

    const rows = NITROGEN_FRAMEWORK
        .map((crop) => {
            const price = latest?.[crop.key]?.value;
            const value = typeof price === 'number' && price > 0
                ? (crop.nKgPerTon / price) * 10000
                : null;
            return { ...crop, price, value };
        })
        .filter((row) => row.value !== null)
        .sort((a, b) => b.value - a.value);

    updateNitrogenPlot(rows);
    if (!container) return;

    if (!rows.length) {
        container.innerHTML = '<div class="urea-bar-row"><span class="urea-crop">等待价格</span><div class="urea-track"><i style="width: 0%;"></i></div></div>';
        return;
    }

    const maxValue = Math.max(...rows.map((row) => row.value));
    container.innerHTML = rows.map((row) => {
        const width = Math.max(8, (row.value / maxValue) * 100);
        return `
            <div class="urea-bar-row" title="${row.label}: 单吨氮需求量 / 单吨价格，反映单位产值氮肥成本压力">
                <span class="urea-crop">${row.label}</span>
                <div class="urea-track"><i style="width: ${width.toFixed(1)}%;"></i></div>
            </div>
        `;
    }).join('');
}

function updateNitrogenPlot(rows) {
    if (!rows.length) return;
    const maxValue = Math.max(...rows.map((row) => row.value));

    rows.forEach((row) => {
        const dot = document.getElementById(`nitrogen-dot-${row.key}`);
        if (!dot) return;
        const x = 12 + ((row.value / maxValue) * 76);
        const y = 16 + ((row.rigidity / 100) * 72);
        dot.style.setProperty('--x', `${x.toFixed(1)}%`);
        dot.style.setProperty('--y', `${y.toFixed(1)}%`);
        dot.title = `${row.label}: ${row.pressureNote} / ${row.rigidityNote}`;
    });
}

function initWeatherModule() {
    const module = document.getElementById('module-weather');
    const toggle = document.getElementById('weather-toggle');
    const iframe = document.getElementById('weather-iframe');
    if (!module || !toggle || !iframe) return;

    const setExpanded = (expanded) => {
        module.classList.toggle('is-collapsed', !expanded);
        toggle.textContent = expanded ? '收起' : '展开';
        toggle.setAttribute('aria-expanded', String(expanded));
        if (expanded && !iframe.getAttribute('src')) {
            const separator = iframe.dataset.src.includes('?') ? '&' : '?';
            iframe.setAttribute('src', `${iframe.dataset.src}${separator}ts=${Date.now()}`);
        }
    };

    toggle.addEventListener('click', (event) => {
        event.stopPropagation();
        setExpanded(module.classList.contains('is-collapsed'));
    });

    module.querySelector('.card-header')?.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        setExpanded(module.classList.contains('is-collapsed'));
    });

    setExpanded(!module.classList.contains('is-collapsed'));
}

function refreshEmbeddedDashboards(typeValue = selectedRaotType) {
    const version = Date.now();
    const iframeMap = {
        'volume-seasonal-iframe': 'volume_seasonal.html',
        'kline-iframe': 'kline.html'
    };

    Object.entries(iframeMap).forEach(([id, src]) => {
        const iframe = document.getElementById(id);
        if (iframe) {
            const encodedType = encodeURIComponent(typeValue);
            iframe.src = `${src}?type=${encodedType}&v=${version}`;
            iframe.onload = () => {
                iframe.contentWindow?.postMessage({ type: 'raot-select-type', value: typeValue }, '*');
            };
        }
    });
}

async function fetchEnsoMeta() {
    try {
        const response = await fetch(`enso_meta.json?v=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to load enso_meta.json');
        const meta = await response.json();
        renderEnsoMeta(meta);
    } catch (error) {
        console.error('Error fetching ENSO meta:', error);
        const summary = document.getElementById('enso-cpc-summary');
        if (summary) summary.textContent = 'ENSO 数据读取失败，请通过官方原页核对最新诊断。';
    }
}

function renderEnsoMeta(meta) {
    const cpc = meta.cpc || {};
    const iri = meta.iri || {};
    const probability = cpc.near_term_probability ? `${cpc.near_term_probability}%` : '--';
    const probabilityLabel = cpc.probability_label || 'CPC 关键概率';
    const nino34 = cpc.nino34_weekly ? `${cpc.nino34_weekly}°C` : '--';

    setUpdateBadge('enso-updated', meta.updated_at);

    document.getElementById('enso-specs').innerHTML = renderSpecPills([
        '来源：NOAA/CPC · IRI/Columbia',
        `抓取：${meta.updated_at || '--'}`,
        `CPC 月报：${cpc.release || '--'}`,
        `IRI：${iri.release || '--'}`
    ]);
    document.getElementById('enso-alert-status').textContent = cpc.alert_status || '--';
    document.getElementById('enso-cpc-release').textContent = cpc.release || '--';
    document.getElementById('enso-probability-label').textContent = probabilityLabel;
    document.getElementById('enso-probability').textContent = probability;
    document.getElementById('enso-near-period').textContent = cpc.near_term_period || 'NOAA/CPC 近期季节窗口';
    document.getElementById('enso-nino34').textContent = nino34;
    document.getElementById('enso-iri-release').textContent = iri.release || '--';
    document.getElementById('enso-cpc-summary').textContent = cpc.synopsis || '暂无官方摘要。';
    document.getElementById('enso-iri-summary').textContent =
        `${iri.summary || ''} ${iri.probability_note || ''}`.trim() || '暂无 IRI 摘要。';
    document.getElementById('enso-weekly-nino34').textContent = nino34;
    document.getElementById('enso-sst-note').textContent =
        cpc.nino34_weekly ? `CPC 最新披露值为 ${nino34}，用于观察热带太平洋暖信号是否持续增强。` : '暂无周度海温披露值。';
    document.getElementById('enso-subsurface-note').textContent = cpc.subsurface_note || '观察暖水储备向东传播';
    document.getElementById('enso-wind-note').textContent = cpc.wind_note || '低层/高层西风异常协同验证';

    [
        ['enso-cpc-probability-image', cpc.probability_image],
        ['enso-iri-probability-image', iri.probability_image],
        ['enso-iri-technical-image', iri.technical_image]
    ].forEach(([id, url]) => {
        const image = document.getElementById(id);
        if (image && url) image.src = url;
    });
    document.getElementById('enso-cpc-link').href = cpc.discussion_url || '#';
    document.getElementById('enso-iri-link').href = iri.current_url || '#';
    document.getElementById('enso-methodology').innerHTML = (meta.methodology || [])
        .map((item) => `<span>${item}</span>`).join('');
}

async function fetchIodMeta() {
    try {
        const response = await fetch(`iod_meta.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Failed to load iod_meta.json');
        const meta = await response.json();
        renderIodMeta(meta);
    } catch (error) {
        console.warn('IOD metadata unavailable:', error);
        setText('iod-current-dmi', '--');
        setText('iod-current-phase', '等待数据');
        setText('iod-current-note', 'IOD 数据读取失败，请通过 BoM / JMA / IRI 官方原页核对。');
        setText('iod-bom-outlook', 'BoM / IRI 模型展望暂未读取。');
        setText('iod-forecast-summary', '预测层缺失时，不输出未来几个月 IOD 方向判断。');
    }
}

function renderIodMeta(meta) {
    const current = meta.current || {};
    const thresholds = meta.thresholds || {};
    const monthly = meta.monthly_crosscheck || {};
    const forecast = meta.forecast || {};
    const iri = forecast.iri || {};
    const bom = forecast.bom || {};
    const sources = meta.sources || {};
    const dmi = numberOrNull(current.dmi);
    const latestMonth = monthly.latest_month || {};
    const latestThreeMonth = monthly.latest_three_month_mean || {};
    const milestones = Array.isArray(iri.probability_milestones) ? iri.probability_milestones : [];

    setText('iod-current-dmi', dmi == null ? '--' : `${formatSignedNumber(dmi, 2)}°C`);
    setText('iod-current-window', formatIodWeekWindow(current));
    setText('iod-current-phase', current.phase_label || phaseLabelCn(current.phase));
    setText('iod-current-streak', formatIodStreak(current));
    setText('iod-jma-latest', formatIodMonthlyPoint(latestMonth));
    setText('iod-jma-3rmean', `3个月均值 ${formatIodMonthlyPoint(latestThreeMonth)}`);
    setText('iod-forecast-label', buildIodForecastHeadline(milestones));
    setText('iod-forecast-window', buildIodForecastWindow(milestones));
    setText('iod-current-note', buildIodCurrentNote(current, thresholds));
    setText('iod-bom-outlook', summarizeBomIodOutlook(bom));
    setText('iod-forecast-summary', summarizeIriIodOutlook(iri));
    setText('iod-source-note', (meta.source_notes || []).join(' ') || '数据来源：BoM 周频 DMI、JMA 月频 DMI 与 IRI/Columbia CCSR NMME 预测。');

    const bomLink = document.getElementById('iod-bom-link');
    if (bomLink) bomLink.href = bom.source_url || sources.bom_climate_driver || sources.bom_weekly_data || '#';
    const iriLink = document.getElementById('iod-iri-link');
    if (iriLink) iriLink.href = iri.source_url || sources.iri_forecast || '#';

    const forecastImage = document.getElementById('iod-forecast-image');
    if (forecastImage) {
        if (iri.image_url) {
            forecastImage.src = iri.image_url;
            forecastImage.hidden = false;
        } else {
            forecastImage.removeAttribute('src');
            forecastImage.hidden = true;
        }
    }

    renderIodProbabilityList(milestones);
    renderIodDmiChart(meta.weekly_series || [], thresholds);
}

function formatIodWeekWindow(current) {
    if (current.week_start && current.week_end) {
        return `${formatDateOnly(current.week_start)} 至 ${formatDateOnly(current.week_end)}`;
    }
    return 'BoM 周频';
}

function phaseLabelCn(phase) {
    return {
        positive: '正 IOD',
        negative: '负 IOD',
        neutral: '中性',
    }[phase] || '--';
}

function formatIodStreak(current) {
    const streak = Number(current.threshold_streak_weeks || 0);
    if (current.phase === 'positive' || current.phase === 'negative') {
        return streak > 0 ? `连续 ${streak} 周越过 ±0.4°C 阈值` : '刚越过阈值，待连续性确认';
    }
    return '未连续突破 ±0.4°C';
}

function formatIodMonthlyPoint(point) {
    const value = numberOrNull(point?.dmi);
    if (!point || value == null) return '--';
    return `${localizeIodPeriod(point.month_label || point.month)} ${formatSignedNumber(value, 2)}°C`;
}

function buildIodCurrentNote(current, thresholds) {
    const dmi = numberOrNull(current.dmi);
    const baseNote = current.status_note || '当前 IOD 状态等待确认。';
    const positive = numberOrNull(thresholds.positive);
    const negative = numberOrNull(thresholds.negative);
    const thresholdText = positive != null && negative != null
        ? `BoM 阈值：DMI 持续高于 ${formatSignedNumber(positive, 1)}°C 偏正 IOD，低于 ${formatSignedNumber(negative, 1)}°C 偏负 IOD。`
        : 'BoM 阈值：±0.4°C。';
    return dmi == null ? baseNote : `${baseNote} 当前值 ${formatSignedNumber(dmi, 2)}°C；${thresholdText}`;
}

function buildIodForecastHeadline(milestones) {
    const highProbability = [...milestones]
        .reverse()
        .find((item) => numberOrNull(item.positive_probability) >= 80);
    if (highProbability) {
        return `${localizeIodPeriod(highProbability.period)} 正IOD >${numberOrNull(highProbability.positive_probability)}%`;
    }
    const latestProbability = [...milestones]
        .reverse()
        .find((item) => numberOrNull(item.positive_probability) != null);
    if (latestProbability) {
        return `正IOD ${numberOrNull(latestProbability.positive_probability)}%`;
    }
    return '正IOD概率抬升';
}

function buildIodForecastWindow(milestones) {
    const period = milestones.find((item) => String(item.period || '').includes('-'))?.period
        || milestones[milestones.length - 1]?.period;
    return period ? `${localizeIodPeriod(period)} 概率展望` : 'IRI/NMME 概率展望';
}

function summarizeBomIodOutlook(bom) {
    const text = `${bom.status_text || ''} ${bom.forecast_text || ''}`.trim();
    if (!text) return 'BoM 当前展望暂未读取。';
    if (/positive IOD event is likely/i.test(text)) {
        return 'BoM：当前 IOD 仍为中性，但模型倾向南半球冬春季出现正 IOD；时间和强度仍有明显分歧。';
    }
    if (/currently neutral/i.test(text)) {
        return 'BoM：当前 IOD 为中性，后续是否转向需看 DMI 是否连续越过阈值。';
    }
    return text.length > 180 ? `${text.slice(0, 180)}...` : text;
}

function summarizeIriIodOutlook(iri) {
    const milestones = Array.isArray(iri.probability_milestones) ? iri.probability_milestones : [];
    const probabilityPoints = milestones.filter((item) => numberOrNull(item.positive_probability) != null);
    const firstProbability = probabilityPoints[0];
    const secondProbability = probabilityPoints[1];
    const highProbability = milestones.find((item) => numberOrNull(item.positive_probability) >= 80);
    if (highProbability) {
        const opening = firstProbability
            ? `${localizeIodPeriod(firstProbability.period)}正 IOD 概率约 ${numberOrNull(firstProbability.positive_probability)}%`
            : '近月仍以中性为主';
        const bridge = secondProbability
            ? `，${localizeIodPeriod(secondProbability.period)}升至 ${numberOrNull(secondProbability.positive_probability)}%`
            : '';
        return `IRI/NMME：${opening}${bridge}；${localizeIodPeriod(highProbability.period)}正 IOD 概率超过 ${numberOrNull(highProbability.positive_probability)}%，负 IOD 概率较低。`;
    }
    if (iri.summary) {
        return iri.summary.length > 180 ? `${iri.summary.slice(0, 180)}...` : iri.summary;
    }
    return 'IRI/NMME 预测摘要暂未读取。';
}

function renderIodProbabilityList(milestones) {
    const container = document.getElementById('iod-probability-list');
    if (!container) return;
    if (!milestones.length) {
        container.innerHTML = '<div class="iod-probability-item"><span>预测</span><div><div class="iod-probability-bar"><i class="iod-probability-fill" style="width: 0%;"></i></div><strong>等待 IRI 概率</strong></div></div>';
        return;
    }

    container.innerHTML = milestones.map((item) => {
        const probability = numberOrNull(item.positive_probability);
        const width = probability == null ? 46 : Math.max(4, Math.min(100, probability));
        const label = probability == null ? item.label : `${item.label} · ${probability}%`;
        return `
            <div class="iod-probability-item" title="${item.note || ''}">
                <span>${localizeIodPeriod(item.period)}</span>
                <div>
                    <div class="iod-probability-bar">
                        <i class="iod-probability-fill" style="width: ${width}%; opacity: ${probability == null ? 0.45 : 1};"></i>
                    </div>
                    <strong>${label || '--'}</strong>
                </div>
            </div>
        `;
    }).join('');
}

function renderIodDmiChart(series, thresholds) {
    const canvas = document.getElementById('iod-dmi-chart');
    if (!canvas || typeof Chart === 'undefined') return;

    const rows = (Array.isArray(series) ? series : [])
        .filter((row) => numberOrNull(row.dmi) != null)
        .slice(-156);

    if (iodDmiChartInstance) {
        iodDmiChartInstance.destroy();
        iodDmiChartInstance = null;
    }
    if (!rows.length) return;

    const labels = rows.map((row) => formatDateOnly(row.week_end || row.week_start));
    const values = rows.map((row) => numberOrNull(row.dmi));
    const positive = numberOrNull(thresholds.positive) ?? 0.4;
    const negative = numberOrNull(thresholds.negative) ?? -0.4;
    const maxAbs = Math.max(0.8, Math.abs(positive), Math.abs(negative), ...values.map((value) => Math.abs(value || 0)));
    const yLimit = Math.ceil((maxAbs + 0.15) * 10) / 10;

    iodDmiChartInstance = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: 'DMI',
                    data: values,
                    borderColor: THEME.green,
                    backgroundColor: 'rgba(78, 203, 146, 0.12)',
                    borderWidth: 2,
                    tension: 0.28,
                    pointRadius: 0,
                    fill: true,
                },
                {
                    label: '+0.4°C 正 IOD 阈值',
                    data: labels.map(() => positive),
                    borderColor: '#f2ad56',
                    borderDash: [6, 5],
                    borderWidth: 1.2,
                    pointRadius: 0,
                    fill: false,
                },
                {
                    label: '-0.4°C 负 IOD 阈值',
                    data: labels.map(() => negative),
                    borderColor: THEME.blue,
                    borderDash: [6, 5],
                    borderWidth: 1.2,
                    pointRadius: 0,
                    fill: false,
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'top',
                    labels: { usePointStyle: true },
                },
                tooltip: {
                    callbacks: {
                        title: (items) => {
                            const row = rows[items[0]?.dataIndex];
                            return row?.week_start && row?.week_end
                                ? `${row.week_start} 至 ${row.week_end}`
                                : items[0]?.label || '';
                        },
                        label: (context) => `${context.dataset.label}: ${formatSignedNumber(context.parsed.y, 2)}°C`,
                    },
                },
            },
            scales: {
                x: {
                    grid: { color: 'rgba(55, 74, 70, 0.08)' },
                    ticks: { maxTicksLimit: 8 },
                },
                y: {
                    suggestedMin: -yLimit,
                    suggestedMax: yLimit,
                    title: { display: true, text: 'DMI anomaly (°C)' },
                    ticks: {
                        callback: (value) => `${Number(value).toFixed(1)}°C`,
                    },
                },
            },
        },
    });
}

function localizeIodPeriod(period) {
    if (!period) return '--';
    const monthMap = {
        January: '1月',
        February: '2月',
        March: '3月',
        April: '4月',
        May: '5月',
        June: '6月',
        July: '7月',
        August: '8月',
        September: '9月',
        October: '10月',
        November: '11月',
        December: '12月',
        Jan: '1月',
        Feb: '2月',
        Mar: '3月',
        Apr: '4月',
        Jun: '6月',
        Jul: '7月',
        Aug: '8月',
        Sep: '9月',
        Oct: '10月',
        Nov: '11月',
        Dec: '12月',
    };
    let text = String(period);
    Object.entries(monthMap).forEach(([en, cn]) => {
        text = text.replaceAll(en, cn);
    });
    return text.replace(/(\d{4})$/, '$1年');
}

async function fetchRaotMeta() {
    try {
        const response = await fetch(`raot_meta.json?v=${Date.now()}`);
        if (!response.ok) throw new Error('Failed to load raot_meta.json');
        raotMeta = await response.json();
        selectedRaotType = raotMeta.default_product || raotMeta.products?.[0]?.key || selectedRaotType;
        renderRaotProductPills();
        applySelectedRaotType(selectedRaotType);
    } catch (error) {
        console.error('Error fetching RAOT meta:', error);
        document.getElementById('raot-focus-note').textContent = 'RAOT 元数据加载失败，已保留默认图表视角。';
    }
}

function renderRaotProductPills() {
    const container = document.getElementById('raot-product-pills');
    if (!container || !raotMeta?.products?.length) return;

    container.innerHTML = raotMeta.products.map((product) => `
        <button class="product-pill${product.key === selectedRaotType ? ' active' : ''}" data-type="${product.key}">
            ${product.label}
        </button>
    `).join('');

    container.querySelectorAll('.product-pill').forEach((button) => {
        button.addEventListener('click', () => {
            applySelectedRaotType(button.dataset.type);
        });
    });
}

function applySelectedRaotType(typeValue) {
    selectedRaotType = typeValue;
    renderRaotProductPills();
    refreshEmbeddedDashboards(typeValue);
    updateRaotSummaryCards();
    updateRaotModuleSpecs();
    updateRaotFocusNote();
    updateRaotProductBrief();
}

function getSelectedRaotProduct() {
    return raotMeta?.products?.find((product) => product.key === selectedRaotType) || null;
}

function updateRaotSummaryCards() {
    if (!raotMeta) return;

    const latestWeek = raotMeta.latest_complete_week;
    if (latestWeek) {
        document.getElementById('stat-raot-week').textContent = latestWeek.label;
        document.getElementById('stat-raot-week-range').textContent = `${latestWeek.start} 至 ${latestWeek.end}`;
    }

    const product = getSelectedRaotProduct();
    if (!product) return;

    const priceDeviation = formatDeviation(product.price_deviation_pct);
    const volumeDeviation = formatDeviation(product.volume_deviation_pct);

    document.getElementById('stat-raot-price-deviation').textContent = priceDeviation;
    document.getElementById('stat-raot-price-context').textContent =
        `${product.label} | 同周历史均值 ${formatNumber(product.historical_same_week_price_avg, 1)} THB/kg`;

    document.getElementById('stat-raot-volume-deviation').textContent = volumeDeviation;
    document.getElementById('stat-raot-volume-context').textContent =
        `${product.label} | 同周历史均量 ${formatNumber(product.historical_same_week_volume_avg, 0)} kg`;
}

function updateRaotModuleSpecs() {
    const product = getSelectedRaotProduct();
    if (!product || !raotMeta?.latest_complete_week) return;

    const weekLabel = raotMeta.latest_complete_week.label;
    const weekRange = `${raotMeta.latest_complete_week.start} 至 ${raotMeta.latest_complete_week.end}`;
    const sourceLatestDate = raotMeta.source_latest_data_date || raotMeta.latest_data_date || '--';
    const sourceWeek = raotMeta.source_latest_week?.label || weekLabel;
    const baseSpecs = [
        `来源：RAOT`,
        `品种：${product.label}`,
        `源数据至：${sourceLatestDate}`,
        `最新完整周：${weekLabel}`
    ];

    setUpdateBadge('raot-kline-updated', raotMeta.generated_at);
    setUpdateBadge('raot-seasonal-updated', raotMeta.generated_at);
    setUpdateBadge('raot-volume-updated', raotMeta.generated_at);
    setText('raot-kline-source-note', `数据来源：RAOT 公开周度价格与成交结算量；源数据已抓取至 ${sourceLatestDate}（${sourceWeek}），图表采用最新完整周 ${weekLabel}（${weekRange}），本站每日校验并同步刷新。`);
    setText('raot-seasonal-source-note', `数据来源：RAOT 多品种周均价；源数据已抓取至 ${sourceLatestDate}（${sourceWeek}），季节性对照使用最新完整周 ${weekLabel}（${weekRange}），避免未完结周扰动同比口径。`);
    setText('raot-volume-source-note', `数据来源：RAOT 成交结算量字段；源数据已抓取至 ${sourceLatestDate}（${sourceWeek}），成交量季节性使用最新完整周 ${weekLabel}（${weekRange}）与同周历史均值比较。`);

    const klineSpecs = document.getElementById('module-kline-specs');
    if (klineSpecs) klineSpecs.innerHTML = renderSpecPills([
        ...baseSpecs,
        '频率：周K / 周成交量',
        '单位：THB/kg & kg'
    ]);

    const seasonalSpecs = document.getElementById('module-seasonal-specs');
    if (seasonalSpecs) seasonalSpecs.innerHTML = renderSpecPills([
        ...baseSpecs,
        '口径：周均价',
        '单位：THB/kg'
    ]);

    const volumeSpecs = document.getElementById('module-volume-specs');
    if (volumeSpecs) volumeSpecs.innerHTML = renderSpecPills([
        ...baseSpecs,
        '口径：周合计成交结算量',
        '范围：非单一市场',
        '单位：kg'
    ]);
}

function updateRaotFocusNote() {
    const product = getSelectedRaotProduct();
    if (!product || !raotMeta?.latest_complete_week) return;

    const priceDeviation = formatDeviation(product.price_deviation_pct);
    const volumeDeviation = formatDeviation(product.volume_deviation_pct);
    const sourceLatestDate = raotMeta.source_latest_data_date || raotMeta.latest_data_date || '--';
    document.getElementById('raot-focus-note').textContent =
        `源数据已到 ${sourceLatestDate}；当前聚焦 ${product.label}，按 ${raotMeta.latest_complete_week.label} 完整周统一查看价格季节性、成交量季节性与周K量价，价格偏离 ${priceDeviation}，量能偏离 ${volumeDeviation}。`;
}

function updateRaotProductBrief() {
    const brief = RAOT_PRODUCT_BRIEFS[selectedRaotType];
    if (!brief) return;

    document.getElementById('raot-product-brief-title').textContent = `${brief.title} 解读`;
    document.getElementById('raot-product-form').textContent = brief.form;
    document.getElementById('raot-product-role').textContent = brief.role;
    document.getElementById('raot-product-signal').textContent = brief.signal;
}

function renderSpecPills(items) {
    return items.map((item) => `<span class="spec-pill">${item}</span>`).join('');
}

function setText(id, text) {
    const element = document.getElementById(id);
    if (element) element.textContent = text;
}

function setUpdateBadge(id, value, label = '更新') {
    setText(id, `${label}：${formatUpdateValue(value)}`);
}

function formatUpdateValue(value) {
    if (!value) return '--';
    const text = String(value).replace('T', ' ').replace(/\.\d+Z?$/, '');
    return text.length > 16 ? text.slice(0, 16) : text;
}

function formatDeviation(value) {
    if (value == null || Number.isNaN(value)) return '--';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
}

function formatNumber(value, digits = 0) {
    if (value == null || Number.isNaN(value)) return '--';
    return Number(value).toLocaleString('zh-CN', {
        minimumFractionDigits: digits,
        maximumFractionDigits: digits
    });
}

function formatSignedNumber(value, digits = 0) {
    if (value == null || Number.isNaN(value)) return '--';
    const sign = value >= 0 ? '+' : '';
    return `${sign}${formatNumber(value, digits)}`;
}

function configureCharts() {
    if (typeof Chart === 'undefined') {
        console.error('Chart.js failed to load.');
        return;
    }

    Chart.defaults.color = THEME.textMuted;
    Chart.defaults.font.family = "'IBM Plex Sans', sans-serif";
    Chart.defaults.borderColor = THEME.gridLines;
    Chart.defaults.scale.grid.color = THEME.gridLines;
    Chart.defaults.plugins.legend.labels.color = THEME.textMuted;
    Chart.defaults.plugins.legend.labels.boxWidth = 12;
    Chart.defaults.plugins.legend.labels.boxHeight = 12;
    Chart.defaults.plugins.tooltip.backgroundColor = 'rgba(7, 17, 31, 0.96)';
    Chart.defaults.plugins.tooltip.borderColor = 'rgba(166, 186, 214, 0.16)';
    Chart.defaults.plugins.tooltip.borderWidth = 1;
    Chart.defaults.plugins.tooltip.padding = 12;
    Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
    Chart.defaults.plugins.tooltip.bodyColor = '#dfe8f8';
}

async function fetchData() {
    try {
        fetchQuotes();
        const response = await fetch(`data.json?v=${Date.now()}`);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        if (Array.isArray(data.songkhla) && data.songkhla.length > 0) {
            renderSongkhlaChart(data.songkhla);
            updateSongkhlaStats(data.songkhla);
            const latestSongkhlaDate = getLatestYearSeriesDate(data.songkhla);
            setUpdateBadge('thai-spot-updated', latestSongkhlaDate, '数据至');
            if (latestSongkhlaDate) {
                setText('thai-spot-source-note', `数据来源：泰国 Songkhla CRM / THAINR 胶水现货报价；更新频率：交易日/工作日高频跟踪，本站每日自动校验并保留多年同期对照。当前序列数据至 ${latestSongkhlaDate}。`);
            }
        }

        if (Array.isArray(data.apromac) && data.apromac.length > 0) {
            renderApromacChart(data.apromac);
            updateApromacStats(data.apromac);
            const latestApromacDate = getLatestMonthlyDate(data.apromac);
            setUpdateBadge('apromac-updated', latestApromacDate, '数据至');
            if (latestApromacDate) {
                setText('apromac-source-note', `数据来源：APROMAC 科特迪瓦指导收购价；更新频率：月度，通常当月 1-5 日发布，本站每月 1-7 日每日补抓，月内未发布则沿用上一期。当前数据至 ${latestApromacDate}。`);
            }
        }

        if (data.thai_supply?.top_regions?.length) {
            renderThaiSupply(data.thai_supply, data.thai_local_markets || []);
        }

        updateDataDate(data);
        document.getElementById('last-update').textContent = new Date().toLocaleString('zh-CN');
    } catch (error) {
        console.error('Error fetching data:', error);
        document.getElementById('last-update').textContent = '数据加载失败';
        document.getElementById('last-update').style.color = THEME.red;
    }
}

async function fetchDomesticInventory() {
    try {
        const response = await fetch(`domestic_inventory.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('domestic_inventory.json not found');
        const data = await response.json();
        renderDomesticInventory(data);
    } catch (error) {
        console.warn('Domestic inventory unavailable:', error);
        setUpdateBadge('inventory-updated', '--');
        setText('inventory-implication', '国内库存模块尚未生成，请先运行 update_domestic_inventory.py。');
    }
}

async function fetchDomesticFuturesSeasonality() {
    try {
        const response = await fetch(`domestic_futures_seasonality.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('domestic_futures_seasonality.json not found');
        const data = await response.json();
        renderDomesticFuturesSeasonality(data);
    } catch (error) {
        console.warn('Domestic futures seasonality unavailable:', error);
        setText('domestic-futures-seasonality-note', '内盘期货季节性数据尚未生成，请先运行 update_domestic_futures_seasonality.py。');
    }
}

async function fetchRubberTradeFlow() {
    try {
        const response = await fetch(`rubber_trade_flow.json?v=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('rubber_trade_flow.json not found');
        const data = await response.json();
        renderRubberTradeFlow(data);
    } catch (error) {
        console.warn('Rubber trade flow unavailable:', error);
        setText('trade-flow-verdict', '贸易流雷达待刷新');
        setText('trade-flow-summary', '主产国出口与消费国进口数据暂未更新，稍后自动恢复展示。');
    }
}

function renderRubberTradeFlow(data) {
    if (data.monthly_comparison?.months?.length) {
        renderRubberTradeFlowMonthly(data, data.monthly_comparison);
        return;
    }

    const meta = data.meta || {};
    const signal = data.signal || {};
    const exportCountries = data.export_countries || [];
    const importCountries = data.import_countries || [];

    setUpdateBadge('trade-flow-updated', meta.updated_at);
    const years = meta.years || [];
    const yearText = years.length ? `${years[0]}-${years[years.length - 1]}` : `${meta.start_year || '--'}-${meta.end_year || '--'}`;
    const source = meta.source || '年度结构背景';
    const topExport = getTopTradeCountry(exportCountries);
    const topImport = getTopTradeCountry(importCountries);

    const specs = document.getElementById('trade-flow-specs');
    if (specs) {
        specs.innerHTML = renderSpecPills([
            '天然橡胶 HS4001',
            '指标：数量 + 隐含均价',
            `年度结构：${yearText}`,
            '图表：数量柱 + 均价线',
            `来源：${source}`
        ]);
    }

    setText('trade-flow-verdict', signal.title || '年度贸易结构锚已建立');
    setText('trade-flow-summary', signal.stance || meta.status_note || '贸易流月度数据暂未刷新，不输出短线方向。');

    const evidence = document.getElementById('trade-flow-evidence');
    if (evidence) {
        const items = [
            {
                label: '出口锚点',
                value: topExport ? `${topExport.country_cn} ${formatWanTon(topExport.latest.volume_ton)}` : '--',
                note: topExport ? `${topExport.latest.year} 均价 ${formatUsdTon(topExport.latest.unit_price_usd_t)}；${buildTradeYoYNote(topExport)}` : '等待出口端数据'
            },
            {
                label: '进口锚点',
                value: topImport ? `${topImport.country_cn} ${formatWanTon(topImport.latest.volume_ton)}` : '--',
                note: topImport ? `${topImport.latest.year} 均价 ${formatUsdTon(topImport.latest.unit_price_usd_t)}；${buildTradeYoYNote(topImport)}` : '等待进口端数据'
            },
            {
                label: '当前用法',
                value: '年度结构锚',
                note: '确认贸易权重，不替代月度边际信号'
            }
        ];
        evidence.innerHTML = items.map((item) => `
            <article>
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <p>${item.note}</p>
            </article>
        `).join('');
    }

    renderTradeFlowChart('trade-flow-export-chart', exportCountries, {
        title: '出口端量价结果',
        barLabel: '出口量（万吨）',
        priceLabel: '出口均价（美元/吨）',
        barColor: 'rgba(47, 125, 95, 0.72)',
        lineColor: '#d69a46'
    });
    renderTradeFlowChart('trade-flow-import-chart', importCountries, {
        title: '进口端量价结果',
        barLabel: '进口量（万吨）',
        priceLabel: '进口均价（美元/吨）',
        barColor: 'rgba(90, 159, 183, 0.68)',
        lineColor: '#1f5f49'
    });
    renderTradeCountryStrip('trade-flow-export-strip', exportCountries);
    renderTradeCountryStrip('trade-flow-import-strip', importCountries);
    setText('trade-flow-source-note', `数据来源：${source}；口径：HS4001 天然橡胶；更新时间：${formatUpdateValue(meta.updated_at)}；当前图表为可复核年度量价结构，用来确认贸易权重和价格锚。月度海关序列未形成前，不把年度数冒充短线信号。页面只展示数量与隐含均价，不展示总金额，也不混入 HS4002/4011。`);
}

function renderRubberTradeFlowMonthly(data, monthly) {
    const meta = data.meta || {};
    const signal = data.signal || {};
    const latest = monthly.latest || {};
    const baselineYears = monthly.baseline_years || meta.baseline_years || [];
    const baselineText = baselineYears.length ? `${baselineYears[0]}-${baselineYears[baselineYears.length - 1]}` : '近五年';
    const source = monthly.source || meta.source || 'Thailand MOC OpenData';

    setUpdateBadge('trade-flow-updated', meta.updated_at);
    const specs = document.getElementById('trade-flow-specs');
    if (specs) {
        specs.innerHTML = renderSpecPills([
            '泰国官方月频',
            meta.hs_scope || '天然橡胶出口',
            `最新有效：${latest.month_key || meta.latest_month || '--'}`,
            `对照：2026 vs ${baselineText}同月`,
            '未发布月份不补0'
        ]);
    }

    setText('trade-flow-verdict', signal.title || '2026月度贸易流已接入');
    setText('trade-flow-summary', signal.stance || meta.status_note || '主图已切到 2026 月度官方出口数据，与近五年同月均值和区间对照。');

    const evidence = document.getElementById('trade-flow-evidence');
    if (evidence) {
        const items = [
            {
                label: '最新月出口量',
                value: formatWanTon(latest.volume_ton),
                note: `同比 ${formatDeviation(latest.volume_yoy_pct)} / 较5年均值 ${formatDeviation(latest.volume_vs_avg5_pct)}`
            },
            {
                label: '最新月均价',
                value: formatUsdTon(latest.unit_price_usd_t),
                note: `同比 ${formatDeviation(latest.price_yoy_pct)} / 较5年均值 ${formatDeviation(latest.price_vs_avg5_pct)}`
            },
            {
                label: '历史位置',
                value: latest.volume_percentile_5y == null ? '--' : `${formatNumber(latest.volume_percentile_5y, 1)}%`,
                note: `出口量同月分位；均价分位 ${latest.price_percentile_5y == null ? '--' : `${formatNumber(latest.price_percentile_5y, 1)}%`}`
            }
        ];
        evidence.innerHTML = items.map((item) => `
            <article>
                <span>${item.label}</span>
                <strong>${item.value}</strong>
                <p>${item.note}</p>
            </article>
        `).join('');
    }

    renderTradeMonthlyComparisonChart('trade-flow-export-chart', monthly, {
        metric: 'volume',
        title: '泰国天然橡胶出口量',
        actualLabel: '2026出口量',
        avgLabel: `${baselineText}均值`,
        rangeLabel: `${baselineText}区间`,
        unit: '万吨',
        axisTitle: '数量（万吨）',
        beginAtZero: true,
        color: '#258064',
        avgColor: '#d69a46',
        bandColor: 'rgba(90, 159, 183, 0.18)'
    });
    renderTradeMonthlyComparisonChart('trade-flow-import-chart', monthly, {
        metric: 'price',
        title: '泰国天然橡胶出口均价',
        actualLabel: '2026均价',
        avgLabel: `${baselineText}均值`,
        rangeLabel: `${baselineText}区间`,
        unit: '美元/吨',
        axisTitle: '美元/吨',
        beginAtZero: false,
        color: '#1f5f49',
        avgColor: '#d69a46',
        bandColor: 'rgba(47, 125, 95, 0.16)'
    });
    renderTradeMonthlyStrip('trade-flow-export-strip', monthly, 'volume');
    renderTradeMonthlyStrip('trade-flow-import-strip', monthly, 'price');
    setText('trade-flow-source-note', `数据来源：${source}；口径：${meta.hs_scope || monthly.scope || '泰国MOC天然橡胶商品口径'}；最新有效月：${latest.month_key || '--'}。图上 2026 实际值与 ${baselineText} 同月均值/区间对照；官方未发布月份不补 0，旧年度结构数据不再作为主信号。`);
}

function renderTradeMonthlyComparisonChart(canvasId, monthly, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    if (tradeFlowChartInstances[canvasId]) {
        tradeFlowChartInstances[canvasId].destroy();
    }

    const metric = options.metric === 'price' ? 'price' : 'volume';
    const rows = (monthly.months || []).filter((row) => row[`${metric}_avg5`] != null || row[`${metric}_2026`] != null);
    if (!rows.length) {
        const wrap = canvas.closest('.trade-flow-chart-wrap');
        if (wrap) wrap.innerHTML = '<p class="trade-empty">等待官方月度贸易流数据。</p>';
        return;
    }
    const toChartValue = (value) => {
        if (value == null || Number.isNaN(Number(value))) return null;
        return metric === 'volume' ? Number(value) / 10000 : Number(value);
    };

    tradeFlowChartInstances[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'line',
        data: {
            labels: rows.map((row) => row.month_label),
            datasets: [
                {
                    label: '_range_max',
                    data: rows.map((row) => toChartValue(row[`${metric}_max5`])),
                    borderColor: 'rgba(0,0,0,0)',
                    backgroundColor: 'rgba(0,0,0,0)',
                    pointRadius: 0,
                    fill: false,
                    tension: 0.28
                },
                {
                    label: options.rangeLabel,
                    data: rows.map((row) => toChartValue(row[`${metric}_min5`])),
                    borderColor: 'rgba(0,0,0,0)',
                    backgroundColor: options.bandColor,
                    pointRadius: 0,
                    fill: '-1',
                    tension: 0.28
                },
                {
                    label: options.avgLabel,
                    data: rows.map((row) => toChartValue(row[`${metric}_avg5`])),
                    borderColor: options.avgColor,
                    backgroundColor: options.avgColor,
                    borderDash: [6, 5],
                    borderWidth: 2,
                    pointRadius: 0,
                    tension: 0.28
                },
                {
                    label: options.actualLabel,
                    data: rows.map((row) => toChartValue(row[`${metric}_2026`])),
                    borderColor: options.color,
                    backgroundColor: options.color,
                    borderWidth: 3,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    tension: 0.28,
                    spanGaps: false
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#48655e',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 14,
                        filter(item) {
                            return item.text !== '_range_max';
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        title(context) {
                            const row = rows[context[0].dataIndex];
                            return `${options.title} | ${row.month_label}`;
                        },
                        label(context) {
                            const row = rows[context.dataIndex];
                            if (context.dataset.label === '_range_max') return null;
                            if (context.dataset.label === options.rangeLabel) {
                                return `${options.rangeLabel}: ${formatTradeMetric(row[`${metric}_min5`], metric)} - ${formatTradeMetric(row[`${metric}_max5`], metric)}`;
                            }
                            if (context.dataset.label === options.avgLabel) {
                                return `${options.avgLabel}: ${formatTradeMetric(row[`${metric}_avg5`], metric)}`;
                            }
                            const vsAvg = row[`${metric}_vs_avg5_pct`];
                            const yoy = row[`${metric}_yoy_pct`];
                            return `${options.actualLabel}: ${formatTradeMetric(row[`${metric}_2026`], metric)}（同比 ${formatDeviation(yoy)} / 较均值 ${formatDeviation(vsAvg)}）`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#668078', font: { weight: '600' } }
                },
                y: {
                    beginAtZero: options.beginAtZero,
                    title: { display: true, text: options.axisTitle, color: '#668078' },
                    grid: { color: 'rgba(81, 123, 105, 0.14)' },
                    ticks: { color: '#668078' }
                }
            }
        }
    });
}

function renderTradeMonthlyStrip(containerId, monthly, metric) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const rows = (monthly.months || []).filter((row) => row[`${metric}_2026`] != null);
    if (!rows.length) {
        container.innerHTML = '<span class="trade-flow-country-pill">等待月度数据</span>';
        return;
    }
    container.innerHTML = rows.map((row) => `
        <span class="trade-flow-country-pill">
            <strong>${row.month_label}</strong>
            ${formatTradeMetric(row[`${metric}_2026`], metric)}
            <em>${formatDeviation(row[`${metric}_vs_avg5_pct`])}</em>
        </span>
    `).join('');
}

function formatTradeMetric(value, metric) {
    if (value == null || Number.isNaN(Number(value))) return '--';
    if (metric === 'volume') return `${formatNumber(Number(value) / 10000, 1)} 万吨`;
    return `${formatNumber(Number(value), 0)} 美元/吨`;
}

function renderTradeSourceGrid(containerId, sources) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!sources.length) {
        container.innerHTML = '<article class="trade-source-card"><strong>官方月频源待确认</strong><p>月度海关量价口径确认后生成图表。</p></article>';
        return;
    }
    const grouped = [
        { title: '出口端', role: 'export', note: '主产国外流' },
        { title: '进口端', role: 'import', note: '消费国承接' }
    ];
    container.innerHTML = grouped.map((group) => {
        const rows = sources.filter((item) => item.role === group.role);
        return `
            <article class="trade-source-card">
                <div class="trade-source-card-head">
                    <span>${group.note}</span>
                    <strong>${group.title}</strong>
                </div>
                <div class="trade-source-list">
                    ${rows.map((item) => `
                        <div class="trade-source-row ${getTradeStatusClass(item.status)}">
                            <div>
                                <strong>${item.country_cn || item.country}</strong>
                                <span>${item.source}</span>
                            </div>
                            <em>${item.status_cn || item.status || '待授权/映射'}</em>
                        </div>
                    `).join('')}
                </div>
            </article>
        `;
    }).join('');
}

function renderTradeMonthlyStatusGrid(containerId, countries) {
    const container = document.getElementById(containerId);
    if (!container) return;
    if (!countries.length) {
        container.innerHTML = '<article class="trade-monthly-card"><strong>等待国家源</strong><p>官方月频源确认后自动加入。</p></article>';
        return;
    }
    container.innerHTML = countries.map((item) => {
        const records = item.records || [];
        const hasRecords = records.length > 0;
        return `
            <article class="trade-monthly-card ${getTradeStatusClass(item.status)}">
                <div class="trade-monthly-head">
                    <div>
                        <span>${item.frequency || '月度'}</span>
                        <strong>${item.country_cn || item.country}</strong>
                    </div>
                    <em>${summarizeTradeStatus(item.status)}</em>
                </div>
                <p class="trade-monthly-source">${item.source}</p>
                ${hasRecords ? '<div class="trade-mini-chart-placeholder">月度量价图已接入</div>' : `
                    <div class="trade-monthly-empty">
                        <strong>${item.status_cn || '待授权/映射'}</strong>
                        <p>${item.next_step || '月度数量与隐含均价确认后生成量价图。'}</p>
                    </div>
                `}
                <div class="trade-monthly-meta">
                    <span>最新：${item.latest_released || '--'}</span>
                    <span>指标：量 + 均价</span>
                </div>
            </article>
        `;
    }).join('');
}

function getTradeStatusClass(status = '') {
    if (['mapping_needed', 'endpoint_mapping', 'bulk_pipeline', 'pdf_pipeline', 'choice_id_needed'].includes(status)) return 'status-work';
    if (['api_key_needed', 'access_limited'].includes(status)) return 'status-blocked';
    if (status === 'source_scoping') return 'status-scope';
    return 'status-ok';
}

function summarizeTradeStatus(status = '') {
    if (status === 'mapping_needed') return '待编码';
    if (status === 'choice_id_needed') return '待ID';
    if (status === 'api_key_needed') return '需Key';
    if (status === 'access_limited') return '受限';
    if (status === 'bulk_pipeline') return '待落库';
    if (status === 'pdf_pipeline') return '待抽取';
    if (status === 'endpoint_mapping') return '待映射';
    if (status === 'source_scoping') return '待确认';
    return '已定位';
}

function getTopTradeCountry(countries) {
    const valid = countries.filter((item) => item.latest?.volume_ton);
    if (!valid.length) return null;
    return valid.reduce((best, item) => Number(item.latest.volume_ton) > Number(best.latest.volume_ton) ? item : best, valid[0]);
}

function buildTradeYoYNote(country) {
    const records = (country?.records || []).filter((record) => record.volume_ton && record.unit_price_usd_t);
    if (records.length < 2) return '同比待补';
    const latest = country.latest || records[records.length - 1];
    const latestIndex = records.findIndex((record) => record.year === latest.year);
    const previous = latestIndex > 0 ? records[latestIndex - 1] : records[records.length - 2];
    if (!previous?.volume_ton || !previous?.unit_price_usd_t) return '同比待补';
    const volumeYoY = (Number(latest.volume_ton) / Number(previous.volume_ton) - 1) * 100;
    const priceYoY = (Number(latest.unit_price_usd_t) / Number(previous.unit_price_usd_t) - 1) * 100;
    return `量 ${formatDeviation(volumeYoY)} / 价 ${formatDeviation(priceYoY)}`;
}

function renderTradeFlowChart(canvasId, countries, options) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;
    const rows = buildTradeFlowChartRows(countries);
    if (tradeFlowChartInstances[canvasId]) {
        tradeFlowChartInstances[canvasId].destroy();
    }

    if (!rows.length) {
        const wrap = canvas.closest('.trade-flow-chart-wrap');
        if (wrap) wrap.innerHTML = '<p class="trade-empty">等待月度贸易流数据。</p>';
        return;
    }

    tradeFlowChartInstances[canvasId] = new Chart(canvas.getContext('2d'), {
        type: 'bar',
        data: {
            labels: rows.map((row) => row.country_cn || row.country),
            datasets: [
                {
                    type: 'bar',
                    label: options.barLabel,
                    data: rows.map((row) => Number(row.volume_ton) / 10000),
                    backgroundColor: options.barColor,
                    borderRadius: 10,
                    yAxisID: 'volume'
                },
                {
                    type: 'line',
                    label: options.priceLabel,
                    data: rows.map((row) => Number(row.unit_price_usd_t)),
                    borderColor: options.lineColor,
                    backgroundColor: options.lineColor,
                    borderWidth: 3,
                    tension: 0.28,
                    pointRadius: 4,
                    pointHoverRadius: 6,
                    yAxisID: 'price'
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#48655e',
                        usePointStyle: true,
                        pointStyle: 'circle',
                        padding: 14
                    }
                },
                tooltip: {
                    callbacks: {
                        title(context) {
                            const row = rows[context[0].dataIndex];
                            return `${options.title} | ${row.country_cn || row.country} ${row.year || ''}`;
                        },
                        label(context) {
                            const row = rows[context.dataIndex];
                            if (context.dataset.yAxisID === 'volume') return `${context.dataset.label}: ${formatWanTon(row.volume_ton)}`;
                            return `${context.dataset.label}: ${formatUsdTon(row.unit_price_usd_t)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { color: '#668078', font: { weight: '600' } }
                },
                volume: {
                    beginAtZero: true,
                    position: 'left',
                    title: { display: true, text: '数量（万吨）', color: '#668078' },
                    grid: { color: 'rgba(81, 123, 105, 0.14)' },
                    ticks: { color: '#668078' }
                },
                price: {
                    beginAtZero: false,
                    position: 'right',
                    title: { display: true, text: '美元/吨', color: '#668078' },
                    grid: { display: false },
                    ticks: { color: '#668078' }
                }
            }
        }
    });
}

function buildTradeFlowChartRows(countries) {
    return (countries || [])
        .map((country) => {
            const latest = country.latest || [...(country.records || [])].reverse().find((record) => record.volume_ton && record.unit_price_usd_t);
            return latest ? {
                country: country.country,
                country_cn: country.country_cn || country.country,
                year: latest.year || country.latest_year,
                volume_ton: latest.volume_ton,
                unit_price_usd_t: latest.unit_price_usd_t
            } : null;
        })
        .filter((row) => row && row.volume_ton && row.unit_price_usd_t);
}

function renderTradeCountryStrip(containerId, countries) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const rows = buildTradeFlowChartRows(countries);
    if (!rows.length) {
        container.innerHTML = '<span class="trade-flow-country-pill">等待数据</span>';
        return;
    }
    container.innerHTML = rows.map((row) => `
        <span class="trade-flow-country-pill">
            <strong>${row.country_cn || row.country}</strong>
            ${row.year || '--'} · ${formatWanTon(row.volume_ton)} · ${formatUsdTon(row.unit_price_usd_t)}
        </span>
    `).join('');
}

function formatWanTon(value) {
    if (value == null || Number.isNaN(Number(value))) return '--';
    return `${(Number(value) / 10000).toFixed(1)} 万吨`;
}

function formatUsdTon(value) {
    if (value == null || Number.isNaN(Number(value))) return '--';
    return `${formatNumber(Number(value), 0)} 美元/吨`;
}

function renderDomesticFuturesSeasonality(data) {
    const ctx = document.getElementById('domesticFuturesSeasonalityChart')?.getContext('2d');
    if (!ctx) return;

    const labels = data.labels || [];
    const latest = data.latest || {};
    const product = data.product || {};
    const historyColors = ['#c9a45e', '#6fa8ff', '#8c7df2', '#8c5a4f', '#778083'];
    const currentYear = data.current_year;
    const monthTicks = {
        0: '1月',
        4: '2月',
        8: '3月',
        13: '4月',
        17: '5月',
        21: '6月',
        26: '7月',
        30: '8月',
        34: '9月',
        39: '10月',
        43: '11月',
        48: '12月'
    };

    const datasets = [
        {
            label: '2021-2025区间下沿',
            data: data.min_5y || [],
            borderColor: 'rgba(46, 133, 103, 0)',
            backgroundColor: 'rgba(46, 133, 103, 0)',
            pointRadius: 0,
            tension: 0.22,
            spanGaps: true
        },
        {
            label: '2021-2025历史区间',
            data: data.max_5y || [],
            borderColor: 'rgba(46, 133, 103, 0)',
            backgroundColor: 'rgba(46, 133, 103, 0.12)',
            fill: '-1',
            pointRadius: 0,
            tension: 0.22,
            spanGaps: true
        },
        {
            label: '2021-2025均值',
            data: data.avg_5y || [],
            borderColor: '#2f8a67',
            backgroundColor: 'transparent',
            borderDash: [6, 5],
            borderWidth: 2,
            pointRadius: 0,
            tension: 0.24,
            spanGaps: true
        },
        ...(data.series || []).map((item, index) => {
            const isCurrent = Number(item.year) === Number(currentYear);
            const historyIndex = Math.max(0, index % historyColors.length);
            return {
                label: `${item.year} RU连续`,
                data: item.data || [],
                borderColor: isCurrent ? '#d94b3d' : historyColors[historyIndex],
                backgroundColor: 'transparent',
                borderWidth: isCurrent ? 4 : 1.7,
                pointRadius: 0,
                pointHoverRadius: isCurrent ? 4 : 3,
                tension: 0.22,
                spanGaps: true,
                order: isCurrent ? 0 : 2,
                opacity: isCurrent ? 1 : 0.65
            };
        })
    ];

    if (domesticFuturesSeasonalityChartInstance) domesticFuturesSeasonalityChartInstance.destroy();

    domesticFuturesSeasonalityChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { color: 'rgba(80, 110, 100, 0.08)' },
                    ticks: {
                        maxRotation: 0,
                        autoSkip: false,
                        color: '#6a8077',
                        callback(value, index) {
                            return monthTicks[index] || '';
                        }
                    }
                },
                y: {
                    title: { display: true, text: product.unit || '元/吨', color: '#5d736a' },
                    grid: { color: 'rgba(80, 110, 100, 0.10)' },
                    ticks: { color: '#6a8077' }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '内盘天然橡胶 RU连续季节性',
                    color: '#1f352e',
                    font: { size: 15, weight: '600' },
                    padding: { bottom: 4 }
                },
                subtitle: {
                    display: true,
                    text: '按周度收盘对齐，观察当前盘面相对历史同期的估值位置。',
                    color: '#70877e',
                    font: { size: 12 },
                    padding: { bottom: 8 }
                },
                legend: {
                    position: 'top',
                    labels: {
                        filter(item) {
                            return !item.text.includes('区间下沿');
                        },
                        color: '#526960',
                        boxWidth: 18,
                        usePointStyle: true
                    }
                },
                tooltip: {
                    callbacks: {
                        title(context) {
                            return `${context[0].label} | ${product.name || '天然橡胶连续'}`;
                        },
                        label(context) {
                            const value = context.parsed.y;
                            return `${context.dataset.label}: ${formatNumber(value, 0)} ${product.unit || '元/吨'}`;
                        }
                    }
                }
            }
        }
    });

    const latestParts = [
        `数据来源：${data.source?.primary || 'ChoiceAPI 国内连续合约日线底稿'}`,
        `更新频率：${data.source?.frequency || '交易日日频'}`,
        latest.quote_update_time ? `新浪刷新 ${latest.quote_update_time}` : null,
        latest.date ? `最新：${latest.date}，RU连续 ${formatNumber(latest.value, 0)} 元/吨` : null,
        latest.deviation_5y == null ? null : `较5Y同期 ${formatSignedNumber(latest.deviation_5y, 0)} 元/吨`,
        latest.percentile_5y == null ? null : `历史分位 ${formatNumber(latest.percentile_5y, 1)}%`
    ].filter(Boolean);
    setText('domestic-futures-seasonality-note', `${latestParts.join('；')}。`);
}

function renderDomesticInventory(data) {
    const latest = data.latest || {};
    const source = data.source || {};
    const rows = Array.isArray(data.series) ? data.series : [];
    const socialInventory = data.social_inventory || {};
    const dataMode = data.status_label || (data.data_mode === 'official_plus_framework' ? '官方仓单已接入' : '正式数据');

    setUpdateBadge('inventory-updated', data.updated_at);
    const specs = document.getElementById('inventory-specs');
    if (specs) {
        specs.innerHTML = renderSpecPills([
            `状态：${dataMode}`,
            `官方日期：${latest.official_date || '--'}`,
            `青岛库存：${latest.social_source_date || '--'}`,
            `最新周：${latest.week || '--'}`,
            'RU近5年同周分位',
            '仓单日频 / 社会库存周频'
        ]);
    }

    setText('inventory-verdict', `${latest.pressure_level || '--'}库存压力 · ${latest.stance || '--'}`);
    setText('inventory-summary', data.summary || '等待库存结论生成。');
    renderInventoryEvidence(data.evidence || []);
    renderInventoryMetrics(latest, dataMode);
    renderInventorySeasonalityChart(rows, latest);
    renderInventoryStructureChart(rows, latest, socialInventory);
    renderInventoryWeeklyTable(data.weekly_table || [], socialInventory.table || []);
    renderInventorySourceStatus(data.source_status || []);
    renderInventoryImplication(latest, data.summary);
    const sourceNoteParts = [
        `数据来源：${source.primary || 'ChoiceAPI / 交易所库存 / 社会库存周报'}`,
        `更新频率：${source.frequency || '仓单日频，库存周频'}`,
        source.cloud_note,
        data.status_note
    ]
        .filter(Boolean)
        .map((item) => String(item).trim().replace(/[。；;\s]+$/g, ''));
    setText('inventory-source-note', `${sourceNoteParts.join('。')}。`);
    setText(
        'inventory-chart-note',
        `数据来源：${latest.official_source_status === 'official_mirror' ? '上期所仓单日报公开转载镜像（RU口径）' : '上期所/能源中心仓单日报'}；官方/镜像最新日期：${latest.official_date || '--'}；主图为 RU 仓单近5年同周季节性；右侧为隆众/钢联公开转载口径社会库存结构。`
    );
}

function renderInventoryMetrics(latest, dataMode) {
    const container = document.getElementById('inventory-metrics');
    if (!container) return;

    const level = latest.pressure_level || '--';
    const isOfficialMirror = latest.official_source_status === 'official_mirror';
    const pressureTone = level === '高' ? 'hot' : level === '低' ? 'cool' : 'neutral';
    const deviationTone = latest.deviation_5y_ton > 0 ? 'hot' : latest.deviation_5y_ton < 0 ? 'cool' : 'neutral';
    const changeTone = latest.four_week_change_ton > 0 ? 'hot' : latest.four_week_change_ton < 0 ? 'cool' : 'neutral';
    const percentile = latest.percentile_5y ?? latest.percentile_10y;
    const percentileTone = percentile >= 75 ? 'hot' : percentile <= 25 ? 'cool' : 'neutral';
    const cards = [
        {
            label: '青岛库存',
            value: latest.qingdao_total_wan_ton == null ? '--' : `${formatNumber(latest.qingdao_total_wan_ton, 2)} 万吨`,
            meta: latest.social_source_date || '保税+一般贸易',
            tone: latest.qingdao_weekly_change_wan_ton > 0 ? 'hot' : latest.qingdao_weekly_change_wan_ton < 0 ? 'cool' : 'neutral'
        },
        {
            label: '中国社会库存',
            value: latest.china_social_wan_ton == null ? '--' : `${formatNumber(latest.china_social_wan_ton, 2)} 万吨`,
            meta: latest.china_social_weekly_change_wan_ton == null ? '周频口径' : `${formatSignedNumber(latest.china_social_weekly_change_wan_ton, 2)} 万吨`,
            tone: latest.china_social_weekly_change_wan_ton > 0 ? 'hot' : latest.china_social_weekly_change_wan_ton < 0 ? 'cool' : 'neutral'
        },
        {
            label: '保税 / 一般贸易',
            value: latest.qingdao_bonded_wan_ton == null ? '--' : `${formatNumber(latest.qingdao_bonded_wan_ton, 2)} / ${formatNumber(latest.qingdao_general_trade_wan_ton, 2)}`,
            meta: '万吨',
            tone: 'neutral'
        },
        {
            label: isOfficialMirror ? 'RU仓单镜像' : '交易所仓单',
            value: `${formatNumber(latest.exchange_warrant_ton, 0)} 吨`,
            meta: isOfficialMirror ? (latest.official_date ? `${latest.official_date} · 公开转载` : '公开转载') : (latest.official_date || '--'),
            tone: 'neutral'
        },
        {
            label: 'RU仓单',
            value: `${formatNumber(latest.ru_warrant_ton, 0)} 吨`,
            meta: isOfficialMirror ? 'RU口径，NR/BR待恢复' : '天然橡胶可交割',
            tone: deviationTone
        },
        {
            label: 'RU近5年分位',
            value: `${formatNumber(percentile, 1)}%`,
            meta: '同一 ISO 周',
            tone: percentileTone
        },
        {
            label: '最近4周变化',
            value: `${formatSignedNumber(latest.four_week_change_ton, 0)} 吨`,
            meta: latest.four_week_change_ton >= 0 ? '累库' : '去库',
            tone: changeTone
        },
        {
            label: '日度变化',
            value: `${formatSignedNumber(latest.day_change_ton, 0)} 吨`,
            meta: '官方仓单日报',
            tone: latest.day_change_ton > 0 ? 'hot' : latest.day_change_ton < 0 ? 'cool' : 'neutral'
        },
        {
            label: '库存压力',
            value: `${level}`,
            meta: `${formatNumber(latest.pressure_score, 1)}/100 · ${dataMode}`,
            tone: pressureTone
        }
    ];

    container.innerHTML = cards.map((card) => `
        <article class="inventory-metric" data-tone="${card.tone}">
            <span>${card.label}</span>
            <strong>${card.value}</strong>
            <em>${card.meta}</em>
        </article>
    `).join('');
}

function renderInventoryEvidence(evidence) {
    const container = document.getElementById('inventory-evidence');
    if (!container) return;
    if (!evidence.length) {
        container.innerHTML = '<article><span>证据链</span><strong>--</strong><p>等待库存证据生成。</p></article>';
        return;
    }
    container.innerHTML = evidence.map((item) => `
        <article>
            <span>${item.title || '--'}</span>
            <strong>${item.value || '--'}</strong>
            <p>${item.copy || ''}</p>
        </article>
    `).join('');
}

function renderInventorySeasonalityChart(rows, latest) {
    const ctx = document.getElementById('inventorySeasonalityChart')?.getContext('2d');
    if (!ctx || !rows.length) return;

    const labels = rows.map((row) => row.week_label);
    const current = rows.map((row) => row.ru_warrant_ton);
    const min10 = rows.map((row) => row.min10_ton);
    const max10 = rows.map((row) => row.max10_ton);
    const avg5 = rows.map((row) => row.avg5_ton);
    const officialDates = rows.map((row) => row.source_date);

    if (inventorySeasonalityChartInstance) inventorySeasonalityChartInstance.destroy();

    inventorySeasonalityChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels,
            datasets: [
                {
                    label: '近5年区间下沿',
                    data: min10,
                    borderColor: 'rgba(108, 168, 200, 0)',
                    backgroundColor: 'rgba(108, 168, 200, 0.14)',
                    pointRadius: 0,
                    tension: 0.28,
                    fill: false
                },
                {
                    label: '近5年历史区间',
                    data: max10,
                    borderColor: 'rgba(108, 168, 200, 0.18)',
                    backgroundColor: 'rgba(108, 168, 200, 0.14)',
                    pointRadius: 0,
                    tension: 0.28,
                    fill: '-1'
                },
                {
                    label: `${latest?.source_year || ''} 官方RU仓单`,
                    data: current,
                    borderColor: '#2f8a67',
                    backgroundColor: 'rgba(47, 138, 103, 0.10)',
                    borderWidth: 3,
                    tension: 0.25,
                    spanGaps: true,
                    pointRadius: 2.2,
                    pointHoverRadius: 5
                },
                {
                    label: '近5年均值',
                    data: avg5,
                    borderColor: '#b9934d',
                    borderWidth: 2,
                    borderDash: [6, 4],
                    tension: 0.28,
                    pointRadius: 0
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { maxTicksLimit: 13 }
                },
                y: {
                    title: { display: true, text: 'RU仓单（吨）' }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `RU 仓单季节性：${latest?.source_year || '--'} vs 近5年官方区间`,
                    color: '#1f352e',
                    font: { size: 15, weight: '600' },
                    padding: { bottom: 4 }
                },
                subtitle: {
                    display: true,
                    text: '同一 ISO 周对齐，观察可交割仓单是否处在异常高/低分位。',
                    color: '#70877e',
                    font: { size: 12 },
                    padding: { bottom: 8 }
                },
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label(context) {
                            return `${context.dataset.label}: ${formatNumber(context.raw, 0)} 吨`;
                        },
                        afterBody(items) {
                            const index = items?.[0]?.dataIndex;
                            const officialDate = officialDates?.[index];
                            return officialDate ? `官方日期：${officialDate}` : '';
                        }
                    }
                }
            }
        }
    });
}

function renderInventoryStructureChart(rows, latest, socialInventory) {
    const ctx = document.getElementById('inventoryStructureChart')?.getContext('2d');
    if (!ctx || !rows.length) return;
    const latestRow = [...rows].reverse().find((row) => row.exchange_warrant_ton != null);
    if (!latestRow) return;
    const socialLatest = socialInventory?.latest || {};
    const hasSocialStructure = socialLatest.deep_color_wan_ton != null && socialLatest.light_color_wan_ton != null;
    const labels = hasSocialStructure ? ['深色胶社会库存', '浅色胶社会库存'] : ['RU 天然橡胶', 'NR 20号胶', 'BR 丁二烯橡胶'];
    const values = hasSocialStructure
        ? [socialLatest.deep_color_wan_ton, socialLatest.light_color_wan_ton]
        : [latestRow.ru_warrant_ton, latestRow.nr_warrant_ton, latestRow.br_warrant_ton];
    const title = hasSocialStructure
        ? `社会库存结构 ${socialLatest.date || latest?.social_source_date || '--'}`
        : `可交割仓单结构 ${latestRow.source_date || latestRow.week_label}`;
    const unit = hasSocialStructure ? '万吨' : '吨';

    if (inventoryStructureChartInstance) inventoryStructureChartInstance.destroy();

    inventoryStructureChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                backgroundColor: ['rgba(201, 164, 94, 0.78)', 'rgba(108, 168, 200, 0.82)', 'rgba(47, 138, 103, 0.74)'],
                borderColor: ['#b9934d', '#6ca8c8', '#2f8a67'],
                borderWidth: 1.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '62%',
            plugins: {
                title: {
                    display: true,
                    text: title,
                    color: '#1f352e',
                    font: { size: 14, weight: '600' }
                },
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label(context) {
                            return `${context.label}: ${formatNumber(context.raw, hasSocialStructure ? 2 : 0)} ${unit}`;
                        }
                    }
                }
            }
        }
    });
}

function renderInventoryWeeklyTable(rows, socialRows = []) {
    const tbody = document.querySelector('#inventory-weekly-table tbody');
    if (!tbody) return;
    if (socialRows.length) {
        tbody.innerHTML = socialRows.map((row) => {
            const signal = row.signal || '--';
            const tone = signal === '累库' ? 'hot' : signal === '去库' ? 'cool' : 'neutral';
            const change = row.weekly_change_wan_ton == null ? '' : `（${formatSignedNumber(row.weekly_change_wan_ton, 2)}）`;
            return `
                <tr>
                    <td>${row.date || '--'}</td>
                    <td>${formatNumber(row.qingdao_total_wan_ton, 2)}${change}</td>
                    <td>${row.bonded_wan_ton == null ? '--' : formatNumber(row.bonded_wan_ton, 2)}</td>
                    <td>${row.general_trade_wan_ton == null ? '--' : formatNumber(row.general_trade_wan_ton, 2)}</td>
                    <td>${formatNumber(row.china_social_wan_ton, 2)}</td>
                    <td><span class="signal-chip ${tone}">${signal}</span></td>
                </tr>
            `;
        }).join('');
        return;
    }
    if (!rows.length) {
        tbody.innerHTML = '<tr><td colspan="6">等待周度库存数据。</td></tr>';
        return;
    }
    tbody.innerHTML = rows.map((row) => {
        const tone = row.signal === '偏高' ? 'hot' : row.signal === '偏低' ? 'cool' : 'neutral';
        return `
            <tr>
                <td>${row.week || '--'}</td>
                <td>${row.source_date || '--'}</td>
                <td>${formatNumber(row.ru_warrant_ton, 0)}</td>
                <td>${formatNumber(row.percentile10, 1)}%</td>
                <td>${formatSignedNumber(row.deviation_5y_ton, 0)}</td>
                <td><span class="signal-chip ${tone}">${row.signal || '--'}</span></td>
            </tr>
        `;
    }).join('');
}

function renderInventorySourceStatus(items) {
    const container = document.getElementById('inventory-source-status');
    if (!container) return;
    if (!items.length) {
        container.innerHTML = '<article><strong>数据源待配置</strong><span>请运行库存更新脚本。</span></article>';
        return;
    }
    container.innerHTML = items.map((item) => `
        <article>
            <div>
                <strong>${item.name || '--'}</strong>
                <span>${item.frequency || '--'}</span>
            </div>
            <em>${item.status || '--'} · ${item.updated_at || '--'}</em>
            <p>${item.note || ''}</p>
        </article>
    `).join('');
}

function renderInventoryImplication(latest, summary) {
    const percentile = latest.percentile_5y ?? latest.percentile_10y;
    const change = latest.four_week_change_ton;
    const level = latest.pressure_level || '--';
    const percentileText = percentile >= 75 ? '历史偏高分位' : percentile <= 25 ? '历史偏低分位' : '历史中性分位';
    const changeText = change > 0 ? '最近 4 周累库' : change < 0 ? '最近 4 周去库' : '最近 4 周基本持平';
    const pressureText = level === '高'
        ? '对盘面反弹形成库存压制，需要现货和天气继续验证。'
        : level === '低'
            ? '库存端对价格支撑更强，若源头现货同步走强，供给扰动弹性会更高。'
            : '库存端信号中性，主要看天气扰动和泰国现货是否进一步确认。';
    setText(
        'inventory-implication',
        summary || `${latest.week || '--'} RU仓单处于${percentileText}，${changeText}，综合库存压力为${level}。${pressureText}`
    );
}

async function fetchAiSummary() {
    try {
        const response = await fetch(`ai_summary.json?v=${Date.now()}`);
        if (!response.ok) throw new Error('AI summary not found');
        const summary = await response.json();
        renderAiSummary(summary);
    } catch (error) {
        console.warn('AI summary unavailable:', error);
        renderAiSummary({
            status: 'missing',
            title: '边际情况待生成',
            analysis: '详细分析会结合泰国现货、主产区最新降雨扰动、不同胶种量价变化与期货反馈。',
            bullets: [],
            risks: [],
            generated_at: null
        });
    }
}

function renderAiSummary(summary) {
    const parts = [summary.stance, summary.analysis].filter(Boolean);
    aiSummaryText = parts.join(' ') || '暂无边际情况。';
    updateAiSummaryVisibility();
}

function getLatestYearSeriesDate(rows) {
    const allYears = Array.from(new Set(
        rows.flatMap((item) => Object.keys(item).filter((key) => /^\d{4}$/.test(key)))
    )).sort();
    const latestYear = allYears[allYears.length - 1];
    if (!latestYear) return null;

    const latest = [...rows]
        .filter((item) => item.date && item[latestYear] != null)
        .pop();

    return latest ? `${latestYear}-${latest.date}` : null;
}

function getLatestMonthlyDate(rows) {
    const latest = [...rows]
        .filter((item) => item.date)
        .sort((a, b) => a.date.localeCompare(b.date))
        .pop();
    return latest?.date || null;
}

function initAiSummaryGate() {
    aiSummaryUnlocked = localStorage.getItem(AI_SUMMARY_UNLOCK_KEY) === '1';
    const input = document.getElementById('ai-summary-password');
    const button = document.getElementById('ai-summary-unlock');

    const unlock = () => {
        if (input.value.trim() !== AI_SUMMARY_PASSWORD) {
            input.value = '';
            input.placeholder = '密码不正确';
            input.focus();
            return;
        }
        aiSummaryUnlocked = true;
        localStorage.setItem(AI_SUMMARY_UNLOCK_KEY, '1');
        updateAiSummaryVisibility();
    };

    button.addEventListener('click', unlock);
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') unlock();
    });

    updateAiSummaryVisibility();
}

function updateAiSummaryVisibility() {
    const analysis = document.getElementById('ai-summary-analysis');
    const auth = document.getElementById('ai-summary-auth');
    if (aiSummaryUnlocked) {
        analysis.textContent = aiSummaryText;
        analysis.classList.remove('is-locked');
        auth.style.display = 'none';
        return;
    }
    analysis.textContent = '请输入密码查看边际情况。';
    analysis.classList.add('is-locked');
    auth.style.display = 'flex';
}

function updateSongkhlaStats(songkhlaData) {
    const allYears = Array.from(new Set(
        songkhlaData.flatMap((item) => Object.keys(item).filter((key) => /^\d{4}$/.test(key)))
    )).sort();
    const latestYear = allYears[allYears.length - 1];
    if (!latestYear) return;

    const yearSeries = songkhlaData
        .filter((item) => item[latestYear] != null)
        .map((item) => ({
            year: latestYear,
            date: item.date,
            value: Number(item[latestYear])
        }));

    if (!yearSeries.length) return;

    const latest = yearSeries[yearSeries.length - 1];
    const previous = yearSeries.length > 1 ? yearSeries[yearSeries.length - 2].value : null;

    if (!latest) return;

    document.getElementById('stat-songkhla-latest').textContent = `${Number(latest.value).toFixed(2)} THB`;

    if (previous != null) {
        const delta = Number(latest.value) - previous;
        const sign = delta >= 0 ? '+' : '';
        document.getElementById('stat-songkhla-delta').textContent = `${latest.year} ${latest.date} | 日序列变化 ${sign}${delta.toFixed(2)} THB`;
    } else {
        document.getElementById('stat-songkhla-delta').textContent = `${latest.year} ${latest.date}`;
    }
}

function updateApromacStats(apromacData) {
    const sorted = [...apromacData].sort((a, b) => a.date.localeCompare(b.date));
    const latest = sorted[sorted.length - 1];
    if (!latest) return;

    document.getElementById('stat-apromac-latest').textContent = `${Number(latest.price).toFixed(0)} FCFA`;
    document.getElementById('stat-apromac-year').textContent = `最新月份 ${latest.date}`;
}

function updateDataDate(data) {
    const target = document.getElementById('stat-update-date');
    if (!target) return;

    const latestSongkhla = [...(data.songkhla || [])]
        .filter((item) => item.date)
        .map((item) => item.date)
        .sort()
        .pop();

    const latestApromac = [...(data.apromac || [])]
        .filter((item) => item.date)
        .map((item) => item.date)
        .sort()
        .pop();

    const parts = [];
    if (latestSongkhla) parts.push(`泰国现货至 ${latestSongkhla}`);
    if (latestApromac) parts.push(`科特迪瓦底价至 ${latestApromac}`);
    target.textContent = parts.length ? parts.join(' / ') : '--';
}

let songkhlaChartInstance = null;
let apromacChartInstance = null;
let thaiSupplyChartInstance = null;
let inventorySeasonalityChartInstance = null;
let inventoryStructureChartInstance = null;
let domesticFuturesSeasonalityChartInstance = null;

function getLatestLocalMarketRow(rows) {
    return [...rows]
        .filter((item) => item.date)
        .sort((a, b) => a.date.localeCompare(b.date))
        .pop() || null;
}

function getSupplyRegionLabel(item) {
    return item.region_cn || item.province_cn || item.region || item.province_th || '--';
}

function renderThaiSupply(supplyData) {
    renderThaiSupplyChart(supplyData.top_regions || []);
    renderThaiSupplyStats(supplyData);
}

function renderThaiSupplyChart(regions) {
    const ctx = document.getElementById('thaiSupplyChart')?.getContext('2d');
    if (!ctx) return;

    const displayRegions = regions.slice(0, 10).reverse();
    const labels = displayRegions.map((item) => getSupplyRegionLabel(item));
    const values = displayRegions.map((item) => Number(item.share_pct.toFixed(2)));

    if (thaiSupplyChartInstance) thaiSupplyChartInstance.destroy();

    thaiSupplyChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: '产量占全国比重',
                data: values,
                backgroundColor: displayRegions.map((item) => item.region_cn === '南部' ? THEME.goldBg : THEME.blueBg),
                borderColor: displayRegions.map((item) => item.region_cn === '南部' ? THEME.gold : THEME.blue),
                borderWidth: 1.2,
                borderRadius: 8,
                barThickness: 18
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    ticks: {
                        callback(value) {
                            return `${value}%`;
                        }
                    },
                    title: { display: true, text: '占全国产量比重' }
                },
                y: {
                    grid: { display: false }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label(context) {
                            return `占比 ${Number(context.raw).toFixed(2)}%`;
                        }
                    }
                }
            }
        }
    });
}

function renderThaiSupplyStats(supplyData) {
    const south = (supplyData.regions || []).find((item) => item.region_cn === '南部');
    const productionYoy = supplyData.total?.production_yoy_pct;
    const yieldYoy = supplyData.total?.yield_yoy_pct;
    const source = supplyData.source || {};
    const sourceUpdate = source.fetched_at || source.metadata_modified || supplyData.year;

    setUpdateBadge('supply-updated', sourceUpdate);
    setText(
        'supply-source-note',
        `数据来源：Thailand Office of Agricultural Economics（OAE）${supplyData.year || 2025} 年天然橡胶产量预测文件；更新频率：年度/官方文件发布时更新，本站每日校验源文件变动。源文件日期：${source.metadata_modified || '--'}。`
    );
    document.getElementById('module-supply-specs').innerHTML = renderSpecPills([
        '来源：OAE',
        `年度：${supplyData.year}`,
        '口径：区域产量预测',
        '单位：吨'
    ]);

    document.getElementById('supply-total-production').textContent =
        `${formatNumber(supplyData.total?.production_ton, 0)} 吨`;
    document.getElementById('supply-top5-share').textContent = south ? `南部 ${south.share_pct.toFixed(1)}%` : '--';
    document.getElementById('supply-price-coverage').textContent =
        `产量 ${formatDeviation(productionYoy)} / 单产 ${formatDeviation(yieldYoy)}`;
}

function renderSongkhlaChart(songkhlaData) {
    const ctx = document.getElementById('songkhlaChart').getContext('2d');
    const allKeys = new Set();

    songkhlaData.forEach((item) => {
        Object.keys(item).forEach((key) => {
            if (key !== 'date') allKeys.add(key);
        });
    });

    const sortedYears = Array.from(allKeys).sort().slice(-4);
    const labels = songkhlaData.map((item) => item.date);

    const datasets = sortedYears.map((year, index) => ({
        label: `${year} 年价格`,
        data: songkhlaData.map((item) => item[year] ?? null),
        borderColor: COLORS[index % COLORS.length],
        backgroundColor: 'transparent',
        borderWidth: index === sortedYears.length - 1 ? 3 : 2,
        tension: 0.25,
        spanGaps: true,
        pointRadius: 0,
        pointHoverRadius: 4
    }));

    if (songkhlaChartInstance) songkhlaChartInstance.destroy();

    songkhlaChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { maxTicksLimit: 12 }
                },
                y: {
                    title: { display: true, text: '价格 (THB)' }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: '泰国胶水现货季节性走势（泰铢/kg）',
                    color: '#1f352e',
                    font: { size: 15, weight: '600' },
                    padding: { bottom: 4 }
                },
                subtitle: {
                    display: true,
                    text: '按日历日对齐多年价格曲线，观察本年相对历史同期位置。',
                    color: '#70877e',
                    font: { size: 12 },
                    padding: { bottom: 10 }
                },
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        title(context) {
                            return `${context[0].label} | 泰国胶水现货（泰铢/kg）`;
                        }
                    }
                }
            }
        }
    });
}

function renderApromacChart(apromacData) {
    const ctx = document.getElementById('apromacChart').getContext('2d');
    const yearDataMap = {};

    apromacData.forEach((item) => {
        const [year, month] = item.date.split('-');
        if (!yearDataMap[year]) {
            yearDataMap[year] = Array(12).fill(null);
        }
        yearDataMap[year][Number.parseInt(month, 10) - 1] = item.price;
    });

    const displayYears = Object.keys(yearDataMap).sort().slice(-5);
    const labels = Array.from({ length: 12 }, (_, index) => `${index + 1}月`);

    const datasets = displayYears.map((year, index) => ({
        label: `${year} 年收购价`,
        data: yearDataMap[year],
        borderColor: COLORS[(index + 1) % COLORS.length],
        backgroundColor: 'transparent',
        borderWidth: 2,
        tension: 0.28,
        spanGaps: true,
        pointRadius: 2,
        pointHoverRadius: 5
    }));

    if (apromacChartInstance) apromacChartInstance.destroy();

    apromacChartInstance = new Chart(ctx, {
        type: 'line',
        data: { labels, datasets },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { mode: 'index', intersect: false },
            scales: {
                x: {
                    grid: { display: false }
                },
                y: {
                    beginAtZero: false,
                    title: { display: true, text: '收购价 (FCFA / KG)' }
                }
            },
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        title(context) {
                            return `${context[0].label} | 科特迪瓦底价`;
                        }
                    }
                }
            }
        }
    });
}

async function fetchQuotes() {
    const container = document.getElementById('futures-ticker-container');
    const status = document.getElementById('quote-refresh-status');

    try {
        let data;
        let isLive = true;
        try {
            const liveResponse = await fetch(`/api/futures?v=${Date.now()}`, { cache: 'no-store' });
            if (!liveResponse.ok) throw new Error('Live quote endpoint unavailable');
            data = await liveResponse.json();
        } catch (liveError) {
            isLive = false;
            const fallbackResponse = await fetch(`data_quotes.json?v=${Date.now()}`);
            if (!fallbackResponse.ok) throw liveError;
            data = await fallbackResponse.json();
        }
        if (!data.quotes || data.quotes.length === 0) {
            container.innerHTML = '<div class="error-msg">暂无行情数据</div>';
            return;
        }
        if (status) {
            status.textContent = `${data.price_basis || '最新价'} ${data.update_time || '--'}`;
            status.classList.toggle('fallback', !isLive);
        }

        let lastCategory = '';
        container.innerHTML = data.quotes.map((quote) => {
            const isUp = quote.percent >= 0;
            const color = isUp ? THEME.red : THEME.green;
            const arrow = isUp ? '▲' : '▼';
            const sign = isUp ? '+' : '';
            const link = `https://finance.sina.com.cn/futures/quotes/${quote.symbol}.shtml`;
            const category = quote.category || (['RU0', 'NR0', 'BR0'].includes(quote.symbol) ? '橡胶' : '农产品');
            const categoryLabel = category !== lastCategory ? `<div class="quote-category">${category}</div>` : '';
            lastCategory = category;

            return `
                ${categoryLabel}
                <a href="${link}" target="_blank" rel="noreferrer" class="quote-link" data-symbol="${quote.symbol}">
                    <div class="quote-item">
                        <div class="quote-header">
                            <span class="quote-symbol">${quote.symbol}</span>
                            <span class="quote-name">${quote.name}</span>
                        </div>
                        <div class="quote-body">
                            <span class="quote-price" style="color: ${color}">${quote.price.toLocaleString()}</span>
                            <span class="quote-change" style="color: ${color}">
                                ${arrow} ${sign}${quote.percent}%
                            </span>
                        </div>
                    </div>
                </a>
            `;
        }).join('');

        const focusSymbol = new URLSearchParams(window.location.search).get('focus');
        if (focusSymbol && !initialQuoteFocusApplied) {
            const focusLink = Array.from(container.querySelectorAll('.quote-link'))
                .find((element) => element.dataset.symbol === focusSymbol);
            if (focusLink) {
                focusLink.classList.add('is-focused');
                initialQuoteFocusApplied = true;
                window.requestAnimationFrame(() => {
                    focusLink.scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
            }
        }
    } catch (error) {
        console.error('Error fetching quotes:', error);
        if (status) {
            status.textContent = '行情加载失败 · 将在30秒后重试';
            status.classList.add('fallback');
        }
        container.innerHTML = '<div class="error-msg">行情加载超时</div>';
    }
}
