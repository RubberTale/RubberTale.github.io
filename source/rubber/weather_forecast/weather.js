const REGION_CONFIG = {
  southeast_asia: { name: "东南亚", order: "01" },
  drc: { name: "刚果金", order: "02" },
  cote_divoire: { name: "科特迪瓦", order: "03" },
  china: { name: "中国", order: "04" },
  brazil_chile: { name: "巴西 × 智利", order: "05" },
  india_south: { name: "印度南部", order: "06" },
};

const state = {
  active: "southeast_asia",
  metadata: {},
  exportUrl: "",
  exportFilename: "",
};

const video = document.getElementById("forecast-video");
const fallback = document.getElementById("forecast-fallback");
const loading = document.getElementById("media-loading");
const mediaControls = document.getElementById("media-controls");
const videoProgress = document.getElementById("video-progress");
const videoClock = document.getElementById("video-clock");
const controlValidTime = document.getElementById("control-valid-time");
const playbackMode = document.getElementById("playback-mode");
const exportButton = document.getElementById("download-video");
const exportDialog = document.getElementById("export-dialog");
const exportForm = document.getElementById("export-form");
const exportPassword = document.getElementById("export-password");
const exportStatus = document.getElementById("export-status");
const exportCancel = document.getElementById("export-cancel");
const exportConfirm = document.getElementById("export-confirm");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const EXPORT_PASSWORD_DIGEST = "4a89a193c8055399a8dadc52a5a6caabbcfb87841eb6a82fbfbbca433e2fbfd9";

const assetPath = (region, file) => `../weather_assets/icon_forecast/${region}/${file}`;
const versionedAsset = (region, file) => {
  if (location.protocol === "file:") return assetPath(region, file);
  const version = encodeURIComponent(
    state.metadata[region]?.generated_at || state.metadata[region]?.run_utc || "latest"
  );
  return `${assetPath(region, file)}?v=${version}`;
};
const formatMm = value => Number.isFinite(Number(value)) ? `${Number(value).toFixed(1)} mm` : "--";
const formatPct = value => Number.isFinite(Number(value)) ? `${Number(value).toFixed(0)}%` : "--";

