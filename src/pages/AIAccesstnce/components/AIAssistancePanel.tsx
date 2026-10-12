import { useId } from "react";
import {
  LuCheck,
  LuCircleAlert,
  LuCircleDot,
  LuMaximize2,
  LuX,
} from "react-icons/lu";
import { AI_SCENARIOS } from "../scenarios";
import { FOCUS } from "../tokens";
import type { AIView, MessageTone } from "../types";
import type { AIAssistanceController } from "../useAIAssistance";
import { AIBall } from "./AIBall";
import { ProgressBar } from "./ProgressBar";
import { TakeoverSwitch } from "./TakeoverSwitch";
import { VoiceButton } from "./VoiceButton";

const MESSAGE_STYLE: Record<MessageTone, string> = {
  default: "text-lg font-semibold text-white",
  placeholder: "text-lg font-medium text-slate-400",
  danger: "text-lg font-medium text-[#FF7A77]",
};

type AgentStatus =
  | "Running"
  | "Working"
  | "Waiting"
  | "Done"
  | "Escalated"
  | "Scheduled"
  | "Not doing anything";

type AgentRow = {
  agent: string;
  task: string;
  trigger: string;
  importance: "Low" | "Medium" | "High" | "—";
  status: AgentStatus;
  progress: number | null;
  updated: string;
};

const AGENT_ROWS: AgentRow[] = [
  {
    agent: "Monitor Agent",
    task: "Scanning customers for risk signals",
    trigger: "Schedule · every 5 min",
    importance: "Low",
    status: "Running",
    progress: 72,
    updated: "25s ago",
  },
  {
    agent: "Follow-up Agent",
    task: "Drafting WhatsApp follow-ups for 5 at-risk customers",
    trigger: "At risk detected",
    importance: "High",
    status: "Working",
    progress: 66,
    updated: "now",
  },
  {
    agent: "Campaign Agent",
    task: "Reviewing WhatsApp campaign response rate",
    trigger: "Response rate dropped",
    importance: "Medium",
    status: "Waiting",
    progress: 40,
    updated: "5m ago",
  },
  {
    agent: "Support Agent",
    task: "Replying to Noah Dubois on WhatsApp",
    trigger: "Customer message",
    importance: "High",
    status: "Running",
    progress: 85,
    updated: "1m ago",
  },
  {
    agent: "Sync Agent",
    task: "Syncing Salesforce to Firestore",
    trigger: "Schedule · every 15 min",
    importance: "Low",
    status: "Done",
    progress: 100,
    updated: "10m ago",
  },
  {
    agent: "Escalation Agent",
    task: "Escalated Daniel Hughes to admin",
    trigger: "Critical reply",
    importance: "High",
    status: "Escalated",
    progress: 100,
    updated: "10s ago",
  },
  {
    agent: "Report Agent",
    task: "Weekly customer report",
    trigger: "Schedule · Monday 08:00",
    importance: "Low",
    status: "Scheduled",
    progress: 0,
    updated: "3 days",
  },
  {
    agent: "Insights Agent",
    task: "Nothing to do right now",
    trigger: "No trigger",
    importance: "—",
    status: "Not doing anything",
    progress: null,
    updated: "1h ago",
  },
];

const statusClass: Record<AgentStatus, string> = {
  Running: "bg-[#DCE8FF] text-[#4564A4]",
  Working: "bg-[#FFF0C2] text-[#9A6B00]",
  Waiting: "bg-[#E9EDF5] text-[#596273]",
  Done: "bg-[#D7F6E8] text-[#17845B]",
  Escalated: "bg-[#FFE0DF] text-[#B54340]",
  Scheduled: "bg-[#E9EDF5] text-[#596273]",
  "Not doing anything": "bg-[#E9EDF5] text-[#596273]",
};

const importanceDot: Record<AgentRow["importance"], string> = {
  Low: "bg-[#34C98A]",
  Medium: "bg-[#F5A524]",
  High: "bg-[#F0524F]",
  "—": "bg-slate-400",
};

