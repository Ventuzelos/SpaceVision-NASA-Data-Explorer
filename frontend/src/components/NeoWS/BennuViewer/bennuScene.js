import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * bennuScene
 * ----------
 * Motor 3D independente de framework para a visualização orbital do
 * asteroide 101955 Bennu. Recebe um elemento DOM (container) e devolve
 * um pequeno controlador { setPlaying, setSpeed, setShowOrbits,
 * setShowAxis, setFollow, dispose } para ser pilotado por React (ou
 * qualquer outra coisa).
 *
 * Toda a geometria/órbita é baseada nos elementos reais de Bennu, mas as
 * distâncias e tamanhos são escalados para ficarem visíveis na mesma cena
 * (não está à escala real — como no "Eyes on Asteroids" da NASA/JPL).
 */

/* ---- Ruído 3D (fBm) usado para deformar a superfície do asteroide ---- */
function createNoise() {
  const perm = new Uint8Array(512);
  const p = new Uint8Array(256);
  let seed = 1337;
  function rand() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const tmp = p[i];
    p[i] = p[j];
    p[j] = tmp;
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];

  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + t * (b - a);
  function grad(hash, x, y, z) {
    const h = hash & 15;
    const u = h < 8 ? x : y;
    const v = h < 4 ? y : h === 12 || h === 14 ? x : z;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }
  function noise3(x, y, z) {
    const X = Math.floor(x) & 255,
      Y = Math.floor(y) & 255,
      Z = Math.floor(z) & 255;
    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);
    const u = fade(x),
      v = fade(y),
      w = fade(z);
    const A = perm[X] + Y,
      AA = perm[A] + Z,
      AB = perm[A + 1] + Z;
    const B = perm[X + 1] + Y,
      BA = perm[B] + Z,
      BB = perm[B + 1] + Z;
    return lerp(
      lerp(
        lerp(grad(perm[AA], x, y, z), grad(perm[BA], x - 1, y, z), u),
        lerp(grad(perm[AB], x, y - 1, z), grad(perm[BB], x - 1, y - 1, z), u),
        v
      ),
      lerp(
        lerp(grad(perm[AA + 1], x, y, z - 1), grad(perm[BA + 1], x - 1, y, z - 1), u),
        lerp(grad(perm[AB + 1], x, y - 1, z - 1), grad(perm[BB + 1], x - 1, y - 1, z - 1), u),
        v
      ),
      w
    );
  }
  function fbm(x, y, z, octaves) {
    let total = 0,
      amp = 1,
      freq = 1,
      maxAmp = 0;
    for (let i = 0; i < octaves; i++) {
      total += noise3(x * freq, y * freq, z * freq) * amp;
      maxAmp += amp;
      amp *= 0.5;
      freq *= 2.05;
    }
    return total / maxAmp;
  }
  return { noise3, fbm };
}

/* ---- Constantes de escala e orbitais (valores reais de Bennu) ---- */
const AU = 34; // 1 UA -> unidades de cena (menor que o protótipo cheio, cabe num card)
const SUN_RADIUS = 3.6;
const EARTH_RADIUS = 0.95;
const BENNU_VISUAL_RADIUS = 1.5; // exagerado para visibilidade (real: ~245 m de raio)

const BENNU_A = 1.126; // semi-eixo maior (UA)
const BENNU_E = 0.2037; // excentricidade
const BENNU_INC = 6.03; // inclinação (graus)
const BENNU_OMEGA = 66.22; // argumento do periélio (aprox.)
const BENNU_NODE = 2.06; // longitude do nodo ascendente (aprox.)
const BENNU_PERIOD_DAYS = 436.6;
const EARTH_PERIOD_DAYS = 365.25;
const ROTATION_PERIOD_HOURS = 4.297; // rotação sideral real
const ROTATION_SLOWDOWN = 8; // suaviza o giro para leitura visual confortável
const OBLIQUITY_DEG = 178; // eixo quase invertido -> rotação retrógrada

