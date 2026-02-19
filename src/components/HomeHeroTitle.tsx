import RotatingRoles from "./RotatingRoles";
import StatsBar from "./StatsBar";

export default function HomeHeroTitle() {
  return (
    <div className="absolute left-1/2 top-[6vh] -translate-x-1/2 text-center z-20 w-[92vw] max-w-[980px]">
      <p className="text-[42px] sm:text-[52px] md:text-[68px] font-medium tracking-tight text-black leading-none">
        Student of
      </p>

      {/* ✅ לא נחתך במובייל: אין nowrap, יש max width + wrap */}
      <p
        className="
          mt-[-56px] sm:mt-[-72px] md:mt-[-100px]
          text-[44px] sm:text-[56px] md:text-[84px]
          font-extrabold tracking-tight leading-[0.95]
          logoAccent
          whitespace-normal
          break-words
        "
      >
        Computer Science
      </p>

      {/* ✅ במקום style translateY, עושים רספונסיבי ב-tailwind */}
      <div className="flex flex-col items-center gap-2 -mt-2 sm:-mt-4 md:-mt-6">
        <RotatingRoles />
        <StatsBar />
      </div>
    </div>
  );
}
