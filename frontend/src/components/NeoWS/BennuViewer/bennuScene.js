import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

/**
 * Motor 3D da visualização orbital do asteroide 101955 Bennu.
 *
 * As distâncias e tamanhos são adaptados para visualização e não
 * representam uma escala proporcional entre os corpos celestes.
 */

const AU = 34;
const SUN_RADIUS = 3.6;
const EARTH_RADIUS = 0.95;
const BENNU_VISUAL_RADIUS = 1.5;

const BENNU_A = 1.126;
const BENNU_E = 0.2037;
const BENNU_INC = 6.03;
const BENNU_OMEGA = 66.22;
const BENNU_NODE = 2.06;
const BENNU_PERIOD_DAYS = 436.6;

const EARTH_PERIOD_DAYS = 365.25;
const ROTATION_PERIOD_HOURS = 4.297;
const ROTATION_SLOWDOWN = 8;
const OBLIQUITY_DEG = 178;

const DEFAULT_SPEED = 0.6;
const MAX_SPEED = 20;
const MAX_PIXEL_RATIO = 2;
const MAX_FRAME_DELTA = 0.05;
const STATE_EMIT_INTERVAL = 100;

function createNoise() {
  const permutation = new Uint8Array(512);
  const values = new Uint8Array(256);

  let seed = 1337;

  function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;

    let value = Math.imul(
      seed ^ (seed >>> 15),
      1 | seed
    );

    value =
      value +
        Math.imul(
          value ^ (value >>> 7),
          61 | value
        ) ^
      value;

    return (
      ((value ^ (value >>> 14)) >>> 0) /
      4294967296
    );
  }

  for (
    let index = 0;
    index < 256;
    index += 1
  ) {
    values[index] = index;
  }

  for (
    let index = 255;
    index > 0;
    index -= 1
  ) {
    const randomIndex = Math.floor(
      random() * (index + 1)
    );

    const temporaryValue =
      values[index];

    values[index] =
      values[randomIndex];

    values[randomIndex] =
      temporaryValue;
  }

  for (
    let index = 0;
    index < 512;
    index += 1
  ) {
    permutation[index] =
      values[index & 255];
  }

  function fade(value) {
    return (
      value *
      value *
      value *
      (value *
        (value * 6 - 15) +
        10)
    );
  }

  function lerp(
    start,
    end,
    amount
  ) {
    return (
      start +
      amount * (end - start)
    );
  }

  function gradient(
    hash,
    x,
    y,
    z
  ) {
    const normalizedHash =
      hash & 15;

    const first =
      normalizedHash < 8
        ? x
        : y;

    const second =
      normalizedHash < 4
        ? y
        : normalizedHash === 12 ||
            normalizedHash === 14
          ? x
          : z;

    return (
      ((normalizedHash & 1) === 0
        ? first
        : -first) +
      ((normalizedHash & 2) === 0
        ? second
        : -second)
    );
  }

  function noise3(x, y, z) {
    const floorX = Math.floor(x);
    const floorY = Math.floor(y);
    const floorZ = Math.floor(z);

    const gridX = floorX & 255;
    const gridY = floorY & 255;
    const gridZ = floorZ & 255;

    const localX = x - floorX;
    const localY = y - floorY;
    const localZ = z - floorZ;

    const fadeX = fade(localX);
    const fadeY = fade(localY);
    const fadeZ = fade(localZ);

    const first =
      permutation[gridX] +
      gridY;

    const firstFirst =
      permutation[first] +
      gridZ;

    const firstSecond =
      permutation[first + 1] +
      gridZ;

    const second =
      permutation[gridX + 1] +
      gridY;

    const secondFirst =
      permutation[second] +
      gridZ;

    const secondSecond =
      permutation[second + 1] +
      gridZ;

    return lerp(
      lerp(
        lerp(
          gradient(
            permutation[firstFirst],
            localX,
            localY,
            localZ
          ),
          gradient(
            permutation[secondFirst],
            localX - 1,
            localY,
            localZ
          ),
          fadeX
        ),
        lerp(
          gradient(
            permutation[firstSecond],
            localX,
            localY - 1,
            localZ
          ),
          gradient(
            permutation[secondSecond],
            localX - 1,
            localY - 1,
            localZ
          ),
          fadeX
        ),
        fadeY
      ),
      lerp(
        lerp(
          gradient(
            permutation[
              firstFirst + 1
            ],
            localX,
            localY,
            localZ - 1
          ),
          gradient(
            permutation[
              secondFirst + 1
            ],
            localX - 1,
            localY,
            localZ - 1
          ),
          fadeX
        ),
        lerp(
          gradient(
            permutation[
              firstSecond + 1
            ],
            localX,
            localY - 1,
            localZ - 1
          ),
          gradient(
            permutation[
              secondSecond + 1
            ],
            localX - 1,
            localY - 1,
            localZ - 1
          ),
          fadeX
        ),
        fadeY
      ),
      fadeZ
    );
  }

  function fbm(
    x,
    y,
    z,
    octaves
  ) {
    let total = 0;
    let amplitude = 1;
    let frequency = 1;
    let maximumAmplitude = 0;

    for (
      let index = 0;
      index < octaves;
      index += 1
    ) {
      total +=
        noise3(
          x * frequency,
          y * frequency,
          z * frequency
        ) * amplitude;

      maximumAmplitude +=
        amplitude;

      amplitude *= 0.5;
      frequency *= 2.05;
    }

    return total /
      maximumAmplitude;
  }

  return {
    noise3,
    fbm,
  };
}

