import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { profile } from "../data/profile";

/** ---------- small UI bits ---------- */

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80 backdrop-blur">
      {children}
    </span>
  );
}

function GlowCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"
    >
      {/* subtle gradient sheen */}
      <div className="pointer-events-none absolute -inset-40 opacity-0 blur-3xl transition duration-500 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(255,255,255,0.16), rgba(255,255,255,0) 60%)",
        }}
      />
      <div className="relative">
        <div className="text-base font-semibold tracking-tight">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-white/60">{subtitle}</div> : null}
        <div className="mt-4">{children}</div>
      </div>
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 280, damping: 24 }}
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-4 backdrop-blur"
    >
      <div className="text-xs text-white/55">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight">{value}</div>
    </motion.div>
  );
}

function Img({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.55, ease: "easeOut" }}
      className={`relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className="h-full w-full object-cover"
        onError={(e) => {
          // graceful fallback if image missing
          e.currentTarget.style.display = "none";
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
    </motion.div>
  );
}

/** ---------- animated background "code words" ---------- */

type FloatToken = {
  id: string;
  text: string;
  xPct: number;
  yPct: number;
  size: number;
  dur: number;
  delay: number;
  drift: number;
};

function CodeFloatBg({ tokens }: { tokens: FloatToken[] }) {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {/* base glows */}
      <div className="absolute -left-28 -top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute -right-28 top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-1/3 bottom-[-150px] h-96 w-96 rounded-full bg-white/5 blur-3xl" />

      {/* grid haze */}
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(circle at 40% 30%, black 0%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(circle at 40% 30%, black 0%, transparent 68%)",
        }}
      />

      {/* floating code tokens */}
      {tokens.map((t) => (
        <motion.div
          key={t.id}
          className="absolute select-none font-mono text-white/20"
          style={{
            left: `${t.xPct}%`,
            top: `${t.yPct}%`,
            fontSize: t.size,
            filter: "blur(0px)",
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{
            opacity: [0.12, 0.30, 0.12],
            y: [0, -t.drift, 0],
            x: [0, 10, 0],
          }}
          transition={{
            duration: t.dur,
            repeat: Infinity,
            ease: "easeInOut",
            delay: t.delay,
          }}
        >
          {t.text}
        </motion.div>
      ))}

      {/* subtle moving noise (cheap) */}
      <motion.div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)' opacity='.35'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
        }}
        animate={{ x: [0, -60, 0], y: [0, 40, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
}

/** ---------- page ---------- */

export default function AboutPage() {
  const firstName = profile.fullName?.split(" ")?.[0] ?? "Romi";

  const socials = profile.socials ?? [];
  const github = socials.find((s) => s.label.toLowerCase().includes("github"))?.href;
  const linkedin = socials.find((s) => s.label.toLowerCase().includes("linkedin"))?.href;

  // Keep About high-level (no repeating full CV sections)
  const story =
    profile.summary ??
    "I build clean, maintainable software with strong UX, solid structure, and fast iteration.";

  // floating tokens — deterministic-ish
  const tokens = useMemo<FloatToken[]>(() => {
    const words = [
      "React", "TypeScript", "Node.js", "Docker", "SQL", "API", "Clean Code",
      "git push", "npm run build", "await", "const", "interface", "zod",
      "useEffect()", "useState()", "CI/CD", "Design System", "Performance",
      "UX", "Architecture", "Testing", "Debug", "Deploy", "Vite",
      "framer-motion", "Express", "MariaDB", "REST", "JSON",
    ];

    // fixed set (no Math.random each render)
    const preset: Array<[number, number, number, number, number, number]> = [
      [8, 18, 12, 10, 0.2, 22],
      [72, 14, 13, 12, 1.1, 26],
      [20, 55, 11, 11, 0.6, 18],
      [84, 62, 12, 13, 0.9, 24],
      [55, 40, 14, 14, 0.4, 28],
      [34, 78, 12, 12, 1.4, 20],
      [10, 72, 11, 10, 0.8, 16],
      [62, 84, 12, 11, 0.1, 18],
      [88, 34, 11, 10, 1.2, 15],
      [44, 16, 12, 12, 0.7, 20],
      [28, 32, 11, 13, 0.9, 22],
      [76, 78, 12, 14, 0.5, 24],
    ];

    return preset.map((p, i) => {
      const [xPct, yPct, size, dur, delay, drift] = p;
      return {
        id: `t${i}`,
        text: words[i % words.length],
        xPct,
        yPct,
        size,
        dur,
        delay,
        drift,
      };
    });
  }, []);

  const quickFacts = [
    { label: "Role", value: "Full-Stack" },
    { label: "Location", value: profile.location ?? "—" },
    { label: "Primary stack", value: "React + TypeScript" },
    { label: "Also", value: "Node.js · Docker · SQL" },
  ];

  const values = [
    {
      title: "Product-first mindset",
      desc: "I focus on what helps users, then ship in iterations with measurable improvements.",
    },
    {
      title: "Clean architecture",
      desc: "Readable code, good structure, and long-term maintainability—not just ‘making it work’.",
    },
    {
      title: "Ownership & speed",
      desc: "Comfortable taking a feature end-to-end: UI, API, data, and deployment.",
    },
  ];

  return (
    <div className="relative mx-auto max-w-6xl px-6 py-16">
      <CodeFloatBg tokens={tokens} />

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="text-4xl font-semibold tracking-tight"
          >
            About
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: "easeOut", delay: 0.05 }}
            className="mt-2 text-white/60"
          >
            A modern snapshot — story, mindset, and how I build.
          </motion.p>
        </div>

        <Link to="/" className="text-white/70 hover:text-white transition">
          ← Home
        </Link>
      </div>

      {/* hero */}
      <div className="mt-8 grid gap-5 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4">
          <Img src="/about/portrait.jpg" alt={`${profile.fullName} portrait`} className="h-[420px]" />
          <div className="flex flex-wrap gap-2">
            <Pill>Clean UI</Pill>
            <Pill>Solid Architecture</Pill>
            <Pill>Fast Iteration</Pill>
            <Pill>Ownership</Pill>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur"
        >
          {/* animated accent beam */}
          <motion.div
            className="pointer-events-none absolute -inset-40 opacity-30 blur-3xl"
            animate={{ rotate: [0, 8, 0], scale: [1, 1.04, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            style={{
              background:
                "radial-gradient(circle at 40% 35%, rgba(255,255,255,0.18), rgba(255,255,255,0) 62%)",
            }}
          />

          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/25 px-4 py-2 text-sm text-white/70">
              <span className="h-2 w-2 rounded-full bg-emerald-300/80" />
              Open to opportunities
            </div>

            <div className="mt-4">
              <div className="text-2xl font-semibold tracking-tight">{profile.fullName}</div>
              <div className="mt-1 text-sm text-white/60">
                {profile.headline} · {profile.location}
              </div>
            </div>

            <p className="mt-4 text-white/70 leading-relaxed">{story}</p>

            <div className="mt-6 flex flex-wrap gap-3">
              {profile.email ? (
                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Email me
                </a>
              ) : null}

              {github ? (
                <a
                  href={github}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  GitHub
                </a>
              ) : null}

              {linkedin ? (
                <a
                  href={linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  LinkedIn
                </a>
              ) : null}

              {profile.cv ? (
                <a
                  href={profile.cv}
                  className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-4 py-2 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  Download CV
                </a>
              ) : null}
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              {quickFacts.map((s) => (
                <Stat key={s.label} label={s.label} value={s.value} />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* values */}
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {values.map((v, i) => (
          <motion.div
            key={v.title}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.55, ease: "easeOut", delay: i * 0.06 }}
          >
            <GlowCard title={v.title}>
              <p className="text-sm leading-relaxed text-white/70">{v.desc}</p>
            </GlowCard>
          </motion.div>
        ))}
      </div>

      {/* life moments / images */}
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        <Img src="/about/work-1.jpg" alt="Work moment" className="h-[220px]" />
        <Img src="/about/work-2.jpg" alt="Another moment" className="h-[220px]" />
        <GlowCard title="A bit more personal" subtitle="Not a full CV — just the vibe">
          <p className="text-sm leading-relaxed text-white/70">
            I like building projects that feel premium: smooth motion, crisp UI, and solid engineering underneath.
            I’m fast, structured, and I care about the details.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Pill>Communication</Pill>
            <Pill>Problem-solving</Pill>
            <Pill>Discipline</Pill>
            <Pill>Shipping</Pill>
          </div>
        </GlowCard>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="mt-12 overflow-hidden rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8 backdrop-blur"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold tracking-tight">Let’s build something solid.</div>
            <div className="mt-1 text-sm text-white/60">
              If you’re hiring or have a project, I’d love to talk.
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            {profile.email ? (
              <a
                href={`mailto:${profile.email}`}
                className="inline-flex items-center justify-center rounded-2xl bg-white px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Contact {firstName}
              </a>
            ) : null}

            <Link
              to="/"
              className="inline-flex items-center justify-center rounded-2xl border border-white/15 bg-black/20 px-5 py-2.5 text-sm font-semibold text-white/80 transition hover:bg-white/10"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </motion.div>

      <div className="mt-8 text-center text-xs text-white/40">
        Motion, typography, and a code-floating background ✨
      </div>
    </div>
  );
}