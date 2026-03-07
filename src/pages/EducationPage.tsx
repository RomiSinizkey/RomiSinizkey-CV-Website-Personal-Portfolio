import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profile } from "../data/profile";

export default function EducationPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-8"
      >
        <h1 className="text-4xl font-semibold">Education</h1>
        <Link to="/" className="text-white/70 hover:text-white transition">← Home</Link>
      </motion.div>

      <div className="mt-8 space-y-6">
        {profile.education.map((edu, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur hover:bg-white/10 transition"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white">{edu.degree}</h2>
                <p className="text-white/60 mt-1">{edu.institution}</p>
                <p className="text-white/50 text-sm mt-2">{edu.years}</p>
              </div>
            </div>
            {edu.details && (
              <div className="mt-4">
                <ul className="space-y-2">
                  {edu.details.map((detail, i) => (
                    <li key={i} className="text-white/70 text-sm flex items-start">
                      <span className="mr-3 text-orange-500">•</span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
