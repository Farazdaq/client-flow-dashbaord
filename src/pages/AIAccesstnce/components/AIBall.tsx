import { memo, useId } from "react";
import { TONES } from "../tokens";
import type { BallIcon, Tone } from "../types";

export interface AIBallProps {
  tone: Tone;
  icon: BallIcon;
  size: number;
  arc: number;
  badge?: number;
  urgent?: boolean;
  takeover?: boolean;
}

const WAVE_HEIGHTS = [14, 26, 38, 26, 14];

export const AIBall = memo(function AIBall({
  tone,
  icon,
  size,
  arc,
  badge,
  urgent = false,
  takeover = false,
}: AIBallProps) {
  const uid = useId().replace(/:/g, "");
  const color = TONES[tone];
  const large = size >= 96;
  const arcLen = Math.max(4, Math.min(100, arc * 100));

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: large ? size + 20 : size }}
      aria-hidden="true"
    >
      <div className={large ? "ai-float" : undefined} style={{ width: size, height: size }}>
        <svg viewBox="0 0 120 120" width={size} height={size}>
          <defs>
            <radialGradient id={`${uid}-sphere`} cx="35%" cy="28%" r="85%">
              <stop offset="0" stopColor="#3B519A" />
              <stop offset="0.55" stopColor="#1B2A5E" />
              <stop offset="1" stopColor="#0B1233" />
            </radialGradient>
          </defs>

          {/* halo + ring, tinted by tone */}
          <circle
            className="ai-halo"
            data-urgent={urgent}
            cx="60"
            cy="60"
            r="58"
            fill={color}
            fillOpacity="0.1"
            stroke={color}
            strokeOpacity="0.35"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill={color}
            fillOpacity="0.16"
            stroke={color}
            strokeOpacity="0.55"
            strokeWidth="2"
          />
          <g className="ai-spin" data-fast={icon === "spinner"}>
            <circle
              cx="60"
              cy="60"
              r="50"
              fill="none"
              stroke={color}
              strokeWidth="3.5"
              strokeLinecap="round"
              pathLength={100}
              strokeDasharray={`${arcLen} ${100 - arcLen}`}
              transform="rotate(-90 60 60)"
              style={{ transition: "stroke-dasharray 0.6s ease" }}
            />
          </g>

          {/* sphere */}
          <circle cx="60" cy="60" r="38" fill={`url(#${uid}-sphere)`} />
          <ellipse
            cx="46"
            cy="40"
            rx="13"
            ry="8"
            transform="rotate(-30 46 40)"
            fill="#fff"
            fillOpacity="0.22"
          />

          {/* face: re-mounts per icon so entry animations replay */}
          <g key={icon}>
            {icon === "core" && (
              <>
                <circle cx="60" cy="60" r="7" fill="#fff" />
                <path
                  className="ai-twinkle"
                  d="M82 43C82.6 48.4 83.6 49.4 89 50C83.6 50.6 82.6 51.6 82 57C81.4 51.6 80.4 50.6 75 50C80.4 49.4 81.4 48.4 82 43Z"
                  fill="#fff"
                />
              </>
            )}
            {icon === "wave" &&
              WAVE_HEIGHTS.map((h, i) => (
                <rect
                  key={i}
                  className="ai-bar"
                  x={40 + i * 9.5}
                  y={60 - h / 2}
                  width="5"
                  height={h}
                  rx="2.5"
                  fill="#fff"
                  style={{ animationDelay: `${i * 0.12}s` }}
                />
              ))}
            {icon === "dots" &&
              [46, 60, 74].map((cx, i) => (
                <circle
                  key={cx}
                  className="ai-dot"
                  cx={cx}
                  cy="60"
                  r={i === 1 ? 6 : 4}
                  fill="#fff"
                  fillOpacity={i === 1 ? 1 : 0.6}
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            {icon === "spinner" && (
              <>
                <circle cx="60" cy="60" r="15" fill="none" stroke="#fff" strokeOpacity="0.25" strokeWidth="4" />
                <g className="ai-spin" data-fast="true">
                  <circle
                    cx="60"
                    cy="60"
                    r="15"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="4"
                    strokeLinecap="round"
                    pathLength={100}
                    strokeDasharray="28 72"
                  />
                </g>
              </>
            )}
            {icon === "check" && (
              <path
                className="ai-draw"
                d="M47 61L56 70L73 51"
                fill="none"
                stroke="#fff"
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
                pathLength={1}
              />
            )}
          </g>
        </svg>
      </div>

      {large && (
        <div className="absolute inset-x-0 bottom-0 flex justify-center">
          <div
            className="ai-shadow rounded-full bg-black/45 blur-[3px]"
            style={{ width: size * 0.6, height: size * 0.07 }}
          />
        </div>
      )}

      {large && takeover && (
        <span
          className="ai-fade-in absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#5B7BD0] px-3 py-0.5 text-[11px] font-semibold text-white"
          style={{ bottom: 16 }}
        >
          AI in control
        </span>
      )}

      {badge !== undefined && (
        <span
          key={badge}
          className="ai-pop absolute grid place-items-center rounded-full font-semibold leading-none text-white"
          style={{
            background: color,
            top: size * 0.05,
            right: size * 0.01,
            minWidth: large ? 26 : 16,
            height: large ? 26 : 16,
            padding: "0 4px",
            fontSize: large ? 12 : 9,
          }}
        >
          {badge}
        </span>
      )}
    </div>
  );
});
