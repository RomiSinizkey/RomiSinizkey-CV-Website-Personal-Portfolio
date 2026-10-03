

import "./styles/rootLayout.css";
import { Outlet, useLocation } from "react-router-dom";
import AIAssistantWidget from "@/components/assistant/AIAssistantWidget";
import ScrollReactiveBackground from "@/components/ui/ScrollReactiveBackground";
import TopNavbar from "./TopNavbar";
import LuminousCursor from "@/components/shared/LuminousCursor";
import ScrollProgressBar from "@/components/shared/ScrollProgressBar";
import UnderConstructionOverlay from "@/components/shared/UnderConstructionOverlay";

interface Props {
  ready?: boolean;
}

export default function RootLayout({ ready = false }: Props) {
  const location = useLocation();
  const isProjectsPage = location.pathname === "/projects";
  const shouldShowOverlay = isProjectsPage && import.meta.env.PROD;

  return (
    <div className="root-layout">
      <div className="background-fixed">
        <ScrollReactiveBackground />
      </div>

      {shouldShowOverlay && <UnderConstructionOverlay />}

      <div className="content-wrapper">
        <LuminousCursor />
        <ScrollProgressBar />
        <TopNavbar />
        <AIAssistantWidget ready={ready} />
        <Outlet context={{ ready }} />
      </div>
    </div>
  );
}