function createGlowSprite(
  size,
  colorInner,
  colorOuter,
  opacity
) {
  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = 256;
  canvas.height = 256;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Não foi possível criar o brilho do Sol."
    );
  }

  const gradient =
    context.createRadialGradient(
      128,
      128,
      0,
      128,
      128,
      128
    );

  gradient.addColorStop(
    0,
    colorInner
  );

  gradient.addColorStop(
    0.4,
    colorOuter
  );

  gradient.addColorStop(
    1,
    "rgba(0,0,0,0)"
  );

  context.fillStyle =
    gradient;

  context.fillRect(
    0,
    0,
    256,
    256
  );

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  const material =
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      blending:
        THREE.AdditiveBlending,
      depthWrite: false,
      opacity,
    });

  const sprite =
    new THREE.Sprite(
      material
    );

  sprite.scale.set(
    size,
    size,
    1
  );

  return sprite;
}

function buildOrbitEllipsePoints(
  semiMajorAxis,
  eccentricity,
  inclinationDegrees,
  perihelionDegrees,
  nodeDegrees,
  segments
) {
  const inclination =
    THREE.MathUtils.degToRad(
      inclinationDegrees
    );

  const perihelion =
    THREE.MathUtils.degToRad(
      perihelionDegrees
    );

  const node =
    THREE.MathUtils.degToRad(
      nodeDegrees
    );

  const points = [];

  for (
    let index = 0;
    index <= segments;
    index += 1
  ) {
    const anomaly =
      (index / segments) *
      Math.PI *
      2;

    const radius =
      (semiMajorAxis *
        (1 -
          eccentricity *
            eccentricity)) /
      (1 +
        eccentricity *
          Math.cos(anomaly));

    const x =
      radius *
      Math.cos(anomaly);

    const y =
      radius *
      Math.sin(anomaly);

    const cosinePerihelion =
      Math.cos(perihelion);

    const sinePerihelion =
      Math.sin(perihelion);

    const rotatedX =
      x *
        cosinePerihelion -
      y *
        sinePerihelion;

    const rotatedY =
      x *
        sinePerihelion +
      y *
        cosinePerihelion;

    const cosineInclination =
      Math.cos(inclination);

    const sineInclination =
      Math.sin(inclination);

    const inclinedX =
      rotatedX;

    const inclinedZ =
      rotatedY *
      cosineInclination;

    const inclinedY =
      rotatedY *
      sineInclination;

    const cosineNode =
      Math.cos(node);

    const sineNode =
      Math.sin(node);

    const finalX =
      inclinedX *
        cosineNode -
      inclinedZ *
        sineNode;

    const finalZ =
      inclinedX *
        sineNode +
      inclinedZ *
        cosineNode;

    points.push(
      new THREE.Vector3(
        finalX * AU,
        inclinedY * AU,
        finalZ * AU
      )
    );
  }

  return points;
}

