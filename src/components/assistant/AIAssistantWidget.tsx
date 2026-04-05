import { useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { AI_INTENTS, SUGGESTIONS, type AiIntentKey } from "./aiIntents";
import AILoader from "./AILoader";
import "../../styles/assistant/aiAssistantWidget.css";

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
        className="h-1.5 w-1.5 rounded-full aiw-typing-dot"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.span
        className="h-1.5 w-1.5 rounded-full aiw-typing-dot"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.12 }}
      />
      <motion.span
        className="h-1.5 w-1.5 rounded-full aiw-typing-dot"
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: 0.24 }}
      />
    </span>
  );
}

function AgentAvatar({ open }: { open: boolean }) {
  return (
    <motion.div className="aiw-avatar" transition={{ type: "spring", stiffness: 260, damping: 22 }}>
      <motion.div
        className="aiw-avatar-glow"
        animate={{ scale: [1, 1.06, 1] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="aiw-avatar-core"
        animate={{ y: [0, -1.2, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      />
      <div className="aiw-avatar-eyes">
        <motion.div
          className="aiw-avatar-eye"
          animate={{ scaleY: [1, 0.12, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="aiw-avatar-eye"
          animate={{ scaleY: [1, 0.12, 1] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.1 }}
        />
      </div>
      <motion.div
        className="aiw-avatar-mouth"
        animate={{ width: open ? 18 : 14 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      />
    </motion.div>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12L20 4L13 20L11 13L4 12Z" stroke="white" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}



type BtnPos = { x: number; y: number };
type PanelSize = { width: number; height: number };
const POS_KEY = "ai_btn_pos_fixed_v1";
const MINI_KEY = "ai_btn_mini_fixed_v1";
const SIZE_KEY = "ai_panel_size_v1";
const LOADER_HIDDEN_KEY = "ai_loader_hidden_v1";

const PANEL_MIN_W = 260;
const PANEL_MAX_W = 520;
const PANEL_MIN_H = 300;
const PANEL_MAX_H = 700;
const PANEL_RESIZE_STEP = 24;

interface AIAssistantWidgetProps {
  ready?: boolean;
}

export default function AIAssistantWidget({ ready = true }: AIAssistantWidgetProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const [open, setOpen] = useState(false);
  const [typing, setTyping] = useState(false);
  const [input, setInput] = useState("");

  const [msgs, setMsgs] = useState<Msg[]>(() => [
    { id: uid(), from: "ai", text: "Hey 👋 I’m your assistant. Ask where something is, or tap a quick action." },
  ]);

  const scrollBoxRef = useRef<HTMLDivElement | null>(null);

  const [isMobile, setIsMobile] = useState(() => window.matchMedia("(max-width: 640px)").matches);

  const [mini] = useState(() => {
    try {
      return localStorage.getItem(MINI_KEY) === "1";
    } catch {
      return false;
    }
  });

  const [panelSize, setPanelSize] = useState<PanelSize>(() => {
    try {
      const raw = localStorage.getItem(SIZE_KEY);
      if (!raw) return { width: 320, height: 420 };
      const parsed = JSON.parse(raw) as PanelSize;
      return {
        width: typeof parsed.width === "number" ? parsed.width : 320,
        height: typeof parsed.height === "number" ? parsed.height : 420,
      };
    } catch {
      return { width: 320, height: 420 };
    }
  });

  const [btnPos, setBtnPos] = useState<BtnPos>(() => {
    try {
      const raw = localStorage.getItem(POS_KEY);
      if (!raw) return { x: 16, y: 120 };
      const p = JSON.parse(raw) as BtnPos;
      return {
        x: typeof p.x === "number" ? p.x : 16,
        y: typeof p.y === "number" ? p.y : 120,
      };
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

  const [showHint, setShowHint] = useState(false);

  const [loaderHidden, setLoaderHidden] = useState(() => {
    try {
      return localStorage.getItem(LOADER_HIDDEN_KEY) === "1";
    } catch {
      return false;
    }
  });

  const hideHint = () => setShowHint(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.matchMedia("(max-width: 640px)").matches);
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(MINI_KEY, mini ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  }, [mini]);

  useEffect(() => {
    try {
      localStorage.setItem(POS_KEY, JSON.stringify(btnPos));
    } catch {
      // ignore storage errors
    }
  }, [btnPos]);

  useEffect(() => {
    try {
      localStorage.setItem(SIZE_KEY, JSON.stringify(panelSize));
    } catch {
      // ignore storage errors
    }
  }, [panelSize]);

  useEffect(() => {
    try {
      localStorage.setItem(LOADER_HIDDEN_KEY, loaderHidden ? "1" : "0");
    } catch {
      // ignore storage errors
    }
  }, [loaderHidden]);

  useEffect(() => {
    const onResize = () => {
      const maxWByViewport = Math.max(PANEL_MIN_W, window.innerWidth - 24);
      const maxHByViewport = Math.max(PANEL_MIN_H, window.innerHeight - 16);
      const allowedMaxW = Math.min(PANEL_MAX_W, maxWByViewport);
      const allowedMaxH = Math.min(PANEL_MAX_H, maxHByViewport);

      setPanelSize((current) => ({
        width: clamp(current.width, PANEL_MIN_W, allowedMaxW),
        height: clamp(current.height, PANEL_MIN_H, allowedMaxH),
      }));
    };

    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
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
    requestAnimationFrame(() => {
      el.scrollTop = el.scrollHeight;
    });
  }, [msgs, typing, open]);

  const closePanel = () => setOpen(false);

  const goTo = async (
    route: string,
    anchorId?: string
  ) => {
    const same = location.pathname === route;
    if (!same) {
      navigate(route, { replace: false });
      await sleep(120);
    }
    if (anchorId) return await scrollToId(anchorId);
    return true;
  };

  const answer = async (text: string) => {
    if (isHebrew(text)) {
      setTyping(true);
      await sleep(240);
      setTyping(false);
      setMsgs((m) => [
        ...m,
        { id: uid(), from: "ai", text: 'English only 🙂 (e.g., "Where are the projects?")' },
      ]);
      return;
    }

    const intentKey = findIntent(text);

    setTyping(true);
    await sleep(220);

    if (!intentKey) {
      setTyping(false);
      setMsgs((m) => [
        ...m,
        { id: uid(), from: "ai", text: 'Try: "Where are the projects?", "Show my experience", "Contact".' },
      ]);
      return;
    }

    const intent = AI_INTENTS[intentKey];

    setTyping(false);
    setMsgs((m) => [...m, { id: uid(), from: "ai", text: intent.reply }]);

    await sleep(120);

    if (intent.action.type === "route") {
      const ok = await goTo(intent.action.route, intent.action.anchorId);
      if (ok) closePanel();
      else {
        setMsgs((m) => [
          ...m,
          { id: uid(), from: "ai", text: "I couldn’t find that section on this page." },
        ]);
      }
      return;
    }

    if (intent.action.type === "external") {
      const w = window.open(intent.action.href, "_blank", "noreferrer");
      if (w) closePanel();
      else {
        setMsgs((m) => [
          ...m,
          { id: uid(), from: "ai", text: "Popup blocked — please allow popups and try again." },
        ]);
      }
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

  const maxWByViewport = Math.max(PANEL_MIN_W, window.innerWidth - 24);
  const maxHByViewport = Math.max(PANEL_MIN_H, window.innerHeight - 16);
  const allowedMaxW = Math.min(PANEL_MAX_W, maxWByViewport);
  const allowedMaxH = Math.min(PANEL_MAX_H, maxHByViewport);

  const panelWidth = clamp(panelSize.width, PANEL_MIN_W, allowedMaxW);
  const panelHeight = clamp(panelSize.height, PANEL_MIN_H, allowedMaxH);

  const canShrink = panelWidth > PANEL_MIN_W || panelHeight > PANEL_MIN_H;
  const canGrow = panelWidth < allowedMaxW || panelHeight < allowedMaxH;

  const resizePanel = (delta: number) => {
    setPanelSize((current) => ({
      width: clamp(current.width + delta, PANEL_MIN_W, allowedMaxW),
      height: clamp(current.height + delta, PANEL_MIN_H, allowedMaxH),
    }));
  };

  const hostStyle: CSSProperties = {
    position: "fixed",
    left: clamp(btnPos.x, 8, Math.max(8, window.innerWidth - panelWidth - 8)),
    top: clamp(btnPos.y + 60, 8, Math.max(8, window.innerHeight - panelHeight - 8)),
    height: `${panelHeight}px`,
    width: `${panelWidth}px`,
    maxWidth: "calc(100vw - 24px)",
    zIndex: 2147483646,
    pointerEvents: "auto",
  };

  const DRAG_THRESHOLD = 6;

  const onPointerDown = (e: PointerEvent) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    hideHint();
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

  const onPointerMove = (e: PointerEvent) => {
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

    setBtnPos({
      x: clamp(nextX, 8, window.innerWidth - w - 8),
      y: clamp(nextY, 8, window.innerHeight - h - 8),
    });
  };

  const onPointerUp = () => {
    hideHint();
    const st = dragState.current;
    dragState.current = null;

    if (suppressOpenRef.current) {
      suppressOpenRef.current = false;
      return;
    }

    if (st?.didDrag) return;
    if (loaderHidden) return;
    setOpen(true);
  };

  const onLoaderTogglePointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    suppressOpenRef.current = true;
    hideHint();
  };

  const onLoaderTogglePointerUp = (e: PointerEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    suppressOpenRef.current = true;
  };

  const onLoaderToggleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setLoaderHidden((prev) => !prev);
  };

  if (!ready) return null;

  return createPortal(
    <>
      <AnimatePresence>
        {open ? (
          <motion.div
            key="backdrop"
            className="fixed inset-0 aiw-backdrop"
            style={{ zIndex: 2147483000 }}
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
            className="aiw-host"
            style={hostStyle}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
          >
            <div className="aiw-panel">
              <div className="aiw-header">
                <AgentAvatar open />
                <div className="aiw-header-meta">
                  <div className="aiw-title">AI Assistant</div>
                  <div className="aiw-subtitle">Ask me to navigate.</div>
                </div>

                <div className="aiw-header-actions">
                  <div className="aiw-size-controls" role="group" aria-label="Resize chat panel">
                    <button
                      type="button"
                      onClick={() => resizePanel(-PANEL_RESIZE_STEP)}
                      className="aiw-size-btn"
                      aria-label="Smaller chat"
                      disabled={!canShrink}
                    >
                      −
                    </button>
                    <button
                      type="button"
                      onClick={() => resizePanel(PANEL_RESIZE_STEP)}
                      className="aiw-size-btn"
                      aria-label="Larger chat"
                      disabled={!canGrow}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="aiw-close-btn"
                    title="Close"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="aiw-suggestions-wrap">
                <div className="aiw-suggestions-row">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => quickAsk(s)}
                      className="aiw-suggestion-btn"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div className="aiw-body-wrap">
                <div ref={scrollBoxRef} className="aiw-scroll-box">
                  <div className="aiw-messages-col">
                    {msgs.map((m) => (
                      <div key={m.id} className={`aiw-message-row ${m.from === "user" ? "is-user" : "is-ai"}`}>
                        <div className={`aiw-message-bubble ${m.from === "user" ? "is-user" : "is-ai"}`}>
                          {m.text}
                        </div>
                      </div>
                    ))}

                    {typing && (
                      <div className="aiw-message-row is-ai">
                        <div className="aiw-message-bubble is-ai aiw-typing-bubble">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="aiw-input-wrap">
                <div className="aiw-input-row">
                  <div className="aiw-input-shell">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") onSend();
                      }}
                      className="aiw-input"
                      placeholder='Example: "Where are the projects?"'
                    />
                  </div>

                  <button
                    onClick={onSend}
                    className="aiw-send-btn"
                    aria-label="Send"
                  >
                    <SendIcon /> <span>Send</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {!open && (
        <div
          ref={btnWrapRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          onMouseEnter={() => {
            if (!isMobile && !loaderHidden) setShowHint(true);
          }}
          onMouseLeave={() => {
            if (!isMobile) setShowHint(false);
          }}
          style={{
            position: "fixed",
            left: btnPos.x,
            top: btnPos.y,
            zIndex: 2147483647,
          }}
          className="aiw-launcher-wrap"
          aria-label="AI assistant button"
        >
          {showHint && !loaderHidden && (
            <div className="aiw-tip-popover">
              <div className="aiw-tip-title">Tip</div>
              <div className="aiw-tip-text">
                Drag to move • Click to open
              </div>

              <div className="aiw-tip-arrow" />
            </div>
          )}

          {!loaderHidden && (
            <div
              className={`aiw-launcher-inner ${mini || isMobile ? "is-compact" : ""}`}
            >
              <AILoader size={40} />
            </div>
          )}

          <button
            type="button"
            className={`aiw-loader-toggle ${loaderHidden ? "is-hidden" : ""}`}
            onPointerDown={onLoaderTogglePointerDown}
            onPointerUp={onLoaderTogglePointerUp}
            onClick={onLoaderToggleClick}
            aria-label={loaderHidden ? "Show AI launcher" : "Hide AI launcher"}
            title={loaderHidden ? "Show launcher" : "Hide launcher"}
          >
            {loaderHidden ? "+" : "−"}
          </button>
        </div>
      )}
    </>,
    document.body
  );
}