function formatMediaTime(value) {
  if (!Number.isFinite(value) || value < 0) return "00:00";
  const totalSeconds = Math.floor(value);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function updateProgressControl(frameIndex = null) {
  const meta = state.metadata[state.active];
  const frames = meta?.frames || [];
  const lastIndex = Math.max(0, frames.length - 1);
  const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
  const videoRatio = duration ? Math.min(0.99999, Math.max(0, video.currentTime / duration)) : 0;
  const index = Number.isInteger(frameIndex)
    ? Math.min(lastIndex, Math.max(0, frameIndex))
    : Math.min(lastIndex, Math.floor(videoRatio * Math.max(1, frames.length)));
  const progressRatio = lastIndex ? index / lastIndex : 0;
  videoProgress.max = String(lastIndex);
  videoProgress.value = String(index);
  videoProgress.style.setProperty("--progress", `${progressRatio * 100}%`);
  videoProgress.setAttribute("aria-valuetext", frames[index]
    ? `第 ${index + 1} 帧，${frames[index].valid_time_china}`
    : `第 ${index + 1} 帧`);
  videoClock.textContent = `${formatMediaTime(video.currentTime)} / ${formatMediaTime(duration)}`;
}

function peakFrame(meta) {
  return (meta.frames || []).reduce((best, frame) => {
    if (!best || Number(frame.max_rain_mm) > Number(best.max_rain_mm)) return frame;
    return best;
  }, null);
}

function updateFrameMetrics(frame) {
  if (!frame) return;
  document.getElementById("valid-time").textContent = frame.valid_time_china || "--";
  controlValidTime.textContent = frame.valid_time_china || "--";
  document.getElementById("metric-max").textContent = formatMm(frame.max_rain_mm);
  document.getElementById("metric-mean").textContent = formatMm(frame.mean_rain_mm);
  document.getElementById("metric-wet").textContent = formatPct(frame.wet_share_pct);
}

function updatePlaybackFrame() {
  const meta = state.metadata[state.active];
  if (!meta?.frames?.length || !Number.isFinite(video.duration) || video.duration <= 0) return;
  const ratio = Math.min(0.99999, Math.max(0, video.currentTime / video.duration));
  const index = Math.min(meta.frames.length - 1, Math.floor(ratio * meta.frames.length));
  updateFrameMetrics(meta.frames[index]);
  updateProgressControl(index);
}

function showFallback(region, animated = true) {
  video.hidden = true;
  fallback.hidden = false;
  fallback.src = versionedAsset(region, animated ? "latest.webp" : "latest_preview.png");
  loading.hidden = true;
  mediaControls.hidden = true;
}

function setRegion(region) {
  const meta = state.metadata[region];
  if (!meta) return;
  state.active = region;
  document.querySelectorAll(".region-tab").forEach(button => {
    const selected = button.dataset.region === region;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
  });

  document.getElementById("stage-title").textContent = `${meta.region_name_cn}未来 7 天`;
  document.getElementById("stage-focus").textContent = meta.region_focus_cn;
  const first = meta.frames?.[0];
  const last = meta.frames?.[meta.frames.length - 1];
  document.getElementById("forecast-range").textContent = first && last
    ? `${first.valid_time_china} — ${last.valid_time_china}`
    : "--";
  const peak = peakFrame(meta);
  document.getElementById("metric-peak").textContent = formatMm(peak?.max_rain_mm);
  document.getElementById("metric-peak-time").textContent = peak?.valid_time_china || "--";
  updateFrameMetrics(first);

  const mp4 = versionedAsset(region, "latest.mp4");
  video.hidden = false;
  fallback.hidden = true;
  loading.hidden = false;
  mediaControls.hidden = true;
  playbackMode.textContent = "自动播放";
  videoProgress.max = String(Math.max(0, (meta.frames?.length || 1) - 1));
  videoProgress.value = "0";
  videoProgress.style.setProperty("--progress", "0%");
  videoClock.textContent = "00:00 / 00:00";
  video.pause();
  video.poster = versionedAsset(region, "latest_preview.png");
  video.src = mp4;
  video.load();
  state.exportUrl = mp4;
  state.exportFilename = `dwd-icon-${region}-7d.mp4`;
  exportButton.disabled = false;

  if (reduceMotion) {
    playbackMode.textContent = "已暂停 · 减少动态效果";
    video.addEventListener("loadeddata", () => { loading.hidden = true; }, { once: true });
  } else {
    video.play().catch(() => { playbackMode.textContent = "自动播放未启动"; });
  }
}

function hydrateRegionTabs() {
  const regionCount = Object.keys(REGION_CONFIG).length;
  document.querySelectorAll(".region-tab").forEach(button => {
    const region = button.dataset.region;
    const meta = state.metadata[region];
    if (!meta) return;
    const peak = peakFrame(meta);
    const last = meta.frames?.[meta.frames.length - 1];
    button.querySelector(".region-tab-index").textContent = `${REGION_CONFIG[region].order} / ${String(regionCount).padStart(2, "0")}`;
    button.querySelector("[data-tab-peak]").textContent = formatMm(peak?.max_rain_mm);
    button.querySelector("[data-tab-end]").textContent = last?.valid_time_china?.slice(5) || "--";
  });
}

async function loadMetadata() {
  if (window.ICON_WEATHER_METADATA) {
    state.metadata = window.ICON_WEATHER_METADATA;
    document.getElementById("cycle-time").textContent = state.metadata.southeast_asia.run_china || "--";
    hydrateRegionTabs();
    setRegion(state.active);
    return;
  }
  const entries = await Promise.all(Object.keys(REGION_CONFIG).map(async region => {
    const response = await fetch(`${assetPath(region, "latest.json")}?v=${Date.now()}`, { cache: "no-store" });
    if (!response.ok) throw new Error(`${region} metadata ${response.status}`);
    return [region, await response.json()];
  }));
  state.metadata = Object.fromEntries(entries);
  document.getElementById("cycle-time").textContent = state.metadata.southeast_asia.run_china || "--";
  hydrateRegionTabs();
  setRegion(state.active);
}

async function sha256(value) {
  if (!window.crypto?.subtle) throw new Error("当前浏览器无法进行安全验证");
  const bytes = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, "0")).join("");
}

