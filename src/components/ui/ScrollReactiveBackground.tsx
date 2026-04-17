import { useEffect, useMemo, useRef, useState } from "react";

type Particle = {
  x: number;
  y: number;
  size: number;
  speed: number;
  drift: number;
  alpha: number;
};

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function mixColor(c1: [number, number, number], c2: [number, number, number], t: number) {
  return [
    Math.round(lerp(c1[0], c2[0], t)),
    Math.round(lerp(c1[1], c2[1], t)),
    Math.round(lerp(c1[2], c2[2], t)),
  ] as [number, number, number];
}

function rgb(color: [number, number, number], alpha = 1) {
  return `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${alpha})`;
}

export default function ScrollReactiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number>(0);
  const scrollTargetRef = useRef(0);
  const scrollSmoothRef = useRef(0);
  const timeRef = useRef(0);

  const [dimensions, setDimensions] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 1920,
    height: typeof window !== "undefined" ? window.innerHeight : 1080,
  });

  const particles = useMemo<Particle[]>(() => {
    const count = 70;
    return Array.from({ length: count }, () => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 2.2 + 0.6,
      speed: Math.random() * 0.0008 + 0.00015,
      drift: (Math.random() - 0.5) * 0.0006,
      alpha: Math.random() * 0.35 + 0.08,
    }));
  }, []);

  useEffect(() => {
    const onResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    const onScroll = () => {
      const maxScroll = Math.max(
        document.documentElement.scrollHeight - window.innerHeight,
        1
      );
      scrollTargetRef.current = clamp(window.scrollY / maxScroll, 0, 1);
    };

    onResize();
    onScroll();

    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      animationRef.current = requestAnimationFrame(render);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const width = dimensions.width;
      const height = dimensions.height;

      if (canvas.width !== Math.floor(width * dpr) || canvas.height !== Math.floor(height * dpr)) {
        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      }

      timeRef.current += 0.008;
      scrollSmoothRef.current += (scrollTargetRef.current - scrollSmoothRef.current) * 0.06;

      const progress = scrollSmoothRef.current;
      const t = timeRef.current;

      const topA = mixColor([8, 10, 30], [35, 10, 55], progress);
      const topB = mixColor([18, 30, 60], [0, 110, 145], progress);
      const bottomA = mixColor([0, 0, 0], [12, 8, 34], progress);

      ctx.clearRect(0, 0, width, height);

      const bgGradient = ctx.createLinearGradient(0, 0, 0, height);
      bgGradient.addColorStop(0, rgb(topA));
      bgGradient.addColorStop(0.45, rgb(topB));
      bgGradient.addColorStop(1, rgb(bottomA));
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, width, height);

      const orb1X = lerp(width * 0.22, width * 0.72, progress) + Math.sin(t * 1.4) * 35;
      const orb1Y = lerp(height * 0.22, height * 0.34, progress) + Math.cos(t * 1.1) * 24;
      const orb1R = lerp(220, 320, progress);

      const orb2X = lerp(width * 0.8, width * 0.28, progress) + Math.cos(t * 0.9) * 28;
      const orb2Y = lerp(height * 0.72, height * 0.62, progress) + Math.sin(t * 1.3) * 20;
      const orb2R = lerp(180, 280, progress);

      const orb3X = width * 0.5 + Math.sin(t * 0.7) * 60;
      const orb3Y = lerp(height * 0.12, height * 0.82, progress);
      const orb3R = lerp(120, 240, progress);

      const glow1 = ctx.createRadialGradient(orb1X, orb1Y, 0, orb1X, orb1Y, orb1R);
      glow1.addColorStop(0, rgb(mixColor([90, 120, 255], [0, 255, 210], progress), 0.28));
      glow1.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow1;
      ctx.fillRect(0, 0, width, height);

      const glow2 = ctx.createRadialGradient(orb2X, orb2Y, 0, orb2X, orb2Y, orb2R);
      glow2.addColorStop(0, rgb(mixColor([255, 60, 170], [140, 80, 255], progress), 0.18));
      glow2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow2;
      ctx.fillRect(0, 0, width, height);

      const glow3 = ctx.createRadialGradient(orb3X, orb3Y, 0, orb3X, orb3Y, orb3R);
      glow3.addColorStop(0, rgb(mixColor([120, 50, 255], [0, 210, 255], progress), 0.14));
      glow3.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = glow3;
      ctx.fillRect(0, 0, width, height);

      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i];
        const px =
          (p.x * width +
            Math.sin(t * (0.8 + p.speed * 8000) + i) * 16 +
            progress * width * 0.08) %
          width;

        const py =
          (p.y * height +
            ((t * 1000 * p.speed + progress * 220) % (height + 40)) +
            Math.cos(t * 1.1 + i) * 8) %
          height;

        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.arc(px, py, p.size + progress * 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      const vignette = ctx.createRadialGradient(
        width / 2,
        height / 2,
        Math.min(width, height) * 0.15,
        width / 2,
        height / 2,
        Math.max(width, height) * 0.7
      );
      vignette.addColorStop(0, "rgba(0,0,0,0)");
      vignette.addColorStop(1, `rgba(0,0,0,${lerp(0.18, 0.34, progress)})`);
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, width, height);

      const scanAlpha = lerp(0.02, 0.055, progress);
      for (let y = 0; y < height; y += 3) {
        ctx.fillStyle = `rgba(255,255,255,${scanAlpha * 0.12})`;
        ctx.fillRect(0, y, width, 1);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [dimensions, particles]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        display: "block",
        width: "100%",
        height: "100%",
      }}
    />
  );
}