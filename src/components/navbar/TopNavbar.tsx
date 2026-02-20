import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
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

export default function TopNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const onProjectsClick = (e: MouseEvent) => {
    e.preventDefault();

    if (location.pathname === "/") {
      fireShowcaseOpen();
      scrollToProjectsPreview();
      return;
    }

    navigate("/", { state: { scrollTo: "projects-preview", openShowcase: true } });
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
              <a key={l.label} href="/projects" className="topNavItem" onClick={onProjectsClick}>
                <span className="topNavLabel">Projects</span>
              </a>
            );
          }

          return (
            <NavLink
              key={l.label}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) => `topNavItem ${isActive ? "isActive" : ""}`}
            >
              <span className="topNavLabel">{l.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </header>
  );
}
