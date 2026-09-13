// Particle & VFX Systems for AAA Military FPS Scene
// Volumetric Smoke, Embers, Tracers, Debris Physics, Explosions, and Shell Casings

class VFXSystem {
  constructor(scene) {
    this.scene = scene;

    // Initialize textures
    this.smokeTex = TextureGenerator.createSmokeParticleTexture(128);
    this.sparkTex = TextureGenerator.createSparkParticleTexture(64);

    // Subsystems
    this.initSmoke();
    this.initEmbers();
    this.initTracers();
    this.initDebris();
    this.initSparks();
    this.initExplosionMesh();
    this.initShellCasings();
    this.initDistantArtilleryLight();
  }

  // 1. Volumetric Smoke System (Instanced / Point billboarding)
  initSmoke() {
    this.smokeParticles = [];
    this.maxSmoke = 120;
    const geo = new THREE.PlaneGeometry(3.5, 3.5);
    const mat = new THREE.MeshBasicMaterial({
      map: this.smokeTex,
      transparent: true,
      opacity: 0.35,
      depthWrite: false,
      blending: THREE.NormalBlending
    });

    this.smokeGroup = new THREE.Group();
    this.scene.add(this.smokeGroup);

    for (let i = 0; i < this.maxSmoke; i++) {
      const mesh = new THREE.Mesh(geo, mat.clone());
      mesh.visible = false;
      this.smokeGroup.add(mesh);
      this.smokeParticles.push({
        mesh,
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        rot: 0,
        rotSpeed: 0,
        life: 0,
        maxLife: 1,
        scale: 1,
        baseOpacity: 0.35
      });
    }
  }

  spawnSmoke(pos, vel, scale = 3.5, maxLife = 4.0, opacity = 0.35) {
    const p = this.smokeParticles.find(p => !p.active);
    if (!p) return;
    p.active = true;
    p.mesh.visible = true;
    p.pos.copy(pos);
    p.vel.copy(vel);
    p.rot = Math.random() * Math.PI * 2;
    p.rotSpeed = (Math.random() - 0.5) * 0.4;
    p.life = 0;
    p.maxLife = maxLife;
    p.scale = scale;
    p.baseOpacity = opacity;
    p.mesh.position.copy(p.pos);
    p.mesh.scale.set(scale, scale, scale);
  }

