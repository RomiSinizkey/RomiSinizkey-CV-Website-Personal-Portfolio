import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

import { SparklesLine } from "@/components/ui/AIBackGround/SparklesLine";

import { AI_INTENTS, type AiIntentKey } from "./aiIntents";
import { detectIntent } from "./detectIntent";
import "../../styles/assistant/aiAssistantWidget.css";

const MemoSparklesLine = React.memo(SparklesLine);

interface AIAssistantWidgetProps {
  ready?: boolean;
}

interface PromptWindowProps {
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  role: "ai" | "user";
  text: string;
  intent?: AiIntentKey | null;
}

async function mockAiReply(userMessage: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 650));
  return `I understood: "${userMessage}"`;
}

function PromptWindow({ onClose }: PromptWindowProps) {
  const navigate = useNavigate();

  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "ai",
      text: "Ask me about Romi — projects, skills, experience, education, contact, or GitHub.",
      intent: null,
    },
  ]);
  const [loading, setLoading] = React.useState(false);
  const [autoScroll, setAutoScroll] = React.useState(true);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const [hideInputBar, setHideInputBar] = React.useState(false);
  const scrollTimeout = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      110
    )}px`;
  }, [draft]);

  const scrollToBottom = React.useCallback(
    (behavior: ScrollBehavior = "smooth") => {
      scrollRef.current?.scrollIntoView({ behavior, block: "end" });
    },
    []
  );

  const handleScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Hide input bar while scrolling
    setHideInputBar(true);
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      setHideInputBar(false);
    }, 320);

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    setAutoScroll(distanceFromBottom < 12);
  }, []);

  React.useEffect(() => {
    if (!autoScroll) return;

    requestAnimationFrame(() => {
      const el = scrollContainerRef.current;
      if (!el) return;

      el.scrollTop = el.scrollHeight;
    });
  }, [messages, loading, autoScroll]);

  const hasContent = draft.trim().length > 0;

  const runIntentAction = React.useCallback(
    (intentKey: AiIntentKey) => {
      const intent = AI_INTENTS[intentKey];
      const action = intent.action;

      if (action.type === "external") {
        window.open(action.href, "_blank", "noopener,noreferrer");
        return;
      }

      navigate(action.route, {
        state: action.anchorId ? { scrollTo: action.anchorId } : undefined,
      });
    },
    [navigate]
  );

  const handleSubmit = React.useCallback(async () => {
    if (!hasContent || loading) return;

    const userMsg = draft.trim();
    const intent = detectIntent(userMsg);

    setMessages((current) => [
      ...current,
      {
        id: `${Date.now()}-user`,
        role: "user",
        text: userMsg,
        intent,
      },
    ]);

    setDraft("");
    setLoading(true);
    setAutoScroll(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);

    try {
      const aiReply = intent ? AI_INTENTS[intent].reply : await mockAiReply(userMsg);

      setMessages((current) => [
        ...current,
        {
          id: `${Date.now()}-ai`,
          role: "ai",
          text: aiReply.replace(/^AI:\s*/i, "").trim(),
          intent,
        },
      ]);

      if (intent) {
        setTimeout(() => {
          runIntentAction(intent);
        }, 320);
      }
    } finally {
      setLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [draft, hasContent, loading, runIntentAction]);

    return (
    <div
      className="aiw-shell"
      style={{
        height: 470,
        width: "min(390px, calc(100vw - 20px))",
      }}
      
    >
      {/* Fixed background */}
      <div className="aiw-bg-fixed">
        <MemoSparklesLine  />
      </div>

      <div className="aiw-topbar">
        <div className="aiw-topbar__meta">
          <div className="aiw-topbar__dot" />
          <span className="aiw-topbar__label">AI Assistant</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="aiw-inline-close"
          aria-label="Close chat"
        >
          ✕
        </button>
      </div>

      <div className="aiw-main">
        <div className="aiw-messages-stage">
          <div
            ref={scrollContainerRef}
            className="aiw-messages-list"
            onScroll={handleScroll}
          >
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 14, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "aiw-message-row",
                    message.role === "user" ? "is-user" : "is-ai"
                  )}
                >
                  <div
                    className={cn(
                      "aiw-message-bubble",
                      message.role === "user" ? "is-user" : "is-ai"
                    )}
                  >
                    <p className="aiw-message-text">{message.text}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  key="typing"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeOut" }}
                  className="aiw-message-row is-ai"
                >
                  <div className="aiw-message-bubble is-ai is-typing">
                    <span className="aiw-typing-dot" />
                    <span className="aiw-typing-dot" />
                    <span className="aiw-typing-dot" />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div ref={scrollRef} />
          </div>

          {!autoScroll && (
            <button
              type="button"
              className="aiw-scroll-bottom-btn"
              onClick={() => {
                setAutoScroll(true);
                scrollToBottom("smooth");
              }}
              aria-label="Scroll to bottom"
            >
              ↓
            </button>
          )}
        </div>

        
        <div className={cn("aiw-input-bar", hideInputBar && "hide-on-scroll")}> 
          <div className="aiw-input-shell-modern">
            <textarea
              id="portfolio-assistant-input"
              ref={textareaRef}
              value={draft}
              rows={1}
              placeholder="Ask something..."
              data-cursor-label="WRITE"
              data-cursor-label-tone="muted"
              style={{ ["--cursor-color" as string]: "#5B21B6" }}
              onChange={(event) => setDraft(event.target.value)}
              onKeyDown={async (event) => {
                if (event.key === "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  await handleSubmit();
                }
              }}
              className="aiw-textarea"
              disabled={loading}
            />

            <button
              type="button"
              onClick={handleSubmit}
              className={cn("Btn", !hasContent && "is-disabled")}
              disabled={!hasContent || loading}
              aria-label="Send message"
            >
              <svg height="1.2em" className="arrow" viewBox="0 0 512 512">
                <path d="M233.4 105.4c12.5-12.5 32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L256 173.3 86.6 342.6c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l192-192z"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIAssistantWidget({
  ready = true,
}: AIAssistantWidgetProps) {
  const [open, setOpen] = React.useState(false);
  const [resetKey, setResetKey] = React.useState(0);

  if (!ready) return null;

  const handleClose = () => {
    setOpen(false);
    setResetKey((k) => k + 1);
  };

  return (
    <>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close assistant prompt"
              className="fixed inset-0 z-2147483640 bg-black/45 backdrop-blur-[4px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            <motion.section
              id="portfolio-ai-chat"
              initial={{ opacity: 0, y: 18, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed right-[12px] top-[86px] z-2147483641 sm:right-[8px] sm:top-[92px]"
            >
              <PromptWindow key={resetKey} onClose={handleClose} />
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>

      {!open && (
       <div className="aiw-launcher-wrap">
          <AnimatedLauncherButton open={open} setOpen={setOpen} />
        </div>
      )}
    </>
  );
}

const LAUNCHER_TEXT = "ASK AI";

function AnimatedLauncherButton({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [hovered, setHovered] = React.useState(false);

  React.useEffect(() => {
    if (hovered) return;

    const validIndexes = LAUNCHER_TEXT.split("")
      .map((char, idx) => ({ char, idx }))
      .filter((item) => item.char !== " ")
      .map((item) => item.idx);

    const interval = setInterval(() => {
      setActiveIdx((prev) => {
        const currentPos = validIndexes.indexOf(prev);
        const nextPos = currentPos === -1 ? 0 : (currentPos + 1) % validIndexes.length;
        return validIndexes[nextPos];
      });
    }, 1600);

    return () => clearInterval(interval);
  }, [hovered]);

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="aiw-launcher-button aiw-launcher-animated"
      aria-expanded={open}
      aria-controls="portfolio-ai-chat"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="aiw-launcher-text" aria-hidden="true">
        {LAUNCHER_TEXT.split("").map((char, i) => {
          const isSpace = char === " ";
          const isActive = !hovered && i === activeIdx && !isSpace;

          return (
            <span
              key={i}
              className={`aiw-launcher-letter${isSpace ? " is-space" : ""}${isActive ? " active" : ""}`}
            >
              {!isSpace && (
                <span className="aiw-launcher-letter-fill" aria-hidden="true">
                  {char}
                </span>
              )}
              <span className="aiw-launcher-letter-base">
                {isSpace ? "\u00A0" : char}
              </span>
            </span>
          );
        })}
      </span>
    </button>
  );
}