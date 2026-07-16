import { useEffect, useRef } from "react";
import {
  Camera,
  Geometry,
  Mesh,
  Program,
  Renderer,
  Transform,
} from "ogl";

import "./GalaxyBackground.css";

const vertexShader = `
  attribute vec3 position;
  attribute float size;
  attribute float alpha;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;

  varying float vAlpha;

  void main() {
    vec3 animatedPosition = position;

    float angle = uTime * 0.04;
    float cosAngle = cos(angle);
    float sinAngle = sin(angle);

    animatedPosition.xy = mat2(
      cosAngle,
      -sinAngle,
      sinAngle,
      cosAngle
    ) * animatedPosition.xy;

    vec4 modelPosition =
      modelViewMatrix *
      vec4(animatedPosition, 1.0);

    gl_Position =
      projectionMatrix *
      modelPosition;

    gl_PointSize =
      size *
      (22.0 / max(-modelPosition.z, 0.1));

    vAlpha = alpha;
  }
`;

const fragmentShader = `
  precision highp float;

  uniform vec3 uColor;

  varying float vAlpha;

  void main() {
    vec2 centeredPoint =
      gl_PointCoord - vec2(0.5);

    float distanceFromCenter =
      length(centeredPoint);

    if (distanceFromCenter > 0.5) {
      discard;
    }

    float glow =
      1.0 -
      smoothstep(
        0.0,
        0.5,
        distanceFromCenter
      );

    gl_FragColor = vec4(
      uColor,
      glow * vAlpha
    );
  }
`;

function GalaxyBackground({
  className = "",
  density = 1200,
  speed = 0.35,
  interactive = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return undefined;
    }

    const reducedMotionQuery =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      );

    const renderer = new Renderer({
      alpha: true,
      antialias: true,
      dpr: Math.min(
        window.devicePixelRatio || 1,
        1.5
      ),
    });

    const gl = renderer.gl;
    const canvas = gl.canvas;

    canvas.setAttribute("aria-hidden", "true");
    canvas.setAttribute("tabindex", "-1");

    container.appendChild(canvas);

    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, {
      fov: 45,
      near: 0.1,
      far: 100,
    });

    camera.position.z = 8;

    const scene = new Transform();

    const positions =
      new Float32Array(density * 3);

    const sizes =
      new Float32Array(density);

    const alphas =
      new Float32Array(density);

    for (
      let index = 0;
      index < density;
      index += 1
    ) {
      const radius =
        Math.pow(Math.random(), 0.58) * 5.2;

      const arm =
        index % 4;

      const armOffset =
        arm *
        ((Math.PI * 2) / 4);

      const angle =
        armOffset +
        radius * 1.65 +
        (Math.random() - 0.5) * 0.75;

      const offset = index * 3;

      positions[offset] =
        Math.cos(angle) * radius;

      positions[offset + 1] =
        Math.sin(angle) *
        radius *
        0.58;

      positions[offset + 2] =
        (Math.random() - 0.5) * 2.4;

      sizes[index] =
        2.2 + Math.random() * 3.8;

      alphas[index] =
        0.35 + Math.random() * 0.65;
    }

    const geometry = new Geometry(gl, {
      position: {
        size: 3,
        data: positions,
      },

      size: {
        size: 1,
        data: sizes,
      },

      alpha: {
        size: 1,
        data: alphas,
      },
    });

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      uniforms: {
        uTime: {
          value: 0,
        },

        uColor: {
          value: [
            0.66,
            0.56,
            0.98,
          ],
        },
      },
    });

    const galaxy = new Mesh(gl, {
      mode: gl.POINTS,
      geometry,
      program,
    });

    galaxy.setParent(scene);

    let animationFrameId;
    let pointerX = 0;
    let pointerY = 0;

    function resize() {
      const width =
        container.offsetWidth ||
        window.innerWidth;

      const height =
        container.offsetHeight ||
        window.innerHeight;

      renderer.setSize(width, height);

      camera.perspective({
        aspect: width / Math.max(height, 1),
      });
    }

    function handlePointerMove(event) {
      if (
        !interactive ||
        reducedMotionQuery.matches
      ) {
        return;
      }

      const bounds =
        container.getBoundingClientRect();

      pointerX =
        ((event.clientX - bounds.left) /
          Math.max(bounds.width, 1) -
          0.5) *
        0.45;

      pointerY =
        ((event.clientY - bounds.top) /
          Math.max(bounds.height, 1) -
          0.5) *
        0.3;
    }

    function animate(time) {
      if (!reducedMotionQuery.matches) {
        program.uniforms.uTime.value =
          time *
          0.001 *
          speed;
      }

      galaxy.rotation.x +=
        (pointerY -
          galaxy.rotation.x) *
        0.025;

      galaxy.rotation.y +=
        (pointerX -
          galaxy.rotation.y) *
        0.025;

      renderer.render({
        scene,
        camera,
      });

      animationFrameId =
        window.requestAnimationFrame(
          animate
        );
    }

    resize();

    window.addEventListener(
      "resize",
      resize
    );

    container.addEventListener(
      "pointermove",
      handlePointerMove
    );

    animationFrameId =
      window.requestAnimationFrame(
        animate
      );

    return () => {
      window.cancelAnimationFrame(
        animationFrameId
      );

      window.removeEventListener(
        "resize",
        resize
      );

      container.removeEventListener(
        "pointermove",
        handlePointerMove
      );

      if (
        canvas.parentNode === container
      ) {
        container.removeChild(canvas);
      }

      gl
        .getExtension(
          "WEBGL_lose_context"
        )
        ?.loseContext();
    };
  }, [density, interactive, speed]);

  return (
    <div
      ref={containerRef}
      className={
        `galaxy-background ${className}`.trim()
      }
      aria-hidden="true"
    />
  );
}

export default GalaxyBackground;