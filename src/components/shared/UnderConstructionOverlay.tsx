//
import { useEffect, useState } from "react";
import "../../styles/assistant/aiAssistantWidget.css";

const WORDS = ["UNDER", "CONSTRUCTION"];
const ANIMATION_DURATION = 2100; // ms

function CubeLetter({ letter, index, animate }: { letter: string; index: number; animate: boolean }) {
  // Each cube gets its own delay for the animation
  const delays = [0, 0.2, 0.4, 0.6, 0.8, 1, 1.2];
  const delay = delays[index % delays.length];
  return (
    <div
      className={`cube${animate ? "" : " static"}`}
      style={{
        zIndex: Math.abs(3 - (index % 7)),
        animationDelay: animate ? `${delay}s` : undefined,
      }}
    >
      <div className="face face-front" style={!animate ? { backgroundColor: "#00cc44", color: "#fff" } : {}}>{letter}</div>
      <div className="face face-back" />
      <div className="face face-right" />
      <div className="face face-left" />
      <div className="face face-top" />
      <div className="face face-bottom" />
    </div>
  );
}

export default function UnderConstructionOverlay() {
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setAnimate(false), ANIMATION_DURATION);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="under-construction-overlay"
      aria-hidden="true"
      style={{ background: "rgba(0,0,0,0.55)", position: "fixed", inset: 0, zIndex: 2147483646, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
    >
      <style>{`
        .wrapper-uc-vertical {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        .wrapper-grid {
          --animation-duration: 2.1s;
          --cube-color: #0000;
          --highlight-color: #00cc44;
          --cube-width: 48px;
          --cube-height: 48px;
          --font-size: 1.8em;
          position: relative;
          inset: 0;
          display: grid;
          grid-template-columns: unset;
          grid-template-rows: auto;
          grid-gap: 0;
          width: fit-content;
          height: var(--cube-height);
          perspective: 350px;
          font-family: "Poppins", sans-serif;
          font-size: var(--font-size);
          font-weight: 800;
          color: transparent;
        }
        .cube {
          position: relative;
          transform-style: preserve-3d;
          animation: translate-z var(--animation-duration) ease-in-out infinite;
        }
        .cube.static {
          animation: none !important;
        }
        .face {
          position: absolute;
          display: flex;
          align-items: center;
          justify-content: center;
          width: var(--cube-width);
          height: var(--cube-height);
          background-color: var(--cube-color);
        }
        .face-left,
        .face-right,
        .face-back,
        .face-front {
          box-shadow:
            inset 0 0 2px 1px #0001,
            inset 0 0 12px 1px #fff1;
        }
        .face-front {
          transform: rotateY(0deg) translateZ(calc(var(--cube-width) / 2));
        }
        .face-back {
          transform: rotateY(180deg) translateZ(calc(var(--cube-width) / 2));
          opacity: 0.6;
        }
        .face-left {
          transform: rotateY(-90deg) translateZ(calc(var(--cube-width) / 2));
          opacity: 0.6;
        }
        .face-right {
          transform: rotateY(90deg) translateZ(calc(var(--cube-width) / 2));
          opacity: 0.6;
        }
        .face-top {
          height: var(--cube-width);
          transform: rotateX(90deg) translateZ(calc(var(--cube-width) / 2));
          opacity: 0.8;
        }
        .face-bottom {
          height: var(--cube-width);
          transform: rotateX(-90deg) translateZ(calc(var(--cube-height) - var(--cube-width) * 0.5));
          opacity: 0.8;
        }
        @keyframes translate-z {
          0%, 40%, 100% {
            transform: translateZ(-2px);
          }
          30% {
            transform: translateZ(16px) translateY(-1px);
          }
        }
      `}</style>
      <div className="wrapper-uc-vertical">
        {WORDS.map((word, rowIdx) => (
          <div
            className="wrapper-grid"
            key={rowIdx}
            style={{
              gridTemplateColumns: `repeat(${word.length}, var(--cube-width))`,
              width: `calc(${word.length} * var(--cube-width))`,
              margin: rowIdx === 0 ? "0 auto" : undefined,
              textAlign: rowIdx === 0 ? "center" : undefined,
            }}
          >
            {word.split("").map((letter, i) => (
              <CubeLetter key={i} letter={letter} index={i} animate={animate} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

