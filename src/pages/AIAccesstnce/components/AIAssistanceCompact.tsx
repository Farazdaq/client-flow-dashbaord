import { FOCUS } from "../tokens";
import type { AIView } from "../types";
import { AIBall } from "./AIBall";

/** Sidebar footer card: mini ball + status text. Click to open the full panel. */
export function AIAssistanceCompact({
  view,
  takeover,
  onOpen,
}: {
  view: AIView;
  takeover: boolean;
  onOpen?: () => void;
}) {
  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        aria-label={`AI assistant: ${view.statusTitle}. Open full view`}
        className={`flex w-full min-w-0 items-center gap-2 rounded-lg bg-[#2B2F3E] p-1.5 pr-2.5 text-left ring-1 ring-white/10 transition-colors hover:bg-[#323749] ${FOCUS}`}
      >
        <AIBall tone={view.tone} icon={view.ball} size={34} arc={view.arc} badge={view.badge} urgent={view.urgent} />
        <span key={view.key} className="ai-fade-in min-w-0 flex-1">
          <span className="block truncate text-xs font-semibold text-white">{view.statusTitle}</span>
          <span className="block truncate text-[11px] text-[#B8BDCC]">
            {takeover && view.key !== "takeover-on" ? "AI in control · " : ""}
            {view.statusSub}
          </span>
        </span>
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {view.message}
      </span>
    </>
  );
}
