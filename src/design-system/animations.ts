/**
 * Animation Presets - Reusable Framer Motion variants
 * Reduces code duplication and ensures consistent motion across components
 */

import type { Variants } from "framer-motion";

export const animationPresets = {
  /**
   * Fade In animations
   */
  fadeIn: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  } as Variants,

  fadeInUp: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  } as Variants,

  fadeInDown: {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  } as Variants,

  fadeInLeft: {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  } as Variants,

  fadeInRight: {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  } as Variants,

  /**
   * Scale animations
   */
  scaleIn: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { opacity: 1, scale: 1 },
  } as Variants,

  /**
   * Staggered container (parent)
   */
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  } as Variants,

  /**
   * Floating/hovering effect
   */
  float: {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,

  /**
   * Pulse effect (shimmer/glow respiration)
   */
  pulse: {
    animate: {
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  } as Variants,

  /**
   * Hover Scale
   */
  hoverScale: {
    initial: { scale: 1 },
    hover: { scale: 1.05 },
  } as Variants,

  /**
   * Rotate animation
   */
  spin: {
    animate: {
      rotate: 360,
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "linear",
      },
    },
  } as Variants,
};

/**
 * Transition presets
 */
export const transitionPresets = {
  fast: { duration: 0.15 },
  base: { duration: 0.2 },
  slow: { duration: 0.3 },
  smooth: { duration: 0.4, ease: "easeInOut" },
};