function setKeplerPosition(
  target,
  semiMajorAxis,
  eccentricity,
  inclinationDegrees,
  perihelionDegrees,
  nodeDegrees,
  meanAnomaly
) {
  let eccentricAnomaly =
    meanAnomaly;

  for (
    let index = 0;
    index < 8;
    index += 1
  ) {
    eccentricAnomaly -=
      (eccentricAnomaly -
        eccentricity *
          Math.sin(
            eccentricAnomaly
          ) -
        meanAnomaly) /
      (1 -
        eccentricity *
          Math.cos(
            eccentricAnomaly
          ));
  }

  const trueAnomaly =
    2 *
    Math.atan2(
      Math.sqrt(
        1 + eccentricity
      ) *
        Math.sin(
          eccentricAnomaly / 2
        ),
      Math.sqrt(
        1 - eccentricity
      ) *
        Math.cos(
          eccentricAnomaly / 2
        )
    );

  const radius =
    semiMajorAxis *
    (1 -
      eccentricity *
        Math.cos(
          eccentricAnomaly
        ));

  const x =
    radius *
    Math.cos(trueAnomaly);

  const y =
    radius *
    Math.sin(trueAnomaly);

  const inclination =
    THREE.MathUtils.degToRad(
      inclinationDegrees
    );

  const perihelion =
    THREE.MathUtils.degToRad(
      perihelionDegrees
    );

  const node =
    THREE.MathUtils.degToRad(
      nodeDegrees
    );

  const cosinePerihelion =
    Math.cos(perihelion);

  const sinePerihelion =
    Math.sin(perihelion);

  const rotatedX =
    x *
      cosinePerihelion -
    y *
      sinePerihelion;

  const rotatedY =
    x *
      sinePerihelion +
    y *
      cosinePerihelion;

  const cosineInclination =
    Math.cos(inclination);

  const sineInclination =
    Math.sin(inclination);

  const inclinedX =
    rotatedX;

  const inclinedZ =
    rotatedY *
    cosineInclination;

  const inclinedY =
    rotatedY *
    sineInclination;

  const cosineNode =
    Math.cos(node);

  const sineNode =
    Math.sin(node);

  const finalX =
    inclinedX *
      cosineNode -
    inclinedZ *
      sineNode;

  const finalZ =
    inclinedX *
      sineNode +
    inclinedZ *
      cosineNode;

  target.set(
    finalX * AU,
    inclinedY * AU,
    finalZ * AU
  );

  return target;
}

function buildBennuGeometry(
  radius,
  noiseGenerator
) {
  const geometry =
    new THREE.SphereGeometry(
      radius,
      96,
      72
    );

  const positions =
    geometry.attributes
      .position;

  const vertex =
    new THREE.Vector3();

  const normal =
    new THREE.Vector3();

  for (
    let index = 0;
    index < positions.count;
    index += 1
  ) {
    vertex.fromBufferAttribute(
      positions,
      index
    );

    normal
      .copy(vertex)
      .normalize();

    const latitude = Math.asin(
      THREE.MathUtils.clamp(
        normal.y,
        -1,
        1
      )
    );

    const equatorBulge =
      1 +
      0.3 *
        Math.cos(latitude) *
        Math.cos(latitude) -
      0.1;

    const poleTaper =
      1 -
      0.22 *
        Math.pow(
          Math.abs(
            Math.sin(latitude)
          ),
          1.6
        );

    const generalShape =
      equatorBulge *
      poleTaper;

    const largeNoise =
      noiseGenerator.fbm(
        normal.x * 1.1 + 5.2,
        normal.y * 1.1 + 1.3,
        normal.z * 1.1 + 8.7,
        3
      ) * 0.18;

    const boulders =
      noiseGenerator.fbm(
        normal.x * 4,
        normal.y * 4,
        normal.z * 4,
        4
      ) * 0.06;

    const fineNoise =
      noiseGenerator.fbm(
        normal.x * 14 + 3.1,
        normal.y * 14 + 7.4,
        normal.z * 14 + 2.2,
        3
      ) * 0.018;

    const craterField =
      noiseGenerator.noise3(
        normal.x * 6 + 11,
        normal.y * 6 + 22,
        normal.z * 6 + 33
      );

    const crater =
      craterField > 0.62
        ? -(
            craterField -
            0.62
          ) * 0.35
        : 0;

    const displacement =
      generalShape +
      largeNoise +
      boulders +
      fineNoise +
      crater;

    vertex.multiplyScalar(
      displacement
    );

    positions.setXYZ(
      index,
      vertex.x,
      vertex.y,
      vertex.z
    );
  }

  positions.needsUpdate = true;

  geometry.computeVertexNormals();
  geometry.computeBoundingSphere();

  return geometry;
}

