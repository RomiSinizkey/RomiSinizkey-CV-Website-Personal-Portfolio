import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import MountainVistaParallax from "@/components/ui/mountain-vista-bg";
import "../../styles/assistant/aiAssistantWidget.css";

interface AIAssistantWidgetProps {
  ready?: boolean;
}

interface PromptWindowProps {
  onClose: () => void;
}

function MessageText({ message }: { message: string }) {
  const tokens = React.useMemo(
    () => message.trim().split(/\s+/).filter(Boolean),
    [message]
  );

  return (
    <span className="aiw-chat-text">
      {tokens.map((token, index) => (
        <span key={`word-${index}`} className="aiw-chat-word">
          <span data-cursor-mode="glow-dot">{token}</span>
        </span>
      ))}
    </span>
  );
}

async function mockAiReply(userMessage: string): Promise<string> {
  await new Promise((r) => setTimeout(r, 700));
  return `AI: (mock) You said: "${userMessage}"`;
}

function PromptWindow({ onClose }: PromptWindowProps) {
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState<string[]>([
    "👋 Hey! Ask me anything about Romi — projects, skills, or experience.",
  ]);
  const [loading, setLoading] = React.useState(false);
  const [hovered, setHovered] = React.useState(false);
  const [autoScroll, setAutoScroll] = React.useState(true);

  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const scrollContainerRef = React.useRef<HTMLDivElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(
      textareaRef.current.scrollHeight,
      110
    )}px`;
  }, [draft]);

  const scrollToBottom = React.useCallback((behavior: ScrollBehavior = "smooth") => {
    scrollRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const handleScroll = React.useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const isNearBottom =
      el.scrollHeight - el.scrollTop - el.clientHeight < 80;

    setAutoScroll(isNearBottom);
  }, []);

  React.useEffect(() => {
    if (autoScroll) {
      scrollToBottom("smooth");
    }
  }, [messages, loading, autoScroll, scrollToBottom]);

  const hasContent = draft.trim().length > 0;

  const handleSubmit = React.useCallback(async () => {
    if (!hasContent || loading) return;

    const userMsg = draft.trim();
    setMessages((current) => [...current, userMsg]);
    setDraft("");
    setLoading(true);
    setAutoScroll(true);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);

    try {
      const aiReply = await mockAiReply(userMsg);
      setMessages((current) => [...current, aiReply]);
    } finally {
      setLoading(false);
      setTimeout(() => {
        textareaRef.current?.focus();
      }, 0);
    }
  }, [draft, hasContent, loading]);

  return (
    <div
      className="aiw-shell"
      style={{ height: 460, width: "min(380px, calc(100vw - 24px))" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="aiw-topbar">
        <div className="aiw-topbar__meta">
          <div className="aiw-topbar__dot" />
          <span className="aiw-topbar__label">AI ASSISTANT</span>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="aiw-inline-close"
          aria-label="Close chat"
        >
          CLOSE
        </button>
      </div>

      <div className="aiw-main">
        <div className="aiw-messages-stage">
          <div className="aiw-bg-layer">
            <MountainVistaParallax />
          </div>

          <div className="aiw-bg-overlay" />
          <div className="aiw-messages-fade-top" />
          <div className="aiw-messages-fade-bottom" />

          <div
            ref={scrollContainerRef}
            className="aiw-messages-list"
            onScroll={handleScroll}
          >
            {messages.map((message, index) => {
              const isAiMessage = index === 0 || message.startsWith("AI:");
              return (
                <motion.div
                  key={`${message}-${index}`}
                  initial={{ opacity: 0, y: 10, scale: 0.985 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  className={cn(
                    "aiw-chat-message-row",
                    isAiMessage ? "is-ai" : "is-user"
                  )}
                >
                  <div
                    className={cn(
                      "aiw-chat-bubble",
                      isAiMessage ? "is-ai" : "is-user"
                    )}
                  >
                    <MessageText message={message} />
                  </div>
                </motion.div>
              );
            })}

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="aiw-chat-message-row is-ai"
              >
                <div className="aiw-chat-bubble is-ai aiw-typing-bubble">
                  <span className="aiw-typing-dot" />
                  <span className="aiw-typing-dot" />
                  <span className="aiw-typing-dot" />
                </div>
              </motion.div>
            )}

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

        <div
          className="aiw-input-bar"
          style={{
            opacity: hovered ? 1 : 0.38,
            transform: hovered ? "translateY(0)" : "translateY(8px)",
            pointerEvents: "auto",
          }}
        >
          <div className="aiw-input-shell-modern aiw-input-shell-no-bg">
            <textarea
              id="portfolio-assistant-input"
              ref={textareaRef}
              data-cursor-label="WRITE"
              data-cursor-label-tone="light"
              value={draft}
              rows={1}
              placeholder="Type your message here..."
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
              className={cn("aiw-send-fancy", !hasContent && "is-disabled")}
              disabled={!hasContent || loading}
              data-cursor-mode="glow-dot"
              aria-label="Send message"
            >
              <span className="aiw-send-fancy__icon-shell">
                <span className="aiw-send-fancy__icon-wrap">
                  <svg
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                    className="aiw-send-fancy__icon"
                  >
                    <path d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                      fill="currentColor"
                    />
                  </svg>
                </span>
              </span>
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
              className="fixed inset-0 z-2147483640 bg-black/30 backdrop-blur-[2px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            <motion.section
              id="portfolio-ai-chat"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="fixed right-[12px] top-[86px] z-2147483641 sm:right-[8px] sm:top-[92px]"
            >
              <PromptWindow key={resetKey} onClose={handleClose} />
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>

      {!open && (
        <div
          className="aiw-launcher-wrap"
          style={{ position: "fixed", top: 14, right: 8, zIndex: 2147483642 }}
        >
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="aiw-launcher-button"
            aria-expanded={open}
            aria-controls="portfolio-ai-chat"
          >
            <span>ASK AI</span>
          </button>
        </div>
      )}
    </>
  );
}