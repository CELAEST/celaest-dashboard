"use client";

import React from "react";
import { motion } from "motion/react";
import Image from "next/image";
import { ArrowUpRight } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

export const MarketplacePublicHero: React.FC = () => {
  const t = useTranslations("marketplace");

  const handleScrollToCatalog = () => {
    const catalog = document.getElementById("marketplace-catalog");
    catalog?.scrollIntoView({ behavior: "smooth" });
  };

  const handleIntegrationsGlow = (
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    event.currentTarget.style.setProperty("--glow-x", `${x}%`);
  };

  const integrations = [
    {
      label: "WhatsApp",
      logo: "/images/integrations/whatsapp.svg",
      name: "WhatsApp",
    },
    {
      label: "Google Sheets",
      logo: "/images/integrations/google-sheets.svg",
      name: "Google Sheets",
    },
    {
      label: "HubSpot CRM",
      logo: "/images/integrations/hubspot.svg",
      name: "HubSpot CRM",
    },
    {
      label: "Gmail",
      logo: "/images/integrations/gmail.svg",
      name: "Gmail",
    },
    {
      label: "API",
      logo: "/images/integrations/api.svg",
      name: "",
    },
    {
      label: "Webhooks",
      logo: "/images/integrations/webhooks.svg",
      name: "",
    },
  ];

  return (
    <>
      <section className="relative min-h-[469px] overflow-hidden bg-black px-5 text-white sm:min-h-[526px] sm:px-8 lg:min-h-[469px] lg:px-10">
        <div className="absolute inset-0 bg-black" />
        <Image
          src="/images/marketplace-automation-hero-panorama-2026-06-04-v3.png"
          fill
          priority
          sizes="100vw"
          className="-translate-x-4 scale-[1.16] object-contain object-center transform-gpu sm:-translate-x-5 sm:scale-[1.18] lg:-translate-x-7 lg:scale-[1.2]"
          alt={t("hero_visual_alt")}
        />
        <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-black/82 via-black/42 to-transparent lg:w-[58%]" />
        <div className="absolute inset-y-0 left-0 w-20 bg-linear-to-r from-black to-transparent" />
        <div className="absolute inset-y-0 right-0 w-48 bg-linear-to-l from-black via-black/70 to-transparent sm:w-56 lg:w-72" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-b from-transparent via-black/35 to-black" />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="flex min-h-[469px] items-center py-8 sm:min-h-[526px] lg:min-h-[469px]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-[34rem]"
            >
              <h1 className="text-[2.15rem] font-black leading-[1.05] text-white sm:text-5xl lg:text-[3.2rem]">
                {t("hero_headline")}
                <span className="mt-1 block">
                  {t("hero_line_prefix")}{" "}
                  <span className="text-blue-500">{t("hero_line_accent")}</span>{" "}
                  {t("hero_line_suffix")}
                </span>
              </h1>

              <p className="mt-5 max-w-[28rem] text-sm leading-6 text-gray-400 sm:text-base">
                {t("hero_subtitle")}
              </p>

              <button
                onClick={handleScrollToCatalog}
                className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-blue-600 px-5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition-colors hover:bg-blue-500"
              >
                {t("hero_primary_cta")}
                <ArrowUpRight className="h-4 w-4" weight="bold" />
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="-mt-6 bg-black px-5 pb-8 text-white sm:-mt-7 sm:px-8 lg:-mt-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div
            onMouseMove={handleIntegrationsGlow}
            onMouseLeave={(event) =>
              event.currentTarget.style.setProperty("--glow-x", "50%")
            }
            className="group relative overflow-hidden rounded-[1.85rem] border border-blue-400/18 bg-[#050b14]/82 px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-sm transition-shadow duration-200 hover:shadow-[0_0_44px_rgba(37,99,235,0.13),inset_0_1px_0_rgba(255,255,255,0.08)]"
            style={{ "--glow-x": "50%" } as React.CSSProperties}
          >
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-blue-400 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-65" />
            <div className="pointer-events-none absolute inset-x-10 bottom-0 h-px bg-linear-to-r from-transparent via-blue-500 to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-55" />
            <div className="pointer-events-none absolute left-[var(--glow-x)] top-0 h-8 w-36 -translate-x-1/2 rounded-full bg-blue-500/38 opacity-0 blur-2xl transition-[left,opacity] duration-150 ease-out group-hover:opacity-100" />
            <div className="pointer-events-none absolute bottom-0 left-[var(--glow-x)] h-8 w-36 -translate-x-1/2 rounded-full bg-blue-600/38 opacity-0 blur-2xl transition-[left,opacity] duration-150 ease-out group-hover:opacity-100" />

            <div className="relative grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
              {integrations.map(({ label, logo, name }, index) => (
                <div
                  key={label}
                  className="group relative flex h-11 items-center justify-center gap-3 px-3"
                >
                  {index > 0 ? (
                    <span className="absolute left-0 hidden h-7 w-px bg-white/12 lg:block" />
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo}
                  alt={label}
                  className={`${name ? "h-5 max-w-24" : "h-6 max-w-32"} w-auto brightness-0 invert opacity-90 transition-opacity group-hover:opacity-100`}
                />
                  {name ? (
                    <span className="whitespace-nowrap text-sm font-semibold tracking-wide text-gray-200/90 transition-colors group-hover:text-white">
                      {name}
                    </span>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
