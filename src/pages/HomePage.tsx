import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import heroImg from "../assets/hero.jpg";

import SideLinks from "../components/SideLinks";
import NameLogo from "../components/NameLogo";
import HomeProjectsShowcase from "../components/HomeProjectsShowcase";
import HomeHeroTitle from "../components/HomeHeroTitle";

// Ripple effect component for click interactions
interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

function ClickRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const colors = ["#ea580c", "#0ea5e9", "#a855f7"];
    
    // Create multiple ripples for more effect
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const newRipple: Ripple = {
          id: Date.now() + i,
          x: e.clientX,
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation completes
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1200);
      }, i * 100);
    }
  };

  return (
    <div
      className="fixed inset-0 pointer-events-auto z-40"
      onClick={handleClick}
      style={{ cursor: "crosshair" }}
    >
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="fixed rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            border: `4px solid ${ripple.color}`,
            boxShadow: `0 0 30px ${ripple.color}, inset 0 0 30px ${ripple.color}`,
          }}
          initial={{
            width: 10,
            height: 10,
            opacity: 1,
            x: -5,
            y: -5,
          }}
          animate={{
            width: 500,
            height: 500,
            opacity: 0,
            x: -250,
            y: -250,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated Algorithm Flow Component
function AnimatedAlgorithmFlow() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ filter: "drop-shadow(0 0 30px rgba(234, 88, 12, 0.4))" }}
    >
      {/* Animated paths for data flow */}
      <motion.path
        d="M 0 150 Q 250 100, 500 130 T 1000 180"
        stroke="url(#flowGradient1)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: [1000, 0, 1000] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        strokeDasharray="1000"
        opacity="0.9"
      />

      <motion.path
        d="M 1000 350 Q 750 300, 500 320 T 0 400"
        stroke="url(#flowGradient2)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: [1000, 0, 1000] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
        strokeDasharray="1000"
        opacity="0.9"
      />

      <motion.path
        d="M 0 550 Q 250 600, 500 520 T 1000 620"
        stroke="url(#flowGradient3)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: [1000, 0, 1000] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
        strokeDasharray="1000"
        opacity="0.9"
      />

      {/* Gradients for animated paths */}
      <defs>
        <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0" />
          <stop offset="30%" stopColor="#ea580c" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ea580c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
          <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flowGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
          <stop offset="30%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HomePage() {
  const location = useLocation();
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const state = location.state as any | undefined;
    const s = state?.scrollTo as string | undefined;
    const openShowcase = Boolean(state?.openShowcase);

    if (!s && !openShowcase) return;

    requestAnimationFrame(() => {
      if (openShowcase) {
        window.dispatchEvent(new CustomEvent("home:projects:open"));
      }

      if (s) {
        const el = document.getElementById(s);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [location.state]);

  // Track scroll progress for progress bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0;
      setScrollProgress(progress);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="min-h-[200vh] w-full relative overflow-hidden"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "100%",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Scroll Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-orange-500 via-sky-500 to-orange-500 z-50"
        style={{ width: `${scrollProgress * 100}%` }}
      />

      {/* Animated background glow - moves with scroll */}
      <motion.div
        className="fixed top-0 left-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(234, 88, 12, 0.05) 0%, transparent 50%)",
          y: window.scrollY ? window.scrollY * 0.5 : 0,
        }}
      />

      {/* Animated Algorithm Flow */}
      <AnimatedAlgorithmFlow />

      {/* Click Ripple Effect */}
      <ClickRipples />

      {/* Floating decoration shapes */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-sky-400/10 rounded-full blur-3xl"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 left-5 w-80 h-80 bg-gradient-to-br from-sky-400/10 to-orange-400/10 rounded-full blur-3xl"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Scroll hint - appears at start, fades with scroll */}
      <motion.div
        className="fixed bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-40"
        animate={{ opacity: 1 - scrollProgress * 2, y: scrollProgress > 0.1 ? 20 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <span className="text-xs font-semibold text-gray-600 uppercase tracking-widest">
          Scroll to explore
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-2xl text-orange-600"
        >
          ↓
        </motion.div>
      </motion.div>

      {/* Hero Section */}
      <HomeHeroTitle />

      {/* Scroll target */}
      <div
        id="projects-preview"
        className="absolute left-0 top-[120vh] h-px w-px"
        aria-hidden="true"
      />

      {/* Projects Showcase */}
      <HomeProjectsShowcase />

      {/* Side Links & Logo */}
      <SideLinks />
      <NameLogo />
    </div>
  );
}
