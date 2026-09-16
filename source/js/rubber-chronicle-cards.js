/* 橡胶大事记 —— 卡片视图
 *
 * 只作用在「橡胶大事记」分类页：检测到 #category 且标题含「橡胶大事记」时，
 * 把原来的竖排 article-sort 列表替换成卡片网格。
 *
 * 数据来自构建期生成的 /data/rubber-chronicle.json，无需运行时抓页面。
 *
 * ⚠️ 本文件与前端的 scripts/rubber-chronicle-cards.js 是两份不同用途的文件，
 *    别互相覆盖：scripts/ 下的是 Hexo 构建期脚本（用 require），
 *    source/js/ 下的是浏览器脚本（不能出现 require）。
 */
(function () {
  'use strict';

  var DATA_URL = '/data/rubber-chronicle.json';
  var MOUNT_ID = 'rc-cards';

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

/** 找到「橡胶大事记」分类页的容器；不是就返回 null */
function findTarget() {
  var cat = document.getElementById('category');
  if (!cat) return null;

  var titleEl = cat.querySelector('.article-sort-title');
  var text = titleEl ? titleEl.textContent : '';
  // 只认这一个分类页
  if (text.indexOf('橡胶大事记') === -1) return null;

  var sort = cat.querySelector('.article-sort');
  if (!sort) return null;

  return { cat: cat, sort: sort };
}

/**
 * 判断当前是不是分类的第 1 页。
 * 分类被 Hexo 分成 5 页，我们只在首页铺完整的卡片墙，
 * 翻页页（/page/2/ 等）保持原列表，避免出现"每页都显示 87 张卡"的怪象。
 */
function isFirstPage() {
  return !/\/page\/\d+\/?$/.test(location.pathname);
}

  function cardHtml(item) {
    var isAppendix = item.kind === 'appendix' || item.kind === 'backmatter';
    var cls = 'rc-card' + (isAppendix ? ' rc-appendix' : '');
    var abs = item.abstract
      ? '<p class="rc-abstract">' + esc(item.abstract) + '</p>'
      : '';

    return (
      '<a class="' + cls + '" href="' + esc(item.href) + '"' +
        ' data-chapter="' + esc(item.chapterTitle) + '"' +
        ' title="' + esc(item.fullTitle || item.title) + '">' +
        '<span class="rc-badge">' + esc(item.label) + '</span>' +
        '<h3 class="rc-title">' + esc(item.title) + '</h3>' +
        abs +
        '<div class="rc-foot"><i class="fas fa-book-open"></i>' + esc(item.chapterTitle) + '</div>' +
      '</a>'
    );
  }

  function render(target, data) {
    var cards = data.cards || [];
    if (!cards.length) {
      target.sort.innerHTML = '<div class="rc-empty">暂无内容</div>';
      return;
    }

    // 按章节分组（仅用于筛选器选项，不再插入分隔标题，避免每章末尾留白）
    var groups = [];
    var index = {};
    cards.forEach(function (c) {
      var key = c.chapterTitle;
      if (!index[key]) {
        index[key] = { key: key, chapter: c.chapter, items: [] };
        groups.push(index[key]);
      }
      index[key].items.push(c);
    });

    // 卡片连续铺满，章节信息由徽标 + 底部标签承载
    var grid = '';
    cards.forEach(function (c) {
      grid += cardHtml(c);
    });

    var wrap = document.createElement('div');
    wrap.className = 'rc-wrap';
    wrap.id = MOUNT_ID;

    var options = groups
      .map(function (g) {
        return '<option value="' + esc(g.key) + '">' + esc(g.key) + '（' + g.items.length + '）</option>';
      })
      .join('');

    wrap.innerHTML =
      '<div class="rc-toolbar">' +
        '<span class="rc-count">共 <b>' + cards.length + '</b> 篇 · 全书 <b>' + groups.length + '</b> 个章节</span>' +
        '<select class="rc-filter" aria-label="按章节筛选">' +
          '<option value="all">全部章节</option>' + options +
        '</select>' +
      '</div>' +
      '<div class="rc-grid">' + grid + '</div>';

    target.sort.parentNode.insertBefore(wrap, target.sort);
    target.cat.classList.add('rc-hide-sort');

    // 首页已铺全部卡片，隐藏分页器（否则用户会以为还有下一页）
    var pager = target.cat.querySelector('.pagination');
    if (pager) pager.style.display = 'none';

    // 筛选：直接按 data 属性显隐卡片
    var gridEl = wrap.querySelector('.rc-grid');
    var sel = wrap.querySelector('.rc-filter');
    sel.addEventListener('change', function () {
      var v = sel.value;
      var items = gridEl.querySelectorAll('.rc-card');
      for (var i = 0; i < items.length; i++) {
        var match = v === 'all' || items[i].getAttribute('data-chapter') === v;
        items[i].style.display = match ? '' : 'none';
      }
      // 空结果提示
      var any = false;
      for (var j = 0; j < items.length; j++) {
        if (items[j].style.display !== 'none') { any = true; break; }
      }
      var tip = wrap.querySelector('.rc-empty-tip');
      if (!any) {
        if (!tip) {
          tip = document.createElement('div');
          tip.className = 'rc-empty rc-empty-tip';
          tip.textContent = '该章节暂无内容';
          gridEl.parentNode.appendChild(tip);
        }
      } else if (tip) {
        tip.remove();
      }
    });
  }

  function boot() {
    var target = findTarget();
    if (!target) return;
    if (document.getElementById(MOUNT_ID)) return;
    // 只在分类首页铺卡片墙，翻页页保持原列表
    if (!isFirstPage()) return;

    fetch(DATA_URL)
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(function (data) {
        render(target, data);
      })
      .catch(function (e) {
        if (window.console && console.warn) {
          console.warn('[橡胶大事记] 卡片数据加载失败:', e);
        }
      });
  }

  // 兼容 Butterfly 的 pjax 无刷新跳转
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
  document.addEventListener('pjax:complete', boot);
})();
