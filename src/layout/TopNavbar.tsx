import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import type { CSSProperties, MouseEvent } from "react";
import { scrollToSection } from "@/lib/scrollToSection";
import "./TopNavbar.css";

interface BadgeNav {
  id: string;
  label: string;
  sectionId: string;
  routePath?: string;
  icon: "home" | "projects" | "about" | "education" | "experience" | "skills" | "languages";
  colorStart: string;
  colorEnd: string;
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

// Phones get the compact menu button instead of the badge row (keep in sync with TopNavbar.css).
const MOBILE_NAV_QUERY = "(max-width: 640px)";

function getBadgeHoverWidth(label: string) {
  return Math.max(84, Math.min(116, label.length * 8 + 22));
}

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeActiveBadgeId = badges.find((badge) => badge.routePath === location.pathname)?.id ?? null;

  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("home-section");
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  // Mobile menu (<= 640px). "Open" is tied to the current page (history key + path; the key alone is
  // "default" for hash-only changes), so any route change, including browser back/forward, closes it.
  const pageKey = `${location.key}:${location.pathname}`;
  const [menuOpenKey, setMenuOpenKey] = useState<string | null>(null);
  const isMenuOpen = menuOpenKey === pageKey;
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLElement | null>(null);
  const menuPanelId = useId();

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpenKey(null);
    if (restoreFocus) menuTriggerRef.current?.focus({ preventScroll: true });
  }, []);

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

  // While the menu is open: Escape closes it (focus returns to the button), and pressing anywhere
  // outside it closes it. That includes the ASK AI launcher, so the two are never open together.
  useEffect(() => {
    if (!isMenuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeMenu(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (menuPanelRef.current?.contains(target) || menuTriggerRef.current?.contains(target)) return;
      closeMenu();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    // Put focus on the current item so keyboard users can continue with Tab right away.
    const frame = requestAnimationFrame(() => {
      const panel = menuPanelRef.current;
      (panel?.querySelector<HTMLElement>("[aria-current]") ?? panel?.querySelector<HTMLElement>("a"))?.focus({ preventScroll: true });
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(frame);
    };
  }, [isMenuOpen, closeMenu]);

  // Widening past the phone breakpoint closes the menu (the desktop navbar takes over).
  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAV_QUERY);
    const onChange = () => {
      if (!media.matches) setMenuOpenKey(null);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const isBadgeActive = (badge: BadgeNav) =>
    location.pathname === "/" ? activeSection === badge.sectionId : routeActiveBadgeId === badge.id;

  const goToBadge = (badge: BadgeNav) => {
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

  const onBadgeClick = (badge: BadgeNav) => (e: MouseEvent) => {
    e.preventDefault();
    setPinnedId(badge.id);
    goToBadge(badge);
  };

  const onMenuItemClick = (badge: BadgeNav) => (e: MouseEvent) => {
    e.preventDefault();
    closeMenu(true);
    goToBadge(badge);
  };

  return (
    <>
      <header className={cn("topNav", scrolled && "isScrolled")}>
        <nav className="stackNav" aria-label="Primary">
          <ul className="stackNavRow" onMouseLeave={() => setPinnedId(null)}>
            {badges.map((badge, index) => {
              const isActive = isBadgeActive(badge);
              const hoverWidth = getBadgeHoverWidth(badge.label);

              return (
                <li
                  key={badge.id}
                  className={cn("stackNavItem", isActive && "isActive", pinnedId === badge.id && "isPinned")}
                  onMouseEnter={() => setPinnedId(badge.id)}
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
                  >
                    <span className="stackBadgeIcon" aria-hidden="true">{renderBadgeIcon(badge.icon)}</span>
                    <span className="stackBadgeTitle">{badge.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </header>

      {/* Phones (<= 640px, see TopNavbar.css): a 44px menu button that opens a dropdown with every destination. */}
      <div className={cn("mobileNav", isMenuOpen && "isOpen")}>
        <button
          ref={menuTriggerRef}
          type="button"
          className="mobileNavTrigger"
          aria-label="Navigation menu"
          aria-expanded={isMenuOpen}
          aria-controls={menuPanelId}
          onClick={() => (isMenuOpen ? closeMenu() : setMenuOpenKey(pageKey))}
        >
          <Menu className="mobileNavIcon mobileNavIconOpen" size={20} strokeWidth={2} aria-hidden="true" />
          <X className="mobileNavIcon mobileNavIconClose" size={20} strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="mobileNavBackdrop" aria-hidden="true" />

        <nav
          ref={menuPanelRef}
          id={menuPanelId}
          className="mobileNavPanel"
          aria-label="Primary"
          onBlur={(event) => {
            // Tabbing out of the menu closes it (a null target means the window lost focus: keep it open).
            const next = event.relatedTarget as Node | null;
            if (next && !menuPanelRef.current?.contains(next) && !menuTriggerRef.current?.contains(next)) closeMenu();
          }}
        >
          <ul className="mobileNavList">
            {badges.map((badge) => {
              const isActive = isBadgeActive(badge);

              return (
                <li key={badge.id}>
                  <a
                    href={`#${badge.sectionId}`}
                    onClick={onMenuItemClick(badge)}
                    className={cn("mobileNavLink", isActive && "isActive")}
                    aria-current={isActive ? (location.pathname === "/" ? "location" : "page") : undefined}
                  >
                    <span className="mobileNavLinkIcon" aria-hidden="true">{renderBadgeIcon(badge.icon)}</span>
                    <span>{badge.label}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </>
  );
}
