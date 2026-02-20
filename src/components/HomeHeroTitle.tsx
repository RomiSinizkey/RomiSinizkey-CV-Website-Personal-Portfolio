import RotatingRoles from "./RotatingRoles";
import StatsBar from "./StatsBar";

export default function HomeHeroTitle() {
  return (
    <div
      className="
        absolute left-1/2 -translate-x-1/2 z-20
        w-[92vw] max-w-[980px] px-3 text-center
        pt-[96px] sm:pt-[110px] md:pt-[130px]
      "
    >
      {/* טיפוגרפיה כבלוק אחד */}
      <div className="flex flex-col items-center gap-0">
        <p className="text-[42px] sm:text-[52px] md:text-[68px] font-medium tracking-tight text-black leading-[1]">
          Student of
        </p>

        <p
          className="
            logoAccent
            text-[44px] sm:text-[56px] md:text-[84px]
            font-extrabold tracking-tight
            leading-[1.06] sm:leading-[1.05] md:leading-[1.03]
            mt-[10px]         "
        >
          Computer Science
        </p>
      </div>

      {/* רווח יפה לפני התפקידים */}
      <div className="mt-[30px] flex flex-col items-center gap-2">
        <RotatingRoles />
        <StatsBar />
      </div>
    </div>
  );
}