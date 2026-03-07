import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import RotatingRoles from "./RotatingRoles";
import StatsBar from "./StatsBar";

export default function HomeHeroTitle() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Stagger animation for text elements
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  const glowVariants = {
    initial: { opacity: 0.6 },
    animate: {
      opacity: [0.6, 1, 0.6],
    },
  };

  const hoverGlowVariants = {
    initial: { opacity: 0.6, scale: 1 },
    hover: {
      opacity: 1,
      scale: 1.15,
    },
  };

  const titleHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.08,
      transition: { duration: 0.3 },
    },
  };

  // Parallax offset - moves up as you scroll
  const parallaxOffset = scrollY * 0.3;

  return (
    <div
      className="
        absolute left-1/2 -translate-x-1/2 z-20
        w-[92vw] max-w-[980px] px-3 text-center
        pt-[96px] sm:pt-[110px] md:pt-[130px]
      "
      style={{
        transform: `translateY(${parallaxOffset}px)`,
      }}
    >
      {/* Fade effect when scrolling down */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        animate={{
          opacity: Math.max(0, 1 - scrollY / 300),
        }}
        style={{
          zIndex: 5,
        }}
      />

      {/* טיפוגרפיה כבלוק אחד */}
      <motion.div
        className="flex flex-col items-center gap-0 relative z-20"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p
          variants={itemVariants}
          transition={{ duration: 0.6 }}
          className="text-[42px] sm:text-[52px] md:text-[68px] font-medium tracking-tight text-black leading-[1] cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          Student of
        </motion.p>

        <motion.div
          variants={itemVariants}
          transition={{ duration: 0.6 }}
          className="relative"
          whileHover="hover"
          initial="initial"
        >
          {/* Glow effect background */}
          <motion.div
            className="absolute inset-0 blur-2xl bg-gradient-to-r from-orange-400/30 via-sky-400/20 to-orange-400/30 rounded-lg"
            variants={glowVariants}
            initial="initial"
            animate="animate"
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Interactive hover glow */}
          <motion.div
            className="absolute inset-0 blur-3xl bg-gradient-to-r from-orange-400/50 via-transparent to-sky-400/50 rounded-lg"
            variants={hoverGlowVariants}
            initial="initial"
            whileHover="hover"
            style={{
              opacity: 0,
            }}
          />

          <motion.p
            className="
              logoAccent
              text-[44px] sm:text-[56px] md:text-[84px]
              font-extrabold tracking-tight
              leading-[1.06] sm:leading-[1.05] md:leading-[1.03]
              mt-[10px] relative z-10 cursor-pointer
            "
            variants={titleHoverVariants}
            initial="initial"
            whileHover="hover"
          >
            Computer Science
          </motion.p>
        </motion.div>
      </motion.div>

      {/* רווח יפה לפני התפקידים */}
      <motion.div
        className="mt-[30px] flex flex-col items-center gap-2 relative z-20"
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.5 }}
      >
        <RotatingRoles />
        <StatsBar />
      </motion.div>
    </div>
  );
}