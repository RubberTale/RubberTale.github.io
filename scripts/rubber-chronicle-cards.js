/**
 * 橡胶大事记 —— 卡片视图数据生成器
 *
 * 在 hexo generate 期间，抽取出「橡胶大事记」全部文章的
 * 章节序号 / 标题 / 摘要 / 章节归属，注入到分类页，供前端渲染成卡片网格。
 *
 * 关键点：文章的 URL 必须用 Hexo 自己的 post.path（permalink 规则复杂，
 * 手工拼日期会错），所以这里遍历 hexo.locals 的文章对象来取。
 */
const fs = require('fs');
const path = require('path');

const BOOK = '橡胶大事记';

const CHAPTERS = {
  1: '大地的眼泪',
  2: '神的弹力球',
  3: '新大陆的礼物',
  4: '改变世界的一场意外',
  5: '黑金狂潮',
  6: '世纪大盗',
  7: '轮子上的革命',
  8: '战争与橡胶',
  9: '化学的逆袭',
  10: '绿色黄金',
  11: '看不见的手',
  12: '东京与上海',
  13: '数字时代的橡胶金融',
  14: '伤痕与救赎',
  15: '未来之路',
};

/** 去 markdown 标记、压空白、按长度截断 */
function clean(s, limit) {
  if (!s) return '';
  let t = s
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  t = t.replace(/^(摘要|内容摘要|导语|简介)\s*[:：]\s*/, '');

  const max = limit || 96;
  if (t.length <= max) return t;

  // 优先在句末标点处断开，避免截在括号或词中间
  const head = t.slice(0, max);
  const cut = Math.max(
    head.lastIndexOf('。'), head.lastIndexOf('；'),
    head.lastIndexOf('！'), head.lastIndexOf('？')
  );
  if (cut >= max * 0.5) {
    return head.slice(0, cut + 1);
  }
  // 没有合适句末，就退到逗号，并补齐未闭合的括号
  let soft = Math.max(head.lastIndexOf('，'), head.lastIndexOf('、'));
  let out = soft >= max * 0.55 ? head.slice(0, soft) : head;
  const open = (out.match(/（/g) || []).length;
  const close = (out.match(/）/g) || []).length;
  if (open > close) out += '）'.repeat(open - close);
  return out.replace(/[，,、；;：:\s]+$/, '') + '…';
}

/**
 * 抽摘要，四种形态依次兜底：
 *  1. 「# 大标题」后紧跟的 > *斜体*   引用块 —— 本书 61 篇标准写法
 *  2. 任意位置的 > *斜体*             引用块
 *  3. 任意位置的 > 普通               引用块 —— 附录 / 索引
 *  4. 首个正文段落                     —— 第 13~15 章叙事型开头
 */
function pickAbstract(body) {
  let m = body.match(/^#\s+.+\n+\s*>\s*\*([\s\S]+?)\*\s*$/m);
  if (m) return clean(m[1]);
  m = body.match(/^\s*>\s*\*([\s\S]+?)\*\s*$/m);
  if (m) return clean(m[1]);
  m = body.match(/^\s*>\s*([^\n]+)$/m);
  if (m) return clean(m[1]);

  const buf = [];
  for (const line of body.split('\n')) {
    const t = line.trim();
    if (!t || t.startsWith('#') || t.startsWith('---') || t.startsWith('>') || t.startsWith('![')) {
      if (buf.length) break;
      continue;
    }
    buf.push(t);
    if (buf.join(' ').length > 200) break;
  }
  return clean(buf.join(' '));
}

/** 解析章节序号 -> {kind, chapter, order, chapterTitle, label, sortKey} */
function parseSeq(title) {
  let m = title.match(/^(\d+)\.(\d+)\s+/);
  if (m) {
    const ch = parseInt(m[1], 10);
    const no = parseInt(m[2], 10);
    return {
      kind: 'section',
      chapter: ch,
      order: no,
      chapterTitle: CHAPTERS[ch] || '第' + ch + '章',
      label: m[1] + '.' + m[2],
      sortKey: ch * 1000 + no,
    };
  }
  m = title.match(/^附录([一二三四五六七八九十]+)\s*[:：]\s*/);
  if (m) {
    const nums = { 一: 1, 二: 2, 三: 3, 四: 4, 五: 5, 六: 6, 七: 7, 八: 8, 九: 9, 十: 10 };
    const n = nums[m[1]] || 99;
    return { kind: 'appendix', chapter: 90, order: n, chapterTitle: '附录', label: '附录' + m[1], sortKey: 900000 + n };
  }
  if (title === '参考文献') {
    return { kind: 'backmatter', chapter: 91, order: 1, chapterTitle: '参考文献', label: '文献', sortKey: 910000 };
  }
  if (title === '索引') {
    return { kind: 'backmatter', chapter: 92, order: 1, chapterTitle: '索引', label: '索引', sortKey: 920000 };
  }
  return { kind: 'other', chapter: 0, order: 0, chapterTitle: '其他', label: '·', sortKey: 0 };
}

let cached = null;

/** 构建卡片数据（只算一次） */
function buildCards() {
  if (cached) return cached;
  const posts = hexo.locals.get('posts') || [];
  const cards = [];

  posts.forEach((post) => {
    // post.source 形如：_posts/橡胶大事记/正文/1.1 橡胶树的起源.md
    const source = post.source || '';
    if (source.indexOf(BOOK + '/') === -1) return;
    if (post.title === '橡胶大事记提纲') return; // 提纲不进卡片墙

    const title = post.title || '';
    if (!title) return;

    const seq = parseSeq(title);
    let displayTitle = title;
    if (seq.kind === 'section') {
      displayTitle = title.replace(/^\d+\.\d+\s+/, '');
    } else if (seq.kind === 'appendix') {
      displayTitle = title.replace(/^附录[一二三四五六七八九十]+\s*[:：]\s*/, '');
    }

    cards.push({
      title: displayTitle,
      href: '/' + String(post.path || '').replace(/^\//, ''), // 补上根路径，Hexo 的 path 不带前导斜杠
      abstract: pickAbstract(post.raw || post.content || ''),
      label: seq.label,
      kind: seq.kind,
      chapter: seq.chapter,
      chapterTitle: seq.chapterTitle,
      order: seq.order,
      sortKey: seq.sortKey,
    });
  });

  cards.sort((a, b) => a.sortKey - b.sortKey);
  cached = { total: cards.length, cards };
  return cached;
}

/** 让模板里能用卡片数据（备用） */
hexo.extend.helper.register('rubberChronicle', function (json) {
  const data = buildCards();
  return json ? JSON.stringify(data) : data;
});

/** 把数据固化成一个静态 JSON，供前端 fetch */
hexo.extend.generator.register('rubber-chronicle-json', function (locals) {
  const data = buildCards();
  if (!data.total) {
    hexo.log.warn('[橡胶大事记] 未匹配到任何文章，请检查 source 路径前缀');
  } else {
    hexo.log.info('[橡胶大事记] 卡片数据已就绪: %d 篇', data.total);
  }
  return {
    path: 'data/rubber-chronicle.json',
    data: JSON.stringify(data),
  };
});
