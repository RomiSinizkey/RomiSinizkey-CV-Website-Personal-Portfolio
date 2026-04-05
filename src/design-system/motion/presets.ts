import type { Variants } from "framer-motion";

/**
 * Shared Framer Motion presets for consistent interaction patterns.
 */
export const animationPresets = {
  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  } as Variants,
} as const;
