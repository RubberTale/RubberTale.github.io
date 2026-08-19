---
title: 橡胶主要数据图表
date: 2026-08-19 10:00:00
aside: false
comments: false
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
  gap: 12px;
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
.pbi-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.pbi-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 15px;
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
.pbi-iframe-wrapper {
  position: relative;
  width: 100%;
  height: calc(100vh - 200px);
  min-height: 720px;
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
  width: 100%;
  height: 100%;
  border: none;
  display: block;
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
    height: 75vh;
    min-height: 520px;
  }
}
</style>

<div class="pbi-dashboard-container">
  <div class="pbi-toolbar">
    <div class="pbi-info">
      <span class="pbi-badge"><i class="fas fa-chart-bar"></i> 数据看板</span>
      <span>橡胶主要数据图表</span>
    </div>
    <div class="pbi-actions">
      <button class="pbi-btn pbi-btn-outline" onclick="togglePBIFullscreen()" title="在当前页面全屏体验">
        <i class="fas fa-expand"></i> 全屏沉浸浏览
      </button>
      <a class="pbi-btn pbi-btn-primary" href="https://app.powerbi.com/view?r=eyJrIjoiNmFmNTIwYTUtODA3NC00ZmY1LTg0ZGMtZjk5MjA0YzAxYmZiIiwidCI6IjliZWYxZTc0LWZlM2MtNGUxNy1hZDM1LTZkYmRhZTgyZmQ5YiIsImMiOjEwfQ%3D%3D" target="_blank" rel="noopener noreferrer">
        <i class="fas fa-external-link-alt"></i> 新窗口独立打开
      </a>
    </div>
  </div>

  <div class="pbi-iframe-wrapper" id="pbi-wrapper">
    <iframe 
      id="pbi-frame"
      title="橡胶主要数据图表" 
      src="https://app.powerbi.com/view?r=eyJrIjoiNmFmNTIwYTUtODA3NC00ZmY1LTg0ZGMtZjk5MjA0YzAxYmZiIiwidCI6IjliZWYxZTc0LWZlM2MtNGUxNy1hZDM1LTZkYmRhZTgyZmQ5YiIsImMiOjEwfQ%3D%3D" 
      frameborder="0" 
      allowFullScreen="true">
    </iframe>
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
</script>
