import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { InteractiveRobotSpline } from "./ui/interactive-3d-robot";
import { ParticleTextEffect } from "./ui/particle-text-effect";
import HomeHeroTitle from "./components/HomeHeroTitle";
import LanguagesSectionContent from "./components/LanguagesSectionContent";
import NameLogo from "./components/NameLogo";
import SideLinks from "./components/SideLinks";
import SkillsSectionContent from "./components/SkillsSectionContent";
import WeatherCard from "./components/WeatherCard";
import { AboutPageContent } from "../about/components/AboutPageContent";
import { EducationSectionContent } from "../education/components/EducationSectionContent";
import { ExperienceSectionContent } from "../experience/components/ExperienceSectionContent";
import { ProjectsSectionContent } from "../projects/components/ProjectsSectionContent";
import "./styles/homePage.css";

export default function HomePage() {
  const location = useLocation();
  const [robotSceneUrl] = useState(
    () => `https://my.spline.design/nexbotrobotcharacterconcept-RXF98eJ6aQt4FOd1COVXVCbe/?v=${Date.now()}`
  );

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
      if (s) {
        scrollToSection(s);
      }
    });
  }, [location.state]);

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Particle Text Effect Background */}
      <ParticleTextEffect />

      {/* Home Section */}
      <section
        id="home-section"
        className="relative overflow-hidden"
        style={{ minHeight: "140vh" }}
      >
        <InteractiveRobotSpline
          key={robotSceneUrl}
          scene={robotSceneUrl}
          className="absolute inset-x-0 top-[200px] z-0 h-screen w-full"
        />

        <button
          type="button"
          className="homepage-scroll-indicator pointer-events-auto"
          aria-label="Scroll down"
          onClick={() => scrollToSection("about-section")}
        >
          <div className="homepage-scrolldown">
            <div className="homepage-chevrons">
              <div className="homepage-chevrondown"></div>
              <div className="homepage-chevrondown"></div>
            </div>
          </div>
        </button>

        <div className="pointer-events-none absolute inset-0 z-20">
          <NameLogo />

          <div className="flex h-full w-full items-center justify-center translate-y-[15vh] translate-x-[190px] md:translate-x-[200px]">
            <HomeHeroTitle />
          </div>
        </div>

        <WeatherCard />
      </section>

      {/* About Section */}
      <section id="about-section" className="relative z-20 min-h-screen px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <AboutPageContent embedded />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects-section" className="relative z-20 min-h-screen px-6 py-24">
        <ProjectsSectionContent embedded />
      </section>

      {/* Education Section */}
      <section id="education-section" className="relative z-20 min-h-screen px-6 py-24">
        <EducationSectionContent embedded />
      </section>

      {/* Experience Section */}
      <section id="experience-section" className="relative z-20 min-h-screen px-6 py-24">
        <ExperienceSectionContent embedded />
      </section>

      {/* Skills Section */}
      <section id="skills-section" className="relative z-20 min-h-screen px-6 py-24">
        <SkillsSectionContent />
      </section>

      {/* Languages Section */}
      <section id="languages-section" className="relative z-20 min-h-screen px-6 py-24">
        <LanguagesSectionContent />
      </section>

      <SideLinks />

    </div>
  );
}
