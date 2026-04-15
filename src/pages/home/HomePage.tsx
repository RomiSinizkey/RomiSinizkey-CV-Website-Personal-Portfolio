import { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { InteractiveRobotSpline } from "./ui/interactive-3d-robot";
import { ParticleTextEffect } from "./ui/particle-text-effect";
import HomeHeroTitle from "./components/HomeHeroTitle";
import LanguagesSectionContent from "./components/LanguagesSectionContent";
import NameLogo from "./components/NameLogo";
import SideLinks from "./components/SideLinks";
import SkillsSectionContent from "./components/SkillsSectionContent";
import UnderConstructionOverlay from "@/components/shared/UnderConstructionOverlay";
import { AboutPageContent } from "../about/components/AboutPageContent";
import { EducationSectionContent } from "../education/components/EducationSectionContent";
import { ExperienceSectionContent } from "../experience/components/ExperienceSectionContent";
import { ProjectsSectionContent } from "../projects/components/ProjectsSectionContent";
import "./styles/homePage.css";

interface HomePageProps {
  ready?: boolean;
}

export default function HomePage({ ready = false }: HomePageProps) {
  const location = useLocation();
  const robotSceneUrl =
    "https://prod.spline.design/qSFbDZTu6VOP7iPp/scene.splinecode";
  const robotCanvasRef = useRef<HTMLCanvasElement | null>(null);
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

  useEffect(() => {
    const dispatchToSpline = (
      type: "pointermove" | "pointerenter" | "pointerleave",
      event: PointerEvent
    ) => {
      const canvas = robotCanvasRef.current;
      const homeSection = homeSectionRef.current;
      if (!canvas || !homeSection) return;

      const sectionRect = homeSection.getBoundingClientRect();
      const canvasRect = canvas.getBoundingClientRect();

      const insideHomeSection =
        event.clientX >= sectionRect.left &&
        event.clientX <= sectionRect.right &&
        event.clientY >= sectionRect.top &&
        event.clientY <= sectionRect.bottom;

      if (!insideHomeSection && type === "pointermove") return;

      const sectionWidth = Math.max(sectionRect.width, 1);
      const sectionHeight = Math.max(sectionRect.height, 1);

      const relativeX = (event.clientX - sectionRect.left) / sectionWidth;
      const relativeY = (event.clientY - sectionRect.top) / sectionHeight;

      const mappedClientX = canvasRect.left + relativeX * canvasRect.width;

      const verticalBias = 0.45;
      const biasedY = Math.min(Math.max(relativeY + verticalBias, 0), 1);

      const mappedClientY = canvasRect.top + biasedY * canvasRect.height;

      const forwardedEvent = new PointerEvent(type, {
        bubbles: true,
        cancelable: true,
        pointerId: event.pointerId,
        pointerType: event.pointerType || "mouse",
        isPrimary: event.isPrimary,
        clientX: mappedClientX,
        clientY: mappedClientY,
        screenX: event.screenX,
        screenY: event.screenY,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        button: event.button,
        buttons: event.buttons,
      });

      canvas.dispatchEvent(forwardedEvent);
    };

    const handlePointerMove = (event: PointerEvent) => {
      dispatchToSpline("pointermove", event);
    };

    const handlePointerEnter = (event: PointerEvent) => {
      dispatchToSpline("pointerenter", event);
    };

    const handlePointerLeave = (event: PointerEvent) => {
      dispatchToSpline("pointerleave", event);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerdown", handlePointerEnter);
    window.addEventListener("pointerup", handlePointerEnter);
    window.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerEnter);
      window.removeEventListener("pointerup", handlePointerEnter);
      window.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const shouldShowOverlay = activeSection !== "home-section";

  return (
    <div className="relative w-full overflow-x-hidden">
      {shouldShowOverlay && <UnderConstructionOverlay />}

      <ParticleTextEffect />

      <section
        id="home-section"
        ref={homeSectionRef}
        className="relative overflow-hidden"
        style={{ minHeight: "160vh" }}
      >
        {/* Transparent overlay for pointer event forwarding */}
        <div
          aria-hidden="true"
          className="absolute inset-0 z-10 w-full h-full"
          style={{ pointerEvents: 'auto', background: 'transparent' }}
          onPointerMove={e => {
            const canvas = robotCanvasRef.current;
            if (!canvas) return;
            const evt = new PointerEvent('pointermove', {
              bubbles: true,
              cancelable: true,
              clientX: e.clientX,
              clientY: e.clientY,
              screenX: e.screenX,
              screenY: e.screenY,
              movementX: e.movementX,
              movementY: e.movementY,
              altKey: e.altKey,
              ctrlKey: e.ctrlKey,
              shiftKey: e.shiftKey,
              metaKey: e.metaKey,
              button: e.button,
              buttons: e.buttons,
              pointerId: e.pointerId,
              pointerType: e.pointerType,
              isPrimary: e.isPrimary,
              view: window,
              relatedTarget: null,
            });
            canvas.dispatchEvent(evt);
          }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-[250px] z-0 h-screen w-full overflow-hidden"
          style={{ minWidth: 600, minHeight: 500 }}
        >
          <InteractiveRobotSpline
            key={robotSceneUrl}
            scene={robotSceneUrl}
            className="w-full h-full"
            canvasRef={robotCanvasRef}
          />
        </div>

        {ready ? (
          <div className="pointer-events-auto absolute left-0 top-0 z-30">
            <NameLogo />
          </div>
        ) : null}

        <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 w-fit -translate-x-1/2 -translate-y-[320%] px-4">
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