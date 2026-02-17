import RotatingRoles from "./RotatingRoles";
import StatsBar from "./StatsBar";

export default function HomeHeroTitle() {
  return (
    <div className="absolute left-1/2 top-[6vh] -translate-x-1/2 text-center z-20">
      <p className="text-[58px] md:text-[68px] font-medium tracking-tight text-black leading-none">
        Student of
      </p>

      {/* ✅ זה מה שמעלה את ה-Computer Science */}
      <p className="mt-[-100px] text-[64px] md:text-[84px] font-extrabold tracking-tight leading-none logoAccent whitespace-nowrap">
        Computer Science
      </p>

      {/* 🔥 הוספתי translateY שמרים את הכל */}
        <div
        className="flex flex-col items-center gap-2"
        style={{ transform: "translateY(-40px)" }}
        >
        <RotatingRoles />
        <StatsBar />
        </div>


    </div>
  );
}
