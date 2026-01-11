<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>新粉红浪潮：拉丁美洲的左翼转向</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Chart.js -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

    <!-- Google Fonts: Noto Sans SC for Chinese support -->
    <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;700;900&family=Montserrat:wght@700;900&display=swap" rel="stylesheet">

    <!-- Custom Config for Palette -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        'brand-dark': '#0F172A',   // 深蓝/岩石色
                        'brand-pink': '#EC4899',   // 活力粉 ("粉红浪潮")
                        'brand-cyan': '#06B6D4',   // 电子青
                        'brand-purple': '#8B5CF6', // 鲜艳紫
                        'brand-light': '#F1F5F9',  // 米白
                    },
                    fontFamily: {
                        'sans': ['"Noto Sans SC"', 'Roboto', 'sans-serif'],
                        'display': ['"Noto Sans SC"', 'Montserrat', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <style>
        /* 图表容器样式 - 强制要求 */
        .chart-container {
            position: relative;
            width: 100%;
            max-width: 600px; /* 大屏限制 */
            height: 350px;    /* 基础高度 */
            margin-left: auto;
            margin-right: auto;
        }

        @media (min-width: 768px) {
            .chart-container {
                height: 400px;
            }
        }

        /* 自定义滚动条 */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0F172A; 
        }
        ::-webkit-scrollbar-thumb {
            background: #EC4899; 
            border-radius: 4px;
        }
    </style>
    
    <!-- 
        配色方案: "活力与电子感" 
        为了适应中文语境，保持了原有的高对比度暗色模式。
    -->
    <!-- 无 SVG 确认: 文档中未使用 SVG 标签。所有图形均为 Canvas 或 HTML/CSS。 -->
    <!-- 无 Mermaid 确认: 未使用 Mermaid JS。 -->

</head>
<body class="bg-brand-dark text-brand-light font-sans antialiased selection:bg-brand-pink selection:text-white">

    <!-- 导航栏 / 头部 -->
    <nav class="sticky top-0 z-50 bg-brand-dark/95 backdrop-blur border-b border-white/10 p-4">
        <div class="max-w-7xl mx-auto flex justify-between items-center">
            <h1 class="text-xl font-display font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-brand-pink to-brand-cyan">
                拉美聚焦
            </h1>
            <div class="text-xs text-slate-400">深度研究：左翼转向</div>
        </div>
    </nav>

    <!-- 英雄区 (Hero Section) -->
    <header class="relative overflow-hidden py-20 px-6 text-center">
        <div class="max-w-4xl mx-auto relative z-10">
            <div class="inline-block px-4 py-1 mb-6 border border-brand-cyan/50 rounded-full text-brand-cyan text-sm font-bold tracking-wide uppercase">
                地缘政治分析
            </div>
            <h2 class="text-5xl md:text-7xl font-display font-black mb-6 leading-tight">
                新一轮<span class="text-brand-pink">粉红浪潮</span>
            </h2>
            <p class="text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
                深度解析拉丁美洲左翼政府的回归：
                <span class="text-white font-bold">是何 (What)</span>、
                <span class="text-white font-bold">为何 (Why)</span>、以及
                <span class="text-white font-bold">如何 (How)</span> 区别于过去。
            </p>
        </div>
        <!-- 抽象背景光晕 (CSS) -->
        <div class="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-brand-purple/10 rounded-full blur-3xl -z-0"></div>
    </header>

    <main class="max-w-6xl mx-auto px-6 pb-20 space-y-24">

        <!-- 第一部分：是何 (现状版图) -->
        <section id="what">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 class="text-3xl font-display font-bold mb-4 text-white border-l-4 border-brand-pink pl-4">
                        1. 是何 (The "What")：政治版图的变迁
                    </h3>
                    <p class="text-slate-300 mb-6 text-lg">
                        “粉红浪潮”指的是拉丁美洲民主国家向左翼政府倾斜的趋势。截至2020年代中期，该地区最大的几个经济体——巴西、墨西哥、哥伦比亚和智利——历史上首次同时由左翼领导人执政。
                    </p>
                    <div class="bg-white/5 p-6 rounded-xl border border-white/10">
                        <h4 class="text-brand-cyan font-bold mb-2">关键洞察</h4>
                        <p class="text-sm">与受益于大宗商品繁荣的第一波浪潮（2000年代初）不同，这第二波浪潮面临着更严峻的财政约束和更高的社会两极分化。</p>
                    </div>
                </div>

                <!-- 视觉图表：人口分布圆环图 -->
                <div class="bg-slate-800/50 p-6 rounded-2xl border border-white/5 shadow-xl">
                    <h4 class="text-center font-bold text-white mb-4">拉美人口治理分布</h4>
                    <div class="chart-container">
                        <canvas id="populationChart"></canvas>
                    </div>
                    <p class="text-center text-xs text-slate-400 mt-4">主要经济体的大致人口分布（2024年估算）。</p>
                </div>
            </div>

            <!-- 领导人卡片 (HTML Grid) -->
            <div class="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div class="bg-slate-800 p-4 rounded-lg border-t-4 border-brand-pink text-center">
                    <div class="text-4xl mb-2">🇧🇷</div>
                    <div class="font-bold text-white">卢拉 (Lula)</div>
                    <div class="text-xs text-brand-pink uppercase">巴西</div>
                </div>
                <div class="bg-slate-800 p-4 rounded-lg border-t-4 border-brand-cyan text-center">
                    <div class="text-4xl mb-2">🇨🇴</div>
                    <div class="font-bold text-white">佩特罗 (Petro)</div>
                    <div class="text-xs text-brand-cyan uppercase">哥伦比亚</div>
                </div>
                <div class="bg-slate-800 p-4 rounded-lg border-t-4 border-brand-purple text-center">
                    <div class="text-4xl mb-2">🇨🇱</div>
                    <div class="font-bold text-white">博里奇 (Boric)</div>
                    <div class="text-xs text-brand-purple uppercase">智利</div>
                </div>
                <div class="bg-slate-800 p-4 rounded-lg border-t-4 border-green-500 text-center">
                    <div class="text-4xl mb-2">🇲🇽</div>
                    <div class="font-bold text-white">辛鲍姆 (Sheinbaum)</div>
                    <div class="text-xs text-green-500 uppercase">墨西哥</div>
                </div>
            </div>
        </section>

        <!-- 第二部分：为何 (驱动因素) -->
        <section id="why" class="relative">
            <h3 class="text-3xl font-display font-bold mb-8 text-white border-l-4 border-brand-cyan pl-4">
                2. 为何 (The "Why")：变革的驱动力
            </h3>
            
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- 文本语境 -->
                <div class="lg:col-span-1 space-y-6">
                    <p class="text-slate-300">
                        这种转变与其说是意识形态的皈依，不如说是“惩罚性投票”（反对现任者）。疫情带来的经济冲击、增长停滞和持续的不平等，激发了民众对变革的渴望。
                    </p>
                    <ul class="space-y-4">
                        <li class="flex items-start">
                            <span class="text-brand-pink mr-2">➤</span>
                            <span class="text-sm text-slate-300"><strong>不平等：</strong> 拉美仍然是全球贫富差距最大的地区。</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-brand-pink mr-2">➤</span>
                            <span class="text-sm text-slate-300"><strong>通货膨胀：</strong> 后疫情时代的价格飙升侵蚀了购买力。</span>
                        </li>
                        <li class="flex items-start">
                            <span class="text-brand-pink mr-2">➤</span>
                            <span class="text-sm text-slate-300"><strong>制度不信任：</strong> 传统政党崩溃，选民转向局外人或改革派。</span>
                        </li>
                    </ul>
                </div>

                <!-- 图表：经济不平等数据 -->
                <div class="lg:col-span-2 bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <h4 class="font-bold text-white mb-2">不平等的引擎</h4>
                    <p class="text-xs text-slate-400 mb-6">前10%富裕人口 vs. 后40%底层人口的收入份额（代表性数据）</p>
                    <div class="chart-container">
                        <canvas id="inequalityChart"></canvas>
                    </div>
                </div>
            </div>

            <!-- 时间线 (HTML/CSS) -->
            <div class="mt-16">
                <h4 class="text-center font-bold text-xl mb-8 text-white">左翼浪潮的演变</h4>
                <div class="relative flex flex-col md:flex-row justify-between items-start md:items-center space-y-8 md:space-y-0 md:space-x-4">
                    <!-- 连接线 -->
                    <div class="absolute top-8 left-4 md:left-0 md:top-1/2 w-1 md:w-full h-[80%] md:h-1 bg-slate-700 -z-0"></div>

                    <!-- 节点 1 -->
                    <div class="relative z-10 w-full md:w-1/3 bg-slate-900 p-4 border border-brand-purple rounded-lg shadow-lg">
                        <div class="text-brand-purple font-bold text-lg mb-1">2000年代：繁荣期</div>
                        <p class="text-xs text-slate-400">查韦斯 (委), 卢拉 1.0 (巴), 基什内尔 (阿)。受大宗商品价格高企推动，社会支出高。</p>
                    </div>
                    
                    <!-- 节点 2 -->
                    <div class="relative z-10 w-full md:w-1/3 bg-slate-900 p-4 border border-slate-600 rounded-lg shadow-lg">
                        <div class="text-slate-300 font-bold text-lg mb-1">2010年代：反噬期</div>
                        <p class="text-xs text-slate-400">保守派反弹 (马克里, 博索纳罗)。腐败丑闻 (洗车行动)。经济停滞。</p>
                    </div>

                    <!-- 节点 3 -->
                    <div class="relative z-10 w-full md:w-1/3 bg-slate-900 p-4 border border-brand-pink rounded-lg shadow-lg">
                        <div class="text-brand-pink font-bold text-lg mb-1">2020年代：复苏期</div>
                        <p class="text-xs text-slate-400">佩特罗 (哥), 博里奇 (智), 卢拉 3.0。关注环保主义、身份权利和务实改革。</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- 第三部分：如何 (治理与差异) -->
        <section id="how">
            <h3 class="text-3xl font-display font-bold mb-8 text-white border-l-4 border-brand-purple pl-4">
                3. 如何 (The "How")：政策的多样性
            </h3>
            <p class="text-slate-300 mb-8 max-w-3xl">
                并非所有的“粉红”政府都是一样的。在<strong>民主/进步左派</strong>（智利、巴西、哥伦比亚）和<strong>威权/旧左派</strong>（委内瑞拉、尼加拉瓜、古巴）之间存在着关键的区别。
            </p>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- 雷达图：政策优先级 -->
                <div class="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <div class="flex justify-between items-center mb-4">
                        <h4 class="font-bold text-white">政策优先级矩阵</h4>
                        <div class="flex gap-2 text-xs">
                            <span class="px-2 py-1 rounded bg-brand-cyan/20 text-brand-cyan">新左派</span>
                            <span class="px-2 py-1 rounded bg-slate-600/20 text-slate-400">旧左派</span>
                        </div>
                    </div>
                    <div class="chart-container">
                        <canvas id="radarChart"></canvas>
                    </div>
                    <p class="text-center text-xs text-slate-400 mt-4">
                        “新左派”优先考虑环保和少数群体权利，而“旧左派”则专注于国家资源控制。
                    </p>
                </div>

                <!-- 散点图：政治光谱 -->
                <div class="bg-slate-800/50 p-6 rounded-2xl border border-white/5">
                    <h4 class="font-bold text-white mb-4">治理光谱分析</h4>
                    <div class="chart-container">
                        <canvas id="scatterChart"></canvas>
                    </div>
                    <p class="text-center text-xs text-slate-400 mt-4">
                        基于民主制度强度 (Y轴) vs. 国家经济干预 (X轴) 的领导人定位。
                    </p>
                </div>
            </div>
        </section>

        <!-- 结语 -->
        <footer class="bg-gradient-to-br from-brand-pink/20 to-brand-dark p-8 rounded-3xl text-center border border-white/10">
            <h3 class="text-2xl font-bold text-white mb-4">未来展望</h3>
            <p class="text-slate-300 max-w-2xl mx-auto mb-6">
                当前的粉红浪潮是脆弱的。没有了2000年代的大宗商品繁荣，领导人们面临着“治理陷阱”：民众对社会服务的高需求与有限的预算之间的矛盾。能否在维持民主规范的同时进行财政改革，将决定这一代领导人的历史遗产。
            </p>
            <div class="text-xs text-slate-500 font-mono">
                分析生成：Canvas Infographics • 数据来源：世界银行, 拉加经委会 (ECLAC), 2024选举数据
            </div>
        </footer>

    </main>

    <script>
        // --- 工具函数 ---
        
        // 16字符标签换行函数 (处理长文本)
        // 中文语境下，我们按字数简单分割，或者假定输入已经是数组
        function splitLabel(str, maxLen = 10) { // 中文稍微缩短阈值
            if (Array.isArray(str)) return str;
            if (str.length <= maxLen) return str;
            // 简单按长度切分，不依赖空格
            const result = [];
            for (let i = 0; i < str.length; i += maxLen) {
                result.push(str.substring(i, i + maxLen));
            }
            return result;
        }

        // 通用 Tooltip 配置 (处理多行标签)
        const commonTooltipConfig = {
            callbacks: {
                title: function(tooltipItems) {
                    const item = tooltipItems[0];
                    let label = item.chart.data.labels[item.dataIndex];
                    if (Array.isArray(label)) {
                        return label.join(''); // 中文连接不需要空格
                    } else {
                        return label;
                    }
                }
            }
        };

        // 通用图表选项
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                tooltip: commonTooltipConfig,
                legend: {
                    labels: {
                        color: '#94a3b8', // Slate-400
                        font: { family: '"Noto Sans SC"', size: 12 }
                    }
                }
            },
            layout: {
                padding: 10
            }
        };

        // --- 图表数据与初始化 ---

        // 1. 圆环图：人口分布
        const ctxPop = document.getElementById('populationChart').getContext('2d');
        const popData = {
            labels: ['左翼政府管辖', '右翼/中间派管辖'],
            datasets: [{
                data: [82, 18], // 近似数据
                backgroundColor: ['#EC4899', '#334155'],
                borderWidth: 0,
                hoverOffset: 4
            }]
        };
        
        new Chart(ctxPop, {
            type: 'doughnut',
            data: popData,
            options: {
                ...baseOptions,
                cutout: '60%',
                plugins: {
                    ...baseOptions.plugins,
                    legend: { position: 'bottom', labels: { color: '#cbd5e1' } },
                    title: {
                        display: true,
                        text: '左翼政府管辖人口占比 %',
                        color: '#fff',
                        font: { size: 14 }
                    }
                }
            }
        });

        // 2. 条形图：不平等指标
        const ctxIneq = document.getElementById('inequalityChart').getContext('2d');
        const ineqLabels = [
            '巴西 (高不平等)', 
            '哥伦比亚 (高不平等)', 
            '智利 (中等)', 
            '墨西哥 (中等)', 
            '乌拉圭 (低不平等)'
        ];
        
        new Chart(ctxIneq, {
            type: 'bar',
            data: {
                labels: ineqLabels.map(l => splitLabel(l, 8)), // 中文换行阈值设为8
                datasets: [
                    {
                        label: '前10%富裕人口收入占比',
                        data: [42, 39, 36, 34, 28],
                        backgroundColor: '#EC4899',
                        borderRadius: 4
                    },
                    {
                        label: '后40%人口收入占比',
                        data: [10, 11, 13, 14, 20],
                        backgroundColor: '#06B6D4',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                ...baseOptions,
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#94a3b8' }
                    }
                }
            }
        });

        // 3. 雷达图：政策优先级
        const ctxRadar = document.getElementById('radarChart').getContext('2d');
        new Chart(ctxRadar, {
            type: 'radar',
            data: {
                labels: [
                    '环境保护', 
                    '原住民权利', 
                    '财政责任', 
                    '国家资源控制', 
                    '社会福利支出',
                    '区域一体化'
                ], // 中文标签较短，不需要分割
                datasets: [{
                    label: '新左派 (如博里奇/佩特罗)',
                    data: [90, 85, 60, 40, 85, 70],
                    borderColor: '#06B6D4', // 青色
                    backgroundColor: 'rgba(6, 182, 212, 0.2)',
                    pointBackgroundColor: '#06B6D4',
                    borderWidth: 2
                }, {
                    label: '旧左派 (如奥尔特加/马杜罗)',
                    data: [30, 40, 20, 95, 60, 50],
                    borderColor: '#94a3b8', // 灰色 (静默)
                    backgroundColor: 'rgba(148, 163, 184, 0.2)',
                    pointBackgroundColor: '#94a3b8',
                    borderWidth: 2,
                    borderDash: [5, 5]
                }]
            },
            options: {
                ...baseOptions,
                scales: {
                    r: {
                        angleLines: { color: '#334155' },
                        grid: { color: '#334155' },
                        pointLabels: {
                            color: '#e2e8f0',
                            font: { size: 12, family: '"Noto Sans SC"' }
                        },
                        ticks: { display: false }
                    }
                }
            }
        });

        // 4. 散点图：政治光谱
        const ctxScatter = document.getElementById('scatterChart').getContext('2d');
        
        // 数据格式: x (经济: 0 市场 -> 100 国家), y (民主: 0 独裁 -> 100 自由民主)
        const scatterData = [
            { x: 40, y: 90, label: '博里奇 (智利)', country: 'CL' },
            { x: 50, y: 85, label: '卢拉 (巴西)', country: 'BR' },
            { x: 60, y: 80, label: '佩特罗 (哥伦比亚)', country: 'CO' },
            { x: 55, y: 65, label: '洛佩斯/辛鲍姆 (墨西哥)', country: 'MX' },
            { x: 85, y: 20, label: '马杜罗 (委内瑞拉)', country: 'VE' },
            { x: 90, y: 15, label: '奥尔特加 (尼加拉瓜)', country: 'NI' },
            { x: 65, y: 55, label: '阿尔塞 (玻利维亚)', country: 'BO' }
        ];

        new Chart(ctxScatter, {
            type: 'scatter',
            data: {
                datasets: [{
                    label: '领导人',
                    data: scatterData,
                    backgroundColor: (ctx) => {
                        const val = ctx.raw?.y;
                        // 颜色基于民主分数：青色代表民主，粉色/红色代表威权倾向
                        return val > 60 ? '#06B6D4' : '#EC4899';
                    },
                    pointRadius: 8,
                    pointHoverRadius: 10
                }]
            },
            options: {
                ...baseOptions,
                plugins: {
                    ...baseOptions.plugins,
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return context.raw.label + ` (民主度: ${context.raw.y}, 干预度: ${context.raw.x})`;
                            }
                        }
                    },
                    annotation: {
                        // Chart.js annotation plugin 未加载
                    }
                },
                scales: {
                    x: {
                        type: 'linear',
                        position: 'bottom',
                        title: { display: true, text: '国家经济干预程度 →', color: '#94a3b8' },
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' },
                        min: 20, max: 100
                    },
                    y: {
                        title: { display: true, text: '民主制度强度 →', color: '#94a3b8' },
                        grid: { color: '#334155' },
                        ticks: { color: '#94a3b8' },
                        min: 0, max: 100
                    }
                }
            }
        });

    </script>
</body>
</html>