import "../styles/nameLogo.css";

const NAME_LOGO_LETTERS = Array.from("ROMI");

export default function NameLogo() {
  return (
    <div className="name-logo-shell" aria-hidden="true">
      <span className="name-logo-frame">
        <span className="name-logo-word">
          {NAME_LOGO_LETTERS.map((letter, index) => (
            <span
              key={`${letter}-${index}`}
              className="name-logo-letter"
              data-letter={letter}
              style={{ animationDelay: `${index * 120}ms` }}
            >
              {letter}
            </span>
          ))}
        </span>
      </span>
    </div>
  );
}