  // 2. Floating Warzone Embers System
  initEmbers() {
    this.emberCount = 220;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(this.emberCount * 3);
    const velocities = [];

    for (let i = 0; i < this.emberCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 35;
      positions[i * 3 + 1] = Math.random() * 12;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities.push({
        x: (Math.random() - 0.5) * 0.4,
        y: 0.3 + Math.random() * 0.7,
        z: (Math.random() - 0.5) * 0.4,
        freq: 1.0 + Math.random() * 2.0
      });
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      size: 0.28,
      map: this.sparkTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.emberPoints = new THREE.Points(geo, mat);
    this.scene.add(this.emberPoints);
    this.emberVelocities = velocities;
  }

  // 3. Bullet Tracers (Supersonic incoming fire & Squad return fire)
  initTracers() {
    this.tracers = [];
    this.maxTracers = 40;
    const geo = new THREE.CylinderGeometry(0.025, 0.025, 1.8, 6);
    geo.rotateX(Math.PI / 2);

    const enemyMat = new THREE.MeshBasicMaterial({
      color: 0xff3300,
      blending: THREE.AdditiveBlending
    });
    const friendlyMat = new THREE.MeshBasicMaterial({
      color: 0xffaa22,
      blending: THREE.AdditiveBlending
    });

    this.tracerGroup = new THREE.Group();
    this.scene.add(this.tracerGroup);

    for (let i = 0; i < this.maxTracers; i++) {
      const mesh = new THREE.Mesh(geo, enemyMat);
      mesh.visible = false;
      this.tracerGroup.add(mesh);
      this.tracers.push({
        mesh,
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1.0,
        isFriendly: false,
        enemyMat,
        friendlyMat
      });
    }
  }

  spawnTracer(startPos, dir, speed = 85, isFriendly = false) {
    const t = this.tracers.find(t => !t.active);
    if (!t) return;
    t.active = true;
    t.mesh.visible = true;
    t.isFriendly = isFriendly;
    t.mesh.material = isFriendly ? t.friendlyMat : t.enemyMat;
    t.pos.copy(startPos);
    t.vel.copy(dir).normalize().multiplyScalar(speed);
    t.life = 0;
    t.maxLife = 1.2;
    t.mesh.position.copy(t.pos);
    t.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), dir.clone().normalize());
  }

  // 4. Physical Concrete Debris from RPG Blast
  initDebris() {
    this.debrisList = [];
    this.maxDebris = 80;
    const mats = ModelBuilder.initMaterials();

    this.debrisGroup = new THREE.Group();
    this.scene.add(this.debrisGroup);

    for (let i = 0; i < this.maxDebris; i++) {
      const s = 0.08 + Math.random() * 0.24;
      const geo = new THREE.DodecahedronGeometry(s, 0);
      const mesh = new THREE.Mesh(geo, mats.concrete);
      mesh.visible = false;
      this.debrisGroup.add(mesh);
      this.debrisList.push({
        mesh,
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        rotAxis: new THREE.Vector3(Math.random(), Math.random(), Math.random()).normalize(),
        rotSpeed: 0,
        life: 0
      });
    }
  }

  spawnDebrisExplosion(centerPos, count = 60) {
    let spawned = 0;
    for (let d of this.debrisList) {
      if (spawned >= count) break;
      if (!d.active) {
        d.active = true;
        d.mesh.visible = true;
        d.pos.copy(centerPos);
        d.pos.x += (Math.random() - 0.5) * 0.6;
        d.pos.z += (Math.random() - 0.5) * 0.6;
        d.pos.y += 0.2;

        const angle = Math.random() * Math.PI * 2;
        const elevation = 0.3 + Math.random() * 0.7;
        const speed = 10 + Math.random() * 22;
        d.vel.set(
          Math.cos(angle) * speed,
          elevation * speed,
          Math.sin(angle) * speed
        );
        d.rotSpeed = 8 + Math.random() * 20;
        d.life = 0;
        d.mesh.position.copy(d.pos);
        spawned++;
      }
    }
  }

  // 5. Fiery Sparks Burst from Detonation
  initSparks() {
    this.sparksList = [];
    this.maxSparks = 250;
    const geo = new THREE.PlaneGeometry(0.18, 0.18);
    const mat = new THREE.MeshBasicMaterial({
      map: this.sparkTex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.sparksGroup = new THREE.Group();
    this.scene.add(this.sparksGroup);

    for (let i = 0; i < this.maxSparks; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.sparksGroup.add(mesh);
      this.sparksList.push({
        mesh,
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1.0
      });
    }
  }

  spawnSparksBurst(centerPos, count = 180) {
    let spawned = 0;
    for (let s of this.sparksList) {
      if (spawned >= count) break;
      if (!s.active) {
        s.active = true;
        s.mesh.visible = true;
        s.pos.copy(centerPos);
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI * 0.5; // Upper hemisphere
        const speed = 14 + Math.random() * 24;
        s.vel.set(
          Math.sin(phi) * Math.cos(theta) * speed,
          Math.cos(phi) * speed,
          Math.sin(phi) * Math.sin(theta) * speed
        );
        s.life = 0;
        s.maxLife = 0.6 + Math.random() * 0.9;
        s.mesh.position.copy(s.pos);
        spawned++;
      }
    }
  }

  // 6. Explosion Fireball & Shockwave Ring
  initExplosionMesh() {
    // Blinding Flash Light
    this.blastLight = new THREE.PointLight(0xff7711, 0, 45);
    this.scene.add(this.blastLight);

    // Fireball Sphere with noise distortion
    const fireGeo = new THREE.SphereGeometry(1.0, 16, 16);
    this.fireMat = new THREE.MeshBasicMaterial({
      color: 0xff4400,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending
    });
    this.fireMesh = new THREE.Mesh(fireGeo, this.fireMat);
    this.fireMesh.visible = false;
    this.scene.add(this.fireMesh);

    // Expanding Ground Shockwave Ring
    const ringGeo = new THREE.RingGeometry(0.5, 1.2, 32);
    ringGeo.rotateX(-Math.PI / 2);
    this.ringMat = new THREE.MeshBasicMaterial({
      color: 0xffaa44,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    });
    this.ringMesh = new THREE.Mesh(ringGeo, this.ringMat);
    this.ringMesh.position.y = 0.05;
    this.ringMesh.visible = false;
    this.scene.add(this.ringMesh);

    this.explosionActive = false;
    this.explosionTime = 0;
    this.explosionDuration = 1.8;
    this.explosionPos = new THREE.Vector3();
  }

  triggerExplosion(pos) {
    this.explosionActive = true;
    this.explosionTime = 0;
    this.explosionPos.copy(pos);

    this.blastLight.position.copy(pos);
    this.blastLight.position.y += 1.2;
    this.blastLight.intensity = 32.0;

    this.fireMesh.position.copy(pos);
    this.fireMesh.position.y += 1.0;
    this.fireMesh.scale.set(0.1, 0.1, 0.1);
    this.fireMesh.visible = true;
    this.fireMat.opacity = 1.0;
    this.fireMat.color.setHex(0xffffff);

    this.ringMesh.position.set(pos.x, 0.06, pos.z);
    this.ringMesh.scale.set(0.1, 0.1, 0.1);
    this.ringMesh.visible = true;
    this.ringMat.opacity = 0.9;

    // Spawn physics debris & sparks
    this.spawnDebrisExplosion(pos, 70);
    this.spawnSparksBurst(pos, 200);

    // Billow blast dust clouds
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const spd = 2.5 + Math.random() * 3.5;
      this.spawnSmoke(
        new THREE.Vector3(pos.x, 0.5, pos.z),
        new THREE.Vector3(Math.cos(angle) * spd, 0.8 + Math.random() * 1.5, Math.sin(angle) * spd),
        5.0,
        3.5,
        0.5
      );
    }
  }

  // 7. Spent Shell Casings Physics
  initShellCasings() {
    this.casings = [];
    this.maxCasings = 30;
    const geo = new THREE.CylinderGeometry(0.012, 0.012, 0.05, 6);
    const mat = new THREE.MeshStandardMaterial({
      color: 0xcca033,
      metalness: 0.95,
      roughness: 0.2
    });

    this.casingsGroup = new THREE.Group();
    this.scene.add(this.casingsGroup);

    for (let i = 0; i < this.maxCasings; i++) {
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.casingsGroup.add(mesh);
      this.casings.push({
        mesh,
        active: false,
        pos: new THREE.Vector3(),
        vel: new THREE.Vector3(),
        rotSpeed: 0,
        life: 0
      });
    }
  }

  spawnShellCasing(startPos, rightDir) {
    const c = this.casings.find(c => !c.active);
    if (!c) return;
    c.active = true;
    c.mesh.visible = true;
    c.pos.copy(startPos);
    c.vel.copy(rightDir).multiplyScalar(2.2 + Math.random() * 1.2);
    c.vel.y = 1.4 + Math.random() * 0.8;
    c.rotSpeed = 15 + Math.random() * 25;
    c.life = 0;
    c.mesh.position.copy(c.pos);
  }

  // 8. Distant Horizon Flash Light
  initDistantArtilleryLight() {
    this.artilleryLight = new THREE.PointLight(0xff8833, 0, 150);
    this.artilleryLight.position.set(-45, 25, 95);
    this.scene.add(this.artilleryLight);
  }

  flashDistantArtillery(intensity = 6.0) {
    this.artilleryLight.intensity = intensity;
  }

  // Global Update per frame
  update(dt, camera) {
    // 1. Update Smoke
    for (let p of this.smokeParticles) {
      if (!p.active) continue;
      p.life += dt;
      if (p.life >= p.maxLife) {
        p.active = false;
        p.mesh.visible = false;
        continue;
      }
      p.pos.addScaledVector(p.vel, dt);
      p.rot += p.rotSpeed * dt;
      p.mesh.position.copy(p.pos);
      p.mesh.rotation.z = p.rot;
      p.mesh.quaternion.copy(camera.quaternion);

      // Expansion and fade
      const progress = p.life / p.maxLife;
      const currentScale = p.scale * (1.0 + progress * 1.8);
      p.mesh.scale.set(currentScale, currentScale, currentScale);
      p.mesh.material.opacity = p.baseOpacity * (1.0 - progress);
    }

    // 2. Update Warzone Embers
    if (this.emberPoints) {
      const posAttr = this.emberPoints.geometry.attributes.position;
      const arr = posAttr.array;
      for (let i = 0; i < this.emberCount; i++) {
        const vel = this.emberVelocities[i];
        arr[i * 3 + 1] += vel.y * dt;
        arr[i * 3] += Math.sin(arr[i * 3 + 1] * vel.freq) * 0.02;

        if (arr[i * 3 + 1] > 18) {
          arr[i * 3 + 1] = 0.2;
          arr[i * 3] = (Math.random() - 0.5) * 35;
          arr[i * 3 + 2] = (Math.random() - 0.5) * 60;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 3. Update Tracers
    for (let t of this.tracers) {
      if (!t.active) continue;
      t.life += dt;
      if (t.life >= t.maxLife) {
        t.active = false;
        t.mesh.visible = false;
        continue;
      }
      t.pos.addScaledVector(t.vel, dt);
      t.mesh.position.copy(t.pos);

      // Hit ground check -> sparks
      if (t.pos.y <= 0.05) {
        t.active = false;
        t.mesh.visible = false;
        this.spawnSparksBurst(t.pos, 15);
      }
    }

    // 4. Update Debris
    for (let d of this.debrisList) {
      if (!d.active) continue;
      d.life += dt;
      if (d.life > 4.0) {
        d.active = false;
        d.mesh.visible = false;
        continue;
      }
      d.vel.y -= 9.8 * dt; // gravity
      d.pos.addScaledVector(d.vel, dt);

      // Ground bounce
      if (d.pos.y <= 0.1) {
        d.pos.y = 0.1;
        d.vel.y = -d.vel.y * 0.35; // restitution
        d.vel.x *= 0.6;
        d.vel.z *= 0.6;
      }
      d.mesh.position.copy(d.pos);
      d.mesh.rotation.x += d.rotSpeed * dt;
      d.mesh.rotation.y += d.rotSpeed * dt * 0.7;
    }

    // 5. Update Sparks
    for (let s of this.sparksList) {
      if (!s.active) continue;
      s.life += dt;
      if (s.life >= s.maxLife) {
        s.active = false;
        s.mesh.visible = false;
        continue;
      }
      s.vel.y -= 7.5 * dt; // gravity
      s.pos.addScaledVector(s.vel, dt);
      s.mesh.position.copy(s.pos);
      s.mesh.quaternion.copy(camera.quaternion);

      // fade out
      const progress = s.life / s.maxLife;
      s.mesh.material.opacity = 1.0 - progress;
    }

    // 6. Update Explosion Fireball & Shockwave
    if (this.explosionActive) {
      this.explosionTime += dt;
      const p = this.explosionTime / this.explosionDuration;

      if (p >= 1.0) {
        this.explosionActive = false;
        this.fireMesh.visible = false;
        this.ringMesh.visible = false;
        this.blastLight.intensity = 0;
      } else {
        // Light decay
        this.blastLight.intensity = 32.0 * Math.exp(-p * 6.0);

        // Fireball growth & color shift: white -> yellow -> orange -> dark smoke
        const fScale = 0.5 + Math.sin(p * Math.PI * 0.5) * 6.5;
        this.fireMesh.scale.set(fScale, fScale * 0.85, fScale);
        if (p < 0.2) {
          this.fireMat.color.setHex(0xffffff);
        } else if (p < 0.5) {
          this.fireMat.color.setHex(0xff7700);
        } else {
          this.fireMat.color.setHex(0x331100);
        }
        this.fireMat.opacity = Math.max(0, 1.0 - p * 1.1);

        // Shockwave expansion
        const rScale = 0.5 + p * 22.0;
        this.ringMesh.scale.set(rScale, rScale, rScale);
        this.ringMat.opacity = 0.9 * (1.0 - p);
      }
    }

    // 7. Update Shell Casings
    for (let c of this.casings) {
      if (!c.active) continue;
      c.life += dt;
      if (c.life > 3.0) {
        c.active = false;
        c.mesh.visible = false;
        continue;
      }
      c.vel.y -= 9.8 * dt;
      c.pos.addScaledVector(c.vel, dt);
      if (c.pos.y <= 0.03) {
        c.pos.y = 0.03;
        c.vel.y = -c.vel.y * 0.25;
        c.vel.x *= 0.5;
        c.vel.z *= 0.5;
      }
      c.mesh.position.copy(c.pos);
      c.mesh.rotation.z += c.rotSpeed * dt;
    }

    // 8. Distant light decay
    if (this.artilleryLight.intensity > 0) {
      this.artilleryLight.intensity = Math.max(0, this.artilleryLight.intensity - dt * 7.0);
    }
  }
}

window.VFXSystem = VFXSystem;
