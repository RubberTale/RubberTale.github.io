import { ResumeData } from '../types';

export const DEFAULT_RESUME: ResumeData = {
  personalInfo: {
    name: '童林华',
    targetJob: '大宗商品与量化策略研究员',
    phone: '138-0013-8000',
    email: 'linhua.tong@example.com',
    location: '上海 · 陆家嘴',
    experienceYears: '5年工作经验',
    educationLevel: '硕士 / 985院校',
    website: 'https://RubberTale.github.io/',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    showAvatar: true,
    avatarShape: 'circle',
  },
  summary:
    '5年大宗商品（天然橡胶、合成橡胶、能化产业链）投研与量化CTA策略开发经验。精通供需平衡表构建、产业链库存与基差套利模型，熟悉Python量化回测与实盘执行系统。曾主导搭建橡胶产业大数据预测中台，为机构资产配置带来显著超额阿尔法收益。',
  workExperience: [
    {
      id: 'w1',
      company: '华东商品对冲私募基金',
      role: '资深量化CTA研究员',
      city: '上海',
      startDate: '2023.03',
      endDate: '至今',
      current: true,
      highlights: [
        '负责能化与橡胶品种的中高频CTA策略及期限套利模型开发，管理策略实盘资金规模超 1.2 亿元。',
        '结合天胶现货升贴水、交割库库存与气象降水数据，构建非线性供需预测模型，年化夏普比率提升至 2.45。',
        '主导策略自动化风控模块改造，成功规避2024年能化板块数次单日极端行情，最大回撤控制在 5.2% 以内。',
      ],
    },
    {
      id: 'w2',
      company: '某知名期货投资咨询有限公司',
      role: '大宗商品产业链分析师',
      city: '杭州',
      startDate: '2021.07',
      endDate: '2023.02',
      current: false,
      highlights: [
        '深入调研东南亚（泰国、越南、印尼）及国内海南、云南橡胶割胶主产区，发布深度产业链专题研报 40+ 篇。',
        '建立全市场高频轮胎开工率、保税区港口去库周期预警看板，客户服务满意度排名部门前 3%。',
        '协同研发团队利用网络爬虫与遥感气象卫星图谱，建立降水及病虫害遥感预测模型，产出多篇行业前瞻预警报告。',
      ],
    },
  ],
  projectExperience: [
    {
      id: 'p1',
      name: '橡胶大宗商品全球供需与多因子套利系统',
      role: '核心设计与架构师',
      startDate: '2023.08',
      endDate: '2024.05',
      techStack: 'Python / Pandas / Backtrader / ClickHouse / FastApi',
      highlights: [
        '自研端到端行情清洗与多因子回测框架，涵盖期限结构、动量因数、库存驱动与期权隐波偏度等 18 个核心因子。',
        '利用分布式时序数据库存储国内五大期货交易所十年高频 Tick 数据，将单次策略全历史回测耗时从 45 分钟缩短至 3 分钟。',
        '系统上线实盘后稳定运行 18 个月，多因子套利组合实现年化绝对收益率 21.8%。',
      ],
    },
    {
      id: 'p2',
      name: '产区气象降水与割胶物候周期监测平台',
      role: '算法负责人',
      startDate: '2022.03',
      endDate: '2022.11',
      techStack: 'Python / LightGBM / GIS / Docker',
      highlights: [
        '汇聚景洪、勐腊、白沙、儋州及泰国南部 12 个气象站点降水量时序数据，建立产区有效割胶天数概率模型。',
        '经实盘对冲验证，在割胶旺季异常降雨阶段提前 1 周捕捉产出滑坡信号，帮助交易团队锁定低成本原料套保头寸。',
      ],
    },
  ],
  education: [
    {
      id: 'e1',
      school: '上海交通大学 / 复旦大学 (示例)',
      major: '金融工程与统计学',
      degree: '工学硕士',
      startDate: '2018.09',
      endDate: '2021.06',
      gpa: '3.82 / 4.0 (专业前 5%)',
      details: '主修：时间序列分析、随机微积分、金融衍生品定价、机器学习与量化投资。连续两年获国家研究生一等奖学金。',
    },
    {
      id: 'e2',
      school: '华中科技大学 (示例)',
      major: '数学与应用数学',
      degree: '理学学士',
      startDate: '2014.09',
      endDate: '2018.06',
      gpa: '3.75 / 4.0',
      details: '全国大学生数学建模竞赛（MCM/ICM）一等奖，校优秀毕业生。',
    },
  ],
  skills: [
    {
      id: 's1',
      name: '量化研发与编程',
      skills: 'Python (NumPy, Pandas, Scipy, Statsmodels), SQL / ClickHouse, Git, Linux, Docker, C++ 基础',
    },
    {
      id: 's2',
      name: '投研与量化框架',
      skills: 'CTA 趋势与套利策略、供需平衡表建模、基差套利、Backtrader / VNPY、风控与资金管理',
    },
    {
      id: 's3',
      name: '行业与业务理解',
      skills: '大宗商品产业链（天然橡胶、合成胶、原油链、黑色金属）、宏观流动性与产业库存周期',
    },
  ],
  awards: [
    { id: 'a1', name: '期货日报＆证券时报“最佳工业品期货分析师”提名', date: '2023.11', issuer: '期货日报' },
    { id: 'a2', name: '特许金融分析师 (CFA Level III Candidate)', date: '2022.08', issuer: 'CFA Institute' },
    { id: 'a3', name: '期货从业资格证 & 期货投资咨询资格', date: '2021.05', issuer: '中国期货业协会' },
  ],
  customSections: [
    {
      id: 'c1',
      title: '学术出版与开源贡献',
      content: '在《期货与金融衍生品》发表《基于供需因子与高频期限结构的橡胶套利策略研究》；在 GitHub 开源橡胶产业高频数据清洗脚本集（Star 300+）。',
    },
  ],
  sectionsOrder: [
    { key: 'summary', label: '个人简介', enabled: true },
    { key: 'experience', label: '工作经历', enabled: true },
    { key: 'projects', label: '项目经历', enabled: true },
    { key: 'education', label: '教育背景', enabled: true },
    { key: 'skills', label: '专业技能', enabled: true },
    { key: 'awards', label: '证书荣誉', enabled: true },
    { key: 'custom', label: '学术/其他', enabled: true },
  ],
  theme: {
    template: 'classic',
    primaryColor: '#1e40af', // 经典深蓝
    fontFamily: 'sans',
    fontSize: 'normal',
    lineHeight: 'normal',
    sectionGap: 'normal',
    paperPadding: 'normal',
  },
};

