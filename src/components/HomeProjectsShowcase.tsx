import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/profile";
import ProjectFxOverlay from "./ProjectFxOverlay";
import type { FxKey } from "./ProjectFxOverlay";

type Dir = "down" | "up";

function shortName(name: string) {
  const parts = name.trim().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  return parts.map((w) => w[0].toUpperCase()).join("");
}

function projectBadge(name: string) {
  const lower = name.toLowerCase();
  if (lower.includes("smart") || lower.includes("order")) return "SOD";
  if (lower.includes("chatroom") || lower.includes("chat")) return "CHAT";
  if (lower.includes("gta")) return "GTA";
  return shortName(name).slice(0, 6);
}

function fxFromBadge(badge: string): FxKey {
  if (badge === "SOD") return "sod";
  if (badge === "CHAT") return "chat";
  if (badge === "GTA") return "gta";
  return null;
}

export default function HomeProjectsShowcase() {
  const projects = profile.projects ?? [];
  const items = useMemo(() => projects.slice(0, 3), [projects]); // עד 3 פרויקטים
  if (items.length === 0) return null;

  const SHOW_AT = 180;
  const HIDE_AT = 120;

  const [show, setShow] = useState(false);
  const [dir, setDir] = useState<Dir>("down");
  const [activeFx, setActiveFx] = useState<FxKey>(null);

  const lastY = useRef(0);
  const raf = useRef<number | null>(null);
  const showRef = useRef(false);

  // אם כבר גוללת מתחת לסף — תציג
  useEffect(() => {
    lastY.current = window.scrollY;
    const shouldShowNow = window.scrollY > SHOW_AT;
    showRef.current = shouldShowNow;
    setShow(shouldShowNow);
  }, []);

  // פתיחה יזומה בלחיצה על Projects
  useEffect(() => {
    const onOpen = () => {
      setDir("down");
      showRef.current = true;
      setShow(true);
    };
    window.addEventListener("home:projects:open", onOpen as any);
    return () => window.removeEventListener("home:projects:open", onOpen as any);
  }, []);

  // גלילה: יורד → מופיע, עולה → נעלם
  useEffect(() => {
    const onScroll = () => {
      if (raf.current) return;

      raf.current = window.requestAnimationFrame(() => {
        raf.current = null;

        const y = window.scrollY;
        const goingDown = y > lastY.current + 2;
        const goingUp = y < lastY.current - 2;
        lastY.current = y;

        if (goingDown) setDir("down");
        if (goingUp) setDir("up");

        if (!showRef.current && goingDown && y > SHOW_AT) {
          showRef.current = true;
          setShow(true);
        }

        if (showRef.current && goingUp && y < HIDE_AT) {
          showRef.current = false;
          setShow(false);
          setActiveFx(null);
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, []);

  const enter =
    dir === "down"
      ? { opacity: 0, x: 120, filter: "blur(10px)" }
      : { opacity: 0, x: 60, filter: "blur(8px)" };

  const exit =
    dir === "up"
      ? { opacity: 0, x: 120, filter: "blur(10px)" }
      : { opacity: 0, x: 60, filter: "blur(8px)" };

  return (
    <>
      <ProjectFxOverlay fx={activeFx} />

      <AnimatePresence>
        {show && (
          <motion.div
            className="fixed right-8 bottom-8 z-[9998]"
            style={{ right: 32, bottom: 70 }}
            initial={enter}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={exit}
            transition={{ type: "spring", stiffness: 260, damping: 24 }}
          >
            {/* ✅ כאן ההפרדה: פרויקטים למעלה, MORE למטה */}
            <div className="w-[220px] h-[300px] flex flex-col items-end justify-between">
              {/* פרויקטים למעלה */}
              <div className="flex flex-col items-end gap-7">
                {items.map((p) => {
                  const badge = projectBadge(p.name);
                  const fxKey = fxFromBadge(badge);
                  const href = p.link;

                  return (
                    <motion.a
                      key={href}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="select-none"
                      onHoverStart={() => setActiveFx(fxKey)}
                      onHoverEnd={() => setActiveFx(null)}
                      whileTap={{ scale: 0.985 }}
                    >
                      <span className="relative block">
                        <span
                          className="
                            absolute -inset-4 -z-10
                            rounded-[22px]
                            bg-white/55 backdrop-blur-md
                            shadow-[0_18px_55px_rgba(0,0,0,0.14)]
                          "
                        />

                        <motion.span
                          className="
                            block
                            text-[84px] md:text-[104px]
                            font-black
                            leading-[0.86]
                            text-black
                            text-right
                            tracking-[-0.06em]
                          "
                          whileHover={{ x: -6 }}
                          transition={{ type: "spring", stiffness: 380, damping: 26 }}
                        >
                          {badge.split("").map((ch, i) => (
                            <motion.span
                              key={`${badge}-${i}`}
                              className="inline-block"
                              whileHover={{
                                y: i % 2 === 0 ? -5 : -3,
                                rotate: i % 2 === 0 ? -2 : 2,
                              }}
                              transition={{ type: "spring", stiffness: 600, damping: 22 }}
                              style={{ marginRight: i === badge.length - 1 ? 0 : 1 }}
                            >
                              {ch}
                            </motion.span>
                          ))}
                        </motion.span>

                        <span className="mt-1 block text-[11px] font-semibold tracking-[0.18em] uppercase text-black/55 text-right">
                          {p.name}
                        </span>
                      </span>
                    </motion.a>
                  );
                })}
              </div>

              {/* MORE למטה – Premium CTA (clean + bigger) */}
                <motion.a
                  href="https://github.com/RomiSinizkey"
                  target="_blank"
                  rel="noreferrer"
                  className="
                    group relative
                    inline-flex items-center justify-end
                    text-[18px] md:text-[20px]
                    font-extrabold
                    tracking-[0.24em]
                    uppercase
                    cursor-pointer
                    logoAccent
                  "
                  onHoverStart={() => setActiveFx(null)}
                  whileHover={{ x: -8, scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {/* glow עדין */}
                  <span
                    className="
                      absolute inset-0 -z-10
                      opacity-0 group-hover:opacity-100
                      transition duration-300
                      blur-2xl
                    "
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(234,88,12,0.35), transparent 70%)",
                    }}
                  />

                  MORE.PROJECTS →
                </motion.a>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
