import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import heroImg from "../assets/hero.jpg";

import SideLinks from "../components/SideLinks";
import NameLogo from "../components/NameLogo";
import TopNavbar from "../components/navbar/TopNavbar";
import HomeProjectsShowcase from "../components/HomeProjectsShowcase";

import HomeHeroTitle from "../components/HomeHeroTitle";


export default function HomePage() {
  const location = useLocation();

  useEffect(() => {
  const state = location.state as any | undefined;
  const s = state?.scrollTo as string | undefined;
  const openShowcase = Boolean(state?.openShowcase);

  if (!s && !openShowcase) return;

  requestAnimationFrame(() => {
    if (openShowcase) {
      window.dispatchEvent(new CustomEvent("home:projects:open"));
    }

    if (s) {
      const el = document.getElementById(s);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}, [location.state]);


  return (
    <div
      className="min-h-[200vh] w-full relative"
      style={{
        backgroundImage: `url(${heroImg})`,
        backgroundSize: "100%",
        backgroundPosition: "center bottom",
        backgroundRepeat: "no-repeat",
      }}
    >
      <TopNavbar />

      <HomeHeroTitle />

      {/* scroll target */}
      <div id="projects-preview" className="absolute left-0 top-[120vh] h-px w-px" aria-hidden="true" />

      <HomeProjectsShowcase />
      <SideLinks />
      <NameLogo />
    </div>
  );
}
