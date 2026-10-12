import { useId } from "react";
import { LuCheck, LuChevronRight } from "react-icons/lu";
import { FOCUS } from "../tokens";
import type { AIView } from "../types";
import type { AIAssistanceController } from "../useAIAssistance";
import { AIBall } from "./AIBall";
import { ProgressBar } from "./ProgressBar";
import { TakeoverSwitch } from "./TakeoverSwitch";
import { VoiceButton } from "./VoiceButton";

/**
 * Sidebar card variant: a compact summary of the AI assistant with controls.
 * The full details are opened through `onOpen`, while the controller keeps
 * this card synchronized with the panel variant.
 */
export function AIAssistanceCard({
  ai,
  view,
  onOpen,
}: {
  ai: AIAssistanceController;
  view: AIView;
  onOpen?: () => void;
}) {
  const { state, actions } = ai;
  const titleId = useId();
  const hasAlerts = view.alerts.length > 0;
  const firstAlert = view.alerts[0];

  return (
    <section
      aria-labelledby={titleId}
      className="w-full overflow-hidden rounded-xl bg-[#1E2230] p-3.5 shadow-lg ring-1 ring-white/10"
    >
      <div className="flex items-start gap-3">
        <AIBall
          tone={view.tone}
          icon={view.ball}
          size={72}
          arc={view.arc}
          badge={view.badge}
          urgent={view.urgent}
        />

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h2 id={titleId} className="truncate text-sm font-semibold text-white">
                AI Ball Companion
              </h2>
              <p key={view.key} className="ai-fade-in truncate text-xs font-medium text-[#8FB0FF]">
                {view.statusTitle}
              </p>
            </div>

            {onOpen && (
              <button
                type="button"
                onClick={onOpen}
                aria-label="Open full AI assistant view"
                className={`grid size-7 shrink-0 place-items-center rounded-md text-slate-400 transition-colors hover:bg-white/10 hover:text-white ${FOCUS}`}
              >
                <LuChevronRight size={16} aria-hidden={true} />
              </button>
            )}
          </div>

          <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400" role="status" aria-live="polite">
            {view.showCheck && (
              <span className="mr-1 inline-grid size-4 translate-y-[3px] place-items-center rounded-full bg-[#34C98A] text-white">
                <LuCheck size={10} aria-hidden={true} />
              </span>
            )}
            {view.message}
          </p>
        </div>
      </div>

      {hasAlerts && firstAlert && (
        <button
          type="button"
          onClick={onOpen}
          className={`mt-3 flex w-full items-center gap-2 rounded-lg bg-white/[0.04] px-2.5 py-2 text-left transition-colors hover:bg-white/[0.08] ${FOCUS}`}
          aria-label={`View alert: ${firstAlert.title}`}
        >
          <span
            aria-hidden="true"
            className={`size-1.5 shrink-0 rounded-full ${firstAlert.severity === "critical" ? "bg-[#F0524F]" : firstAlert.severity === "attention" ? "bg-[#F5A524]" : "bg-[#34C98A]"}`}
          />
          <span className="min-w-0 flex-1 truncate text-[11px] font-medium text-slate-300">
            {firstAlert.title}
          </span>
          {view.alerts.length > 1 && (
            <span className="shrink-0 text-[10px] text-slate-500">+{view.alerts.length - 1}</span>
          )}
        </button>
      )}

      {view.progress && (
        <div className="mt-3 space-y-1.5">
          <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400">
            <span className="truncate">{state.progress?.label ?? "Working…"}</span>
            <span className="shrink-0">
              {view.progress.pct === null ? "…" : `${Math.round(view.progress.pct)}%`}
            </span>
          </div>
          <ProgressBar pct={view.progress.pct} />
        </div>
      )}

      <footer className="mt-3 flex items-center justify-between gap-2 border-t border-white/10 pt-2.5">
        <TakeoverSwitch size="sm" on={state.takeover} onToggle={actions.toggleTakeover} />
        <div className="flex items-center gap-1.5">
          <VoiceButton
            kind="mic"
            size="sm"
            active={view.micActive}
            muted={state.muted}
            onClick={actions.toggleListening}
          />
          <VoiceButton
            kind="speaker"
            size="sm"
            active={view.speakerActive}
            muted={state.muted}
            onClick={actions.toggleMute}
          />
        </div>
      </footer>
    </section>
  );
}
