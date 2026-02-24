/**
 * Layout Components - Reusable containers and layout patterns
 * Provides consistent spacing, alignment, and structure
 */

import React from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Container - Base container with max-width and centered alignment
 */
export interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  px?: number;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = "",
  maxWidth = "lg",
  px = 3,
}) => {
  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-3xl",
    xl: "max-w-4xl",
    "2xl": "max-w-6xl",
    full: "max-w-full",
  }[maxWidth];

  return (
    <div className={`mx-auto w-full px-${px} ${maxWidthClass} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Section - Self-contained section with optional spacing
 */
export interface SectionProps {
  children: ReactNode;
  className?: string;
  py?: number;
  id?: string;
}

export const Section: React.FC<SectionProps> = ({
  children,
  className = "",
  py = 12,
  id,
}) => {
  return (
    <section id={id} className={`w-full py-${py} ${className}`}>
      {children}
    </section>
  );
};

/**
 * Stack (Flex) - Horizontal or vertical stack with consistent gap
 */
export interface StackProps {
  children: ReactNode;
  direction?: "row" | "col";
  gap?: number;
  align?: "start" | "center" | "end";
  justify?: "start" | "center" | "between" | "end";
  className?: string;
  wrap?: boolean;
}

export const Stack: React.FC<StackProps> = ({
  children,
  direction = "col",
  gap = 4,
  align = "center",
  justify = "center",
  className = "",
  wrap = false,
}) => {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";
  const alignClass = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
  }[align];
  const justifyClass = {
    start: "justify-start",
    center: "justify-center",
    between: "justify-between",
    end: "justify-end",
  }[justify];
  const wrapClass = wrap ? "flex-wrap" : "flex-nowrap";

  return (
    <div
      className={`flex ${directionClass} ${alignClass} ${justifyClass} gap-${gap} ${wrapClass} ${className}`}
    >
      {children}
    </div>
  );
};

/**
 * Grid - Responsive grid layout
 */
export interface GridProps {
  children: ReactNode;
  cols?: number;
  gap?: number;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 3,
  gap = 4,
  className = "",
}) => {
  const colsClass = `grid-cols-${cols}`;
  return (
    <div className={`grid ${colsClass} gap-${gap} ${className}`}>
      {children}
    </div>
  );
};

/**
 * Card - Elevated card component with built-in hover animation
 */
export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = "",
  onClick,
  interactive = false,
}) => {
  const Card = (
    <div
      onClick={onClick}
      className={`rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md ${
        interactive ? "cursor-pointer" : ""
      } ${className}`}
    >
      {children}
    </div>
  );

  if (!interactive) return Card;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      {Card}
    </motion.div>
  );
};

/**
 * Center - Center content both horizontally and vertically
 */
export interface CenterProps {
  children: ReactNode;
  className?: string;
  minHeight?: string;
}

export const Center: React.FC<CenterProps> = ({
  children,
  className = "",
  minHeight = "h-screen",
}) => {
  return (
    <div className={`flex items-center justify-center ${minHeight} ${className}`}>
      {children}
    </div>
  );
};

/**
 * AnimatedContainer - Motion-wrapped container with standard entrance animation
 */
export interface AnimatedContainerProps {
  children: ReactNode;
  variant?: "fadeIn" | "scaleIn" | "slideUp";
  delay?: number;
  duration?: number;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  variant = "fadeIn",
  delay = 0,
  duration = 0.5,
}) => {
  const variants = {
    fadeIn: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
    scaleIn: { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1 } },
    slideUp: { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={variants[variant]}
      transition={{ delay, duration }}
    >
      {children}
    </motion.div>
  );
};
