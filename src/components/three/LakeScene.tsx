"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

/*
 * A quiet mountain lake at blue hour.
 *
 * The camera sits exactly at water level (y = 0). Every point at the
 * camera's height projects onto the horizon line no matter how the camera
 * pitches, so each ridge layer and its mirrored reflection meet the
 * waterline cleanly at any depth. The lake itself is a vertical,
 * semi-transparent quad that tints the reflections behind it.
 */

const CAMERA_Z = 14;
const WATER_Z = -2;
const MOON = new THREE.Vector3(9, 16.5, -58);

type RidgeSpec = {
  z: number;
  height: number;
  width: number;
  seed: number;
  top: string;
  haze: string;
  pines?: boolean;
};

const RIDGES: RidgeSpec[] = [
  { z: -46, height: 11, width: 170, seed: 3, top: "#8e98ba", haze: "#c9b4b6" },
  { z: -35, height: 8.4, width: 136, seed: 11, top: "#67739b", haze: "#a597a8" },
  { z: -25, height: 6, width: 104, seed: 23, top: "#454f70", haze: "#6e6a84" },
  { z: -15, height: 3.6, width: 74, seed: 37, top: "#2b3551", haze: "#3b4260" },
  { z: -8, height: 1.9, width: 52, seed: 51, top: "#151d2f", haze: "#1b2134", pines: true },
];

function rand(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function ridgeHeight(x: number, phases: number[]) {
  const n =
    0.5 +
    0.26 * Math.sin(x * 0.11 + phases[0]) +
    0.14 * Math.sin(x * 0.29 + phases[1]) +
    0.07 * Math.sin(x * 0.71 + phases[2]) +
    0.035 * Math.sin(x * 1.9 + phases[3]);
  // sharpen the peaks a little so they read as mountains, not hills
  return Math.max(0.12, Math.pow(Math.max(n, 0), 1.35));
}

function buildRidge(spec: RidgeSpec) {
  const r = rand(spec.seed);
  const phases = [r() * 6.28, r() * 6.28, r() * 6.28, r() * 6.28];
  const shape = new THREE.Shape();
  const half = spec.width / 2;
  const steps = 220;
  shape.moveTo(-half, 0);
  for (let i = 0; i <= steps; i++) {
    const x = -half + (spec.width * i) / steps;
    shape.lineTo(x, ridgeHeight(x, phases) * spec.height);
  }
  shape.lineTo(half, 0);
  shape.lineTo(-half, 0);

  const shapes = [shape];
  if (spec.pines) {
    // a loose band of pines along the near shore, kept clear of the centre
    const pr = rand(spec.seed + 99);
    for (let i = 0; i < 70; i++) {
      const side = pr() < 0.5 ? -1 : 1;
      const x = side * (3.5 + pr() * (half - 4));
      const base = ridgeHeight(x, phases) * spec.height * (0.25 + pr() * 0.35);
      const h = 0.9 + pr() * 1.6;
      const w = h * 0.32;
      const tree = new THREE.Shape();
      tree.moveTo(x - w, base * 0.2);
      tree.lineTo(x, base + h);
      tree.lineTo(x + w, base * 0.2);
      tree.lineTo(x - w, base * 0.2);
      shapes.push(tree);
    }
  }
  return new THREE.ShapeGeometry(shapes, 1);
}

const ridgeVertex = /* glsl */ `
  uniform float uTime;
  uniform float uMaxH;
  uniform float uReflect;
  varying float vH;
  void main() {
    vec3 p = position;
    vH = clamp(p.y / uMaxH, 0.0, 1.0);
    if (uReflect > 0.5) {
      // reflections shimmer sideways, more the further from the shore line
      float k = vH;
      p.x += sin(p.y * 4.0 + uTime * 1.1) * 0.06 * k + sin(p.y * 11.0 - uTime * 1.7) * 0.025 * k;
    }
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const ridgeFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uHaze;
  uniform float uReflect;
  varying float vH;
  void main() {
    vec3 col = mix(uHaze, uTop, smoothstep(0.0, 0.75, vH));
    float a = 1.0;
    if (uReflect > 0.5) {
      col *= 0.78;
      a = 0.62 * (1.0 - vH * 0.55);
    }
    gl_FragColor = vec4(col, a);
  }
`;

function Ridge({ spec, reflect }: { spec: RidgeSpec; reflect: boolean }) {
  const geometry = useMemo(() => buildRidge(spec), [spec]);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: ridgeVertex,
        fragmentShader: ridgeFragment,
        transparent: reflect,
        depthWrite: !reflect,
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uMaxH: { value: spec.height * 1.15 },
          uReflect: { value: reflect ? 1 : 0 },
          uTop: { value: new THREE.Color(spec.top) },
          uHaze: { value: new THREE.Color(spec.haze) },
        },
      }),
    [spec, reflect]
  );
  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt;
  });
  return (
    <mesh
      geometry={geometry}
      material={material}
      position={[0, 0, spec.z]}
      scale={[1, reflect ? -1 : 1, 1]}
      renderOrder={reflect ? 1 : 0}
    />
  );
}

