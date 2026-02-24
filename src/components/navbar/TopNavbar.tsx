import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useRef, useState } from "react";
import type { MouseEvent } from "react";

const links = [
  { label: "Home", to: "/" },
  { label: "Projects", to: "/projects" },
  { label: "About", to: "/about" },
  { label: "Education", to: "/education" },
  { label: "Experience", to: "/experience" },
  { label: "Skills", to: "/skills" },
  { label: "Languages", to: "/languages" },
  { label: "Military", to: "/military" },
];

function fireShowcaseOpen() {
  window.dispatchEvent(new CustomEvent("home:projects:open"));
}

function scrollToProjectsPreview() {
  const el = document.getElementById("projects-preview");
  if (!el) return;
  const y = el.getBoundingClientRect().top + window.scrollY - 24;
  window.scrollTo({ top: y, behavior: "smooth" });
}

type FX = {
  id: string;
  owner: string; // which button
  x: number;
  y: number;
  glyphs: string[];
};

function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);

  const [fx, setFx] = useState<FX[]>([]);
  const timers = useRef<number[]>([]);

  const spawnFX = (e: MouseEvent, owner: string) => {
    const target = e.currentTarget as HTMLElement;
    const r = target.getBoundingClientRect();

    const x = e.clientX - r.left;
    const y = e.clientY - r.top;

    const pool = ["<>", "{ }", "[]", "()", "=>", "&&", "||", "git", "API", "SQL", "TS", "UI", "0", "1"];
    // pick 7 glyphs, but deterministic enough
    const glyphs = Array.from({ length: 7 }, (_, i) => pool[(Math.floor((x + y + i * 19) * 7) % pool.length + pool.length) % pool.length]);

    const id = uid();
    setFx((prev) => [...prev, { id, owner, x, y, glyphs }]);

    const t = window.setTimeout(() => {
      setFx((prev) => prev.filter((b) => b.id !== id));
    }, 950);

    timers.current.push(t);
  };

  const onProjectsClick = (e: MouseEvent) => {
    spawnFX(e, "Projects");

    e.preventDefault();
    if (location.pathname === "/") {
      fireShowcaseOpen();
      scrollToProjectsPreview();
      return;
    }
    navigate("/", { state: { scrollTo: "projects-preview", openShowcase: true } });
  };

  const onAnyClick = (label: string) => (e: MouseEvent) => {
    spawnFX(e, label);
  };

  return (
    <header className={`topNav ${collapsed ? "isCollapsed" : ""}`}>
      <button
        className="topNavToggle"
        type="button"
        onClick={() => setCollapsed((v) => !v)}
        aria-label="Toggle navigation"
      >
        <span className="topNavChevron">{collapsed ? "›" : "‹"}</span>
      </button>

      <nav className="topNavInner" aria-label="Primary">
        {links.map((l) => {
          if (l.label === "Projects") {
            return (
              <a
                key={l.label}
                href="/projects"
                className="topNavItem"
                onClick={onProjectsClick}
              >
                <span className="topNavLabel">Projects</span>

                {/* FX only for this button */}
                <span className="csfxLayer" aria-hidden="true">
                  {fx
                    .filter((b) => b.owner === "Projects")
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
          }

          return (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              onClick={onAnyClick(l.label)}
              className={({ isActive }) => `topNavItem ${isActive ? "isActive" : ""}`}
            >
              <span className="topNavLabel">{l.label}</span>

              {/* FX only for this button */}
              <span className="csfxLayer" aria-hidden="true">
                {fx
                  .filter((b) => b.owner === l.label)
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
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}