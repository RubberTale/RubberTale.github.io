// First-Person Playable Shooter (Playable FPS) Mode
// Built with Three.js PointerLockControls, Physics Raycasting, Weapon Recoil, ADS, and Enemy AI

class PlayableFPSGame {
  constructor(container) {
    this.container = container;
    this.canvas = document.getElementById('canvas3d');

    // Game state
    this.isLocked = false;
    this.playerHealth = 100;
    this.maxHealth = 100;
    this.ammo = 30;
    this.maxAmmo = 30;
    this.reserveAmmo = 120;
    this.isReloading = false;
    this.isADS = false;
    this.isSprinting = false;
    this.isCrouching = false;
    this.kills = 0;

    // Movement physics
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();
    this.onGround = true;
    this.playerHeight = 1.65;
    this.crouchHeight = 0.95;
    this.currentHeight = 1.65;

    // Weapon mechanics
    this.fireRate = 0.11; // ~550 RPM
    this.lastFireTime = 0;
    this.isMouseDown = false;
    this.gunRecoilZ = 0;
    this.gunRecoilRotX = 0;
    this.gunSwayX = 0;
    this.gunSwayY = 0;
    this.prevMouseDeltaX = 0;
    this.prevMouseDeltaY = 0;

    // Keyboard state
    this.keys = {};

    // Raycaster for shooting
    this.raycaster = new THREE.Raycaster();

    this.initThree();
    this.initPostProcessing();
    this.initEnvironment();
    this.initSquadAndEnemies();
    this.initFirstPersonWeapon();
    this.initVFX();
    this.initHelicopter();
    this.initControls();
    this.createTacticalHUD();

    this.lastTimestamp = performance.now();
    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  initThree() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || window.innerHeight;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x05070a);
    this.scene.fog = new THREE.FogExp2(0x07090e, 0.016);

