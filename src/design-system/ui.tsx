/**
 * UI Components - Primitive components (Button, Badge, Label, etc.)
 * Uses Tailwind + Framer Motion for consistent, animated interactions
 */

import React from "react";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Button - Interactive button with multiple variants
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = "primary",
      size = "md",
      className = "",
      isLoading = false,
      disabled,
      ...props
    },
    ref
  ) => {
    const variantStyles = {
      primary:
        "bg-orange-600 text-white hover:bg-orange-700 active:bg-orange-800",
      secondary:
        "bg-sky-600 text-white hover:bg-sky-700 active:bg-sky-800",
      outline:
        "border-2 border-orange-600 text-orange-600 hover:bg-orange-50",
      ghost:
        "text-orange-600 hover:bg-orange-50 active:bg-orange-100",
    };

    const sizeStyles = {
      sm: "px-3 py-1.5 text-sm font-medium",
      md: "px-4 py-2 text-base font-medium",
      lg: "px-6 py-3 text-lg font-semibold",
    };

    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        transition={{ duration: 0.2 }}
        disabled={disabled || isLoading}
        className={`
          rounded-lg transition-all duration-200
          ${variantStyles[variant]}
          ${sizeStyles[size]}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
        {...(props as any)}
      >
        {isLoading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            ⟳
          </motion.span>
        ) : (
          children
        )}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

/**
 * Badge - Small labeled tag
 */
export interface BadgeProps {
  children: ReactNode;
  variant?: "primary" | "secondary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "primary",
  size = "md",
  className = "",
}) => {
  const variantStyles = {
    primary: "bg-orange-100 text-orange-800",
    secondary: "bg-sky-100 text-sky-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
  };

  const sizeStyles = {
    sm: "px-2 py-1 text-xs font-semibold",
    md: "px-3 py-1.5 text-sm font-semibold",
  };

  return (
    <span
      className={`
        inline-block rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
};

/**
 * Label - Text label with optional icon
 */
export interface LabelProps {
  children: ReactNode;
  icon?: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Label: React.FC<LabelProps> = ({
  children,
  icon,
  className = "",
  size = "md",
}) => {
  const sizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }[size];

  return (
    <label className={`flex items-center gap-2 font-medium ${sizeClass} ${className}`}>
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </label>
  );
};

/**
 * Divider - Horizontal line
 */
export interface DividerProps {
  className?: string;
  variant?: "soft" | "bold";
}

export const Divider: React.FC<DividerProps> = ({
  className = "",
  variant = "soft",
}) => {
  const variantStyles = {
    soft: "border-gray-200",
    bold: "border-gray-400",
  };

  return <div className={`w-full border-t ${variantStyles[variant]} ${className}`} />;
};

/**
 * Pill/Tag - Inline tag/category
 */
export interface PillProps {
  children: ReactNode;
  onRemove?: () => void;
  className?: string;
}

export const Pill: React.FC<PillProps> = ({
  children,
  onRemove,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      className={`
        inline-flex items-center gap-2
        rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-800
        ${className}
      `}
    >
      {children}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:text-gray-600 transition"
          aria-label="Remove"
        >
          ×
        </button>
      )}
    </motion.div>
  );
};

/**
 * Loading Skeleton - Placeholder while loading
 */
export interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: "sm" | "md" | "lg" | "full";
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = "w-full",
  height = "h-4",
  rounded = "md",
  className = "",
}) => {
  const roundedClass = {
    sm: "rounded-sm",
    md: "rounded-md",
    lg: "rounded-lg",
    full: "rounded-full",
  }[rounded];

  return (
    <motion.div
      className={`${width} ${height} ${roundedClass} bg-gray-200 ${className}`}
      animate={{ opacity: [0.5, 1, 0.5] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  );
};

/**
 * Alert - Information/Warning/Error message
 */
export interface AlertProps {
  children: ReactNode;
  type?: "info" | "success" | "warning" | "error";
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  children,
  type = "info",
  onClose,
  className = "",
}) => {
  const typeStyles = {
    info: "bg-blue-50 text-blue-800 border-blue-200",
    success: "bg-green-50 text-green-800 border-green-200",
    warning: "bg-yellow-50 text-yellow-800 border-yellow-200",
    error: "bg-red-50 text-red-800 border-red-200",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`
        rounded-lg border p-4
        ${typeStyles[type]}
        ${className}
      `}
    >
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium">{children}</p>
        {onClose && (
          <button
            onClick={onClose}
            className="text-lg opacity-50 hover:opacity-100 transition"
          >
            ×
          </button>
        )}
      </div>
    </motion.div>
  );
};
