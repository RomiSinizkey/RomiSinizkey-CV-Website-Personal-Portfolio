import { Badge } from "../design-system";

export default function StatsBar() {
  return (
    <div className="inline-flex items-center gap-3 px-2">
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 18px var(--accent)",
        }}
      />
      <Badge variant="primary" size="sm">
        React • TypeScript • JS • Node • DB • Python • C++
      </Badge>
    </div>
  );
}