    // Player Camera
    this.camera = new THREE.PerspectiveCamera(62, 16 / 9, 0.08, 350);
    this.camera.position.set(0, this.playerHeight, -12);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height, false);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Atmospheric Night Lights
    this.ambientLight = new THREE.AmbientLight(0x18202c, 0.8);
    this.scene.add(this.ambientLight);

    this.moonLight = new THREE.DirectionalLight(0x4a6585, 0.9);
    this.moonLight.position.set(30, 50, -25);
    this.scene.add(this.moonLight);

    this.horizonGlow = new THREE.DirectionalLight(0x8a3810, 0.5);
    this.horizonGlow.position.set(-30, 12, 60);
    this.scene.add(this.horizonGlow);

    window.addEventListener('resize', () => this.onResize());
  }

  initPostProcessing() {
    this.composer = new THREE.EffectComposer(this.renderer);
    const renderPass = new THREE.RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    this.bloomPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(this.width, this.height),
      1.15,
      0.45,
      0.35
    );
    this.composer.addPass(this.bloomPass);

    const FilmGradingShader = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        uVignette: { value: 0.38 },
        uGrainAmount: { value: 0.04 },
        uDamage: { value: 0.0 }
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
        uniform float uDamage;
        varying vec2 vUv;

        float random(vec2 p) {
          return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
        }

        void main() {
          vec2 uv = vUv;
          vec4 texel = texture2D(tDiffuse, uv);
          vec3 color = texel.rgb;

          // Blockbuster Color Grading: Navy shadows, warm fiery highlights
          vec3 coolShadow = vec3(0.09, 0.13, 0.18);
          vec3 warmHighlight = vec3(1.14, 1.04, 0.92);
          float lum = dot(color, vec3(0.299, 0.587, 0.114));
          color = mix(color * coolShadow * 1.5, color * warmHighlight, smoothstep(0.12, 0.88, lum));
          color = pow(color, vec3(1.06));

          // 35mm film grain
          float grain = (random(uv * 2.5 + fract(uTime * 17.1)) - 0.5) * uGrainAmount;
          color += grain;

          // Vignette
          float dist = distance(uv, vec2(0.5));
          color *= smoothstep(0.85, uVignette, dist * 0.72);

          // Red damage flash at screen edges
          if (uDamage > 0.01) {
            vec3 bloodRed = vec3(0.85, 0.04, 0.02);
            float edge = smoothstep(0.3, 0.75, dist) * uDamage;
            color = mix(color, bloodRed, edge * 0.75);
          }

          gl_FragColor = vec4(color, 1.0);
        }
      `
    };

    this.filmPass = new THREE.ShaderPass(FilmGradingShader);
    this.composer.addPass(this.filmPass);
  }

  initEnvironment() {
    const mats = ModelBuilder.initMaterials();

    // 1. Asphalt Street
    const streetGeo = new THREE.PlaneGeometry(24, 130);
    streetGeo.rotateX(-Math.PI / 2);
    this.street = new THREE.Mesh(streetGeo, mats.asphalt);
    this.street.position.set(0, 0, 20);
    this.street.receiveShadow = true;
    this.scene.add(this.street);

    // Curbs
    for (let side of [-12.5, 12.5]) {
      const curb = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.25, 130), mats.concrete);
      curb.position.set(side, 0.12, 20);
      curb.receiveShadow = true;
      this.scene.add(curb);
    }

    // 2. Ruined Skyscraper Blocks lining both sides
    this.buildings = [];
    const buildingDefs = [
      { x: -22, z: -15, w: 16, h: 38, d: 18 },
      { x: -22, z: 5,   w: 16, h: 48, d: 20 },
      { x: -22, z: 28,  w: 16, h: 32, d: 18 },
      { x: -22, z: 52,  w: 16, h: 42, d: 22 },
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

    // 3. Concrete Jersey Barriers (Player & Enemy cover)
    this.barriers = [];
    const barrier1 = ModelBuilder.createJerseyBarrier();
    barrier1.position.set(0.5, 0, -2);
    barrier1.rotation.y = -0.15;
    this.scene.add(barrier1);
    this.barriers.push(barrier1);

    const barrier2 = ModelBuilder.createJerseyBarrier();
    barrier2.position.set(-2.5, 0, 1.5);
    barrier2.rotation.y = 0.25;
    this.scene.add(barrier2);
    this.barriers.push(barrier2);

    const barrier3 = ModelBuilder.createJerseyBarrier();
    barrier3.position.set(1.8, 0, 16);
    barrier3.rotation.y = -0.3;
    this.scene.add(barrier3);
    this.barriers.push(barrier3);

    const barrier4 = ModelBuilder.createJerseyBarrier();
    barrier4.position.set(-1.2, 0, 26);
    barrier4.rotation.y = 0.18;
    this.scene.add(barrier4);
    this.barriers.push(barrier4);

    // 4. Overturned Burning APC
    this.apc = ModelBuilder.createWreckedAPC();
    this.apc.position.set(-5.5, 0, 8);
    this.apc.rotation.set(0.12, 0.45, -0.08);
    this.scene.add(this.apc);

    // 5. Sandbag Fortifications
    const sandbagsLeft = ModelBuilder.createSandbags();
    sandbagsLeft.position.set(-3.8, 0, -3.5);
    sandbagsLeft.rotation.y = 0.35;
    this.scene.add(sandbagsLeft);

    const sandbagsRight = ModelBuilder.createSandbags();
    sandbagsRight.position.set(3.8, 0, 22);
    sandbagsRight.rotation.y = -0.4;
    this.scene.add(sandbagsRight);

    // 6. Scattered Rubble
    for (let i = 0; i < 28; i++) {
      const s = 0.3 + Math.random() * 0.7;
      const rubble = new THREE.Mesh(new THREE.DodecahedronGeometry(s, 0), mats.concrete);
      rubble.position.set((Math.random() - 0.5) * 18, s * 0.4, -15 + Math.random() * 65);
      rubble.rotation.set(Math.random(), Math.random(), Math.random());
      this.scene.add(rubble);
    }
  }

  initFirstPersonWeapon() {
    // Attach First-Person Arms & HK416 Assault Rifle directly to player camera
    this.fppRig = ModelBuilder.createFPPArmsAndGun();
    this.camera.add(this.fppRig);
    this.scene.add(this.camera);

    // Hip-fire resting position
    this.hipPos = new THREE.Vector3(0.22, -0.22, -0.45);
    this.hipRot = new THREE.Vector3(0, 0, 0);

    // ADS (Aim-Down-Sights) center aligned position
    this.adsPos = new THREE.Vector3(0.0, -0.152, -0.32);
    this.adsRot = new THREE.Vector3(0, 0, 0);

    this.fppRig.position.copy(this.hipPos);
    this.fppRig.rotation.set(0, 0, 0);
  }

  initSquadAndEnemies() {
    // 1. Friendly Squad Teammates (Viper 1-2 and Viper 1-3)
    this.teammate1 = ModelBuilder.createSoldier(false, "Viper 1-2");
    this.teammate1.position.set(-2.5, 0, -14);
    this.scene.add(this.teammate1);

    this.teammate2 = ModelBuilder.createSoldier(false, "Viper 1-3");
    this.teammate2.position.set(2.8, 0, -15);
    this.scene.add(this.teammate2);

    this.teammates = [this.teammate1, this.teammate2];

    // 2. Hostile Enemy Soldiers (Shootable targets in ruined city)
    this.enemies = [];
    this.enemyHitMeshes = [];

    const enemySpawns = [
      { id: 1, pos: new THREE.Vector3(-1.8, 0, 16.5) }, // Behind barrier 3
      { id: 2, pos: new THREE.Vector3(2.2, 0, 26.5) },  // Behind barrier 4
      { id: 3, pos: new THREE.Vector3(-6.2, 0, 10.5) }, // Near burning APC
      { id: 4, pos: new THREE.Vector3(4.5, 0, 22.8) },  // Behind sandbag
      { id: 5, pos: new THREE.Vector3(-0.5, 0, 36.0) }, // Downstreet intersection
      { id: 6, pos: new THREE.Vector3(3.2, 0, 42.0) }   // Far intersection
    ];

    enemySpawns.forEach(spawn => {
      const enemy = ModelBuilder.createEnemySoldier(spawn.id, spawn.pos);
      this.scene.add(enemy);
      this.enemies.push(enemy);

      // Register hitboxes for raycast shooting
      enemy.rig.hitBoxes.forEach(hb => {
        this.enemyHitMeshes.push(hb);
      });
    });
  }

  initHelicopter() {
    this.helicopter = ModelBuilder.createAttackHelicopter();
    this.helicopter.position.set(0, 40, -60);
    this.helicopter.visible = false;
    this.scene.add(this.helicopter);
    this.heliTriggered = false;
  }

  initVFX() {
    this.vfx = new VFXSystem(this.scene);
    this.damageFlash = 0.0;
  }

  initControls() {
    // PointerLockControls
    this.controls = new THREE.PointerLockControls(this.camera, document.body);

    const overlay = document.getElementById('start-overlay');
    if (overlay) {
      overlay.addEventListener('click', () => {
        this.controls.lock();
      });
    }

    this.controls.addEventListener('lock', () => {
      this.isLocked = true;
      if (overlay) overlay.classList.add('hidden');
      if (window.soundEngine) soundEngine.init();
      if (this.hudCrosshair) this.hudCrosshair.style.display = 'block';
    });

    this.controls.addEventListener('unlock', () => {
      this.isLocked = false;
      if (overlay) overlay.classList.remove('hidden');
      if (this.hudCrosshair) this.hudCrosshair.style.display = 'none';
    });

    // Keyboard Listeners
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true;

      // Reload on R
      if (e.code === 'KeyR' && !this.isReloading && this.ammo < this.maxAmmo && this.reserveAmmo > 0) {
        this.reloadWeapon();
      }

      // Crouch on C
      if (e.code === 'KeyC') {
        this.isCrouching = !this.isCrouching;
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false;
    });

    // Mouse Listeners (Left click fire, Right click ADS)
    window.addEventListener('mousedown', (e) => {
      if (!this.isLocked) return;

      if (e.button === 0) { // Left click fire
        this.isMouseDown = true;
        this.shootWeapon();
      } else if (e.button === 2) { // Right click ADS
        this.isADS = true;
      }
    });

    window.addEventListener('mouseup', (e) => {
      if (e.button === 0) {
        this.isMouseDown = false;
      } else if (e.button === 2) {
        this.isADS = false;
      }
    });

    // Prevent right click context menu in game
    window.addEventListener('contextmenu', (e) => e.preventDefault());

    // Mouse move for weapon sway inertia
    window.addEventListener('mousemove', (e) => {
      if (!this.isLocked) return;
      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;
      this.gunSwayX += movementX * 0.0008;
      this.gunSwayY += movementY * 0.0008;
    });
  }

  createTacticalHUD() {
    // Create clean, modern military HUD container
    const hud = document.createElement('div');
    hud.id = 'fps-hud';
    hud.style.cssText = `
      position: absolute;
      inset: 0;
      pointer-events: none;
      z-index: 50;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 30px 40px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace;
      color: rgba(240, 245, 255, 0.9);
      user-select: none;
    `;

    // Dynamic Crosshair
    const crosshair = document.createElement('div');
    crosshair.id = 'hud-crosshair';
    crosshair.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 24px;
      height: 24px;
      display: none;
    `;
    crosshair.innerHTML = `
      <div style="position:absolute; top:0; left:11px; width:2px; height:6px; background:rgba(255,255,255,0.85); border-radius:1px;"></div>
      <div style="position:absolute; bottom:0; left:11px; width:2px; height:6px; background:rgba(255,255,255,0.85); border-radius:1px;"></div>
      <div style="position:absolute; left:0; top:11px; width:6px; height:2px; background:rgba(255,255,255,0.85); border-radius:1px;"></div>
      <div style="position:absolute; right:0; top:11px; width:6px; height:2px; background:rgba(255,255,255,0.85); border-radius:1px;"></div>
      <div id="hit-marker" style="position:absolute; inset:0; opacity:0; transition:opacity 0.08s; pointer-events:none;">
        <div style="position:absolute; top:2px; left:2px; width:6px; height:2px; background:#ff2200; transform:rotate(45deg);"></div>
        <div style="position:absolute; top:2px; right:2px; width:6px; height:2px; background:#ff2200; transform:rotate(-45deg);"></div>
        <div style="position:absolute; bottom:2px; left:2px; width:6px; height:2px; background:#ff2200; transform:rotate(-45deg);"></div>
        <div style="position:absolute; bottom:2px; right:2px; width:6px; height:2px; background:#ff2200; transform:rotate(45deg);"></div>
      </div>
    `;
    this.container.appendChild(crosshair);
    this.hudCrosshair = crosshair;
    this.hitMarkerElem = crosshair.querySelector('#hit-marker');

    // Top Bar: Mission Objective
    const topBar = document.createElement('div');
    topBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    `;
    topBar.innerHTML = `
      <div style="background: rgba(10, 15, 22, 0.6); backdrop-filter: blur(4px); padding: 8px 16px; border-left: 3px solid #ff9900; border-radius: 2px;">
        <div style="font-size: 11px; letter-spacing: 2px; color: #ff9900; font-weight: 700;">MISSION OBJECTIVE</div>
        <div style="font-size: 14px; font-weight: 600; letter-spacing: 1px;" id="objective-text">CLEAR WARZONE INTERSECTION // REMAINING: 6</div>
      </div>
      <div style="background: rgba(10, 15, 22, 0.6); backdrop-filter: blur(4px); padding: 8px 14px; border-radius: 2px; font-size: 12px; letter-spacing: 1px;">
        CALLSIGN: <span style="color: #00ffaa; font-weight: 700;">VIPER 1-1</span>
      </div>
    `;
    hud.appendChild(topBar);

    // Bottom Bar: Health & Ammo
    const bottomBar = document.createElement('div');
    bottomBar.style.cssText = `
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    `;
    bottomBar.innerHTML = `
      <!-- Health Panel -->
      <div style="background: rgba(10, 15, 22, 0.65); backdrop-filter: blur(4px); padding: 12px 20px; border-radius: 3px; min-width: 180px;">
        <div style="font-size: 11px; letter-spacing: 2px; color: #8899aa; margin-bottom: 4px;">OPERATOR VITAL</div>
        <div style="display: flex; align-items: baseline; gap: 8px;">
          <span style="font-size: 32px; font-weight: 800; color: #ffffff;" id="health-val">100</span>
          <span style="font-size: 14px; color: #8899aa;">HP</span>
        </div>
        <div style="width: 100%; height: 4px; background: rgba(255,255,255,0.15); border-radius: 2px; margin-top: 6px; overflow:hidden;">
          <div id="health-bar" style="width: 100%; height: 100%; background: #00ffaa; transition: width 0.2s, background 0.2s;"></div>
        </div>
      </div>

      <!-- Ammo & Weapon Panel -->
      <div style="background: rgba(10, 15, 22, 0.65); backdrop-filter: blur(4px); padding: 12px 22px; border-radius: 3px; text-align: right; min-width: 180px;">
        <div style="font-size: 11px; letter-spacing: 2px; color: #ff9900; margin-bottom: 4px;">HK416 // 5.56 NATO</div>
        <div style="display: flex; align-items: baseline; justify-content: flex-end; gap: 6px;">
          <span style="font-size: 36px; font-weight: 800; color: #ffffff;" id="ammo-cur">30</span>
          <span style="font-size: 18px; color: #778899;">/</span>
          <span style="font-size: 18px; color: #8899aa;" id="ammo-res">120</span>
        </div>
        <div style="font-size: 10px; letter-spacing: 1.5px; color: #00ffaa; margin-top: 2px;" id="fire-mode">FIRE MODE: AUTO</div>
      </div>
    `;
    hud.appendChild(bottomBar);

    this.container.appendChild(hud);
    this.hud = hud;
  }

  updateHUD() {
    const healthVal = document.getElementById('health-val');
    const healthBar = document.getElementById('health-bar');
    const ammoCur = document.getElementById('ammo-cur');
    const ammoRes = document.getElementById('ammo-res');
    const objText = document.getElementById('objective-text');

    if (healthVal && healthBar) {
      healthVal.innerText = Math.max(0, Math.floor(this.playerHealth));
      const pct = Math.max(0, (this.playerHealth / this.maxHealth) * 100);
      healthBar.style.width = pct + '%';
      if (pct < 30) {
        healthBar.style.background = '#ff2200';
      } else if (pct < 60) {
        healthBar.style.background = '#ffaa00';
      } else {
        healthBar.style.background = '#00ffaa';
      }
    }

    if (ammoCur && ammoRes) {
      ammoCur.innerText = this.isReloading ? 'RELOAD' : this.ammo;
      ammoRes.innerText = this.reserveAmmo;
    }

    if (objText) {
      const remaining = this.enemies.filter(e => !e.userData.isDead).length;
      if (remaining === 0) {
        objText.innerHTML = '<span style="color:#00ffaa;">WARZONE SECURED // EXCELLENT WORK!</span>';
      } else {
        objText.innerText = 'CLEAR WARZONE INTERSECTION // REMAINING: ' + remaining;
      }
    }
  }

  showHitMarker(isHeadshot = false) {
    if (!this.hitMarkerElem) return;
    this.hitMarkerElem.style.opacity = '1';
    setTimeout(() => {
      if (this.hitMarkerElem) this.hitMarkerElem.style.opacity = '0';
    }, 120);
    if (window.soundEngine) soundEngine.playHitMarker(isHeadshot);
  }

  // Shooting mechanics
  shootWeapon() {
    const now = performance.now() / 1000;
    if (now - this.lastFireTime < this.fireRate) return;
    if (this.isReloading) return;
    if (this.ammo <= 0) {
      this.reloadWeapon();
      return;
    }

    this.ammo--;
    this.lastFireTime = now;

    // Recoil Impulse
    this.gunRecoilZ = 0.055;
    this.gunRecoilRotX = 0.09;
    this.camera.rotation.x += (0.012 + Math.random() * 0.006);

    // Muzzle Flash
    if (this.fppRig && this.fppRig.muzzleFlash) {
      this.fppRig.muzzleFlash.scale.set(1.1, 1.1, 1.1);
      this.fppRig.muzzleFlash.rotation.z = Math.random() * Math.PI * 2;
      this.fppRig.muzzleLight.intensity = 15.0;

      setTimeout(() => {
        if (this.fppRig && this.fppRig.muzzleFlash) {
          this.fppRig.muzzleFlash.scale.set(0, 0, 0);
          this.fppRig.muzzleLight.intensity = 0;
        }
      }, 40);
    }

    // Eject Brass Shell Casing
    const barrelWorld = new THREE.Vector3();
    this.fppRig.rifle.getWorldPosition(barrelWorld);
    const rightDir = new THREE.Vector3(1, 0.4, 0).applyQuaternion(this.camera.quaternion);
    this.vfx.spawnShellCasing(barrelWorld, rightDir);

    // Sound
    if (window.soundEngine) soundEngine.playGunshot(true, 0);

    // Raycast hit detection
    this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
    const intersects = this.raycaster.intersectObjects(this.enemyHitMeshes, true);

    let targetHitPoint = null;

    if (intersects.length > 0) {
      const hit = intersects[0];
      targetHitPoint = hit.point;
      const hitObj = hit.object;

      if (hitObj.userData && hitObj.userData.parentEnemy) {
        const enemy = hitObj.userData.parentEnemy;
        const isHead = hitObj.userData.isHead;
        const damage = isHead ? 100 : 40;

        this.damageEnemy(enemy, damage, isHead);
        this.showHitMarker(isHead);
        this.vfx.spawnSparksBurst(hit.point, 25);
      }
    } else {
      // Raycast to street / environment
      const envIntersects = this.raycaster.intersectObjects([this.street, ...this.buildings, ...this.barriers], true);
      if (envIntersects.length > 0) {
        targetHitPoint = envIntersects[0].point;
        this.vfx.spawnSparksBurst(targetHitPoint, 18);
      } else {
        targetHitPoint = this.camera.position.clone().add(this.camera.getWorldDirection(new THREE.Vector3()).multiplyScalar(80));
      }
    }

    // Friendly Tracer Streak
    const shootDir = targetHitPoint.clone().sub(barrelWorld).normalize();
    this.vfx.spawnTracer(barrelWorld, shootDir, 140, true);
  }

  damageEnemy(enemy, damage, isHeadshot) {
    if (enemy.userData.isDead) return;

    enemy.userData.health -= damage;

    // Flinch reaction
    enemy.rig.torso.rotation.x = -0.3;
    setTimeout(() => {
      if (enemy.rig) enemy.rig.torso.rotation.x = 0;
    }, 150);

    if (enemy.userData.health <= 0) {
      enemy.userData.isDead = true;
      this.kills++;

      // Fall / collapse animation
      enemy.rotation.x = -Math.PI / 2;
      enemy.position.y = 0.2;
      enemy.rig.arms.rotation.z = 0.5;
      enemy.rig.rifle.position.set(0.4, 0.1, 0.4); // drop weapon

      if (window.soundEngine) soundEngine.playRadioChirp();
    }
  }

  reloadWeapon() {
    this.isReloading = true;
    if (window.soundEngine) soundEngine.playReload();

    // Reload animation dip
    this.gunRecoilRotX = -0.45;
    this.gunRecoilZ = 0.15;

    setTimeout(() => {
      const needed = this.maxAmmo - this.ammo;
      const amount = Math.min(needed, this.reserveAmmo);
      this.ammo += amount;
      this.reserveAmmo -= amount;
      this.isReloading = false;
      this.gunRecoilRotX = 0;
      this.gunRecoilZ = 0;
    }, 1200);
  }

  takeDamage(amount = 15) {
    this.playerHealth = Math.max(0, this.playerHealth - amount);
    this.damageFlash = 1.0;

    // Camera hit punch
    this.camera.rotation.z += (Math.random() - 0.5) * 0.05;
    this.camera.rotation.x += 0.03;

    if (window.soundEngine) soundEngine.playRadioChirp();
  }

  // Master Game Loop
  animate(timestamp) {
    requestAnimationFrame(this.animate);

    const dt = Math.min((timestamp - this.lastTimestamp) / 1000, 0.1);
    this.lastTimestamp = timestamp;

    if (this.isLocked) {
      this.updateMovement(dt);
      this.updateWeapon(dt);
      this.updateEnemies(dt);
      this.updateSquad(dt);
      this.updateHelicopter(dt);
    }

    // Continuous fire if mouse is held down
    if (this.isLocked && this.isMouseDown) {
      this.shootWeapon();
    }

    // Environmental VFX
    this.vfx.update(dt, this.camera);

    // Damage flash decay
    if (this.damageFlash > 0) {
      this.damageFlash = Math.max(0, this.damageFlash - dt * 2.5);
    }

    this.filmPass.uniforms.uTime.value = timestamp * 0.001;
    this.filmPass.uniforms.uDamage.value = this.damageFlash;

    this.updateHUD();
    this.composer.render();
  }

  updateMovement(dt) {
    // Sprint
    this.isSprinting = !!(this.keys['ShiftLeft'] || this.keys['ShiftRight']) && !this.isADS;
    const speed = this.isSprinting ? 8.5 : (this.isCrouching ? 2.5 : 4.6);

    // Smooth Crouch
    const targetH = this.isCrouching ? this.crouchHeight : this.playerHeight;
    this.currentHeight = THREE.MathUtils.lerp(this.currentHeight, targetH, dt * 10.0);
    this.camera.position.y = this.currentHeight;

    // Movement Direction
    this.direction.z = Number(!!this.keys['KeyW']) - Number(!!this.keys['KeyS']);
    this.direction.x = Number(!!this.keys['KeyD']) - Number(!!this.keys['KeyA']);
    this.direction.normalize();

    if (this.keys['KeyW'] || this.keys['KeyS']) {
      this.velocity.z = this.direction.z * speed;
    } else {
      this.velocity.z = THREE.MathUtils.lerp(this.velocity.z, 0, dt * 10.0);
    }

    if (this.keys['KeyA'] || this.keys['KeyD']) {
      this.velocity.x = this.direction.x * speed;
    } else {
      this.velocity.x = THREE.MathUtils.lerp(this.velocity.x, 0, dt * 10.0);
    }

    // Move Forward/Strafe
    this.controls.moveRight(this.velocity.x * dt);
    this.controls.moveForward(this.velocity.z * dt);

    // Footsteps sound
    if ((Math.abs(this.velocity.x) > 0.5 || Math.abs(this.velocity.z) > 0.5) && Math.random() < dt * (this.isSprinting ? 4.2 : 2.5)) {
      if (window.soundEngine) soundEngine.playFootstep(this.isSprinting);
    }

    // Constrain player within street boundaries
    this.camera.position.x = Math.max(-10.5, Math.min(10.5, this.camera.position.x));
    this.camera.position.z = Math.max(-14.5, Math.min(55.0, this.camera.position.z));
  }

  updateWeapon(dt) {
    if (!this.fppRig) return;

    // Recoil recovery
    this.gunRecoilZ = THREE.MathUtils.lerp(this.gunRecoilZ, 0, dt * 16.0);
    this.gunRecoilRotX = THREE.MathUtils.lerp(this.gunRecoilRotX, 0, dt * 14.0);

    // Mouse sway decay
    this.gunSwayX = THREE.MathUtils.lerp(this.gunSwayX, 0, dt * 8.0);
    this.gunSwayY = THREE.MathUtils.lerp(this.gunSwayY, 0, dt * 8.0);

    // Walking bob
    const isMoving = Math.abs(this.velocity.x) > 0.5 || Math.abs(this.velocity.z) > 0.5;
    const now = performance.now() * 0.001;
    const bobFreq = this.isSprinting ? 14.0 : 8.0;
    const bobMag = this.isSprinting ? 0.025 : (isMoving ? 0.012 : 0.003);
    const bobX = Math.sin(now * bobFreq * 0.5) * bobMag;
    const bobY = Math.cos(now * bobFreq) * bobMag;

    // ADS / Hip-fire interpolation
    const targetPos = this.isADS ? this.adsPos : this.hipPos;
    const targetRot = this.isADS ? this.adsRot : this.hipRot;
    const lerpSpeed = this.isADS ? 14.0 : 10.0;

    // Crosshair visibility: hide in ADS
    if (this.hudCrosshair) {
      this.hudCrosshair.style.opacity = this.isADS ? '0' : '1';
    }

    // Camera FOV zoom in ADS
    const targetFov = this.isADS ? 46 : 62;
    this.camera.fov = THREE.MathUtils.lerp(this.camera.fov, targetFov, dt * 12.0);
    this.camera.updateProjectionMatrix();

    this.fppRig.position.x = THREE.MathUtils.lerp(this.fppRig.position.x, targetPos.x + bobX + this.gunSwayX, dt * lerpSpeed);
    this.fppRig.position.y = THREE.MathUtils.lerp(this.fppRig.position.y, targetPos.y + bobY - this.gunSwayY, dt * lerpSpeed);
    this.fppRig.position.z = THREE.MathUtils.lerp(this.fppRig.position.z, targetPos.z + this.gunRecoilZ, dt * lerpSpeed);

    this.fppRig.rotation.x = THREE.MathUtils.lerp(this.fppRig.rotation.x, targetRot.x - this.gunRecoilRotX, dt * lerpSpeed);
    this.fppRig.rotation.y = THREE.MathUtils.lerp(this.fppRig.rotation.y, targetRot.y - this.gunSwayX * 1.5, dt * lerpSpeed);
  }

  // Enemy Combat AI
  updateEnemies(dt) {
    const playerPos = this.camera.position;

    this.enemies.forEach(enemy => {
      if (enemy.userData.isDead) return;

      const dist = enemy.position.distanceTo(playerPos);
      if (dist < 65) {
        // Face player
        enemy.lookAt(playerPos.x, enemy.position.y, playerPos.z);

        // Periodic peek & crouch
        enemy.userData.peekTimer += dt;
        if (Math.sin(enemy.userData.peekTimer * 1.5) > 0.4) {
          enemy.position.y = enemy.userData.origY;
        } else {
          enemy.position.y = enemy.userData.origY - 0.45; // duck in cover
        }

        // Shoot at player
        enemy.userData.fireTimer += dt;
        if (enemy.userData.fireTimer >= enemy.userData.shootCooldown) {
          enemy.userData.fireTimer = 0;
          enemy.userData.shootCooldown = 1.0 + Math.random() * 1.8;

          this.enemyShoot(enemy, playerPos);
        }
      }
    });
  }

  enemyShoot(enemy, playerPos) {
    const startPos = enemy.position.clone();
    startPos.y += 1.35;

    // Flash muzzle
    enemy.rig.enemyFlash.scale.set(1, 1, 1);
    enemy.rig.enemyLight.intensity = 10.0;
    setTimeout(() => {
      if (enemy.rig) {
        enemy.rig.enemyFlash.scale.set(0, 0, 0);
        enemy.rig.enemyLight.intensity = 0;
      }
    }, 45);

    // Aim near player with slight spread
    const target = playerPos.clone();
    target.x += (Math.random() - 0.5) * 1.6;
    target.y += (Math.random() - 0.5) * 1.0;
    target.z += (Math.random() - 0.5) * 0.8;

    const dir = target.clone().sub(startPos).normalize();
    this.vfx.spawnTracer(startPos, dir, 95, false);

    // Distance-based sound & crack
    const dist = startPos.distanceTo(playerPos);
    if (window.soundEngine) {
      soundEngine.playGunshot(false, (startPos.x - playerPos.x) / 20.0);
      if (dist < 45 && Math.random() < 0.65) {
        soundEngine.playTracerSnap((startPos.x - playerPos.x) / 20.0);
      }
    }

    // Check hit on player (chance increases if player is not crouching)
    if (target.distanceTo(playerPos) < (this.isCrouching ? 0.7 : 1.2)) {
      this.takeDamage(12 + Math.floor(Math.random() * 8));
    }
  }

  // Friendly Squad Support
  updateSquad(dt) {
    const playerZ = this.camera.position.z;

    this.teammates.forEach((tm, idx) => {
      // Follow behind player in staggered wedge
      const targetZ = playerZ - (3.5 + idx * 1.5);
      tm.position.z = THREE.MathUtils.lerp(tm.position.z, targetZ, dt * 2.5);

      // Look toward nearest alive enemy
      const aliveEnemies = this.enemies.filter(e => !e.userData.isDead);
      if (aliveEnemies.length > 0) {
        const nearest = aliveEnemies[0];
        tm.lookAt(nearest.position.x, tm.position.y, nearest.position.z);

        // Teammates return fire occasionally
        if (Math.random() < dt * 1.5) {
          this.teammateShoot(tm, nearest.position);
        }
      }
    });
  }

  teammateShoot(teammate, targetPos) {
    if (!teammate.rig) return;
    const barrelWorld = new THREE.Vector3();
    teammate.rig.rifle.getWorldPosition(barrelWorld);

    teammate.rig.muzzleFlash.scale.set(1, 1, 1);
    teammate.rig.muzzleLight.intensity = 10.0;
    setTimeout(() => {
      if (teammate.rig) {
        teammate.rig.muzzleFlash.scale.set(0, 0, 0);
        teammate.rig.muzzleLight.intensity = 0;
      }
    }, 45);

    const dir = targetPos.clone().sub(barrelWorld).normalize();
    this.vfx.spawnTracer(barrelWorld, dir, 125, true);

    if (window.soundEngine) {
      soundEngine.playGunshot(false, (teammate.position.x / 10.0));
    }
  }

  // Attack Helicopter Overflight event
  updateHelicopter(dt) {
    // Trigger helicopter when player crosses z = 8
    if (!this.heliTriggered && this.camera.position.z > 5.0) {
      this.heliTriggered = true;
      this.helicopter.visible = true;
      this.heliProgress = 0;
      if (window.soundEngine) soundEngine.startHelicopter();
    }

    if (this.heliTriggered && this.helicopter.visible) {
      this.heliProgress += dt * 0.14; // ~7s flyby
      this.helicopter.rotorHub.rotation.y += dt * 35.0;
      this.helicopter.tailRotor.rotation.x += dt * 50.0;

      const p = this.heliProgress;
      const curZ = THREE.MathUtils.lerp(-40, 70, p);
      const dip = Math.sin(p * Math.PI) * 14.0;
      const curY = THREE.MathUtils.lerp(35, 18, p) - dip;
      const curX = Math.sin(p * Math.PI * 1.5) * 3.5;

      this.helicopter.position.set(curX, curY, curZ);

      // Searchlight sweeping downstreet
      this.helicopter.lightTarget.position.set(Math.sin(p * 20.0) * 8.0, -curY, 20.0);

      const heliDist = curZ - this.camera.position.z;
      const vol = Math.max(0.1, 1.0 - Math.min(1.0, Math.abs(heliDist) / 45.0));
      if (window.soundEngine) soundEngine.updateHelicopter(vol, heliDist < 0 ? 1.06 : 0.94);

      if (p >= 1.0) {
        this.helicopter.visible = false;
        if (window.soundEngine) soundEngine.stopHelicopter();
      }
    }
  }

  onResize() {
    this.width = this.container.clientWidth || window.innerWidth;
    this.height = this.container.clientHeight || (this.width * 9 / 16);
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height, false);
    this.composer.setSize(this.width, this.height);
  }
}

window.PlayableFPSGame = PlayableFPSGame;
