import { Outlet } from "react-router-dom";
import { AIAssistantWidget } from "../components/AI_ASIS";
import TopNavbar from "../components/navbar/TopNavbar";
import MoltenCoreShader from "../components/BackGround";

export default function RootLayout() {
  return (
    <>
      <MoltenCoreShader />
      <div style={{ position: "relative", zIndex: 1 }}>
        <TopNavbar />
        <AIAssistantWidget />
        <Outlet />
      </div>
    </>
  );
}