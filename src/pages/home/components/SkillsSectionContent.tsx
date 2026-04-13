import { profile } from "@/data/profile";

export default function SkillsSectionContent() {
  return (
    <div className="relative min-h-screen">
      <div className="mx-auto w-full max-w-5xl">
        <h2 className="homepage-section-title">Skills</h2>
        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {profile.skills.map((group) => (
            <div key={group.group} className="homepage-glass-card">
              <h3 className="text-lg font-bold text-slate-900">{group.group}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span key={`${group.group}-${item}`} className="homepage-pill-dark">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
