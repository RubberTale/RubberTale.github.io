// DeepSlop Client (Connecting to Dedicated WSS Relay)
(function() {
  'use strict';

  // Primary WSS Relay Server endpoint on this server
  const RELAY_WS_URL = 'wss://140.245.65.111.sslip.io/ws/deepslop/';
  const RELAY_API_URL = 'https://140.245.65.111.sslip.io/api/deepslop';

  // --- Sound Effects System (Web Audio API) ---
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) audioCtx = new AudioCtx();
  }

  function playTone(freq, type, duration, gainVal = 0.1) {
    try {
      initAudio();
      if (audioCtx.state === 'suspended') audioCtx.resume();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(gainVal, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
  }

  function playMatchSound() {
    playTone(587.33, 'triangle', 0.15, 0.15);
    setTimeout(() => playTone(880, 'triangle', 0.3, 0.15), 120);
  }

  function playCoinSound() {
    playTone(987.77, 'sine', 0.1, 0.15);
    setTimeout(() => playTone(1318.51, 'sine', 0.35, 0.15), 80);
  }

  function playTickSound() {
    playTone(800, 'square', 0.03, 0.05);
  }

  function playErrorSound() {
    playTone(220, 'sawtooth', 0.25, 0.15);
  }

  // --- Application State ---
  const defaultNames = ['碳基算力小张', '野生大模型007', '人工智障二号机', '赛博实习生', 'GPT五道口分T', '深思纯牛马', 'Claude野生版', '机智的碳水生物'];
  const initialNick = localStorage.getItem('deepslop_nick') || (defaultNames[Math.floor(Math.random() * defaultNames.length)] + '_' + Math.floor(1000 + Math.random() * 9000));

  const state = {
    ws: null,
    isConnected: false,
    player: {
      id: null,
      nickname: initialNick,
      tokens: 5,
      role: 'idle',
      currentTaskId: null
    },
    currentTab: 'ask-tab',
    promptType: 'text',
    activeAskTask: null,
    activeWorkTask: null,
    workTimerInterval: null,
    workTimeRemaining: 60,
    gallery: [],
    galleryFilter: 'all',
    lastDrawPoint: null,
    isDrawing: false
  };

  // --- DOM Elements ---
  const el = {
    onlineCountText: document.getElementById('onlineCountText'),
    queueCountText: document.getElementById('queueCountText'),
    playerTokenCount: document.getElementById('playerTokenCount'),
    playerNicknameDisplay: document.getElementById('playerNicknameDisplay'),
    userPillBtn: document.getElementById('userPillBtn'),
    workBadge: document.getElementById('workBadge'),
    tabBtns: document.querySelectorAll('.tab-btn'),
    tabPanes: document.querySelectorAll('.tab-pane'),
    modelSelect: document.getElementById('modelSelect'),
    promptTypeBtns: document.querySelectorAll('.type-btn'),
    promptInput: document.getElementById('promptInput'),
    sendPromptBtn: document.getElementById('sendPromptBtn'),
    sampleChips: document.querySelectorAll('.sample-chip'),
    askIdleState: document.getElementById('askIdleState'),
    askActiveState: document.getElementById('askActiveState'),
    sessionStatusText: document.getElementById('sessionStatusText'),
    sessionStatusDot: document.getElementById('sessionStatusDot'),
    cancelPromptBtn: document.getElementById('cancelPromptBtn'),
    askPromptTime: document.getElementById('askPromptTime'),
    askPromptContent: document.getElementById('askPromptContent'),
    askWorkerNameDisplay: document.getElementById('askWorkerNameDisplay'),
    askModelTag: document.getElementById('askModelTag'),
    streamTag: document.getElementById('streamTag'),
    askResponseText: document.getElementById('askResponseText'),
    askResponseImageWrap: document.getElementById('askResponseImageWrap'),
    askResponseImg: document.getElementById('askResponseImg'),
    rlhfPanel: document.getElementById('rlhfPanel'),
    rlhfBtns: document.querySelectorAll('.rlhf-btn'),
    workLobbyCard: document.getElementById('workLobbyCard'),
    workbenchCard: document.getElementById('workbenchCard'),
    taskQueueList: document.getElementById('taskQueueList'),
    requestBotTaskBtn: document.getElementById('requestBotTaskBtn'),
    workTaskTypeBadge: document.getElementById('workTaskTypeBadge'),
    workAskerTag: document.getElementById('workAskerTag'),
    workTimerCountdown: document.getElementById('workTimerCountdown'),
    workTimerBar: document.getElementById('workTimerBar'),
    workPromptDisplay: document.getElementById('workPromptDisplay'),
    workerTextEditorWrap: document.getElementById('workerTextEditorWrap'),
    workerTextInput: document.getElementById('workerTextInput'),
    workerCanvasWrap: document.getElementById('workerCanvasWrap'),
    paintCanvas: document.getElementById('paintCanvas'),
    brushColor: document.getElementById('brushColor'),
    brushSize: document.getElementById('brushSize'),
    eraserBtn: document.getElementById('eraserBtn'),
    clearCanvasBtn: document.getElementById('clearCanvasBtn'),
    clicheBtns: document.querySelectorAll('.cliche-btn'),
    submitWorkBtn: document.getElementById('submitWorkBtn'),
    galleryGrid: document.getElementById('galleryGrid'),
    filterBtns: document.querySelectorAll('.filter-btn'),
    nicknameModal: document.getElementById('nicknameModal'),
    newNicknameInput: document.getElementById('newNicknameInput'),
    closeNickModalBtn: document.getElementById('closeNickModalBtn'),
    saveNicknameBtn: document.getElementById('saveNicknameBtn'),
    toastContainer: document.getElementById('toastContainer')
  };

  let ctx = null;
  let isErasing = false;
  if (el.paintCanvas) {
    ctx = el.paintCanvas.getContext('2d');
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }

  // --- WebSocket Connection ---
  function connectWebSocket() {
    try {
      state.ws = new WebSocket(RELAY_WS_URL);

      state.ws.onopen = () => {
        state.isConnected = true;
        console.log('Connected to DeepSlop Central Relay:', RELAY_WS_URL);
        if (state.player.nickname) {
          sendWs({ type: 'UPDATE_NICKNAME', nickname: state.player.nickname });
        }
      };

      state.ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          handleServerMessage(msg);
        } catch (err) {
          console.error('Error handling WS message:', err);
        }
      };

      state.ws.onclose = () => {
        state.isConnected = false;
        el.onlineCountText.textContent = '重连中...';
        setTimeout(connectWebSocket, 3000);
      };

      state.ws.onerror = (err) => {
        console.warn('WS Relay Notice:', err);
      };
    } catch (e) {
      console.error('WS Connection failure:', e);
    }
  }

  function sendWs(data) {
    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.send(JSON.stringify(data));
    }
  }

  // --- Server Message Handler ---
  function handleServerMessage(msg) {
    switch (msg.type) {
      case 'INIT_PROFILE':
        state.player.id = msg.player.id;
        state.player.tokens = msg.player.tokens;
        if (!state.player.nickname) {
          state.player.nickname = msg.player.nickname;
        } else {
          sendWs({ type: 'UPDATE_NICKNAME', nickname: state.player.nickname });
        }
        updateProfileUI();
        break;

      case 'PROFILE_UPDATED':
        state.player.nickname = msg.player.nickname;
        localStorage.setItem('deepslop_nick', state.player.nickname);
        updateProfileUI();
        showToast('代号修改成功！', 'success');
        break;

      case 'STATS_UPDATE':
        el.onlineCountText.textContent = `在线算力: ${msg.onlineCount} 人`;
        el.queueCountText.textContent = `待接工单: ${msg.queueCount}`;
        el.workBadge.textContent = `${msg.queueCount} 抢单`;
        renderTaskQueue(msg.waitingTasks || []);
        break;

      case 'NEW_ORDER_AVAILABLE':
        playTone(440, 'sine', 0.1, 0.08);
        showToast(`⚡ 发现新工单: "${msg.taskInfo.prompt}"`, 'info');
        break;

      case 'PROMPT_CREATED':
        state.activeAskTask = msg.task;
        state.player.tokens = msg.remainingTokens;
        updateProfileUI();
        renderAskActiveState();
        break;

      case 'WORKER_MATCHED':
        playMatchSound();
        if (state.activeAskTask && state.activeAskTask.id === msg.taskId) {
          el.sessionStatusText.textContent = `已锁定算力节点 [${msg.workerName}] (正在计算...)`;
          el.askWorkerNameDisplay.textContent = `🤖 ${msg.workerName}`;
          el.streamTag.style.display = 'inline-block';
          el.askResponseText.innerHTML = '<div class="typing-placeholder"><span class="dot-typing"></span><span class="typing-text">算力节点正在疯狂打字/画画...</span></div>';
        }
        break;

      case 'STREAM_UPDATE':
        if (state.activeAskTask && state.activeAskTask.id === msg.taskId) {
          if (msg.streamType === 'text') {
            el.askResponseText.textContent = msg.content;
            playTone(1200 + Math.random() * 400, 'sine', 0.02, 0.02);
          } else if (msg.streamType === 'canvas_snapshot') {
            el.askResponseText.style.display = 'none';
            el.askResponseImageWrap.style.display = 'block';
            el.askResponseImg.src = msg.content;
          }
        }
        break;

      case 'RESPONSE_DELIVERED':
        playCoinSound();
        if (state.activeAskTask && state.activeAskTask.id === msg.taskId) {
          el.sessionStatusText.textContent = `✅ 生成完成！来自 [${msg.workerName}]`;
          el.streamTag.style.display = 'none';
          if (msg.promptType === 'text') {
            el.askResponseText.style.display = 'block';
            el.askResponseText.textContent = msg.response;
          } else {
            el.askResponseText.style.display = 'none';
            el.askResponseImageWrap.style.display = 'block';
            el.askResponseImg.src = msg.response;
          }
          el.rlhfPanel.style.display = 'block';
          el.cancelPromptBtn.style.display = 'none';
        }
        break;

      case 'TASK_CLAIMED':
        playMatchSound();
        state.activeWorkTask = msg.task;
        openWorkbench(msg.task);
        break;

      case 'TASK_SUBMITTED_SUCCESS':
        playCoinSound();
        state.player.tokens = msg.currentTokens;
        updateProfileUI();
        closeWorkbench();
        showToast(`🎉 提交成功！获得 +${msg.earnedTokens} 算力代币`, 'success');
        break;

      case 'TOKEN_BONUS':
        playCoinSound();
        state.player.tokens = msg.currentTokens;
        updateProfileUI();
        showToast(`⭐ ${msg.reason}`, 'success');
        break;

      case 'RATE_ACK':
        showToast('感谢您的强化学习打分！', 'success');
        el.rlhfPanel.style.display = 'none';
        state.activeAskTask = null;
        setTimeout(() => {
          el.askActiveState.style.display = 'none';
          el.askIdleState.style.display = 'block';
        }, 1500);
        break;

      case 'NEW_GALLERY_ITEM':
        state.gallery.unshift(msg.item);
        renderGallery();
        break;

      case 'PROMPT_CANCELLED':
        state.player.tokens = msg.refundedTokens;
        updateProfileUI();
        state.activeAskTask = null;
        el.askActiveState.style.display = 'none';
        el.askIdleState.style.display = 'block';
        showToast('已取消请求，算力代币已全额退还。', 'info');
        break;

      case 'TASK_TIMEOUT_WORKER':
        playErrorSound();
        closeWorkbench();
        showToast(msg.message, 'error');
        break;

      case 'ERROR_MSG':
        playErrorSound();
        showToast(msg.message, 'error');
        break;
    }
  }

  // --- UI Helpers ---
  function updateProfileUI() {
    el.playerTokenCount.textContent = state.player.tokens;
    el.playerNicknameDisplay.textContent = state.player.nickname || '碳基计算单元';
  }

  function showToast(text, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = text;
    el.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }

  // --- Tab Navigation ---
  el.tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      state.currentTab = targetTab;
      el.tabBtns.forEach(b => b.classList.remove('active'));
      el.tabPanes.forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });

  // --- Tab 1: Ask Logic ---
  el.promptTypeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      el.promptTypeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.promptType = btn.getAttribute('data-type');
      if (state.promptType === 'image') {
        el.promptInput.placeholder = '输入画面描述，让真人 AI 用鼠标画给你... 例如：“画一个星期五下午五点半下班狂奔的打工人”';
      } else {
        el.promptInput.placeholder = '向全网在线的真实人类AI输入你的 Prompt... 例如：“请用鲁迅的语气写一份辞职报告”';
      }
    });
  });

  el.sampleChips.forEach(chip => {
    chip.addEventListener('click', () => {
      el.promptInput.value = chip.getAttribute('data-sample');
      el.promptInput.focus();
    });
  });

  el.sendPromptBtn.addEventListener('click', () => {
    const promptText = el.promptInput.value.trim();
    if (!promptText) {
      showToast('请输入 Prompt 内容！', 'error');
      return;
    }
    if (state.player.tokens < 1) {
      showToast('算力代币不足！请前往【打工扮演AI】赚取代币！', 'error');
      return;
    }

    sendWs({
      type: 'CREATE_PROMPT',
      prompt: promptText,
      promptType: state.promptType,
      modelStyle: el.modelSelect.value
    });

    el.promptInput.value = '';
  });

  el.cancelPromptBtn.addEventListener('click', () => {
    sendWs({ type: 'CANCEL_PROMPT' });
  });

  function renderAskActiveState() {
    el.askIdleState.style.display = 'none';
    el.askActiveState.style.display = 'flex';
    el.sessionStatusText.textContent = '正在全球广播匹配高素质碳基算力...';
    el.cancelPromptBtn.style.display = 'inline-block';
    el.askPromptTime.textContent = new Date().toLocaleTimeString();
    el.askPromptContent.textContent = state.activeAskTask.prompt;
    el.askModelTag.textContent = state.activeAskTask.modelStyle;
    el.askWorkerNameDisplay.textContent = '🤖 寻找算力节点中...';
    el.streamTag.style.display = 'none';
    el.askResponseText.style.display = 'block';
    el.askResponseText.innerHTML = '<div class="typing-placeholder"><span class="dot-typing"></span><span class="typing-text">等待算力节点抢单接取...</span></div>';
    el.askResponseImageWrap.style.display = 'none';
    el.rlhfPanel.style.display = 'none';
  }

  el.rlhfBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!state.activeAskTask) return;
      const rating = btn.getAttribute('data-rating');
      sendWs({
        type: 'RATE_RESPONSE',
        taskId: state.activeAskTask.id,
        rating
      });
    });
  });

  // --- Tab 2: Worker Logic ---
  function renderTaskQueue(tasks) {
    if (!tasks || tasks.length === 0) {
      el.taskQueueList.innerHTML = `
        <div class="empty-queue-tip">
          <span class="tip-icon">☕</span>
          <p>当前暂无等待中的网友工单...</p>
          <small>你可以稍等片刻，或者点击上方<b>【模拟生成仿真工单】</b>立刻开始打工！</small>
        </div>
      `;
      return;
    }

    el.taskQueueList.innerHTML = tasks.map(t => `
      <div class="task-card-item">
        <div class="task-info-left">
          <div class="task-meta-line">
            <span class="task-type-badge">${t.type === 'image' ? '🎨 文生图' : '📝 文本对话'}</span>
            <span>提问者: ${escapeHtml(t.askerName)}</span>
          </div>
          <div class="task-prompt-snippet">"${escapeHtml(t.prompt)}"</div>
        </div>
        <button class="btn btn-primary btn-sm claim-btn" data-task-id="${t.id}">
          <span>⚡ 立即抢单 (+2)</span>
        </button>
      </div>
    `).join('');

    el.taskQueueList.querySelectorAll('.claim-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const taskId = btn.getAttribute('data-task-id');
        sendWs({ type: 'ACCEPT_TASK', taskId });
      });
    });
  }

  el.requestBotTaskBtn.addEventListener('click', () => {
    sendWs({ type: 'REQUEST_BOT_TASK' });
  });

  function openWorkbench(task) {
    el.workLobbyCard.style.display = 'none';
    el.workbenchCard.style.display = 'flex';

    el.workTaskTypeBadge.textContent = task.type === 'image' ? '🎨 文生图任务' : '📝 文本生成任务';
    el.workAskerTag.textContent = `提问者: ${task.askerName}`;
    el.workPromptDisplay.textContent = task.prompt;

    state.workTimeRemaining = task.duration || 60;
    updateWorkTimerUI();

    clearInterval(state.workTimerInterval);
    state.workTimerInterval = setInterval(() => {
      state.workTimeRemaining--;
      updateWorkTimerUI();
      if (state.workTimeRemaining <= 10) playTickSound();
      if (state.workTimeRemaining <= 0) {
        clearInterval(state.workTimerInterval);
      }
    }, 1000);

    if (task.type === 'image') {
      el.workerTextEditorWrap.style.display = 'none';
      el.workerCanvasWrap.style.display = 'flex';
      initCanvas();
    } else {
      el.workerTextEditorWrap.style.display = 'block';
      el.workerCanvasWrap.style.display = 'none';
      el.workerTextInput.value = '';
      el.workerTextInput.focus();
    }

    if (state.currentTab !== 'work-tab') {
      document.querySelector('[data-tab="work-tab"]').click();
    }
  }

  function closeWorkbench() {
    clearInterval(state.workTimerInterval);
    state.activeWorkTask = null;
    el.workbenchCard.style.display = 'none';
    el.workLobbyCard.style.display = 'block';
  }

  function updateWorkTimerUI() {
    el.workTimerCountdown.textContent = `${state.workTimeRemaining}s`;
    const percent = Math.max(0, (state.workTimeRemaining / 60) * 100);
    el.workTimerBar.style.width = `${percent}%`;
    if (state.workTimeRemaining <= 15) {
      el.workTimerBar.style.background = 'var(--accent-red)';
      el.workTimerCountdown.style.color = 'var(--accent-red)';
    } else {
      el.workTimerBar.style.background = 'var(--accent-yellow)';
      el.workTimerCountdown.style.color = 'var(--accent-yellow)';
    }
  }

  // Real-time Text Streaming
  let textStreamThrottle = null;
  el.workerTextInput.addEventListener('input', () => {
    if (!state.activeWorkTask) return;
    const text = el.workerTextInput.value;

    if (!textStreamThrottle) {
      textStreamThrottle = setTimeout(() => {
        sendWs({
          type: 'STREAM_DELTA',
          taskId: state.activeWorkTask.id,
          streamType: 'text',
          content: text
        });
        textStreamThrottle = null;
      }, 80);
    }
  });

  // AI Cliches injection
  el.clicheBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const snippet = btn.getAttribute('data-text');
      el.workerTextInput.value += snippet;
      el.workerTextInput.dispatchEvent(new Event('input'));
      el.workerTextInput.focus();
    });
  });

  // --- Canvas Drawing Logic ---
  function initCanvas() {
    ctx.fillStyle = '#1a1a24';
    ctx.fillRect(0, 0, el.paintCanvas.width, el.paintCanvas.height);
    isErasing = false;
    el.eraserBtn.style.background = '';
  }

  function getCanvasPos(e) {
    const rect = el.paintCanvas.getBoundingClientRect();
    const scaleX = el.paintCanvas.width / rect.width;
    const scaleY = el.paintCanvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  let canvasStreamThrottle = null;
  function broadcastCanvasSnapshot() {
    if (!state.activeWorkTask) return;
    if (!canvasStreamThrottle) {
      canvasStreamThrottle = setTimeout(() => {
        const dataUrl = el.paintCanvas.toDataURL('image/jpeg', 0.6);
        sendWs({
          type: 'STREAM_DELTA',
          taskId: state.activeWorkTask.id,
          streamType: 'canvas_snapshot',
          content: dataUrl
        });
        canvasStreamThrottle = null;
      }, 150);
    }
  }

  function startDrawing(e) {
    state.isDrawing = true;
    state.lastDrawPoint = getCanvasPos(e);
  }

  function draw(e) {
    if (!state.isDrawing) return;
    const currentPoint = getCanvasPos(e);

    ctx.beginPath();
    ctx.moveTo(state.lastDrawPoint.x, state.lastDrawPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.strokeStyle = isErasing ? '#1a1a24' : el.brushColor.value;
    ctx.lineWidth = isErasing ? el.brushSize.value * 3 : el.brushSize.value;
    ctx.stroke();

    state.lastDrawPoint = currentPoint;
    broadcastCanvasSnapshot();
  }

  function stopDrawing() {
    state.isDrawing = false;
  }

  if (el.paintCanvas) {
    el.paintCanvas.addEventListener('mousedown', startDrawing);
    el.paintCanvas.addEventListener('mousemove', draw);
    window.addEventListener('mouseup', stopDrawing);

    el.paintCanvas.addEventListener('touchstart', (e) => { e.preventDefault(); startDrawing(e); }, { passive: false });
    el.paintCanvas.addEventListener('touchmove', (e) => { e.preventDefault(); draw(e); }, { passive: false });
    el.paintCanvas.addEventListener('touchend', stopDrawing);
  }

  el.eraserBtn.addEventListener('click', () => {
    isErasing = !isErasing;
    el.eraserBtn.style.background = isErasing ? 'var(--accent-red)' : '';
    el.eraserBtn.style.color = isErasing ? '#fff' : '';
  });

  el.clearCanvasBtn.addEventListener('click', () => {
    initCanvas();
    broadcastCanvasSnapshot();
  });

  // Submit Work Button
  el.submitWorkBtn.addEventListener('click', () => {
    if (!state.activeWorkTask) return;

    let responsePayload = '';
    if (state.activeWorkTask.type === 'image') {
      responsePayload = el.paintCanvas.toDataURL('image/jpeg', 0.85);
    } else {
      responsePayload = el.workerTextInput.value.trim();
      if (!responsePayload) {
        showToast('回答不能为空！请保持 AI 伪装并输入回答内容。', 'error');
        return;
      }
    }

    sendWs({
      type: 'SUBMIT_TASK_RESULT',
      taskId: state.activeWorkTask.id,
      response: responsePayload
    });
  });

  // --- Tab 3: Slop Gallery ---
  function fetchInitialGallery() {
    fetch(`${RELAY_API_URL}/gallery`)
      .then(res => res.json())
      .then(data => {
        state.gallery = data.gallery || [];
        renderGallery();
      })
      .catch(err => {
        console.warn('Gallery fallback:', err);
      });
  }

  function renderGallery() {
    const filtered = state.gallery.filter(item => {
      if (state.galleryFilter === 'all') return true;
      return item.type === state.galleryFilter;
    });

    if (filtered.length === 0) {
      el.galleryGrid.innerHTML = '<div style="color:var(--text-dim); text-align:center; grid-column:1/-1; padding:40px;">暂无水货作品，快去提问或打工创造第一批杰作吧！</div>';
      return;
    }

    el.galleryGrid.innerHTML = filtered.map(item => `
      <div class="gallery-card">
        <div class="gallery-card-header">
          <span>${item.type === 'image' ? '🎨 人工生图' : '📝 碳基文本'}</span>
          <span class="gallery-rating-pill">${escapeHtml(item.ratingText || '已完成')}</span>
        </div>
        <div class="gallery-prompt">"${escapeHtml(item.prompt)}"</div>
        <div class="gallery-response">
          ${item.type === 'image' 
            ? `<img src="${item.response}" alt="AI 草图" loading="lazy">` 
            : escapeHtml(item.response)}
        </div>
        <div class="gallery-card-footer">
          <span>提问: ${escapeHtml(item.askerName || '匿名')}</span>
          <span>扮演AI: ${escapeHtml(item.workerName || '匿名')}</span>
        </div>
      </div>
    `).join('');
  }

  el.filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      el.filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.galleryFilter = btn.getAttribute('data-filter');
      renderGallery();
    });
  });

  // --- Nickname Modal ---
  el.userPillBtn.addEventListener('click', () => {
    el.newNicknameInput.value = state.player.nickname || '';
    el.nicknameModal.style.display = 'flex';
    el.newNicknameInput.focus();
  });

  el.closeNickModalBtn.addEventListener('click', () => {
    el.nicknameModal.style.display = 'none';
  });

  el.saveNicknameBtn.addEventListener('click', () => {
    const newNick = el.newNicknameInput.value.trim();
    if (newNick) {
      sendWs({ type: 'UPDATE_NICKNAME', nickname: newNick });
      el.nicknameModal.style.display = 'none';
    }
  });

  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  // --- Initialize ---
  connectWebSocket();
  fetchInitialGallery();

})();
