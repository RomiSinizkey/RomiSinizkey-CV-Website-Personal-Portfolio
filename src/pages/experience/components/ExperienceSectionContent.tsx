import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profile } from "@/data/profile";

interface ExperienceSectionContentProps {
  embedded?: boolean;
}

export function ExperienceSectionContent({ embedded = false }: ExperienceSectionContentProps) {
  return (
    <div className="relative min-h-screen">
      {embedded ? (
        <div className="mx-auto w-full max-w-5xl">
          <h2 className="homepage-section-title">Experience</h2>
          <div className="mt-8 space-y-5">
            {profile.experience.map((exp, idx) => (
              <div key={`${exp.company}-${idx}`} className="homepage-glass-card">
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
      ) : (
        <div className="mx-auto max-w-4xl px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 flex items-center justify-between"
          >
            <h1 className="text-4xl font-semibold">Experience</h1>
            <Link to="/" className="text-white/70 transition hover:text-white">
              ← Home
            </Link>
          </motion.div>

          <div className="mt-8 space-y-6">
            {profile.experience.map((exp, idx) => (
              <motion.div
                key={`${exp.company}-${idx}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur transition hover:bg-white/10"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-white">{exp.title}</h2>
                    <p className="mt-1 text-white/60">{exp.company}</p>
                    <p className="mt-2 text-sm text-white/50">{exp.years}</p>
                  </div>
                </div>

                {exp.bullets.length ? (
                  <div className="mt-4">
                    <ul className="space-y-2">
                      {exp.bullets.map((bullet) => (
                        <li key={bullet} className="flex items-start text-sm text-white/70">
                          <span className="mr-3 text-orange-500">•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}