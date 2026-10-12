import { SEVERITY } from "./tokens";
import type { AIAlert, AIState, AIView, MessageTone } from "./types";

/* Turns state into exactly what the UI shows. Pure, so it is easy to test. */

export function resolveView(s: AIState, countdown: number): AIView {
  const base = {
    arc: 0.22,
    urgent: false,
    messageTone: "default" as MessageTone,
    showCheck: false,
    showCaret: false,
    alerts: [] as AIAlert[],
    micActive: false,
    speakerActive: false,
  };

  if (s.activity === "working") {
    const p = s.progress;
    const pct = p && p.total > 0 ? Math.min(100, Math.round((p.done / p.total) * 100)) : null;
    return {
      ...base,
      key: "working",
      tone: "amber",
      ball: "spinner",
      arc: pct === null ? 0.3 : Math.max(0.12, pct / 100),
      message: p?.label ?? "Working on it…",
      statusTitle: "Working",
      statusSub: p
        ? `${p.step ?? "In progress"}${p.total > 0 ? ` · ${p.done} of ${p.total}` : ""}`
        : "In progress",
      progress: { pct },
    };
  }

  if (s.activity === "resolved") {
    return {
      ...base,
      key: "resolved",
      tone: "green",
      ball: "check",
      arc: 1,
      message: `Resolved${s.resolvedSummary ? ` · ${s.resolvedSummary}` : ""}`,
      showCheck: true,
      statusTitle: "Resolved",
      statusSub: `Back to standby in ${Math.max(countdown, 0)}s`,
    };
  }

  if (s.activity === "listening") {
    return {
      ...base,
      key: "listening",
      tone: "blue",
      ball: "wave",
      arc: 1,
      message: "Listening…",
      statusTitle: "Listening",
      statusSub: "Waiting for your question",
      micActive: true,
    };
  }

  if (s.activity === "speaking") {
    return {
      ...base,
      key: "speaking",
      tone: "blue",
      ball: "dots",
      message: s.speech ?? "Speaking…",
      statusTitle: "Speaking",
      statusSub: "Reading out the result",
      speakerActive: true,
    };
  }

  if (s.activity === "replying" && s.takeover && s.reply) {
    const r = s.reply;
    return {
      ...base,
      key: "takeover-on",
      tone: "neutral",
      ball: "core",
      message: `Replying to ${r.customer} on ${r.channel}…`,
      statusTitle: "AI in control",
      statusSub: `Replied to ${r.replied} · ${r.escalated} escalated`,
    };
  }

  if (s.alerts.length > 0) {
    const alerts = [...s.alerts].sort((a, b) => SEVERITY[a.severity].rank - SEVERITY[b.severity].rank);
    const top = alerts[0];
    const cfg = SEVERITY[top.severity];
    const urgent = top.severity === "critical";

    if (alerts.length > 1) {
      return {
        ...base,
        key: "notifications",
        tone: cfg.tone,
        ball: "core",
        arc: 0.3,
        urgent,
        message: `${alerts.length} new notifications`,
        statusTitle: "Alerts detected",
        statusSub: "Sorted by importance",
        badge: alerts.length,
        alerts,
      };
    }
    return {
      ...base,
      key: `alert-${top.severity}`,
      tone: cfg.tone,
      ball: "core",
      arc: 0.3,
      urgent,
      message: cfg.message,
      statusTitle: cfg.statusTitle,
      statusSub: cfg.statusSub,
      badge: top.badge,
      alerts,
    };
  }

  if (s.muted) {
    return {
      ...base,
      key: "muted",
      tone: "neutral",
      ball: "core",
      message: "Mic and speaker are muted",
      messageTone: "danger",
      statusTitle: "Not doing anything",
      statusSub: "Voice is muted",
    };
  }

  if (s.takeover) {
    return {
      ...base,
      key: "takeover-idle",
      tone: "neutral",
      ball: "core",
      message: "Waiting for customer messages",
      messageTone: "placeholder",
      statusTitle: "Not doing anything",
      statusSub: "Takeover on · nothing to reply",
    };
  }

  if (s.activity === "standby") {
    return {
      ...base,
      key: "standby",
      tone: "neutral",
      ball: "core",
      message: "Nothing needs attention right now",
      messageTone: "placeholder",
      statusTitle: "Not doing anything",
      statusSub: "Standing by · all caught up",
    };
  }

  return {
    ...base,
    key: "idle",
    tone: "neutral",
    ball: "core",
    message: "Ask me anything…",
    messageTone: "placeholder",
    showCaret: true,
    statusTitle: "Ready",
    statusSub: "Waiting for you",
  };
}