function buildBennuTexture(
  noiseGenerator
) {
  const width = 768;
  const height = 384;

  const canvas =
    document.createElement(
      "canvas"
    );

  canvas.width = width;
  canvas.height = height;

  const context =
    canvas.getContext("2d");

  if (!context) {
    throw new Error(
      "Não foi possível criar a textura de Bennu."
    );
  }

  context.fillStyle =
    "#3a332c";

  context.fillRect(
    0,
    0,
    width,
    height
  );

  const imageData =
    context.getImageData(
      0,
      0,
      width,
      height
    );

  const pixels =
    imageData.data;

  for (
    let y = 0;
    y < height;
    y += 1
  ) {
    for (
      let x = 0;
      x < width;
      x += 1
    ) {
      const pixelIndex =
        (y * width + x) * 4;

      const noiseX =
        (x / width) * 8;

      const noiseY =
        (y / height) * 4;

      const noise =
        noiseGenerator.fbm(
          noiseX,
          noiseY,
          4.2,
          4
        );

      const shade =
        1 + noise * 0.35;

      pixels[pixelIndex] =
        Math.max(
          0,
          Math.min(
            255,
            pixels[pixelIndex] *
              shade
          )
        );

      pixels[pixelIndex + 1] =
        Math.max(
          0,
          Math.min(
            255,
            pixels[
              pixelIndex + 1
            ] * shade
          )
        );

      pixels[pixelIndex + 2] =
        Math.max(
          0,
          Math.min(
            255,
            pixels[
              pixelIndex + 2
            ] * shade
          )
        );
    }
  }

  context.putImageData(
    imageData,
    0,
    0
  );

  for (
    let index = 0;
    index < 110;
    index += 1
  ) {
    const x =
      Math.random() * width;

    const y =
      Math.random() * height;

    const radius =
      4 +
      Math.random() * 22;

    const gradient =
      context.createRadialGradient(
        x,
        y,
        0,
        x,
        y,
        radius
      );

    const isDark =
      Math.random() > 0.5;

    gradient.addColorStop(
      0,
      isDark
        ? "rgba(15,12,10,0.55)"
        : "rgba(80,70,58,0.35)"
    );

    gradient.addColorStop(
      1,
      "rgba(0,0,0,0)"
    );

    context.fillStyle =
      gradient;

    context.beginPath();

    context.arc(
      x,
      y,
      radius,
      0,
      Math.PI * 2
    );

    context.fill();
  }

  const texture =
    new THREE.CanvasTexture(
      canvas
    );

  texture.colorSpace =
    THREE.SRGBColorSpace;

  texture.wrapS =
    THREE.RepeatWrapping;

  texture.wrapT =
    THREE.ClampToEdgeWrapping;

  texture.needsUpdate = true;

  return texture;
}

function disposeMaterial(
  material
) {
  const textureProperties = [
    "map",
    "alphaMap",
    "aoMap",
    "bumpMap",
    "normalMap",
    "roughnessMap",
    "metalnessMap",
    "emissiveMap",
  ];

  textureProperties.forEach(
    (property) => {
      material[property]?.dispose?.();
    }
  );

  material.dispose?.();
}

