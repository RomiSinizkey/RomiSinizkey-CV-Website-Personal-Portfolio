import { profile } from "@/data/profile";

export default function LanguagesSectionContent() {
  return (
    <div className="relative min-h-screen">
      <div className="mx-auto w-full max-w-5xl homepage-glass-panel">
        <h2 className="homepage-section-title">Languages</h2>
        <div className="mt-6 flex flex-wrap gap-3">
          {profile.languages.map((language) => (
            <span key={language} className="homepage-pill-language">
              {language}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
