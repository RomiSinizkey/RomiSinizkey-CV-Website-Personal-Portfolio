'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { profile } from "../data/profile";

type RevealKey = "email" | "phone" | null;

type FloatingButtonProps = {
  children: ReactNode;
  trigger: (args: { isOpen: boolean; toggle: () => void }) => ReactNode;
};

const list = {
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, staggerDirection: -1 },
  },
  hidden: {
    opacity: 0,
    transition: { when: "afterChildren", staggerChildren: 0.08 },
  },
};

const item = {
  visible: { opacity: 1, y: 0 },
  hidden: { opacity: 0, y: 8 },
};

function FloatingButton({ children, trigger }: FloatingButtonProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(true);
  const toggle = () => setIsOpen((v) => !v);

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!ref.current || !target) return;
      if (!ref.current.contains(target)) setIsOpen(false);
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
    };
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <motion.ul
        initial="hidden"
        animate={isOpen ? "visible" : "hidden"}
        variants={list}
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 12,
          position: "absolute",
          bottom: "100%",
          marginBottom: 12,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {children}
      </motion.ul>

      {trigger({ isOpen, toggle })}
    </div>
  );
}

const bubble = {
  hidden: { opacity: 0, x: -8, scale: 0.95 },
  show: { opacity: 1, x: 0, scale: 1 },
  exit: { opacity: 0, x: -8, scale: 0.95 },
};

function IconImg({
  src,
  alt,
  size,
}: {
  src: string;
  alt: string;
  size: number;
}) {
  return (
    <img
      src={src}
      alt={alt}
      width={size}
      height={size}
      draggable={false}
      style={{
        width: size,
        height: size,
        objectFit: "contain",
        display: "block",
        pointerEvents: "none",
        userSelect: "none",
      }}
    />
  );
}

export default function SideLinks() {
  const github = useMemo(
    () => profile.socials.find((s) => s.label.toLowerCase().includes("github"))?.href,
    []
  );

  const linkedin = useMemo(
    () => profile.socials.find((s) => s.label.toLowerCase().includes("linkedin"))?.href,
    []
  );

  const [reveal, setReveal] = useState<RevealKey>(null);
  const toggleReveal = (key: RevealKey) =>
    setReveal((cur) => (cur === key ? null : key));

  const cvPdfHref = "/Romi_Sinizkey_CV.pdf";

  const TRIGGER_SIZE = 70;
  const LOTTIE_SIZE = 70;
  const IMG_SIZE = 35;

  const ICONS = {
    github: "/Side/github.jpg",
    gmail: "/Side/gmail.jpg",
    linkedin: "/Side/linkedin.jpg",
    phone: "/Side/phone.jpg",
    resume: "/Side/resume.jpg",
  } as const;

  const iconStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
    transition: "transform 180ms ease",
  };

  // טריגר שקוף לגמרי
  const triggerStyle: React.CSSProperties = {
    width: TRIGGER_SIZE,
    height: TRIGGER_SIZE,
    background: "transparent",
    border: "none",
    outline: "none",
    padding: 0,
    position: "relative",
    overflow: "visible",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  };

  const triggerHover: React.CSSProperties = {
    transform: "scale(1.04)",
  };

  const bubbleBaseStyle: React.CSSProperties = {
    position: "absolute",
    left: "calc(100% + 12px)",
    top: "50%",
    transform: "translateY(-50%)",
    borderRadius: 9999,
    background: "black",
    padding: "6px 10px",
    fontSize: 11,
    color: "white",
    textDecoration: "none",
    boxShadow: "0 10px 30px rgba(0,0,0,0.35)",
    whiteSpace: "nowrap",
  };

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        zIndex: 99999,
      }}
    >
      <FloatingButton
        trigger={({ toggle }) => (
          <button
            type="button"
            aria-label="Open contact links"
            title="Contact"
            onClick={() => {
              setReveal(null);
              toggle();
            }}
            onMouseEnter={() => setHovered("trigger")}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...triggerStyle,
              ...(hovered === "trigger" ? triggerHover : null),
            }}
          >
            {/* LOTTIE תמיד מופיע */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
              }}
            >
              <DotLottieReact
                src="/Side/WaveAnimation.lottie"
                autoplay
                loop
                style={{
                  width: LOTTIE_SIZE,
                  height: LOTTIE_SIZE,
                  filter:
                  "brightness(0) saturate(100%) contrast(260%) drop-shadow(0 0 10px rgba(0,0,0,0.32))",
                }}
              />
            </span>

            {/* CONTACT תמיד מופיע */}
            <span
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                pointerEvents: "none",
                color: "#000000",
                fontWeight: 900,
                fontSize: 14,
                letterSpacing: "0.14em",
                lineHeight: 1,
                textShadow:
                  "0 0 1px rgba(0,0,0,0.35), 0 0 6px rgba(255,255,255,0.75)",
              }}
            >
              CONTACT
            </span>
          </button>
        )}
      >
        {github && (
          <motion.li variants={item}>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHovered("git")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...iconStyle,
                ...(hovered === "git" ? { transform: "scale(1.1)" } : null),
              }}
            >
              <IconImg src={ICONS.github} alt="GitHub" size={IMG_SIZE} />
            </a>
          </motion.li>
        )}

        {linkedin && (
          <motion.li variants={item}>
            <a
              href={linkedin}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHovered("in")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...iconStyle,
                ...(hovered === "in" ? { transform: "scale(1.1)" } : null),
              }}
            >
              <IconImg src={ICONS.linkedin} alt="LinkedIn" size={IMG_SIZE} />
            </a>
          </motion.li>
        )}

        <motion.li variants={item}>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => toggleReveal("email")}
              onMouseEnter={() => setHovered("mail")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...iconStyle,
                ...(hovered === "mail" ? { transform: "scale(1.1)" } : null),
              }}
            >
              <IconImg src={ICONS.gmail} alt="Gmail" size={IMG_SIZE} />
            </button>

            <AnimatePresence>
              {reveal === "email" ? (
                <motion.a
                  href={`mailto:${profile.email}`}
                  variants={bubble}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  style={bubbleBaseStyle}
                >
                  {profile.email}
                </motion.a>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.li>

        <motion.li variants={item}>
          <div style={{ position: "relative" }}>
            <button
              type="button"
              onClick={() => toggleReveal("phone")}
              onMouseEnter={() => setHovered("phone")}
              onMouseLeave={() => setHovered(null)}
              style={{
                ...iconStyle,
                ...(hovered === "phone" ? { transform: "scale(1.1)" } : null),
              }}
            >
              <IconImg src={ICONS.phone} alt="Phone" size={IMG_SIZE} />
            </button>

            <AnimatePresence>
              {reveal === "phone" ? (
                <motion.a
                  href="tel:0544276740"
                  variants={bubble}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  style={bubbleBaseStyle}
                >
                  0544276740
                </motion.a>
              ) : null}
            </AnimatePresence>
          </div>
        </motion.li>

        <motion.li variants={item}>
          <a
            href={cvPdfHref}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={() => setHovered("pdf")}
            onMouseLeave={() => setHovered(null)}
            style={{
              ...iconStyle,
              ...(hovered === "pdf" ? { transform: "scale(1.1)" } : null),
            }}
          >
            <IconImg src={ICONS.resume} alt="Resume" size={IMG_SIZE} />
          </a>
        </motion.li>
      </FloatingButton>
    </div>
  );
}