const skyFragment = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    // symmetric around the horizon so the lake "reflects" the sky
    float y = abs(vWorld.y);
    vec3 horizon = vec3(0.85, 0.71, 0.66);
    vec3 mid = vec3(0.36, 0.39, 0.58);
    vec3 top = vec3(0.04, 0.08, 0.16);
    vec3 col = mix(horizon, mid, smoothstep(0.0, 9.0, y));
    col = mix(col, top, smoothstep(8.0, 34.0, y));
    gl_FragColor = vec4(col, 1.0);
  }
`;

const worldVertex = /* glsl */ `
  varying vec3 vWorld;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec4 w = modelMatrix * vec4(position, 1.0);
    vWorld = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }
`;

function Sky() {
  const material = useMemo(
    () => new THREE.ShaderMaterial({ vertexShader: worldVertex, fragmentShader: skyFragment, depthWrite: false }),
    []
  );
  return (
    <mesh position={[0, 0, -62]} material={material} renderOrder={-2}>
      <planeGeometry args={[420, 200]} />
    </mesh>
  );
}

function Moon() {
  const glow = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d")!;
    const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grad.addColorStop(0, "rgba(255,240,220,0.55)");
    grad.addColorStop(0.35, "rgba(255,226,200,0.16)");
    grad.addColorStop(1, "rgba(255,226,200,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  }, []);
  return (
    <group position={MOON.toArray()}>
      {/* glow sits just behind the disc so the two never z-fight */}
      <sprite scale={[16, 16, 1]} position={[0, 0, -0.6]} renderOrder={-1}>
        <spriteMaterial map={glow} transparent depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <mesh renderOrder={-1}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color="#f6ecdc" />
      </mesh>
    </group>
  );
}

const starVertex = /* glsl */ `
  attribute float aSeed;
  uniform float uTime;
  varying float vAlpha;
  void main() {
    vAlpha = 0.45 + 0.55 * sin(uTime * (0.6 + aSeed) + aSeed * 40.0);
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = (1.2 + aSeed * 1.8);
    gl_Position = projectionMatrix * mv;
  }
`;
const starFragment = /* glsl */ `
  varying float vAlpha;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    float a = smoothstep(0.5, 0.0, d) * vAlpha;
    gl_FragColor = vec4(0.92, 0.95, 1.0, a);
  }
`;

function Stars() {
  const { geometry, material } = useMemo(() => {
    const r = rand(7);
    const count = 520;
    const pos = new Float32Array(count * 3);
    const seed = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (r() - 0.5) * 220;
      pos[i * 3 + 1] = 12 + r() * 60;
      pos[i * 3 + 2] = -60;
      seed[i] = r();
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
    const m = new THREE.ShaderMaterial({
      vertexShader: starVertex,
      fragmentShader: starFragment,
      transparent: true,
      depthWrite: false,
      uniforms: { uTime: { value: 0 } },
    });
    return { geometry: g, material: m };
  }, []);
  useFrame((_, dt) => {
    material.uniforms.uTime.value += dt;
  });
  return <points geometry={geometry} material={material} renderOrder={-1} />;
}

const waterFragment = /* glsl */ `
  uniform float uTime;
  uniform float uMoonX;
  varying vec3 vWorld;
  varying vec2 vUv;
  float hash(float n) { return fract(sin(n) * 43758.5453); }
  void main() {
    float depth = clamp(-vWorld.y / 10.0, 0.0, 1.0);    // 0 at the waterline
    vec3 deep = vec3(0.035, 0.075, 0.115);
    float alpha = mix(0.28, 0.97, smoothstep(0.0, 0.85, depth));

    // fine horizontal ripples that drift slowly toward the viewer
    float band = vWorld.y * (26.0 - depth * 14.0) + uTime * 0.55;
    float lines = smoothstep(0.93, 1.0, sin(band + sin(vWorld.x * 0.35 + uTime * 0.3) * 0.7));

    // moon path: broken highlights below the moon, widening toward us
    float spread = 0.35 + depth * 2.6;
    float path = exp(-pow((vWorld.x - uMoonX) / spread, 2.0));
    float glint = smoothstep(0.55, 1.0, sin(band * 1.7 + hash(floor(vWorld.x * 3.0)) * 6.28));
    vec3 col = deep;
    col += vec3(0.98, 0.9, 0.78) * path * glint * (0.75 - depth * 0.45);
    col += vec3(0.55, 0.72, 0.78) * lines * 0.12 * (1.0 - depth);
    gl_FragColor = vec4(col, alpha);
  }
