import type { ComponentType } from "react";
import { LuTrendingDown, LuTrendingUp, LuTriangleAlert } from "react-icons/lu";
import type { AISeverity, Tone } from "./types";

/** Ring / badge / accent colour per tone */
export const TONES: Record<Tone, string> = {
  neutral: "#8A9BC9",
  blue: "#6C8BE0",
  amber: "#F5A524",
  red: "#F0524F",
  green: "#34C98A",
};

/** Shared keyboard focus ring */
export const FOCUS =
  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8FB0FF]";

/** Copy, colour and icon for each alert severity */
export const SEVERITY: Record<
  AISeverity,
  {
    rank: number;
    label: string;
    tone: Tone;
    Icon: ComponentType<{ size?: number; "aria-hidden"?: boolean }>;
    message: string;
    statusTitle: string;
    statusSub: string;
  }
> = {
  critical: {
    rank: 0,
    label: "CRITICAL",
    tone: "red",
    Icon: LuTriangleAlert,
    message: "I noticed something. Want details?",
    statusTitle: "Alert detected",
    statusSub: "Waiting for your decision",
  },
  attention: {
    rank: 1,
    label: "ATTENTION",
    tone: "amber",
    Icon: LuTrendingDown,
    message: "I noticed something. Want details?",
    statusTitle: "Watching closely",
    statusSub: "Will alert you if it worsens",
  },
  good: {
    rank: 2,
    label: "GOOD NEWS",
    tone: "green",
    Icon: LuTrendingUp,
    message: "Good news to share.",
    statusTitle: "All good",
    statusSub: "Nothing to do",
  },
};
