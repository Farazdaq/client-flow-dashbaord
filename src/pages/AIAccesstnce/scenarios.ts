import type { AIAlert, AISeverity, AIState } from "./types";

/* One scenario per design image (case number = position + 1).
 * `id` matches the view key produced by `resolveView`. */

const MOCK_ALERTS: Record<AISeverity, AIAlert> = {
  critical: {
    id: "risk",
    severity: "critical",
    title: "16 customers at risk",
    description: "20 high-value customers need follow-up",
    time: "now",
    badge: 16,
  },
  attention: {
    id: "engagement",
    severity: "attention",
    title: "Engagement dropped 31%",
    description: "Fewer replies to recent campaigns",
    time: "now",
    badge: 31,
  },
  good: {
    id: "retention",
    severity: "good",
    title: "Retention is at 97%",
    description: "WhatsApp engagement is up 9%",
    time: "now",
    badge: 97,
  },
};

export const AI_SCENARIOS: { id: string; label: string; state: Partial<AIState> }[] = [
  { id: "idle", label: "Ready", state: {} },
  { id: "listening", label: "Listening", state: { activity: "listening" } },
  {
    id: "speaking",
    label: "Speaking",
    state: { activity: "speaking", speech: "Done! 5 follow-ups are scheduled." },
  },
  { id: "alert-attention", label: "Attention alert", state: { alerts: [MOCK_ALERTS.attention] } },
  { id: "alert-critical", label: "Critical alert", state: { alerts: [MOCK_ALERTS.critical] } },
  { id: "alert-good", label: "Good news", state: { alerts: [MOCK_ALERTS.good] } },
  {
    id: "notifications",
    label: "Notifications stack",
    state: { alerts: [MOCK_ALERTS.critical, MOCK_ALERTS.attention, MOCK_ALERTS.good] },
  },
  {
    id: "working",
    label: "Working",
    state: {
      activity: "working",
      progress: {
        label: "Scheduling 5 WhatsApp follow-ups…",
        step: "Scheduling follow-ups",
        done: 3,
        total: 5,
      },
    },
  },
  {
    id: "resolved",
    label: "Resolved",
    state: { activity: "resolved", resolvedSummary: "5 follow-ups scheduled" },
  },
  { id: "muted", label: "Muted", state: { muted: true } },
  { id: "standby", label: "Not doing anything", state: { activity: "standby" } },
  { id: "takeover-idle", label: "Takeover idle", state: { takeover: true } },
  {
    id: "takeover-on",
    label: "Takeover replying",
    state: {
      takeover: true,
      activity: "replying",
      reply: { customer: "Noah Dubois", channel: "WhatsApp", replied: 3, escalated: 1 },
    },
  },
];

export const BASE_STATE: AIState = { activity: "idle", takeover: false, muted: false, alerts: [] };
