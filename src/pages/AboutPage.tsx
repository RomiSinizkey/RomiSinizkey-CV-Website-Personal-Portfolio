// AboutPage.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Code2, Brain, Sparkles, X } from "lucide-react";
import { profile } from "../data/profile";

/* ----------------------------- Background (with image) ----------------------------- */
function CanvaBackground() {
  return (
    <div
      className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        backgroundImage: "url(/about/portrait.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/45 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}

/* ----------------------------- Simple ELLIPSE Wheel ----------------------------- */
function SimpleWheel({ onHoverChange }: { onHoverChange?: (hovering: boolean) => void }) {
  const icons = [
    { src: "/about/icon/closeLaptop.jpg", label: "Building" },
    { src: "/about/icon/mognifer.jpg", label: "Analyzing" },
    { src: "/about/icon/pencil.jpg", label: "Creating" },
    { src: "/about/icon/search.jpg", label: "Exploring" },
    { src: "/about/icon/student.jpg", label: "Learning" },
    { src: "/about/icon/Triangular.jpg", label: "Designing" },
  ];

  // ✅ מזיז את כל הבלוק ימינה/שמאלה/למעלה/למטה
  const offsetX = 250;
  const offsetY = 170;

  // ✅ גודל "הבועה" האליפטית (לא חייב להיות ריבוע)
  const wheelW = 520; // רוחב אליפסה
  const wheelH = 340; // גובה אליפסה

  // ✅ רדיוסים למסלול האליפטי של האייקונים
  const rx = 180; // רדיוס אופקי
  const ry = 200; // רדיוס אנכי

  // גדלים
  const iconSize = 200;
  const centerBgSize = 220;
  const gearVisualSize = 246;

  // רוטציה
  const [rot, setRot] = useState(0);
  //const [hovering, setHovering] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [lastDragX, setLastDragX] = useState<number | null>(null);
  const wheelButtonRef = useRef<HTMLButtonElement | null>(null);
  const setHover = (v: boolean) => {
    //setHovering(v);
    onHoverChange?.(v);
  };

  const stopDrag = () => {
    setIsDragging(false);
    setLastDragX(null);
  };

  useEffect(() => {
    let frameId = 0;

    const tick = () => {
      setRot((r) => r + 0.12);
      frameId = window.requestAnimationFrame(tick);
    };

    frameId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(frameId);
  }, []);

  useEffect(() => {
    const onWindowWheel = (e: WheelEvent) => {
      const el = wheelButtonRef.current;
      if (!el) return;

      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const r = Math.min(rect.width, rect.height) / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const isInside = dx * dx + dy * dy <= r * r;

      if (!isInside) return;
      e.preventDefault();
      e.stopPropagation();
      setRot((r) => r + e.deltaY * 0.18);
    };

    window.addEventListener("wheel", onWindowWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWindowWheel);
  }, []);

  const degToRad = (deg: number) => (deg * Math.PI) / 180;
  const getIconPosition = (idx: number) => {
    const baseAngle = (360 / icons.length) * idx;
    const a = degToRad(baseAngle + rot);
    return {
      x: Math.cos(a) * rx,
      y: Math.sin(a) * ry,
      angleDeg: baseAngle + rot,
    };
  };

  const polarPoint = (radius: number, angleDeg: number) => {
    const angle = degToRad(angleDeg - 90);
    return {
      x: 100 + radius * Math.cos(angle),
      y: 100 + radius * Math.sin(angle),
    };
  };

  const buildGearSlicePath = (startDeg: number, endDeg: number, toothOuter: number, toothHalfDeg: number) => {
    const innerR = 22;
    const outerR = 62;
    const mid = (startDeg + endDeg) / 2;

    const p1 = polarPoint(innerR, startDeg);
    const p2 = polarPoint(outerR, startDeg);
    const p3 = polarPoint(toothOuter, mid - toothHalfDeg);
    const p4 = polarPoint(toothOuter, mid + toothHalfDeg);
    const p5 = polarPoint(outerR, endDeg);
    const p6 = polarPoint(innerR, endDeg);

    return `M ${p1.x} ${p1.y} L ${p2.x} ${p2.y} L ${p3.x} ${p3.y} L ${p4.x} ${p4.y} L ${p5.x} ${p5.y} L ${p6.x} ${p6.y} Z`;
  };

  return (
    <div
      className="relative"
      style={{
        width: wheelW,
        height: wheelH,
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {/* ✅ האליפסה עצמה (גם hitbox) */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: "none",
          clipPath: "ellipse(50% 50% at 50% 50%)",
          WebkitClipPath: "ellipse(50% 50% at 50% 50%)",
          background: "transparent",
          backdropFilter: "none",
          boxShadow: "none",
          border: "none",
        }}
      />

      {/* ✅ קבוצה שמסתובבת: האייקונים מסביב + גלגל שיניים באמצע */}
      <div
        className="absolute inset-0"
        style={{
          pointerEvents: "auto",
        }}
      >
        <AnimatePresence>
          {isExpanded && (
            <>
              <svg className="absolute inset-0 pointer-events-none" viewBox={`0 0 ${wheelW} ${wheelH}`}>
                {icons.map((icon, idx) => {
                  const { x, y } = getIconPosition(idx);
                  const length = Math.hypot(x, y) || 1;
                  const startX = wheelW / 2 + (x / length) * (centerBgSize * 0.33);
                  const startY = wheelH / 2 + (y / length) * (centerBgSize * 0.33);
                  const endX = wheelW / 2 + x;
                  const endY = wheelH / 2 + y;

                  return (
                    <motion.line
                      key={`connector-${icon.src}`}
                      x1={startX}
                      y1={startY}
                      x2={endX}
                      y2={endY}
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="2"
                      strokeLinecap="round"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.9 }}
                      exit={{ pathLength: 0, opacity: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.03 }}
                    />
                  );
                })}
              </svg>

            </>
          )}
        </AnimatePresence>

        {/* icons around (Ellipse path) */}
        {icons.map((icon, idx) => {
          const { x, y } = getIconPosition(idx);

          return (
            <div
              key={icon.src}
              className="absolute left-1/2 top-1/2"
              style={{
                display: isExpanded ? "block" : "none",
                transform: `translate(-50%, -50%) translate(${x}px, ${y}px)`,
              }}
            >
              {/* ✅ האייקון עצמו כן מקבל hover */}
              <div className="group relative" style={{ width: iconSize, height: iconSize, pointerEvents: "auto" }}>
                <div
                  className="absolute inset-0 rounded-[20px] overflow-hidden"
                  style={{
                    background: "transparent",
                    border: "none",
                    boxShadow: "none",
                    transform: "translateZ(0)",
                  }}
                >
                  <img
                    src={icon.src}
                    alt={icon.label}
                    draggable={false}
                    className="block w-full h-full object-cover"
                    style={{
                      transform: "scale(1)",
                      transition: "transform 160ms ease",
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1.08)";
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLImageElement).style.transform = "scale(1)";
                    }}
                  />
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      background: "transparent",
                    }}
                  />
                </div>

                {/* tooltip */}
                <div
                  className="absolute left-1/2 -top-10 -translate-x-1/2 px-3 py-1.5 rounded-xl text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    background: "rgba(0,0,0,0.55)",
                    backdropFilter: "blur(6px)",
                    whiteSpace: "nowrap",
                    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
                  }}
                >
                  {icon.label}
                </div>
              </div>
            </div>
          );
        })}

        {/* center wheel (stays centered) */}
        <button
          ref={wheelButtonRef}
          type="button"
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-0 bg-transparent p-0 cursor-pointer"
          style={{ width: gearVisualSize, height: gearVisualSize, borderRadius: "50%", touchAction: "none" }}
          onClick={() => setIsExpanded((prev) => !prev)}
          onPointerEnter={() => {
            setHover(true);
          }}
          onPointerLeave={() => {
            setHover(false);
            stopDrag();
          }}
          onPointerDown={(e) => {
            if (isExpanded) return;
            setIsDragging(true);
            setLastDragX(e.clientX);
          }}
          onPointerMove={(e) => {
            if (!isDragging || isExpanded || lastDragX === null) return;
            const dx = e.clientX - lastDragX;
            setRot((r) => r + dx * 0.8);
            setLastDragX(e.clientX);
          }}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          aria-label={isExpanded ? "Close wheel icons" : "Open wheel icons"}
        >
          <div
            className="relative rounded-full flex items-center justify-center"
            style={{
              width: centerBgSize,
              height: centerBgSize,
              background: "transparent",
              backdropFilter: "none",
              border: "none",
              boxShadow: "none",
              pointerEvents: "auto",
            }}
          >
            <motion.img
              src="/about/icon/GearWheel.jpg"
              alt="Wheel"
              draggable={false}
              className="absolute object-contain"
              style={{
                width: gearVisualSize,
                height: gearVisualSize,
                transform: `rotate(${rot * 1.2}deg)`,
                pointerEvents: "none",
              }}
              animate={{ opacity: isExpanded ? 0 : 1, scale: isExpanded ? 0.98 : 1 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            />

            <motion.svg
              viewBox="0 0 200 200"
              width={gearVisualSize}
              height={gearVisualSize}
              className="absolute"
              style={{ rotate: rot * 1.2, pointerEvents: "none" }}
              animate={{ opacity: isExpanded ? 1 : 0, scale: isExpanded ? 1 : 0.98 }}
              transition={{ duration: 0.28, ease: "easeInOut" }}
            >
              <defs>
                <pattern id="gearTexture" patternUnits="userSpaceOnUse" x="0" y="0" width="200" height="200">
                  <image href="/about/icon/GearWheel.jpg" x="0" y="0" width="200" height="200" preserveAspectRatio="xMidYMid slice" />
                </pattern>
              </defs>

              {icons.map((icon, idx) => {
                const slice = 360 / icons.length;
                const gap = 12;
                const start = idx * slice + gap / 2;
                const end = (idx + 1) * slice - gap / 2;
                const mid = idx * slice + slice / 2;
                const explodeDistance = isExpanded ? 32 : 0;
                const tx = Math.cos(degToRad(mid - 90)) * explodeDistance;
                const ty = Math.sin(degToRad(mid - 90)) * explodeDistance;

                return (
                  <motion.path
                    key={`gear-slice-${icon.src}`}
                    d={buildGearSlicePath(start, end, 84, 6)}
                    fill="url(#gearTexture)"
                    stroke="none"
                    initial={false}
                    animate={{ x: tx, y: ty }}
                    transition={{ type: "spring", stiffness: 220, damping: 20, delay: idx * 0.025 }}
                  />
                );
              })}
            </motion.svg>
          </div>
        </button>
      </div>

     
    </div>
  );
}

