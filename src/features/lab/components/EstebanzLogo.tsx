import React from "react";

interface EstebanzLogoProps {
  className?: string;
  size?: number;
}

export function EstebanzLogo({ className = "", size = 28 }: EstebanzLogoProps) {
  return (
    <div
      className={`relative flex items-center justify-center shrink-0 ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Ambient cyan glow */}
      <div className="absolute inset-0 bg-cyan-400/30 blur-md rounded-full pointer-events-none" />

      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="relative z-10 drop-shadow-[0_0_8px_rgba(34,211,238,0.7)]"
      >
        <defs>
          <linearGradient id="estebanz-wing-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="45%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="estebanz-inner-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a5f3fc" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Upper wing - sharp swooping butterfly/bird wing */}
        <path
          d="M 6 18 C 9 12, 17 6, 27 5 C 24 10, 19 15, 14 17 C 12 18, 9 18.5, 6 18 Z"
          fill="url(#estebanz-wing-grad)"
        />

        {/* Lower wing - sleek dynamic swoosh */}
        <path
          d="M 7 19.5 C 11 18, 17 21, 23 26 C 18 26.5, 13 25, 9.5 22.5 C 8 21.5, 7.2 20.5, 7 19.5 Z"
          fill="url(#estebanz-inner-grad)"
        />

        {/* Center glowing core / body */}
        <path
          d="M 11 16.5 C 13.5 15, 16 16, 17 18 C 15.5 18.5, 13 18.2, 11 16.5 Z"
          fill="#e0f2fe"
          opacity="0.9"
        />
      </svg>
    </div>
  );
}
