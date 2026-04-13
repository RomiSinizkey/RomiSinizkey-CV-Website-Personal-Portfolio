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
  const tokens = React.useMemo(() => message.trim().split(/\s+/).filter(Boolean), [message]);

  return (
    <span className="aiw-chat-text">
      {tokens.map((token, index) => {
        return (
          <span
            key={`word-${index}`}
            className="aiw-chat-word"
          >
            <span data-cursor-mode="glow-dot">{token}</span>
          </span>
        );
      })}
    </span>
  );
}

function PromptWindow({ onClose }: PromptWindowProps) {
  const [draft, setDraft] = React.useState("");
  const [messages, setMessages] = React.useState<string[]>([
    "Hi, ask me about Romi's projects, skills, or experience.",
  ]);
  const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
  const scrollRef = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 140)}px`;
  }, [draft]);

  React.useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages]);

  const hasContent = draft.trim().length > 0;

  const handleSubmit = React.useCallback(() => {
    if (!hasContent) return;
    setMessages((current) => [...current, draft.trim()]);
    setDraft("");
  }, [draft, hasContent]);

  return (
    <div className="relative flex h-[360px] w-[min(320px,calc(100vw-24px))] flex-col overflow-hidden rounded-[32px] bg-[#1f2023]/95 shadow-[0_24px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl sm:h-[380px] sm:w-[min(340px,calc(100vw-32px))]">
      <div
        className="relative z-5 flex h-16 shrink-0 items-start justify-center bg-white pt-3"
        data-cursor-label="CLOSE"
        data-cursor-label-tone="dark"
        style={{ backgroundColor: "#ffffff" }}
      >
        <button
          type="button"
          onClick={onClose}
          className="aiw-inline-close"
          aria-label="Close chat"
          data-cursor-label="CLOSE"
          data-cursor-label-tone="dark"
          style={{ backgroundColor: "#ffffff", color: "#17181b", borderColor: "rgba(23,24,27,0.14)" }}
        >
          CLOSE
        </button>
      </div>

      <div data-cursor-label="READ" data-cursor-label-tone="muted" className="relative flex-1 overflow-y-auto bg-white px-4 pb-12 pt-4 sm:px-5 sm:pb-14 sm:pt-4">
        <MountainVistaParallax />
        <div className="relative z-10 flex min-h-full flex-col justify-end gap-6 py-2">
          {messages.map((message, index) => (
            <div
              key={`${message}-${index}`}
              className={cn("aiw-chat-message-row", index === 0 ? "is-ai" : "is-user")}
            >
              <div
                className={cn(
                  "aiw-chat-bubble",
                  index === 0 ? "is-ai" : "is-user"
                )}
              >
                <MessageText message={message} />
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </div>

      <div
        className="relative border-t border-white/10 px-4 pb-4 pt-3 sm:px-5 sm:pb-5 sm:pt-4"
        style={{ backgroundColor: "#ffffff" }}
      >
        <label htmlFor="portfolio-assistant-input" className="sr-only">
          Type your message here
        </label>
        <textarea
          id="portfolio-assistant-input"
          ref={textareaRef}
          data-cursor-label="WRITE"
          data-cursor-label-tone="dark"
          value={draft}
          rows={1}
          placeholder="Type your message here..."
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              handleSubmit();
            }
          }}
          className="min-h-[52px] w-[calc(100%-132px)] resize-none overflow-y-auto bg-transparent pl-2 pr-3 text-[16px] leading-7 text-[#17181b] placeholder:text-[#6b7280] focus:outline-none sm:min-h-[58px] sm:w-[calc(100%-144px)] sm:pl-3 sm:pr-3"
        />

        <button
          type="button"
          onClick={handleSubmit}
          className={cn("aiw-send-fancy", !hasContent && "is-disabled")}
          disabled={!hasContent}
          data-cursor-mode="glow-dot"
          aria-label="Send message"
        >
          <span className="aiw-send-fancy__icon-shell">
            <span className="aiw-send-fancy__icon-wrap">
              <svg viewBox="0 0 24 24" aria-hidden="true" className="aiw-send-fancy__icon">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z" fill="currentColor" />
              </svg>
            </span>
          </span>
          <span className="aiw-send-fancy__label">Send</span>
        </button>
      </div>
    </div>
  );
}

export default function AIAssistantWidget({ ready = true }: AIAssistantWidgetProps) {
  const [open, setOpen] = React.useState(false);

  if (!ready) return null;

  return (
    <>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Close assistant prompt"
              className="fixed inset-0 z-2147483640 bg-black/18"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />

            <motion.section
              id="portfolio-ai-chat"
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 14, scale: 0.985 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed right-[10px] top-[84px] z-2147483641 sm:right-[-48px] sm:top-[92px]"
            >
              <PromptWindow onClose={() => setOpen(false)} />
            </motion.section>
          </>
        ) : null}
      </AnimatePresence>

      {!open && (
        <div className="aiw-launcher-wrap" style={{ position: "fixed", top: 10, right: 5, zIndex: 2147483642 }}>
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="aiw-launcher-button"
            aria-expanded={open}
            aria-controls="portfolio-ai-chat"
          >
            <span>NEED HELP?</span>
          </button>
        </div>
      )}
    </>
  );
}
