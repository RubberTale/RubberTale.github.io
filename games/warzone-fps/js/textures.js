// Procedural High-Resolution Textures for AAA Military FPS Scene

const TextureGenerator = {
  // 1. Crye Precision MultiCam Tactical Fabric Texture
  createCamoTexture: function(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base tone: Desert Khaki / Tan
    ctx.fillStyle = '#6e6752';
    ctx.fillRect(0, 0, size, size);

    // Layer 1: Olive Drab Blotches
    ctx.fillStyle = '#48523b';
    for (let i = 0; i < 35; i++) {
      ctx.beginPath();
      let x = Math.random() * size;
      let y = Math.random() * size;
      let r = 25 + Math.random() * 45;
      ctx.ellipse(x, y, r, r * (0.5 + Math.random() * 0.8), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 2: Deep Earth Brown Blobs
    ctx.fillStyle = '#3d3023';
    for (let i = 0; i < 28; i++) {
      ctx.beginPath();
      let x = Math.random() * size;
      let y = Math.random() * size;
      let r = 18 + Math.random() * 35;
      ctx.ellipse(x, y, r, r * (0.4 + Math.random() * 0.7), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 3: Dark Foliage Green
    ctx.fillStyle = '#2d3822';
    for (let i = 0; i < 30; i++) {
      ctx.beginPath();
      let x = Math.random() * size;
      let y = Math.random() * size;
      let r = 12 + Math.random() * 25;
      ctx.ellipse(x, y, r, r * 0.6, Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 4: Micro Disruptive Charcoal Splatters
    ctx.fillStyle = '#1c1b18';
    for (let i = 0; i < 80; i++) {
      ctx.beginPath();
      let x = Math.random() * size;
      let y = Math.random() * size;
      let r = 4 + Math.random() * 8;
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Layer 5: Ripstop Tactical Fabric Micro-Grid
    const imgData = ctx.getImageData(0, 0, size, size);
    const d = imgData.data;
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const idx = (y * size + x) * 4;
        const noise = (Math.random() - 0.5) * 16;
        const isGrid = (x % 4 === 0 || y % 4 === 0) ? -10 : 0;
        d[idx] = Math.min(255, Math.max(0, d[idx] + noise + isGrid));
        d[idx+1] = Math.min(255, Math.max(0, d[idx+1] + noise + isGrid));
        d[idx+2] = Math.min(255, Math.max(0, d[idx+2] + noise + isGrid));
      }
    }
    ctx.putImageData(imgData, 0, 0);

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 2. Asphalt Road with Battle Damage, Debris, and Wet Rain Puddles
  createAsphaltTexture: function(size = 1024) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base dark asphalt
    ctx.fillStyle = '#181a1d';
    ctx.fillRect(0, 0, size, size);

    // Aggregate grain noise
    const imgData = ctx.getImageData(0, 0, size, size);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 32;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i+1] = Math.min(255, Math.max(0, d[i+1] + n));
      d[i+2] = Math.min(255, Math.max(0, d[i+2] + n + 2)); // slightly cool
    }
    ctx.putImageData(imgData, 0, 0);

    // Road Markings (worn, chipped)
    // Double yellow center line
    ctx.fillStyle = 'rgba(215, 175, 55, 0.65)';
    ctx.fillRect(size * 0.485, 0, size * 0.012, size);
    ctx.fillRect(size * 0.503, 0, size * 0.012, size);

    // White dashed lane markers
    ctx.fillStyle = 'rgba(220, 220, 220, 0.6)';
    for (let y = 0; y < size; y += size * 0.12) {
      ctx.fillRect(size * 0.25, y, size * 0.015, size * 0.06);
      ctx.fillRect(size * 0.75, y, size * 0.015, size * 0.06);
    }

    // Weathering / asphalt cracks
    ctx.strokeStyle = '#0d0e10';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 16; i++) {
      ctx.beginPath();
      let sx = Math.random() * size;
      let sy = Math.random() * size;
      ctx.moveTo(sx, sy);
      for (let s = 0; s < 4; s++) {
        sx += (Math.random() - 0.5) * 80;
        sy += (Math.random() - 0.5) * 80;
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    // Blast scorch marks
    for (let i = 0; i < 6; i++) {
      let bx = Math.random() * size;
      let by = Math.random() * size;
      let br = 30 + Math.random() * 60;
      let grad = ctx.createRadialGradient(bx, by, 0, bx, by, br);
      grad.addColorStop(0, 'rgba(8, 8, 9, 0.9)');
      grad.addColorStop(0.7, 'rgba(15, 16, 18, 0.4)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // Asphalt Roughness Map (Mirror-like puddles vs rough gravel)
  createAsphaltRoughness: function(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Base rough asphalt (bright = rough)
    ctx.fillStyle = '#cccccc';
    ctx.fillRect(0, 0, size, size);

    // Wet reflective puddles (dark = smooth/glossy mirror)
    ctx.fillStyle = '#111111';
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      let px = Math.random() * size;
      let py = Math.random() * size;
      let pr = 20 + Math.random() * 55;
      ctx.ellipse(px, py, pr, pr * (0.4 + Math.random() * 0.6), Math.random() * Math.PI, 0, Math.PI * 2);
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 3. Damaged Concrete Wall & Barrier Texture
  createConcreteTexture: function(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#55585b';
    ctx.fillRect(0, 0, size, size);

    // Grain & concrete pores
    const imgData = ctx.getImageData(0, 0, size, size);
    const d = imgData.data;
    for (let i = 0; i < d.length; i += 4) {
      const n = (Math.random() - 0.5) * 40;
      d[i] = Math.min(255, Math.max(0, d[i] + n));
      d[i+1] = Math.min(255, Math.max(0, d[i+1] + n));
      d[i+2] = Math.min(255, Math.max(0, d[i+2] + n));
    }
    ctx.putImageData(imgData, 0, 0);

    // Bullet pockmarks
    for (let i = 0; i < 24; i++) {
      let x = Math.random() * size;
      let y = Math.random() * size;
      let r = 4 + Math.random() * 8;

      // Dark crater
      ctx.fillStyle = '#222324';
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // Pulverized light dust halo
      ctx.strokeStyle = '#999b9e';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(x, y, r + 2, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Soot streaks from fires
    for (let i = 0; i < 8; i++) {
      let sx = Math.random() * size;
      let sy = Math.random() * size * 0.4;
      let grad = ctx.createLinearGradient(sx, sy, sx, sy + 120);
      grad.addColorStop(0, 'rgba(15, 15, 15, 0.7)');
      grad.addColorStop(1, 'rgba(15, 15, 15, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(sx - 15, sy, 30, 120);
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    return tex;
  },

  // 4. Burnt Armored Vehicle Steel Texture
  createMetalArmorTexture: function(size = 512) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    // Dark military olive/gunmetal
    ctx.fillStyle = '#31342f';
    ctx.fillRect(0, 0, size, size);

    // Armor panel seams
    ctx.strokeStyle = '#181917';
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, size - 20, size - 20);
    ctx.strokeRect(size * 0.5, 10, size * 0.5 - 10, size - 20);

    // Rivet heads
    ctx.fillStyle = '#1e201c';
    for (let y = 30; y < size - 20; y += 40) {
      ctx.beginPath(); ctx.arc(20, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(size - 20, y, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(size * 0.5, y, 4, 0, Math.PI * 2); ctx.fill();
    }

    // Charred scorch marks & scratches
    ctx.strokeStyle = '#60655e';
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      ctx.beginPath();
      let sx = Math.random() * size;
      let sy = Math.random() * size;
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 35, sy + (Math.random() - 0.5) * 35);
      ctx.stroke();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 5. EOTech Holographic Weapon Sight Reticle (68-MOA Ring with 1-MOA Center Dot)
  createEOTechReticleTexture: function(size = 256) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const center = size / 2;
    const radius = size * 0.32;

    // Glowing red holographic lines
    ctx.strokeStyle = '#ff1a00';
    ctx.shadowColor = '#ff3300';
    ctx.shadowBlur = 12;
    ctx.lineWidth = 4;

    // Outer 68 MOA Circle
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, Math.PI * 2);
    ctx.stroke();

    // 4 Crosshair Tick Marks at 12, 3, 6, 9 o'clock
    const tickLen = 12;
    ctx.lineWidth = 3;
    // Top
    ctx.beginPath(); ctx.moveTo(center, center - radius - tickLen); ctx.lineTo(center, center - radius + 4); ctx.stroke();
    // Bottom
    ctx.beginPath(); ctx.moveTo(center, center + radius - 4); ctx.lineTo(center, center + radius + tickLen); ctx.stroke();
    // Left
    ctx.beginPath(); ctx.moveTo(center - radius - tickLen, center); ctx.lineTo(center - radius + 4, center); ctx.stroke();
    // Right
    ctx.beginPath(); ctx.moveTo(center + radius - 4, center); ctx.lineTo(center + radius + tickLen, center); ctx.stroke();

    // Center 1 MOA Precision Aiming Dot
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ff2200';
    ctx.shadowBlur = 16;
    ctx.beginPath();
    ctx.arc(center, center, 3.5, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 6. Volumetric Smoke Particle Sprite
  createSmokeParticleTexture: function(size = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const center = size / 2;
    const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
    grad.addColorStop(0, 'rgba(180, 180, 180, 0.85)');
    grad.addColorStop(0.35, 'rgba(120, 120, 120, 0.45)');
    grad.addColorStop(0.7, 'rgba(70, 70, 70, 0.15)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 7. Glowing Spark / Ember Particle
  createSparkParticleTexture: function(size = 64) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const center = size / 2;
    const grad = ctx.createRadialGradient(center, center, 0, center, center, center);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.2, 'rgba(255, 200, 60, 0.9)');
    grad.addColorStop(0.5, 'rgba(255, 80, 10, 0.5)');
    grad.addColorStop(1, 'rgba(255, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fill();

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  },

  // 8. Muzzle Flash Sprite
  createMuzzleFlashTexture: function(size = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    const center = size / 2;
    // Core glow
    const grad = ctx.createRadialGradient(center, center, 0, center, center, center * 0.75);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1.0)');
    grad.addColorStop(0.25, 'rgba(255, 220, 100, 0.9)');
    grad.addColorStop(0.6, 'rgba(255, 100, 20, 0.4)');
    grad.addColorStop(1, 'rgba(255, 30, 0, 0)');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(center, center, center * 0.75, 0, Math.PI * 2);
    ctx.fill();

    // 4-star fiery prongs
    ctx.fillStyle = 'rgba(255, 240, 180, 0.95)';
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 2) {
      ctx.save();
      ctx.translate(center, center);
      ctx.rotate(angle);
      ctx.beginPath();
      ctx.moveTo(-4, 0);
      ctx.lineTo(0, -center * 0.95);
      ctx.lineTo(4, 0);
      ctx.fill();
      ctx.restore();
    }

    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }
};

window.TextureGenerator = TextureGenerator;
