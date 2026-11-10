import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./LogoLoader.css";

// Full intro animation is ~2.8s (see --speed in LogoLoader.css); the page is revealed at 3.2s.
const MIN_DISPLAY_MS = 3200;
// With "reduce motion" the CSS shows a static logo; keep it only briefly.
const REDUCED_MOTION_DISPLAY_MS = 600;
// Failsafe: reveal the page even if the window "load" event never fires (e.g. a stalled request).
const MAX_WAIT_MS = 6000;
// Matches the CSS opacity transition (0.6s) of .logo-loader-overlay.
const FADE_OUT_MS = 650;
const INTRO_WORD = "PORTFOLIO";
const SEEN_KEY = "romi-portfolio-intro-seen";

// sessionStorage can throw (blocked storage, some private modes); then the intro simply plays again.
function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markIntroSeen() {
  try {
    window.sessionStorage.setItem(SEEN_KEY, "1");
  } catch {
    // Storage unavailable: nothing to remember.
  }
}

function prefersReducedMotion() {
  return typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

interface Props {
  onDone?: () => void;
}

export default function LogoLoader({ onDone }: Props) {
  // Already played in this browser tab: skip it and show the page right away.
  const [skip] = useState(hasSeenIntro);
  const [hiding, setHiding] = useState(false);
  const [unmounted, setUnmounted] = useState(skip);
  const onDoneRef = useRef(onDone);

  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    if (skip) {
      onDoneRef.current?.();
      return;
    }

    markIntroSeen();
    const startTime = performance.now();
    const minDisplayMs = prefersReducedMotion() ? REDUCED_MOTION_DISPLAY_MS : MIN_DISPLAY_MS;
    const timers: number[] = [];
    let finished = false;

    const finish = () => {
      if (finished) return;
      finished = true;
      const remaining = Math.max(0, minDisplayMs - (performance.now() - startTime));

      timers.push(
        window.setTimeout(() => {
          // reveal the page immediately so it crossfades in under the
          // overlay instead of popping in once the fade-out finishes
          onDoneRef.current?.();
          setHiding(true);
          // remove from DOM after the CSS fade-out transition
          timers.push(window.setTimeout(() => setUnmounted(true), FADE_OUT_MS));
        }, remaining)
      );
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }
    timers.push(window.setTimeout(finish, MAX_WAIT_MS));

    return () => {
      window.removeEventListener("load", finish);
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [skip]);

  if (unmounted) return null;

  return (
    <div className={`logo-loader-overlay${hiding ? " ll-hidden" : ""}`}>
      <div className="ll-stage">
        <div className="ll-word-stage" aria-hidden="true">
          <span className="ll-word">
            {INTRO_WORD.split("").map((letter, i) => (
              <span
                key={i}
                className="ll-word-letter"
                style={{ "--i": i } as CSSProperties}
                data-letter={letter}
              >
                {letter}
              </span>
            ))}
          </span>
        </div>

        <div className="ll-mark" role="img" aria-label="Romi Sinizkey logo animating in">
          <svg className="ll-guide" viewBox="0 0 200 200" aria-hidden="true">
            <circle cx="100" cy="100" r="72" />
            <line x1="100" y1="10" x2="100" y2="190" />
            <line x1="10" y1="100" x2="190" y2="100" />
            <line x1="34" y1="34" x2="166" y2="166" />
          </svg>

          <svg className="ll-glyph-svg" viewBox="0 0 200 200" aria-hidden="true">
            <defs>
              <linearGradient id="ll-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#8A2BE2" />
                <stop offset="55%" stopColor="#6A5CFF" />
                <stop offset="100%" stopColor="#00D4FF" />
              </linearGradient>
            </defs>
            <text
              className="ll-glyph-outline"
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              R
            </text>
            <text
              className="ll-glyph-fill"
              x="50%"
              y="60%"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              R
            </text>
          </svg>

          <span className="ll-dot-trail" />
          <span className="ll-dot" />
        </div>

        <div className="ll-wordmark">
          <div className="ll-name">
            ROMI <span>SINIZKEY</span>
          </div>
          <div className="ll-title">SOFTWARE DEVELOPER</div>
        </div>
      </div>
    </div>
  );
}
