import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";

import HomeHeroTitle from "../components/HomeHeroTitle";
import SideLinks from "../components/SideLinks";
import { AboutPageContent } from "./AboutPage";
import { profile } from "../data/profile";

// Ripple effect component for click interactions
interface Ripple {
  id: number;
  x: number;
  y: number;
  color: string;
}

function ClickRipples() {
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const handleClick = (e: React.MouseEvent) => {
    const colors = ["#ea580c", "#0ea5e9", "#a855f7"];
    
    // Create multiple ripples for more effect
    for (let i = 0; i < 2; i++) {
      setTimeout(() => {
        const newRipple: Ripple = {
          id: Date.now() + i,
          x: e.clientX + window.scrollX,
          y: e.clientY + window.scrollY,
          color: colors[Math.floor(Math.random() * colors.length)],
        };

        setRipples((prev) => [...prev, newRipple]);

        // Remove ripple after animation completes
        setTimeout(() => {
          setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
        }, 1200);
      }, i * 100);
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-auto z-40"
      onClick={handleClick}
      style={{ cursor: "crosshair" }}
    >
      {ripples.map((ripple) => (
        <motion.div
          key={ripple.id}
          className="absolute rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            border: `4px solid ${ripple.color}`,
            boxShadow: `0 0 30px ${ripple.color}, inset 0 0 30px ${ripple.color}`,
          }}
          initial={{
            width: 10,
            height: 10,
            opacity: 1,
            x: -5,
            y: -5,
          }}
          animate={{
            width: 500,
            height: 500,
            opacity: 0,
            x: -250,
            y: -250,
          }}
          transition={{
            duration: 1.2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}

// Animated Algorithm Flow Component
function AnimatedAlgorithmFlow() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1000 800"
      preserveAspectRatio="xMidYMid slice"
      style={{ filter: "drop-shadow(0 0 30px rgba(234, 88, 12, 0.4))" }}
    >
      {/* Animated paths for data flow */}
      <motion.path
        d="M 0 150 Q 250 100, 500 130 T 1000 180"
        stroke="url(#flowGradient1)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: [1000, 0, 1000] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        strokeDasharray="1000"
        opacity="0.9"
      />

      <motion.path
        d="M 1000 350 Q 750 300, 500 320 T 0 400"
        stroke="url(#flowGradient2)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: [1000, 0, 1000] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 1 }}
        strokeDasharray="1000"
        opacity="0.9"
      />

      <motion.path
        d="M 0 550 Q 250 600, 500 520 T 1000 620"
        stroke="url(#flowGradient3)"
        strokeWidth="8"
        fill="none"
        strokeLinecap="round"
        initial={{ strokeDashoffset: 1000 }}
        animate={{ strokeDashoffset: [1000, 0, 1000] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear", delay: 2 }}
        strokeDasharray="1000"
        opacity="0.9"
      />

      {/* Gradients for animated paths */}
      <defs>
        <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#ea580c" stopOpacity="0" />
          <stop offset="30%" stopColor="#ea580c" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#ea580c" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0" />
          <stop offset="30%" stopColor="#0ea5e9" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="flowGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
          <stop offset="30%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="70%" stopColor="#a855f7" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function HomePage() {
  const location = useLocation();

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
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 50%, rgba(234, 88, 12, 0.05) 0%, transparent 50%)",
        }}
      />

      {/* Animated Algorithm Flow */}
      <AnimatedAlgorithmFlow />

      {/* Click Ripple Effect */}
      <ClickRipples />

      {/* Floating decoration shapes */}
      <motion.div
        className="absolute top-20 right-10 w-64 h-64 bg-gradient-to-br from-orange-400/10 to-sky-400/10 rounded-full blur-3xl"
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
        className="absolute bottom-20 left-5 w-80 h-80 bg-gradient-to-br from-sky-400/10 to-orange-400/10 rounded-full blur-3xl"
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
        <HomeHeroTitle />
      </section>

      {/* Projects Section */}
      <section id="projects-section" className="relative z-20 min-h-screen px-6 py-24">
        <div id="projects-preview" className="h-px w-px" aria-hidden="true" />
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Projects</h2>
          <p className="mt-3 text-slate-600">A single-page flow: scroll to move between sections.</p>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {profile.projects.map((project) => (
              <a
                key={project.name}
                href={project.link}
                target="_blank"
                rel="noreferrer"
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)] transition hover:-translate-y-1"
              >
                <h3 className="text-xl font-bold text-slate-900">{project.name}</h3>
                <p className="mt-2 text-sm text-slate-600">{project.desc}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={`${project.name}-${tech}`}
                      className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white"
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
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Education</h2>
          <div className="mt-8 space-y-5">
            {profile.education.map((edu, idx) => (
              <div
                key={`${edu.institution}-${idx}`}
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
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
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Experience</h2>
          <div className="mt-8 space-y-5">
            {profile.experience.map((exp, idx) => (
              <div
                key={`${exp.company}-${idx}`}
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
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
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Skills</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {profile.skills.map((group) => (
              <div
                key={group.group}
                className="rounded-3xl border border-slate-200/80 bg-white/70 p-6 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)]"
              >
                <h3 className="text-lg font-bold text-slate-900">{group.group}</h3>
                <div className="mt-4 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={`${group.group}-${item}`}
                      className="rounded-full bg-slate-900/90 px-3 py-1 text-xs font-semibold text-white"
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
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white/70 p-8 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Languages</h2>
          <div className="mt-6 flex flex-wrap gap-3">
            {[
              "Hebrew",
              "English",
            ].map((language) => (
              <span key={language} className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-semibold text-white">
                {language}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Military Section */}
      <section id="military-section" className="relative z-20 min-h-screen px-6 py-24">
        <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-200/80 bg-white/70 p-8 backdrop-blur-sm shadow-[0_18px_45px_rgba(15,23,42,0.08)]">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">Military</h2>
          <p className="mt-4 text-slate-700">Military service details section.</p>
        </div>
      </section>

      <SideLinks />

    </div>
  );
}
