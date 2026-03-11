"use client";

import React from "react";
import { useTheme } from "@/features/shared/hooks/useTheme";

// PageLayout — wraps every view. Enforces viewport-lock + flex column.
interface PageLayoutProps {
  children: React.ReactNode;
}
export function PageLayout({ children }: PageLayoutProps) {
  return <div className="h-full min-w-0 flex flex-col">{children}</div>;
}

// PageHeader — shrink-0, consistent height across ALL views.
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}
export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div className="shrink-0 px-3 py-3 flex items-center justify-between gap-4 min-w-0">
      <div className="min-w-0 flex-1">
        <h1
          className={`text-sm font-bold tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs mt-0.5 text-gray-500">{subtitle}</p>
        )}
      </div>
        className={`shrink-0 px-3 py-2 border-t ${isDark ? "border-white/5 bg-white/2" : "border-gray-200 bg-gray-50"}`}
    </div>
  );
}

// PageContent — flex-1, only THIS area scrolls.
interface PageContentProps {
  children: React.ReactNode;
  noPadding?: boolean;
}
export function PageContent({ children, noPadding }: PageContentProps) {
  return (
    <div
      className={`flex-1 min-h-0 min-w-0 overflow-auto ${noPadding ? "" : "px-3 py-3"}`}
    >
      {children}
    </div>
  );
}

// PageBanner — bold branded header for feature landing pages (Billing, Licensing, etc.)
interface PageBannerProps {
  title: string;
  subtitle?: string;
  titleAside?: React.ReactNode;
  actions?: React.ReactNode;
}
export function PageBanner({
  title,
  subtitle,
  titleAside,
  actions,
}: PageBannerProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`sticky top-0 z-30 shrink-0 backdrop-blur-xl border-b transition-colors duration-200 ${
        isDark ? "bg-black/50 border-white/5" : "bg-white/70 border-gray-100"
      }`}
    >
      <div className="px-3 py-3 flex items-start justify-between gap-4 min-w-0">
        <div className="min-w-0 flex-1">
          <div className="min-w-0 flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
            <div className="min-w-0 flex-1">
              <h1
                className={`text-2xl font-black tracking-tighter uppercase italic ${
                  isDark
                    ? "bg-linear-to-r from-white via-white to-white/40 bg-clip-text text-transparent"
                    : "text-gray-900"
                }`}
              >
                {title}
              </h1>
              {subtitle && (
                <p
                  className={`text-xs font-mono tracking-widest uppercase mt-1 ${
                    isDark ? "text-cyan-400/60" : "text-blue-600/60"
                  }`}
                >
                  {subtitle}
                </p>
              )}
            </div>

            {titleAside && (
              <div className="hidden lg:flex shrink-0 items-center gap-3 max-w-full">
                {titleAside}
              </div>
            )}
          </div>
        </div>
        {actions && <div className="flex shrink-0 items-center gap-3 max-w-full">{actions}</div>}
      </div>

      {titleAside && (
        <div className="px-3 pb-3 flex lg:hidden min-w-0">
          <div className="min-w-0 max-w-full">{titleAside}</div>
        </div>
      )}
    </div>
  );
}

// PageFooter — shrink-0, optional.
interface PageFooterProps {
  children: React.ReactNode;
}
export function PageFooter({ children }: PageFooterProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  return (
    <div
      className={`shrink-0 px-3 py-2 border-t ${isDark ? "border-white/5 bg-white/2" : "border-gray-200 bg-gray-50"}`}
    >
      {children}
    </div>
  );
}
