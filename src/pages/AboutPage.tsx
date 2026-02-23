import { Link } from "react-router-dom";
import { profile } from "../data/profile";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-white/80">
      {children}
    </span>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-xl font-semibold">{value}</div>
    </div>
  );
}

function Card({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
      <div>
        <div className="text-base font-semibold">{title}</div>
        {subtitle ? <div className="mt-1 text-sm text-white/60">{subtitle}</div> : null}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  const firstName = profile.fullName?.split(" ")?.[0] ?? "Romi";

  const socials = profile.socials ?? [];
  const github = socials.find((s) => s.label.toLowerCase().includes("github"))?.href;
  const linkedin = socials.find((s) => s.label.toLowerCase().includes("linkedin"))?.href;

  // IMPORTANT: Do NOT repeat Projects/Education/Experience/Skills here
  // (You already have dedicated sections/pages in your navbar)
  const story =
    profile.summary ??
    "I build clean, maintainable software with great UX and solid architecture.";

  const values = [
    {
      title: "Product-first mindset",
      desc: "I focus on what actually helps users, then ship in iterations with measurable improvements.",
    },
    {
      title: "Clean architecture",
      desc: "I care about readable code, good structure, and long-term maintainability—not just ‘making it work’.",
    },
    {
      title: "Ownership & speed",
      desc: "I’m comfortable taking a feature end-to-end: UI, API, data, and deployment.",
    },
  ];

  const quickFacts = [
    { label: "Role", value: "Full-Stack" },
    { label: "Location", value: profile.location ?? "—" },
    { label: "Primary stack", value: "React + TypeScript" },
    { label: "Also", value: "Node.js · Docker · SQL" },
  ];

  return (
    <div className="relative mx-auto max-w-5xl px-6 py-16">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -right-24 top-28 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute left-1/3 bottom-[-120px] h-80 w-80 rounded-full bg-white/5 blur-3xl" />
      </div>

      {/* header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">About</h1>
          <p className="mt-2 text-white/60">
            A short story, what I care about, and how I build
          </p>
        </div>
        <Link to="/" className="text-white/70 hover:text-white transition">
          ← Home
        </Link>
      </div>

      {/* hero */}
      <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-4 py-2 text-sm text-white/70">
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

            <div className="mt-5 flex flex-wrap gap-2">
              <Pill>Clean UI</Pill>
              <Pill>Solid Architecture</Pill>
              <Pill>Fast Iteration</Pill>
              <Pill>End-to-end Ownership</Pill>
            </div>

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
          </div>

          {/* quick facts */}
          <div className="grid w-full grid-cols-2 gap-3 sm:w-[320px]">
            {quickFacts.map((s) => (
              <Stat key={s.label} label={s.label} value={s.value} />
            ))}
          </div>
        </div>
      </div>

      {/* values */}
      <div className="mt-10 grid gap-4 lg:grid-cols-3">
        {values.map((v) => (
          <Card key={v.title} title={v.title}>
            <p className="text-sm leading-relaxed text-white/70">{v.desc}</p>
          </Card>
        ))}
      </div>

      {/* personal note */}
      <div className="mt-10 grid gap-4 lg:grid-cols-2">
        <Card title={`Working with me`} subtitle="What you can expect">
          <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
            <li>Clear communication and fast feedback loops</li>
            <li>Structured thinking: requirements → plan → implementation</li>
            <li>High standards for UX, code quality, and performance</li>
            <li>Ownership: I don’t drop problems—I close them</li>
          </ul>
        </Card>

        <Card title="Currently focused on" subtitle="Where I’m investing most of my time">
          <ul className="list-disc space-y-2 pl-5 text-sm text-white/70">
            <li>Building production-ready React + TypeScript interfaces</li>
            <li>Backend integration (APIs, SQL) and clean data flow</li>
            <li>Docker-based development workflows</li>
            <li>Shipping portfolio-grade projects end-to-end</li>
          </ul>
        </Card>
      </div>

      {/* CTA */}
      <div className="mt-12 rounded-[28px] border border-white/10 bg-white/5 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="text-lg font-semibold">Let’s build something solid.</div>
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
      </div>

      <div className="mt-8 text-center text-xs text-white/40">
        Built with clean UI, real content, and zero cringe ✨
      </div>
    </div>
  );
}