import { Outlet, useLocation } from "react-router-dom";
import AIAssistantWidget from "@/components/assistant/AIAssistantWidget";
import TopNavbar from "@/components/layout/TopNavbar";
import LuminousCursor from "@/components/shared/LuminousCursor";
import ScrollProgressBar from "@/components/shared/ScrollProgressBar";
import UnderConstructionOverlay from "@/components/shared/UnderConstructionOverlay";

interface Props {
  ready?: boolean;
}

export default function RootLayout({ ready = false }: Props) {
  const location = useLocation();

  const isHomePage = location.pathname === "/";
  const shouldShowOverlay = !isHomePage;

  return (
    <>
      {shouldShowOverlay && <UnderConstructionOverlay />}

      <div style={{ position: "relative", zIndex: 1 }}>
        <LuminousCursor />
        <ScrollProgressBar />
        <TopNavbar />
        <AIAssistantWidget ready={ready} />
        <Outlet />
      </div>
    </>
  );
}