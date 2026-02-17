export default function StatsBar() {
  return (
    <div
      className="
        inline-flex items-center gap-3
        rounded-full
        px-6 py-2
        bg-white/30
        backdrop-blur-lg
        shadow-[0_20px_70px_rgba(0,0,0,0.08)]
      "
    >
      {/* accent pulse */}
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 18px var(--accent)",
        }}
      />

      <span className="text-[12px] font-semibold tracking-[0.18em] uppercase text-black/70">
        React • TypeScript • JS • Node • DB • Python • C++
      </span>

    </div>
  );
}
