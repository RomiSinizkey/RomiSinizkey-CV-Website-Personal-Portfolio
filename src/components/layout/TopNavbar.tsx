import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import type { CSSProperties, MouseEvent } from "react";

interface BadgeNav {
  id: string;
  label: string;
  sectionId: string;
  routePath?: string;
  icon: "home" | "projects" | "about" | "education" | "experience" | "skills" | "languages";
  colorStart: string;
  colorEnd: string;
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
  { id: "home", label: "Home", sectionId: "home-section", routePath: "/", icon: "home", colorStart: "#60a5fa", colorEnd: "#2563eb" },
  { id: "about", label: "About", sectionId: "about-section", routePath: "/about", icon: "about", colorStart: "#f472b6", colorEnd: "#db2777" },
  { id: "projects", label: "Projects", sectionId: "projects-section", routePath: "/projects", icon: "projects", colorStart: "#fb923c", colorEnd: "#ea580c" },
  { id: "education", label: "Education", sectionId: "education-section", routePath: "/education", icon: "education", colorStart: "#a3e635", colorEnd: "#65a30d" },
  { id: "experience", label: "Experience", sectionId: "experience-section", routePath: "/experience", icon: "experience", colorStart: "#f87171", colorEnd: "#b91c1c" },
  { id: "skills", label: "Skills", sectionId: "skills-section", icon: "skills", colorStart: "#2dd4bf", colorEnd: "#0f766e" },
  { id: "languages", label: "Languages", sectionId: "languages-section", icon: "languages", colorStart: "#c084fc", colorEnd: "#7c3aed" },
];

function renderBadgeIcon(icon: BadgeNav["icon"]) {
  switch (icon) {
    case "home":
      return (
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 2 3 9v11a2 2 0 0 0 2 2h4v-7h6v7h4a2 2 0 0 0 2-2V9z" />
        </svg>
      );
    case "projects":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M7 7V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2m-13 0v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7" />
        </svg>
      );
    case "about":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.418 0-8 2.239-8 5v1h16v-1c0-2.761-3.582-5-8-5Z" />
        </svg>
      );
    case "education":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m3 8 9-5 9 5-9 5-9-5Zm3 3.5v4.2c0 .8.48 1.52 1.22 1.83L12 20l4.78-2.47A2.05 2.05 0 0 0 18 15.7v-4.2" />
        </svg>
      );
    case "experience":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3 4 14h5l-1 7 8-11h-5l1-7Z" />
        </svg>
      );
    case "skills":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.7 6.3 3 3M5 19l4.25-1 8.84-8.84a1.5 1.5 0 0 0 0-2.12l-1.13-1.13a1.5 1.5 0 0 0-2.12 0L6 14.75 5 19Z" />
        </svg>
      );
    case "languages":
      return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Zm-7-9h14M12 3a14.5 14.5 0 0 1 0 18M12 3a14.5 14.5 0 0 0 0 18" />
        </svg>
      );
  }
}

function getBadgeHoverWidth(label: string) {
  return Math.max(84, Math.min(116, label.length * 8 + 22));
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
  const routeActiveBadgeId = badges.find((badge) => badge.routePath === location.pathname)?.id ?? null;

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home-section");
  const [fx, setFx] = useState<FX[]>([]);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const syncScrolled = () => {
      setScrolled(window.scrollY > 16);
    };

    syncScrolled();
    window.addEventListener("scroll", syncScrolled, { passive: true });

    return () => {
      window.removeEventListener("scroll", syncScrolled);
    };
  }, []);

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

  useEffect(() => {
    return () => {
      timers.current.forEach((timer) => window.clearTimeout(timer));
      timers.current = [];
    };
  }, []);

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
    setActiveSection(badge.sectionId);

    if (location.pathname !== "/") {
      navigate("/", {
        state: {
          scrollTo: badge.sectionId,
        },
      });
      return;
    }

    scrollToSection(badge.sectionId);
  };

  return (
    <header className={cn("topNav", scrolled && "isScrolled")}>
      <nav className="stackNav" aria-label="Primary">
        <ul className="stackNavRow">
          {badges.map((badge, index) => {
            const isActive = location.pathname === "/"
              ? activeSection === badge.sectionId
              : routeActiveBadgeId === badge.id;
            const hoverWidth = getBadgeHoverWidth(badge.label);

            return (
              <li
                key={badge.id}
                className={cn("stackNavItem", isActive && "isActive")}
                style={{
                  "--i": badge.colorStart,
                  "--j": badge.colorEnd,
                  "--hover-width": `${hoverWidth}px`,
                  "--delay": `${50 + index * 45}ms`,
                } as CSSProperties}
              >
                <a
                  href={`#${badge.sectionId}`}
                  onClick={onBadgeClick(badge)}
                  className="stackBadge"
                  data-cursor-fill="solid"
                >
                  <span className="stackBadgeIcon" aria-hidden="true">{renderBadgeIcon(badge.icon)}</span>
                  <span className="stackBadgeTitle">{badge.label}</span>

                  <span className="csfxLayer" aria-hidden="true">
                    {fx
                      .filter((b) => b.owner === badge.label)
                      .map((b) => (
                        <span key={b.id} className="csfxBurst" style={{ left: b.x, top: b.y } as CSSProperties}>
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
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
