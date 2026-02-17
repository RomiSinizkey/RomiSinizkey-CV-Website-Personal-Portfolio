import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <AnimatePresence>
      {show && (
        <motion.button
          type="button"
          onClick={scrollUp}
          aria-label="Back to top"
          initial={{ opacity: 0, y: 18, scale: 0.92 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 18, scale: 0.92 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="
            fixed right-6 bottom-6 z-[99999]
            h-14 w-14
            rounded-full
            bg-white/75 backdrop-blur-md
            shadow-[0_18px_50px_rgba(0,0,0,0.18)]
            flex items-center justify-center
            text-black
            hover:text-orange-600
            transition
            "
            style={{
            right: 24,
            bottom: 24,
            left: "auto",
            top: "auto",
            position: "fixed",
            }}

          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.96 }}
        >
          <ArrowUp size={22} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
