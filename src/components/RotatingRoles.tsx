import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { animationPresets } from "../design-system";

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
      <div className="relative h-[26px] sm:h-[28px] min-w-[280px] overflow-hidden flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${index}-${roles[index]}`}
            variants={animationPresets.fadeInUp}
            initial="hidden"
            
            animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
            exit={{ y: -14, opacity: 0, filter: "blur(8px)" }}
            transition={{ duration: 0.32 }}
            className="
              text-[12px]
              font-semibold
              tracking-[0.22em]
              uppercase
              text-black/70
              text-center
              w-full
              leading-none
            "
          >
            {roles[index]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
