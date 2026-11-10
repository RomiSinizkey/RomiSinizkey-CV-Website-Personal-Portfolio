

import "./RootLayout.css";
import { Outlet, useLocation } from "react-router-dom";
import AIAssistantWidget from "@/components/assistant/AIAssistantWidget";
import ScrollReactiveBackground from "@/components/effects/ScrollReactiveBackground";
import TopNavbar from "./TopNavbar";
import LuminousCursor from "@/components/effects/LuminousCursor";
import ScrollProgressBar from "@/components/effects/ScrollProgressBar";
import UnderConstructionOverlay from "@/components/effects/UnderConstructionOverlay";

interface Props {
  ready?: boolean;
}

export default function RootLayout({ ready = false }: Props) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isHomeOrAbout = isHome || location.pathname === "/about";
  const shouldShowOverlay = !isHomeOrAbout && import.meta.env.PROD;

  return (
    <div className="root-layout">
      <div className="background-fixed">
        <ScrollReactiveBackground />
      </div>

      {/* "is-subpage" adds top spacing so standalone pages start below the fixed navbar (see RootLayout.css). */}
      <div className={isHome ? "content-wrapper" : "content-wrapper is-subpage"}>
        {/* Rendered inside .content-wrapper so it shares a stacking context with the navbar and
            ASK AI launcher, which sit above it (overlay z-index 99998 < navbar 99999). */}
        {shouldShowOverlay && <UnderConstructionOverlay />}
        <LuminousCursor />
        <ScrollProgressBar />
        <TopNavbar />
        <AIAssistantWidget ready={ready} />
        {/* inert while the overlay covers this page (same condition), so its hidden content cannot be focused or clicked. */}
        <main id="main-content" inert={shouldShowOverlay}>
          <Outlet context={{ ready }} />
        </main>
      </div>
    </div>
  );
}