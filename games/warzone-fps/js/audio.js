// Procedural AAA Military Audio Engine using Web Audio API
// Self-contained sound synthesizer: no external audio assets needed!

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.initialized = false;
    this.masterGain = null;
    this.masterFilter = null;
    this.masterLimiter = null;
    this.tinnitusGain = null;
    this.tinnitusOsc = null;

    // Helicopter continuous synthesis nodes
    this.heliActive = false;
    this.heliGain = null;
    this.heliTurbineGain = null;
    this.heliRotorGain = null;
    this.heliOsc1 = null;
    this.heliOsc2 = null;

    // Ambient warzone drone
    this.ambienceGain = null;
  }

  init() {
    if (this.initialized) {
      if (this.ctx && this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    this.ctx = new AudioContext();

    // Master Limiter / Compressor for AAA Hollywood punch
    this.masterLimiter = this.ctx.createDynamicsCompressor();
    this.masterLimiter.threshold.setValueAtTime(-14, this.ctx.currentTime);
    this.masterLimiter.knee.setValueAtTime(8, this.ctx.currentTime);
    this.masterLimiter.ratio.setValueAtTime(10, this.ctx.currentTime);
    this.masterLimiter.attack.setValueAtTime(0.003, this.ctx.currentTime);
    this.masterLimiter.release.setValueAtTime(0.12, this.ctx.currentTime);
    this.masterLimiter.connect(this.ctx.destination);

    // Master Low-pass Filter for acoustic trauma / muffled hearing
    this.masterFilter = this.ctx.createBiquadFilter();
    this.masterFilter.type = 'lowpass';
    this.masterFilter.frequency.setValueAtTime(20000, this.ctx.currentTime);
    this.masterFilter.Q.setValueAtTime(1.0, this.ctx.currentTime);
    this.masterFilter.connect(this.masterLimiter);

    // Master Gain
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
    this.masterGain.connect(this.masterFilter);

    // Tinnitus Tone (bypasses muffled filter directly to limiter)
    this.tinnitusGain = this.ctx.createGain();
    this.tinnitusGain.gain.setValueAtTime(0.0, this.ctx.currentTime);
    this.tinnitusGain.connect(this.masterLimiter);

    this.tinnitusOsc = this.ctx.createOscillator();
    this.tinnitusOsc.type = 'sine';
    this.tinnitusOsc.frequency.setValueAtTime(3920, this.ctx.currentTime);
    this.tinnitusOsc.connect(this.tinnitusGain);
    this.tinnitusOsc.start();

    // Ambient background warzone rumble
    this.startAmbience();

    this.initialized = true;
  }

  startAmbience() {
    if (!this.ctx) return;

    const noiseBuffer = this.createNoiseBuffer(3.0);
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    noise.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(180, this.ctx.currentTime);

    this.ambienceGain = this.ctx.createGain();
    this.ambienceGain.gain.setValueAtTime(0.35, this.ctx.currentTime);

    noise.connect(filter);
    filter.connect(this.ambienceGain);
    this.ambienceGain.connect(this.masterGain);
    noise.start();
  }

  createNoiseBuffer(duration = 1.0) {
    if (!this.ctx) return null;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    return buffer;
  }

  // Gunshot synthesis
  playGunshot(isLead = true, pan = 0.0) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    const panner = this.ctx.createStereoPanner();
    panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
    panner.connect(this.masterGain);

    // 1. Sharp transient crack (bullet ignition)
    const crack = this.ctx.createBufferSource();
    crack.buffer = this.createNoiseBuffer(0.08);
    const crackFilter = this.ctx.createBiquadFilter();
    crackFilter.type = 'bandpass';
    crackFilter.frequency.setValueAtTime(isLead ? 3400 : 2600, now);
    crackFilter.Q.setValueAtTime(2.5, now);

    const crackGain = this.ctx.createGain();
    crackGain.gain.setValueAtTime(isLead ? 1.0 : 0.6, now);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    crack.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(panner);
    crack.start(now);

    // 2. Punchy low-end sub bass thump
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(isLead ? 150 : 120, now);
    subOsc.frequency.exponentialRampToValueAtTime(32, now + 0.12);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(isLead ? 0.95 : 0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    subOsc.connect(subGain);
    subGain.connect(panner);
    subOsc.start(now);
    subOsc.stop(now + 0.15);

    // 3. Reverberant warzone canyon echo tail
    const echoNoise = this.ctx.createBufferSource();
    echoNoise.buffer = this.createNoiseBuffer(0.45);
    const echoFilter = this.ctx.createBiquadFilter();
    echoFilter.type = 'lowpass';
    echoFilter.frequency.setValueAtTime(1400, now);
    echoFilter.frequency.exponentialRampToValueAtTime(280, now + 0.4);

    const echoGain = this.ctx.createGain();
    echoGain.gain.setValueAtTime(isLead ? 0.4 : 0.25, now + 0.02);
    echoGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    echoNoise.connect(echoFilter);
    echoFilter.connect(echoGain);
    echoGain.connect(panner);
    echoNoise.start(now);

    // 4. Shell casing metallic clink
    if (isLead && Math.random() > 0.4) {
      setTimeout(() => {
        this.playShellCasing(pan);
      }, 90 + Math.random() * 50);
    }
  }

  // Hitmarker sound effect (crisp mechanical tick)
  playHitMarker(isHeadshot = false) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(isHeadshot ? 2200 : 1600, now);
    osc.frequency.exponentialRampToValueAtTime(isHeadshot ? 3200 : 1200, now + 0.05);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Weapon reload sequence
  playReload() {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    // 1. Mag release / eject (now)
    this.playClick(1400, 0.08, now);

    // 2. Mag insert / slap (+0.6s)
    setTimeout(() => {
      this.playClick(650, 0.12, this.ctx.currentTime);
      this.playClick(1800, 0.05, this.ctx.currentTime + 0.04);
    }, 600);

    // 3. Bolt release chamber (+1.1s)
    setTimeout(() => {
      this.playClick(2400, 0.08, this.ctx.currentTime);
      this.playClick(900, 0.14, this.ctx.currentTime + 0.05);
    }, 1100);
  }

  playClick(freq, duration, time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(time);
    osc.stop(time + duration);
  }

  playShellCasing(pan = 0.2) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    const baseFreq = 2600 + Math.random() * 800;
    osc.frequency.setValueAtTime(baseFreq, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    const panner = this.ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, now);

    osc.connect(gain);
    gain.connect(panner);
    panner.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.05);
  }

  playTracerSnap(pan = 0.0) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    const panner = this.ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, now);
    panner.connect(this.masterGain);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.06);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(3500, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.75, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    noise.start(now);

    const ping = this.ctx.createOscillator();
    ping.type = 'sine';
    const startF = 1800 + Math.random() * 1200;
    ping.frequency.setValueAtTime(startF, now);
    ping.frequency.exponentialRampToValueAtTime(startF * 0.4, now + 0.12);

    const pingGain = this.ctx.createGain();
    pingGain.gain.setValueAtTime(0.18, now);
    pingGain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    ping.connect(pingGain);
    pingGain.connect(panner);
    ping.start(now);
    ping.stop(now + 0.13);
  }

  playDistantArtillery(pan = -0.3) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    const panner = this.ctx.createStereoPanner();
    panner.pan.setValueAtTime(pan, now);
    panner.connect(this.masterGain);

    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(75, now);
    osc.frequency.exponentialRampToValueAtTime(24, now + 0.9);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.85, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(1.4);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(140, now);

    const nGain = this.ctx.createGain();
    nGain.gain.setValueAtTime(0.5, now);
    nGain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc.connect(gain);
    gain.connect(panner);
    noise.connect(filter);
    filter.connect(nGain);
    nGain.connect(panner);

    osc.start(now);
    osc.stop(now + 1.3);
    noise.start(now);
  }

  playIncomingRPG() {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(2400, now);
    osc.frequency.exponentialRampToValueAtTime(850, now + 0.65);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1800, now);
    filter.Q.setValueAtTime(6.0, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.7, now + 0.55);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.66);
  }

  playNearbyExplosion() {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;

    const sub = this.ctx.createOscillator();
    sub.type = 'sine';
    sub.frequency.setValueAtTime(110, now);
    sub.frequency.exponentialRampToValueAtTime(18, now + 1.2);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(1.4, now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);

    sub.connect(subGain);
    subGain.connect(this.masterLimiter);
    sub.start(now);
    sub.stop(now + 1.6);

    const blast = this.ctx.createBufferSource();
    blast.buffer = this.createNoiseBuffer(2.0);
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(90, now + 1.5);

    const blastGain = this.ctx.createGain();
    blastGain.gain.setValueAtTime(1.2, now);
    blastGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    blast.connect(filter);
    filter.connect(blastGain);
    blastGain.connect(this.masterLimiter);
    blast.start(now);

    this.masterFilter.frequency.cancelScheduledValues(now);
    this.masterFilter.frequency.setValueAtTime(300, now);
    this.masterFilter.frequency.exponentialRampToValueAtTime(20000, now + 4.5);

    this.tinnitusGain.gain.cancelScheduledValues(now);
    this.tinnitusGain.gain.setValueAtTime(0.18, now + 0.05);
    this.tinnitusGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.8);
  }

  playRadioChirp() {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(1650, now);
    osc.frequency.setValueAtTime(1250, now + 0.03);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  playFootstep(run = false) {
    if (!this.initialized || !this.ctx) return;
    const now = this.ctx.currentTime;
    const noise = this.ctx.createBufferSource();
    noise.buffer = this.createNoiseBuffer(0.08);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(run ? 650 : 500, now);
    filter.Q.setValueAtTime(1.5, now);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(run ? 0.22 : 0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  startHelicopter() {
    if (!this.initialized || !this.ctx || this.heliActive) return;

    this.heliGain = this.ctx.createGain();
    this.heliGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.heliGain.connect(this.masterGain);

    this.heliTurbineGain = this.ctx.createGain();
    this.heliTurbineGain.gain.setValueAtTime(0.18, this.ctx.currentTime);

    this.heliOsc1 = this.ctx.createOscillator();
    this.heliOsc1.type = 'sawtooth';
    this.heliOsc1.frequency.setValueAtTime(540, this.ctx.currentTime);

    this.heliOsc2 = this.ctx.createOscillator();
    this.heliOsc2.type = 'sine';
    this.heliOsc2.frequency.setValueAtTime(810, this.ctx.currentTime);

    const turbineFilter = this.ctx.createBiquadFilter();
    turbineFilter.type = 'bandpass';
    turbineFilter.frequency.setValueAtTime(680, this.ctx.currentTime);
    turbineFilter.Q.setValueAtTime(4.0, this.ctx.currentTime);

    this.heliOsc1.connect(turbineFilter);
    this.heliOsc2.connect(turbineFilter);
    turbineFilter.connect(this.heliTurbineGain);
    this.heliTurbineGain.connect(this.heliGain);

    this.heliOsc1.start();
    this.heliOsc2.start();

    this.heliRotorGain = this.ctx.createGain();
    this.heliRotorGain.gain.setValueAtTime(0.7, this.ctx.currentTime);

    const rotorOsc = this.ctx.createOscillator();
    rotorOsc.type = 'sine';
    rotorOsc.frequency.setValueAtTime(58, this.ctx.currentTime);

    const lfo = this.ctx.createOscillator();
    lfo.type = 'square';
    lfo.frequency.setValueAtTime(16.5, this.ctx.currentTime);

    const lfoGain = this.ctx.createGain();
    lfoGain.gain.setValueAtTime(0.6, this.ctx.currentTime);
    lfo.connect(lfoGain.gain);

    rotorOsc.connect(this.heliRotorGain);
    this.heliRotorGain.connect(this.heliGain);

    rotorOsc.start();
    lfo.start();

    this.heliActive = true;
  }

  updateHelicopter(volume = 0.0, pitchShift = 1.0) {
    if (!this.heliActive || !this.ctx) return;
    const now = this.ctx.currentTime;
    this.heliGain.gain.setTargetAtTime(Math.max(0.001, volume), now, 0.05);
    if (this.heliOsc1) {
      this.heliOsc1.frequency.setTargetAtTime(540 * pitchShift, now, 0.05);
      this.heliOsc2.frequency.setTargetAtTime(810 * pitchShift, now, 0.05);
    }
  }

  stopHelicopter() {
    if (!this.heliActive || !this.ctx) return;
    this.heliGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
  }
}

window.soundEngine = new SoundEngine();
