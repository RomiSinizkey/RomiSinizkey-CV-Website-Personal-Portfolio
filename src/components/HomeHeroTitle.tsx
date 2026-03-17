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
      <div className="flex flex-col items-center gap-0 relative z-20">
        <p className="text-[42px] sm:text-[52px] md:text-[68px] font-medium tracking-tight text-black leading-none">
          Student of
        </p>

        <div className="relative">
          <div className="absolute inset-0 blur-2xl bg-linear-to-r from-orange-400/30 via-sky-400/20 to-orange-400/30 rounded-lg" />

          <p
            className="
              logoAccent
              text-[44px] sm:text-[56px] md:text-[84px]
              font-extrabold tracking-tight
              leading-[1.06] sm:leading-[1.05] md:leading-[1.03]
              mt-[10px] relative z-10
            "
          >
            Computer Science
          </p>
        </div>
      </div>

      <div className="mt-[30px] flex flex-col items-center gap-2 relative z-20">
        <p
          className="
            text-[12px]
            font-semibold
            tracking-[0.22em]
            uppercase
            text-black/70
            text-center
            leading-none
          "
        >
          FULL-STACK DEVELOPER
        </p>
        <StatsBar />
      </div>
    </div>
  );
}