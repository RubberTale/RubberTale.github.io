// 3D Models Builder for AAA Military FPS Scene
// High-fidelity meshes for Special Forces Operators, Weapons, Vehicles, and Warzone Ruins

const ModelBuilder = {
  // Shared materials cache
  materials: null,

  initMaterials: function() {
    if (this.materials) return this.materials;

    const camoTex = TextureGenerator.createCamoTexture(512);
    camoTex.repeat.set(2, 2);

    const asphaltTex = TextureGenerator.createAsphaltTexture(1024);
    asphaltTex.repeat.set(1, 12);
    const asphaltRough = TextureGenerator.createAsphaltRoughness(512);
    asphaltRough.repeat.set(1, 12);

    const concreteTex = TextureGenerator.createConcreteTexture(512);
    concreteTex.repeat.set(2, 4);

    const metalTex = TextureGenerator.createMetalArmorTexture(512);
    const reticleTex = TextureGenerator.createEOTechReticleTexture(256);
    const muzzleTex = TextureGenerator.createMuzzleFlashTexture(128);

    this.materials = {
      // Operator Uniform & Gear
      camo: new THREE.MeshStandardMaterial({
        map: camoTex,
        roughness: 0.82,
        metalness: 0.05,
        bumpScale: 0.02
      }),
      vest: new THREE.MeshStandardMaterial({
        color: 0x2e302b, // Tactical foliage / slate
        roughness: 0.75,
        metalness: 0.1
      }),
      tacticalBlack: new THREE.MeshStandardMaterial({
        color: 0x161819,
        roughness: 0.55,
        metalness: 0.25
      }),
      skinBalaclava: new THREE.MeshStandardMaterial({
        color: 0x1d1e20,
        roughness: 0.9,
        metalness: 0.0
      }),
      nvgLens: new THREE.MeshStandardMaterial({
        color: 0x052216,
        emissive: 0x00ff88,
        emissiveIntensity: 0.7,
        roughness: 0.2,
        metalness: 0.8
      }),
      eyeMaterial: new THREE.MeshStandardMaterial({
        color: 0xd9c5b2,
        roughness: 0.4
      }),

      // Weapon
      rifleBody: new THREE.MeshStandardMaterial({
        color: 0x181a1c,
        roughness: 0.35,
        metalness: 0.85
      }),
      riflePolymer: new THREE.MeshStandardMaterial({
        color: 0x2a2825, // Magpul FDE / dark earth
        roughness: 0.7,
        metalness: 0.08
      }),
      reticle: new THREE.MeshBasicMaterial({
        map: reticleTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
      muzzleFlash: new THREE.MeshBasicMaterial({
        map: muzzleTex,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        side: THREE.DoubleSide
      }),
      laserBeam: new THREE.MeshBasicMaterial({
        color: 0xff1100,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      }),

      // Environment & Props
      asphalt: new THREE.MeshStandardMaterial({
        map: asphaltTex,
        roughnessMap: asphaltRough,
        roughness: 0.6,
        metalness: 0.15
      }),
      concrete: new THREE.MeshStandardMaterial({
        map: concreteTex,
        roughness: 0.85,
        metalness: 0.05
      }),
      wreckMetal: new THREE.MeshStandardMaterial({
        map: metalTex,
        roughness: 0.65,
        metalness: 0.6
      }),
      windowGlass: new THREE.MeshPhysicalMaterial({
        color: 0x111c24,
        roughness: 0.1,
        metalness: 0.9,
        transmission: 0.6,
        transparent: true,
        opacity: 0.75
      }),
      rubble: new THREE.MeshStandardMaterial({
        color: 0x4a4a4c,
        roughness: 0.9,
        metalness: 0.05
      }),

      // Helicopter
      heliHull: new THREE.MeshStandardMaterial({
        color: 0x24282c,
        roughness: 0.45,
        metalness: 0.7
      }),
      heliRotorBlur: new THREE.MeshBasicMaterial({
        color: 0x111111,
        transparent: true,
        opacity: 0.4,
        side: THREE.DoubleSide
      })
    };

    return this.materials;
  },

  // 1. Create Fully Rigged Tactical Operator (Lead Soldier & Teammates)
  createSoldier: function(isLead = true, callsign = "Lead") {
    const mats = this.initMaterials();
    const soldier = new THREE.Group();
    soldier.name = callsign;

    // Root node
    const root = new THREE.Group();
    soldier.add(root);

    // Pelvis & Belt
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.95;
    root.add(pelvis);

    const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.24), mats.camo);
    pelvis.add(pelvisMesh);

    // Heavy tactical duty belt with pouches
    const belt = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.08, 0.26), mats.tacticalBlack);
    belt.position.y = 0.06;
    pelvis.add(belt);

    // Sidearm holster on right thigh
    const holster = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.18, 0.1), mats.tacticalBlack);
    holster.position.set(0.21, -0.15, 0.02);
    pelvis.add(holster);

    // Torso / Chest
    const torso = new THREE.Group();
    torso.position.y = 0.14;
    pelvis.add(torso);

    // Combat shirt inner body
    const shirtBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.38, 0.25), mats.camo);
    shirtBody.position.y = 0.19;
    torso.add(shirtBody);

    // Heavy Plate Carrier / Tactical Vest
    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.36, 0.30), mats.vest);
    vest.position.y = 0.19;
    torso.add(vest);

    // 3D MOLLE Webbing & 3x 5.56 Magazine Pouches on chest
    for (let i = -1; i <= 1; i++) {
      const magPouch = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.16, 0.06), mats.tacticalBlack);
      magPouch.position.set(i * 0.1, 0.16, 0.17);
      torso.add(magPouch);
    }

    // CAT Tourniquet & Chem-lights on vest
    const tourniquet = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.04, 0.05), mats.tacticalBlack);
    tourniquet.position.set(0, 0.28, 0.16);
    torso.add(tourniquet);

    // Tactical Radio (PRC-152) on left shoulder/back with tall whip antenna
    const radio = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.18, 0.08), mats.tacticalBlack);
    radio.position.set(-0.21, 0.22, -0.12);
    torso.add(radio);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.003, 0.5, 6), mats.tacticalBlack);
    antenna.position.set(-0.21, 0.52, -0.12);
    antenna.rotation.z = -0.1;
    torso.add(antenna);

    // Neck & Head
    const neck = new THREE.Group();
    neck.position.y = 0.40;
    torso.add(neck);

    const head = new THREE.Group();
    head.position.y = 0.10;
    neck.add(head);

    // Balaclava head shape
    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.125, 16, 16), mats.skinBalaclava);
    headMesh.scale.set(1.0, 1.25, 1.15);
    head.add(headMesh);

    // Focused combat eyes cutout
    const eyeBand = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.045, 0.08), mats.eyeMaterial);
    eyeBand.position.set(0, 0.03, 0.11);
    head.add(eyeBand);

    // FAST Ballistic Helmet
    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.142, 18, 18), mats.camo);
    helmet.scale.set(1.05, 1.05, 1.12);
    helmet.position.set(0, 0.04, -0.01);
    head.add(helmet);

    // Helmet ARC rails on sides
    const leftRail = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.14), mats.tacticalBlack);
    leftRail.position.set(-0.15, 0.04, 0.0);
    head.add(leftRail);

    const rightRail = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.04, 0.14), mats.tacticalBlack);
    rightRail.position.set(0.15, 0.04, 0.0);
    head.add(rightRail);

    // ComTac Tactical Headset (Earcups + Boom Mic)
    const leftEarcup = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.03, 12), mats.vest);
    leftEarcup.rotation.z = Math.PI / 2;
    leftEarcup.position.set(-0.155, 0.01, 0.0);
    head.add(leftEarcup);

    const rightEarcup = leftEarcup.clone();
    rightEarcup.position.x = 0.155;
    head.add(rightEarcup);

    const boomMic = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.16, 6), mats.tacticalBlack);
    boomMic.position.set(-0.12, -0.04, 0.11);
    boomMic.rotation.set(0.8, -0.6, 0);
    head.add(boomMic);

    // Quad-Tube GPNVG-18 Night Vision System mounted on Wilcox shroud
    const nvgMount = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.04), mats.tacticalBlack);
    nvgMount.position.set(0, 0.11, 0.145);
    head.add(nvgMount);

    const nvgTubes = new THREE.Group();
    nvgTubes.position.set(0, 0.08, 0.17);
    head.add(nvgTubes);

    for (let tube = -1.5; tube <= 1.5; tube += 1.0) {
      const tubeMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.08, 12), mats.tacticalBlack);
      tubeMesh.rotation.x = Math.PI / 2;
      tubeMesh.position.set(tube * 0.045, 0, 0.03);
      nvgTubes.add(tubeMesh);

      // Glowing night vision emerald front lens
      const lens = new THREE.Mesh(new THREE.CircleGeometry(0.019, 12), mats.nvgLens);
      lens.position.set(tube * 0.045, 0, 0.072);
      nvgTubes.add(lens);
    }

    // ARMS & HANDS
    // Left Arm (grips forward handguard / performs hand signal)
    const leftShoulder = new THREE.Group();
    leftShoulder.position.set(-0.25, 0.32, 0.0);
    torso.add(leftShoulder);

    const leftUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.28, 10), mats.camo);
    leftUpperArm.position.y = -0.14;
    leftShoulder.add(leftUpperArm);

    // Elbow Pad
    const leftElbow = new THREE.Group();
    leftElbow.position.y = -0.28;
    leftShoulder.add(leftElbow);

    const leftElbowPad = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), mats.tacticalBlack);
    leftElbow.add(leftElbowPad);

    const leftForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.26, 10), mats.camo);
    leftForearm.position.y = -0.13;
    leftElbow.add(leftForearm);

    // Left Hand (tactical glove)
    const leftHand = new THREE.Group();
    leftHand.position.y = -0.26;
    leftElbow.add(leftHand);

    const leftGlove = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.06), mats.tacticalBlack);
    leftHand.add(leftGlove);

    // Right Arm (holds pistol grip and triggers weapon)
    const rightShoulder = new THREE.Group();
    rightShoulder.position.set(0.25, 0.32, 0.0);
    torso.add(rightShoulder);

    const rightUpperArm = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.28, 10), mats.camo);
    rightUpperArm.position.y = -0.14;
    rightShoulder.add(rightUpperArm);

    const rightElbow = new THREE.Group();
    rightElbow.position.y = -0.28;
    rightShoulder.add(rightElbow);

    const rightElbowPad = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.09), mats.tacticalBlack);
    rightElbow.add(rightElbowPad);

    const rightForearm = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.052, 0.26, 10), mats.camo);
    rightForearm.position.y = -0.13;
    rightElbow.add(rightForearm);

    const rightHand = new THREE.Group();
    rightHand.position.y = -0.26;
    rightElbow.add(rightHand);

    const rightGlove = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.06), mats.tacticalBlack);
    rightHand.add(rightGlove);

    // LEGS & FEET
    // Left Leg
    const leftHip = new THREE.Group();
    leftHip.position.set(-0.12, -0.06, 0.0);
    pelvis.add(leftHip);

    const leftThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.42, 10), mats.camo);
    leftThigh.position.y = -0.21;
    leftHip.add(leftThigh);

    const leftKnee = new THREE.Group();
    leftKnee.position.y = -0.42;
    leftHip.add(leftKnee);

    // Crye AirFlex Knee Pad
    const leftKneePad = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.13, 0.08), mats.tacticalBlack);
    leftKneePad.position.set(0, 0, 0.05);
    leftKnee.add(leftKneePad);

    const leftShin = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.065, 0.40, 10), mats.camo);
    leftShin.position.y = -0.20;
    leftKnee.add(leftShin);

    const leftFoot = new THREE.Group();
    leftFoot.position.y = -0.40;
    leftKnee.add(leftFoot);

    // Heavy Assault Boot
    const leftBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.26), mats.tacticalBlack);
    leftBoot.position.set(0, -0.05, 0.06);
    leftFoot.add(leftBoot);

    // Right Leg
    const rightHip = new THREE.Group();
    rightHip.position.set(0.12, -0.06, 0.0);
    pelvis.add(rightHip);

    const rightThigh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.42, 10), mats.camo);
    rightThigh.position.y = -0.21;
    rightHip.add(rightThigh);

    const rightKnee = new THREE.Group();
    rightKnee.position.y = -0.42;
    rightHip.add(rightKnee);

    const rightKneePad = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.13, 0.08), mats.tacticalBlack);
    rightKneePad.position.set(0, 0, 0.05);
    rightKnee.add(rightKneePad);

    const rightShin = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.065, 0.40, 10), mats.camo);
    rightShin.position.y = -0.20;
    rightKnee.add(rightShin);

    const rightFoot = new THREE.Group();
    rightFoot.position.y = -0.40;
    rightKnee.add(rightFoot);

    const rightBoot = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.26), mats.tacticalBlack);
    rightBoot.position.set(0, -0.05, 0.06);
    rightFoot.add(rightBoot);

    // ATTACH WEAPON: Modern Assault Rifle (HK416 / MCX)
    const rifle = ModelBuilder.createAssaultRifle();
    // Attach weapon to right hand
    rightHand.add(rifle);
    rifle.position.set(-0.02, -0.04, 0.18);
    rifle.rotation.set(-1.45, 0.1, -0.05);

    // Store references for keyframed animation & VFX
    soldier.rig = {
      root,
      pelvis,
      torso,
      neck,
      head,
      leftShoulder,
      leftElbow,
      leftHand,
      rightShoulder,
      rightElbow,
      rightHand,
      leftHip,
      leftKnee,
      leftFoot,
      rightHip,
      rightKnee,
      rightFoot,
      rifle,
      muzzleFlash: rifle.muzzleFlash,
      muzzleLight: rifle.muzzleLight,
      laserLine: rifle.laserLine
    };

    return soldier;
  },

  // 2. High-Detail Assault Rifle Model (HK416 / M4 Tactical Carbine)
  createAssaultRifle: function() {
    const mats = this.initMaterials();
    const rifle = new THREE.Group();

    // Receiver & Stock
    const receiver = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.09, 0.28), mats.rifleBody);
    receiver.position.set(0, 0, 0);
    rifle.add(receiver);

    const stock = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.11, 0.22), mats.riflePolymer);
    stock.position.set(0, -0.01, -0.22);
    rifle.add(stock);

    const grip = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.12, 0.06), mats.riflePolymer);
    grip.position.set(0, -0.09, -0.05);
    grip.rotation.x = -0.3;
    rifle.add(grip);

    // Curved PMAG 30-round magazine
    const mag = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.18, 0.09), mats.riflePolymer);
    mag.position.set(0, -0.12, 0.08);
    mag.rotation.x = 0.25;
    rifle.add(mag);

    // Quad-Rail / M-LOK Handguard
    const handguard = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.075, 0.32), mats.rifleBody);
    handguard.position.set(0, 0.01, 0.28);
    rifle.add(handguard);

    // Vertical stubby foregrip under handguard
    const foregrip = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.10, 8), mats.riflePolymer);
    foregrip.position.set(0, -0.08, 0.28);
    rifle.add(foregrip);

    // Steel Barrel & Flash Hider
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.36, 8), mats.rifleBody);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.02, 0.52);
    rifle.add(barrel);

    const flashHider = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.018, 0.06, 8), mats.rifleBody);
    flashHider.rotation.x = Math.PI / 2;
    flashHider.position.set(0, 0.02, 0.71);
    rifle.add(flashHider);

    // EOTech Holographic Sight on top Picatinny rail
    const sightBase = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.06, 0.12), mats.tacticalBlack);
    sightBase.position.set(0, 0.07, 0.04);
    rifle.add(sightBase);

    // Glass Reticle Lens with glowing red reticle
    const reticlePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.04), mats.reticle);
    reticlePlane.position.set(0, 0.075, 0.05);
    rifle.add(reticlePlane);

    // PEQ-15 Tactical Laser Box
    const peq15 = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.035, 0.09), mats.riflePolymer);
    peq15.position.set(-0.035, 0.045, 0.30);
    rifle.add(peq15);

    // Subtle Red Aiming Laser Beam piercing the smoky dark
    const laserGeo = new THREE.CylinderGeometry(0.002, 0.008, 35, 6);
    laserGeo.translate(0, 17.5, 0);
    const laser = new THREE.Mesh(laserGeo, mats.laserBeam);
    laser.rotation.x = Math.PI / 2;
    laser.position.set(-0.035, 0.045, 0.35);
    rifle.add(laser);
    rifle.laserLine = laser;

    // Muzzle Flash Sprite (Cross planes)
    const flashGroup = new THREE.Group();
    flashGroup.position.set(0, 0.02, 0.74);
    rifle.add(flashGroup);

    const flashPlane1 = new THREE.Mesh(new THREE.PlaneGeometry(0.45, 0.45), mats.muzzleFlash);
    const flashPlane2 = flashPlane1.clone();
    flashPlane2.rotation.z = Math.PI / 2;
    flashGroup.add(flashPlane1);
    flashGroup.add(flashPlane2);
    flashGroup.scale.set(0, 0, 0); // hidden by default

    // Dynamic point light for muzzle flash
    const muzzleLight = new THREE.PointLight(0xffaa33, 0, 15);
    muzzleLight.position.set(0, 0.02, 0.75);
    rifle.add(muzzleLight);

    rifle.muzzleFlash = flashGroup;
    rifle.muzzleLight = muzzleLight;

    return rifle;
  },

  // 3. Wrecked Military Armored Personnel Carrier (BTR / Stryker style)
  createWreckedAPC: function() {
    const mats = this.initMaterials();
    const apc = new THREE.Group();

    // Angled Hull
    const hullLower = new THREE.Mesh(new THREE.BoxGeometry(3.0, 1.2, 7.2), mats.wreckMetal);
    hullLower.position.y = 1.1;
    apc.add(hullLower);

    const hullUpper = new THREE.Mesh(new THREE.BoxGeometry(2.7, 0.8, 6.4), mats.wreckMetal);
    hullUpper.position.set(0, 1.8, -0.2);
    apc.add(hullUpper);

    // 8 Heavy Combat Wheels (some deflated / tilted)
    const tireGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.45, 14);
    const wheelMat = mats.tacticalBlack;

    for (let side of [-1.55, 1.55]) {
      for (let z = -2.4; z <= 2.4; z += 1.6) {
        const wheel = new THREE.Mesh(tireGeo, wheelMat);
        wheel.rotation.z = Math.PI / 2;
        wheel.position.set(side, 0.55, z);
        if (z > 1.0 && side > 0) {
          wheel.rotation.x = 0.25; // flat / damaged wheel
          wheel.position.y = 0.42;
        }
        apc.add(wheel);
      }
    }

    // Blast damage & open hatch
    const turret = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 1.1, 0.6, 12), mats.wreckMetal);
    turret.position.set(0, 2.4, 0.5);
    apc.add(turret);

    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.2, 8), mats.rifleBody);
    barrel.rotation.x = 1.35;
    barrel.position.set(0, 2.5, 2.0);
    apc.add(barrel);

    // Smoldering Engine fire point light
    const fireLight = new THREE.PointLight(0xff6600, 2.8, 14);
    fireLight.position.set(0.5, 1.6, -1.8);
    apc.add(fireLight);
    apc.fireLight = fireLight;

    return apc;
  },

  // 4. Concrete Jersey Barrier (Cover)
  createJerseyBarrier: function() {
    const mats = this.initMaterials();
    const barrier = new THREE.Group();

    // Trapezoidal concrete barrier shape
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.4, 0.7), mats.concrete);
    base.position.y = 0.2;
    barrier.add(base);

    const top = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.7, 0.35), mats.concrete);
    top.position.y = 0.7;
    barrier.add(top);

    // Steel rebar loop on top
    const rebar = new THREE.Mesh(new THREE.TorusGeometry(0.08, 0.015, 6, 12, Math.PI), mats.tacticalBlack);
    rebar.position.set(-0.8, 1.05, 0);
    barrier.add(rebar);

    return barrier;
  },

  // 5. Fortified Sandbag Wall
  createSandbags: function() {
    const mats = this.initMaterials();
    const bagGroup = new THREE.Group();
    const bagGeo = new THREE.BoxGeometry(0.65, 0.22, 0.35);

    for (let row = 0; row < 4; row++) {
      const count = 4 - (row % 2);
      const offset = (row % 2) * 0.3;
      for (let i = 0; i < count; i++) {
        const bag = new THREE.Mesh(bagGeo, mats.camo);
        bag.position.set(-1.0 + i * 0.65 + offset, 0.11 + row * 0.21, (Math.random() - 0.5) * 0.05);
        bag.rotation.y = (Math.random() - 0.5) * 0.1;
        bagGroup.add(bag);
      }
    }
    return bagGroup;
  },

  // 6. Ruined Multi-Story Skyscraper / Apartment Block
  createRuinedBuilding: function(width = 16, height = 36, depth = 16, ruinedLeft = true) {
    const mats = this.initMaterials();
    const building = new THREE.Group();

    // Main structural concrete shell
    const shell = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mats.concrete);
    shell.position.y = height / 2;
    building.add(shell);

    // Window grid
    const floorHeight = 3.6;
    const floors = Math.floor(height / floorHeight);
    const winGeo = new THREE.PlaneGeometry(1.6, 2.0);

    for (let f = 1; f < floors; f++) {
      const y = f * floorHeight;
      for (let col = -width * 0.4; col <= width * 0.4; col += 3.2) {
        // Skip some shattered windows
        if (Math.random() > 0.4) {
          const win = new THREE.Mesh(winGeo, mats.windowGlass);
          win.position.set(col, y, depth * 0.505);
          building.add(win);
        }
      }
    }

    // Exposed rebar and collapsed top floor
    const rebarGeo = new THREE.CylinderGeometry(0.02, 0.02, 3.5, 4);
    for (let i = 0; i < 8; i++) {
      const rebar = new THREE.Mesh(rebarGeo, mats.tacticalBlack);
      rebar.position.set((Math.random() - 0.5) * width, height + Math.random() * 1.5, (Math.random() - 0.5) * depth);
      rebar.rotation.set((Math.random() - 0.5) * 0.5, 0, (Math.random() - 0.5) * 0.5);
      building.add(rebar);
    }

    // Interior red emergency light in broken room
    const emergLight = new THREE.PointLight(0xff1122, 1.2, 10);
    emergLight.position.set(width * 0.25, height * 0.35, depth * 0.35);
    building.add(emergLight);

    return building;
  },

  // 7. Military Gunship (Attack Helicopter: Apache / Comanche style)
  createAttackHelicopter: function() {
    const mats = this.initMaterials();
    const heli = new THREE.Group();

    // Fuselage
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 2.2, 9.5), mats.heliHull);
    body.position.y = 1.1;
    heli.add(body);

    // Angular cockpit canopy with reflective glass
    const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.2, 3.2, 4), mats.windowGlass);
    canopy.rotation.x = -Math.PI / 2;
    canopy.rotation.y = Math.PI / 4;
    canopy.position.set(0, 1.4, 4.2);
    heli.add(canopy);

    // Tail Boom & Vertical Fin
    const tail = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.7, 7.5), mats.heliHull);
    tail.position.set(0, 1.4, -6.5);
    heli.add(tail);

    const fin = new THREE.Mesh(new THREE.BoxGeometry(0.18, 1.8, 1.4), mats.heliHull);
    fin.position.set(0, 2.2, -10.0);
    heli.add(fin);

    // Weapon Stub Wings with Rocket Pods
    for (let side of [-1, 1]) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.15, 0.8), mats.heliHull);
      wing.position.set(side * 1.6, 1.1, 0.5);
      heli.add(wing);

      // Rocket launcher pod
      const pod = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 1.8, 10), mats.tacticalBlack);
      pod.rotation.x = Math.PI / 2;
      pod.position.set(side * 2.2, 0.85, 0.5);
      heli.add(pod);
    }

    // Main Rotor Mast & Spinning Blades
    const rotorHub = new THREE.Group();
    rotorHub.position.set(0, 2.35, 0.2);
    heli.add(rotorHub);

    // 4 Rotor Blades
    for (let i = 0; i < 4; i++) {
      const blade = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 7.0), mats.tacticalBlack);
      blade.rotation.y = (i * Math.PI) / 2;
      blade.position.set(0, 0.1, 0);
      rotorHub.add(blade);
    }

    // High-speed rotor motion blur disc
    const blurDisc = new THREE.Mesh(new THREE.CircleGeometry(7.2, 24), mats.heliRotorBlur);
    blurDisc.rotation.x = -Math.PI / 2;
    blurDisc.position.y = 0.12;
    rotorHub.add(blurDisc);

    heli.rotorHub = rotorHub;

    // Tail Rotor
    const tailRotor = new THREE.Group();
    tailRotor.position.set(0.18, 2.4, -10.0);
    for (let i = 0; i < 4; i++) {
      const tBlade = new THREE.Mesh(new THREE.BoxGeometry(0.12, 1.6, 0.02), mats.tacticalBlack);
      tBlade.rotation.z = (i * Math.PI) / 2;
      tailRotor.add(tBlade);
    }
    heli.add(tailRotor);
    heli.tailRotor = tailRotor;

    // Nose-mounted 30mm Chain Gun Turret
    const gunTurret = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), mats.tacticalBlack);
    gunTurret.position.set(0, 0.2, 4.2);
    heli.add(gunTurret);

    const gunBarrel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.6, 8), mats.rifleBody);
    gunBarrel.rotation.x = 1.35;
    gunBarrel.position.set(0, -0.2, 4.8);
    heli.add(gunBarrel);

    // High-Intensity Tactical Searchlight with Volumetric Light Cone
    const searchLight = new THREE.SpotLight(0xffffff, 8.0, 60, Math.PI / 6, 0.45, 1.2);
    searchLight.position.set(0, 0.2, 3.8);
    heli.add(searchLight);

    // Searchlight Target Object
    const lightTarget = new THREE.Object3D();
    lightTarget.position.set(0, -20, 15);
    heli.add(lightTarget);
    searchLight.target = lightTarget;
    heli.searchLight = searchLight;
    heli.lightTarget = lightTarget;

    // Translucent Volumetric Light Cone Mesh for God-Ray aesthetics
    const coneGeo = new THREE.ConeGeometry(5.5, 25, 16, 1, true);
    coneGeo.translate(0, -12.5, 0);
    coneGeo.rotateX(-Math.PI / 2.8);
    const coneMat = new THREE.MeshBasicMaterial({
      color: 0xe6f2ff,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const lightCone = new THREE.Mesh(coneGeo, coneMat);
    lightCone.position.set(0, 0.2, 3.8);
    heli.add(lightCone);
    heli.lightCone = lightCone;

    // Navigation Strobes (Red left, Green right, Strobe tail)
    const strobeGeo = new THREE.SphereGeometry(0.06, 6, 6);
    const redStrobe = new THREE.Mesh(strobeGeo, new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    redStrobe.position.set(-2.5, 1.1, 0.5);
    heli.add(redStrobe);

    const greenStrobe = new THREE.Mesh(strobeGeo, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
    greenStrobe.position.set(2.5, 1.1, 0.5);
    heli.add(greenStrobe);

    return heli;
  },

  // 8. Enemy Hostile Soldier (Target for Shooting Game)
  createEnemySoldier: function(id, pos) {
    const mats = this.initMaterials();
    const enemy = new THREE.Group();
    enemy.name = 'Enemy_' + id;
    enemy.position.copy(pos);

    enemy.userData = {
      id: id,
      isEnemy: true,
      health: 100,
      isDead: false,
      state: 'aiming',
      shootCooldown: 1.2 + Math.random() * 1.5,
      fireTimer: 0,
      peekTimer: Math.random() * 2.0,
      origY: pos.y
    };

    // Enemy Materials: Dark Urban Insurgent / Mercenary Gear
    const enemyGearMat = new THREE.MeshStandardMaterial({
      color: 0x1f2124,
      roughness: 0.75,
      metalness: 0.15
    });
    const enemyCamoMat = new THREE.MeshStandardMaterial({
      color: 0x363a35,
      roughness: 0.85,
      metalness: 0.05
    });
    const enemyRedMarkMat = new THREE.MeshBasicMaterial({
      color: 0xff1122
    });

    // Root node
    const root = new THREE.Group();
    enemy.add(root);

    // Pelvis
    const pelvis = new THREE.Group();
    pelvis.position.y = 0.95;
    root.add(pelvis);

    const pelvisMesh = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.18, 0.24), enemyCamoMat);
    pelvis.add(pelvisMesh);

    // Torso & Body Armor
    const torso = new THREE.Group();
    torso.position.y = 0.14;
    pelvis.add(torso);

    const vest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.38, 0.28), enemyGearMat);
    vest.position.y = 0.19;
    torso.add(vest);

    // Red tactical identifying armband / patch
    const patch = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.08, 0.1), enemyRedMarkMat);
    patch.position.set(-0.21, 0.26, 0.0);
    torso.add(patch);

    // Head
    const head = new THREE.Group();
    head.position.y = 0.50;
    torso.add(head);

    const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.125, 14, 14), mats.skinBalaclava);
    headMesh.scale.set(1.0, 1.2, 1.1);
    head.add(headMesh);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 14), enemyGearMat);
    helmet.scale.set(1.04, 1.04, 1.1);
    helmet.position.set(0, 0.04, 0);
    head.add(helmet);

    // Glowing red night combat goggles
    const goggle = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.04, 0.06), new THREE.MeshStandardMaterial({
      color: 0x330000,
      emissive: 0xff1100,
      emissiveIntensity: 0.8
    }));
    goggle.position.set(0, 0.02, 0.11);
    head.add(goggle);

    // Arms & Weapon
    const arms = new THREE.Group();
    arms.position.set(0, 0.3, 0.1);
    torso.add(arms);

    // Enemy Rifle (AK / Assault Carbine)
    const rifle = new THREE.Group();
    const rifleBody = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.65), mats.rifleBody);
    rifle.add(rifleBody);
    const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.4, 6), mats.rifleBody);
    barrel.rotation.x = Math.PI / 2;
    barrel.position.set(0, 0.01, 0.5);
    rifle.add(barrel);

    // Muzzle flash for enemy
    const enemyFlash = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.35), mats.muzzleFlash);
    enemyFlash.position.set(0, 0.01, 0.72);
    enemyFlash.scale.set(0, 0, 0);
    rifle.add(enemyFlash);

    const enemyLight = new THREE.PointLight(0xff4411, 0, 12);
    enemyLight.position.set(0, 0.01, 0.75);
    rifle.add(enemyLight);

    rifle.position.set(0.12, -0.05, 0.25);
    arms.add(rifle);

    // Legs
    const leftLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.85, 8), enemyCamoMat);
    leftLeg.position.set(-0.12, -0.48, 0);
    pelvis.add(leftLeg);

    const rightLeg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.065, 0.85, 8), enemyCamoMat);
    rightLeg.position.set(0.12, -0.48, 0);
    pelvis.add(rightLeg);

    // Raycast hit target meshes with reference to enemy
    const hitBox = new THREE.Mesh(
      new THREE.BoxGeometry(0.55, 1.7, 0.45),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    hitBox.position.y = 0.85;
    hitBox.userData = { parentEnemy: enemy, isBody: true };
    enemy.add(hitBox);

    const headHitBox = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 8, 8),
      new THREE.MeshBasicMaterial({ visible: false })
    );
    headHitBox.position.y = 1.62;
    headHitBox.userData = { parentEnemy: enemy, isHead: true };
    enemy.add(headHitBox);

    enemy.rig = {
      root,
      pelvis,
      torso,
      head,
      arms,
      rifle,
      enemyFlash,
      enemyLight,
      hitBoxes: [hitBox, headHitBox]
    };

    return enemy;
  },

  // 9. First-Person View Model (Arms & HK416 Assault Rifle for Playable FPS)
  createFPPArmsAndGun: function() {
    const mats = this.initMaterials();
    const fppGroup = new THREE.Group();
    fppGroup.name = 'FPP_Weapon_Rig';

    // Base gun model
    const rifle = ModelBuilder.createAssaultRifle();
    rifle.rotation.set(0, 0, 0);
    fppGroup.add(rifle);

    // Right Arm holding grip
    const rightArmGroup = new THREE.Group();
    const rightHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.12), mats.tacticalBlack);
    rightHandMesh.position.set(0, -0.08, -0.06);
    rightArmGroup.add(rightHandMesh);

    const rightForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.35, 8), mats.camo);
    rightForearmMesh.rotation.x = -Math.PI / 3.2;
    rightForearmMesh.position.set(0.04, -0.22, -0.2);
    rightArmGroup.add(rightForearmMesh);
    rifle.add(rightArmGroup);

    // Left Arm holding foregrip
    const leftArmGroup = new THREE.Group();
    const leftHandMesh = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.09, 0.09), mats.tacticalBlack);
    leftHandMesh.position.set(0, -0.08, 0.28);
    leftArmGroup.add(leftHandMesh);

    const leftForearmMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.38, 8), mats.camo);
    leftForearmMesh.rotation.set(-0.35, 0.4, -0.5);
    leftForearmMesh.position.set(-0.16, -0.22, 0.18);
    leftArmGroup.add(leftForearmMesh);
    rifle.add(leftArmGroup);

    fppGroup.rifle = rifle;
    fppGroup.muzzleFlash = rifle.muzzleFlash;
    fppGroup.muzzleLight = rifle.muzzleLight;

    return fppGroup;
  }
};

window.ModelBuilder = ModelBuilder;
