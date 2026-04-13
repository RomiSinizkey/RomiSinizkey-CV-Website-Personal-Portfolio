import { useState, type PointerEvent as ReactPointerEvent } from "react";
import "../styles/homeHeroTitle.css";

const COMPUTER_SCIENCE_TITLE = "Computer Science";
const COMPUTER_SCIENCE_CHARS = Array.from(COMPUTER_SCIENCE_TITLE);

export default function HomeHeroTitle() {
  const [activeCharIndex, setActiveCharIndex] = useState<number | null>(null);

  const updateActiveChar = (event: ReactPointerEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const chars = Array.from(
      element.querySelectorAll<HTMLElement>(".heroComputerscienceChar:not(.is-space)")
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
    <div className="homeHeroTitle relative z-20 inline-block w-max max-w-none px-4">
      <div className="flex flex-col items-center text-center">
        <p className="whitespace-nowrap text-[38px] font-medium leading-none tracking-tight text-white sm:text-[48px] md:text-[60px]">
          Student of
        </p>

        <div className="relative mt-10 md:mt-12">
          <div className="absolute inset-0 rounded-lg bg-linear-to-r from-orange-400/30 via-sky-400/20 to-orange-400/30 blur-2xl" />

          <div
            className="heroComputerscienceWrap relative z-10"
            aria-label={COMPUTER_SCIENCE_TITLE}
            onPointerMove={updateActiveChar}
            onPointerEnter={updateActiveChar}
            onPointerLeave={() => setActiveCharIndex(null)}
          >
            <p
              className="
                logoAccent heroComputerscienceText relative z-10 whitespace-nowrap
                text-[52px] font-extrabold tracking-tight
                leading-[1.06] sm:text-[68px] sm:leading-[1.05]
                md:text-[92px] md:leading-[1.03]
              "
              data-cursor="interactive"
              data-cursor-fill="solid"
            >
              {COMPUTER_SCIENCE_CHARS.map((char, index) => (
                <span
                  key={`${char}-${index}`}
                  data-char-index={index}
                  data-cursor="interactive"
                  data-cursor-fill="solid"
                  className={`heroComputerscienceChar${char === " " ? " is-space" : ""}${activeCharIndex === index ? " is-active" : ""}`}
                  aria-hidden="true"
                >
                  {char === " " ? "\u00A0" : char}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}