import { useEffect, useMemo, useState } from "react";
import { AI_SCENARIOS, BASE_STATE } from "./scenarios";
import type { AIActivity, AIAlert, AIProgress, AIState } from "./types";

/* State hook: call once (e.g. in DashboardLayout) and share the result with
 * both the compact and panel variants so they always stay in sync. */

const STANDBY_SECONDS = 5;

export function useAIAssistance(initial?: Partial<AIState>) {
  const [state, setState] = useState<AIState>({ ...BASE_STATE, ...initial });
  const [countdown, setCountdown] = useState(STANDBY_SECONDS);

  // "Resolved" returns to standby on its own after a few seconds
  useEffect(() => {
    if (state.activity !== "resolved") return;
    let remaining = STANDBY_SECONDS;
    setCountdown(remaining);
    const id = window.setInterval(() => {
      remaining -= 1;
      setCountdown(remaining);
      if (remaining <= 0) {
        window.clearInterval(id);
        setState((s) =>
          s.activity === "resolved" ? { ...s, activity: "idle" } : s,
        );
      }
    }, 1000);
    return () => {
      window.clearInterval(id);
      setCountdown(STANDBY_SECONDS);
    };
  }, [state.activity]);

  const actions = useMemo(
    () => ({
      patch: (p: Partial<AIState>) => setState((s) => ({ ...s, ...p })),
      setActivity: (activity: AIActivity) =>
        setState((s) => ({ ...s, activity })),
      setAlerts: (alerts: AIAlert[]) => setState((s) => ({ ...s, alerts })),
      dismissAlert: (id: string) =>
        setState((s) => ({
          ...s,
          alerts: s.alerts.filter((a) => a.id !== id),
        })),
      /** Pass `undefined` to clear. Setting progress switches to "working". */
      setProgress: (progress?: AIProgress) =>
        setState((s) =>
          progress
            ? { ...s, progress, activity: "working" }
            : {
                ...s,
                progress: undefined,
                activity: s.activity === "working" ? "idle" : s.activity,
              },
        ),
      resolve: (summary: string) =>
        setState((s) => ({
          ...s,
          activity: "resolved",
          resolvedSummary: summary,
          progress: undefined,
        })),
      toggleTakeover: () =>
        setState((s) => ({
          ...s,
          takeover: !s.takeover,
          activity:
            s.takeover && s.activity === "replying" ? "idle" : s.activity,
        })),
      /** Mic button: start / stop listening (un-mutes first if muted) */
      toggleListening: () =>
        setState((s) =>
          s.muted
            ? { ...s, muted: false, activity: "listening" }
            : {
                ...s,
                activity: s.activity === "listening" ? "idle" : "listening",
              },
        ),
      /** Speaker button: mute / unmute all voice and stop anything in progress */
      toggleMute: () =>
        setState((s) => {
          const muted = !s.muted;
          const voiceBusy =
            s.activity === "listening" || s.activity === "speaking";
          return {
            ...s,
            muted,
            activity: muted && voiceBusy ? "idle" : s.activity,
          };
        }),
      loadScenario: (id: string) => {
        const scenario = AI_SCENARIOS.find((s) => s.id === id);
        if (scenario) setState({ ...BASE_STATE, ...scenario.state });
      },
    }),
    [],
  );

  return { state, countdown, actions };
}

export type AIAssistanceController = ReturnType<typeof useAIAssistance>;