/* ----------------------------- Modal ----------------------------- */
function Modal({
  open,
  onClose,
  title,
  subtitle,
  icon,
  content,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-black/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 180, damping: 22 }}
            onMouseDown={onClose}
          >
            <div
              className="w-full max-w-2xl rounded-3xl bg-white shadow-[0_40px_120px_rgba(0,0,0,0.35)] overflow-hidden"
              onMouseDown={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-black/10 flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  {icon && (
                    <div className="mt-0.5 h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-600 to-fuchsia-600 text-white flex items-center justify-center">
                      {icon}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{title}</h3>
                    {subtitle && <p className="mt-1 text-slate-600 font-medium">{subtitle}</p>}
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="h-10 w-10 rounded-2xl bg-slate-100 hover:bg-slate-200 transition flex items-center justify-center border-0 outline-none"
                  aria-label="Close"
                >
                  <X size={18} className="text-slate-700" />
                </button>
              </div>

              <div className="px-6 py-6 text-slate-800">{content}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/* ----------------------------- Card ----------------------------- */
type CardData = {
  key: string;
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  headerBg: string;
  modalTitle: string;
  modalSubtitle?: string;
  modalText: string;
  modalBullets: string[];
};

function CanvaCard({ data, onOpen }: { data: CardData; onOpen: (d: CardData) => void }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(data)}
      className="
        group
        w-[200px] lg:w-[320px]
        bg-white
        rounded-[32px]
        overflow-hidden
        shadow-md hover:shadow-xl
        transition-shadow duration-300
        border-0 outline-none
        text-left
      "
      style={{ WebkitTapHighlightColor: "transparent" }}
    >
      <div className="relative h-[190px] overflow-hidden">
        <div
          className={`
            absolute inset-0
            ${data.headerBg}
            rounded-t-[32px]
            transition-transform duration-300 ease-out
            group-hover:scale-[1.04]
            group-hover:-translate-y-2
            origin-center
          `}
        >
          <div className="absolute left-4 top-4 z-10 h-9 w-9 rounded-full bg-white/90 flex items-center justify-center shadow-sm">
            {data.icon}
          </div>

          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <div className="absolute inset-0 bg-white/10" />
          </div>
        </div>
      </div>

      <div className="px-6 py-10 min-h-[150px]">
        <h3 className="text-[18px] font-black text-slate-900 leading-tight">{data.title}</h3>
        <p className="mt-3 text-[13px] text-slate-600 leading-snug">{data.subtitle}</p>
      </div>
    </button>
  );
}

/* ----------------------------- Header Component ----------------------------- */
function HeaderSection({ firstName, story, showHomeLink = true }: { firstName: string; story: string; showHomeLink?: boolean }) {
  return (
    <motion.div
      className="mb-10 rounded-3xl bg-black/20 backdrop-blur-[2px] p-6 md:p-8 border border-white/10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div className="h-1 w-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full mb-6" />

      <div className="mb-4">
        <h1 className="text-6xl md:text-7xl font-black leading-[1.1] drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
          <span className="text-white">Meet </span>
          <span className="bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
            {firstName}
          </span>
          <span className="text-white">.</span>
        </h1>
      </div>

      <p className="text-2xl md:text-3xl font-bold text-white/90 leading-relaxed max-w-3xl">
        Digital craftsman building elegant solutions.
      </p>

      <p className="mt-5 text-lg text-white/75 max-w-2xl leading-relaxed">{story}</p>

      <div className="mt-8 flex flex-wrap gap-4">
        {showHomeLink && (
          <Link
            to="/"
            className="group relative px-7 py-3 rounded-2xl bg-white/16 text-white font-bold shadow-lg hover:bg-white/20 transition-all backdrop-blur overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-cyan-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 transition-all" />
            <span className="relative">← Home</span>
          </Link>
        )}

        {profile.email && (
          <a
            href={`mailto:${profile.email}`}
            className="group relative px-7 py-3 rounded-2xl bg-white text-[#2b4cff] font-black shadow-lg hover:shadow-2xl transition-all overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative">Get in Touch</span>
          </a>
        )}
      </div>
    </motion.div>
  );
}

/* ----------------------------- Main Page ----------------------------- */
export function AboutPageContent({ embedded = false }: { embedded?: boolean }) {
  const firstName = profile.fullName?.split(" ")?.[0] ?? "Romi";
  const story =
    profile.summary ??
    "Computer Science student obsessed with clean architecture, performance, and shipping products that matter.";

  const cards: CardData[] = useMemo(
    () => [
      {
        key: "skills",
        title: "Magic Write™",
        subtitle: "Create an impressive first draft",
        icon: <Code2 size={18} />,
        headerBg: "bg-[linear-gradient(135deg,#22d3ee_0%,#60a5fa_40%,#a78bfa_100%)]",
        modalTitle: "Magic Write™",
        modalSubtitle: "Core skills highlight",
        modalText: "This is where you can describe your strongest skills and what you build best.",
        modalBullets: ["React + TypeScript", "Reusable UI systems", "Node.js + SQL", "Performance mindset"],
      },
      {
        key: "interests",
        title: "Translate",
        subtitle: "Translate your text and connect with people anywhere",
        icon: <Brain size={18} />,
        headerBg: "bg-[linear-gradient(135deg,#93c5fd_0%,#c4b5fd_50%,#fde68a_100%)]",
        modalTitle: "Translate",
        modalSubtitle: "Research interests",
        modalText: "Add your research topics / interests here.",
        modalBullets: ["Algorithms", "Architecture", "Security", "Optimization"],
      },
      {
        key: "philosophy",
        title: "Explore Magic Studio™",
        subtitle: "Use AI to design with more ease, speed, and creativity",
        icon: <Sparkles size={18} />,
        headerBg: "bg-[linear-gradient(135deg,#ddd6fe_0%,#c4b5fd_40%,#fbcfe8_100%)]",
        modalTitle: "Explore Magic Studio™",
        modalSubtitle: "Building philosophy",
        modalText: "Explain your building philosophy here.",
        modalBullets: ["Understand → design → implement", "Readable code first", "Test key flows", "Ship & iterate"],
      },
    ],
    []
  );

  const [selected, setSelected] = useState<CardData | null>(null);
  const [wheelHover, setWheelHover] = useState(false);

  return (
    <div className={`relative min-h-screen overflow-hidden w-full ${embedded ? "rounded-[28px]" : ""}`}>
      {embedded ? (
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_15%_15%,rgba(125,211,252,0.20),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(217,70,239,0.18),transparent_45%),linear-gradient(160deg,rgba(30,41,59,0.94)_0%,rgba(15,23,42,0.92)_45%,rgba(12,74,110,0.90)_100%)]" />
      ) : (
        <CanvaBackground />
      )}

      <AnimatePresence>
        {wheelHover && (
          <motion.div
            className={`${embedded ? "absolute" : "fixed"} inset-0 z-[40] pointer-events-none`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 backdrop-blur-md" />
            <div className="absolute inset-0 bg-black/10" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-[10] mx-auto max-w-6xl px-6 py-10 pointer-events-auto">
        <HeaderSection firstName={firstName} story={story} showHomeLink={!embedded} />

        <div className="flex justify-center">
          <div className="flex items-start justify-center flex-nowrap" style={{ gap: "16px" }}>
            <CanvaCard data={cards[0]} onOpen={setSelected} />
            <CanvaCard data={cards[1]} onOpen={setSelected} />
            <CanvaCard data={cards[2]} onOpen={setSelected} />
          </div>
        </div>

        {/* ✅ העיגול + אייקונים */}
        <div className="mt-8 flex justify-center">
          <SimpleWheel onHoverChange={setWheelHover} />
        </div>

        <div className="mt-8 flex justify-center">
          <button className="px-10 py-4 rounded-2xl bg-white/18 text-white font-black shadow-[0_24px_70px_rgba(0,0,0,0.25)] hover:bg-white/22 transition-all backdrop-blur border-0 outline-none">
            Create a CV
          </button>
        </div>
      </div>

      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.modalTitle ?? ""}
        subtitle={selected?.modalSubtitle}
        icon={selected?.icon}
        content={
          selected ? (
            <div>
              <p className="text-slate-700 leading-relaxed">{selected.modalText}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {selected.modalBullets.map((b) => (
                  <div key={b} className="rounded-2xl bg-slate-50 border border-slate-200 px-4 py-3">
                    <p className="font-semibold text-slate-800">{b}</p>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                {profile.email && (
                  <a
                    href={`mailto:${profile.email}`}
                    className="px-5 py-3 rounded-2xl font-black text-white bg-indigo-600 hover:bg-indigo-700 transition"
                  >
                    Contact {profile.fullName?.split(" ")?.[0] ?? "Me"}
                  </a>
                )}
                <button
                  onClick={() => setSelected(null)}
                  className="px-5 py-3 rounded-2xl font-black bg-slate-100 hover:bg-slate-200 transition text-slate-900 border-0 outline-none"
                >
                  Close
                </button>
              </div>
            </div>
          ) : null
        }
      />
    </div>
  );
}

export default function AboutPage() {
  return <AboutPageContent />;
}