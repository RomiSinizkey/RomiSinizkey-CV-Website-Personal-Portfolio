import { useRef } from "react";

export default function NameLogo() {
  const ref = useRef<HTMLSpanElement | null>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;

    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;  // 0..1
    const py = (e.clientY - r.top) / r.height;  // 0..1

    const rx = (0.5 - py) * 18; // rotateX
    const ry = (px - 0.5) * 18; // rotateY

    el.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(2px)`;
  };

  const onLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = `perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
  };

  return (
    <div className="fixed left-10 top-10 z-50 select-none">
      <span ref={ref} className="logoName" onMouseMove={onMove} onMouseLeave={onLeave}>
        romi
      </span>
    </div>
  );
}
