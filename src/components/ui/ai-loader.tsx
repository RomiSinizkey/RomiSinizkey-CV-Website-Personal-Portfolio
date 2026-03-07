import { motion } from "framer-motion";

interface AILoaderProps {
  variant: "overlay" | "button";
  size?: "sm" | "md" | "lg";
}

export default function AILoader({ variant, size = "md" }: AILoaderProps) {
  const sizeMap = {
    sm: 52,
    md: 66,
    lg: 84,
  };

  const circleSize = sizeMap[size];

  if (variant === "overlay") {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-b from-[#1a3379] via-[#0f172a] to-black">
        <div
          className="relative flex items-center justify-center"
          style={{ width: 180, height: 180 }}
        >
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
            style={{
              boxShadow:
                "0 6px 12px 0 #38bdf8 inset, 0 12px 18px 0 #005dff inset, 0 36px 36px 0 #1e40af inset, 0 0 3px 1.2px rgba(56, 189, 248, 0.3), 0 0 6px 1.8px rgba(0, 93, 255, 0.2)",
            }}
          />
          <span className="relative z-10 text-base font-medium text-slate-500">
            Generating
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative flex items-center justify-center select-none"
      style={{ width: circleSize, height: circleSize }}
    >
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        style={{
          boxShadow:
            "0 4px 8px 0 #38bdf8 inset, 0 8px 12px 0 #005dff inset, 0 22px 22px 0 #1e40af inset, 0 0 3px 1px rgba(56, 189, 248, 0.3), 0 0 8px 2px rgba(0, 93, 255, 0.22)",
          borderRadius: "9999px",
          background: "rgba(255,255,255,0.72)",
          backdropFilter: "blur(4px)",
        }}
      />
      <span className="relative z-10 text-[11px] font-medium text-slate-500">
        AI
      </span>
    </div>
  );
}