function resetExportDialog() {
  exportForm.reset();
  exportPassword.removeAttribute("aria-invalid");
  exportStatus.classList.remove("is-error");
  exportStatus.textContent = "仅验证本次导出，不会保存密码。";
  exportConfirm.disabled = false;
  exportConfirm.removeAttribute("aria-busy");
  exportConfirm.textContent = "验证并导出";
}

function openExportDialog() {
  if (!state.exportUrl || exportButton.disabled) return;
  resetExportDialog();
  exportDialog.showModal();
  requestAnimationFrame(() => exportPassword.focus());
}

function triggerExport() {
  const link = document.createElement("a");
  link.href = state.exportUrl;
  link.download = state.exportFilename;
  link.hidden = true;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

exportButton.addEventListener("click", openExportDialog);
exportCancel.addEventListener("click", () => exportDialog.close());
exportDialog.addEventListener("close", resetExportDialog);
exportDialog.addEventListener("click", event => {
  if (event.target === exportDialog) exportDialog.close();
});
exportForm.addEventListener("submit", async event => {
  event.preventDefault();
  const password = exportPassword.value;
  if (!password) {
    exportPassword.setAttribute("aria-invalid", "true");
    exportStatus.classList.add("is-error");
    exportStatus.textContent = "请输入导出密码。";
    exportPassword.focus();
    return;
  }

  exportConfirm.disabled = true;
  exportConfirm.setAttribute("aria-busy", "true");
  exportConfirm.textContent = "验证中…";
  exportStatus.classList.remove("is-error");
  exportStatus.textContent = "正在验证…";

  try {
    const digest = await sha256(password);
    if (digest !== EXPORT_PASSWORD_DIGEST) {
      exportPassword.value = "";
      exportPassword.setAttribute("aria-invalid", "true");
      exportStatus.classList.add("is-error");
      exportStatus.textContent = "密码不正确，请重新输入。";
      exportPassword.focus();
      return;
    }

    exportDialog.close();
    triggerExport();
  } catch (error) {
    exportStatus.classList.add("is-error");
    exportStatus.textContent = `${error.message}，请更换浏览器后重试。`;
  } finally {
    exportConfirm.disabled = false;
    exportConfirm.removeAttribute("aria-busy");
    exportConfirm.textContent = "验证并导出";
  }
});

document.querySelectorAll(".region-tab").forEach(button => {
  button.addEventListener("click", () => setRegion(button.dataset.region));
});

videoProgress.addEventListener("input", () => {
  const meta = state.metadata[state.active];
  const frames = meta?.frames || [];
  if (!frames.length || !Number.isFinite(video.duration) || video.duration <= 0) return;
  const index = Math.min(frames.length - 1, Math.max(0, Number(videoProgress.value)));
  video.pause();
  playbackMode.textContent = "已暂停 · 手动选帧";
  video.currentTime = Math.min(video.duration - 0.001, ((index + 0.5) / frames.length) * video.duration);
  updateFrameMetrics(frames[index]);
  updateProgressControl(index);
});

video.addEventListener("loadedmetadata", updateProgressControl);
video.addEventListener("loadeddata", () => {
  loading.hidden = true;
  mediaControls.hidden = false;
  updateProgressControl();
});
video.addEventListener("play", () => { playbackMode.textContent = "自动播放"; });
video.addEventListener("timeupdate", updatePlaybackFrame);
video.addEventListener("error", () => showFallback(state.active, !reduceMotion));

loadMetadata().catch(error => {
  loading.textContent = `天气模块读取失败：${error.message}`;
  mediaControls.hidden = true;
});
