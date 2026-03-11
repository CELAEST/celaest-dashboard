"use client";

import { cn } from "@/lib/utils";
import { type Icon } from "@phosphor-icons/react";
import { type ReactNode } from "react";

interface EmptyStateProps {
  icon: Icon;
  title: string;
  description: string;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center animate-in fade-in-50 duration-500",
        className,
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-neutral-900/50 border border-neutral-800/60 shadow-lg shadow-black/20 mb-6 relative group">
        <div className="absolute inset-0 rounded-full bg-linear-to-tr from-cyan-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <Icon
          className="h-10 w-10 text-neutral-400 group-hover:text-cyan-400 transition-colors duration-300"
          strokeWidth={1.5}
        />
      </div>

      <div className="space-y-2 max-w-sm">
        <h3 className="text-xl font-semibold tracking-tight text-neutral-200">
          {title}
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          {description}
        </p>
      </div>

      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}
