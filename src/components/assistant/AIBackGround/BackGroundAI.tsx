"use client";

import { useEffect, useId, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import type { Container } from "@tsparticles/engine";
import { loadSlim } from "@tsparticles/slim";
import { motion, useAnimation } from "framer-motion";
import { cn } from "@/lib/utils";

type ParticlesProps = {
  id?: string;
  className?: string;
  background?: string;
  minSize?: number;
  maxSize?: number;
  speed?: number;
  particleColor?: string;
  particleDensity?: number;
};

export function BackGroundAI({
  id,
  className,
  background = "transparent",
  minSize = 0.4,
  maxSize = 1.2,
  speed = 0.7,
  particleColor = "#ffffff",
  particleDensity = 100,
}: ParticlesProps) {
  const [init, setInit] = useState(false);
  const controls = useAnimation();
  const generatedId = useId();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container) => {
    if (!container) return;

    controls.start({
      opacity: 1,
      transition: {
        duration: 1,
      },
    });
  };

  return (
    <motion.div
      animate={controls}
      initial={{ opacity: 0 }}
      className={cn("h-full w-full", className)}
    >
      {init && (
        <Particles
          id={id || generatedId}
          className="h-full w-full"
          particlesLoaded={particlesLoaded}
          options={{
            background: {
              color: {
                value: background,
              },
            },
            fullScreen: {
              enable: false,
            },
            fpsLimit: 60,
            detectRetina: true,

            interactivity: {
              events: {
                onClick: {
                  enable: false,
                },
                onHover: {
                  enable: false,
                },
                resize: {
                  enable: true,
                },
              },
            },

            particles: {
              number: {
                value: particleDensity,
                density: {
                  enable: true,
                  width: 900,
                  height: 900,
                },
              },

              color: {
                value: particleColor,
              },

              shadow: {
                enable: true,
                blur: 4,
                color: {
                  value: "#ffffff",
                },
              },

              shape: {
                type: "circle",
              },

              opacity: {
                value: {
                  min: 0.4,
                  max: 1,
                },
                animation: {
                  enable: true,
                  speed,
                  sync: false,
                  startValue: "random",
                },
              },

              size: {
                value: {
                  min: minSize,
                  max: maxSize,
                },
              },

              move: {
                enable: true,
                direction: "none",
                speed: {
                  min: 0.15,
                  max: 0.55,
                },
                random: true,
                straight: false,
                outModes: {
                  default: "out",
                },
              },

              links: {
                enable: false,
              },

              collisions: {
                enable: false,
              },
            },
          }}
        />
      )}
    </motion.div>
  );
}