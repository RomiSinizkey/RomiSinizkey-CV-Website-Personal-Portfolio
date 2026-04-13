import { useEffect, useRef, useState } from "react";
import "../../styles/shared/luminousCursor.css";

const DEFAULT_CURSOR_COLOR = "#ffffff";
const FILLED_CURSOR_SELECTOR = "[data-cursor-fill='solid']";
const LABEL_SELECTOR = "[data-cursor-label]";
const GLOW_DOT_SELECTOR = "[data-cursor-mode='glow-dot']";
const MAGNIFY_SELECTOR = "[data-cursor-mode='magnify']";
const LABEL_SUPPRESS_SELECTOR = "[data-cursor-mode='suppress-label']";
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

function resolveCursorColor(element: HTMLElement | null) {
  let current: HTMLElement | null = element;

  while (current) {
    const styles = window.getComputedStyle(current);
    const cssVarColor = styles.getPropertyValue("--cursor-color").trim() || styles.getPropertyValue("--i").trim();

    if (cssVarColor) {
      return cssVarColor;
    }

    current = current.parentElement;
  }

  return DEFAULT_CURSOR_COLOR;
}

export default function LuminousCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const dotPosRef = useRef({ x: 0, y: 0 });
  const ringPosRef = useRef({ x: 0, y: 0 });
  const visibleRef = useRef(false);
  const interactiveRef = useRef(false);
  const filledRef = useRef(false);
  const labeledRef = useRef(false);
  const glowDotRef = useRef(false);
  const magnifyRef = useRef(false);
  const pressedRef = useRef(false);
  const colorRef = useRef(DEFAULT_CURSOR_COLOR);
  const labelTextRef = useRef("");
  const mutedLabelRef = useRef(false);
  const darkLabelRef = useRef(false);
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
    const ring = ringRef.current;
    const label = labelRef.current;

    if (!root || !dot || !ring || !label) {
      return () => {
        document.documentElement.classList.remove("has-luminous-cursor");
      };
    }

    const updateClasses = () => {
      root.classList.toggle("is-visible", visibleRef.current);
      root.classList.toggle("is-active", interactiveRef.current);
      root.classList.toggle("is-filled", filledRef.current);
      root.classList.toggle("is-labeled", labeledRef.current);
      root.classList.toggle("is-glow-dot", glowDotRef.current);
      root.classList.toggle("is-magnify", magnifyRef.current);
      root.classList.toggle("is-label-muted", mutedLabelRef.current);
      root.classList.toggle("is-label-dark", darkLabelRef.current);
      root.classList.toggle("is-pressed", pressedRef.current);
      root.style.setProperty("--cursor-accent", colorRef.current);
      label.textContent = labelTextRef.current;
    };

    const findInteractiveElement = (target: EventTarget | null) => {
      const element = getTargetElement(target);
      if (!element) return null;
      return element.closest<HTMLElement>(INTERACTIVE_SELECTOR);
    };

    const findFilledElement = (target: EventTarget | null) => {
      const element = getTargetElement(target);
      if (!element) return null;
      return element.closest<HTMLElement>(FILLED_CURSOR_SELECTOR);
    };

    const findLabeledElement = (target: EventTarget | null) => {
      const element = getTargetElement(target);
      if (!element) return null;
      return element.closest<HTMLElement>(LABEL_SELECTOR);
    };

    const findGlowDotElement = (target: EventTarget | null) => {
      const element = getTargetElement(target);
      if (!element) return null;
      return element.closest<HTMLElement>(GLOW_DOT_SELECTOR);
    };

    const findMagnifyElement = (target: EventTarget | null) => {
      const element = getTargetElement(target);
      if (!element) return null;
      return element.closest<HTMLElement>(MAGNIFY_SELECTOR);
    };

    const findSuppressLabelElement = (target: EventTarget | null) => {
      const element = getTargetElement(target);
      if (!element) return null;
      return element.closest<HTMLElement>(LABEL_SUPPRESS_SELECTOR);
    };

    const animate = () => {
      dotPosRef.current.x += (pointerRef.current.x - dotPosRef.current.x) * 0.34;
      dotPosRef.current.y += (pointerRef.current.y - dotPosRef.current.y) * 0.34;
      ringPosRef.current.x += (pointerRef.current.x - ringPosRef.current.x) * 0.16;
      ringPosRef.current.y += (pointerRef.current.y - ringPosRef.current.y) * 0.16;

      dot.style.transform = `translate3d(${dotPosRef.current.x}px, ${dotPosRef.current.y}px, 0) translate(-50%, -50%)`;
      ring.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%)`;
      label.style.transform = `translate3d(${ringPosRef.current.x}px, ${ringPosRef.current.y}px, 0) translate(-50%, -50%)`;

      updateClasses();
      animationRef.current = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;

      if (!visibleRef.current) {
        dotPosRef.current = { x: event.clientX, y: event.clientY };
        ringPosRef.current = { x: event.clientX, y: event.clientY };
      }

      visibleRef.current = true;

      const interactiveElement = findInteractiveElement(event.target);
      const filledElement = findFilledElement(event.target);
      const labeledElement = findLabeledElement(event.target);
      const glowDotElement = findGlowDotElement(event.target);
      const magnifyElement = findMagnifyElement(event.target);
      const suppressLabelElement = findSuppressLabelElement(event.target);
      const hasGlowDot = Boolean(glowDotElement);
      const hasMagnify = Boolean(magnifyElement);
      const hasSuppressedLabel = Boolean(suppressLabelElement);
      interactiveRef.current = Boolean(interactiveElement);
      filledRef.current = Boolean(filledElement);
      glowDotRef.current = hasGlowDot;
      magnifyRef.current = hasMagnify;
      labeledRef.current = Boolean(labeledElement) && !hasGlowDot && !hasMagnify && !hasSuppressedLabel;
      colorRef.current = resolveCursorColor(glowDotElement ?? magnifyElement ?? filledElement ?? interactiveElement);
      labelTextRef.current = hasGlowDot || hasMagnify || hasSuppressedLabel ? "" : labeledElement?.dataset.cursorLabel?.trim() ?? "";
      mutedLabelRef.current = labeledElement?.dataset.cursorLabelTone === "muted" && !hasSuppressedLabel;
      darkLabelRef.current = labeledElement?.dataset.cursorLabelTone === "dark" && !hasSuppressedLabel;
    };

    const onPointerLeave = () => {
      visibleRef.current = false;
      pressedRef.current = false;
      interactiveRef.current = false;
      filledRef.current = false;
      labeledRef.current = false;
      glowDotRef.current = false;
      magnifyRef.current = false;
      mutedLabelRef.current = false;
      darkLabelRef.current = false;
      colorRef.current = DEFAULT_CURSOR_COLOR;
      labelTextRef.current = "";
    };

    const onPointerDown = (event: PointerEvent) => {
      pointerRef.current.x = event.clientX;
      pointerRef.current.y = event.clientY;
      visibleRef.current = true;
      pressedRef.current = true;
    };

    const onPointerUp = () => {
      pressedRef.current = false;
    };

    const onWindowBlur = () => {
      visibleRef.current = false;
      pressedRef.current = false;
      filledRef.current = false;
      labeledRef.current = false;
      glowDotRef.current = false;
      magnifyRef.current = false;
      mutedLabelRef.current = false;
      darkLabelRef.current = false;
      labelTextRef.current = "";
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
      <div ref={ringRef} className="luminousCursorRing" />
      <div ref={dotRef} className="luminousCursorDot" />
      <div ref={labelRef} className="luminousCursorLabel" />
    </div>
  );
}
