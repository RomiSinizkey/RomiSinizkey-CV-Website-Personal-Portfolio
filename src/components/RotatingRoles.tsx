import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const roles = [
  "FULL-STACK DEVELOPER",
  "DOCKER • CLEAN ARCHITECTURE",
  "NODE.JS • EXPRESS • SQL",
  "C++ • OOP • Linux",
  "Python • Backend • Scripting",
];

export default function RotatingRoles() {
  const [index, setIndex] = useState(0);

  // ✅ guard נגד StrictMode double-mount / intervals כפולים
  const started = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    timerRef.current = window.setInterval(() => {
      setIndex((i) => (i + 1) % roles.length);
    }, 2200);

    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
      timerRef.current = null;
      started.current = false;
    };
  }, []);

  return (
    <div className="relative inline-flex items-center">
      <div
        className="
          relative overflow-hidden rounded-full
          px-6 py-2
          bg-white/35
          backdrop-blur-lg
          shadow-[0_18px_60px_rgba(0,0,0,0.08)]
        "
      >
       

        {/* ACCENT GLOW */}
        <div
          className="pointer-events-none absolute inset-0 opacity-30 blur-[18px]"
          style={{
            background:
              "radial-gradient(circle at 50% 50%, var(--accent), transparent 60%)",
          }}
        />

        {/* premium shine */}
        <motion.div
          className="absolute inset-0 opacity-40"
          animate={{ x: ["-120%", "120%"] }}
          transition={{ duration: 3.4, repeat: Infinity, ease: "linear" }}
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)",
          }}
        />

        <div className="relative h-[18px] min-w-[280px] overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={`${index}-${roles[index]}`} // ✅ key יציב לפי index
              initial={{ y: 16, opacity: 0, filter: "blur(8px)" }}
              animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
              exit={{ y: -16, opacity: 0, filter: "blur(8px)" }}
              transition={{ duration: 0.32 }}
              className="
                text-[12px]
                font-semibold
                tracking-[0.22em]
                uppercase
                text-black/70
                text-center
              "
            >
              {roles[index]}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
