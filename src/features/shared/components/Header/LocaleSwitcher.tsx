"use client";

import React, { useState, useRef, useEffect, useTransition, useCallback } from "react";
import { useLocale } from "next-intl";
import { GlobeSimple, CaretDown, Check, CircleNotch } from "@phosphor-icons/react";
import { AnimatePresence, motion } from "motion/react";
import { locales, type Locale } from "@/i18n/config";

const LOCALE_META: Record<
  Locale,
  { label: string; nativeName: string; englishName: string; flag: string }
> = {
  es: { label: "ES", nativeName: "Español", englishName: "Spanish", flag: "🇪🇸" },
  en: { label: "EN", nativeName: "English", englishName: "English", flag: "🇺🇸" },
};

interface LocaleSwitcherProps {
  align?: "left" | "right";
}

/**
 * Locale dropdown for the dashboard Header / AuthPage.
 *
 * Click on the trigger opens a polished menu with the available locales.
 * Selecting one sets the NEXT_LOCALE cookie (read by `i18n/request.ts`)
 * and reloads the page. The active locale is highlighted with a check.
 *
 * Works in both light and dark mode — the dashboard switches via the
 * `dark:` Tailwind variant on <html>.
 */
export function LocaleSwitcher({ align = "right" }: LocaleSwitcherProps) {
  const currentLocale = useLocale() as Locale;
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [pendingLocale, setPendingLocale] = useState<Locale | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const meta = LOCALE_META[currentLocale] ?? LOCALE_META.es;

  // Close on click-outside.
  useEffect(() => {
    if (!isOpen) return;
    const onMouseDown = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [isOpen]);

  // Close on Escape.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const handleSelect = useCallback(
    (next: Locale) => {
      setIsOpen(false);
      if (next === currentLocale) return;
      setPendingLocale(next);
      startTransition(() => {
        document.cookie = `NEXT_LOCALE=${next};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
        window.location.reload();
      });
    },
    [currentLocale],
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        disabled={isPending}
        className={`
          group flex items-center gap-1.5 px-3 h-10 rounded-full -mx-3
          transition-all duration-200
          hover:bg-gray-100 dark:hover:bg-white/10
          ${isPending ? "opacity-70 cursor-wait" : "cursor-pointer"}
          ${isOpen ? "bg-gray-100 dark:bg-white/10" : ""}
        `}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={`Idioma actual: ${meta.nativeName}`}
      >
        {isPending ? (
          <CircleNotch className="w-4 h-4 animate-spin text-blue-500 dark:text-cyan-400" />
        ) : (
          <GlobeSimple
            weight="duotone"
            className="w-4 h-4 text-gray-500 dark:text-gray-400 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors"
          />
        )}
        <span className="text-xs font-bold tracking-widest text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
          {meta.label}
        </span>
        <CaretDown
          weight="bold"
          className={`
            w-3 h-3 text-gray-400 dark:text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white
            transition-all duration-200
            ${isOpen ? "rotate-180" : ""}
          `}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            role="menu"
            aria-label="Selector de idioma"
            className={`
              absolute top-full mt-2 z-50
              min-w-[200px]
              ${align === "left" ? "left-0 origin-top-left" : "right-0 origin-top-right"}
              rounded-2xl border overflow-hidden
              shadow-xl shadow-black/10 dark:shadow-black/40
              bg-white border-gray-200/80
              dark:bg-zinc-900/95 dark:border-white/10 dark:backdrop-blur-xl
            `}
          >
            {/* Decorative top accent — subtle */}
            <div className="h-px w-full bg-linear-to-r from-transparent via-blue-500/30 to-transparent dark:via-cyan-400/30" />

            <div className="py-1.5">
              <p className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
                Idioma / Language
              </p>

              {locales.map((code) => {
                const item = LOCALE_META[code];
                const isActive = code === currentLocale;
                const isLoading = pendingLocale === code;

                return (
                  <button
                    key={code}
                    type="button"
                    role="menuitemradio"
                    aria-checked={isActive}
                    onClick={() => handleSelect(code)}
                    disabled={isPending}
                    className={`
                      group w-full flex items-center gap-3 px-3 py-2.5
                      text-left text-sm
                      transition-colors duration-150
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-700 font-semibold dark:bg-cyan-500/10 dark:text-cyan-300"
                          : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/5 dark:hover:text-white"
                      }
                      ${isPending ? "cursor-wait" : "cursor-pointer"}
                    `}
                  >
                    <span
                      aria-hidden="true"
                      className="text-base leading-none w-5 text-center select-none"
                    >
                      {item.flag}
                    </span>
                    <span className="flex-1 truncate">{item.nativeName}</span>
                    {isLoading ? (
                      <CircleNotch className="w-4 h-4 animate-spin text-blue-500 dark:text-cyan-400" />
                    ) : isActive ? (
                      <Check
                        weight="bold"
                        className="w-4 h-4 text-blue-500 dark:text-cyan-400"
                      />
                    ) : (
                      <span className="w-4 h-4" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
