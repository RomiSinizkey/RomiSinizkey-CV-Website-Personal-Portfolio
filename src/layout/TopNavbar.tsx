import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import type { FocusEvent as ReactFocusEvent, KeyboardEvent as ReactKeyboardEvent, MouseEvent, RefObject } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { scrollToSection } from "@/lib/scrollToSection";
import "./TopNavbar.css";

interface BadgeNav {
  id: string;
  label: string;
  sectionId: string;
  routePath?: string;
  icon: "home" | "projects" | "about" | "education" | "experience" | "skills" | "languages";
}

const cn = (...inputs: Array<string | false | null | undefined>) =>
  inputs.filter(Boolean).join(" ");

const badges: BadgeNav[] = [
  { id: "home", label: "Home", sectionId: "home-section", routePath: "/", icon: "home" },
  { id: "about", label: "About", sectionId: "about-section", routePath: "/about", icon: "about" },
  { id: "projects", label: "Projects", sectionId: "projects-section", routePath: "/projects", icon: "projects" },
  { id: "education", label: "Education", sectionId: "education-section", routePath: "/education", icon: "education" },
  { id: "experience", label: "Experience", sectionId: "experience-section", routePath: "/experience", icon: "experience" },
  { id: "skills", label: "Skills", sectionId: "skills-section", icon: "skills" },
  { id: "languages", label: "Languages", sectionId: "languages-section", icon: "languages" },
];

// Desktop/tablet pill: these three sit in the "More" dropdown; the rest are shown directly.
const MORE_IDS = new Set(["education", "skills", "languages"]);
const mainBadges = badges.filter((badge) => !MORE_IDS.has(badge.id));
const moreBadges = badges.filter((badge) => MORE_IDS.has(badge.id));

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

// How long a clicked destination stays highlighted while the page smooth-scrolls to it.
const SCROLL_TARGET_HOLD_MS = 1500;
const scrollTargetDeadline = () => performance.now() + SCROLL_TARGET_HOLD_MS; // only called from click handlers

// Phones get the compact menu button instead of the pill (keep in sync with TopNavbar.css).
const MOBILE_NAV_QUERY = "(max-width: 640px)";

/**
 * Shared behavior for the phone menu and the desktop "More" dropdown while open:
 * focus moves to the current item (or the first one), Escape closes and returns focus to the
 * trigger, and pressing anywhere outside closes it. "Outside" includes the ASK AI launcher,
 * so a menu and ASK AI are never open together.
 */
