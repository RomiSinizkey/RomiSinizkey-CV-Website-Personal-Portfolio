import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { AI_INTENTS, SUGGESTIONS, type AiIntentKey } from "./ai/aiIntents";

type Msg = { id: string; from: "user" | "ai"; text: string };

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
function isHebrew(s: string) {
  return /[\u0590-\u05FF]/.test(s);
}
function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
function addHighlight(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.add("ai-highlight");
  window.setTimeout(() => el.classList.remove("ai-highlight"), 1800);
}
async function scrollToId(id: string) {
  for (let i = 0; i < 12; i++) {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top: y, behavior: "smooth" });
      addHighlight(id);
      return true;
    }
    await sleep(50);
  }
  return false;
}
function findIntent(text: string): AiIntentKey | null {
  const t = text.toLowerCase();
  for (const k of Object.keys(AI_INTENTS) as AiIntentKey[]) {
    const { keywords } = AI_INTENTS[k];
    if (keywords.some((kw) => t.includes(kw))) return k;
  }
  return null;
}
function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      <motion.span
        className="h-1.5 w-1.5"
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="h-1.5 w-1.5"
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
      />
      <motion.span
        className="h-1.5 w-1.5"
        style={{ backgroundColor: "rgba(0,0,0,0.55)" }}
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.24 }}
      />
    </span>
  );
}

