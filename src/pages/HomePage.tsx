import NameLogo from "@/components/hero/NameLogo";
import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import HeroTitle from "@/components/hero/HeroTitle";
import QuickLinks from "@/components/hero/QuickLinks";
import { LanguagesSection } from "@/sections/LanguagesSection";
import { SkillsSection } from "@/sections/SkillsSection";
import UnderConstructionOverlay from "@/components/effects/UnderConstructionOverlay";
import { AboutSection } from "@/sections/AboutSection";
import { EducationSection } from "@/sections/EducationSection";
import { ExperienceSection } from "@/sections/ExperienceSection";
import { ProjectsSection } from "@/sections/ProjectsSection";
import { scrollToSection } from "@/lib/scrollToSection";

export default function HomePage() {
  const location = useLocation();
  const homeSectionRef = useRef<HTMLElement | null>(null);
  const [activeSection, setActiveSection] = useState("home-section");

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

  const shouldShowOverlay =
    activeSection !== "home-section" &&
    activeSection !== "about-section" &&
    import.meta.env.PROD;
  // Sections covered by the Under Construction overlay are `inert` in production (no keyboard focus,
  // clicks or screen-reader access). Always on, not only while the overlay shows, so Tab can never slip
  // into them from Home/About before the overlay appears. Off in local development.
  // To remove Under Construction: delete this constant and its `inert` uses below.
  const sectionsUnderConstruction = import.meta.env.PROD;

  return (
    <div className="relative w-full overflow-x-hidden">
      {shouldShowOverlay && <UnderConstructionOverlay />}

      <section
      id="home-section"
      ref={homeSectionRef}
      className="relative flex min-h-screen flex-col items-center justify-center px-4 pt-28 pb-14"
    >
      <div className="pointer-events-auto absolute top-4 left-4 z-30">
        <NameLogo />
      </div>

      {/* Centered in the space below the fixed navbar (the top padding clears it). The section grows
          instead of overlapping the navbar when the content is taller than a short phone screen. */}
      <div className="relative z-20 flex w-full flex-col items-center">
        <HeroTitle />
        <QuickLinks />
      </div>
    </section>

      <section
        id="about-section"
        className="relative z-20 min-h-[120vh] px-4 py-20 md:px-6 md:py-28"
      >
        <div className="mx-auto w-full max-w-7xl">
          <AboutSection embedded />
        </div>
      </section>

      <section
        id="projects-section"
        inert={sectionsUnderConstruction}
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <ProjectsSection embedded />
      </section>

      <section
        id="education-section"
        inert={sectionsUnderConstruction}
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <EducationSection embedded />
      </section>

      <section
        id="experience-section"
        inert={sectionsUnderConstruction}
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <ExperienceSection embedded />
      </section>

      <section
        id="skills-section"
        inert={sectionsUnderConstruction}
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <SkillsSection />
      </section>

      <section
        id="languages-section"
        inert={sectionsUnderConstruction}
        className="relative z-20 min-h-[120vh] px-6 py-28"
      >
        <LanguagesSection />
      </section>
    </div>
  );
}