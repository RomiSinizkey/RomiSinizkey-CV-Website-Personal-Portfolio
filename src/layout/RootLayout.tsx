import { Outlet } from "react-router-dom";
import AIAssistantWidget from "@/components/assistant/AIAssistantWidget";
import TopNavbar from "@/components/layout/TopNavbar";

interface Props {
  ready?: boolean;
}

export default function RootLayout({ ready = false }: Props) {
  return (
    <>
      <div style={{ position: "relative", zIndex: 1 }}>
        <TopNavbar />
        <AIAssistantWidget ready={ready} />
        <Outlet />
      </div>
    </>
  );
}
