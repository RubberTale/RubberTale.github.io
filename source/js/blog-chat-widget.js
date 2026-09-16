(function () {
  'use strict';

  var API_BASE = 'https://140.245.65.111.sslip.io/api/blog-chat';
  var MAX_TURNS = 6;

  var history = [];
  var busy = false;
  var drawerBody, drawer, overlay, welcomeEl;

  /* ---------- 工具 ---------- */
  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function inlineMD(src) {
    return esc(src)
      .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
      .replace(/`([^`]+)`/g, '<code>$1</code>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener">$1</a>');
  }

  function md(src) {
    var lines = String(src).split('\n');
    var out = [];
    var inList = false;
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      var li = /^\s*[-*•]\s+(.*)$/.exec(line);
      if (li) {
        if (!inList) { out.push('<ul>'); inList = true; }
        out.push('<li>' + inlineMD(li[1]) + '</li>');
        continue;
      }
      if (inList) { out.push('</ul>'); inList = false; }
      var h = /^(#{1,6})\s+(.*)$/.exec(line);
      if (h) { out.push('<h3>' + inlineMD(h[2]) + '</h3>'); continue; }
      if (!line.trim()) continue;
      out.push('<p>' + inlineMD(line) + '</p>');
    }
    if (inList) out.push('</ul>');
    return out.join('');
  }

  /* ---------- 侧边栏卡片 ---------- */
  function insertSidebarCard() {
    var aside = document.getElementById('aside-content') || document.querySelector('.aside-content');
    if (!aside) return;

    var card = document.createElement('div');
    card.className = 'card-widget bc-sidebar-card';
    card.innerHTML =
      '<div class="item-headline">' +
      '<i class="fas fa-comments"></i>' +
      '<span>问问这个博客</span>' +
      '</div>' +
      '<div class="bc-card-body">' +
      '<p class="bc-card-title">站内问答助手</p>' +
      '<p class="bc-card-desc">只翻童长征写过的文章来回答——橡胶投研、大宗商品、宏观与地缘、AI 观察。</p>' +
      '<button class="bc-chip" data-q="青岛橡胶仓库着火那篇讲了什么？">青岛仓库着火</button>' +
      '<button class="bc-chip" data-q="零关税对非洲橡胶供应有什么影响？">零关税影响</button>' +
      '<button class="bc-chip" data-q="RU 主力全历史 K 线复盘分了几个阶段？">RU K线阶段</button>' +
      '<button class="bc-open-btn">打开问答助手</button>' +
      '</div>';

    // 插入到侧边栏第二位（作者信息之后）
    var second = aside.children[1];
    if (second) aside.insertBefore(card, second);
    else aside.appendChild(card);

    card.querySelector('.bc-open-btn').addEventListener('click', openDrawer);
    card.querySelectorAll('.bc-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        openDrawer();
        setTimeout(function () { send(b.getAttribute('data-q')); }, 200);
      });
    });
  }

  /* ---------- 浮动按钮 ---------- */
  function createFloatBtn() {
    var btn = document.createElement('button');
    btn.className = 'bc-float-btn';
    btn.setAttribute('aria-label', '打开问答助手');
    btn.innerHTML = '<span style="font-size:22px">💬</span>';
    btn.addEventListener('click', openDrawer);
    document.body.appendChild(btn);
  }

  /* ---------- 抽屉 ---------- */
  function createDrawer() {
    overlay = document.createElement('div');
    overlay.className = 'bc-overlay';
    overlay.addEventListener('click', closeDrawer);
    document.body.appendChild(overlay);

    drawer = document.createElement('div');
    drawer.className = 'bc-drawer';
    drawer.innerHTML =
      '<div class="bc-drawer-header">' +
      '<div class="bc-icon">🌿</div>' +
      '<div class="bc-info">' +
      '<h3>问问这个博客</h3>' +
      '<p>只回答站内写过的东西</p>' +
      '</div>' +
      '<button class="bc-close" aria-label="关闭">&times;</button>' +
      '</div>' +
      '<div class="bc-drawer-body">' +
      '<div class="bc-welcome">' +
      '<h4>这个博客里都写了些什么？</h4>' +
      '<p>我是站内问答助手。你问什么，我就去翻文章来回答。</p>' +
      '<div class="bc-scope">' +
      '<b>边界：</b>只回答 <b>rubbertale.github.io</b> 站内内容——橡胶投研、大宗商品、宏观地缘、AI 观察。除此之外一律拒答。' +
      '</div>' +
      '<button class="bc-chip" data-q="青岛橡胶仓库着火那篇讲了什么？">青岛仓库着火</button>' +
      '<button class="bc-chip" data-q="零关税对非洲橡胶供应有什么影响？">零关税影响</button>' +
      '<button class="bc-chip" data-q="RU 主力全历史 K 线复盘分了几个阶段？">RU K线阶段</button>' +
      '<button class="bc-chip" data-q="博客里讲过合成橡胶的定价机制吗？">合成橡胶定价</button>' +
      '</div>' +
      '</div>' +
      '<div class="bc-drawer-footer">' +
      '<div class="bc-composer">' +
      '<textarea rows="1" placeholder="问点站内的东西…（Enter 发送）"></textarea>' +
      '<button class="bc-send" aria-label="发送">' +
      '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/></svg>' +
      '</button>' +
      '</div>' +
      '<div class="bc-hint">回答由 AI 基于站内文章生成，重要结论请点开原文核对</div>' +
      '</div>';
    document.body.appendChild(drawer);

    drawerBody = drawer.querySelector('.bc-drawer-body');
    welcomeEl = drawer.querySelector('.bc-welcome');

    drawer.querySelector('.bc-close').addEventListener('click', closeDrawer);

    // chip 点击
    drawer.querySelectorAll('.bc-chip').forEach(function (b) {
      b.addEventListener('click', function () {
        send(b.getAttribute('data-q'));
      });
    });

    // 输入框
    var ta = drawer.querySelector('textarea');
    var sendBtn = drawer.querySelector('.bc-send');

    function autoGrow() {
      ta.style.height = 'auto';
      ta.style.height = Math.min(ta.scrollHeight, 120) + 'px';
    }
    ta.addEventListener('input', autoGrow);
    ta.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        send(ta.value.trim());
      }
    });
    sendBtn.addEventListener('click', function () {
      send(ta.value.trim());
    });

    // ESC 关闭
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) closeDrawer();
    });
  }

  function openDrawer() {
    if (!drawer) createDrawer();
    drawer.classList.add('open');
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () {
      var ta = drawer.querySelector('textarea');
      if (ta) ta.focus();
    }, 100);
  }

  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  /* ---------- 消息渲染 ---------- */
  function addMsg(role) {
    if (welcomeEl && welcomeEl.parentNode) welcomeEl.parentNode.removeChild(welcomeEl);
    var wrap = document.createElement('div');
    wrap.className = 'bc-msg ' + role;
    var bubble = document.createElement('div');
    bubble.className = 'bc-bubble';
    wrap.appendChild(bubble);
    drawerBody.appendChild(wrap);
    return { wrap: wrap, bubble: bubble };
  }

  function renderSources(afterEl, sources) {
    if (!sources || !sources.length) return;
    var box = document.createElement('div');
    box.className = 'bc-sources';
    var html = '<div class="bc-sources-label">依据这些站内文章</div>';
    sources.forEach(function (s) {
      var meta = [];
      if (s.date) meta.push(s.date);
      if (s.cats && s.cats.length) meta.push(s.cats.join(' / '));
      html +=
        '<a class="bc-source" href="' + esc(s.url) + '" target="_blank" rel="noopener">' +
        '<div class="bc-st">' + esc(s.title) + '</div>' +
        (meta.length ? '<div class="bc-sm">' + esc(meta.join(' · ')) + '</div>' : '') +
        '</a>';
    });
    box.innerHTML = html;
    afterEl.wrap.insertBefore(box, afterEl.wrap.firstChild.nextSibling);
  }

  function scrollDown() {
    drawerBody.scrollTop = drawerBody.scrollHeight;
  }

  /* ---------- 发送 ---------- */
  async function send(q) {
    if (!q || busy) return;
    var ta = drawer.querySelector('textarea');
    if (ta) { ta.value = ''; ta.style.height = 'auto'; }

    busy = true;
    var sendBtn = drawer.querySelector('.bc-send');
    if (sendBtn) sendBtn.disabled = true;

    addMsg('bc-user').bubble.textContent = q;
    history.push({ role: 'user', content: q });
    scrollDown();

    var bot = addMsg('bc-bot');
    bot.bubble.innerHTML = '<div class="bc-thinking"><i></i><i></i><i></i></div>';

    var text = '';
    var sources = [];
    var failed = null;

    try {
      var res = await fetch(API_BASE + '/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history.slice(-MAX_TURNS) })
      });
      if (!res.ok) throw new Error('服务返回 ' + res.status);

      var reader = res.body.getReader();
      var dec = new TextDecoder('utf-8');
      var buf = '';

      for (;;) {
        var r = await reader.read();
        if (r.done) break;
        buf += dec.decode(r.value, { stream: true });
        var lines = buf.split('\n');
        buf = lines.pop() || '';

        for (var i = 0; i < lines.length; i++) {
          var line = lines[i].trim();
          if (line.indexOf('data:') !== 0) continue;
          var payload = line.slice(5).trim();
          if (!payload) continue;
          var evt;
          try { evt = JSON.parse(payload); } catch (e) { continue; }

          if (evt.type === 'meta') {
            sources = evt.sources || [];
            renderSources(bot, sources);
          } else if (evt.type === 'delta') {
            text += evt.text;
            bot.bubble.innerHTML = md(text) + '<span class="bc-cursor"></span>';
            scrollDown();
          }
        }
      }
    } catch (err) {
      failed = err.message;
    }

    if (text) {
      bot.bubble.innerHTML = md(text);
      history.push({ role: 'assistant', content: text });
      if (!sources.length) renderSources(bot, []);
    } else {
      bot.bubble.innerHTML = '<p>' + (failed ? '出错了：' + esc(failed) : '没有收到回复，稍后再试。') + '</p>';
      bot.bubble.style.borderColor = 'var(--bc-danger)';
    }

    busy = false;
    if (sendBtn) sendBtn.disabled = false;
    var ta2 = drawer.querySelector('textarea');
    if (ta2) ta2.focus();
    scrollDown();
  }

  /* ---------- 初始化 ---------- */
  function init() {
    insertSidebarCard();
    createFloatBtn();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
