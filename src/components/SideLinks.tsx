import { useMemo, useState, useRef } from "react";
import { Github, Linkedin, Mail, Phone, FileText } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { profile } from "../data/profile";

type RevealKey = "email" | "phone" | null;

interface IconParticle {
  id: number;
  angle: number;
  distance: number;
  icon: string;
  color: string;
  startX: number;
  startY: number;
}

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
  const [particles, setParticles] = useState<IconParticle[]>([]);
  const particleCounterRef = useRef(0);

  const toggle = (key: RevealKey) => setReveal((cur) => (cur === key ? null : key));

  // Create icon burst effect
  const createBurst = (
    iconName: string,
    color: string,
    startX: number,
    startY: number,
    count: number = 12
  ) => {
    const newParticles: IconParticle[] = [];
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: particleCounterRef.current++,
        angle: (360 / count) * i,
        distance: 80 + Math.random() * 40,
        icon: iconName,
        color: color,
        startX: startX,
        startY: startY,
      });
    }
    setParticles((prev) => [...prev, ...newParticles]);

    // Remove particles after animation
    setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.some((np) => np.id === p.id))
      );
    }, 1000);
  };

  // Render icon particle
  const renderIconParticle = (particle: IconParticle, size: number = 20) => {
    const rad = (particle.angle * Math.PI) / 180;
    const x = Math.cos(rad) * particle.distance;
    const y = Math.sin(rad) * particle.distance;

    const iconMap: Record<string, typeof Github> = {
      github: Github,
      linkedin: Linkedin,
      mail: Mail,
      phone: Phone,
      cv: FileText,
    };

    const Icon = iconMap[particle.icon];

    return (
      <motion.div
        key={particle.id}
        initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
        animate={{ opacity: 0, scale: 0.3, x, y }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          position: "fixed",
          left: particle.startX,
          bottom: particle.startY,
          pointerEvents: "none",
          zIndex: 100000,
        }}
      >
        <Icon size={size} strokeWidth={2.25} style={{ color: particle.color }} />
      </motion.div>
    );
  };

  const iconBtn =
    "inline-flex items-center justify-center " +
    "bg-transparent border-0 p-0 m-0 rounded-none shadow-none " +
    "text-gray-800 transition-all duration-300 " +
    "focus:outline-none cursor-pointer " +
    "hover:text-orange-600 hover:scale-125";

  const bubbleBase =
    "absolute left-[calc(100%+14px)] top-1/2 -translate-y-1/2 " +
    "select-text whitespace-nowrap " +
    "rounded-full border border-black/10 bg-white/80 " +
    "px-3 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase text-black " +
    "backdrop-blur";

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
        width: 48,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        padding: "8px",
        background: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderRadius: "20px",
        border: "1px solid rgba(0, 0, 0, 0.1)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1), 0 0 20px rgba(234, 88, 12, 0.1)",
      }}
    >
      {/* LinkedIn */}
      {linkedin ? (
        <div
          className="relative"
          style={{ width: 40, height: 40 }}
          onMouseEnter={() => createBurst("linkedin", "#0077b5", 80, 216)}
        >
          <a
            href={linkedin}
            target="_blank"
            rel="noreferrer"
            className={iconBtn}
            aria-label="LinkedIn"
            title="LinkedIn"
            style={{ width: 40, height: 40 }}
          >
            <Linkedin size={20} strokeWidth={2.25} />
          </a>
        </div>
      ) : null}

      {/* GitHub */}
      {github ? (
        <div
          className="relative"
          style={{ width: 40, height: 40 }}
          onMouseEnter={() => createBurst("github", "#000000", 80, 172)}
        >
          <a
            href={github}
            target="_blank"
            rel="noreferrer"
            className={iconBtn}
            aria-label="GitHub"
            title="GitHub"
            style={{ width: 40, height: 40 }}
          >
            <Github size={20} strokeWidth={2.25} />
          </a>
        </div>
      ) : null}

      {/* Email */}
      <div
        className="relative"
        style={{ width: 40, height: 40 }}
        onMouseEnter={() => createBurst("mail", "#ea580c", 80, 128)}
      >
        <button
          type="button"
          className={iconBtn}
          aria-label="Email"
          title="Email"
          onClick={() => toggle("email")}
          style={{ width: 40, height: 40 }}
        >
          <Mail size={20} strokeWidth={2.25} />
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
      <div
        className="relative"
        style={{ width: 40, height: 40 }}
        onMouseEnter={() => createBurst("phone", "#10b981", 80, 84)}
      >
        <button
          type="button"
          className={iconBtn}
          aria-label="Phone"
          title="Phone"
          onClick={() => toggle("phone")}
          style={{ width: 40, height: 40 }}
        >
          <Phone size={20} strokeWidth={2.25} />
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
      <div
        className="relative"
        style={{ width: 40, height: 40 }}
        onMouseEnter={() => createBurst("cv", "#a855f7", 80, 40)}
      >
        <a
          href={cvPdfHref}
          target="_blank"
          rel="noreferrer"
          className={iconBtn}
          aria-label="Open CV PDF"
          title="Open CV"
          style={{ width: 40, height: 40 }}
          onClick={() => setReveal(null)}
        >
          <FileText size={20} strokeWidth={2.25} />
        </a>
      </div>

      {/* Icon Particles */}
      <AnimatePresence>
        {particles.map((particle) => renderIconParticle(particle))}
      </AnimatePresence>
    </div>
  );
}
