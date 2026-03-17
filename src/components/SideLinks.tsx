'use client';

import { useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { profile } from "../data/profile";
import "../styles/components/uvButtonStyles.css";

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
          marginBottom: 30,
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

export default function SideLinks() {
  const github = useMemo(
    () => profile.socials.find((s) => s.label.toLowerCase().includes("github"))?.href,
    []
  );

  const linkedin = useMemo(
    () => profile.socials.find((s) => s.label.toLowerCase().includes("linkedin"))?.href,
    []
  );

  const linkedinInitials = useMemo(
    () =>
      profile.fullName
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    []
  );

  const linkedinUsername = useMemo(() => {
    if (!linkedin) return "@linkedin";

    try {
      const pathParts = new URL(linkedin).pathname.split("/").filter(Boolean);
      const handle = pathParts[pathParts.length - 1];
      return handle ? `@${handle}` : "@linkedin";
    } catch {
      return "@linkedin";
    }
  }, [linkedin]);

  const [reveal, setReveal] = useState<RevealKey>(null);
  const toggleReveal = (key: RevealKey) =>
    setReveal((cur) => (cur === key ? null : key));

  const cvPdfHref = "/Romi_Sinizkey_CV.pdf";

  const TRIGGER_WIDTH = 80;
  const TRIGGER_HEIGHT = 30;
  const LOTTIE_WIDTH = 170;
  const LOTTIE_HEIGHT = 70;
  const FLOATING_SCALE = 0.90;
  const BASE_TRIGGER_WIDTH = 80;
  const SIDE_LEFT_BASE = 30;
  const SIDE_BOTTOM = 24;
  const SIDE_LEFT = SIDE_LEFT_BASE + (BASE_TRIGGER_WIDTH - TRIGGER_WIDTH) / 2;

  // טריגר שקוף לגמרי
  const triggerStyle: React.CSSProperties = {
    width: TRIGGER_WIDTH,
    height: TRIGGER_HEIGHT,
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
        left: SIDE_LEFT,
        bottom: SIDE_BOTTOM,
        transform: `scale(${FLOATING_SCALE})`,
        transformOrigin: "left bottom",
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
            {/* LOTTIE */}
            <span
              style={{
                position: "absolute",
                width: LOTTIE_WIDTH,
                height: LOTTIE_HEIGHT,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                pointerEvents: "none",
              }}
            >
              <DotLottieReact
                src="/Side/WaveAnimation.lottie"
                autoplay
                loop
                style={{
                  width: "100%",
                  height: "100%",
                  filter:
                    "brightness(0) saturate(100%) contrast(260%) drop-shadow(0 0 10px rgba(0,0,0,0.32))",
                }}
              />
            </span>

            {/* TEXT STROKE BUTTON */}
            <div className="stroke-button" aria-hidden="true">
              <span className="actual-text">CONTACT</span>
              <span aria-hidden="true" className="hover-text">CONTACT</span>
            </div>
          </button>
        )}
      >
        {github && (
          <motion.li variants={item}>
            <a
              href={github}
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
              title="GitHub"
              className="sl-github-btn"
            >
              <svg
                width="40"
                height="40"
                fill="#0092E4"
                xmlns="http://www.w3.org/2000/svg"
                data-name="Layer 1"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M12,2.2467A10.00042,10.00042,0,0,0,8.83752,21.73419c.5.08752.6875-.21247.6875-.475,0-.23749-.01251-1.025-.01251-1.86249C7,19.85919,6.35,18.78423,6.15,18.22173A3.636,3.636,0,0,0,5.125,16.8092c-.35-.1875-.85-.65-.01251-.66248A2.00117,2.00117,0,0,1,6.65,17.17169a2.13742,2.13742,0,0,0,2.91248.825A2.10376,2.10376,0,0,1,10.2,16.65923c-2.225-.25-4.55-1.11254-4.55-4.9375a3.89187,3.89187,0,0,1,1.025-2.6875,3.59373,3.59373,0,0,1,.1-2.65s.83747-.26251,2.75,1.025a9.42747,9.42747,0,0,1,5,0c1.91248-1.3,2.75-1.025,2.75-1.025a3.59323,3.59323,0,0,1,.1,2.65,3.869,3.869,0,0,1,1.025,2.6875c0,3.83747-2.33752,4.6875-4.5625,4.9375a2.36814,2.36814,0,0,1,.675,1.85c0,1.33752-.01251,2.41248-.01251,2.75,0,.26251.1875.575.6875.475A10.0053,10.0053,0,0,0,12,2.2467Z"></path>
              </svg>
            </a>
          </motion.li>
        )}

        {linkedin && (
          <motion.li variants={item}>
            <div className="sl-linkedin-tooltip-container">
              <div className="sl-linkedin-tooltip">
                <div className="sl-linkedin-card">
                  <div className="sl-linkedin-user-row">
                    <div className="sl-linkedin-avatar">{linkedinInitials}</div>
                    <div className="sl-linkedin-details">
                      <div className="sl-linkedin-name">{profile.fullName}</div>
                      <div className="sl-linkedin-handle">{linkedinUsername}</div>
                    </div>
                  </div>
                  <div className="sl-linkedin-about">{profile.headline}</div>
                </div>
              </div>

              <a
                className="sl-linkedin-trigger"
                href={linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <div className="sl-linkedin-layer">
                  <span></span>
                  <span></span>
                  <span></span>
                  <span></span>
                  <span className="sl-linkedin-fab">
                    <svg viewBox="0 0 448 512" height="1em" aria-hidden="true">
                      <path d="M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z" />
                    </svg>
                  </span>
                </div>
              </a>
            </div>
          </motion.li>
        )}

        <motion.li variants={item}>
          <div style={{ position: "relative" }}>
            <button
              className="Btn"
              onClick={() => toggleReveal("email")}
              onMouseEnter={() => setHovered("mail")}
              onMouseLeave={() => setHovered(null)}
              aria-label="Contact Email"
              title="Contact"
              type="button"
            >
              <span className="svgContainer">
                <svg
                  viewBox="0 0 512 512"
                  fill="white"
                  height="1.4em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M502.3 190.8L327.4 338c-15.4 12.9-38.5 12.9-53.9 0L9.7 190.8C3.9 186 0 179 0 171.3V112c0-26.5 21.5-48 48-48h416c26.5 0 48 21.5 48 48v59.3c0 7.7-3.9 14.7-9.7 19.5zM0 208.8l212.3 178.4c25.1 21.1 62.3 21.1 87.4 0L512 208.8V400c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V208.8z" />
                </svg>
              </span>
              <span className="BG"></span>
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
              aria-label="Phone"
              className="sl-phone-btn"
            >
              <span className="sl-phone-svg-container">
                <svg
                  viewBox="0 0 448 512"
                  fill="white"
                  height="1.6em"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7 .9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"></path>
                </svg>
              </span>
              <span className="sl-phone-bg"></span>
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
            aria-label="Resume"
            title="Resume"
            className="sl-resume-btn"
          >
            <span className="sl-resume-svg-container">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M6 2h7l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" />
                <path d="M13 2v5h5" />
                <circle cx="9" cy="12" r="1.4" />
                <path d="M7 16c.6-1.4 3.4-1.4 4 0" />
                <path d="M13 12h3" />
                <path d="M13 15h3" />
              </svg>
            </span>
            <span className="sl-resume-bg"></span>
          </a>
        </motion.li>
      </FloatingButton>
    </div>
  );
}