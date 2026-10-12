import { useMemo } from "react";
import { AIAssistanceCard } from "./components/AIAssistanceCard";
import { AIAssistanceCompact } from "./components/AIAssistanceCompact";
import { AIAssistanceMini } from "./components/AIAssistanceMini";
import { AIAssistancePanel } from "./components/AIAssistancePanel";
import { resolveView } from "./resolveView";
import { useAIStyles } from "./styles";
import type { AIAssistanceController } from "./useAIAssistance";

export interface AIAssistanceProps {
  /** Controller from `useAIAssistance()` (shared between variants) */
  ai: AIAssistanceController;
  /** "card" = full box for the sidebar footer, "mini" = just the ball (icon rail),
   * "compact" = ball + status text, "panel" = full-screen card */
  variant?: "card" | "mini" | "compact" | "panel";
  /** Card / mini / compact: called when the ball or card is clicked */
  onOpen?: () => void;
  /** Panel only: show the "CASE 04" pill */
  showCase?: boolean;
  /** Panel only: turn the case pill into a dropdown to preview every state */
  devSwitcher?: boolean;
}

export default function AIAssistance({
  ai,
  variant = "panel",
  onOpen,
  showCase = true,
  devSwitcher = false,
}: AIAssistanceProps) {
  useAIStyles();
  const view = useMemo(() => resolveView(ai.state, ai.countdown), [ai.state, ai.countdown]);

  if (variant === "card") {
    return <AIAssistanceCard ai={ai} view={view} onOpen={onOpen} />;
  }

  if (variant === "mini") {
    return <AIAssistanceMini view={view} onOpen={onOpen} />;
  }

  if (variant === "compact") {
    return <AIAssistanceCompact view={view} takeover={ai.state.takeover} onOpen={onOpen} />;
  }
  return <AIAssistancePanel ai={ai} view={view} showCase={showCase} devSwitcher={devSwitcher} />;
}
