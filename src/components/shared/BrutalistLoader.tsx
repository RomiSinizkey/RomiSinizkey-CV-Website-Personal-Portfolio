import { useEffect, useRef, useState } from "react";
import "../../styles/shared/brutalistLoader.css";

const MIN_DISPLAY_MS = 3800; // minimum milliseconds the loader stays visible

interface Props {
  onDone?: () => void;
}

export default function BrutalistLoader({ onDone }: Props) {
  const [hiding, setHiding] = useState(false);
  const [unmounted, setUnmounted] = useState(false);
  const startTime = useRef(0);

  useEffect(() => {
    startTime.current = Date.now();

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
  }, [onDone]);

  if (unmounted) return null;

  return (
    <div className={`brutalist-loader-overlay${hiding ? " bl-hidden" : ""}`}>
      <div className="bl-hamster-stage">
        <div
          aria-label="Orange and tan hamster running in a metal wheel"
          role="img"
          className="wheel-and-hamster"
        >
          <div className="wheel" />
          <div className="hamster">
            <div className="hamster__body">
              <div className="hamster__head">
                <div className="hamster__ear" />
                <div className="hamster__eye" />
                <div className="hamster__nose" />
              </div>
              <div className="hamster__limb hamster__limb--fr" />
              <div className="hamster__limb hamster__limb--fl" />
              <div className="hamster__limb hamster__limb--br" />
              <div className="hamster__limb hamster__limb--bl" />
              <div className="hamster__tail" />
            </div>
          </div>
          <div className="spoke" />
        </div>
        <div className="bl-loader-copy">LOADING</div>
      </div>
    </div>
  );
}
