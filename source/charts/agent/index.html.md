<!DOCTYPE html>
<html lang="zh-CN" class="scroll-smooth">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>2026 AI Agent 生态全景报告</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;700&display=swap');
        
        /* 添加全局平滑滚动支持 */
        html {
            scroll-behavior: smooth;
        }

        body {
            font-family: 'Noto Sans SC', sans-serif;
            background-color: #0f172a; /* Slate 900 */
            color: #e2e8f0; /* Slate 200 */
        }
        .glass-card {
            background: rgba(30, 41, 59, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .gradient-text {
            background: linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
        .timeline-line {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 2px;
            background: #334155;
            transform: translateX(-50%);
        }
        /* Hide scrollbar for smooth look */
        ::-webkit-scrollbar {
            width: 8px;
        }
        ::-webkit-scrollbar-track {
            background: #0f172a;
        }
        ::-webkit-scrollbar-thumb {
            background: #334155;
            border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #475569;
        }
    </style>
</head>
<body class="antialiased selection:bg-indigo-500 selection:text-white">

    <!-- Navigation -->
    <nav class="fixed w-full z-50 glass-card border-b border-slate-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex items-center justify-between h-16">
                <div class="flex items-center">
                    <i class="fa-solid fa-brain text-indigo-400 text-2xl mr-2"></i>
                    <span class="font-bold text-xl tracking-tight">AI Agent <span class="text-indigo-400">Insight</span></span>
                </div>
                <div class="hidden md:block">
                    <div class="ml-10 flex items-baseline space-x-4">
                        <a href="#hero" class="hover:text-white px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 transition">首页</a>
                        <a href="#comparison" class="hover:text-white px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 transition">核心对比</a>
                        <a href="#landscape" class="hover:text-white px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 transition">全球竞品</a>
                        <a href="#chart-section" class="hover:text-white px-3 py-2 rounded-md text-sm font-medium text-slate-300 hover:bg-slate-800 transition">能力雷达</a>
                    </div>
                </div>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="hero" class="pt-32 pb-20 px-4 text-center relative overflow-hidden scroll-mt-24">
        <div class="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
            <div class="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
            <div class="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <h1 class="text-5xl md:text-6xl font-extrabold mb-6">
            <span class="block">当 AI 开始</span>
            <span class="gradient-text">自主接管世界</span>
        </h1>
        <p class="mt-4 max-w-2xl mx-auto text-xl text-slate-400">
            从 Google Opal 的应用构建，到 Manus 的全自动执行。<br>
            解析 2025-2026 年 AI Agent 的终极形态之争。
        </p>
        <div class="mt-10 flex justify-center gap-4">
            <a href="#comparison" class="px-8 py-3 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition shadow-lg shadow-indigo-500/30">开始探索</a>
            <a href="#chart-section" class="px-8 py-3 rounded-full glass-card hover:bg-slate-800 transition text-slate-200 font-semibold">查看数据</a>
        </div>
    </section>

    <!-- Core Comparison Section -->
    <section id="comparison" class="py-20 bg-slate-900/50 scroll-mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-white">核心概念辨析</h2>
                <p class="mt-4 text-slate-400 max-w-3xl mx-auto">
                    同样是 AI，为什么 Manus 和 Opal 是完全不同的物种？<br>
                    核心区别在于：你是需要一个<strong>一次性的执行者</strong>，还是一个<strong>可复用的工具生成器</strong>。
                </p>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <!-- Manus Card -->
                <div class="glass-card rounded-2xl p-8 hover:border-indigo-500 transition duration-300 group">
                    <div class="flex items-center justify-between mb-6">
                        <div class="bg-indigo-500/20 p-3 rounded-lg">
                            <i class="fa-solid fa-user-tie text-indigo-400 text-2xl"></i>
                        </div>
                        <span class="text-xs font-bold px-2 py-1 rounded bg-indigo-900 text-indigo-300">通用 Agent</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-2 group-hover:text-indigo-400 transition">Manus</h3>
                    <p class="text-sm text-indigo-300 mb-4 font-mono">by Monica / Butterfly Effect</p>
                    <p class="text-slate-400 mb-6 leading-relaxed">
                        **定位：数字员工 (The Doer)**<br>
                        Manus 的本质是“替代人类操作”。你给它一个模糊的目标，它通过操作浏览器、写代码、查资料，全自动交付结果。它模拟的是一个人类员工的行为模式。
                    </p>
                    <div class="bg-slate-800/50 rounded-lg p-4 mb-4">
                         <h4 class="text-sm font-bold text-white mb-2">思维模式：</h4>
                         <p class="text-xs text-slate-400">"收到目标 -> 拆解步骤 -> 遇到困难 -> 自主解决 -> 交付成果"</p>
                    </div>
                    <ul class="space-y-3 text-slate-300 text-sm">
                        <li class="flex items-start"><i class="fa-solid fa-check text-green-400 mt-1 mr-2"></i> 场景：我要订票、我要做调研报告。</li>
                        <li class="flex items-start"><i class="fa-solid fa-check text-green-400 mt-1 mr-2"></i> 核心：异步执行，长流程自动化。</li>
                        <li class="flex items-start"><i class="fa-solid fa-check text-green-400 mt-1 mr-2"></i> 交互：像在跟秘书说话。</li>
                    </ul>
                </div>

                <!-- Google Opal Card -->
                <div class="glass-card rounded-2xl p-8 hover:border-emerald-500 transition duration-300 group">
                    <div class="flex items-center justify-between mb-6">
                        <div class="bg-emerald-500/20 p-3 rounded-lg">
                            <i class="fa-solid fa-screwdriver-wrench text-emerald-400 text-2xl"></i>
                        </div>
                        <span class="text-xs font-bold px-2 py-1 rounded bg-emerald-900 text-emerald-300">应用构建平台</span>
                    </div>
                    <h3 class="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition">Google Opal</h3>
                    <p class="text-sm text-emerald-300 mb-4 font-mono">by Google</p>
                    <p class="text-slate-400 mb-6 leading-relaxed">
                        **定位：应用工厂 (The Builder)**<br>
                        Opal 的本质是“降低开发门槛”。你告诉它你的需求，它为你生成一个专属的 AI 应用程序或工作流。它的产出物是 App，而不是一次性的任务结果。
                    </p>
                     <div class="bg-slate-800/50 rounded-lg p-4 mb-4">
                         <h4 class="text-sm font-bold text-white mb-2">思维模式：</h4>
                         <p class="text-xs text-slate-400">"理解需求 -> 设计逻辑 -> 封装能力 -> 生成UI -> 交付工具"</p>
                    </div>
                    <ul class="space-y-3 text-slate-300 text-sm">
                        <li class="flex items-start"><i class="fa-solid fa-check text-green-400 mt-1 mr-2"></i> 场景：帮我做一个库存管理 App。</li>
                        <li class="flex items-start"><i class="fa-solid fa-check text-green-400 mt-1 mr-2"></i> 核心：生成工具 (No-code)，标准化流程。</li>
                        <li class="flex items-start"><i class="fa-solid fa-check text-green-400 mt-1 mr-2"></i> 交互：像在跟工程师说话。</li>
                    </ul>
                </div>
            </div>

            <!-- Comparison Table Section -->
            <div class="mt-12">
                 <h3 class="text-xl font-bold text-white mb-6 text-center">深度维度对比</h3>
                 <div class="glass-card rounded-xl overflow-hidden">
                     <div class="grid grid-cols-3 bg-slate-800/50 p-4 border-b border-slate-700 font-bold text-sm text-slate-300">
                         <div>维度</div>
                         <div class="text-indigo-400">Manus (Agent)</div>
                         <div class="text-emerald-400">Google Opal (Platform)</div>
                     </div>
                     <div class="grid grid-cols-3 p-4 border-b border-slate-700/50 hover:bg-slate-800/30 transition">
                         <div class="text-slate-400 text-sm flex items-center">用户行为</div>
                         <div class="text-white text-sm">下达任务 ("帮我把这件事做完")</div>
                         <div class="text-white text-sm">下达指令 ("帮我开发一个App")</div>
                     </div>
                     <div class="grid grid-cols-3 p-4 border-b border-slate-700/50 hover:bg-slate-800/30 transition">
                         <div class="text-slate-400 text-sm flex items-center">交付物</div>
                         <div class="text-white text-sm">最终结果 (文件、报告、预订成功)</div>
                         <div class="text-white text-sm">生产工具 (可长期使用的应用/工作流)</div>
                     </div>
                     <div class="grid grid-cols-3 p-4 hover:bg-slate-800/30 transition">
                         <div class="text-slate-400 text-sm flex items-center">适用性</div>
                         <div class="text-white text-sm">探索性、临时性、复杂的单次任务</div>
                         <div class="text-white text-sm">重复性、标准化、需长期复用的任务</div>
                     </div>
                 </div>
            </div>
            
             <!-- Astra vs Manus Mini Section -->
             <div class="mt-12 glass-card rounded-2xl p-8 border-l-4 border-purple-500">
                <div class="flex flex-col md:flex-row items-center gap-6">
                    <div class="flex-1">
                        <h3 class="text-xl font-bold text-white mb-2">
                            <i class="fa-solid fa-glasses text-purple-400 mr-2"></i> 
                            Project Astra vs. Manus
                        </h3>
                        <p class="text-slate-400 text-sm leading-relaxed">
                            如果说 Manus 是坐在电脑前的<strong>“操作者”</strong>（异步、重逻辑），那么 Google Project Astra 就是戴着眼镜陪你探索物理世界的<strong>“副驾驶”</strong>（实时、重感知）。Astra 的核心在于毫秒级的多模态交互，它能“看懂”你摄像头的画面；而 Manus 的核心在于接管鼠标键盘帮你干活。
                        </p>
                    </div>
                    <div class="flex gap-2">
                         <span class="px-3 py-1 bg-slate-800 rounded text-xs text-slate-400">Astra = 实时感知</span>
                         <span class="px-3 py-1 bg-slate-800 rounded text-xs text-slate-400">Manus = 异步执行</span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Timeline Section -->
    <section id="landscape" class="py-20 relative scroll-mt-24">
        <div class="max-w-4xl mx-auto px-4">
            <div class="text-center mb-16">
                <h2 class="text-3xl font-bold text-white">全球 Agent 进化史</h2>
                <p class="mt-2 text-slate-400">Manus 不是第一个，但它是让普通人触手可及的那个。</p>
            </div>

            <div class="relative">
                <div class="timeline-line hidden md:block"></div>
                
                <!-- Timeline Item 1 -->
                <div class="relative z-10 mb-12 flex flex-col md:flex-row items-center">
                    <div class="md:w-1/2 md:pr-10 text-center md:text-right mb-4 md:mb-0">
                        <span class="text-indigo-400 font-bold text-lg">2022</span>
                        <h3 class="text-xl font-bold text-white">Adept AI (ACT-1)</h3>
                        <p class="text-slate-400 text-sm mt-2">真正的鼻祖。最早展示了自然语言控制 Salesforce 的 Demo。</p>
                    </div>
                    <div class="w-8 h-8 bg-slate-800 border-4 border-indigo-500 rounded-full flex-shrink-0"></div>
                    <div class="md:w-1/2 md:pl-10 text-center md:text-left hidden md:block">
                        <span class="px-2 py-1 bg-slate-800 text-xs rounded text-slate-500">概念验证</span>
                    </div>
                </div>

                <!-- Timeline Item 2 -->
                <div class="relative z-10 mb-12 flex flex-col md:flex-row items-center">
                    <div class="md:w-1/2 md:pr-10 text-center md:text-right hidden md:block">
                        <span class="px-2 py-1 bg-slate-800 text-xs rounded text-slate-500">垂直突破</span>
                    </div>
                    <div class="w-8 h-8 bg-slate-800 border-4 border-emerald-500 rounded-full flex-shrink-0"></div>
                    <div class="md:w-1/2 md:pl-10 text-center md:text-left mt-4 md:mt-0">
                        <span class="text-emerald-400 font-bold text-lg">2024.03</span>
                        <h3 class="text-xl font-bold text-white">Devin (Cognition AI)</h3>
                        <p class="text-slate-400 text-sm mt-2">世界上第一个 AI 软件工程师。证明了 Agent 可以长时间自主工作。</p>
                    </div>
                </div>

                <!-- Timeline Item 3 -->
                <div class="relative z-10 mb-12 flex flex-col md:flex-row items-center">
                    <div class="md:w-1/2 md:pr-10 text-center md:text-right mb-4 md:mb-0">
                        <span class="text-purple-400 font-bold text-lg">2024.10</span>
                        <h3 class="text-xl font-bold text-white">Claude Computer Use</h3>
                        <p class="text-slate-400 text-sm mt-2">Anthropic 将“操作电脑”变成了标准 API，为行业打下基建。</p>
                    </div>
                    <div class="w-8 h-8 bg-slate-800 border-4 border-purple-500 rounded-full flex-shrink-0"></div>
                    <div class="md:w-1/2 md:pl-10 text-center md:text-left hidden md:block">
                        <span class="px-2 py-1 bg-slate-800 text-xs rounded text-slate-500">基建完善</span>
                    </div>
                </div>

                <!-- Timeline Item 4 -->
                <div class="relative z-10 flex flex-col md:flex-row items-center">
                    <div class="md:w-1/2 md:pr-10 text-center md:text-right hidden md:block">
                        <span class="px-2 py-1 bg-indigo-600 text-xs rounded text-white shadow-lg shadow-indigo-500/50">当前阶段</span>
                    </div>
                    <div class="w-8 h-8 bg-indigo-500 border-4 border-white rounded-full flex-shrink-0 shadow-[0_0_15px_rgba(99,102,241,0.6)]"></div>
                    <div class="md:w-1/2 md:pl-10 text-center md:text-left mt-4 md:mt-0">
                        <span class="text-indigo-400 font-bold text-lg">2025-2026</span>
                        <h3 class="text-xl font-bold text-white">Manus & OpenAI Operator</h3>
                        <p class="text-slate-400 text-sm mt-2">消费级爆发。无需代码，开箱即用，真正面向大众的“全能数字员工”。</p>
                    </div>
                </div>

            </div>
        </div>
    </section>

     <!-- Data Visualization Section -->
    <section id="chart-section" class="py-20 bg-slate-900 scroll-mt-24">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 class="text-3xl font-bold text-white mb-10 text-center">能力维度雷达图</h2>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div class="h-[400px] w-full glass-card p-4 rounded-2xl flex items-center justify-center">
                    <canvas id="agentRadarChart"></canvas>
                </div>
                <div>
                    <h3 class="text-2xl font-bold text-white mb-4">主要竞品分析</h3>
                    <div class="space-y-6">
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-indigo-400 font-bold">Manus</span>
                                <span class="text-slate-400 text-sm">综合能力最强</span>
                            </div>
                            <p class="text-sm text-slate-400">在通用任务处理和长流程执行上表现均衡，产品化程度高。</p>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-purple-400 font-bold">Project Astra</span>
                                <span class="text-slate-400 text-sm">感知与速度之王</span>
                            </div>
                            <p class="text-sm text-slate-400">在实时语音和视觉理解上遥遥领先，但主要侧重于辅助而非独立操作电脑。</p>
                        </div>
                        <div>
                            <div class="flex justify-between mb-1">
                                <span class="text-emerald-400 font-bold">Devin</span>
                                <span class="text-slate-400 text-sm">编程专家</span>
                            </div>
                            <p class="text-sm text-slate-400">在代码编写和Debug深度上依然是天花板，但通用网页操作不如 Manus 灵活。</p>
                        </div>
                    </div>
                    
                    <div class="mt-8 p-4 bg-slate-800 rounded-lg border border-slate-700">
                        <h4 class="text-sm font-bold text-slate-300 mb-2">什么是 NotebookLM 的"导演模式"？</h4>
                        <p class="text-xs text-slate-400 mb-2">你提到的个性化视频定制主要依赖两个参数：</p>
                        <div class="grid grid-cols-2 gap-2 text-xs">
                            <div class="bg-slate-700 p-2 rounded">
                                <span class="block text-blue-300 font-bold">Steering Prompts</span>
                                控制内容逻辑、语气和受众。
                            </div>
                            <div class="bg-slate-700 p-2 rounded">
                                <span class="block text-pink-300 font-bold">Visual Prompts</span>
                                利用生成模型定制画面风格。
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="py-10 border-t border-slate-800 text-center text-slate-500 text-sm">
        <p>&copy; 2026 AI Insight Report. Created based on current market analysis.</p>
        <p class="mt-2">Products mentioned: Manus, Google Opal, Project Astra, Devin, Claude.</p>
    </footer>

    <!-- Chart JS Script -->
    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const ctx = document.getElementById('agentRadarChart').getContext('2d');
            
            // Custom Chart Configuration
            const data = {
                labels: [
                    '通用网页操作', 
                    '代码深度 (Coding)', 
                    '实时多模态 (Vision/Audio)', 
                    '易用性 (Out of Box)', 
                    '响应速度'
                ],
                datasets: [{
                    label: 'Manus',
                    data: [95, 80, 50, 95, 70],
                    fill: true,
                    backgroundColor: 'rgba(99, 102, 241, 0.2)', // Indigo
                    borderColor: 'rgb(99, 102, 241)',
                    pointBackgroundColor: 'rgb(99, 102, 241)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(99, 102, 241)'
                }, {
                    label: 'Project Astra',
                    data: [40, 50, 100, 85, 98],
                    fill: true,
                    backgroundColor: 'rgba(168, 85, 247, 0.2)', // Purple
                    borderColor: 'rgb(168, 85, 247)',
                    pointBackgroundColor: 'rgb(168, 85, 247)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(168, 85, 247)'
                }, {
                    label: 'Devin',
                    data: [60, 100, 30, 60, 60],
                    fill: true,
                    backgroundColor: 'rgba(16, 185, 129, 0.2)', // Emerald
                    borderColor: 'rgb(16, 185, 129)',
                    pointBackgroundColor: 'rgb(16, 185, 129)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgb(16, 185, 129)'
                }]
            };

            const config = {
                type: 'radar',
                data: data,
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    elements: {
                        line: {
                            borderWidth: 3
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
                            },
                            pointLabels: {
                                color: '#cbd5e1',
                                font: {
                                    size: 12
                                }
                            },
                            ticks: {
                                display: false,
                                backdropColor: 'transparent'
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#cbd5e1'
                            }
                        }
                    }
                }
            };

            new Chart(ctx, config);
        });
    </script>
</body>
</html>