export function createBennuScene(
  container,
  options = {}
) {
  if (
    !container ||
    typeof container.appendChild !==
      "function"
  ) {
    throw new Error(
      "O elemento da visualização 3D não é válido."
    );
  }

  if (
    typeof window === "undefined" ||
    typeof document === "undefined"
  ) {
    throw new Error(
      "A visualização 3D requer um navegador."
    );
  }

  const noiseGenerator =
    createNoise();

  const listeners =
    new Set();

  const initialSpeed =
    Number(
      options.initialSpeed
    );

  let daysPerSecond =
    Number.isFinite(
      initialSpeed
    )
      ? THREE.MathUtils.clamp(
          initialSpeed,
          0,
          MAX_SPEED
        )
      : DEFAULT_SPEED;

  let playing = true;
  let followBennu = true;
  let simulationDays = 0;
  let disposed = false;
  let pageVisible =
    !document.hidden;
  let animationFrameId = null;
  let resizeObserver = null;
  let lastStateEmitTime = 0;

  const scene =
    new THREE.Scene();

  const camera =
    new THREE.PerspectiveCamera(
      48,
      1,
      0.1,
      20000
    );

  let renderer;

  try {
    renderer =
      new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference:
          "high-performance",
      });
  } catch {
    throw new Error(
      "O navegador não conseguiu iniciar o WebGL."
    );
  }

  renderer.setPixelRatio(
    Math.min(
      window.devicePixelRatio || 1,
      MAX_PIXEL_RATIO
    )
  );

  renderer.outputColorSpace =
    THREE.SRGBColorSpace;

  renderer.toneMapping =
    THREE.ACESFilmicToneMapping;

  renderer.toneMappingExposure =
    1.15;

  renderer.domElement.setAttribute(
    "aria-hidden",
    "true"
  );

  container.appendChild(
    renderer.domElement
  );

  const controls =
    new OrbitControls(
      camera,
      renderer.domElement
    );

  controls.enableDamping = true;
  controls.dampingFactor = 0.07;
  controls.minDistance = 4;
  controls.maxDistance = 260;

  function resize() {
    if (disposed) {
      return;
    }

    const width =
      container.clientWidth;

    const height =
      container.clientHeight;

    if (
      width <= 0 ||
      height <= 0
    ) {
      return;
    }

    camera.aspect =
      width / height;

    camera.updateProjectionMatrix();

    renderer.setSize(
      width,
      height,
      false
    );
  }

  if (
    typeof ResizeObserver !==
    "undefined"
  ) {
    resizeObserver =
      new ResizeObserver(
        resize
      );

    resizeObserver.observe(
      container
    );
  } else {
    window.addEventListener(
      "resize",
      resize
    );
  }

  const starCount =
    window.matchMedia(
      "(max-width: 768px)"
    ).matches
      ? 2200
      : 4000;

  const starPositions =
    new Float32Array(
      starCount * 3
    );

  const starColors =
    new Float32Array(
      starCount * 3
    );

  const starPalette = [
    new THREE.Color(
      0xffffff
    ),
    new THREE.Color(
      0xcfe0ff
    ),
    new THREE.Color(
      0xfff2d6
    ),
    new THREE.Color(
      0xbcd8ff
    ),
  ];

  for (
    let index = 0;
    index < starCount;
    index += 1
  ) {
    const radius =
      500 +
      Math.random() * 1500;

    const theta =
      Math.random() *
      Math.PI *
      2;

    const phi =
      Math.acos(
        2 * Math.random() - 1
      );

    starPositions[index * 3] =
      radius *
      Math.sin(phi) *
      Math.cos(theta);

    starPositions[
      index * 3 + 1
    ] =
      radius *
      Math.cos(phi);

    starPositions[
      index * 3 + 2
    ] =
      radius *
      Math.sin(phi) *
      Math.sin(theta);

    const color =
      starPalette[
        Math.floor(
          Math.random() *
            starPalette.length
        )
      ];

    const brightness =
      0.5 +
      Math.random() * 0.5;

    starColors[index * 3] =
      color.r * brightness;

    starColors[
      index * 3 + 1
    ] =
      color.g * brightness;

    starColors[
      index * 3 + 2
    ] =
      color.b * brightness;
  }

  const starGeometry =
    new THREE.BufferGeometry();

  starGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      starPositions,
      3
    )
  );

  starGeometry.setAttribute(
    "color",
    new THREE.BufferAttribute(
      starColors,
      3
    )
  );

  const starMaterial =
    new THREE.PointsMaterial({
      size: 1.4,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      depthWrite: false,
    });

  scene.add(
    new THREE.Points(
      starGeometry,
      starMaterial
    )
  );

  const sunGroup =
    new THREE.Group();

  const sunMesh =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        SUN_RADIUS,
        48,
        48
      ),
      new THREE.MeshBasicMaterial({
        color: 0xfff2c0,
      })
    );

  sunGroup.add(sunMesh);

  sunGroup.add(
    createGlowSprite(
      SUN_RADIUS * 9,
      "rgba(255,244,214,0.95)",
      "rgba(255,190,90,0.45)",
      0.9
    )
  );

  sunGroup.add(
    createGlowSprite(
      SUN_RADIUS * 20,
      "rgba(255,210,140,0.5)",
      "rgba(255,150,60,0.12)",
      0.55
    )
  );

  scene.add(sunGroup);

  scene.add(
    new THREE.PointLight(
      0xfff2d6,
      3.4,
      0,
      1.6
    )
  );

  scene.add(
    new THREE.AmbientLight(
      0x1a2230,
      0.55
    )
  );

  const earthOrbitLine =
    new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        buildOrbitEllipsePoints(
          1,
          0.0167,
          0,
          0,
          0,
          200
        )
      ),
      new THREE.LineBasicMaterial({
        color: 0x4f8fdb,
        transparent: true,
        opacity: 0.55,
      })
    );

  scene.add(
    earthOrbitLine
  );

  const earthMesh =
    new THREE.Mesh(
      new THREE.SphereGeometry(
        EARTH_RADIUS,
        32,
        32
      ),
      new THREE.MeshStandardMaterial({
        color: 0x2f6fb0,
        emissive: 0x0a1a2a,
        roughness: 0.7,
        metalness: 0.05,
      })
    );

  scene.add(earthMesh);

  const bennuOrbitLine =
    new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(
        buildOrbitEllipsePoints(
          BENNU_A,
          BENNU_E,
          BENNU_INC,
          BENNU_OMEGA,
          BENNU_NODE,
          220
        )
      ),
      new THREE.LineBasicMaterial({
        color: 0xb08a5a,
        transparent: true,
        opacity: 0.7,
      })
    );

  scene.add(
    bennuOrbitLine
  );

  const bennuPositionGroup =
    new THREE.Group();

  scene.add(
    bennuPositionGroup
  );

  const bennuTiltPivot =
    new THREE.Group();

  bennuTiltPivot.rotation.z =
    THREE.MathUtils.degToRad(
      OBLIQUITY_DEG - 90
    );

  bennuPositionGroup.add(
    bennuTiltPivot
  );

  const bennuTexture =
    buildBennuTexture(
      noiseGenerator
    );

  const bennuMesh =
    new THREE.Mesh(
      buildBennuGeometry(
        BENNU_VISUAL_RADIUS,
        noiseGenerator
      ),
      new THREE.MeshStandardMaterial({
        map: bennuTexture,
        roughness: 0.97,
        metalness: 0,
      })
    );

  bennuTiltPivot.add(
    bennuMesh
  );

  const axisHelperGroup =
    new THREE.Group();

  const axisLength =
    BENNU_VISUAL_RADIUS *
    2.6;

  const axisMaterial =
    new THREE.MeshBasicMaterial({
      color: 0x0ea5e9,
      transparent: true,
      opacity: 0.75,
    });

  const axisMesh =
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        0.015,
        0.015,
        axisLength,
        8
      ),
      axisMaterial
    );

  axisHelperGroup.add(
    axisMesh
  );

  const coneTop =
    new THREE.Mesh(
      new THREE.ConeGeometry(
        0.07,
        0.22,
        8
      ),
      new THREE.MeshBasicMaterial({
        color: 0x0ea5e9,
      })
    );

  coneTop.position.y =
    axisLength / 2 + 0.11;

  axisHelperGroup.add(
    coneTop
  );

  bennuTiltPivot.add(
    axisHelperGroup
  );

  const earthPosition =
    new THREE.Vector3();

  const bennuPosition =
    new THREE.Vector3();

  const previousTarget =
    new THREE.Vector3();

  const targetDelta =
    new THREE.Vector3();

  const sceneCenter =
    new THREE.Vector3();

  setKeplerPosition(
    bennuPosition,
    BENNU_A,
    BENNU_E,
    BENNU_INC,
    BENNU_OMEGA,
    BENNU_NODE,
    0
  );

  controls.target.copy(
    bennuPosition
  );

  camera.position
    .copy(bennuPosition)
    .add(
      new THREE.Vector3(
        6,
        3,
        10
      )
    );

  resize();
  controls.update();

  const clock =
    new THREE.Clock();

  const rotationPeriodDays =
    ROTATION_PERIOD_HOURS /
    24;

  function emitState(
    timestamp,
    force = false
  ) {
    if (
      !force &&
      timestamp -
        lastStateEmitTime <
        STATE_EMIT_INTERVAL
    ) {
      return;
    }

    lastStateEmitTime =
      timestamp;

    const state = {
      simDays:
        simulationDays,

      elapsedYears:
        simulationDays /
        365.25,

      playing,
    };

    listeners.forEach(
      (callback) => {
        try {
          callback(state);
        } catch (error) {
          console.error(
            "Erro no listener da simulação de Bennu:",
            error
          );
        }
      }
    );
  }

  function renderFrame(
    timestamp
  ) {
    if (disposed) {
      return;
    }

    animationFrameId =
      window.requestAnimationFrame(
        renderFrame
      );

    if (!pageVisible) {
      clock.getDelta();
      return;
    }

    const deltaTime =
      Math.min(
        clock.getDelta(),
        MAX_FRAME_DELTA
      );

    if (playing) {
      simulationDays +=
        deltaTime *
        daysPerSecond;
    }

    const earthMeanAnomaly =
      ((simulationDays /
        EARTH_PERIOD_DAYS) *
        Math.PI *
        2) %
      (Math.PI * 2);

    setKeplerPosition(
      earthPosition,
      1,
      0.0167,
      0,
      0,
      0,
      earthMeanAnomaly
    );

    earthMesh.position.copy(
      earthPosition
    );

    if (playing) {
      earthMesh.rotation.y +=
        deltaTime *
        Math.PI *
        2;
    }

    const bennuMeanAnomaly =
      ((simulationDays /
        BENNU_PERIOD_DAYS) *
        Math.PI *
        2) %
      (Math.PI * 2);

    setKeplerPosition(
      bennuPosition,
      BENNU_A,
      BENNU_E,
      BENNU_INC,
      BENNU_OMEGA,
      BENNU_NODE,
      bennuMeanAnomaly
    );

    bennuPositionGroup.position.copy(
      bennuPosition
    );

    if (playing) {
      const simulationDaysThisFrame =
        deltaTime *
        daysPerSecond;

      const spinAngle =
        (simulationDaysThisFrame /
          (rotationPeriodDays *
            ROTATION_SLOWDOWN)) *
        Math.PI *
        2;

      bennuMesh.rotation.y +=
        spinAngle;
    }

    if (followBennu) {
      previousTarget.copy(
        controls.target
      );

      controls.target.lerp(
        bennuPosition,
        0.06
      );

      targetDelta
        .copy(controls.target)
        .sub(previousTarget);

      camera.position.add(
        targetDelta
      );
    } else {
      controls.target.lerp(
        sceneCenter,
        0.04
      );
    }

    controls.update();

    renderer.render(
      scene,
      camera
    );

    emitState(timestamp);
  }

  function handleVisibilityChange() {
    pageVisible =
      !document.hidden;

    clock.getDelta();

    if (pageVisible) {
      resize();
    }
  }

  document.addEventListener(
    "visibilitychange",
    handleVisibilityChange
  );

  animationFrameId =
    window.requestAnimationFrame(
      renderFrame
    );

  return {
    setPlaying(value) {
      playing = Boolean(value);

      emitState(
        performance.now(),
        true
      );
    },

    setSpeed(value) {
      const numericValue =
        Number(value);

      if (
        !Number.isFinite(
          numericValue
        )
      ) {
        return;
      }

      daysPerSecond =
        THREE.MathUtils.clamp(
          numericValue,
          0,
          MAX_SPEED
        );
    },

    setShowOrbits(value) {
      const visible =
        Boolean(value);

      earthOrbitLine.visible =
        visible;

      bennuOrbitLine.visible =
        visible;
    },

    setShowAxis(value) {
      axisHelperGroup.visible =
        Boolean(value);
    },

    setFollow(value) {
      followBennu =
        Boolean(value);
    },

    onUpdate(callback) {
      if (
        typeof callback !==
        "function"
      ) {
        return () => {};
      }

      listeners.add(
        callback
      );

      callback({
        simDays:
          simulationDays,

        elapsedYears:
          simulationDays /
          365.25,

        playing,
      });

      return () => {
        listeners.delete(
          callback
        );
      };
    },

    dispose() {
      if (disposed) {
        return;
      }

      disposed = true;

      if (
        animationFrameId !==
        null
      ) {
        window.cancelAnimationFrame(
          animationFrameId
        );
      }

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      if (resizeObserver) {
        resizeObserver.disconnect();
      } else {
        window.removeEventListener(
          "resize",
          resize
        );
      }

      listeners.clear();

      controls.dispose();

      scene.traverse(
        (object) => {
          object.geometry?.dispose?.();

          if (object.material) {
            const materials =
              Array.isArray(
                object.material
              )
                ? object.material
                : [
                    object.material,
                  ];

            materials.forEach(
              disposeMaterial
            );
          }
        }
      );

      renderer.renderLists?.dispose?.();
      renderer.dispose();

      renderer.forceContextLoss?.();

      if (
        renderer.domElement
          .parentNode ===
        container
      ) {
        container.removeChild(
          renderer.domElement
        );
      }

      scene.clear();
    },
  };
}