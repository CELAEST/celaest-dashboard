"use client";

import { cn } from "@/lib/utils";
import { type ReactNode } from "react";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumbs?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "space-y-4 pb-6 border-b border-neutral-800/60 mb-8 w-full animate-in fade-in slide-in-from-top-4 duration-500",
        className,
      )}
    >
      {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl font-semibold tracking-tight text-white flex items-center gap-2">
            {title}
          </h1>
          {description && (
            <p className="text-sm font-medium text-neutral-400 max-w-2xl">
              {description}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
