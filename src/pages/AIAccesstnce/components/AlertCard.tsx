import { memo } from "react";
import { FOCUS, SEVERITY, TONES } from "../tokens";
import type { AIAlert } from "../types";

export const AlertCard = memo(function AlertCard({ alert, index }: { alert: AIAlert; index: number }) {
  const cfg = SEVERITY[alert.severity];
  const color = TONES[cfg.tone];
  const Icon = cfg.Icon;

  return (
    <li
      className="ai-slide-in flex items-stretch overflow-hidden rounded-xl bg-white/[0.04] ring-1 ring-white/[0.06]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span aria-hidden="true" className="w-1 shrink-0" style={{ background: color }} />
      <div className="flex min-w-0 flex-1 items-center gap-3 p-3">
        <span
          className="grid size-10 shrink-0 place-items-center rounded-full text-white"
          style={{ background: color }}
        >
          <Icon size={18} aria-hidden={true} />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="rounded px-1.5 py-0.5 text-[10px] font-bold tracking-wide"
              style={{ background: `${color}26`, color }}
            >
              {cfg.label}
            </span>
            {alert.time && <span className="text-[11px] text-slate-500">{alert.time}</span>}
          </div>
          <p className="truncate text-sm font-semibold text-white">{alert.title}</p>
          <p className="truncate text-xs text-slate-400">{alert.description}</p>
        </div>
        <button
          type="button"
          onClick={alert.onView}
          aria-label={`View ${alert.title}`}
          className={`h-8 shrink-0 rounded-lg border border-white/15 px-3.5 text-xs font-medium text-slate-200 transition-colors hover:bg-white/10 ${FOCUS}`}
        >
          View
        </button>
      </div>
    </li>
  );
});
