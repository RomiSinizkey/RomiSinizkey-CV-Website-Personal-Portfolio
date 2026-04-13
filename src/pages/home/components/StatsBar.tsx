import { useState } from "react";
import { Badge } from "@/design-system/ui/primitives";
import "../styles/statsBar.css";

const TECH_ITEMS = ["React", "TypeScript", "JS", "Node", "DB", "Python", "C++"];

export default function StatsBar() {
  const [activeTechIndex, setActiveTechIndex] = useState<number | null>(null);

  return (
    <div className="flex max-w-[680px] flex-wrap items-center justify-center gap-3 px-2">
      <span
        className="h-2 w-2 rounded-full"
        style={{
          background: "var(--accent)",
          boxShadow: "0 0 18px var(--accent)",
        }}
      />
      <Badge variant="primary" size="sm" className="overflow-visible">
        <div
          className="statsBarWrap"
          onPointerLeave={() => setActiveTechIndex(null)}
        >
          {TECH_ITEMS.map((item, index) => (
            <span key={item} className="flex items-center statsBarToken">
              <span
                data-tech-index={index}
                onPointerEnter={() => setActiveTechIndex(index)}
                onPointerMove={() => setActiveTechIndex(index)}
                className={`statsBarItem ${
                  activeTechIndex === index
                    ? "is-active"
                    : activeTechIndex !== null && Math.abs(activeTechIndex - index) === 1
                      ? "is-near"
                      : activeTechIndex !== null && Math.abs(activeTechIndex - index) === 2
                        ? "is-far"
                        : ""
                }`}
              >
                {item}
              </span>
              {index < TECH_ITEMS.length - 1 ? <span className="statsBarDivider">•</span> : null}
            </span>
          ))}
        </div>
      </Badge>
    </div>
  );
}
