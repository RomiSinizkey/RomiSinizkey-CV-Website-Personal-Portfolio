import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { MouseEvent } from "react";

interface BadgeNav {
  id: string;
  label: string;
  sectionId: string;
  gradient: string;
  size: "sm" | "md" | "lg";
  rotation: number;
  zIndex: number;
  offsetX: number;
  offsetY: number;
}

type FX = {
  id: string;
  owner: string;
  x: number;
  y: number;
  glyphs: string[];
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

const cn = (...inputs: Array<string | false | null | undefined>) =>
  inputs.filter(Boolean).join(" ");

const badges: BadgeNav[] = [
  { id: "home", label: "Home", sectionId: "home-section", gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)", size: "lg", rotation: -4, zIndex: 8, offsetX: 150, offsetY: -52 },
  { id: "projects", label: "Projects", sectionId: "projects-section", gradient: "linear-gradient(135deg, #f97316 0%, #facc15 100%)", size: "sm", rotation: 4, zIndex: 7, offsetX: 110, offsetY: -15 },
  { id: "about", label: "About", sectionId: "about-section", gradient: "linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)", size: "lg", rotation: -2, zIndex: 6, offsetX: 180, offsetY: 5 },
  { id: "education", label: "Education", sectionId: "education-section", gradient: "linear-gradient(135deg, #22c55e 0%, #84cc16 100%)", size: "lg", rotation: 0, zIndex: 5, offsetX: 150, offsetY: 40 },
  { id: "experience", label: "Experience", sectionId: "experience-section", gradient: "linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)", size: "md", rotation: -2, zIndex: 4, offsetX: 100, offsetY: 80 },
  { id: "skills", label: "Skills", sectionId: "skills-section", gradient: "linear-gradient(135deg, #14b8a6 0%, #06b6d4 100%)", size: "sm", rotation: 2, zIndex: 3, offsetX: 180, offsetY: 110 },
  { id: "languages", label: "Languages", sectionId: "languages-section", gradient: "linear-gradient(135deg, #a855f7 0%, #6366f1 100%)", size: "sm", rotation: -3, zIndex: 2, offsetX: 150, offsetY: 135 },
  { id: "military", label: "Military", sectionId: "military-section", gradient: "linear-gradient(135deg, #ef4444 0%, #b91c1c 100%)", size: "sm", rotation: 3, zIndex: 1, offsetX: 110, offsetY: 160 },
];

const sizeClasses = {
  sm: "stackSizeSm",
  md: "stackSizeMd",
  lg: "stackSizeLg",
};

function fireShowcaseOpen() {
  window.dispatchEvent(new CustomEvent("home:projects:open"));
}

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top: y, behavior: "smooth" });
}

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(true);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [clickedId, setClickedId] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState("home-section");

  // FX (אם אתה רוצה להשאיר)
  const [fx, setFx] = useState<FX[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (location.pathname !== "/") return;

    const sections = badges
      .map((badge) => ({ id: badge.sectionId, element: document.getElementById(badge.sectionId) }))
      .filter((value): value is { id: string; element: HTMLElement } => value.element !== null);

    if (sections.length === 0) return;

    const setClosestSection = () => {
      const targetY = window.scrollY + window.innerHeight * 0.35;
      let closestId = sections[0].id;
      let bestDistance = Number.POSITIVE_INFINITY;

      sections.forEach(({ id, element }) => {
        const distance = Math.abs(element.offsetTop - targetY);
        if (distance < bestDistance) {
          bestDistance = distance;
          closestId = id;
        }
      });

      setActiveSection(closestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        const topVisible = visible[0]?.target as HTMLElement | undefined;
        if (topVisible?.id) {
          setActiveSection(topVisible.id);
        }
      },
      {
        root: null,
        rootMargin: "-30% 0px -50% 0px",
        threshold: [0.1, 0.25, 0.5, 0.75],
      }
    );

    sections.forEach(({ element }) => observer.observe(element));
    setClosestSection();
    window.addEventListener("scroll", setClosestSection, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", setClosestSection);
    };
  }, [location.pathname]);

  const spawnFX = (e: MouseEvent, owner: string) => {
    const target = e.currentTarget as HTMLElement;
    const r = target.getBoundingClientRect();
    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const pool = ["<>", "{ }", "[]", "()", "=>", "&&", "||", "git", "API", "SQL", "TS", "UI", "0", "1"];
    const glyphs = Array.from({ length: 7 }, (_, i) =>
      pool[(Math.floor((x + y + i * 19) * 7) % pool.length + pool.length) % pool.length]
    );

    const id = uid();
    setFx((prev) => [...prev, { id, owner, x, y, glyphs }]);

    const t = window.setTimeout(() => {
      setFx((prev) => prev.filter((b) => b.id !== id));
    }, 950);

    timers.current.push(t);
  };

  const onBadgeClick = (badge: BadgeNav) => (e: MouseEvent) => {
    spawnFX(e, badge.label);
    e.preventDefault();
    setClickedId((p) => (p === badge.id ? null : badge.id));
    setActiveSection(badge.sectionId);

    const shouldOpenProjects = badge.id === "projects";

    if (location.pathname !== "/") {
      navigate("/", {
        state: {
          scrollTo: badge.sectionId,
          openShowcase: shouldOpenProjects,
        },
      });
      return;
    }

    scrollToSection(badge.sectionId);
    if (shouldOpenProjects) {
      fireShowcaseOpen();
    }
  };

  return (
    <header className={`topNav ${collapsed ? "isCollapsed" : ""}`}>
      {/* ✅ החץ נשאר */}
      <button
        className="topNavToggle"
        type="button"
        onClick={(e) => {
          spawnFX(e, "Toggle");
          setCollapsed((v) => !v);
        }}
        aria-label="Toggle navigation"
      >
        <span className="topNavChevron">{collapsed ? "›" : "‹"}</span>

        <span className="csfxLayer csfxLayer--toggle" aria-hidden="true">
          {fx
            .filter((b) => b.owner === "Toggle")
            .map((b) => (
              <span key={b.id} className="csfxBurst" style={{ left: b.x, top: b.y } as React.CSSProperties}>
                <span className="csfxRing" />
              </span>
            ))}
        </span>
      </button>

      {/* ✅ Stack container (לא משתמש ב-topNavInner בכלל) */}
      <div className="stackNav" aria-label="Primary">
        {badges.map((badge) => {
          const isHovered = hoveredId === badge.id;
          const isClicked = clickedId === badge.id;

          const isActive =
            location.pathname === "/"
              ? activeSection === badge.sectionId
              : false;

          return (
            <a
              key={badge.id}
              href={`#${badge.sectionId}`}
              onClick={onBadgeClick(badge)}
              className={cn(
                "stackBadge",
                sizeClasses[badge.size]
              )}
              style={{
                left: "50%",
                top: "50%",
                background: badge.gradient,
                transform: `
                  translate(-50%, -50%)
                  translate(${badge.offsetX}px, ${badge.offsetY}px)
                  rotate(${isHovered ? 0 : badge.rotation}deg)
                  scale(${isActive || isClicked ? 1.08 : isHovered ? 1.04 : 1})
                  translateY(${isHovered ? -6 : 0}px)
                `,
                zIndex: isHovered || isActive || isClicked ? 100 : badge.zIndex,
              }}
              onMouseEnter={() => setHoveredId(badge.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <span className={cn("stackLabel", isActive ? "isActive" : "")}>
                {badge.label}
              </span>

              {/* highlight */}
              <span className="stackHighlight" aria-hidden="true" />

              {/* FX לכל badge (אופציונלי) */}
              <span className="csfxLayer" aria-hidden="true">
                {fx
                  .filter((b) => b.owner === badge.label)
                  .map((b) => (
                    <span key={b.id} className="csfxBurst" style={{ left: b.x, top: b.y } as React.CSSProperties}>
                      <span className="csfxRing" />
                      <span className="csfxCore" />
                      <span className="csfxSweep" />
                      {b.glyphs.map((g, i) => (
                        <span key={i} className={`csfxChip csfxChip${i + 1}`}>
                          {g}
                        </span>
                      ))}
                    </span>
                  ))}
              </span>
            </a>
          );
        })}
      </div>
    </header>
  );
}