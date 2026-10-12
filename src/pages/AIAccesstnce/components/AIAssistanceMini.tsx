import { FOCUS } from "../tokens";
import type { AIView } from "../types";
import { AIBall } from "./AIBall";

/**
 * Just the small animated ball (with its alert badge), no card or text.
 * Used next to the expand arrow. Hover or focus shows the status as a tooltip.
 */
export function AIAssistanceMini({
  view,
  onOpen,
}: {
  view: AIView;
  onOpen?: () => void;
}) {
  const label = `${view.statusTitle}: ${view.statusSub}`;

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        title={label}
        aria-label={`AI assistant. ${label}`}
        className={`grid size-10 shrink-0 place-items-center rounded-full transition-transform duration-200 hover:scale-105 active:scale-95 ${FOCUS}`}
      >
        <AIBall
          tone={view.tone}
          icon={view.ball}
          size={36}
          arc={view.arc}
          badge={view.badge}
          urgent={view.urgent}
        />
      </button>
      <span className="sr-only" role="status" aria-live="polite">
        {view.message}
      </span>
    </>
  );
}