/** Dashboard-style full AI workspace. */
export function AIAssistancePanel({
  ai,
  view,
  showCase,
  devSwitcher,
}: {
  ai: AIAssistanceController;
  view: AIView;
  showCase: boolean;
  devSwitcher: boolean;
}) {
  const { state, actions } = ai;
  const titleId = useId();
  const caseIndex = AI_SCENARIOS.findIndex(
    (scenario) => scenario.id === view.key,
  );
  const caseLabel =
    caseIndex >= 0 ? `CASE ${String(caseIndex + 1).padStart(2, "0")}` : "LIVE";

  return (
    <div className="flex h-full min-h-0 min-w-0 flex-col overflow-x-hidden overflow-y-auto bg-[#3D4151] px-4 py-4 text-white sm:px-5 md:px-8 md:py-5">
      <header className="flex shrink-0 items-center justify-between gap-3">
        <div className="mx-auto flex items-center gap-2 rounded-full bg-[#565B6D] px-3 py-1 text-xs text-[#D4D8E3]">
          <span className="size-1.5 rounded-full bg-[#34C98A]" />
          <span>Online · watching your data</span>
        </div>
        <div className="absolute right-5 flex items-center gap-2 md:right-8">
          <button
            type="button"
            aria-label="Maximize AI panel"
            className={`grid size-8 place-items-center rounded-full border border-white/15 text-slate-300 hover:bg-white/10 ${FOCUS}`}
          >
            <LuMaximize2 size={14} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Close AI panel"
            className={`grid size-8 place-items-center rounded-full border border-white/15 text-slate-300 hover:bg-white/10 ${FOCUS}`}
          >
            <LuX size={15} aria-hidden="true" />
          </button>
        </div>
      </header>

      <section
        aria-labelledby={titleId}
        className="mx-auto mt-6 grid w-full max-w-6xl min-w-0 items-center gap-4 sm:mt-8 sm:gap-5 lg:grid-cols-[minmax(200px,1fr)_220px_minmax(200px,1fr)]"
      >
        <div className="order-2 space-y-2 lg:order-1">
          {view.alerts.length > 0 ? (
            view.alerts.map((alert) => {
              const color =
                alert.severity === "critical"
                  ? "#F0524F"
                  : alert.severity === "attention"
                    ? "#F5A524"
                    : "#34C98A";
              return (
                <button
                  key={alert.id}
                  type="button"
                  onClick={alert.onView}
                  className={`flex w-full items-center gap-2.5 rounded-xl border border-white/20 bg-[#404556] px-3 py-2 text-left hover:bg-[#4B5062] ${FOCUS}`}
                >
                  <span
                    className="grid size-7 shrink-0 place-items-center rounded-full"
                    style={{ background: `${color}24`, color }}
                  >
                    {alert.severity === "critical" ? (
                      <LuCircleAlert size={14} />
                    ) : (
                      <LuCircleDot size={14} />
                    )}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className="block text-xs font-semibold"
                      style={{ color }}
                    >
                      {alert.severity === "critical"
                        ? "Critical"
                        : alert.severity === "attention"
                          ? "Attention"
                          : "Good news"}
                    </span>
                    <span className="block truncate text-xs text-slate-300">
                      {alert.title}
                    </span>
                  </span>
                  {alert.badge !== undefined && (
                    <span className="text-xs text-slate-400">
                      {alert.badge}
                    </span>
                  )}
                </button>
              );
            })
          ) : (
            <div className="rounded-xl border border-white/20 bg-[#404556] px-3 py-3 text-sm text-slate-400">
              No alerts right now
            </div>
          )}
        </div>

        <div className="order-1 flex flex-col items-center text-center lg:order-2">
          <AIBall
            tone={view.tone}
            icon={view.ball}
            size={132}
            arc={view.arc}
            badge={view.badge}
            urgent={view.urgent}
            takeover={state.takeover}
          />
          <h1
            id={titleId}
            key={view.key}
            className={`ai-fade-in mt-2 ${MESSAGE_STYLE[view.messageTone]}`}
          >
            {view.showCheck && (
              <LuCheck
                className="mr-1 inline text-[#34C98A]"
                size={18}
                aria-hidden="true"
              />
            )}
            {view.statusTitle}
          </h1>
          <p className="mt-1 max-w-[220px] text-sm text-slate-400">
            {view.message}
          </p>
        </div>

        <div className="order-3 space-y-2">
          <div className="flex items-center justify-between rounded-xl border border-white/20 bg-[#404556] px-3 py-2">
            <span className="text-xs font-semibold text-slate-200">
              AI Takeover
            </span>
            <span className="mr-auto pl-3 text-[11px] text-slate-500">
              AI can handle replies
            </span>
            <TakeoverSwitch
              size="sm"
              on={state.takeover}
              onToggle={actions.toggleTakeover}
            />
          </div>
          <div className="rounded-xl border border-white/20 bg-[#404556] px-3 py-2">
            <div className="mb-1 flex items-center justify-between text-xs text-slate-300">
              <span>{view.statusTitle}</span>
              <span>{view.statusSub}</span>
            </div>
            {view.progress ? (
              <ProgressBar pct={view.progress.pct} />
            ) : (
              <div className="h-1.5 rounded-full bg-white/10" />
            )}
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/20 bg-[#404556] p-2">
            <VoiceButton
              kind="mic"
              size="sm"
              active={view.micActive}
              muted={state.muted}
              onClick={actions.toggleListening}
            />
            <span className="mr-auto text-xs text-slate-300">Microphone</span>
            <VoiceButton
              kind="speaker"
              size="sm"
              active={view.speakerActive}
              muted={state.muted}
              onClick={actions.toggleMute}
            />
            <span className="text-xs text-slate-300">Speaker</span>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-7 w-full max-w-6xl min-w-0 flex-1 sm:mt-8">
        <div className="mb-2 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-white">
              Agent activity
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              What every agent is doing right now
            </p>
          </div>
          <div className="flex items-center gap-2">
            {devSwitcher ? (
              <select
                value={caseIndex >= 0 ? view.key : ""}
                onChange={(event) => actions.loadScenario(event.target.value)}
                className={`rounded-md border border-white/15 bg-[#505568] px-2 py-1 text-xs text-slate-200 ${FOCUS}`}
              >
                {caseIndex < 0 && <option value="">Custom</option>}
                {AI_SCENARIOS.map((scenario) => (
                  <option key={scenario.id} value={scenario.id}>
                    {scenario.label}
                  </option>
                ))}
              </select>
            ) : showCase ? (
              <span className="rounded-md bg-[#505568] px-2 py-1 text-[10px] text-slate-300">
                {caseLabel}
              </span>
            ) : null}
          </div>
        </div>

        <div className="w-full overflow-hidden rounded-xl border border-white/15 bg-[#3A3F50]">
          <table className="w-full table-fixed border-collapse text-left text-xs">
            <thead className="border-b border-white/15 text-[11px] text-slate-500">
              <tr>
                <th className="w-[19%] px-2 py-2 font-medium sm:px-3">Agent</th>
                <th className="w-[25%] px-2 py-2 font-medium sm:px-3">Task</th>
                <th className="hidden w-[18%] px-2 py-2 font-medium lg:table-cell lg:px-3">
                  Trigger
                </th>
                <th className="hidden w-[11%] px-2 py-2 font-medium md:table-cell md:px-3">
                  Importance
                </th>
                <th className="w-[16%] px-2 py-2 font-medium sm:px-3">
                  Status
                </th>
                <th className="w-[30%] px-2 py-2 font-medium sm:w-[20%] sm:px-3">
                  Progress
                </th>
                <th className="hidden w-[9%] px-2 py-2 text-right font-medium xl:table-cell xl:px-3">
                  Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {AGENT_ROWS.map((row) => (
                <tr
                  key={row.agent}
                  className="border-b border-white/10 last:border-0 hover:bg-white/[0.03]"
                >
                  <td className="truncate px-2 py-2 font-medium text-slate-200 sm:px-3">
                    <span className="mr-1.5 inline-block size-1.5 rounded-full bg-[#7FA6FF] sm:mr-2 sm:size-2" />
                    {row.agent}
                  </td>
                  <td className="truncate px-2 py-2 text-slate-300 sm:px-3">
                    {row.task}
                  </td>
                  <td className="hidden truncate px-2 py-2 text-slate-400 lg:table-cell lg:px-3">
                    {row.trigger}
                  </td>
                  <td className="hidden whitespace-nowrap px-2 py-2 text-slate-300 md:table-cell md:px-3">
                    <span
                      className={`mr-1.5 inline-block size-1.5 rounded-full ${importanceDot[row.importance]}`}
                    />
                    {row.importance}
                  </td>
                  <td className="truncate px-2 py-2 sm:px-3">
                    <span
                      className={`inline-block max-w-full truncate rounded-full px-1.5 py-1 text-[11px] font-medium sm:px-2 ${statusClass[row.status]}`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td className="px-2 py-2 sm:px-3">
                    <div className="flex items-center gap-1.5">
                      <div className="min-w-0 flex-1 overflow-hidden rounded-full bg-white/10">
                        <div
                          className={`h-1.5 rounded-full ${row.status === "Escalated" ? "bg-[#F0524F]" : row.status === "Done" ? "bg-[#34C98A]" : "bg-[#6C8BE0]"}`}
                          style={{ width: `${row.progress ?? 0}%` }}
                        />
                      </div>
                      <span className="shrink-0 text-[11px] text-slate-400">
                        {row.progress === null ? "—" : `${row.progress}%`}
                      </span>
                    </div>
                  </td>
                  <td className="hidden whitespace-nowrap px-2 py-2 text-right text-slate-500 xl:table-cell xl:px-3">
                    {row.updated}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
