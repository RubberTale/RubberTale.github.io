// Master Cinematic Timeline Choreographer for AAA Military FPS Sequence
// 30-Second Continuous Sequence: Handheld Camera, Soldier Locomotion & Weapon Operation,
// Squad Tactics, Dynamic VFX, and Audio Synchronization

class CinematicMaster {
  constructor(canvasContainer) {
    this.container = canvasContainer;
    this.canvas = document.getElementById('canvas3d');

    // 30.0 seconds sequence duration
    this.totalDuration = 30.0;
    this.currentTime = 0.0;
    this.isPlaying = true;
    this.freeCam = false;

    // Camera shake / trauma system
    this.cameraTrauma = 0.0;

    // Shot tracking & audio trigger flags
    this.lastSecond = -1;
    this.triggeredEvents = new Set();

    this.initThree();
    this.initPostProcessing();
    this.initEnvironment();
    this.initCharacters();
    this.initHelicopter();
    this.initVFX();
    this.initInput();

    // Start animation loop
    this.lastTimestamp = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    // Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x06080c);
    this.scene.fog = new THREE.FogExp2(0x080a0f, 0.018); // Heavy atmospheric warzone haze

    // Camera (16:9 aspect)
    this.camera = new THREE.PerspectiveCamera(52, 16 / 9, 0.1, 400);
    this.camera.position.set(0.65, 1.65, -16.5);

    // Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // OrbitControls for optional inspection
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enabled = false;
    this.controls.enableDamping = true;

    // Ambient night lighting
    this.ambientLight = new THREE.AmbientLight(0x1a222e, 0.7);
    this.scene.add(this.ambientLight);

    // Directional moonlight (cool blue)
    this.moonLight = new THREE.DirectionalLight(0x4a6585, 0.85);
    this.moonLight.position.set(25, 45, -30);
    this.scene.add(this.moonLight);

    // Warm horizon fire ambient bounce
    this.horizonGlow = new THREE.DirectionalLight(0x8a3810, 0.45);
    this.horizonGlow.position.set(-30, 10, 60);
    this.scene.add(this.horizonGlow);

    window.addEventListener('resize', () => this.onResize());
  }

  initPostProcessing() {
    this.composer = new THREE.EffectComposer(this.renderer);
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    // High Dynamic Range UnrealBloomPass
    this.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.15, // strength
      0.45, // radius
      0.32  // threshold
    );
    this.composer.addPass(this.bloomPass);

    // AAA Blockbuster Film Tone & Grain Shader Pass
    const FilmGradingShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uVignette: { value: 0.38 },
        uGrainAmount: { value: 0.045 },
        uAberration: { value: 0.0015 }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float uTime;
        uniform float uVignette;
        uniform float uGrainAmount;
        uniform float uAberration;
        varying vec2 vUv;

