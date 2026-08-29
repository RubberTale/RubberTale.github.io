---
title: 橡胶主要数据图表
date: 2026-08-19 10:00:00
aside: false
comments: true
top_img: false
---

<style>
/* 容器全屏宽度适配 */
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
.pbi-dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
}
.pbi-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  padding: 12px 18px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(0, 0, 0, 0.06);
}
[data-theme="dark"] .pbi-toolbar {
  background: rgba(24, 24, 28, 0.85);
  border-color: rgba(255, 255, 255, 0.08);
}
.pbi-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 15px;
  font-weight: 600;
  color: var(--font-color);
}
.pbi-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  background: #f2c811;
  color: #1a1a1a;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 700;
}
.pbi-pv-badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 10px;
  background: rgba(73, 177, 245, 0.12);
  color: #49b1f5;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
}
[data-theme="dark"] .pbi-pv-badge {
  background: rgba(73, 177, 245, 0.2);
  color: #70c4ff;
}
.pbi-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.pbi-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  font-size: 13.5px;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  text-decoration: none !important;
  transition: all 0.25s ease;
  border: none;
}
.pbi-btn-primary {
  background: #49b1f5;
  color: #fff !important;
}
.pbi-btn-primary:hover {
  background: #259ef0;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(73, 177, 245, 0.35);
}
.pbi-btn-comment {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #fff !important;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.25);
}
.pbi-btn-comment:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}
.pbi-btn-outline {
  background: rgba(0, 0, 0, 0.04);
  color: var(--font-color) !important;
  border: 1px solid rgba(0, 0, 0, 0.12);
}
[data-theme="dark"] .pbi-btn-outline {
  background: rgba(255, 255, 255, 0.06);
  border-color: rgba(255, 255, 255, 0.15);
}
.pbi-btn-outline:hover {
  background: rgba(73, 177, 245, 0.12);
  color: #49b1f5 !important;
  border-color: #49b1f5;
  transform: translateY(-1px);
}
.pbi-notice-bar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(242, 200, 17, 0.12);
  border-left: 4px solid #f2c811;
  border-radius: 8px;
  font-size: 13.5px;
  color: #856404;
  line-height: 1.5;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
}
[data-theme="dark"] .pbi-notice-bar {
  background: rgba(242, 200, 17, 0.1);
  color: #e5b922;
  border-left-color: #f2c811;
}
.pbi-notice-bar i {
  color: #d4a000;
  font-size: 15px;
}
[data-theme="dark"] .pbi-notice-bar i {
  color: #f2c811;
}
.pbi-loading-placeholder {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: #888;
  font-size: 14px;
  pointer-events: none;
  z-index: 1;
}
.pbi-loading-placeholder i {
  font-size: 32px;
  color: #49b1f5;
}
.pbi-iframe-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 210px);
  min-height: 700px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.08);
  background: #ffffff;
}
[data-theme="dark"] .pbi-iframe-wrapper {
  border-color: rgba(255, 255, 255, 0.08);
  background: #141414;
}
.pbi-iframe-wrapper iframe {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

/* 评论引导卡片 */
.pbi-comment-guide-card {
  margin-top: 10px;
  padding: 20px 24px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 14px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
}
[data-theme="dark"] .pbi-comment-guide-card {
  background: rgba(24, 24, 28, 0.9);
  border-color: rgba(16, 185, 129, 0.25);
}
.pbi-guide-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  margin-bottom: 12px;
}
.pbi-guide-title {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 700;
  color: var(--font-color);
}
.pbi-guide-title i {
  color: #10b981;
  font-size: 20px;
}
.pbi-guide-desc {
  font-size: 14px;
  color: var(--font-color);
  opacity: 0.85;
  line-height: 1.6;
  margin-bottom: 14px;
}
.pbi-prompt-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.pbi-tag-btn {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 12.5px;
  font-weight: 500;
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
  border: 1px solid rgba(16, 185, 129, 0.25);
  cursor: pointer;
  transition: all 0.2s ease;
}
[data-theme="dark"] .pbi-tag-btn {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.35);
}
.pbi-tag-btn:hover {
  background: #10b981;
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
}

