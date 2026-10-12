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
      <section className="relative min-h-[580px] sm:min-h-[526px] lg:min-h-[469px] overflow-hidden bg-black px-4 text-white sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-black" />
        <Image
          src="/images/marketplace-automation-hero-panorama.webp"
          fill
          priority
          sizes="100vw"
          className="hidden sm:block translate-x-14 scale-[1.34] object-contain object-right opacity-30 transform-gpu sm:-translate-x-5 sm:scale-[1.18] sm:object-center sm:opacity-100 lg:-translate-x-7 lg:scale-[1.2]"
          alt={t("hero_visual_alt")}
        />
        {/* Seamless black gradient on the left for text contrast without cutting the image */}
        <div className="absolute inset-y-0 left-0 w-full bg-linear-to-r from-black via-black/85 to-transparent sm:from-black/90 sm:via-black/50 sm:to-transparent lg:w-[58%]" />
        <div className="absolute inset-y-0 left-0 w-24 bg-linear-to-r from-black to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-linear-to-b from-transparent via-black/40 to-black" />

        {/* Ambient electric blue glow echoing the 3D cube */}
        <div className="pointer-events-none absolute -left-20 top-1/4 h-96 w-96 rounded-full bg-[#0088ff]/10 blur-[130px]" />
        <div className="pointer-events-none absolute left-1/4 top-1/2 h-64 w-64 rounded-full bg-[#00d2ff]/08 blur-[100px]" />

        <div className="relative z-10 mx-auto max-w-392">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-8 py-8 sm:py-0 min-h-[580px] sm:min-h-[526px] lg:min-h-[469px]">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="max-w-128 sm:max-w-136 w-full text-left"
            >
              <h1 className="text-[2rem] font-black leading-[1.05] text-white sm:text-5xl lg:text-[3.2rem]">
                {t("hero_headline")}
                <span className="mt-1 block">
                  {t("hero_line_prefix")}{" "}
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-[#38bdf8] via-[#0099ff] to-[#60a5fa] drop-shadow-[0_0_24px_rgba(0,153,255,0.45)]">
                    {t("hero_line_accent")}
                  </span>{" "}
                  {t("hero_line_suffix")}
                </span>
              </h1>

              <p className="mt-5 max-w-108 text-sm leading-6 text-zinc-400 sm:max-w-112 sm:text-base">
                {t("hero_subtitle")}
              </p>

              <button
                onClick={handleScrollToCatalog}
                className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-xl bg-linear-to-r from-[#0066cc] via-[#0088ff] to-[#00b4d8] px-6 font-mono text-xs uppercase tracking-wider font-bold text-white shadow-[0_0_24px_rgba(0,136,255,0.4)] hover:shadow-[0_0_36px_rgba(0,136,255,0.65)] hover:brightness-110 active:scale-[0.99] transition-all cursor-pointer"
              >
                {t("hero_primary_cta")}
                <ArrowUpRight className="h-4 w-4" weight="bold" />
              </button>
            </motion.div>

            {/* Mobile Visual block - centered cropped logo stack */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="w-full max-w-88 sm:hidden block mx-auto mt-5"
            >
              <Image
                src="/images/marketplace-automation-hero-mobile-centered.webp"
                width={860}
                height={599}
                priority
                className="w-full h-auto object-contain"
                alt={t("hero_visual_alt")}
              />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="mt-8 sm:-mt-7 lg:-mt-8 bg-black px-4 pb-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-392">
          <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-[#09090b]/80 px-4 py-4 shadow-[0_8px_32px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:px-5 sm:py-5">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-px bg-linear-to-r from-transparent via-[#0099ff]/30 to-transparent" />

            <div className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6 lg:gap-0">
              {integrations.map(({ label, logo, name }, index) => (
                <div
                  key={label}
                  className="group relative flex h-12 items-center justify-center gap-2.5 rounded-xl border border-white/4 bg-white/2 px-3 transition-all duration-300 hover:bg-white/6 hover:border-white/10 lg:h-11 lg:rounded-none lg:border-0 lg:bg-transparent lg:hover:bg-transparent lg:px-3"
                >
                  {index > 0 ? (
                    <span className="absolute left-0 hidden h-7 w-px bg-white/12 lg:block" />
                  ) : null}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={logo}
                    alt={label}
                    className={`${name ? "h-5 max-w-20" : "h-6 max-w-28"} w-auto brightness-0 invert opacity-70 transition-opacity group-hover:opacity-100`}
                  />
                  {name ? (
                    <span className="whitespace-nowrap text-xs sm:text-sm font-semibold tracking-wide text-zinc-400 transition-colors group-hover:text-white">
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