`;

function Water() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: worldVertex,
        fragmentShader: waterFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uMoonX: { value: 0 } },
      }),
    []
  );
  useFrame(({ camera }, dt) => {
    material.uniforms.uTime.value += dt;
    // where the line from the camera to the moon crosses the water quad
    const t = (camera.position.z - WATER_Z) / (camera.position.z - MOON.z);
    material.uniforms.uMoonX.value = camera.position.x + (MOON.x - camera.position.x) * t;
  });
  return (
    <mesh position={[0, -15, WATER_Z]} material={material} renderOrder={2}>
      <planeGeometry args={[120, 30]} />
    </mesh>
  );
}

const mistFragment = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  varying vec2 vUv;
  void main() {
    float bell = smoothstep(0.0, 0.5, vUv.y) * smoothstep(1.0, 0.45, vUv.y);
    float wisps = 0.55 + 0.45 * sin(vUv.x * 9.0 + uTime * 0.05) * sin(vUv.x * 23.0 - uTime * 0.08 + vUv.y * 3.0);
    float edge = smoothstep(0.0, 0.15, vUv.x) * smoothstep(1.0, 0.85, vUv.x);
    gl_FragColor = vec4(0.84, 0.88, 0.93, bell * wisps * edge * uOpacity);
  }
`;

function Mist({ z, y, opacity, speed }: { z: number; y: number; opacity: number; speed: number }) {
  const ref = useRef<THREE.Mesh>(null);
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: worldVertex,
        fragmentShader: mistFragment,
        transparent: true,
        depthWrite: false,
        uniforms: { uTime: { value: 0 }, uOpacity: { value: opacity } },
      }),
    [opacity]
  );
  useFrame((state, dt) => {
    material.uniforms.uTime.value += dt;
    if (ref.current) ref.current.position.x = Math.sin(state.clock.elapsedTime * speed) * 6;
  });
  return (
    <mesh ref={ref} position={[0, y, z]} material={material} renderOrder={3}>
      <planeGeometry args={[150, 5]} />
    </mesh>
  );
}

function CameraRig({ still }: { still: boolean }) {
  const { camera } = useThree();
  const pointer = useRef({ x: 0, y: 0 });
  useEffect(() => {
    if (still) return;
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [still]);
  useFrame((state) => {
    const drift = still ? 0 : Math.sin(state.clock.elapsedTime * 0.05) * 0.6;
    const tx = pointer.current.x * 1.1 + drift;
    camera.position.x += (tx - camera.position.x) * 0.025;
    camera.position.y = 0; // stay on the waterline (see note at top)
    camera.lookAt(camera.position.x * 0.35, 1.25 - pointer.current.y * 0.15, 0);
  });
  return null;
}

export default function LakeScene({ className }: { className?: string }) {
  const [still, setStill] = useState(false);
  const [ready, setReady] = useState(false);
  const [onScreen, setOnScreen] = useState(true);
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setStill(mq.matches);
    const on = () => setStill(mq.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // stop drawing once the hero has scrolled away — saves battery and keeps scrolling smooth
  useEffect(() => {
    if (!wrapRef.current) return;
    const io = new IntersectionObserver(([e]) => setOnScreen(e.isIntersecting), { rootMargin: "100px" });
    io.observe(wrapRef.current);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={wrapRef}
      className={className}
      aria-hidden="true"
      style={{ opacity: ready ? 1 : 0, transition: "opacity 1.6s ease" }}
    >
      <Canvas
        camera={{ position: [0, 0, CAMERA_Z], fov: 40, near: 0.1, far: 200 }}
        dpr={[1, 1.75]}
        frameloop={still ? "demand" : onScreen ? "always" : "never"}
        gl={{ antialias: true, powerPreference: "low-power" }}
        onCreated={() => setReady(true)}
      >
        <color attach="background" args={["#0b1622"]} />
        <Sky />
        <Stars />
        <Moon />
        {RIDGES.map((r) => (
          <Ridge key={`r${r.seed}`} spec={r} reflect={false} />
        ))}
        {RIDGES.map((r) => (
          <Ridge key={`m${r.seed}`} spec={r} reflect />
        ))}
        <Mist z={-30} y={1.4} opacity={0.22} speed={0.03} />
        <Mist z={-19} y={0.9} opacity={0.16} speed={0.045} />
        <Mist z={-10} y={0.4} opacity={0.12} speed={0.06} />
        <Water />
        <CameraRig still={still} />
      </Canvas>
    </div>
  );
}