function useDismissableMenu(
  isOpen: boolean,
  triggerRef: RefObject<HTMLElement | null>,
  panelRef: RefObject<HTMLElement | null>,
  close: (restoreFocus?: boolean) => void
) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close(true);
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    const frame = requestAnimationFrame(() => {
      const panel = panelRef.current;
      (panel?.querySelector<HTMLElement>("[aria-current]") ?? panel?.querySelector<HTMLElement>("a"))?.focus({ preventScroll: true });
    });

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(frame);
    };
  }, [isOpen, triggerRef, panelRef, close]);
}

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const routeActiveBadgeId = badges.find((badge) => badge.routePath === location.pathname)?.id ?? null;

  const [activeSection, setActiveSection] = useState("home-section");

  // "Open" for both menus is tied to the current page (history key + path; the key alone is
  // "default" for hash-only changes), so any route change, including browser back/forward, closes them.
  const pageKey = `${location.key}:${location.pathname}`;

  // Phone menu (<= 640px).
  const [menuOpenKey, setMenuOpenKey] = useState<string | null>(null);
  const isMenuOpen = menuOpenKey === pageKey;
  const menuTriggerRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLElement | null>(null);
  const menuPanelId = useId();

  const closeMenu = useCallback((restoreFocus = false) => {
    setMenuOpenKey(null);
    if (restoreFocus) menuTriggerRef.current?.focus({ preventScroll: true });
  }, []);

  // Desktop/tablet "More" dropdown.
  const [moreOpenKey, setMoreOpenKey] = useState<string | null>(null);
  const isMoreOpen = moreOpenKey === pageKey;
  const moreTriggerRef = useRef<HTMLButtonElement | null>(null);
  const moreMenuRef = useRef<HTMLDivElement | null>(null);
  const moreMenuId = useId();

  const closeMore = useCallback((restoreFocus = false) => {
    setMoreOpenKey(null);
    if (restoreFocus) moreTriggerRef.current?.focus({ preventScroll: true });
  }, []);

  // After a click, keep the clicked destination highlighted while the page smooth-scrolls to it, instead of
  // briefly highlighting every section it passes. Released when the target is reached (or after SCROLL_TARGET_HOLD_MS).
  const scrollTargetRef = useRef<{ id: string; until: number } | null>(null);
  const setActiveFromScroll = useCallback((sectionId: string) => {
    const target = scrollTargetRef.current;
    if (target && performance.now() < target.until) {
      if (sectionId === target.id) scrollTargetRef.current = null;
      return;
    }
    scrollTargetRef.current = null;
    setActiveSection(sectionId);
  }, []);

  // Sliding highlight behind the current main item.
  const pillNavRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);

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

      setActiveFromScroll(closestId);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

        const topVisible = visible[0]?.target as HTMLElement | undefined;
        if (topVisible?.id) {
          setActiveFromScroll(topVisible.id);
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
  }, [location.pathname, setActiveFromScroll]);

  useDismissableMenu(isMenuOpen, menuTriggerRef, menuPanelRef, closeMenu);
  useDismissableMenu(isMoreOpen, moreTriggerRef, moreMenuRef, closeMore);

  // Crossing the phone breakpoint closes whichever menu belongs to the layout being left.
  useEffect(() => {
    const media = window.matchMedia(MOBILE_NAV_QUERY);
    const onChange = () => {
      if (media.matches) setMoreOpenKey(null);
      else setMenuOpenKey(null);
    };
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const isBadgeActive = (badge: BadgeNav) =>
    location.pathname === "/" ? activeSection === badge.sectionId : routeActiveBadgeId === badge.id;
  const ariaCurrent = (isActive: boolean) => (isActive ? (location.pathname === "/" ? "location" : "page") : undefined);

  const activeMainId = mainBadges.find((badge) => isBadgeActive(badge))?.id ?? null;
  const activeMoreBadge = moreBadges.find((badge) => isBadgeActive(badge)) ?? null;

  // Move the highlight under the current main item (hidden when the current section is inside "More",
  // which then shows an orange dot). Re-measured when the pill resizes (fonts, breakpoints).
  useLayoutEffect(() => {
    const nav = pillNavRef.current;
    const indicator = indicatorRef.current;
    if (!nav || !indicator) return;

    const place = () => {
      const link = activeMainId ? nav.querySelector<HTMLElement>(`[data-nav-id="${activeMainId}"]`) : null;
      if (!link || link.offsetWidth === 0) {
        indicator.style.opacity = "0";
        return;
      }
      indicator.style.opacity = "1";
      indicator.style.width = `${link.offsetWidth}px`;
      indicator.style.transform = `translateX(${link.offsetLeft}px)`;
    };

    place();
    // Enable the slide only after the first placement, so it doesn't animate in from the left on load.
    const frame = requestAnimationFrame(() => indicator.classList.add("isReady"));
    const resizeObserver = new ResizeObserver(place);
    resizeObserver.observe(nav);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
    };
  }, [activeMainId]);

  const goToBadge = (badge: BadgeNav) => {
    scrollTargetRef.current = { id: badge.sectionId, until: scrollTargetDeadline() };
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

  const onMainItemClick = (badge: BadgeNav) => (e: MouseEvent) => {
    e.preventDefault();
    closeMore();
    goToBadge(badge);
  };

  const onMoreItemClick = (badge: BadgeNav) => (e: MouseEvent) => {
    e.preventDefault();
    closeMore(true);
    goToBadge(badge);
  };

  const onMenuItemClick = (badge: BadgeNav) => (e: MouseEvent) => {
    e.preventDefault();
    closeMenu(true);
    goToBadge(badge);
  };

  // Arrow keys: on "More" they open the dropdown; inside it they move between items.
  const onMoreTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setMoreOpenKey(pageKey);
    }
  };

  const onMoreMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const links = Array.from(moreMenuRef.current?.querySelectorAll<HTMLElement>("a") ?? []);
    const index = links.indexOf(document.activeElement as HTMLElement);
    const target =
      event.key === "ArrowDown" ? links[(index + 1) % links.length]
      : event.key === "ArrowUp" ? links[(index - 1 + links.length) % links.length]
      : event.key === "Home" ? links[0]
      : event.key === "End" ? links[links.length - 1]
      : null;
    if (target) {
      event.preventDefault();
      target.focus();
    }
  };

  // Tabbing out of a menu closes it (a null target means the window lost focus: keep it open).
  const onMoreMenuBlur = (event: ReactFocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && !moreMenuRef.current?.contains(next) && !moreTriggerRef.current?.contains(next)) closeMore();
  };

  const onMenuPanelBlur = (event: ReactFocusEvent) => {
    const next = event.relatedTarget as Node | null;
    if (next && !menuPanelRef.current?.contains(next) && !menuTriggerRef.current?.contains(next)) closeMenu();
  };

  return (
    <>
      {/* Desktop/tablet (>= 641px): floating glass pill. */}
      <header className="topNav">
        <nav ref={pillNavRef} className="pillNav" aria-label="Primary">
          <span ref={indicatorRef} className="pillIndicator" aria-hidden="true" />
          <ul className="pillList">
            {mainBadges.map((badge) => {
              const isActive = isBadgeActive(badge);

              return (
                <li key={badge.id}>
                  <a
                    href={`#${badge.sectionId}`}
                    data-nav-id={badge.id}
                    onClick={onMainItemClick(badge)}
                    className={cn("pillLink", isActive && "isActive")}
                    aria-current={ariaCurrent(isActive)}
                  >
                    <span className="pillLabel">
                      {badge.label}
                      {/* Orange "water" fill layer for the current item (visual only). */}
                      <span className="pillLabelFill" aria-hidden="true">{badge.label}</span>
                    </span>
                  </a>
                </li>
              );
            })}

            <li className="pillMore">
              <button
                ref={moreTriggerRef}
                type="button"
                className={cn("pillLink pillMoreButton", isMoreOpen && "isOpen", activeMoreBadge && "hasActive")}
                aria-expanded={isMoreOpen}
                aria-controls={moreMenuId}
                aria-label={activeMoreBadge ? `More, current section: ${activeMoreBadge.label}` : undefined}
                onClick={() => (isMoreOpen ? closeMore() : setMoreOpenKey(pageKey))}
                onKeyDown={onMoreTriggerKeyDown}
              >
                More
                <ChevronDown className="pillMoreChevron" size={14} strokeWidth={2.2} aria-hidden="true" />
              </button>

              <div
                ref={moreMenuRef}
                id={moreMenuId}
                className={cn("pillMenu", isMoreOpen && "isOpen")}
                onKeyDown={onMoreMenuKeyDown}
                onBlur={onMoreMenuBlur}
              >
                <ul className="pillMenuList">
                  {moreBadges.map((badge) => {
                    const isActive = isBadgeActive(badge);

                    return (
                      <li key={badge.id}>
                        <a
                          href={`#${badge.sectionId}`}
                          onClick={onMoreItemClick(badge)}
                          className={cn("pillMenuLink", isActive && "isActive")}
                          aria-current={ariaCurrent(isActive)}
                        >
                          <span className="pillMenuIcon" aria-hidden="true">{renderBadgeIcon(badge.icon)}</span>
                          <span>{badge.label}</span>
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </li>
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
          onBlur={onMenuPanelBlur}
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
                    aria-current={ariaCurrent(isActive)}
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
