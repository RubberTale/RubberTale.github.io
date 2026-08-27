// DeepSlop Frontend Controller (Universal Mesh & WebSocket Edition)
(function() {
  'use strict';

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

  // --- Simulation & Fallback Data ---
  const BOT_PROMPT_POOL = [
    { type: 'text', prompt: '请用《狂人日记》的语气写一份关于星期一早八上班的周报。' },
    { type: 'text', prompt: '为什么红烧牛肉面里的牛肉总是那么薄？从量子力学角度分析。' },
    { type: 'text', prompt: '如果你是秦始皇，面对V我50的请求你会怎么回复？' },
    { type: 'text', prompt: '写一段代码，让我的电脑在周五下午5点自动假装死机。' },
    { type: 'text', prompt: '女朋友问我和她妈同时掉水里先救谁，请给出情商最高的回答。' },
    { type: 'text', prompt: '如何向古代皇帝解释什么是“疯狂星期四”？' },
    { type: 'text', prompt: '为什么人类一边害怕AI毁灭世界，一边用AI给猫猫照片配电音？' },
    { type: 'text', prompt: '请帮我写一封辞职信，理由是“我要回M78星云拯救光之国”。' },
    { type: 'image', prompt: '画一只戴着墨镜狂炫西瓜的赛博朋克机械柯基犬。' },
    { type: 'image', prompt: '画出“星期一早上起床时的精神状态”。' },
    { type: 'image', prompt: '画一个被甲方改了第18版方案后的设计师灵魂出窍图。' },
    { type: 'image', prompt: '画一台正在偷偷摸鱼打扑克的AI超级计算机。' },
    { type: 'image', prompt: '画出“钱包比脸还干净”的写实肖像。' }
  ];

  const BOT_TEXT_ANSWERS = [
    "作为一个大型碳基人工语言模型，我必须指出：这个问题触及了我的知识盲区，但我还是可以一本正经地胡说八道。经系统分析，最好的解决方案是先喝一杯奶茶静静。",
    "【深度思考中 18.2s】\n其实我在疯狂查百度。总结如下：\n1. 确实是这么回事；\n2. 但也不完全是；\n3. 听君一席话，如听一席话。\n感谢您的使用，请为本次人工服务点赞！",
    "非常抱歉，我不能协助完成该请求，因为该问题可能会导致回答者的脑细胞超载。建议您重启您的人生或重试一次。",
    "根据最新多模态大数据统计，您的问题答案是：42。如果对结果不满意，说明您当前使用的碳基计算节点（也就是我）饿了，需要一顿烧烤作为算力补给。"
  ];

  const BOT_IMAGE_ANSWERS = [
    "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'><rect width='100%' height='100%' fill='%231a1a24'/><circle cx='200' cy='150' r='70' stroke='%2300ffcc' stroke-width='4' fill='none'/><circle cx='175' cy='135' r='8' fill='%2300ffcc'/><circle cx='225' cy='135' r='8' fill='%2300ffcc'/><path d='M 170 175 Q 200 210 230 175' stroke='%23ff0055' stroke-width='4' fill='none'/><text x='200' y='265' font-family='sans-serif' font-size='15' text-anchor='middle' fill='%23888'>[纯人工手绘 AI 杰作]</text></svg>"
  ];

  // --- Application State ---
  const defaultNames = ['碳基算力小张', '野生大模型007', '人工智障二号机', '赛博实习生', 'GPT五道口分T', '深思纯牛马', 'Claude野生版', '机智的碳水生物'];
  const initialNick = localStorage.getItem('deepslop_nick') || (defaultNames[Math.floor(Math.random() * defaultNames.length)] + '_' + Math.floor(1000 + Math.random() * 9000));
  const initialTokens = parseInt(localStorage.getItem('deepslop_tokens') || '5', 10);

  const state = {
    ws: null,
    broadcastChannel: window.BroadcastChannel ? new BroadcastChannel('deepslop_mesh_net') : null,
    isMeshMode: true,
    player: {
      id: 'p_' + Math.random().toString(36).substr(2, 9),
      nickname: initialNick,
      tokens: isNaN(initialTokens) ? 5 : initialTokens,
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
    isDrawing: false,
    localQueue: [],
    onlinePeers: new Set()
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

  // --- Network Dispatcher (WS + Cross-Tab Mesh) ---
  function sendNetworkMessage(msg) {
    msg.fromPeerId = state.player.id;
    msg.fromNick = state.player.nickname;

    if (state.ws && state.ws.readyState === WebSocket.OPEN) {
      state.ws.send(JSON.stringify(msg));
    }
    if (state.broadcastChannel) {
      state.broadcastChannel.postMessage(msg);
    }
    // Handle self-loop for mesh if needed
    if (state.isMeshMode) {
      handleMeshLoop(msg);
    }
  }

  function handleMeshLoop(msg) {
    // When sending task creation, register in local queue
    if (msg.type === 'CREATE_PROMPT') {
      const task = {
        id: 'task_' + Math.random().toString(36).substr(2, 9),
        askerId: state.player.id,
        askerName: state.player.nickname,
        type: msg.promptType,
        prompt: msg.prompt,
        modelStyle: msg.modelStyle,
        status: 'queued',
        createdAt: Date.now()
      };
      state.activeAskTask = task;
      state.localQueue.push(task);
      saveLocalQueue();
      updateMeshStats();
      renderAskActiveState();

      // Broadcast new task to peers
      if (state.broadcastChannel) {
        state.broadcastChannel.postMessage({
          type: 'NEW_ORDER_AVAILABLE',
          taskInfo: {
            id: task.id,
            type: task.type,
            prompt: task.prompt,
            askerName: task.askerName
          }
        });
      }

      // Auto Bot fallback after 12s if solo
      setTimeout(() => {
        if (state.activeAskTask && state.activeAskTask.id === task.id && state.activeAskTask.status === 'queued') {
          fulfillWithLocalBot(task);
        }
      }, 10000);
    }
  }

  // --- Mesh Channel Receiver ---
  if (state.broadcastChannel) {
    state.broadcastChannel.onmessage = (event) => {
      const msg = event.data;
      if (!msg || msg.fromPeerId === state.player.id) return;
      handleServerMessage(msg);
    };
  }

  // Heartbeat for Mesh Peers
  setInterval(() => {
    if (state.broadcastChannel) {
      state.broadcastChannel.postMessage({
        type: 'PEER_HEARTBEAT',
        fromPeerId: state.player.id,
        fromNick: state.player.nickname
      });
    }
  }, 3000);

  function updateMeshStats() {
    const onlineCount = Math.max(1, state.onlinePeers.size + 1);
    el.onlineCountText.textContent = `在线算力: ${onlineCount} 人`;
    el.queueCountText.textContent = `待接工单: ${state.localQueue.length}`;
    el.workBadge.textContent = `${state.localQueue.length} 抢单`;
    renderTaskQueue(state.localQueue);
  }

  function saveLocalQueue() {
    localStorage.setItem('deepslop_queue', JSON.stringify(state.localQueue));
  }

  function loadLocalQueue() {
    try {
      const q = JSON.parse(localStorage.getItem('deepslop_queue') || '[]');
      // Filter out stale tasks older than 5 mins
      const now = Date.now();
      state.localQueue = q.filter(t => (now - t.createdAt) < 300000 && t.status === 'queued');
    } catch(e) {
      state.localQueue = [];
    }
  }

  // --- Server Message Handler ---
  function handleServerMessage(msg) {
    switch (msg.type) {
      case 'PEER_HEARTBEAT':
        state.onlinePeers.add(msg.fromPeerId);
        updateMeshStats();
        setTimeout(() => {
          state.onlinePeers.delete(msg.fromPeerId);
          updateMeshStats();
        }, 8000);
        break;

      case 'NEW_ORDER_AVAILABLE':
        playTone(440, 'sine', 0.1, 0.08);
        showToast(`⚡ 发现新工单: "${msg.taskInfo.prompt}"`, 'info');
        loadLocalQueue();
        if (!state.localQueue.find(t => t.id === msg.taskInfo.id)) {
          state.localQueue.push({
            id: msg.taskInfo.id,
            type: msg.taskInfo.type,
            prompt: msg.taskInfo.prompt,
            askerName: msg.taskInfo.askerName,
            status: 'queued',
            createdAt: Date.now()
          });
        }
        updateMeshStats();
        break;

      case 'ACCEPT_TASK':
        // Someone claimed a task
        const taskIdx = state.localQueue.findIndex(t => t.id === msg.taskId);
        if (taskIdx !== -1) {
          state.localQueue.splice(taskIdx, 1);
          saveLocalQueue();
          updateMeshStats();
        }
        if (state.activeAskTask && state.activeAskTask.id === msg.taskId) {
          playMatchSound();
          state.activeAskTask.status = 'matched';
          el.sessionStatusText.textContent = `已锁定算力节点 [${msg.fromNick}] (正在计算...)`;
          el.askWorkerNameDisplay.textContent = `🤖 ${msg.fromNick}`;
          el.streamTag.style.display = 'inline-block';
          el.askResponseText.innerHTML = '<div class="typing-placeholder"><span class="dot-typing"></span><span class="typing-text">算力节点正在疯狂打字...</span></div>';
        }
        break;

      case 'STREAM_DELTA':
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

      case 'SUBMIT_TASK_RESULT':
        if (state.activeAskTask && state.activeAskTask.id === msg.taskId) {
          playCoinSound();
          el.sessionStatusText.textContent = `✅ 生成完成！来自 [${msg.fromNick}]`;
          el.streamTag.style.display = 'none';
          if (state.activeAskTask.type === 'text') {
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

      case 'RATE_RESPONSE':
        // If worker received upvote
        if (msg.rating === 'up' && state.activeWorkTask && state.activeWorkTask.id === msg.taskId) {
          state.player.tokens += 1;
          saveTokens();
          updateProfileUI();
          playCoinSound();
          showToast('⭐ 提问者对您的回答非常满意，奖励 +1 算力代币！', 'success');
        }
        break;

      case 'NEW_GALLERY_ITEM':
        state.gallery.unshift(msg.item);
        saveLocalGallery();
        renderGallery();
        break;
    }
  }

  // --- Fallback Bot Fulfill ---
  function fulfillWithLocalBot(task) {
    task.workerName = 'DeepSlop 备用机务组 (Bot)';
    task.status = 'matched';
    el.sessionStatusText.textContent = `已接入备用碳基机组 [${task.workerName}]`;
    el.askWorkerNameDisplay.textContent = `🤖 ${task.workerName}`;
    el.streamTag.style.display = 'inline-block';

    setTimeout(() => {
      let answer = '';
      if (task.type === 'text') {
        answer = BOT_TEXT_ANSWERS[Math.floor(Math.random() * BOT_TEXT_ANSWERS.length)];
        el.askResponseText.style.display = 'block';
        el.askResponseText.textContent = answer;
      } else {
        answer = BOT_IMAGE_ANSWERS[Math.floor(Math.random() * BOT_IMAGE_ANSWERS.length)];
        el.askResponseText.style.display = 'none';
        el.askResponseImageWrap.style.display = 'block';
        el.askResponseImg.src = answer;
      }
      task.response = answer;
      task.status = 'completed';
      el.sessionStatusText.textContent = `✅ 生成完成！来自 [${task.workerName}]`;
      el.streamTag.style.display = 'none';
      el.rlhfPanel.style.display = 'block';
      el.cancelPromptBtn.style.display = 'none';
      playCoinSound();
    }, 2000);
  }

  // --- UI Helpers ---
  function saveTokens() {
    localStorage.setItem('deepslop_tokens', state.player.tokens);
  }

  function updateProfileUI() {
    el.playerTokenCount.textContent = state.player.tokens;
    el.playerNicknameDisplay.textContent = state.player.nickname;
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

    state.player.tokens -= 1;
    saveTokens();
    updateProfileUI();

    sendNetworkMessage({
      type: 'CREATE_PROMPT',
      prompt: promptText,
      promptType: state.promptType,
      modelStyle: el.modelSelect.value
    });

    el.promptInput.value = '';
  });

  el.cancelPromptBtn.addEventListener('click', () => {
    if (state.activeAskTask && state.activeAskTask.status === 'queued') {
      state.player.tokens += 1;
      saveTokens();
      updateProfileUI();

      // Remove from local queue
      const idx = state.localQueue.findIndex(t => t.id === state.activeAskTask.id);
      if (idx !== -1) state.localQueue.splice(idx, 1);
      saveLocalQueue();
      updateMeshStats();

      state.activeAskTask = null;
      el.askActiveState.style.display = 'none';
      el.askIdleState.style.display = 'block';
      showToast('已取消请求，算力代币已全额退还。', 'info');
    }
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
      let ratingText = '好评';
      if (rating === 'up') ratingText = '过于智能 (👍)';
      else if (rating === 'robot') ratingText = '机械飞升 (🤖)';
      else ratingText = '纯纯水货 (💩)';

      const galleryItem = {
        id: state.activeAskTask.id,
        type: state.activeAskTask.type,
        prompt: state.activeAskTask.prompt,
        response: state.activeAskTask.response,
        workerName: state.activeAskTask.workerName || '碳基计算单元',
        askerName: state.player.nickname,
        rating,
        ratingText,
        timestamp: Date.now()
      };

      state.gallery.unshift(galleryItem);
      saveLocalGallery();
      renderGallery();

      sendNetworkMessage({
        type: 'RATE_RESPONSE',
        taskId: state.activeAskTask.id,
        rating
      });

      sendNetworkMessage({
        type: 'NEW_GALLERY_ITEM',
        item: galleryItem
      });

      showToast('感谢您的强化学习打分！', 'success');
      el.rlhfPanel.style.display = 'none';
      state.activeAskTask = null;
      setTimeout(() => {
        el.askActiveState.style.display = 'none';
        el.askIdleState.style.display = 'block';
      }, 1500);
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
        const task = state.localQueue.find(t => t.id === taskId);
        if (task) {
          claimTask(task);
        }
      });
    });
  }

  el.requestBotTaskBtn.addEventListener('click', () => {
    const randomPromptObj = BOT_PROMPT_POOL[Math.floor(Math.random() * BOT_PROMPT_POOL.length)];
    const simTask = {
      id: 'bot_task_' + Math.random().toString(36).substr(2, 9),
      askerName: '系统算力调度中心',
      type: randomPromptObj.type,
      prompt: randomPromptObj.prompt,
      duration: 60
    };
    claimTask(simTask);
  });

  function claimTask(task) {
    // Remove from queue
    const idx = state.localQueue.findIndex(t => t.id === task.id);
    if (idx !== -1) {
      state.localQueue.splice(idx, 1);
      saveLocalQueue();
      updateMeshStats();
    }

    sendNetworkMessage({
      type: 'ACCEPT_TASK',
      taskId: task.id
    });

    state.activeWorkTask = task;
    openWorkbench(task);
  }

  function openWorkbench(task) {
    playMatchSound();
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
        playErrorSound();
        closeWorkbench();
        showToast('回答超时！未能按时提交。', 'error');
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
        sendNetworkMessage({
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

  // Canvas Drawing
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
        sendNetworkMessage({
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

    sendNetworkMessage({
      type: 'SUBMIT_TASK_RESULT',
      taskId: state.activeWorkTask.id,
      response: responsePayload
    });

    state.player.tokens += 2;
    saveTokens();
    updateProfileUI();
    playCoinSound();
    closeWorkbench();
    showToast('🎉 提交成功！获得 +2 算力代币', 'success');
  });

  // --- Tab 3: Slop Gallery ---
  function saveLocalGallery() {
    localStorage.setItem('deepslop_gallery', JSON.stringify(state.gallery.slice(0, 40)));
  }

  function loadLocalGallery() {
    try {
      const g = JSON.parse(localStorage.getItem('deepslop_gallery') || '[]');
      if (g.length > 0) {
        state.gallery = g;
        return;
      }
    } catch(e) {}

    // Seed defaults
    state.gallery = [
      {
        id: 'seed-1',
        type: 'text',
        prompt: '请用鲁迅的文风写一段关于点外卖超时未送达的心情。',
        response: '“我向来是不惮以最坏的恶意来推测骑手的，然而我还不料，也不信竟会超时至半个时辰。桌上的凉白开已经冷透了，肚里的饥肠正作怪响。罢罢，大抵是送去隔壁罢。”',
        workerName: '鲁迅转世大模型',
        askerName: '饥饿打工人',
        rating: 'up',
        ratingText: '过于智能 (👍)',
        timestamp: Date.now() - 3600000
      },
      {
        id: 'seed-2',
        type: 'text',
        prompt: '如何礼貌地拒绝老板周末加班的要求？',
        response: '“报告老板！我非常愿意为公司奉献，但很不巧，这周末我被选为拯救地球维和部队特约临时工，如果我不去保卫和平，周一大家可能都没班加了！”',
        workerName: '摸鱼智子-4.0',
        askerName: '天河牛马',
        rating: 'up',
        ratingText: '机械飞升 (🤖)',
        timestamp: Date.now() - 7200000
      }
    ];
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
      state.player.nickname = newNick;
      localStorage.setItem('deepslop_nick', newNick);
      updateProfileUI();
      el.nicknameModal.style.display = 'none';
      showToast('代号修改成功！', 'success');
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
  updateProfileUI();
  loadLocalQueue();
  updateMeshStats();
  loadLocalGallery();
  renderGallery();

})();
