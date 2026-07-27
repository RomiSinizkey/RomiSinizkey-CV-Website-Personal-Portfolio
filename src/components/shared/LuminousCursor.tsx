import { useEffect, useRef, useState } from "react";
import "./styles/luminousCursor.css";

const INTERACTIVE_SELECTOR = [
  "a",
  "button",
  "[role='button']",
  "input",
  "textarea",
  "select",
  "summary",
  "label",
  "[data-cursor='interactive']",
].join(",");

function getTargetElement(target: EventTarget | null) {
  if (target instanceof HTMLElement) return target;
  if (target instanceof Text) return target.parentElement;
  return null;
}

export default function LuminousCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dotPosRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const interactiveRef = useRef(false);
  const pressedRef = useRef(false);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(pointer: fine) and (hover: hover)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => {
      setEnabled(media.matches && !motion.matches);
    };

    sync();
    media.addEventListener("change", sync);
    motion.addEventListener("change", sync);

    return () => {
      media.removeEventListener("change", sync);
      motion.removeEventListener("change", sync);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-luminous-cursor");
      return;
    }

    document.documentElement.classList.add("has-luminous-cursor");

    const root = rootRef.current;
    const dot = dotRef.current;

    if (!root || !dot) {
      return () => {
        document.documentElement.classList.remove("has-luminous-cursor");
      };
    }

    const updateClasses = () => {
      root.classList.toggle("is-visible", visibleRef.current);
      root.classList.toggle("is-active", interactiveRef.current);
      root.classList.toggle("is-pressed", pressedRef.current);
    };

    const findInteractiveElement = (target: EventTarget | null) => {
      const element = getTargetElement(target);
      if (!element) return null;
      return element.closest<HTMLElement>(INTERACTIVE_SELECTOR);
    };

    const LIGHTNESS_STEPS = [0, 50, 100];
    const HOLD_MS = 900;
    const CYCLE_MS = HOLD_MS * LIGHTNESS_STEPS.length;

    const animate = (time: number) => {
      dotPosRef.current.x += (pointerRef.current.x - dotPosRef.current.x) * 0.34;
      dotPosRef.current.y += (pointerRef.current.y - dotPosRef.current.y) * 0.34;

      dot.style.transform = `translate3d(${dotPosRef.current.x}px, ${dotPosRef.current.y}px, 0) translate(-50%, -50%)`;

      const stepIndex = Math.floor((time % CYCLE_MS) / HOLD_MS);
      dot.style.setProperty("--cursor-lightness", `${LIGHTNESS_STEPS[stepIndex]}%`);

      animationRef.current = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;

      if (!visibleRef.current) {
        dotPosRef.current = { x: event.clientX, y: event.clientY };
        dot.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      }

      visibleRef.current = true;

      const interactiveElement = findInteractiveElement(event.target);
      interactiveRef.current = Boolean(interactiveElement);
      updateClasses();
    };

    const onPointerLeave = () => {
      visibleRef.current = false;
      pressedRef.current = false;
      interactiveRef.current = false;
      updateClasses();
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      visibleRef.current = true;
      pressedRef.current = true;
      updateClasses();
    };

    const onPointerUp = () => {
      pressedRef.current = false;
      updateClasses();
    };

    const onWindowBlur = () => {
      visibleRef.current = false;
      pressedRef.current = false;
      interactiveRef.current = false;
      updateClasses();
    };

    animationRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onWindowBlur);

    return () => {
      if (animationRef.current !== null) {
        window.cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onWindowBlur);
      document.documentElement.classList.remove("has-luminous-cursor");
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div ref={rootRef} className="luminousCursorRoot" aria-hidden="true">
      <div ref={dotRef} className="luminousCursorDot" />
    </div>
  );
}