export const PRESET_TECH: ResumeData = {
  ...DEFAULT_RESUME,
  personalInfo: {
    name: '张逸飞',
    targetJob: '资深全栈开发工程师 / 前端技术专家',
    phone: '139-1234-5678',
    email: 'yifei.zhang@example.com',
    location: '北京 · 海淀',
    experienceYears: '6年经验',
    educationLevel: '全日制本科',
    website: 'https://github.com/yifei-zhang',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    showAvatar: true,
    avatarShape: 'rounded',
  },
  summary:
    '6年高并发Web平台与微前端架构经验。精通 React/Vue 生态、TypeScript、Node.js 与云原生部署。主导过多套千万级 DAU 产品的核心性能调优与前端中台架构设计，在前端工程化、组件库建设、SSR 服务端渲染及 WebGL/WebAssembly 领域有深厚积累。',
  workExperience: [
    {
      id: 'w1',
      company: '某一线头部互联网科技集团',
      role: '高级前端技术专家',
      city: '北京',
      startDate: '2022.04',
      endDate: '至今',
      current: true,
      highlights: [
        '负责核心商业化中台系统架构升级，采用微前端（Module Federation）拆分 8 个子应用，研发交付周期缩短 40%。',
        '主导首屏加载性能专项攻坚，通过代码分包、动态Polyfill与离线缓存策略，将 FCP 从 2.8s 压降至 0.8s 内，Lighthouse 得分提升至 96。',
        '带领 9 人跨职能工程团队，制定团队代码审查与自动化 CI/CD 规范，线上崩溃率降低 65%。',
      ],
    },
    {
      id: 'w2',
      company: '独角兽企业 · 智能交互实验室',
      role: '全栈工程师',
      city: '北京',
      startDate: '2019.07',
      endDate: '2022.03',
      current: false,
      highlights: [
        '基于 React + Node.js 构建低代码可视化表单与图表搭建引擎，支撑公司内部 30+ 业务线的快速落地。',
        '编写通用 UI 组件库，封装 50+ 健壮可复用组件，单元测试覆盖率达 92%，月度 npm 下载量超 10 万次。',
      ],
    },
  ],
  projectExperience: [
    {
      id: 'p1',
      name: '企业级低代码可视化敏捷看板平台',
      role: '前端核心架构师',
      startDate: '2023.01',
      endDate: '2023.10',
      techStack: 'React 18 / TypeScript / Zustand / TailwindCSS / Web Worker / ECharts',
      highlights: [
        '设计基于 JSON Schema 的动态渲染协议，支持海量数据流图表毫秒级实时重绘与虚拟滚动。',
        '引入 Web Worker 处理复杂数据聚合计算，避免长任务阻塞主线程，保证 60fps 丝滑交互。',
      ],
    },
  ],
  education: [
    {
      id: 'e1',
      school: '北京邮电大学',
      major: '软件工程',
      degree: '工学学士',
      startDate: '2015.09',
      endDate: '2019.06',
      gpa: '3.8 / 4.0',
      details: '曾获全国大学生软件设计大赛一等奖，在校期间独立开发并运营校园助手小程序（用户 2w+）。',
    },
  ],
  skills: [
    { id: 's1', name: '核心语言', skills: 'TypeScript, JavaScript (ESNext), Node.js, Go (基础), HTML5 / CSS3' },
    { id: 's2', name: '前端技术栈', skills: 'React, Next.js, Vue 3, TailwindCSS, Zustand/Redux, Webpack/Vite, WebGL' },
    { id: 's3', name: '后端与工程化', skills: 'Nest.js, Redis, PostgreSQL, Docker, CI/CD (GitHub Actions), 监控与埋点' },
  ],
  awards: [
    { id: 'a1', name: '公司年度最具商业价值技术创新奖', date: '2023.12', issuer: '集团技术委员会' },
    { id: 'a2', name: '掘金稀土技术社区年度优秀签约作者', date: '2022.06', issuer: '掘金' },
  ],
  customSections: [],
  sectionsOrder: [
    { key: 'summary', label: '个人简介', enabled: true },
    { key: 'experience', label: '工作经历', enabled: true },
    { key: 'projects', label: '项目经历', enabled: true },
    { key: 'skills', label: '专业技能', enabled: true },
    { key: 'education', label: '教育背景', enabled: true },
    { key: 'awards', label: '荣誉奖项', enabled: true },
  ],
  theme: {
    template: 'modern',
    primaryColor: '#0f766e', // 翡翠深青
    fontFamily: 'sans',
    fontSize: 'normal',
    lineHeight: 'normal',
    sectionGap: 'normal',
    paperPadding: 'normal',
  },
};

