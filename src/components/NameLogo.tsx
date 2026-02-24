import React, { useRef } from "react";

export default function NameLogo() {
  const wrapRef = useRef<HTMLSpanElement | null>(null);

  const ripple = (clientX: number, clientY: number) => {
    const el = wrapRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // create ripple element
    const r = document.createElement("span");
    r.className = "logoRipple";
    r.style.left = `${x}px`;
    r.style.top = `${y}px`;
    el.appendChild(r);

    // cleanup after animation
    const remove = () => r.remove();
    r.addEventListener("animationend", remove, { once: true });
  };

  const onPointerDown = (e: React.PointerEvent) => {
    // only primary click for mouse
    if (e.pointerType === "mouse" && e.button !== 0) return;
    ripple(e.clientX, e.clientY);
  };

  return (
    <div className="fixed left-10 top-10 z-50 select-none">
      <span
        ref={wrapRef}
        className="logoFxApple"
        onPointerDown={onPointerDown}
        aria-label="Romi logo"
      >
        <span className="logoName">ROMI</span>
      </span>
    </div>
  );
}