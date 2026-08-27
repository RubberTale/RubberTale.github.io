// soundEngine.ts
// Pure Web Audio API Procedural Synthwave Engine (Epic Rhythmic Music & UI SFX)

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private isBgmPlaying: boolean = false;
  private bgmIntervalId: any = null;
  private masterFilter: BiquadFilterNode | null = null;
  private masterGain: GainNode | null = null;

  // Music sequence parameters (128 BPM Synthwave)
  private step: number = 0;
  private readonly BPM: number = 126;
  
  // Driving Bassline notes (Am -> F -> C -> G progression)
  // Notes in Hz: A1=55, A2=110, F1=43.65, F2=87.31, C2=65.41, C3=130.81, G1=49, G2=98
  private readonly bassPattern = [
    55, 55, 110, 55,  55, 110, 55, 110,  // Bar 1: Am (Driving energy)
    43.65, 43.65, 87.31, 43.65, 43.65, 87.31, 43.65, 87.31, // Bar 2: F
    65.41, 65.41, 130.81, 65.41, 65.41, 130.81, 65.41, 130.81, // Bar 3: C
    49, 49, 98, 49, 49, 98, 73.42, 98 // Bar 4: G -> D
  ];

  // Uplifting Arpeggio Lead Notes (Pentatonic Cyber Melody)
  private readonly leadPattern: (number | null)[] = [
    440, null, 523.25, 659.25, null, 783.99, null, 659.25,
    349.23, null, 440, 523.25, null, 659.25, null, 523.25,
    523.25, null, 659.25, 783.99, null, 1046.5, null, 783.99,
    392, null, 493.88, 587.33, null, 783.99, 880, null
  ];

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();

        // Warm Low-pass filter to eliminate harsh electrical buzz
        this.masterFilter = this.ctx.createBiquadFilter();
        this.masterFilter.type = 'lowpass';
        this.masterFilter.frequency.setValueAtTime(1600, this.ctx.currentTime);
        this.masterFilter.Q.setValueAtTime(2.5, this.ctx.currentTime);

        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.12, this.ctx.currentTime);

        this.masterFilter.connect(this.masterGain);
        this.masterGain.connect(this.ctx.destination);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopBGM();
    } else {
      this.startBGM();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  // --- UI Sound Effects (Clean, Pleasant, Mechanical) ---

  public playTerminalBeep(freq: number = 880, duration: number = 0.04) {
    // Soft subtle mechanical key click instead of harsh buzzing
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq * 0.7, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(120, this.ctx.currentTime + duration);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  public playHeartbeat(pitch: number = 65) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(pitch, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(25, this.ctx.currentTime + 0.16);

    gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.18);
  }

  public playOrderSound(action: 'long' | 'short' | 'skip') {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (action === 'long') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    } else if (action === 'short') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(780, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.18);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
    } else {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.1);
    }

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start();
    osc.stop(now + 0.22);
  }

  public playCandleTick(isUp: boolean) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    const freq = isUp ? 620 : 420;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

    gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  public playWinFanfare() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major energetic chord
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.07);

      gain.gain.setValueAtTime(0, now + idx * 0.07);
      gain.gain.linearRampToValueAtTime(0.18, now + idx * 0.07 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.4);

      osc.connect(gain);
      gain.connect(this.ctx!.destination);

      osc.start(now + idx * 0.07);
      osc.stop(now + idx * 0.07 + 0.45);
    });
  }

  public playLiquidationAlarm() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 3; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(700, now + i * 0.12);
      osc.frequency.linearRampToValueAtTime(220, now + i * 0.12 + 0.1);

      gain.gain.setValueAtTime(0.2, now + i * 0.12);
      gain.gain.linearRampToValueAtTime(0.01, now + i * 0.12 + 0.11);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + i * 0.12);
      osc.stop(now + i * 0.12 + 0.12);
    }
  }

  // --- Dynamic Synthwave BGM Rhythm Engine (No more static buzzing!) ---

  public startBGM() {
    if (this.isMuted || this.isBgmPlaying) return;
    this.initCtx();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.step = 0;
    const stepDurationMs = (60 / this.BPM / 4) * 1000; // 16th note step in ms (~119ms)

    // Schedule 16th note arpeggios and rhythmic bass pulse
    this.bgmIntervalId = setInterval(() => {
      if (!this.isBgmPlaying || !this.ctx || this.ctx.state !== 'running') return;

      const now = this.ctx.currentTime;
      const bassFreq = this.bassPattern[this.step % this.bassPattern.length];
      const leadFreq = this.leadPattern[this.step % this.leadPattern.length];

      // 1. Synthwave Bass Pulse
      if (bassFreq) {
        const bassOsc = this.ctx.createOscillator();
        const bassGain = this.ctx.createGain();

        bassOsc.type = 'sawtooth';
        bassOsc.frequency.setValueAtTime(bassFreq, now);

        bassGain.gain.setValueAtTime(0.09, now);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);

        bassOsc.connect(bassGain);
        if (this.masterFilter) {
          bassGain.connect(this.masterFilter);
        } else {
          bassGain.connect(this.ctx.destination);
        }

        bassOsc.start(now);
        bassOsc.stop(now + 0.12);
      }

      // 2. Uplifting Cyber Synth Lead / Arp
      if (leadFreq) {
        const leadOsc = this.ctx.createOscillator();
        const leadGain = this.ctx.createGain();

        leadOsc.type = 'triangle';
        leadOsc.frequency.setValueAtTime(leadFreq, now);

        leadGain.gain.setValueAtTime(0.04, now);
        leadGain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

        leadOsc.connect(leadGain);
        if (this.masterFilter) {
          leadGain.connect(this.masterFilter);
        } else {
          leadGain.connect(this.ctx.destination);
        }

        leadOsc.start(now);
        leadOsc.stop(now + 0.18);
      }

      this.step++;
    }, stepDurationMs);
  }

  public stopBGM() {
    if (this.bgmIntervalId) {
      clearInterval(this.bgmIntervalId);
      this.bgmIntervalId = null;
    }
    this.isBgmPlaying = false;
  }
}

export const sounds = new SoundEngine();