        // Fast procedural film grain
        float random(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv;

          // Subtle chromatic aberration
          vec2 distFromCenter = uv - 0.5;
          float r = texture2D(tDiffuse, uv + distFromCenter * uAberration).r;
          float g = texture2D(tDiffuse, uv).g;
          float b = texture2D(tDiffuse, uv - distFromCenter * uAberration).b;
          vec3 color = vec3(r, g, b);

          // Military Blockbuster Color Grading (Cool shadows, warm fiery highlights)
          vec3 coolShadow = vec3(0.08, 0.12, 0.18);
          vec3 warmHighlight = vec3(1.15, 1.05, 0.92);
          float lum = dot(color, vec3(0.299, 0.587, 0.114));
          color = mix(color * coolShadow * 1.5, color * warmHighlight, smoothstep(0.1, 0.85, lum));

          // Contrast boost
          color = pow(color, vec3(1.08));

          // 35mm film grain
          float grain = (random(uv * 2.5 + fract(uTime * 17.1)) - 0.5) * uGrainAmount;
          color += grain;

          // Cinematic vignette
          float dist = distance(uv, vec2(0.5));
          color *= smoothstep(0.85, uVignette, dist * 0.72);

          gl_FragColor = vec4(color, 1.0);
        }
      `
    };

    this.filmPass = new THREE.ShaderPass(FilmGradingShader);
    this.composer.addPass(this.filmPass);
  }

  initEnvironment() {
    const mats = ModelBuilder.initMaterials();

    // 1. War-torn Asphalt Street (120m x 24m)
    const streetGeo = new THREE.PlaneGeometry(24, 120);
    streetGeo.rotateX(-Math.PI / 2);
    this.street = new THREE.Mesh(streetGeo, mats.asphalt);
    this.street.position.set(0, 0, 15);
    this.street.receiveShadow = true;
    this.scene.add(this.street);

    // Sidewalk curbs
    for (let side of [-12.5, 12.5]) {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 120), mats.concrete);
      curb.position.set(side, 0.12, 15);
      curb.receiveShadow = true;
      this.scene.add(curb);
    }

    // 2. Ruined Skyscraper Blocks on Left & Right Flanks
    this.buildings = [];
    const buildingDefs = [
      // Left side
      { x: -22, z: -15, w: 16, h: 38, d: 18 },
      { x: -22, z: 5,   w: 16, h: 48, d: 20 },
      { x: -22, z: 28,  w: 16, h: 32, d: 18 },
      { x: -22, z: 52,  w: 16, h: 42, d: 22 },
      // Right side
      { x: 22,  z: -18, w: 16, h: 44, d: 18 },
      { x: 22,  z: 2,   w: 16, h: 36, d: 18 },
      { x: 22,  z: 24,  w: 16, h: 52, d: 20 },
      { x: 22,  z: 48,  w: 16, h: 34, d: 22 }
    ];

    buildingDefs.forEach((def, idx) => {
      const b = ModelBuilder.createRuinedBuilding(def.w, def.h, def.d, idx % 2 === 0);
      b.position.set(def.x, 0, def.z);
      this.scene.add(b);
      this.buildings.push(b);
    });

    // 3. Concrete Jersey Barrier (Main tactical cover for squad)
    this.barrier = ModelBuilder.createJerseyBarrier();
    this.barrier.position.set(0.6, 0, 0);
    this.barrier.rotation.y = -0.15;
    this.scene.add(this.barrier);

    // Second barrier slightly ahead
    const barrier2 = ModelBuilder.createJerseyBarrier();
    barrier2.position.set(-2.2, 0, 1.2);
    barrier2.rotation.y = 0.22;
    this.scene.add(barrier2);

    // 4. Overturned Burning Military APC Wreck
    this.apc = ModelBuilder.createWreckedAPC();
    this.apc.position.set(-5.2, 0, 7.5);
    this.apc.rotation.set(0.12, 0.45, -0.08);
    this.scene.add(this.apc);

    // 5. Sandbag Fortifications for Squad Cover
    const sandbagsLeft = ModelBuilder.createSandbags();
    sandbagsLeft.position.set(-3.8, 0, -1.2);
    sandbagsLeft.rotation.y = 0.35;
    this.scene.add(sandbagsLeft);

    const sandbagsRight = ModelBuilder.createSandbags();
    sandbagsRight.position.set(3.8, 0, -2.5);
    sandbagsRight.rotation.y = -0.4;
    this.scene.add(sandbagsRight);

    // 6. Rubble piles & concrete blocks scattered across street
    for (let i = 0; i < 28; i++) {
      const s = 0.3 + Math.random() * 0.7;
      const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mats.concrete);
      rubble.position.set(
        (Math.random() - 0.5) * 18,
        s * 0.4,
        -15 + Math.random() * 55
      );
      rubble.rotation.set(Math.random(), Math.random(), Math.random());
      this.scene.add(rubble);
    }
  }

  initCharacters() {
    // 1. Lead Special Forces Soldier
    this.leadSoldier = ModelBuilder.createSoldier(true, 'Lead');
    this.leadSoldier.position.set(0, 0, -14);
    this.scene.add(this.leadSoldier);

    // 2. Squad Member A (Left Flank)
    this.squadA = ModelBuilder.createSoldier(false, 'SquadA');
    this.squadA.position.set(-2.4, 0, -17.2);
    this.scene.add(this.squadA);

    // 3. Squad Member B (Right Flank)
    this.squadB = ModelBuilder.createSoldier(false, 'SquadB');
    this.squadB.position.set(2.6, 0, -18.5);
    this.scene.add(this.squadB);

    this.squad = [this.leadSoldier, this.squadA, this.squadB];
  }

  initHelicopter() {
    this.helicopter = ModelBuilder.createAttackHelicopter();
    this.helicopter.position.set(0, 40, -60);
    this.helicopter.visible = false;
    this.scene.add(this.helicopter);
  }

  initVFX() {
    this.vfx = new VFXSystem(this.scene);
  }

  initInput() {
    // Initial user click to engage audio and vanish start overlay
    const overlay = document.getElementById('start-overlay');
    if (overlay) {
      const engage = () => {
        overlay.classList.add('hidden');
        if (window.soundEngine) {
          window.soundEngine.init();
        }
      };
      overlay.addEventListener('click', engage);
      window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !overlay.classList.contains('hidden')) {
          engage();
        }
      });
    }

    // Keyboard Shortcuts (No HUD/text on screen)
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') {
        this.isPlaying = !this.isPlaying;
      } else if (e.code === 'KeyR') {
        this.resetSequence();
      } else if (e.code === 'KeyC') {
        this.freeCam = !this.freeCam;
        this.controls.enabled = this.freeCam;
      }
    });
  }

  resetSequence() {
    this.currentTime = 0.0;
    this.triggeredEvents.clear();
    this.cameraTrauma = 0.0;
    if (this.helicopter) {
      this.helicopter.visible = false;
    }
    if (window.soundEngine) {
      window.soundEngine.stopHelicopter();
    }
  }

  onResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;
    this.camera.aspect = 16 / 9;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
    this.composer.setSize(this.width, this.height);
  }

  // Master Animation & Choreography Loop
  animate(timestamp) {
    requestAnimationFrame(this.animate);

    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    if (this.isPlaying) {
      this.currentTime += dt;
      // Seamless continuous 30-second loop
      if (this.currentTime >= this.totalDuration) {
        this.resetSequence();
      }
    }

    const t = this.currentTime;

    // Update Systems
    this.updateTimelineEvents(t, dt);
    this.updateSoldierAnimations(t, dt);
    this.updateHelicopterFlight(t, dt);
    this.updateCamera(t, dt);
    this.updateLightingAndVFX(t, dt);

    this.vfx.update(dt, this.camera);

    // Render with postprocessing
    this.filmPass.uniforms.uTime.value = t;
    this.filmPass.uniforms.uAberration.value = 0.0015 + this.cameraTrauma * 0.008;
    this.composer.render();
  }

  // 1. Timeline Events & Audio Triggers
  updateTimelineEvents(t, dt) {
    const trigger = (name, cond, action) => {
      if (cond && !this.triggeredEvents.has(name)) {
        this.triggeredEvents.add(name);
        action();
      }
    };

    // t = 2.2s: Distant Horizon Artillery Flash 1
    trigger('artillery_1', t >= 2.2, () => {
      this.vfx.flashDistantArtillery(7.0);
      if (window.soundEngine) soundEngine.playDistantArtillery(-0.4);
    });

    // t = 5.0s: Distant Artillery Flash 2
    trigger('artillery_2', t >= 5.0, () => {
      this.vfx.flashDistantArtillery(9.0);
      if (window.soundEngine) soundEngine.playDistantArtillery(0.3);
    });

    // t = 3.5s & 5.8s: Distant high tracer rounds
    trigger('tracer_dist_1', t >= 3.5, () => {
      this.vfx.spawnTracer(new THREE.Vector3(12, 18, 50), new THREE.Vector3(-0.3, 0.05, -1.0), 95, false);
    });
    trigger('tracer_dist_2', t >= 5.8, () => {
      this.vfx.spawnTracer(new THREE.Vector3(-14, 15, 45), new THREE.Vector3(0.35, -0.08, -1.0), 90, false);
    });

    // t = 7.0s - 13.5s: Action Intensifies! Violent Enemy Ambush Fire
    if (t >= 7.0 && t <= 13.8) {
      if (Math.random() < dt * 7.5) { // bursts of incoming enemy fire
        const startX = (Math.random() - 0.5) * 14;
        const startY = 1.5 + Math.random() * 8.0;
        const targetX = (Math.random() - 0.5) * 6;
        const startPos = new THREE.Vector3(startX, startY, 42);
        const targetPos = new THREE.Vector3(targetX, 0.4 + Math.random() * 1.5, t > 9.0 ? 0.8 : -3.0);
        const dir = targetPos.clone().sub(startPos).normalize();
        this.vfx.spawnTracer(startPos, dir, 105, false);

        if (window.soundEngine && Math.random() < 0.6) {
          soundEngine.playTracerSnap((startX / 14) * 0.8);
        }
      }
    }

    // Squad Returning Suppressive Fire
    // Lead soldier bursts while in cover: t = 10.2s, 11.4s, 12.6s
    const fireLeadBurst = (name, time) => {
      trigger(name, t >= time, () => {
        this.fireAssaultRifleBurst(this.leadSoldier, 3);
      });
    };
    fireLeadBurst('lead_burst_1', 10.2);
    fireLeadBurst('lead_burst_2', 11.4);
    fireLeadBurst('lead_burst_3', 12.6);

    // Teammates covering fire bursts
    if (t >= 9.8 && t <= 13.8) {
      if (Math.random() < dt * 4.5) {
        const shooter = Math.random() > 0.5 ? this.squadA : this.squadB;
        this.fireSingleShot(shooter, shooter === this.leadSoldier);
      }
    }

    // t = 14.1s: Incoming Mortar / RPG Rocket Screech
    trigger('rpg_whistle', t >= 14.1, () => {
      if (window.soundEngine) soundEngine.playIncomingRPG();
    });

    // t = 14.65s: NEAR-MISS RPG DETONATION in front of concrete barrier!
    trigger('rpg_detonation', t >= 14.65, () => {
      const blastPos = new THREE.Vector3(-2.2, 0.1, 3.8);
      this.vfx.triggerExplosion(blastPos);
      this.cameraTrauma = 1.0; // Violent camera shake
      if (window.soundEngine) soundEngine.playNearbyExplosion();
    });

    // t = 19.1s: Tactical Hand Signal ("Push!") & Radio Chirp
    trigger('hand_signal_audio', t >= 19.1, () => {
      if (window.soundEngine) soundEngine.playRadioChirp();
    });

    // t = 20.2s - 29.5s: Violent Counter-Push! Heavy firing while advancing
    if (t >= 20.4 && t <= 29.2) {
      // Lead soldier controlled bursts while advancing
      if (Math.random() < dt * 4.2) {
        this.fireSingleShot(this.leadSoldier, true);
      }
      // Squad providing bounding suppressive fire
      if (Math.random() < dt * 5.0) {
        const s = Math.random() > 0.5 ? this.squadA : this.squadB;
        this.fireSingleShot(s, false);
      }
    }

    // t = 23.5s - 30.0s: Attack Helicopter Flyby
    trigger('heli_start', t >= 23.5, () => {
      this.helicopter.visible = true;
      if (window.soundEngine) soundEngine.startHelicopter();
    });

    if (t >= 23.5 && t <= 30.0) {
      const heliDist = this.helicopter.position.z - this.camera.position.z;
      const vol = Math.max(0.1, 1.0 - Math.min(1.0, Math.abs(heliDist) / 50.0));
      const pan = (this.helicopter.position.x / 15.0);
      const pitch = heliDist < 0 ? 1.08 : 0.94; // Doppler pitch shift
      if (window.soundEngine) soundEngine.updateHelicopter(vol, pan, pitch);
    }
  }

  // Weapon Firing Mechanics (Muzzle flash, Shell casing, Sound, Tracer)
  fireSingleShot(soldier, isLead = false) {
    if (!soldier || !soldier.rig) return;
    const rig = soldier.rig;

    // Flash muzzle sprite & point light
    rig.muzzleFlash.scale.set(1.0, 1.0, 1.0);
    rig.muzzleFlash.rotation.z = Math.random() * Math.PI * 2;
    rig.muzzleLight.intensity = 12.0;

    // Turn off after 45ms
    setTimeout(() => {
      if (rig.muzzleFlash) rig.muzzleFlash.scale.set(0, 0, 0);
      if (rig.muzzleLight) rig.muzzleLight.intensity = 0;
    }, 45);

    // Recoil kick on rifle
    rig.rifle.position.z -= 0.025;
    rig.rifle.rotation.x -= 0.05;
    setTimeout(() => {
      if (rig.rifle) {
        rig.rifle.position.z += 0.025;
        rig.rifle.rotation.x += 0.05;
      }
    }, 60);

    // Eject spent brass casing
    const barrelWorldPos = new THREE.Vector3();
    rig.rifle.getWorldPosition(barrelWorldPos);
    this.vfx.spawnShellCasing(barrelWorldPos, new THREE.Vector3(1, 0.5, 0).normalize());

    // Spawn friendly tracer streak
    const targetZ = soldier.position.z + 45;
    const targetX = soldier.position.x + (Math.random() - 0.5) * 4;
    const targetY = 1.2 + (Math.random() - 0.5) * 1.5;
    const dir = new THREE.Vector3(targetX, targetY, targetZ).sub(barrelWorldPos).normalize();
    this.vfx.spawnTracer(barrelWorldPos, dir, 120, true);

    // Sound
    if (window.soundEngine) {
      const pan = (soldier.position.x / 10.0);
      soundEngine.playGunshot(isLead, pan);
    }
  }

  fireAssaultRifleBurst(soldier, burstCount = 3) {
    for (let i = 0; i < burstCount; i++) {
      setTimeout(() => {
        this.fireSingleShot(soldier, soldier === this.leadSoldier);
      }, i * 110);
    }
  }

  // 2. Realistic Character Locomotion & Weapon Handling Animations
  updateSoldierAnimations(t, dt) {
    const lead = this.leadSoldier;
    const rig = lead.rig;

    // Phase 1: 0s - 7s (Cautious Patrol Walk)
    if (t < 7.0) {
      const walkProg = t / 7.0;
      lead.position.z = -14 + walkProg * 10.0; // from z=-14 to z=-4
      lead.position.x = THREE.MathUtils.lerp(0.0, 0.4, walkProg);
      lead.rotation.y = 0;

      // Leg stride animation (tactical forward pace)
      const strideFreq = 7.5;
      const legAngle = Math.sin(t * strideFreq) * 0.55;
      rig.leftHip.rotation.x = legAngle;
      rig.leftKnee.rotation.x = Math.max(0, -legAngle * 0.85);
      rig.rightHip.rotation.x = -legAngle;
      rig.rightKnee.rotation.x = Math.max(0, legAngle * 0.85);

      // Torso bobbing & natural walking sway
      rig.pelvis.position.y = 0.95 + Math.abs(Math.sin(t * strideFreq)) * 0.04;
      rig.torso.rotation.y = Math.sin(t * strideFreq * 0.5) * 0.05;
      rig.torso.rotation.z = Math.cos(t * strideFreq * 0.5) * 0.02;

      // Weapon held in High-Ready Stance, scanning left and right
      rig.head.rotation.y = Math.sin(t * 1.8) * 0.22; // scanning windows
      rig.leftShoulder.rotation.set(0.75, 0.35, -0.2);
      rig.leftElbow.rotation.set(-1.1, 0, 0);
      rig.rightShoulder.rotation.set(0.65, -0.2, 0.15);
      rig.rightElbow.rotation.set(-0.95, 0, 0);
    }

    // Phase 2: 7s - 9.0s (Reaction & Sprint / Knee-Slide to Barrier)
    else if (t >= 7.0 && t < 9.0) {
      const sprintProg = (t - 7.0) / 2.0;
      lead.position.z = THREE.MathUtils.lerp(-4.0, -0.8, sprintProg);
      lead.position.x = THREE.MathUtils.lerp(0.4, 0.65, sprintProg);

      if (sprintProg < 0.7) {
        // High-speed combat sprint
        const sprintFreq = 13.0;
        const sAngle = Math.sin(t * sprintFreq) * 0.85;
        rig.leftHip.rotation.x = sAngle;
        rig.leftKnee.rotation.x = Math.max(0, -sAngle * 1.1);
        rig.rightHip.rotation.x = -sAngle;
        rig.rightKnee.rotation.x = Math.max(0, sAngle * 1.1);
        rig.pelvis.position.y = 0.88;
        rig.torso.rotation.x = 0.35; // aggressive sprint forward lean
      } else {
        // Knee-slide behind barrier!
        const slideProg = (sprintProg - 0.7) / 0.3;
        rig.pelvis.position.y = THREE.MathUtils.lerp(0.88, 0.48, slideProg); // drop to crouch
        rig.rightHip.rotation.x = -1.3;
        rig.rightKnee.rotation.x = 1.4; // right knee planted
        rig.leftHip.rotation.x = 0.8;
        rig.leftKnee.rotation.x = 0.2;
        rig.torso.rotation.x = 0.15;
      }
    }

    // Phase 3: 9.0s - 14.0s (Crouched in Cover, Peeking & Suppressive Fire)
    else if (t >= 9.0 && t < 14.0) {
      lead.position.set(0.65, 0, -0.8);
      rig.pelvis.position.y = 0.50; // low crouch
      rig.rightHip.rotation.x = -1.3;
      rig.rightKnee.rotation.x = 1.4;
      rig.leftHip.rotation.x = 0.8;
      rig.leftKnee.rotation.x = 0.2;

      // Peeking over barrier when firing
      const isFiring = (t > 10.1 && t < 10.8) || (t > 11.3 && t < 12.0) || (t > 12.5 && t < 13.2);
      if (isFiring) {
        rig.torso.position.y = 0.22; // raise slightly over barrier
        rig.head.rotation.set(0, 0, 0); // aiming down sights
        rig.leftShoulder.rotation.set(0.9, 0.2, -0.1);
        rig.rightShoulder.rotation.set(0.85, -0.15, 0.1);
      } else {
        rig.torso.position.y = 0.14; // duck tight behind barrier
        rig.head.rotation.y = -0.3; // checking left teammate
        rig.leftShoulder.rotation.set(0.5, 0.1, -0.2);
      }
    }

    // Phase 4: 14.0s - 19.0s (RPG Detonation & Bracing Against Shockwave)
    else if (t >= 14.0 && t < 19.0) {
      lead.position.set(0.65, 0, -0.8);
      rig.pelvis.position.y = 0.44; // hunker down flat

      if (t < 16.5) {
        // Extreme brace against explosion shockwave
        rig.torso.rotation.set(0.35, -0.3, 0.15); // turn shoulder into blast
        rig.head.rotation.set(0.45, -0.4, 0); // tuck head down
        // Shield face with left arm
        rig.leftShoulder.rotation.set(1.4, 0.6, 0.2);
        rig.leftElbow.rotation.set(-1.6, 0, 0);
      } else {
        // Dust off and look up
        const recoverProg = (t - 16.5) / 2.5;
        rig.torso.rotation.set(0.15, 0, 0);
        rig.head.rotation.set(0, THREE.MathUtils.lerp(-0.4, 0.2, recoverProg), 0);
        rig.leftShoulder.rotation.set(0.7, 0.2, -0.1);
        rig.leftElbow.rotation.set(-1.0, 0, 0);
      }
    }

    // Phase 5: 19.0s - 20.2s (Tactical Hand Signal: "Push!")
    else if (t >= 19.0 && t < 20.2) {
      lead.position.set(0.65, 0, -0.8);
      rig.pelvis.position.y = 0.52;
      rig.head.rotation.y = -0.35; // looking back at squad

      // Left hand raises off foregrip, pumps forward aggressively twice
      const pump = Math.sin((t - 19.0) * 12.0);
      rig.leftShoulder.rotation.set(1.2 + pump * 0.2, -0.4, 0.3);
      rig.leftElbow.rotation.set(-0.6, 0, 0);
    }

    // Phase 6: 20.2s - 30.0s (Violent Counter-Push Down Street into Intersection)
    else {
      const pushProg = (t - 20.2) / 9.8;
      lead.position.z = THREE.MathUtils.lerp(-0.8, 22.0, pushProg); // advancing from z=-0.8 to z=22
      lead.position.x = THREE.MathUtils.lerp(0.65, 0.2, pushProg);

      // Aggressive tactical combat stride
      const strideFreq = 8.5;
      const legAngle = Math.sin(t * strideFreq) * 0.65;
      rig.leftHip.rotation.x = legAngle;
      rig.leftKnee.rotation.x = Math.max(0, -legAngle * 0.95);
      rig.rightHip.rotation.x = -legAngle;
      rig.rightKnee.rotation.x = Math.max(0, legAngle * 0.95);

      rig.pelvis.position.y = 0.93 + Math.abs(Math.sin(t * strideFreq)) * 0.05;
      rig.torso.rotation.x = 0.22; // forward combat aggression
      rig.torso.rotation.y = Math.sin(t * strideFreq * 0.5) * 0.06;

      // Rifle held firm in firing shoulder, sweeping down street
      rig.head.rotation.set(0, Math.sin(t * 1.5) * 0.15, 0);
      rig.leftShoulder.rotation.set(0.85, 0.25, -0.15);
      rig.leftElbow.rotation.set(-1.1, 0, 0);
      rig.rightShoulder.rotation.set(0.78, -0.18, 0.12);
      rig.rightElbow.rotation.set(-0.95, 0, 0);
    }

    // Teammate Squad Formations & Independent Reactions
    this.updateTeammate(this.squadA, t, -2.4, -3.8, -1.2, 0.35, true);
    this.updateTeammate(this.squadB, t, 2.6, 3.6, -2.5, -0.4, false);
  }

  updateTeammate(soldier, t, startX, coverX, coverZ, coverRotY, isLeft) {
    const rig = soldier.rig;

    if (t < 7.0) {
      // Walking in staggered formation behind lead
      const walkProg = t / 7.0;
      soldier.position.z = (isLeft ? -17.2 : -18.5) + walkProg * 10.0;
      soldier.position.x = startX;
      soldier.rotation.y = isLeft ? -0.1 : 0.1;

      const strideFreq = 7.5;
      const legAngle = Math.sin(t * strideFreq + (isLeft ? 0.5 : 1.2)) * 0.5;
      rig.leftHip.rotation.x = legAngle;
      rig.rightHip.rotation.x = -legAngle;
      rig.head.rotation.y = isLeft ? -0.3 : 0.3; // scanning their respective sectors
    } else if (t >= 7.0 && t < 9.0) {
      // Sprinting to side cover
      const sprintProg = (t - 7.0) / 2.0;
      soldier.position.x = THREE.MathUtils.lerp(startX, coverX, sprintProg);
      soldier.position.z = THREE.MathUtils.lerp(isLeft ? -7.2 : -8.5, coverZ, sprintProg);
      soldier.rotation.y = coverRotY;
    } else if (t >= 9.0 && t < 19.5) {
      // Crouched behind sandbag / concrete pillar providing covering fire
      soldier.position.set(coverX, 0, coverZ);
      soldier.rotation.y = coverRotY;
      rig.pelvis.position.y = 0.52;
      rig.leftHip.rotation.x = 0.8;
      rig.rightHip.rotation.x = -1.2;

      if (t >= 14.4 && t < 17.5) {
        // Bracing during explosion
        rig.head.rotation.x = 0.45;
        rig.torso.rotation.x = 0.25;
      }
    } else {
      // Advancing in bounding overwatch with lead soldier
      const pushProg = (t - 19.5) / 10.5;
      soldier.position.z = THREE.MathUtils.lerp(coverZ, 17.0 + (isLeft ? -2.0 : -3.5), pushProg);
      soldier.position.x = THREE.MathUtils.lerp(coverX, startX * 0.8, pushProg);
      soldier.rotation.y = 0;

      const strideFreq = 8.2;
      const legAngle = Math.sin(t * strideFreq + (isLeft ? 0.3 : 0.9)) * 0.6;
      rig.leftHip.rotation.x = legAngle;
      rig.rightHip.rotation.x = -legAngle;
      rig.pelvis.position.y = 0.93;
    }
  }

  // 3. Attack Helicopter Low Flight Between Ruined Skyscraper Blocks
  updateHelicopterFlight(t, dt) {
    if (!this.helicopter || !this.helicopter.visible) return;

    // Spin rotors at extreme RPM
    this.helicopter.rotorHub.rotation.y += dt * 35.0;
    this.helicopter.tailRotor.rotation.x += dt * 50.0;

    // Flight path: Roars low overhead from behind the buildings at t=24s down the street
    const p = Math.max(0, Math.min(1.0, (t - 23.8) / 6.2));

    // Position: descends low between skyscrapers, banks, and accelerates down street
    const startZ = -45.0;
    const endZ = 75.0;
    const currentZ = THREE.MathUtils.lerp(startZ, endZ, p);

    // Height curve: dips low to 9.2m right over the squad at t=26.5s!
    const dip = Math.sin(p * Math.PI);
    const currentY = THREE.MathUtils.lerp(35.0, 18.0, p) - dip * 14.0;
    const currentX = Math.sin(p * Math.PI * 1.5) * 3.5;

    this.helicopter.position.set(currentX, currentY, currentZ);

    // Dynamic bank and pitch
    this.helicopter.rotation.x = 0.18; // nose pitch down (forward acceleration)
    this.helicopter.rotation.z = Math.cos(p * Math.PI) * -0.15; // banking roll
    this.helicopter.rotation.y = 0.05;

    // Searchlight sweeping street
    this.helicopter.lightTarget.position.set(
      Math.sin(t * 3.0) * 6.0,
      -currentY,
      20.0
    );

    // Rotor downwash smoke particles
    if (Math.random() < dt * 18.0 && currentY < 18.0) {
      this.vfx.spawnSmoke(
        new THREE.Vector3(currentX + (Math.random() - 0.5) * 12, 0.4, currentZ + (Math.random() - 0.5) * 8),
        new THREE.Vector3((Math.random() - 0.5) * 4.0, 0.2, (Math.random() - 0.5) * 4.0),
        4.5,
        2.0,
        0.25
      );
    }
  }

  // 4. Tactical Handheld Camera System
  updateCamera(t, dt) {
    if (this.freeCam) {
      this.controls.update();
      return;
    }

    const lead = this.leadSoldier;
    const leadPos = lead.position;

    // Decay trauma over time
    this.cameraTrauma = Math.max(0, this.cameraTrauma - dt * 0.65);

    // Multi-frequency Perlin / sinusoidal handheld noise
    const breatheX = Math.sin(t * 1.6) * 0.025 + Math.cos(t * 3.8) * 0.012;
    const breatheY = Math.cos(t * 2.1) * 0.020 + Math.sin(t * 4.9) * 0.009;
    const sprintShake = (t >= 7.0 && t < 9.0) ? (Math.sin(t * 28) * 0.06) : 0;
    const traumaShake = this.cameraTrauma * this.cameraTrauma * 0.35;
    const shakeX = (Math.sin(t * 52) * 0.5 + Math.cos(t * 73) * 0.5) * traumaShake;
    const shakeY = (Math.cos(t * 47) * 0.5 + Math.sin(t * 61) * 0.5) * traumaShake;

    let targetCamPos = new THREE.Vector3();
    let targetLookAt = new THREE.Vector3();
    let targetFov = 52;

    // Shot 1: 0.0s - 7.0s (OTSH Tactical Advance)
    if (t < 7.0) {
      targetCamPos.set(
        leadPos.x + 0.65 + breatheX,
        leadPos.y + 1.65 + breatheY,
        leadPos.z - 2.5
      );
      targetLookAt.set(leadPos.x + 0.1, leadPos.y + 1.45, leadPos.z + 12.0);
      targetFov = 52;
    }

    // Shot 2: 7.0s - 14.0s (Sprint & Slide into Cover - Tight framing)
    else if (t >= 7.0 && t < 14.0) {
      const zoomProg = Math.min(1.0, (t - 7.0) / 1.5);
      const camY = THREE.MathUtils.lerp(1.65, 1.18, zoomProg);
      const camZDist = THREE.MathUtils.lerp(2.5, 1.45, zoomProg);

      targetCamPos.set(
        leadPos.x + 0.38 + breatheX + shakeX,
        leadPos.y + camY + breatheY + sprintShake + shakeY,
        leadPos.z - camZDist
      );
      targetLookAt.set(leadPos.x - 0.05, leadPos.y + 1.05, leadPos.z + 10.0);
      targetFov = 46; // tighter lens compression
    }

    // Shot 3: 14.0s - 19.5s (Near-Miss RPG Explosion Shockwave)
    else if (t >= 14.0 && t < 19.5) {
      targetCamPos.set(
        leadPos.x + 0.35 + shakeX * 1.8,
        leadPos.y + 1.10 + shakeY * 1.8,
        leadPos.z - 1.45
      );
      targetLookAt.set(leadPos.x - 0.1, leadPos.y + 0.85, leadPos.z + 6.0);
      targetFov = 48;
    }

    // Shot 4: 19.5s - 23.5s (LOW-ANGLE CINEMATIC 3RD-PERSON HERO ANGLE)
    // As requested: Brief switch to low-angle dramatic perspective while charging
    else if (t >= 19.5 && t < 23.5) {
      const heroProg = (t - 19.5) / 4.0;
      targetCamPos.set(
        leadPos.x - 0.75 + breatheX * 0.5,
        0.42 + breatheY * 0.5, // Low to the ground looking up!
        leadPos.z - 2.1
      );
      // Looking up at soldier's tactical chest, rifle, and towering ruins
      targetLookAt.set(leadPos.x + 0.15, 1.55, leadPos.z + 4.5);
      targetFov = 58; // wider epic angle
    }

    // Shot 5: 23.5s - 30.0s (Climactic OTS Follow & Helicopter Roaring Overhead)
    else {
      const riseProg = Math.min(1.0, (t - 23.5) / 1.2);
      const camY = THREE.MathUtils.lerp(0.42, 1.55, riseProg);
      const camX = THREE.MathUtils.lerp(-0.75, 0.55, riseProg);

      targetCamPos.set(
        leadPos.x + camX + breatheX,
        leadPos.y + camY + breatheY,
        leadPos.z - 2.4
      );
      // Looking forward and slightly tilted up as helicopter flies over
      targetLookAt.set(
        leadPos.x,
        leadPos.y + 1.8 + (t > 24.5 && t < 28.0 ? 1.5 : 0),
        leadPos.z + 14.0
      );
      targetFov = 54;
    }

    // Smooth camera interpolation
    this.camera.position.lerp(targetCamPos, dt * 10.0);
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, dt * 6.0);
    this.camera.updateProjectionMatrix();

    const currentLookAt = new THREE.Vector3();
    this.camera.getWorldDirection(currentLookAt);
    currentLookAt.multiplyScalar(10).add(this.camera.position);
    currentLookAt.lerp(targetLookAt, dt * 10.0);
    this.camera.lookAt(currentLookAt);
  }

  // 5. Environmental Lighting & Continuous VFX
  updateLightingAndVFX(t, dt) {
    // APC Smoldering Engine Fire Light Pulse
    if (this.apc && this.apc.fireLight) {
      this.apc.fireLight.intensity = 2.4 + Math.sin(t * 18.0) * 0.8 + Math.cos(t * 27.0) * 0.4;
    }

    // Continuous smoke billowing from APC
    if (Math.random() < dt * 16.0) {
      this.vfx.spawnSmoke(
        new THREE.Vector3(-5.0 + (Math.random() - 0.5) * 0.8, 1.8, 7.2 + (Math.random() - 0.5) * 0.8),
        new THREE.Vector3((Math.random() - 0.5) * 0.4, 1.8 + Math.random() * 1.2, (Math.random() - 0.5) * 0.4),
        3.8,
        3.5,
        0.35
      );
    }
  }
}

window.CinematicMaster = CinematicMaster;
