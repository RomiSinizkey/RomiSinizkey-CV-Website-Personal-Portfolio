export default function NameLogo() {
  return (
    <div className="absolute left-6 top-6 z-30 select-none">
      <span aria-label="Romi logo">
        <span
          className="inline-block text-[44px] leading-none tracking-[-0.03em]"
          style={{
            background: "none",
            color: "#f97316",
            WebkitTextFillColor: "#f97316",
            textShadow: "0 1px 0 rgba(255,255,255,0.65)",
            fontWeight: 900,
          }}
        >
          ROMI
        </span>
      </span>
    </div>
  );
}