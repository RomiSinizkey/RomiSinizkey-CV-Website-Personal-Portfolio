/**
 * Design Tokens - Centralized design values
 * Keeps colors, spacing, typography consistent across the app
 */

export const tokens = {
  colors: {
    primary: {
      accent: "#ea580c", // Orange
      accentLight: "rgba(234, 88, 12, 0.1)",
      accentDark: "#c73a00",
    },
    secondary: {
      sky: "#0ea5e9", // Sky blue
      skyLight: "rgba(14, 165, 233, 0.1)",
    },
    neutral: {
      white: "#ffffff",
      black: "#111111",
      gray: {
        50: "#f9fafb",
        100: "#f3f4f6",
        200: "#e5e7eb",
        300: "#d1d5db",
        400: "#9ca3af",
        500: "#6b7280",
        600: "#4b5563",
        700: "#374151",
        800: "#1f2937",
        900: "#111827",
      },
    },
  },

  spacing: {
    xs: "0.25rem", // 4px
    sm: "0.5rem", // 8px
    md: "1rem", // 16px
    lg: "1.5rem", // 24px
    xl: "2rem", // 32px
    "2xl": "2.5rem", // 40px
    "3xl": "3rem", // 48px
  },

  borderRadius: {
    sm: "0.375rem", // 6px
    md: "0.5rem", // 8px
    lg: "1rem", // 16px
    xl: "1.5rem", // 24px
    full: "9999px",
  },

  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
    glow: "0 0 24px rgba(234, 88, 12, 0.3)",
  },

  transitions: {
    fast: "150ms",
    base: "200ms",
    slow: "300ms",
  },

  typography: {
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
    sizes: {
      xs: { size: "0.75rem", weight: 500 },
      sm: { size: "0.875rem", weight: 500 },
      base: { size: "1rem", weight: 400 },
      lg: { size: "1.125rem", weight: 600 },
      xl: { size: "1.25rem", weight: 700 },
      "2xl": { size: "1.5rem", weight: 700 },
      "3xl": { size: "1.875rem", weight: 700 },
      "4xl": { size: "2.25rem", weight: 800 },
    },
  },
};

export type Tokens = typeof tokens;
