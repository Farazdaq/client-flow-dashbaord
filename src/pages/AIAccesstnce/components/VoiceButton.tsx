import { memo } from "react";
import { LuMic, LuMicOff, LuVolume2, LuVolumeX } from "react-icons/lu";
import { FOCUS } from "../tokens";

interface VoiceButtonProps {
  kind: "mic" | "speaker";
  active: boolean;
  muted: boolean;
  onClick: () => void;
  /** "sm" fits the narrow sidebar card */
  size?: "md" | "sm";
}

export const VoiceButton = memo(function VoiceButton({
  kind,
  active,
  muted,
  onClick,
  size = "md",
}: VoiceButtonProps) {
  const sm = size === "sm";
  const Icon = kind === "mic" ? (muted ? LuMicOff : LuMic) : muted ? LuVolumeX : LuVolume2;
  const label =
    kind === "mic"
      ? muted
        ? "Unmute and start listening"
        : active
          ? "Stop listening"
          : "Start listening"
      : muted
        ? "Unmute voice"
        : "Mute voice";

  const style = muted
    ? "border-[#F0524F]/50 bg-[#F0524F]/15 text-[#FF8A87]"
    : active
      ? "border-transparent bg-[#5B7BD0] text-white"
      : "border-white/15 text-slate-300 hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={kind === "mic" ? active : muted}
      className={`relative grid ${sm ? "size-8" : "size-10"} place-items-center rounded-full border transition-colors duration-200 ${style} ${FOCUS}`}
    >
      {active && !muted && (
        <span aria-hidden="true" className="ai-ping absolute inset-0 rounded-full ring-2 ring-[#6C8BE0]/60" />
      )}
      <Icon size={sm ? 14 : 17} aria-hidden={true} />
    </button>
  );
});
