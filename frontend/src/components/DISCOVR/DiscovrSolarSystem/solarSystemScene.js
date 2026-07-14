import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * solarSystemScene
 * ----------------
 * Motor 3D independente de framework para uma visualização orbital do
 * sistema solar, inspirada no jsorrery (https://mgvez.github.io/jsorrery/).
 * Recebe um elemento DOM (container) e devolve um controlador imperativo
 * { setPlaying, setSpeed, setShowOrbits, setFocus, onUpdate, dispose }
 * para ser pilotado por React — mesmo contrato do bennuScene.js.
 *
 * As distâncias reais entre o Sol e os planetas variam demasiado (0.39 UA
 * a 30 UA) para caberem, à escala linear, no mesmo enquadramento sem que
 * os planetas interiores fiquem ilegíveis. Por isso a posição orbital usa
 * uma escala comprimida (raiz quadrada da distância real em UA) — os
 * períodos orbitais mantêm-se proporcionais aos reais, só a distância
 * visual é que não está à escala (a mesma filosofia já usada no
 * BennuViewer, que também assume "escala não proporcional").
 */

const SCALE = 13; // unidades de cena por raiz quadrada de UA
function scaledDistance(au) {
  return Math.sqrt(au) * SCALE;
}

const SUN_RADIUS = 1.8;

const PLANETS = [
  {
    id: "mercury",
    name: "Mercúrio",
    au: 0.39,
    e: 0.2056,
    inc: 7.0,
    omega: 29.12,
    node: 48.33,
    periodDays: 87.97,
    radius: 0.32,
    color: 0x9c9c9c,
    spinSpeed: 1.0,
  },
  {
    id: "venus",
    name: "Vénus",
    au: 0.72,
    e: 0.0068,
    inc: 3.39,
    omega: 54.85,
    node: 76.68,
    periodDays: 224.7,
    radius: 0.55,
    color: 0xd9b382,
    spinSpeed: -0.5,
  },
  {
    id: "earth",
    name: "Terra",
    au: 1.0,
    e: 0.0167,
    inc: 0.0,
    omega: 102.94,
    node: 0,
    periodDays: 365.25,
    radius: 0.58,
    color: 0x2f6fb0,
    spinSpeed: 6.0,
  },
  {
    id: "mars",
    name: "Marte",
    au: 1.52,
    e: 0.0934,
    inc: 1.85,
    omega: 286.5,
    node: 49.56,
    periodDays: 686.98,
    radius: 0.42,
    color: 0xb1440e,
    spinSpeed: 5.8,
  },
  {
    id: "jupiter",
    name: "Júpiter",
    au: 5.2,
    e: 0.0489,
    inc: 1.3,
    omega: 273.87,
    node: 100.49,
    periodDays: 4332.59,
    radius: 1.9,
    color: 0xd8ae70,
    spinSpeed: 14.0,
  },
  {
    id: "saturn",
    name: "Saturno",
    au: 9.58,
    e: 0.0565,
    inc: 2.49,
    omega: 339.39,
    node: 113.66,
    periodDays: 10759.22,
    radius: 1.65,
    color: 0xe3c98a,
    spinSpeed: 13.0,
    hasRing: true,
  },
  {
    id: "uranus",
    name: "Urano",
    au: 19.2,
    e: 0.0457,
    inc: 0.77,
    omega: 96.999,
    node: 74.01,
    periodDays: 30688.5,
    radius: 1.05,
    color: 0x9fe3e3,
    spinSpeed: -8.0,
  },
  {
    id: "neptune",
    name: "Neptuno",
    au: 30.1,
    e: 0.0113,
    inc: 1.77,
    omega: 276.34,
    node: 131.78,
    periodDays: 60182,
    radius: 1.0,
    color: 0x3f5efb,
    spinSpeed: 8.5,
  },
];

/* ---- Mecânica de Kepler (adaptada de bennuScene.js: recebe o semi-eixo
   maior já em unidades de cena, em vez de UA + multiplicador global) ---- */
function buildOrbitEllipsePoints(aScaled, e, incDeg, omegaDeg, nodeDeg, segments) {
  const inc = THREE.MathUtils.degToRad(incDeg);
  const omega = THREE.MathUtils.degToRad(omegaDeg);
  const node = THREE.MathUtils.degToRad(nodeDeg);
  const pts = [];
  for (let i = 0; i <= segments; i++) {
    const nu = (i / segments) * Math.PI * 2;
    const r = (aScaled * (1 - e * e)) / (1 + e * Math.cos(nu));
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
    pts.push(new THREE.Vector3(xf, yi, zf));
  }
  return pts;
}

function keplerPosition(aScaled, e, incDeg, omegaDeg, nodeDeg, meanAnomalyRad) {
  let E = meanAnomalyRad;
  for (let i = 0; i < 8; i++) {
    E = E - (E - e * Math.sin(E) - meanAnomalyRad) / (1 - e * Math.cos(E));
  }
  const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2));
  const r = aScaled * (1 - e * Math.cos(E));
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
  return new THREE.Vector3(xf, yi, zf);
}

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

