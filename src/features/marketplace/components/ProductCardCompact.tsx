"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  ArrowSquareOut,
  CaretRight,
  Check,
  Lock,
  Star,
} from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useGeoPricing } from "@/features/billing/providers/GeoPricingProvider";
import { useMarketplaceCouponStore } from "../store";
import { MarketplaceProduct } from "../types";
import { isSaasProduct } from "../utils/saasLauncher";
import { StudioCardShell } from "./studio-card/StudioCardShell";
import {
  parseProductCapabilities,
  resolveCardPricingState,
  resolveStudioThumbnail,
  resolveTierBadgeLabel,
} from "./studio-card/catalogCardHelpers";

interface ProductCardCompactProps {
  product: MarketplaceProduct;
  onSelect: () => void;
  onViewDetails?: () => void;
  isOwned?: boolean;
  accessLevel?: "owned" | "plan" | "none";
  disabledReason?: string;
  priority?: boolean;
}

/**
 * ProductCardCompact (Preset 04 · Studio 3D Architecture)
 *
 * Clean monochrome obsidian card with eased 214px studio scrim, interactive
 * 3-row capability breakdown, focal pricing footer, and full 8-use-case parity.
 */
export const ProductCardCompact = React.memo(function ProductCardCompact({
  product,
  onSelect,
  onViewDetails,
  isOwned = false,
  accessLevel,
  disabledReason,
  priority = false,
}: ProductCardCompactProps) {
  const { activeCoupon } = useMarketplaceCouponStore();
  const t = useTranslations("marketplace");
  const { pricing, formatPrice } = useGeoPricing();
  const [activeStep, setActiveStep] = useState(0);

  const effectiveAccess = accessLevel ?? (isOwned ? "owned" : "none");
  const hasAccess = effectiveAccess === "owned" || effectiveAccess === "plan";
  const isSaas = isSaasProduct(product);

  const rating = product.rating_avg ?? 0;
  const reviews = product.rating_count ?? 0;
  const hasReviews = reviews > 0 && rating > 0;

  const statusText =
    effectiveAccess === "plan"
      ? t("in_plan").toUpperCase()
      : effectiveAccess === "owned"
        ? t("acquired").toUpperCase()
        : t("available_status");

  const planBadge = resolveTierBadgeLabel(product.min_plan_tier, effectiveAccess, {
    starterPlus: t("tier_starter_plus"),
    proTier: t("tier_pro_badge"),
    enterprise: t("tier_enterprise_badge"),
    includedPrefix: (tier) => t("plan_included_prefix", { tier }),
    activeLicense: t("active_license"),
  });

  const priceState = resolveCardPricingState({
    product,
    pricing,
    formatPrice,
    activeCoupon,
    isSaas,
    labels: {
      freeLabel: t("free"),
      monthUnit: (curr) => t("price_month_unit", { currency: curr }),
      monthShort: t("price_month_short"),
      onetimeUnit: (curr) => t("price_onetime_unit", { currency: curr }),
      onetimeShort: t("price_onetime_short"),
    },
  });

  const steps = parseProductCapabilities(
    product,
    [t("default_feature_1"), t("default_feature_2"), t("default_feature_3")],
    t("capability_tag"),
  );

  const isPrimaryDisabled = (!isSaas && hasAccess) || Boolean(disabledReason);
  const buttonText = hasAccess
    ? isSaas
      ? t("open_app")
      : effectiveAccess === "plan"
        ? t("in_plan")
        : t("acquired")
    : disabledReason || t("acquire");

  const topRightMeta = (
    <span className="inline-flex items-center gap-2 whitespace-nowrap shrink-0">
      <span className="sb-rating-micro">
        {hasReviews ? (
          <>
            <Star size={9} weight="fill" className="sb-rating-star" />
            <span style={{ color: "#e4e4e7", fontWeight: 700 }}>{rating.toFixed(1)}</span>
            <span>({reviews})</span>
          </>
        ) : (
          <span>{t("no_reviews_yet_title")}</span>
        )}
        <span style={{ color: "#52525b" }}>·</span>
      </span>
      <span className="sb4-tag-sub sb4-tag-sub--live">{statusText}</span>
    </span>
  );

  const footerPriceMeta = (
    <div
      className="sb-live-price-stack"
      aria-label={`${priceState.priceValueText} ${priceState.priceUnitText}`.trim()}
    >
      {priceState.hasDiscount && (
        <div className="sb-price-was-row">
          {priceState.originalPriceText && (
            <span className="sb-price-was">{priceState.originalPriceText}</span>
          )}
          {priceState.discountBadgeText && (
            <span className="sb-price-discount">{priceState.discountBadgeText}</span>
          )}
        </div>
      )}
      <div className="sb-live-price">
        <span
          className={`sb-live-price-val${priceState.isCompactValue ? " is-compact" : ""}${priceState.hasDiscount ? " is-discount" : ""}`}
        >
          {priceState.priceValueText}
        </span>
        {priceState.priceUnitText && (
          <span className="sb-live-price-unit">{priceState.priceUnitText}</span>
        )}
      </div>
    </div>
  );

  return (
    <StudioCardShell
      variant="live"
      imageSrc={resolveStudioThumbnail(product)}
      imageAlt={product.name}
      priority={priority}
      topLeftLabel={product.category_name || t("default_category")}
      topRightNode={topRightMeta}
      title={product.name}
      description={product.short_description}
      steps={steps}
      activeStep={activeStep}
      onSelectStep={setActiveStep}
      onInspectDetails={onViewDetails}
      showDemoButton={Boolean(product.youtube_video_id)}
      demoButtonLabel={t("demo_label")}
      demoButtonTitle={t("watch_demo")}
      footerMetaLeft={footerPriceMeta}
      footerMetaRight={planBadge}
      leftActionButton={
        <button
          type="button"
          className="sb-btn sb-btn--ghost"
          onClick={onViewDetails}
        >
          <span>{t("view_details")}</span>
          <CaretRight size={13} weight="bold" />
        </button>
      }
      rightActionButton={
        <button
          type="button"
          disabled={isPrimaryDisabled}
          title={disabledReason || undefined}
          className={`sb-btn ${isPrimaryDisabled ? "sb-btn--disabled" : "sb-btn--solid"}`}
          onClick={onSelect}
        >
          {disabledReason ? (
            <>
              <Lock size={12} weight="bold" />
              <span>{buttonText}</span>
            </>
          ) : hasAccess && !isSaas ? (
            <>
              <Check size={12} weight="bold" />
              <span>{buttonText}</span>
            </>
          ) : hasAccess && isSaas ? (
            <>
              <span>{buttonText}</span>
              <ArrowSquareOut size={13} weight="bold" />
            </>
          ) : (
            <>
              <span>{buttonText}</span>
              <ArrowRight size={13} weight="bold" />
            </>
          )}
        </button>
      }
    />
  );
});
