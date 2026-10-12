/* Shared types for the AIAssistance feature */

export type AIActivity =
  | "idle"
  | "standby"
  | "listening"
  | "speaking"
  | "working"
  | "resolved"
  | "replying";

export type AISeverity = "critical" | "attention" | "good";

export interface AIAlert {
  id: string;
  severity: AISeverity;
  title: string;
  description: string;
  time?: string;
  /** Number shown on the ball (e.g. 31 for "Engagement dropped 31%") */
  badge?: number;
  onView?: () => void;
}

export interface AIProgress {
  /** Headline, e.g. "Scheduling 5 WhatsApp follow-ups…" */
  label: string;
  /** Short step name used in the subtitle, e.g. "Scheduling follow-ups" */
  step?: string;
  done: number;
  total: number;
}

export interface AIReply {
  customer: string;
  channel: string;
  replied: number;
  escalated: number;
}

export interface AIState {
  activity: AIActivity;
  takeover: boolean;
  muted: boolean;
  alerts: AIAlert[];
  progress?: AIProgress;
  reply?: AIReply;
  /** Text read aloud while `activity === "speaking"` */
  speech?: string;
  /** Summary shown while `activity === "resolved"` */
  resolvedSummary?: string;
}

export type Tone = "neutral" | "blue" | "amber" | "red" | "green";
export type BallIcon = "core" | "wave" | "dots" | "spinner" | "check";
export type MessageTone = "default" | "placeholder" | "danger";

export interface AIView {
  key: string;
  tone: Tone;
  ball: BallIcon;
  /** Length of the ring arc, 0–1 */
  arc: number;
  urgent: boolean;
  message: string;
  messageTone: MessageTone;
  showCheck: boolean;
  showCaret: boolean;
  statusTitle: string;
  statusSub: string;
  badge?: number;
  alerts: AIAlert[];
  progress?: { pct: number | null };
  micActive: boolean;
  speakerActive: boolean;
}
