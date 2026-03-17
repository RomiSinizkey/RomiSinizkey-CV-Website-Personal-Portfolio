import { useEffect, useRef, useState } from "react";
import "../styles/components/brutalistLoader.css";

const MIN_DISPLAY_MS = 3800; // minimum milliseconds the loader stays visible

interface Props {
  onDone?: () => void;
}

export default function BrutalistLoader({ onDone }: Props) {
  const [hiding, setHiding] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const finish = () => {
      const elapsed = Date.now() - startTime.current;
      const remaining = Math.max(0, MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        setHiding(true);
        // remove from DOM after the CSS fade-out transition (0.6s)
        setTimeout(() => {
          setUnmounted(true);
          onDone?.();
        }, 650);
      }, remaining);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, []);

  if (unmounted) return null;

  return (
    <div className={`brutalist-loader-overlay${hiding ? " bl-hidden" : ""}`}>
      <div className="bl-container">
        <div className="bl-loader">
          <div className="bl-card">
            <div className="bl-bar" />
            <div className="bl-noise" />
          </div>
        </div>
        <div className="bl-text">Loading</div>
      </div>
    </div>
  );
}
