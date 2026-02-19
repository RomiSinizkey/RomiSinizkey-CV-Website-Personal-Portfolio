import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import AIAssistantWidget from "../components/AIAssistantWidget";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <ScrollToTop />
      <AIAssistantWidget />

    </>
  );
}
