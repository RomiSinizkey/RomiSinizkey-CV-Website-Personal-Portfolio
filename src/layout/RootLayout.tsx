import { Outlet, useLocation } from "react-router-dom";
import AIAssistantWidget from "../components/AIAssistantWidget";
import TopNavbar from "../components/navbar/TopNavbar"; // <-- תעדכן לפי מיקום אמיתי
import NameLogo from "../components/NameLogo";

export default function RootLayout() {
  const location = useLocation();
  const isHomeRoute = location.pathname === "/";

  return (
    <>
      <TopNavbar />
      {isHomeRoute ? <NameLogo /> : null}
      <AIAssistantWidget />
      <Outlet />
    </>
  );
}