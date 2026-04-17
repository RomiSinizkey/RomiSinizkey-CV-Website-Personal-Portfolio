import NameLogo from "./components/NameLogo";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import HomeHeroTitle from "./components/HomeHeroTitle";
import LanguagesSectionContent from "./components/LanguagesSectionContent";
import SideLinks from "./components/SideLinks";
import SkillsSectionContent from "./components/SkillsSectionContent";
import UnderConstructionOverlay from "@/components/shared/UnderConstructionOverlay";
import { AboutPageContent } from "../about/components/AboutPageContent";
import { EducationSectionContent } from "../education/components/EducationSectionContent";
import { ExperienceSectionContent } from "../experience/components/ExperienceSectionContent";
import { ProjectsSectionContent } from "../projects/components/ProjectsSectionContent";
import "./styles/homePage.css";

export default function HomePage() {
  const location = useLocation();
  const homeSectionRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState("home-section");

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const state = location.state as { scrollTo?: string } | undefined;
    const s = state?.scrollTo as string | undefined;

    if (!s) return;

    requestAnimationFrame(() => {
      scrollToSection(s);
    });
  }, [location.state]);

  useEffect(() => {
    const sectionIds = [
      "home-section",
      "about-section",
      "projects-section",
      "education-section",
      "experience-section",
      "skills-section",
      "languages-section",
    ];

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        threshold: [0.2, 0.35, 0.5, 0.7],
        rootMargin: "-10% 0px -10% 0px",
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const shouldShowOverlay = activeSection !== "home-section";

  return (
    <div className="relative w-full overflow-x-hidden">
      {shouldShowOverlay && <UnderConstructionOverlay />}

      <section
      id="home-section"
      ref={homeSectionRef}
      className="relative min-h-screen"
    >
      <div className="pointer-events-auto absolute top-4 left-4 z-30">
        <NameLogo />
      </div>

      {/* TRUE CENTER */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <HomeHeroTitle />
      </div>
    </section>

      <section
        id="about-section"
        className="relative z-20 min-h-[120vh] px-4 py-20 md:px-6 md:py-28"
      >
        <div className="mx-auto w-full max-w-6xl">
          <AboutPageContent embedded />
        </div>
      </section>

      <section
        id="projects-section"
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <ProjectsSectionContent embedded />
      </section>

      <section
        id="education-section"
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <EducationSectionContent embedded />
      </section>

      <section
        id="experience-section"
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <ExperienceSectionContent embedded />
      </section>

      <section
        id="skills-section"
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <SkillsSectionContent />
      </section>

      <section
        id="languages-section"
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <LanguagesSectionContent />
      </section>

      <SideLinks />
    </div>
  );
}