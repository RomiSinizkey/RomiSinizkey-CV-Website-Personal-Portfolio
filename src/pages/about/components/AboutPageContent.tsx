import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { GraduationCap, History, MapPin, Rocket, User } from "lucide-react";
import { profile } from "@/data/profile";
import "../styles/idBadge.css";

function IdBadge({ name, role }: { name: string; role: string }) {
  return (
    <div className="idBadgeWrap">
      <div className="idBadgeWire" />
      <div className="idBadgeClip" />

      <div className="idBadgeCard">
        <div className="idBadgeHole" />
        <div className="idBadgePhoto">
          <User size={34} />
        </div>
        <p className="idBadgeName">{name}</p>
        <p className="idBadgeRole">{role}</p>
        <div className="idBadgeDivider" />
        <div className="idBadgeBarcode" />
      </div>
    </div>
  );
}

function CanvaBackground() {
  return (
    <div
      className="fixed inset-0 z-0 w-full h-full overflow-hidden pointer-events-none"
      style={{
        backgroundImage: "url(/about/portrait.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0 bg-linear-to-b from-black/35 via-black/45 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.02)_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.65)_100%)]" />
    </div>
  );
}

function QuickFacts() {
  const currentEducation = profile.education[0];
  const pastRole = profile.experience[0];

  const facts = [
    profile.location ? { icon: <MapPin size={15} />, label: profile.location } : null,
    currentEducation ? { icon: <GraduationCap size={15} />, label: currentEducation.degree } : null,
    pastRole ? { icon: <History size={15} />, label: `Former: ${pastRole.title} @ ${pastRole.company} (temporary)` } : null,
    { icon: <Rocket size={15} />, label: "Open to internship / entry-level roles" },
  ].filter((fact): fact is NonNullable<typeof fact> => fact !== null);

  if (facts.length === 0) return null;

  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {facts.map((fact, index) => (
        <div
          key={index}
          className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-2 text-sm font-semibold text-white/85 backdrop-blur"
        >
          <span className="text-orange-400">{fact.icon}</span>
          {fact.label}
        </div>
      ))}
    </div>
  );
}

function HeaderSection({ firstName, story, showHomeLink = true }: { firstName: string; story: string; showHomeLink?: boolean }) {
  return (
    <motion.div
      className="mb-10 rounded-3xl bg-black/20 backdrop-blur-[2px] p-6 md:p-8 border border-white/10"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
    >
      <div className="flex flex-col-reverse md:flex-row md:items-start md:justify-between gap-8">
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-orange-400/90">About</p>

          <h1 className="mt-3 text-5xl md:text-6xl font-black leading-[1.1] text-white drop-shadow-[0_10px_30px_rgba(0,0,0,0.35)]">
            Get to know <span className="text-orange-500">{firstName}</span>
          </h1>

          <p className="mt-4 text-xl md:text-2xl font-bold text-white/90 leading-relaxed max-w-3xl">
            {profile.headline}
          </p>

          <p className="mt-5 text-lg text-white/70 max-w-none leading-loose">{story}</p>

          <QuickFacts />

          <div className="mt-8 flex flex-wrap gap-4">
            {showHomeLink && (
              <Link
                to="/"
                className="group relative px-7 py-3 rounded-2xl bg-white/10 text-white font-bold shadow-lg hover:bg-white/16 transition-all backdrop-blur overflow-hidden border border-white/10"
              >
                <span className="relative">← Home</span>
              </Link>
            )}
          </div>
        </div>

        <IdBadge name={firstName} role={profile.headline} />
      </div>
    </motion.div>
  );
}

export function AboutPageContent({ embedded = false }: { embedded?: boolean }) {
  const firstName = profile.fullName?.split(" ")?.[0] ?? "Romi";
  const story =
    profile.summary ??
    "Computer Science student obsessed with clean architecture, performance, and shipping products that matter.";

  return (
    <div className={`relative min-h-screen overflow-hidden w-full ${embedded ? "rounded-[28px]" : ""}`}>
      {embedded ? (
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_15%_15%,rgba(125,211,252,0.20),transparent_40%),radial-gradient(circle_at_85%_25%,rgba(217,70,239,0.18),transparent_45%),linear-gradient(160deg,rgba(30,41,59,0.94)_0%,rgba(15,23,42,0.92)_45%,rgba(12,74,110,0.90)_100%)]" />
      ) : (
        <CanvaBackground />
      )}

      <div className="relative z-10 mx-auto max-w-7xl px-6 py-10 pointer-events-auto">
        <HeaderSection firstName={firstName} story={story} showHomeLink={!embedded} />
      </div>
    </div>
  );
}
