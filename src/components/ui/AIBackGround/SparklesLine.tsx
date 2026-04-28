"use client";

import { BackGroundAI } from "@/components/ui/AIBackGround/BackGroundAI";

export function SparklesLine() {
  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      {/* Main stars */}
      <div className="absolute inset-0 z-0">
        <BackGroundAI
          background="transparent"
          minSize={0.3}
          maxSize={1.1}
          particleDensity={700}
          className="h-full w-full"
          particleColor="#FFFFFF"
          speed={0.55}
        />
      </div>

      {/* Extra stars around the AI - still background */}
      <div className="absolute left-1/2 top-[62%] z-0 h-[160px] w-[280px] -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <BackGroundAI
          background="transparent"
          minSize={0.35}
          maxSize={1.4}
          particleDensity={800}
          className="h-full w-full"
          particleColor="#FFFFFF"
          speed={0.5}
        />
      </div>

      {/* Animated AI text - background layer */}
      <div className="absolute left-1/2 top-[58%] z-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-65">
        <h1 className="ai-fill-text">
          <span className="ai-fill-letter" data-letter="A">
            A
          </span>
          <span className="ai-fill-letter" data-letter="I">
            I
          </span>
        </h1>

        <div className="ai-glow-line" />
      </div>
    </div>
  );
}