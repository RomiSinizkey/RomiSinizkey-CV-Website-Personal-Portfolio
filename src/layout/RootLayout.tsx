import { Outlet } from "react-router-dom";
import ScrollToTop from "../components/ScrollToTop";
import AIAssistantWidget from "../components/AIAssistantWidget";
import TopNavbar from "../components/navbar/TopNavbar";

export default function RootLayout() {
  return (
    <>
      <Outlet />
      <TopNavbar />
      <ScrollToTop />
      <AIAssistantWidget />

    </>
  );
}
