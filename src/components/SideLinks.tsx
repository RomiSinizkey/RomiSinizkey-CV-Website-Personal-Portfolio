import { useMemo, useState } from "react";
import { Github, Linkedin, Mail, Phone, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/profile";

type RevealKey = "email" | "phone" | null;

const bubble = {
  hidden: { opacity: 0, x: -8, scale: 0.98, filter: "blur(6px)" },
  show: { opacity: 1, x: 0, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, x: -8, scale: 0.98, filter: "blur(6px)" },
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

  const [reveal, setReveal] = useState<RevealKey>(null);
  const toggle = (key: RevealKey) => setReveal((cur) => (cur === key ? null : key));

  const iconBtn =
    "inline-flex items-center justify-center " +
    "bg-transparent border-0 p-0 m-0 rounded-none shadow-none " +
    "text-black hover:text-orange-600 transition-colors duration-150 " +
    "focus:outline-none";

  const bubbleBase =
    "absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 " +
    "select-text whitespace-nowrap " +
    "rounded-full border border-black/10 bg-white/80 " +
    "px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-black " +
    "backdrop-blur";

  const iconProps = { size: 26, strokeWidth: 2.25 } as const;

  // ✅ PDF מתוך public
  const cvPdfHref = "/Romi_Sinizkey_CV.pdf";

  return (
    <div
      id="side-links"
      style={{
        position: "fixed",
        left: 24,
        bottom: 24,
        zIndex: 99999,
        width: 32,
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      {/* LinkedIn */}
      {linkedin ? (
        <div className="relative" style={{ width: 32, height: 32 }}>
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className={iconBtn}
            aria-label="LinkedIn"
            title="LinkedIn"
            style={{ width: 32, height: 32 }}
          >
            <Linkedin {...iconProps} />
          </a>
        </div>
      ) : null}

      {/* GitHub */}
      {github ? (
        <div className="relative" style={{ width: 32, height: 32 }}>
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className={iconBtn}
            aria-label="GitHub"
            title="GitHub"
            style={{ width: 32, height: 32 }}
          >
            <Github {...iconProps} />
          </a>
        </div>
      ) : null}

      {/* Email */}
      <div className="relative" style={{ width: 32, height: 32 }}>
        <button
          type="button"
          className={iconBtn}
          aria-label="Email"
          title="Email"
          onClick={() => toggle("email")}
          style={{ width: 32, height: 32 }}
        >
          <Mail {...iconProps} />
        </button>

        <AnimatePresence>
          {reveal === "email" ? (
            <motion.a
              href={`mailto:${profile.email}`}
              variants={bubble}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={bubbleBase}
              style={{ textDecoration: "none" }}
            >
              {profile.email}
            </motion.a>
          ) : null}
        </AnimatePresence>
      </div>

      {/* Phone */}
      <div className="relative" style={{ width: 32, height: 32 }}>
        <button
          type="button"
          className={iconBtn}
          aria-label="Phone"
          title="Phone"
          onClick={() => toggle("phone")}
          style={{ width: 32, height: 32 }}
        >
          <Phone {...iconProps} />
        </button>

        <AnimatePresence>
          {reveal === "phone" ? (
            <motion.a
              href="tel:0544276740"
              variants={bubble}
              initial="hidden"
              animate="show"
              exit="exit"
              transition={{ duration: 0.18, ease: "easeOut" }}
              className={bubbleBase}
              style={{ textDecoration: "none" }}
            >
              0544276740
            </motion.a>
          ) : null}
        </AnimatePresence>
      </div>

      {/* ✅ CV PDF (אייקון טופס) */}
      <div className="relative" style={{ width: 32, height: 32 }}>
        <a
          href={cvPdfHref}
          target="_blank"
          rel="noreferrer"
          className={iconBtn}
          aria-label="Open CV PDF"
          title="Open CV"
          style={{ width: 32, height: 32 }}
          onClick={() => setReveal(null)} // סוגר בועות אם פתוחות
        >
          <FileText {...iconProps} />
        </a>
      </div>
    </div>
  );
}
