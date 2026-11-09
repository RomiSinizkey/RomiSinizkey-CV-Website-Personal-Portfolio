import { motion } from "framer-motion";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

type SpaceScale = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12;
type MaxWidth = "sm" | "md" | "lg" | "xl" | "2xl" | "full";
type Align = "start" | "center" | "end";
type Justify = "start" | "center" | "between" | "end";
type GridCols = 1 | 2 | 3 | 4 | 5 | 6;

const spaceXClasses: Record<SpaceScale, string> = {
  0: "px-0",
  1: "px-1",
  2: "px-2",
  3: "px-3",
  4: "px-4",
  5: "px-5",
  6: "px-6",
  8: "px-8",
  10: "px-10",
  12: "px-12",
};

const spaceYClasses: Record<SpaceScale, string> = {
  0: "py-0",
  1: "py-1",
  2: "py-2",
  3: "py-3",
  4: "py-4",
  5: "py-5",
  6: "py-6",
  8: "py-8",
  10: "py-10",
  12: "py-12",
};

const gapClasses: Record<SpaceScale, string> = {
  0: "gap-0",
  1: "gap-1",
  2: "gap-2",
  3: "gap-3",
  4: "gap-4",
  5: "gap-5",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
};

const maxWidthClasses: Record<MaxWidth, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-3xl",
  xl: "max-w-4xl",
  "2xl": "max-w-6xl",
  full: "max-w-full",
};

const alignClasses: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
};

const justifyClasses: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  between: "justify-between",
  end: "justify-end",
};

const gridColClasses: Record<GridCols, string> = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
  5: "grid-cols-5",
  6: "grid-cols-6",
};

export interface ContainerProps {
  children: ReactNode;
  className?: string;
  maxWidth?: MaxWidth;
  px?: SpaceScale;
}

export function Container({
  children,
  className,
  maxWidth = "lg",
  px = 3,
}: ContainerProps) {
  return (
    <div className={cn("mx-auto w-full", maxWidthClasses[maxWidth], spaceXClasses[px], className)}>
      {children}
    </div>
  );
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  py?: SpaceScale;
  id?: string;
}

export function Section({ children, className, py = 12, id }: SectionProps) {
  return (
    <section id={id} className={cn("w-full", spaceYClasses[py], className)}>
      {children}
    </section>
  );
}

export interface StackProps {
  children: ReactNode;
  direction?: "row" | "col";
  gap?: SpaceScale;
  align?: Align;
  justify?: Justify;
  className?: string;
  wrap?: boolean;
}

export function Stack({
  children,
  direction = "col",
  gap = 4,
  align = "center",
  justify = "center",
  className,
  wrap = false,
}: StackProps) {
  return (
    <div
      className={cn(
        "flex",
        direction === "row" ? "flex-row" : "flex-col",
        alignClasses[align],
        justifyClasses[justify],
        gapClasses[gap],
        wrap ? "flex-wrap" : "flex-nowrap",
        className
      )}
    >
      {children}
    </div>
  );
}

export interface GridProps {
  children: ReactNode;
  cols?: GridCols;
  gap?: SpaceScale;
  className?: string;
}

export function Grid({ children, cols = 3, gap = 4, className }: GridProps) {
  return <div className={cn("grid", gridColClasses[cols], gapClasses[gap], className)}>{children}</div>;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  interactive?: boolean;
}

export function Card({ children, className, onClick, interactive = false }: CardProps) {
  const cardBody = (
    <div
      onClick={onClick}
      className={cn(
        "rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md",
        interactive && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );

  if (!interactive) return cardBody;

  return (
    <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="h-full">
      {cardBody}
    </motion.div>
  );
}
