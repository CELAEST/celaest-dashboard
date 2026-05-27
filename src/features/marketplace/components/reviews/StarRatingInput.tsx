/**
 * StarRatingInput
 *
 * Accessible 1-5 star rating input. Used by `ReviewForm` (create/edit) and
 * potentially by anywhere else that needs an interactive star control.
 *
 * - Hover preview without committing.
 * - Arrow keys ←/→ adjust within [1, 5] when the group is focused.
 * - Disabled state mutes interactions and visuals.
 * - Visually neutral by default; consumer wraps it in its own theme.
 */
"use client";

import React, { useState } from "react";
import { Star } from "@phosphor-icons/react";

interface StarRatingInputProps {
  value: number;
  onChange: (next: number) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
}

const SIZE_MAP = {
  sm: "h-5 w-5",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export const StarRatingInput: React.FC<StarRatingInputProps> = ({
  value,
  onChange,
  disabled = false,
  size = "md",
}) => {
  const [hovered, setHovered] = useState(0);

  const active = hovered || value;
  const iconSize = SIZE_MAP[size];

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className="flex items-center gap-1"
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "ArrowRight" || e.key === "ArrowUp") {
          e.preventDefault();
          onChange(Math.min(5, (value || 0) + 1));
        } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
          e.preventDefault();
          onChange(Math.max(1, (value || 1) - 1));
        }
      }}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= active;
        return (
          <button
            key={star}
            type="button"
            role="radio"
            aria-checked={value === star}
            aria-label={`${star} stars`}
            disabled={disabled}
            onClick={() => onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => !disabled && setHovered(0)}
            className={`p-1 transition-transform ${
              disabled ? "cursor-not-allowed opacity-60" : "hover:scale-110"
            }`}
          >
            <Star
              weight={filled ? "fill" : "regular"}
              className={`${iconSize} transition-colors ${
                filled ? "text-amber-400" : "text-gray-400 dark:text-white/20"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};