/* 页面底部评论容器样式适配 */
#post-comment {
  margin-top: 24px !important;
  padding: 24px !important;
  background: rgba(255, 255, 255, 0.85) !important;
  backdrop-filter: blur(12px) !important;
  -webkit-backdrop-filter: blur(12px) !important;
  border-radius: 14px !important;
  border: 1px solid rgba(0, 0, 0, 0.06) !important;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04) !important;
}
[data-theme="dark"] #post-comment {
  background: rgba(24, 24, 28, 0.85) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
}

@media screen and (max-width: 768px) {
  .pbi-toolbar {
    flex-direction: column;
    align-items: flex-start;
  }
  .pbi-actions {
    width: 100%;
    justify-content: flex-start;
  }
  .pbi-iframe-wrapper {
    height: 70vh;
    min-height: 500px;
  }
}
</style>

<div class="pbi-dashboard-container">
  <div class="pbi-toolbar">
    <div class="pbi-info">
      <span class="pbi-badge"><i class="fas fa-chart-bar"></i> 数据看板</span>
      <span>橡胶主要数据图表</span>
      <span class="pbi-pv-badge"><i class="far fa-eye"></i> 浏览量: <span id="pbi-pageview-count"><i class="fas fa-spinner fa-spin"></i></span> 次</span>
    </div>
    <div class="pbi-actions">
      <button class="pbi-btn pbi-btn-comment" onclick="scrollToComments()" title="前往下方评论与交流区">
        <i class="fas fa-comment-dots"></i> 讨论与留言 (<span id="pbi-comment-count"><i class="fas fa-spinner fa-spin"></i></span>)
      </button>
      <button class="pbi-btn pbi-btn-outline" onclick="togglePBIFullscreen()" title="在当前页面全屏体验">
        <i class="fas fa-expand"></i> 全屏沉浸
      </button>
      <a class="pbi-btn pbi-btn-primary" href="https://app.powerbi.com/view?r=eyJrIjoiNmFmNTIwYTUtODA3NC00ZmY1LTg0ZGMtZjk5MjA0YzAxYmZiIiwidCI6IjliZWYxZTc0LWZlM2MtNGUxNy1hZDM1LTZkYmRhZTgyZmQ5YiIsImMiOjEwfQ%3D%3D" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-external-link-alt"></i> 新窗口打开
      </a>
    </div>
  </div>

  <div class="pbi-notice-bar">
    <i class="fas fa-hourglass-half"></i>
    <span><strong>提示：</strong>图表加载需要时间，请耐心等候。如果长时间未显示，可尝试点击右上角“新窗口打开”。</span>
  </div>

  <div class="pbi-iframe-wrapper" id="pbi-wrapper">
    <div class="pbi-loading-placeholder">
      <i class="fas fa-spinner fa-spin"></i>
      <span>加载需要时间，请耐心等候...</span>
    </div>
    <iframe 
      id="pbi-frame"
      title="橡胶主要数据图表" 
      src="https://app.powerbi.com/view?r=eyJrIjoiNmFmNTIwYTUtODA3NC00ZmY1LTg0ZGMtZjk5MjA0YzAxYmZiIiwidCI6IjliZWYxZTc0LWZlM2MtNGUxNy1hZDM1LTZkYmRhZTgyZmQ5YiIsImMiOjEwfQ%3D%3D" 
      frameborder="0" 
      allowFullScreen="true">
    </iframe>
  </div>

  <!-- 评论与互动引导区 -->
  <div class="pbi-comment-guide-card" id="pbi-comment-guide">
    <div class="pbi-guide-header">
      <div class="pbi-guide-title">
        <i class="fas fa-comments"></i>
        <span>橡胶产业链数据研讨与留言区</span>
      </div>
      <button class="pbi-btn pbi-btn-comment" onclick="scrollToComments('💡 我想建议增加的数据维度：')">
        <i class="fas fa-pen-nib"></i> 立即参与评论
      </button>
    </div>
    <div class="pbi-guide-desc">
      欢迎在此留下您对橡胶现货、期货行情、基本面数据图表的见解与疑问。无需注册账号，输入昵称即可快捷留言交流！
    </div>
    <div class="pbi-prompt-tags">
      <span style="font-size: 13px; font-weight: 600; align-self: center; margin-right: 4px;">💬 快捷话题灵感：</span>
      <button class="pbi-tag-btn" onclick="scrollToComments('💡 【需求建议】希望看板增加以下数据/图表：')">
        <i class="fas fa-lightbulb"></i> 提需求 / 加图表
      </button>
      <button class="pbi-tag-btn" onclick="scrollToComments('📈 【行情研判】关于近期橡胶基差与基本面走势：')">
        <i class="fas fa-chart-line"></i> 行情与基差研判
      </button>
      <button class="pbi-tag-btn" onclick="scrollToComments('🔍 【数据探讨】关于图表统计口径与更新频率：')">
        <i class="fas fa-database"></i> 数据口径探讨
      </button>
      <button class="pbi-tag-btn" onclick="scrollToComments('🐞 【问题反馈】图表显示或指标有异常：')">
        <i class="fas fa-bug"></i> 报错与体验反馈
      </button>
    </div>
  </div>
