import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { InteractiveRobotSpline } from "@/components/ui/interactive-3d-robot";

import HomeHeroTitle from "../components/HomeHeroTitle";
import NameLogo from "../components/NameLogo";
import SideLinks from "../components/SideLinks";
import WeatherCard from "../components/WeatherCard";
import { AboutPageContent } from "./AboutPage";
import { profile } from "../data/profile";
import "../styles/pages/homePage.css";

export default function HomePage() {
  const location = useLocation();
  const ROBOT_SCENE_URL = "https://my.spline.design/nexbotrobotcharacterconcept-RXF98eJ6aQt4FOd1COVXVCbe/";

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  useEffect(() => {
    const state = location.state as { scrollTo?: string; openShowcase?: boolean } | undefined;
    const s = state?.scrollTo as string | undefined;
    const openShowcase = Boolean(state?.openShowcase);

    if (!s && !openShowcase) return;

    requestAnimationFrame(() => {
      if (openShowcase) {
        window.dispatchEvent(new CustomEvent("home:projects:open"));
      }

      if (s) {
        scrollToSection(s);
      }
    });
  }, [location.state]);

  return (
    <div className="relative w-full overflow-x-hidden">
      {/* Animated background glow - moves with scroll */}
      <motion.div
        className="absolute inset-0 w-full h-full pointer-events-none homepage-background-glow"
      />

      {/* Floating decoration shapes */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-linear-to-br from-orange-400/10 to-sky-400/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, 20, 0],
          x: [0, 10, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className="absolute bottom-20 left-5 w-80 h-80 bg-linear-to-br from-sky-400/10 to-orange-400/10 rounded-full blur-3xl pointer-events-none"
        animate={{
          y: [0, -20, 0],
          x: [0, -10, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Home Section */}
      <section id="home-section" className="relative min-h-screen overflow-hidden">
        <InteractiveRobotSpline
          scene={ROBOT_SCENE_URL}
          className="absolute inset-0 z-0 w-full h-full"
        />

        <button
          type="button"
          className="homepage-scroll-indicator pointer-events-auto"
          aria-label="Scroll down"
          onClick={() => scrollToSection("projects-section")}
        >
          <div className="homepage-scrolldown">
            <div className="homepage-chevrons">
              <div className="homepage-chevrondown"></div>
              <div className="homepage-chevrondown"></div>
            </div>
          </div>
        </button>

        <div className="pointer-events-none">
          <NameLogo />
        </div>

        <div className="pointer-events-none">
          <HomeHeroTitle />
        </div>

        <WeatherCard />
      </section>

      {/* Projects Section */}
      <section id="projects-section" className="relative z-20 min-h-screen px-6 py-24">
        <div id="projects-preview" className="h-px w-px" aria-hidden="true" />
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="homepage-section-title">Projects</h2>
          <p className="mt-3 text-slate-600">A single-page flow: scroll to move between sections.</p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {profile.projects.map((project) => (
              <a
                key={project.name}
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="homepage-glass-card transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{project.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={`${project.name}-${tech}`}
                      className="homepage-pill-dark"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about-section" className="relative z-20 min-h-screen px-4 py-14 md:px-6 md:py-20">
        <div className="mx-auto w-full max-w-6xl">
          <AboutPageContent embedded />
        </div>
      </section>

      {/* Education Section */}
      <section id="education-section" className="relative z-20 min-h-screen px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="homepage-section-title">Education</h2>
          <div className="mt-8 space-y-5">
            {profile.education.map((edu, idx) => (
              <div
                key={`${edu.institution}-${idx}`}
                className="homepage-glass-card"
              >
                <h3 className="text-xl font-bold text-slate-900">{edu.degree}</h3>
                <p className="mt-1 text-slate-700">{edu.institution}</p>
                <p className="mt-1 text-sm text-slate-500">{edu.years}</p>
                {edu.details?.length ? (
                  <ul className="mt-4 space-y-2 text-sm text-slate-700">
                    {edu.details.map((detail) => (
                      <li key={detail}>• {detail}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience-section" className="relative z-20 min-h-screen px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="homepage-section-title">Experience</h2>
          <div className="mt-8 space-y-5">
            {profile.experience.map((exp, idx) => (
              <div
                key={`${exp.company}-${idx}`}
                className="homepage-glass-card"
              >
                <h3 className="text-xl font-bold text-slate-900">{exp.title}</h3>
                <p className="mt-1 text-slate-700">{exp.company}</p>
                <p className="mt-1 text-sm text-slate-500">{exp.years}</p>
                <ul className="mt-4 space-y-2 text-sm text-slate-700">
                  {exp.bullets.map((bullet) => (
                    <li key={bullet}>• {bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills-section" className="relative z-20 min-h-screen px-6 py-24">
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="homepage-section-title">Skills</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {profile.skills.map((group) => (
              <div
                key={group.group}
                className="homepage-glass-card"
              >
                <h3 className="text-lg font-bold text-slate-900">{group.group}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={`${group.group}-${item}`}
                      className="homepage-pill-dark"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Languages Section */}
      <section id="languages-section" className="relative z-20 min-h-screen px-6 py-24">
        <div className="mx-auto w-full max-w-5xl homepage-glass-panel">
          <h2 className="homepage-section-title">Languages</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Hebrew",
              "English",
            ].map((language) => (
              <span key={language} className="homepage-pill-language">
                {language}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Military Section */}
      <section id="military-section" className="relative z-20 min-h-screen px-6 py-24">
        <div className="mx-auto w-full max-w-5xl homepage-glass-panel">
          <h2 className="homepage-section-title">Military</h2>
          <p className="mt-4 text-slate-700">Military service details section.</p>
        </div>
      </section>

      <SideLinks />

    </div>
  );
}
