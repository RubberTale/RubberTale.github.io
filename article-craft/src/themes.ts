/**
 * WriteBuddy 主题注册表
 *
 * 真正的配色定义在 index.html 的 <style> 里（以 CSS 变量形式挂到 html[data-theme="..."]），
 * 这里只负责「界面展示」需要的元数据：名称、图标、色板预览、明暗模式。
 * 新增主题时两处都要加：index.html 的变量块 + 本文件的一条记录。
 */

export type ThemeId = 'dark' | 'light' | 'sepia' | 'midnight' | 'forest' | 'oled';

export interface WbTheme {
  id: ThemeId;
  /** 主题名（下拉面板显示） */
  name: string;
  emoji: string;
  /** 一句话描述 */
  desc: string;
  /** dark / light —— 用于 color-scheme 与 html.dark 类 */
  mode: 'dark' | 'light';
  /** 色板预览：页面底 / 面板 / 强调色 / 文字 */
  swatch: [string, string, string, string];
}

export const THEMES: WbTheme[] = [
  {
    id: 'dark',
    name: '深空蓝',
    emoji: '🌌',
    desc: '默认主题 · 深邃冷蓝，长时间写作不刺眼',
    mode: 'dark',
    swatch: ['#020617', '#0f172a', '#3b82f6', '#e2e8f0'],
  },
  {
    id: 'light',
    name: '白昼',
    emoji: '☀️',
    desc: '浅色主题 · 明亮通透，适合白天与投影演示',
    mode: 'light',
    swatch: ['#f8fafc', '#ffffff', '#2563eb', '#1e293b'],
  },
  {
    id: 'sepia',
    name: '纸墨',
    emoji: '📜',
    desc: '米黄纸感 · 暖调护眼，久读不易疲劳',
    mode: 'light',
    swatch: ['#f7f3ea', '#fffdf8', '#b45309', '#3a3226'],
  },
  {
    id: 'midnight',
    name: '午夜紫',
    emoji: '🔮',
    desc: '深紫夜色 · 沉静专注，文学创作氛围',
    mode: 'dark',
    swatch: ['#0d0a20', '#181235', '#8b5cf6', '#ddd9f0'],
  },
  {
    id: 'forest',
    name: '松林',
    emoji: '🌲',
    desc: '暗绿青黛 · 低饱和镇静，眼睛最放松',
    mode: 'dark',
    swatch: ['#081816', '#0e2421', '#14b8a6', '#cfe4de'],
  },
  {
    id: 'oled',
    name: '曜石黑',
    emoji: '⚫',
    desc: '纯黑 OLED · 省电、对比最强，夜里最清爽',
    mode: 'dark',
    swatch: ['#000000', '#0c0c0e', '#3b82f6', '#e0e0e6'],
  },
];

export const DEFAULT_THEME_ID: ThemeId = 'dark';

export const THEME_STORAGE_KEY = 'wb-theme';

const THEME_IDS = THEMES.map((t) => t.id);

export const isThemeId = (v: unknown): v is ThemeId =>
  typeof v === 'string' && (THEME_IDS as string[]).includes(v);

export const getTheme = (id: ThemeId): WbTheme =>
  THEMES.find((t) => t.id === id) || THEMES[0];

/** 读取本地保存的主题（容错：localStorage 不可用时回退默认） */
export const readSavedTheme = (): ThemeId => {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    if (isThemeId(saved)) return saved;
  } catch {
    /* ignore */
  }
  return DEFAULT_THEME_ID;
};

/** 把主题写到 <html> 上（data-theme + dark 类），并持久化 */
export const applyTheme = (id: ThemeId, opts: { persist?: boolean; animate?: boolean } = {}) => {
  const { persist = true, animate = true } = opts;
  const theme = getTheme(id);
  const el = document.documentElement;

  if (animate) {
    // 只在切换瞬间挂过渡类，避免影响日常 hover/scale 动效
    el.classList.add('wb-theme-anim');
    window.setTimeout(() => el.classList.remove('wb-theme-anim'), 300);
  }

  el.setAttribute('data-theme', id);
  el.classList.toggle('dark', theme.mode === 'dark');

  if (persist) {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, id);
    } catch {
      /* ignore */
    }
  }
};
