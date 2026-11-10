import { useState, type PointerEvent as ReactPointerEvent } from "react";
import { profile } from "@/data/profile";
import "./HeroTitle.css";

const COMPUTER_SCIENCE_TITLE = "Computer Science";
const COMPUTER_SCIENCE_CHARS = Array.from(COMPUTER_SCIENCE_TITLE);

export default function HeroTitle() {
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const updateActiveChar = (event: ReactPointerEvent<HTMLSpanElement>) => {
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
      <h1 className="homeHeroName pointer-events-auto">{profile.fullName}</h1>

      <p className="homeHeroField relative">
        {/* Screen readers get the plain words; the per-letter spans below are visual only. */}
        <span className="sr-only">{COMPUTER_SCIENCE_TITLE}</span>

        <span className="pointer-events-none absolute inset-0 rounded-lg bg-linear-to-r from-orange-400/30 via-sky-400/20 to-orange-400/30 blur-2xl" aria-hidden="true" />

        <span
          className="homeHeroComputerScience pointer-events-auto relative z-10"
          data-cursor="interactive"
          aria-hidden="true"
          onPointerMove={updateActiveChar}
          onPointerEnter={updateActiveChar}
          onPointerLeave={() => setActiveCharIndex(null)}
        >
          {COMPUTER_SCIENCE_CHARS.map((char, index) => (
            <span
              key={`${char}-${index}`}
              data-char-index={index}
              className={`heroComputerscienceChar${
                char === " " ? " is-space" : ""
              }${activeCharIndex === index ? " is-active" : ""}`}
            >
              {char === " " ? " " : char}
            </span>
          ))}
        </span>
      </p>

      <p className="homeHeroRole pointer-events-auto">{profile.role}</p>
    </div>
  );
}