export function createSolarSystemScene(container, options = {}) {
  let daysPerSecond = options.initialSpeed ?? 12;
  let playing = true;
  let focusId = null;
  let simDays = 0;
  let disposed = false;

  const listeners = new Set();
  function emitState() {
    const state = { simDays, elapsedYears: simDays / 365.25, playing, focusId };
    listeners.forEach((cb) => cb(state));
  }

  /* ---- Scene / camera / renderer ---- */
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 5000);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.15;
  container.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 3;
  controls.maxDistance = 320;

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
  const sunGroup = new THREE.Group();
  const sunMesh = new THREE.Mesh(
    new THREE.SphereGeometry(SUN_RADIUS, 48, 48),
    new THREE.MeshBasicMaterial({ color: 0xfff2c0 })
  );
  sunGroup.add(sunMesh);
  sunGroup.add(makeGlowSprite(SUN_RADIUS * 4, "rgba(255,244,214,0.95)", "rgba(255,190,90,0.45)", 0.9));
  sunGroup.add(makeGlowSprite(SUN_RADIUS * 8, "rgba(255,210,140,0.5)", "rgba(255,150,60,0.12)", 0.55));
  scene.add(sunGroup);

  // decay=0: a luz não se atenua com a distância. Fisicamente incorreto,
  // mas necessário aqui — as órbitas vão de ~8 a ~70 unidades de cena, e
  // uma atenuação realista deixaria os planetas exteriores praticamente
  // pretos. É uma visualização decorativa, não à escala real de qualquer forma.
  const sunLight = new THREE.PointLight(0xfff2d6, 2.6, 0, 0);
  scene.add(sunLight);
  scene.add(new THREE.AmbientLight(0x333c52, 0.85));

  /* ---- Planetas ---- */
  const planets = PLANETS.map((meta) => {
    const aScaled = scaledDistance(meta.au);

    const orbitPts = buildOrbitEllipsePoints(aScaled, meta.e, meta.inc, meta.omega, meta.node, 220);
    const orbitLine = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(orbitPts),
      new THREE.LineBasicMaterial({ color: 0x4f7fb0, transparent: true, opacity: 0.35 })
    );
    scene.add(orbitLine);

    const positionGroup = new THREE.Group();
    scene.add(positionGroup);

    const mesh = new THREE.Mesh(
      new THREE.SphereGeometry(meta.radius, 32, 32),
      new THREE.MeshStandardMaterial({ color: meta.color, roughness: 0.75, metalness: 0.05 })
    );
    positionGroup.add(mesh);

    if (meta.hasRing) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(meta.radius * 1.4, meta.radius * 2.3, 64),
        new THREE.MeshBasicMaterial({
          color: 0xcdb98a,
          transparent: true,
          opacity: 0.55,
          side: THREE.DoubleSide,
        })
      );
      ring.rotation.x = Math.PI / 2 - THREE.MathUtils.degToRad(17);
      positionGroup.add(ring);
    }

    return { ...meta, aScaled, orbitLine, positionGroup, mesh };
  });

  /* ---- Câmara inicial: vista geral do sistema ---- */
  camera.position.set(0, 55, 120);
  controls.target.set(0, 0, 0);
  resize();
  controls.update();

  /* ---- Loop de animação ---- */
  const clock = new THREE.Clock();
  let rafId = null;

  function tick() {
    rafId = requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);

    if (playing) simDays += dt * daysPerSecond;

    let focusedPos = null;

    planets.forEach((planet) => {
      const meanAnomaly = ((simDays / planet.periodDays) * Math.PI * 2) % (Math.PI * 2);
      const pos = keplerPosition(planet.aScaled, planet.e, planet.inc, planet.omega, planet.node, meanAnomaly);
      planet.positionGroup.position.copy(pos);
      planet.mesh.rotation.y += dt * planet.spinSpeed;

      if (planet.id === focusId) {
        focusedPos = pos;
      }
    });

    if (focusedPos) {
      const prevTarget = controls.target.clone();
      controls.target.lerp(focusedPos, 0.06);
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
      planets.forEach((planet) => {
        planet.orbitLine.visible = value;
      });
    },
    setFocus(value) {
      focusId = value;
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

export { PLANETS };