</div>

<script>
function togglePBIFullscreen() {
  const container = document.getElementById('pbi-wrapper') || document.getElementById('pbi-frame');
  if (!container) return;
  if (!document.fullscreenElement && !document.webkitFullscreenElement) {
    if (container.requestFullscreen) {
      container.requestFullscreen();
    } else if (container.webkitRequestFullscreen) {
      container.webkitRequestFullscreen();
    } else if (container.msRequestFullscreen) {
      container.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

// 平滑滚动至评论区并自动填入引导文字与聚焦输入框
function scrollToComments(prefixText) {
  const commentSection = document.getElementById('post-comment') || document.getElementById('waline-wrap') || document.getElementById('pbi-comment-guide');
  if (commentSection) {
    commentSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    
    // 如果指定了引导文字，尝试自动聚焦并填入 Waline 输入框
    if (prefixText) {
      setTimeout(() => {
        const textarea = document.querySelector('.wl-editor') || document.querySelector('#post-comment textarea') || document.querySelector('textarea');
        if (textarea) {
          if (!textarea.value || textarea.value.trim() === '') {
            textarea.value = prefixText;
          }
          textarea.focus();
          textarea.setSelectionRange(textarea.value.length, textarea.value.length);
        }
      }, 500);
    }
  }
}

// 获取页面浏览量与评论数 (对接 Waline 服务端)
(function initPBIStats() {
  const serverURL = 'https://140.245.65.111.sslip.io';
  const path = '/powerbi/';
  const pvEl = document.getElementById('pbi-pageview-count');
  const commentEl = document.getElementById('pbi-comment-count');

  // 1. 浏览量
  if (pvEl) {
    fetch(`${serverURL}/api/article`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path: path, type: 'time' })
    })
    .then(res => res.json())
    .then(data => {
      if (data && data.data && typeof data.data.time === 'number') {
        pvEl.textContent = data.data.time;
      } else {
        fetch(`${serverURL}/api/article?path=${encodeURIComponent(path)}`)
          .then(r => r.json())
          .then(d => {
            pvEl.textContent = (d && d.data && d.data[0] && typeof d.data[0].time === 'number') ? d.data[0].time : '1';
          })
          .catch(() => { pvEl.textContent = '-'; });
      }
    })
    .catch(() => {
      fetch(`${serverURL}/api/article?path=${encodeURIComponent(path)}`)
        .then(r => r.json())
        .then(d => {
          pvEl.textContent = (d && d.data && d.data[0] && typeof d.data[0].time === 'number') ? d.data[0].time : '1';
        })
        .catch(() => { pvEl.textContent = '-'; });
    });
  }

  // 2. 评论数
  if (commentEl) {
    fetch(`${serverURL}/api/comment?path=${encodeURIComponent(path)}`)
      .then(res => res.json())
      .then(data => {
        if (data && data.data && typeof data.data.count === 'number') {
          commentEl.textContent = data.data.count;
        } else {
          commentEl.textContent = '0';
        }
      })
      .catch(() => {
        commentEl.textContent = '0';
      });
  }
})();
</script>