function AgentAvatar({ open }: { open: boolean }) {
  return (
    <motion.div className="relative h-10 w-10" transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <motion.div
        className="absolute inset-0 blur-[14px] opacity-25"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(circle at 40% 35%, var(--accent), rgba(255,255,255,0) 62%)" }}
      />
      <motion.div
        className="absolute inset-0 bg-white shadow-[0_18px_45px_rgba(0,0,0,0.16)]"
        animate={{ y: [0, -1.2, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-[42%] flex gap-2">
        <motion.div className="h-2.5 w-2.5 bg-black/75" animate={{ scaleY: [1, 0.12, 1] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }} />
        <motion.div className="h-2.5 w-2.5 bg-black/75" animate={{ scaleY: [1, 0.12, 1] }} transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }} />
      </div>
      <motion.div
        className="absolute left-1/2 top-[62%] -translate-x-1/2 h-[3px] w-4 bg-black/55"
        animate={{ width: open ? 18 : 14 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
    </motion.div>
  );
}

function SparkleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l1.2 5.2L18 8.4l-4.8 1.2L12 14l-1.2-4.4L6 8.4l4.8-1.2L12 2z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
      <path d="M19 13l.6 2.6L22 16l-2.4.4L19 19l-.6-2.6L16 16l2.4-.4L19 13z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12L20 4L13 20L11 13L4 12Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      {collapsed ? (
        <path d="M10 6l6 6-6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M14 6l-6 6 6 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

type BtnPos = { x: number; y: number };
const POS_KEY = "ai_btn_pos_fixed_v1";
const MINI_KEY = "ai_btn_mini_fixed_v1";

export default function AIAssistantWidget() {
  const navigate = useNavigate();
  const location = useLocation();

  // === Hooks ALWAYS at top (no conditionals) ===
  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  const [msgs, setMsgs] = useState<Msg[]>(() => [
    { id: uid(), from: "ai", text: "Hey 👋 I’m your assistant. Ask where something is, or tap a quick action." },
  ]);

  const scrollBoxRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 640px)").matches);

  const [mini, setMini] = useState(() => {
    try {
      return localStorage.getItem(MINI_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [btnPos, setBtnPos] = useState<BtnPos>(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return { x: 16, y: 120 };
      const p = JSON.parse(raw) as BtnPos;
      return { x: typeof p.x === "number" ? p.x : 16, y: typeof p.y === "number" ? p.y : 120 };
    } catch {
      return { x: 16, y: 120 };
    }
  });

  const btnWrapRef = useRef<HTMLDivElement | null>(null);
  const dragState = useRef<{
    dragging: boolean;
    startX: number;
    startY: number;
    startLeft: number;
    startTop: number;
    didDrag: boolean;
  } | null>(null);

  const suppressOpenRef = useRef(false);

  // nicer tooltip
  const [showHint, setShowHint] = useState(false);
  const hintTimerRef = useRef<number | null>(null);

  const showHintFor = (ms: number) => {
    setShowHint(true);
    if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
    hintTimerRef.current = window.setTimeout(() => setShowHint(false), ms);
  };

  useEffect(() => {
    return () => {
      if (hintTimerRef.current) window.clearTimeout(hintTimerRef.current);
    };
  }, []);
  // === Effects ===
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(MINI_KEY, mini ? "1" : "0");
    } catch {}
  }, [mini]);

  useEffect(() => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(btnPos));
    } catch {}
  }, [btnPos]);

  useEffect(() => {
    // keep button in bounds on resize
    const onResize = () => {
      const el = btnWrapRef.current;
      const w = el?.getBoundingClientRect().width ?? 56;
      const h = el?.getBoundingClientRect().height ?? 56;
      setBtnPos((p) => ({
        x: clamp(p.x, 8, window.innerWidth - w - 8),
        y: clamp(p.y, 8, window.innerHeight - h - 8),
      }));
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = scrollBoxRef.current;
    if (!el) return;
    requestAnimationFrame(() => (el.scrollTop = el.scrollHeight));
  }, [msgs, typing, open]);

  // === Logic ===
  const closePanel = () => setOpen(false);

  const goTo = async (route: string, anchorId?: string, options?: { openShowcase?: boolean }) => {
    const same = location.pathname === route;
    if (!same) {
      navigate(route, { replace: false });
      await sleep(120);
    }
    if (options?.openShowcase) window.dispatchEvent(new CustomEvent("home:projects:open"));
    if (anchorId) return await scrollToId(anchorId);
    return true;
  };

  const answer = async (text: string) => {
    if (isHebrew(text)) {
      setTyping(true);
      await sleep(240);
      setTyping(false);
      setMsgs((m) => [...m, { id: uid(), from: "ai", text: 'English only 🙂 (e.g., "Where are the projects?")' }]);
      return;
    }

    const intentKey = findIntent(text);

    setTyping(true);
    await sleep(220);

    if (!intentKey) {
      setTyping(false);
      setMsgs((m) => [...m, { id: uid(), from: "ai", text: 'Try: "Where are the projects?", "Show my experience", "Contact".' }]);
      return;
    }

    const intent = AI_INTENTS[intentKey];

    setTyping(false);
    setMsgs((m) => [...m, { id: uid(), from: "ai", text: intent.reply }]);

    await sleep(120);

    if (intent.action.type === "route") {
      const ok = await goTo(intent.action.route, intent.action.anchorId, { openShowcase: intent.action.openShowcase });
      if (ok) closePanel();
      else setMsgs((m) => [...m, { id: uid(), from: "ai", text: "I couldn’t find that section on this page." }]);
      return;
    }

    if (intent.action.type === "external") {
      const w = window.open(intent.action.href, "_blank", "noreferrer");
      if (w) closePanel();
      else setMsgs((m) => [...m, { id: uid(), from: "ai", text: "Popup blocked — please allow popups and try again." }]);
      return;
    }
  };

  const onSend = async () => {
    const t = input.trim();
    if (!t) return;
    setMsgs((m) => [...m, { id: uid(), from: "user", text: t }]);
    setInput("");
    await answer(t);
  };

  const quickAsk = async (q: string) => {
    if (!open) setOpen(true);
    setMsgs((m) => [...m, { id: uid(), from: "user", text: q }]);
    await answer(q);
  };

  // === Panel rendering ===
  const panelW = isMobile ? "min(260px, calc(100vw - 24px))" : "260px";
  const FULL_H = 300;

  const hostStyle: React.CSSProperties = {
    position: "fixed",
    left: clamp(btnPos.x, 8, Math.max(8, window.innerWidth - 280)),
    top: clamp(btnPos.y + 60, 8, Math.max(8, window.innerHeight - FULL_H - 8)),
    height: `${FULL_H}px`,
    width: panelW,
    maxWidth: "calc(100vw - 24px)",
    zIndex: 2147483646,
    pointerEvents: "auto",
  };

  // === SAFE drag handlers (no extra hooks) ===
  const DRAG_THRESHOLD = 6;
  const BTN_H = isMobile ? 46 : 42;

  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);

    dragState.current = {
      dragging: true,
      startX: e.clientX,
      startY: e.clientY,
      startLeft: btnPos.x,
      startTop: btnPos.y,
      didDrag: false,
    };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const st = dragState.current;
    const el = btnWrapRef.current;
    if (!st?.dragging || !el) return;

    const dx = e.clientX - st.startX;
    const dy = e.clientY - st.startY;
    if (!st.didDrag && Math.hypot(dx, dy) > DRAG_THRESHOLD) st.didDrag = true;

    const rect = el.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;

    const nextX = st.startLeft + dx;
    const nextY = st.startTop + dy;

    const x = clamp(nextX, 8, window.innerWidth - w - 8);
    const y = clamp(nextY, 8, window.innerHeight - h - 8);

    setBtnPos({ x, y });
  };

    const onPointerUp = () => {
      const st = dragState.current;
      dragState.current = null;

      // ✅ if arrow toggled or we explicitly suppressed opening
      if (suppressOpenRef.current) {
        suppressOpenRef.current = false;
        return;
      }

      if (st?.didDrag) return; // prevents open after drag
      setOpen(true);
    };

  if (!mounted) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            className="fixed inset-0"
            style={{ zIndex: 2147483000, background: "rgba(0,0,0,0.65)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {open ? (
          <motion.div
            key="panelHost"
            style={hostStyle}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div style={{ width: panelW, maxWidth: "calc(100vw - 24px)", height: "100%", background: "#fff", overflow: "hidden", display: "flex", flexDirection: "column" }}>
              {/* header */}
              <div style={{ padding: "12px 12px 8px", display: "flex", alignItems: "center", gap: 10, flex: "0 0 auto" }}>
                <AgentAvatar open />
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "rgba(0,0,0,0.85)" }}>AI Assistant</div>
                  <div style={{ fontSize: 11.5, color: "rgba(0,0,0,0.55)" }}>Ask me to navigate.</div>
                </div>

                <div style={{ marginLeft: "auto", display: "flex", gap: 6 }}>
                  <button
                    onClick={() => setOpen(false)}
                    style={{ padding: "6px 8px", fontSize: 11.5, fontWeight: 600, color: "rgba(0,0,0,0.65)", background: "transparent" }}
                    title="Close"
                  >
                    Close
                  </button>
                </div>
              </div>

              {/* suggestions */}
              <div style={{ padding: "0 12px 8px", flex: "0 0 auto" }}>
                <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => quickAsk(s)}
                      style={{
                        padding: "7px 9px",
                        fontSize: 11.5,
                        fontWeight: 600,
                        background: "rgba(0,0,0,0.05)",
                        color: "rgba(0,0,0,0.65)",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* messages */}
              <div style={{ padding: "0 12px 10px", flex: "1 1 auto", minHeight: 0 }}>
                <div ref={scrollBoxRef} style={{ background: "#f3f4f6", padding: 9, height: "100%", overflowY: "auto", overflowX: "hidden" }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {msgs.map((m) => (
                      <div key={m.id} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                        <div
                          style={{
                            maxWidth: "85%",
                            padding: "9px 10px",
                            fontSize: 12.5,
                            lineHeight: 1.35,
                            color: m.from === "user" ? "white" : "rgba(0,0,0,0.82)",
                            background: m.from === "user" ? "var(--accent)" : "#ffffff",
                            boxShadow: m.from === "user" ? "0 10px 25px rgba(0,0,0,0.10)" : "0 6px 16px rgba(0,0,0,0.08)",
                          }}
                        >
                          {m.text}
                        </div>
                      </div>
                    ))}

                    {typing && (
                      <div style={{ display: "flex", justifyContent: "flex-start" }}>
                        <div style={{ background: "#fff", padding: "9px 10px", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                          <TypingDots />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* input */}
              <div style={{ padding: "10px 12px 12px", background: "#ffffff", flex: "0 0 auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ flex: 1, background: "#f3f4f6", padding: "9px 10px" }}>
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onSend();
                      }}
                      style={{ width: "100%", background: "transparent", outline: "none", fontSize: 13, color: "rgba(0,0,0,0.85)" }}
                      placeholder='Example: "Where are the projects?"'
                    />
                  </div>

                  <button
                    onClick={onSend}
                    style={{
                      background: "var(--accent)",
                      color: "white",
                      padding: "9px 12px",
                      fontSize: 11.5,
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      boxShadow: "0 12px 30px rgba(0,0,0,0.16)",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                    }}
                    aria-label="Send"
                  >
                    <SendIcon /> Send
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* CLOSED draggable button */}
      {!open && (
        <div
          ref={btnWrapRef}
          onPointerDown={(e) => {
            onPointerDown(e);
            // show a short hint on touch devices when starting interaction
            if (e.pointerType !== "mouse") showHintFor(1200);
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => {
            if (!isMobile) setShowHint(true);
          }}
          onMouseLeave={() => {
            if (!isMobile) setShowHint(false);
          }}
          style={{
            position: "fixed",
            left: btnPos.x,
            top: btnPos.y,
            zIndex: 2147483647,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            height: BTN_H,
            padding: isMobile ? 0 : "0 12px 0 10px",
            background: "rgba(17,17,17,0.92)",
            color: "#fff",
            borderRadius: 9999,
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(10px)",
            boxShadow: "0 14px 44px rgba(0,0,0,0.20)",
            touchAction: "none",
            userSelect: "none",
            cursor: "grab",
          }}
          aria-label="AI assistant button"
        >
          {/* ✅ Pretty tooltip */}
          {showHint && (
            <div
              style={{
                position: "absolute",
                left: 0,
                top: "calc(100% + 10px)",
                width: "max-content",
                maxWidth: "min(260px, calc(100vw - 24px))",
                padding: "10px 12px",
                borderRadius: 12,
                background: "rgba(15,15,15,0.92)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 18px 55px rgba(0,0,0,0.30)",
                color: "rgba(255,255,255,0.92)",
                fontSize: 12.5,
                lineHeight: 1.25,
                pointerEvents: "none",
                transform: "translateY(0)",
                zIndex: 2147483647,
              }}
            >
              <div style={{ fontWeight: 800, letterSpacing: "0.02em" }}>Tip</div>
              <div style={{ marginTop: 4, color: "rgba(255,255,255,0.78)" }}>
                Drag to move • Click to open
              </div>

              {/* little arrow */}
              <div
                style={{
                  position: "absolute",
                  top: -6,
                  left: 18,
                  width: 12,
                  height: 12,
                  background: "rgba(15,15,15,0.92)",
                  borderLeft: "1px solid rgba(255,255,255,0.12)",
                  borderTop: "1px solid rgba(255,255,255,0.12)",
                  transform: "rotate(45deg)",
                }}
              />
            </div>
          )}

          {/* arrow toggle (desktop only) */}
            {!isMobile && (
              <div
                role="button"
                tabIndex={0}
                data-no-open
                onPointerDown={(e) => {
                  e.stopPropagation();
                  suppressOpenRef.current = true;
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                  suppressOpenRef.current = true;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  suppressOpenRef.current = true;
                  setMini((v) => !v);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    e.stopPropagation();
                    suppressOpenRef.current = true;
                    setMini((v) => !v);
                  }
                }}
                style={{
                  height: 26,
                  width: 26,
                  borderRadius: 9999,
                  display: "grid",
                  placeItems: "center",
                  background: "rgba(255,255,255,0.10)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  cursor: "pointer",
                  flex: "0 0 auto",
                }}
                aria-label={mini ? "Expand" : "Collapse"}
                title={mini ? "Expand" : "Collapse"}
              >
                <ChevronIcon collapsed={mini} />
              </div>
            )}

          <span
            style={{
              width: isMobile ? 30 : 28,
              height: isMobile ? 30 : 28,
              display: "grid",
              placeItems: "center",
              borderRadius: 9999,
              background: "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.10)",
              flex: "0 0 auto",
            }}
          >
            <SparkleIcon />
          </span>

          {!mini && !isMobile && (
            <>
              <span style={{ fontSize: 13, fontWeight: 800, letterSpacing: "0.06em", whiteSpace: "nowrap", lineHeight: 1 }}>
                Need help?
              </span>
              <span aria-hidden="true" style={{ width: 8, height: 8, borderRadius: 9999, background: "rgba(255,255,255,0.35)", marginLeft: 2 }} />
            </>
          )}
        </div>
      )}
    </>,
    document.body
  );
}