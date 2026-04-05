import StatsBar from "./StatsBar";
import "../styles/homeHeroTitle.css";

export default function HomeHeroTitle() {
  return (
    <div className="homeHeroTitle relative z-20 w-[min(92vw,900px)] px-4">
      <div className="flex flex-col items-center text-center">
        <p className="text-[38px] font-medium leading-none tracking-tight text-white sm:text-[48px] md:text-[60px]">
          Student of
        </p>

        <div className="relative mt-10 md:mt-12">
          <div className="absolute inset-0 rounded-lg bg-linear-to-r from-orange-400/30 via-sky-400/20 to-orange-400/30 blur-2xl" />

          <p
            className="
              logoAccent relative z-10
              text-[52px] font-extrabold tracking-tight
              leading-[1.06] sm:text-[68px] sm:leading-[1.05]
              md:text-[92px] md:leading-[1.03]
            "
          >
            Computer Science
          </p>
        </div>

        <div className="relative z-20 mt-[10px] flex flex-col items-center gap-6 md:mt-[120px] md:gap-7">
          <p
            className="
              text-center text-[12px] font-semibold uppercase leading-none
              tracking-[0.22em] text-white/80 sm:text-[13px]
            "
          >
            FULL-STACK DEVELOPER
          </p>

          <StatsBar />
        </div>
      </div>
    </div>
  );
}