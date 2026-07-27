import { useEffect, useRef, useState, type CSSProperties } from "react";
import "./styles/logoLoader.css";

const MIN_DISPLAY_MS = 8300; // minimum milliseconds the loader stays visible
const INTRO_WORD = "PORTFOLIO";

interface Props {
  onDone?: () => void;
}

export default function LogoLoader({ onDone }: Props) {
  const [hiding, setHiding] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = Date.now();

    const finish = () => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        // reveal the page immediately so it crossfades in under the
        // overlay instead of popping in once the fade-out finishes
        onDone?.();
        setHiding(true);
        // remove from DOM after the CSS fade-out transition (0.6s)
        setTimeout(() => {
          setUnmounted(true);
        }, 650);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, [onDone]);

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
