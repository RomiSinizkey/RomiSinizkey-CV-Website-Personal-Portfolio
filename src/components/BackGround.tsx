import { useEffect, useRef } from "react";
import * as THREE from "three";

export default function MoltenCoreShader() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const timer = new THREE.Timer();
    timer.connect(document);

    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const vertexShader = `
      void main() {
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;
      uniform float theme;

      float random(vec2 st) {
        return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
      }

      float noise(vec2 st) {
        vec2 i = floor(st);
        vec2 f = fract(st);
        float a = random(i);
        float b = random(i + vec2(1.0, 0.0));
        float c = random(i + vec2(0.0, 1.0));
        float d = random(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.y * u.x;
      }

      float fbm(vec2 st) {
        float value = 0.0;
        float amplitude = 0.5;
        for (int i = 0; i < 6; i++) {
          value += amplitude * noise(st);
          st *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        uv.x *= iResolution.x / iResolution.y;

        float t = iTime * 0.2;
        vec2 motion = vec2(t * 0.5, t * 0.2);
        vec2 q = uv * 3.0;

        float n1 = fbm(q + motion);
        float n2 = fbm(q * 2.0 - motion);
        float combined_noise = n1 + n2 * 0.5;

        vec3 color1 = vec3(0.1, 0.0, 0.0);
        vec3 color2 = vec3(0.8, 0.2, 0.0);
        vec3 color3 = vec3(1.0, 0.5, 0.0);
        vec3 color4 = vec3(1.0, 0.9, 0.3);

        vec3 lava = mix(color1, color2, smoothstep(0.3, 0.45, combined_noise));
        lava = mix(lava, color3, smoothstep(0.5, 0.6, combined_noise));
        lava = mix(lava, color4, smoothstep(0.7, 0.75, combined_noise));

        float vignette = 1.0 - length(uv - 0.5) * 0.5;
        lava *= vignette;

        vec3 base = mix(vec3(1.0), vec3(0.0), theme);
        vec3 finalColor = mix(base, lava, 0.98);

        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    const uniforms = {
      iTime: { value: 0 },
      iResolution: { value: new THREE.Vector2() },
      theme: { value: prefersDark ? 1.0 : 0.0 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const onResize = () => {
      const { clientWidth, clientHeight } = container;
      renderer.setSize(clientWidth, clientHeight);
      uniforms.iResolution.value.set(clientWidth, clientHeight);
    };

    onResize();
    window.addEventListener("resize", onResize);

    let animationId = 0;

    const animate = (timestamp: number) => {
      timer.update(timestamp);
      uniforms.iTime.value = timer.getElapsed();
      renderer.render(scene, camera);
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", onResize);
      timer.dispose();
      scene.remove(mesh);
      geometry.dispose();
      material.dispose();
      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-label="Molten Core animated background"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}