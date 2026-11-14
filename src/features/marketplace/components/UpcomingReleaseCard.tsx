"use client";

import React from "react";
import { Sparkle, Cpu, Database, ClockCountdown } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export interface UpcomingReleaseItem {
  id: "flow-studio" | "data-ops";
  categoryKey: "upcoming_1_category" | "upcoming_2_category";
  titleKey: "upcoming_1_title" | "upcoming_2_title";
  descKey: "upcoming_1_desc" | "upcoming_2_desc";
  tierKey: "upcoming_1_tier" | "upcoming_2_tier";
  tagsKey: "upcoming_1_tags" | "upcoming_2_tags";
}

export const UPCOMING_RELEASES: UpcomingReleaseItem[] = [
  {
    id: "flow-studio",
    categoryKey: "upcoming_1_category",
    titleKey: "upcoming_1_title",
    descKey: "upcoming_1_desc",
    tierKey: "upcoming_1_tier",
    tagsKey: "upcoming_1_tags",
  },
  {
    id: "data-ops",
    categoryKey: "upcoming_2_category",
    titleKey: "upcoming_2_title",
    descKey: "upcoming_2_desc",
    tierKey: "upcoming_2_tier",
    tagsKey: "upcoming_2_tags",
  },
];

export const UpcomingReleaseCard: React.FC<{ item: UpcomingReleaseItem }> = ({ item }) => {
  const t = useTranslations("marketplace");
  const tags = t(item.tagsKey).split(",");
  const Icon = item.id === "flow-studio" ? Cpu : Database;

  return (
    <article className="relative flex flex-col justify-between rounded-2xl bg-[#070709]/90 border border-dashed border-white/[0.11] hover:border-violet-400/35 p-5 sm:p-6 transition-all duration-300 overflow-hidden select-none">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(167,139,250,0.06),transparent_65%)]" />
      <div className="relative z-10 flex flex-col gap-3.5">
        <div className="flex items-center justify-between gap-2 pb-3 border-b border-white/[0.06]">
          <span className="inline-flex items-center gap-1.5 font-jetbrains text-[10px] font-bold uppercase tracking-[0.16em] text-violet-300/90">
            <ClockCountdown size={13} weight="duotone" className="text-violet-400" />
            {t("upcoming_badge")}
          </span>
          <span className="font-jetbrains text-[10px] uppercase tracking-wider text-zinc-400">
            {t(item.tierKey)}
          </span>
        </div>

        <div className="flex items-center gap-3 pt-1">
          <div className="w-10 h-10 rounded-xl bg-violet-500/10 border border-violet-400/20 flex items-center justify-center text-violet-300 shrink-0">
            <Icon size={20} weight="duotone" />
          </div>
          <div>
            <span className="font-jetbrains text-[10px] uppercase tracking-[0.18em] text-zinc-500 block">
              {t(item.categoryKey)}
            </span>
            <h3 className="font-jakarta font-extrabold text-white text-base sm:text-lg tracking-tight leading-snug">
              {t(item.titleKey)}
            </h3>
          </div>
        </div>

        <p className="text-xs text-[#A1A1AA] leading-relaxed font-sans">{t(item.descKey)}</p>

        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-white/[0.03] border border-white/[0.06] font-jetbrains text-[10px] text-zinc-400"
            >
              {tag.trim()}
            </span>
          ))}
        </div>
      </div>

      <div className="relative z-10 mt-5 pt-3.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-jetbrains text-violet-300/85">
          <Sparkle size={12} weight="fill" className="text-violet-400 shrink-0" />
          {t("upcoming_footer")}
        </span>
      </div>
    </article>
  );
};
