import { motion } from "framer-motion";
import { forwardRef } from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";
type ButtonSize = "sm" | "md" | "lg";
type BadgeVariant = "primary" | "secondary" | "success" | "warning" | "error";
type BadgeSize = "sm" | "md";
type LabelSize = "sm" | "md" | "lg";
type DividerVariant = "soft" | "bold";

const buttonVariantClasses: Record<ButtonVariant, string> = {
  primary: "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800",
  secondary: "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800",
  outline: "border-2 border-orange-600 text-orange-600 hover:bg-orange-50",
  ghost: "text-orange-600 hover:bg-orange-50 active:bg-orange-100",
};

const buttonSizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm font-medium",
  md: "px-4 py-2 text-base font-medium",
  lg: "px-6 py-3 text-lg font-semibold",
};

const badgeVariantClasses: Record<BadgeVariant, string> = {
  primary: "bg-orange-100 text-orange-800",
  secondary: "bg-sky-100 text-sky-800",
  success: "bg-green-100 text-green-800",
  warning: "bg-yellow-100 text-yellow-800",
  error: "bg-red-100 text-red-800",
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  sm: "px-2 py-1 text-xs font-semibold",
  md: "px-3 py-1.5 text-sm font-semibold",
};

const labelSizeClasses: Record<LabelSize, string> = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

const dividerVariantClasses: Record<DividerVariant, string> = {
  soft: "border-gray-200",
  bold: "border-gray-400",
};

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onAnimationStart" | "onDrag" | "onDragStart" | "onDragEnd"
>;

export interface ButtonProps extends NativeButtonProps {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    variant = "primary",
    size = "md",
    className,
    isLoading = false,
    disabled,
    ...props
  },
  ref
) {
  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
      transition={{ duration: 0.2 }}
      disabled={isDisabled}
      className={cn(
        "rounded-lg transition-all duration-200",
        buttonVariantClasses[variant],
        buttonSizeClasses[size],
        isDisabled && "cursor-not-allowed opacity-50",
        className
      )}
      {...props}
    >
      {isLoading ? (
        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          ⟳
        </motion.span>
      ) : (
        children
      )}
    </motion.button>
  );
});

export interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
}

export function Badge({ children, variant = "primary", size = "md", className }: BadgeProps) {
  return (
    <span className={cn("inline-block rounded-full", badgeVariantClasses[variant], badgeSizeClasses[size], className)}>
      {children}
    </span>
  );
}

export interface LabelProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  size?: LabelSize;
}

export function Label({ children, icon, className, size = "md" }: LabelProps) {
  return (
    <label className={cn("flex items-center gap-2 font-medium", labelSizeClasses[size], className)}>
      {icon ? <span className="shrink-0">{icon}</span> : null}
      {children}
    </label>
  );
}

export interface DividerProps {
  className?: string;
  variant?: DividerVariant;
}

export function Divider({ className, variant = "soft" }: DividerProps) {
  return <div className={cn("w-full border-t", dividerVariantClasses[variant], className)} />;
}
