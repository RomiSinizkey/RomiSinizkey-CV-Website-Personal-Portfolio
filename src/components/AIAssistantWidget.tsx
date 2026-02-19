import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
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
      <path
        d="M12 2l1.2 5.2L18 8.4l-4.8 1.2L12 14l-1.2-4.4L6 8.4l4.8-1.2L12 2z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 13l.6 2.6L22 16l-2.4.4L19 19l-.6-2.6L16 16l2.4-.4L19 13z"
        stroke="white"
        strokeWidth="2"
        strokeLinejoin="round"
      />
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

export default function AIAssistantWidget() {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<"full" | "mini">("full");
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");
  const [mounted, setMounted] = useState(false);

  const [msgs, setMsgs] = useState<Msg[]>(() => [
    { id: uid(), from: "ai", text: "Hey 👋 I’m your assistant. Ask where something is, or tap a quick action." },
  ]);

  const endRef = useRef<HTMLDivElement | null>(null);

  const btnRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // your positions
  const BTN_LEFT = 0;
  const BTN_TOP = 117;

  const HOST_PAD = 14;
  const VIEW_MARGIN = 14;

  const [panelPos, setPanelPos] = useState<{ left: number; top: number } | null>(null);
  const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

  const computePanelPos = () => {
    const btn = btnRef.current;
    const panel = panelRef.current;
    if (!btn || !panel) return;

    const br = btn.getBoundingClientRect();
    const pr = panel.getBoundingClientRect();

    const gap = 12;
    const totalW = pr.width + HOST_PAD * 2;
    const totalH = pr.height + HOST_PAD * 2;

    // Prefer RIGHT of button
    let left = br.right + gap;
    let top = br.top;

    const fitsRight = left + totalW <= window.innerWidth - VIEW_MARGIN;

    if (!fitsRight) {
      left = br.left;
      top = br.bottom + gap;
    }

    if (top + totalH > window.innerHeight - VIEW_MARGIN) {
      top = br.top - totalH - gap;
    }

    left = clamp(left, VIEW_MARGIN, window.innerWidth - totalW - VIEW_MARGIN);
    top = clamp(top, VIEW_MARGIN, window.innerHeight - totalH - VIEW_MARGIN);

    setPanelPos({ left, top });
  };

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs, typing, open, mode]);

  useLayoutEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => computePanelPos());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  useEffect(() => {
    if (!open) return;
    const onResize = () => computePanelPos();
    const onScroll = () => computePanelPos();
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onScroll, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, mode]);

  const lastSnippet = useMemo(() => {
    const last = [...msgs].reverse().find((m) => m.from === "ai" || m.from === "user");
    if (!last) return "";
    return last.text.length > 92 ? last.text.slice(0, 92) + "…" : last.text;
  }, [msgs]);

  const goTo = async (route: string, anchorId?: string, options?: { openShowcase?: boolean }) => {
    const same = location.pathname === route;
    if (!same) {
      navigate(route, { replace: false });
      await sleep(70);
    }
    if (options?.openShowcase) window.dispatchEvent(new CustomEvent("home:projects:open"));
    if (anchorId) await scrollToId(anchorId);
  };

  const answer = async (text: string) => {
    if (isHebrew(text)) {
      setTyping(true);
      await sleep(240);
      setTyping(false);
      setMsgs((m) => [...m, { id: uid(), from: "ai", text: "English only 🙂 (e.g., “Where are the projects?”)" }]);
      return;
    }

    const intentKey = findIntent(text);

    setTyping(true);
    await sleep(220);

    if (!intentKey) {
      setTyping(false);
      setMsgs((m) => [...m, { id: uid(), from: "ai", text: "Try: “Where are the projects?”, “Show my experience”, “Contact”." }]);
      return;
    }

    const intent = AI_INTENTS[intentKey];

    setTyping(false);
    setMsgs((m) => [...m, { id: uid(), from: "ai", text: intent.reply }]);

    await sleep(120);

    if (intent.action.type === "route") {
      await goTo(intent.action.route, intent.action.anchorId, { openShowcase: intent.action.openShowcase });
      return;
    }
    if (intent.action.type === "external") {
      window.open(intent.action.href, "_blank", "noreferrer");
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
    if (mode !== "full") setMode("full");
    setMsgs((m) => [...m, { id: uid(), from: "user", text: q }]);
    await answer(q);
  };

  // ---------------- UI: SQUARE + CLEAN ----------------
  const PanelFull = (
    <div ref={panelRef} className="w-[390px] max-w-[92vw]">
      <div
        style={{
          background: "#ffffff",
          boxShadow: "0 30px 120px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        {/* header */}
        <div style={{ padding: "14px 14px 10px", display: "flex", alignItems: "center", gap: 12 }}>
          <AgentAvatar open />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "rgba(0,0,0,0.85)" }}>AI Assistant</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.55)" }}>Ask me to navigate.</div>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <button
              onClick={() => setMode("mini")}
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0,0,0,0.65)",
                background: "transparent",
              }}
              title="Minimize"
            >
              Minimize
            </button>
            <button
              onClick={() => setOpen(false)}
              style={{
                padding: "6px 10px",
                fontSize: 12,
                fontWeight: 600,
                color: "rgba(0,0,0,0.65)",
                background: "transparent",
              }}
              title="Close"
            >
              Close
            </button>
          </div>
        </div>

        {/* suggestions */}
        <div style={{ padding: "0 14px 10px" }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto" }}>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => quickAsk(s)}
                style={{
                  padding: "8px 10px",
                  fontSize: 12,
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
        <div style={{ padding: "0 14px 12px" }}>
          <div
            style={{
              background: "#f3f4f6",
              padding: 12,
              maxHeight: "min(46vh, 340px)",
              overflow: "auto",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {msgs.map((m) => (
                <div key={m.id} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start" }}>
                  <div
                    style={{
                      maxWidth: "85%",
                      padding: "10px 12px",
                      fontSize: 13,
                      lineHeight: 1.4,
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
                  <div style={{ background: "#fff", padding: "10px 12px", boxShadow: "0 6px 16px rgba(0,0,0,0.08)" }}>
                    <TypingDots />
                  </div>
                </div>
              )}

              <div ref={endRef} />
            </div>
          </div>
        </div>

        {/* input */}
        <div style={{ padding: "12px 14px 14px", background: "#ffffff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ flex: 1, background: "#f3f4f6", padding: "10px 12px" }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") onSend();
                }}
                style={{ width: "100%", background: "transparent", outline: "none", fontSize: 14, color: "rgba(0,0,0,0.85)" }}
                placeholder='Example: "Where are the projects?"'
              />
            </div>

            <button
              onClick={onSend}
              style={{
                background: "var(--accent)",
                color: "white",
                padding: "10px 16px",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.18em",
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
    </div>
  );

  const PanelMini = (
    <div ref={panelRef} className="w-[320px] max-w-[86vw]">
      <div
        style={{
          background: "#ffffff",
          boxShadow: "0 22px 80px rgba(0,0,0,0.18)",
          overflow: "hidden",
        }}
      >
        <div style={{ padding: 12, display: "flex", alignItems: "center", gap: 12 }}>
          <AgentAvatar open />
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "rgba(0,0,0,0.82)" }}>AI Assistant</div>
            <div style={{ fontSize: 12, color: "rgba(0,0,0,0.60)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {lastSnippet}
            </div>
          </div>

          <button
            onClick={() => setMode("full")}
            style={{
              background: "var(--accent)",
              color: "white",
              padding: "10px 14px",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
            }}
          >
            Expand
          </button>
        </div>
      </div>
    </div>
  );

  if (!mounted) return null;

  return createPortal(
    <>
      {/* backdrop */}
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

      {/* panel host */}
      <AnimatePresence>
        {open ? (
          <motion.div
            key="panelHost"
            style={{
              position: "fixed",
              left: panelPos?.left ?? BTN_LEFT,
              top: panelPos?.top ?? BTN_TOP + 56,
              zIndex: 2147483646,
              pointerEvents: "auto",
              padding: HOST_PAD,
            }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            {mode === "full" ? PanelFull : PanelMini}
          </motion.div>
        ) : null}
      </AnimatePresence>

      {/* button (still rounded per your current code – tell me if you want it square too) */}
        <motion.button
          ref={btnRef}
          onClick={() => {
            setOpen((v) => {
              const next = !v;
              if (next) setMode("full");
              return next;
            });
            setTimeout(() => computePanelPos(), 0);
          }}
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.96 }}
          animate={{
            scale: open ? 1 : [1, 1.01, 1],
          }}
          transition={{
            duration: open ? 0.2 : 2.4,
            repeat: open ? 0 : Infinity,
            ease: "easeInOut",
          }}
          style={{
            position: "fixed",
            left: BTN_LEFT,
            top: BTN_TOP,
            zIndex: 2147483647,
            pointerEvents: "auto",

            height: 42,
            padding: "0 14px 0 10px",
            display: "inline-flex",
            alignItems: "center",
            gap: 10,

            // ✅ pro look: dark when closed, accent when open
            background: open ? "var(--accent)" : "rgba(17,17,17,0.92)",
            color: "#fff",

            borderRadius: 9999,
            border: open ? "1px solid rgba(255,255,255,0.18)" : "1px solid rgba(255,255,255,0.10)",

            // ✅ glass + shadow
            backdropFilter: "blur(10px)",
            boxShadow: open
              ? "0 18px 52px rgba(0,0,0,0.28)"
              : "0 14px 44px rgba(0,0,0,0.20)",
          }}
          aria-label="Open assistant help"
        >
          {/* glow layer (behind icon) */}
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: 10,
              top: "50%",
              transform: "translateY(-50%)",
              width: 30,
              height: 30,
              borderRadius: 9999,
               // ✅ no filter blur (fixes warning)
              background: "transparent",
              boxShadow: open
                ? "0 0 0 10px rgba(255,255,255,0.10), 0 0 24px 10px rgba(255,255,255,0.18)"
                : "0 0 0 0 rgba(0,0,0,0)",
              opacity: open ? 0.35 : 0.0,
              pointerEvents: "none",
            }}
          />

          {/* icon bubble */}
          <motion.span
            animate={{
              rotate: open ? 0 : [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 3.2,
              repeat: open ? 0 : Infinity,
              ease: "easeInOut",
            }}
            style={{
              width: 28,
              height: 28,
              display: "grid",
              placeItems: "center",
              borderRadius: 9999,
              background: open ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.12)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: open ? "0 10px 22px rgba(0,0,0,0.16)" : "none",
              flex: "0 0 auto",
            }}
          >
            <SparkleIcon />
          </motion.span>

          {/* label */}
          <span
            style={{
              fontSize: 13,
              fontWeight: 800,
              letterSpacing: "0.06em",
              whiteSpace: "nowrap",
              lineHeight: 1,
            }}
          >
            Need help?
          </span>

          {/* tiny status indicator */}
          <span
            aria-hidden="true"
            style={{
              width: 8,
              height: 8,
              borderRadius: 9999,
              background: open ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)",
              boxShadow: open ? "0 0 0 4px rgba(255,255,255,0.18)" : "none",
              marginLeft: 2,
            }}
          />
        </motion.button>

    </>,
    document.body
  );
}
