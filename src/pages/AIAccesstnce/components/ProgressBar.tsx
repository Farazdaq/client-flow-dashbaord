import { memo } from "react";
import { TONES } from "../tokens";

export const ProgressBar = memo(function ProgressBar({ pct }: { pct: number | null }) {
  return (
    <div
      role="progressbar"
      aria-label="Task progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={pct ?? undefined}
      className="h-1.5 w-full max-w-sm overflow-hidden rounded-full bg-white/10"
    >
      {pct === null ? (
        <div
          className="ai-shimmer h-full w-full"
          style={{
            backgroundImage: `linear-gradient(90deg, transparent, ${TONES.amber}, transparent)`,
          }}
        />
      ) : (
        <div
          className="h-full rounded-full transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%`, background: TONES.amber }}
        />
      )}
    </div>
  );
});