export function createBennuScene(container, options = {}) {
  const NoiseGen = createNoise();

  let daysPerSecond = options.initialSpeed ?? 0.6;
  let playing = true;
  let followBennu = true;
  let simDays = 0;
  let disposed = false;

  const listeners = new Set();
  function emitState() {
    const state = {
      simDays,
      elapsedYears: simDays / 365.25,
      playing,
    };
    listeners.forEach((cb) => cb(state));
  }

  /* ---- Scene / camera / renderer ---- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 20000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 4;
  controls.maxDistance = 260;

  function resize() {
    const w = container.clientWidth;
    const h = container.clientHeight;
    if (w === 0 || h === 0) return;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(container);

  /* ---- Estrelas ---- */
  (function buildStarfield() {
    const starCount = 4000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    const palette = [
      new THREE.Color(0xffffff),
      new THREE.Color(0xcfe0ff),
      new THREE.Color(0xfff2d6),
      new THREE.Color(0xbcd8ff),
    ];
    for (let i = 0; i < starCount; i++) {
      const r = 500 + Math.random() * 1500;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi);
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      const c = palette[Math.floor(Math.random() * palette.length)];
      const b = 0.5 + Math.random() * 0.5;
      colors[i * 3] = c.r * b;
      colors[i * 3 + 1] = c.g * b;
      colors[i * 3 + 2] = c.b * b;
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    const mat = new THREE.PointsMaterial({
      size: 1.4,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });
    scene.add(new THREE.Points(geo, mat));
  })();

  /* ---- Sol ---- */
  function makeGlowSprite(size, colorInner, colorOuter, opacity) {
    const c = document.createElement("canvas");
    c.width = c.height = 256;
    const ctx = c.getContext("2d");
    const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, colorInner);
    grad.addColorStop(0.4, colorOuter);
    grad.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 256, 256);
    const tex = new THREE.CanvasTexture(c);
    const mat = new THREE.SpriteMaterial({
      map: tex,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity,
    });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(size, size, 1);
    return sprite;
  }

  const sunGroup = new THREE.Group();
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(SUN_RADIUS, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xfff2c0 })
  );
  sunGroup.add(sunMesh);
  sunGroup.add(makeGlowSprite(SUN_RADIUS * 9, "rgba(255,244,214,0.95)", "rgba(255,190,90,0.45)", 0.9));
  sunGroup.add(makeGlowSprite(SUN_RADIUS * 20, "rgba(255,210,140,0.5)", "rgba(255,150,60,0.12)", 0.55));
  scene.add(sunGroup);

  const sunLight = new THREE.PointLight(0xfff2d6, 3.4, 0, 1.6);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x1a2230, 0.55));

  /* ---- Órbitas (Kepler) ---- */
  function buildOrbitEllipsePoints(aAU, e, incDeg, omegaDeg, nodeDeg, segments) {
    const inc = THREE.MathUtils.degToRad(incDeg);
    const omega = THREE.MathUtils.degToRad(omegaDeg);
    const node = THREE.MathUtils.degToRad(nodeDeg);
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const nu = (i / segments) * Math.PI * 2;
      const r = (aAU * (1 - e * e)) / (1 + e * Math.cos(nu));
      const x = r * Math.cos(nu);
      const y = r * Math.sin(nu);
      const cosW = Math.cos(omega),
        sinW = Math.sin(omega);
      const xw = x * cosW - y * sinW;
      const yw = x * sinW + y * cosW;
      const cosI = Math.cos(inc),
        sinI = Math.sin(inc);
      const xi = xw;
      const zi = yw * cosI;
      const yi = yw * sinI;
      const cosN = Math.cos(node),
        sinN = Math.sin(node);
      const xf = xi * cosN - zi * sinN;
      const zf = xi * sinN + zi * cosN;
      pts.push(new THREE.Vector3(xf * AU, yi * AU, zf * AU));
    }
    return pts;
  }

  function keplerPosition(aAU, e, incDeg, omegaDeg, nodeDeg, meanAnomalyRad) {
    let E = meanAnomalyRad;
    for (let i = 0; i < 8; i++) {
      E = E - (E - e * Math.sin(E) - meanAnomalyRad) / (1 - e * Math.cos(E));
    }
    const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
    const r = aAU * (1 - e * Math.cos(E));
    const x = r * Math.cos(nu);
    const y = r * Math.sin(nu);
    const inc = THREE.MathUtils.degToRad(incDeg);
    const omega = THREE.MathUtils.degToRad(omegaDeg);
    const node = THREE.MathUtils.degToRad(nodeDeg);
    const cosW = Math.cos(omega),
      sinW = Math.sin(omega);
    const xw = x * cosW - y * sinW;
    const yw = x * sinW + y * cosW;
    const cosI = Math.cos(inc),
      sinI = Math.sin(inc);
    const xi = xw;
    const zi = yw * cosI;
    const yi = yw * sinI;
    const cosN = Math.cos(node),
      sinN = Math.sin(node);
    const xf = xi * cosN - zi * sinN;
    const zf = xi * sinN + zi * cosN;
    return new THREE.Vector3(xf * AU, yi * AU, zf * AU);
  }

  /* ---- Terra (referência de escala) ---- */
  const earthOrbitPts = buildOrbitEllipsePoints(1.0, 0.0167, 0, 0, 0, 200);
  const earthOrbitLine = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(earthOrbitPts),
    new THREE.LineBasicMaterial({ color: 0x4f8fdb, transparent: true, opacity: 0.55 })
  );
  scene.add(earthOrbitLine);

  const earthMesh = new THREE.Mesh(
    new THREE.SphereGeometry(EARTH_RADIUS, 32, 32),
    new THREE.MeshStandardMaterial({ color: 0x2f6fb0, emissive: 0x0a1a2a, roughness: 0.7, metalness: 0.05 })
  );
  scene.add(earthMesh);

  /* ---- Bennu: geometria deformada por ruído ---- */
  function buildBennuGeometry(radius) {
    const geo = new THREE.SphereGeometry(radius, 112, 84);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      const lat = Math.asin(THREE.MathUtils.clamp(n.y, -1, 1));
      const equatorBulge = 1.0 + 0.3 * Math.cos(lat) * Math.cos(lat) - 0.1;
      const poleTaper = 1.0 - 0.22 * Math.pow(Math.abs(Math.sin(lat)), 1.6);
      const topShape = equatorBulge * poleTaper;
      const large = NoiseGen.fbm(n.x * 1.1 + 5.2, n.y * 1.1 + 1.3, n.z * 1.1 + 8.7, 3) * 0.18;
      const boulders = NoiseGen.fbm(n.x * 4.0, n.y * 4.0, n.z * 4.0, 4) * 0.06;
      const fine = NoiseGen.fbm(n.x * 14.0 + 3.1, n.y * 14.0 + 7.4, n.z * 14.0 + 2.2, 3) * 0.018;
      const craterField = NoiseGen.noise3(n.x * 6.0 + 11, n.y * 6.0 + 22, n.z * 6.0 + 33);
      const crater = craterField > 0.62 ? -(craterField - 0.62) * 0.35 : 0;
      const displacement = topShape + large + boulders + fine + crater;
      v.multiplyScalar(displacement);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }

  function buildBennuTexture() {
    const size = 1024;
    const c = document.createElement("canvas");
    c.width = size;
    c.height = size / 2;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#3a332c";
    ctx.fillRect(0, 0, c.width, c.height);
    const imgData = ctx.getImageData(0, 0, c.width, c.height);
    const data = imgData.data;
    for (let y = 0; y < c.height; y++) {
      for (let x = 0; x < c.width; x++) {
        const idx = (y * c.width + x) * 4;
        const nx = (x / c.width) * 8,
          ny = (y / c.height) * 4;
        const n = NoiseGen.fbm(nx, ny, 4.2, 4);
        const shade = 1 + n * 0.35;
        data[idx] = Math.max(0, Math.min(255, data[idx] * shade));
        data[idx + 1] = Math.max(0, Math.min(255, data[idx + 1] * shade));
        data[idx + 2] = Math.max(0, Math.min(255, data[idx + 2] * shade));
      }
    }
    ctx.putImageData(imgData, 0, 0);
    for (let i = 0; i < 140; i++) {
      const x = Math.random() * c.width;
      const y = Math.random() * c.height;
      const r = 4 + Math.random() * 22;
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      const dark = Math.random() > 0.5;
      g.addColorStop(0, dark ? "rgba(15,12,10,0.55)" : "rgba(80,70,58,0.35)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    return tex;
  }

  const bennuOrbitPts = buildOrbitEllipsePoints(BENNU_A, BENNU_E, BENNU_INC, BENNU_OMEGA, BENNU_NODE, 220);
  const bennuOrbitLine = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(bennuOrbitPts),
    new THREE.LineBasicMaterial({ color: 0xb08a5a, transparent: true, opacity: 0.7 })
  );
  scene.add(bennuOrbitLine);

  const bennuPositionGroup = new THREE.Group();
  scene.add(bennuPositionGroup);

  const bennuTiltPivot = new THREE.Group();
  bennuTiltPivot.rotation.z = THREE.MathUtils.degToRad(OBLIQUITY_DEG - 90);
  bennuPositionGroup.add(bennuTiltPivot);

  const bennuMesh = new THREE.Mesh(
    buildBennuGeometry(BENNU_VISUAL_RADIUS),
    new THREE.MeshStandardMaterial({
      map: buildBennuTexture(),
      roughness: 0.97,
      metalness: 0.0,
    })
  );
  bennuTiltPivot.add(bennuMesh);

  const axisHelperGroup = new THREE.Group();
  const axisLen = BENNU_VISUAL_RADIUS * 2.6;
  const axisMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, axisLen, 8),
    new THREE.MeshBasicMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.75 })
  );
  axisHelperGroup.add(axisMesh);
  const coneTop = new THREE.Mesh(
    new THREE.ConeGeometry(0.07, 0.22, 8),
    new THREE.MeshBasicMaterial({ color: 0x0ea5e9 })
  );
  coneTop.position.y = axisLen / 2 + 0.11;
  axisHelperGroup.add(coneTop);
  bennuTiltPivot.add(axisHelperGroup);

  /* ---- Câmara inicial: já enquadrada no Bennu ---- */
  const initialBennuPos = keplerPosition(BENNU_A, BENNU_E, BENNU_INC, BENNU_OMEGA, BENNU_NODE, 0);
  controls.target.copy(initialBennuPos);
  camera.position.copy(initialBennuPos).add(new THREE.Vector3(6, 3, 10));
  resize();
  controls.update();

  /* ---- Loop de animação ---- */
  const clock = new THREE.Clock();
  const rotationPeriodDaysEq = ROTATION_PERIOD_HOURS / 24;
  let rafId = null;

  function tick() {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (playing) simDays += dt * daysPerSecond;

    const earthM = ((simDays / EARTH_PERIOD_DAYS) * Math.PI * 2) % (Math.PI * 2);
    const earthPos = keplerPosition(1.0, 0.0167, 0, 0, 0, earthM);
    earthMesh.position.copy(earthPos);
    earthMesh.rotation.y += dt * Math.PI * 2;

    const bennuM = ((simDays / BENNU_PERIOD_DAYS) * Math.PI * 2) % (Math.PI * 2);
    const bennuPos = keplerPosition(BENNU_A, BENNU_E, BENNU_INC, BENNU_OMEGA, BENNU_NODE, bennuM);
    bennuPositionGroup.position.copy(bennuPos);

    const simDaysThisFrame = playing ? dt * daysPerSecond : 0;
    const spinAngle = (simDaysThisFrame / (rotationPeriodDaysEq * ROTATION_SLOWDOWN)) * Math.PI * 2;
    bennuMesh.rotation.y += spinAngle;

    if (followBennu) {
      const prevTarget = controls.target.clone();
      controls.target.lerp(bennuPos, 0.06);
      const delta = controls.target.clone().sub(prevTarget);
      camera.position.add(delta);
    } else {
      controls.target.lerp(new THREE.Vector3(0, 0, 0), 0.04);
    }

    controls.update();
    renderer.render(scene, camera);
    emitState();
  }
  tick();

  return {
    setPlaying(value) {
      playing = value;
    },
    setSpeed(value) {
      daysPerSecond = value;
    },
    setShowOrbits(value) {
      earthOrbitLine.visible = value;
      bennuOrbitLine.visible = value;
    },
    setShowAxis(value) {
      axisHelperGroup.visible = value;
    },
    setFollow(value) {
      followBennu = value;
    },
    onUpdate(cb) {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    dispose() {
      if (disposed) return;
      disposed = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      controls.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const materials = Array.isArray(obj.material) ? obj.material : [obj.material];
          materials.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    },
  };
}