export const PRESET_PRODUCT: ResumeData = {
  ...DEFAULT_RESUME,
  personalInfo: {
    name: '林欣怡',
    targetJob: '资深产品经理 / 业务合伙人',
    phone: '137-8888-6666',
    email: 'xinyi.lin@example.com',
    location: '深圳 · 南山',
    experienceYears: '7年产品经验',
    educationLevel: '硕士研究生',
    website: 'https://xinyi-pm.notion.site',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    showAvatar: true,
    avatarShape: 'circle',
  },
  summary:
    '7年 B2B SaaS 与企业级数字化转型产品规划经验。具备极强的商业敏锐度与用户同理心，擅长从0到1孵化高壁垒业务，并带领跨职能团队实现规模化商业化变现。累计操盘产品 ARR 突破 8000 万元，对 PLG 增长与敏捷迭代方法论有深入实践。',
  workExperience: [
    {
      id: 'w1',
      company: '某知名智能供应链云平台',
      role: '高级产品总监 / 业务线负责人',
      city: '深圳',
      startDate: '2021.09',
      endDate: '至今',
      current: true,
      highlights: [
        '从0到1主导全渠道智能补货与库存优化 SaaS 平台设计，首年签约行业头部企业客户 25 家，续费率 94%。',
        '通过数据洞察驱动用户旅程优化，将客户核心开通上手时间由 14 天缩减至 3 天，转化率提升 45%。',
        '统筹管理产研、运营与售前支持团队，构建敏捷双周发版节奏，年度交付客户需求满足率达 98%。',
      ],
    },
  ],
  projectExperience: [
    {
      id: 'p1',
      name: '智能企业级协同与数据中台系统',
      role: '产品负责人',
      startDate: '2022.03',
      endDate: '2023.06',
      techStack: 'Axure / Figma / SQL / Jira / Mixpanel',
      highlights: [
        '调研 40 余家制造与仓储零售龙头企业，梳理 120 余项核心业务痛点，产出高保真原型与详尽 PRD 文档。',
        '主导设计灵活的角色权限模型（RBAC）与自定义报表生成器，极大地降低了定制化交付的人力成本。',
      ],
    },
  ],
  education: [
    {
      id: 'e1',
      school: '浙江大学',
      major: '管理科学与工程',
      degree: '管理学硕士',
      startDate: '2015.09',
      endDate: '2018.06',
      gpa: '3.85 / 4.0',
      details: '校研究生会主席，曾主导校级商业创新创业挑战赛获金奖。',
    },
  ],
  skills: [
    { id: 's1', name: '产品核心能力', skills: '商业定位、用户调研、PRD 撰写、需求分级、数据分析 (SQL / Python)、原型设计 (Figma/Axure)' },
    { id: 's2', name: '管理与方法论', skills: '敏捷项目管理 (Scrum)、PLG 增长策略、商业画布、跨部门资源协同、GTM 市场进入' },
  ],
  awards: [
    { id: 'a1', name: 'PMP 项目管理专业人士认证', date: '2021.03', issuer: 'PMI' },
    { id: 'a2', name: 'NPDP 新产品开发专业认证', date: '2020.10', issuer: 'PDMA' },
  ],
  customSections: [],
  sectionsOrder: [
    { key: 'summary', label: '个人简介', enabled: true },
    { key: 'experience', label: '工作经历', enabled: true },
    { key: 'projects', label: '项目经历', enabled: true },
    { key: 'education', label: '教育背景', enabled: true },
    { key: 'skills', label: '专业技能', enabled: true },
    { key: 'awards', label: '专业证书', enabled: true },
  ],
  theme: {
    template: 'sidebar',
    primaryColor: '#881337', // 雅致暗红
    fontFamily: 'sans',
    fontSize: 'normal',
    lineHeight: 'normal',
    sectionGap: 'normal',
    paperPadding: 'normal',
  },
};

export const COLOR_PALETTES = [
  { label: '商务深蓝', value: '#1e40af' },
  { label: '翡翠雅青', value: '#0f766e' },
  { label: '勃艮第红', value: '#881337' },
  { label: '商务石墨', value: '#334155' },
  { label: '典雅紫晶', value: '#6b21a8' },
  { label: '暖调琥珀', value: '#b45309' },
  { label: '沉稳纯黑', value: '#18181b' },
];
