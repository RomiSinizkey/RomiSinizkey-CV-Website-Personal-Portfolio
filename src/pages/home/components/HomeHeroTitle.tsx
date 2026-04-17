import { useState, type PointerEvent as ReactPointerEvent } from "react";
import "../styles/homeHeroTitle.css";

const COMPUTER_SCIENCE_TITLE = "Computer Science";
const COMPUTER_SCIENCE_CHARS = Array.from(COMPUTER_SCIENCE_TITLE);

export default function HomeHeroTitle() {
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const updateActiveChar = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const chars = Array.from(
      element.querySelectorAll<HTMLElement>(
        ".heroComputerscienceChar:not(.is-space)"
      )
    );

    if (chars.length === 0) return;

    let nextIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    chars.forEach((char) => {
      const rect = char.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const distance = Math.abs(event.clientX - centerX);

      if (distance < bestDistance) {
        bestDistance = distance;
        nextIndex = Number(char.dataset.charIndex);
      }
    });

    setActiveCharIndex(nextIndex);
  };

  return (
    <div className="homeHeroTitle pointer-events-none relative z-20 flex flex-col items-center justify-center text-center">
      <p className="pointer-events-auto text-center text-[clamp(28px,3.6vw,54px)] font-medium leading-none tracking-tight text-white">
        Student of
      </p>

      <div className="relative mt-4 flex justify-center md:mt-6">
        <div className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-r from-orange-400/30 via-sky-400/20 to-orange-400/30 blur-2xl" />

        <div
          className="pointer-events-auto relative z-10 flex justify-center"
          aria-label={COMPUTER_SCIENCE_TITLE}
          onPointerMove={updateActiveChar}
          onPointerEnter={updateActiveChar}
          onPointerLeave={() => setActiveCharIndex(null)}
        >
          <p
            className="
              text-center
              text-[clamp(36px,5.2vw,78px)]
              font-black leading-[1.02] tracking-[-0.04em]
              text-orange-500
            "
            data-cursor="interactive"
            data-cursor-fill="solid"
          >
            {COMPUTER_SCIENCE_CHARS.map((char, index) => (
              <span
                key={`${char}-${index}`}
                data-char-index={index}
                className={`heroComputerscienceChar${
                  char === " " ? " is-space" : ""
                }${activeCharIndex === index ? " is-active" : ""}`}
                aria-hidden="true"
              >
                {char === " " ? "\u00A0" : char}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}