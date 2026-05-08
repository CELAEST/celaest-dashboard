"use client";

import React, { useTransition } from "react";
import { useLocale } from "next-intl";
import { GlobeSimple } from "@phosphor-icons/react";
import { type Locale } from "@/i18n/config";

/**
 * Compact locale switcher button for the Header.
 * Toggles between ES ↔ EN by setting a cookie and reloading.
 */
export function LocaleSwitcher() {
  const currentLocale = useLocale();
  const [isPending, startTransition] = useTransition();

  const nextLocale: Locale =
    currentLocale === "es" ? "en" : "es";

  const label = currentLocale === "es" ? "ES" : "EN";

  const handleSwitch = () => {
    startTransition(() => {
      // Set the locale cookie — picked up by i18n/request.ts on next request
      document.cookie = `NEXT_LOCALE=${nextLocale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
      window.location.reload();
    });
  };

  return (
    <button
      onClick={handleSwitch}
      disabled={isPending}
      className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-full transition-all duration-200 hover:bg-white/10 dark:hover:bg-white/10"
      aria-label={`Switch language to ${nextLocale === "es" ? "Spanish" : "English"}`}
      title={`Switch to ${nextLocale === "es" ? "Español" : "English"}`}
    >
      <GlobeSimple className="w-4 h-4" />
      <span className="text-xs font-bold tracking-widest">{label}</span>
    </button>
  );
}
