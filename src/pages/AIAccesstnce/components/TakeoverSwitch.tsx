import { memo } from "react";
import { FOCUS } from "../tokens";

export const TakeoverSwitch = memo(function TakeoverSwitch({
  on,
  onToggle,
  size = "md",
}: {
  on: boolean;
  onToggle: () => void;
  /** "sm" fits the narrow sidebar card */
  size?: "md" | "sm";
}) {
  const sm = size === "sm";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className={`flex items-center rounded-full font-semibold transition-colors duration-200 ${
        sm ? "h-8 gap-2 px-2 text-[11px]" : "h-10 gap-3 px-4 text-sm"
      } ${
        on ? "bg-[#2D3A63] text-white" : "text-slate-200 hover:bg-white/5"
      } ${FOCUS}`}
    >
      <span>AI Takeover</span>
      <span
        aria-hidden="true"
        className={`relative rounded-full transition-colors duration-200 ${
          sm ? "h-4 w-7" : "h-5 w-9"
        } ${
          on ? "bg-[#0F172E]" : "bg-slate-500/60"
        }`}
      >
        <span
          className={`absolute left-0.5 top-0.5 rounded-full bg-white shadow transition-transform duration-200 ${
            sm ? "size-3" : "size-4"
          } ${on ? (sm ? "translate-x-3" : "translate-x-4") : ""}`}
        />
      </span>
    </button>
  );
});
