"use client";

import React, { useState } from "react";
import { Bell, CaretRight, Check } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { StudioCardShell } from "./studio-card/StudioCardShell";
import type { StudioCapabilityStep } from "./studio-card/catalogCardHelpers";

export interface UpcomingReleaseItem {
  id: "empleo" | "ordenes";
  imageSrc: string;
  imageAltKey: "upcoming_1_image_alt" | "upcoming_2_image_alt";
  categoryKey: "upcoming_1_category" | "upcoming_2_category";
  titleKey: "upcoming_1_title" | "upcoming_2_title";
  descKey: "upcoming_1_desc" | "upcoming_2_desc";
  tierKey: "upcoming_1_tier" | "upcoming_2_tier";
  tagsKey: "upcoming_1_tags" | "upcoming_2_tags";
  stepPrefix: "upcoming_1" | "upcoming_2";
}

export const UPCOMING_RELEASES: UpcomingReleaseItem[] = [
  {
    id: "empleo",
    imageSrc: "/images/marketplace/upcoming-empleo-violet.webp",
    imageAltKey: "upcoming_1_image_alt",
    categoryKey: "upcoming_1_category",
    titleKey: "upcoming_1_title",
    descKey: "upcoming_1_desc",
    tierKey: "upcoming_1_tier",
    tagsKey: "upcoming_1_tags",
    stepPrefix: "upcoming_1",
  },
  {
    id: "ordenes",
    imageSrc: "/images/marketplace/upcoming-ordenes-violet.webp",
    imageAltKey: "upcoming_2_image_alt",
    categoryKey: "upcoming_2_category",
    titleKey: "upcoming_2_title",
    descKey: "upcoming_2_desc",
    tierKey: "upcoming_2_tier",
    tagsKey: "upcoming_2_tags",
    stepPrefix: "upcoming_2",
  },
];

export const UpcomingReleaseCard: React.FC<{ item: UpcomingReleaseItem }> = ({ item }) => {
  const t = useTranslations("marketplace");
  const [activeStep, setActiveStep] = useState(0);
  const [notified, setNotified] = useState(false);

  const steps: StudioCapabilityStep[] = [1, 2, 3].map((n) => ({
    num: `0${n}`,
    name: t(`${item.stepPrefix}_step_${n}_name`),
    tag: t(`${item.stepPrefix}_step_${n}_tag`),
    detail: t(`${item.stepPrefix}_step_${n}_detail`),
  }));

  const title = t(item.titleKey);
  const nextStepLabel = `0${((activeStep + 1) % steps.length) + 1}`;

  const handleToggleNotify = () => {
    const nextState = !notified;
    setNotified(nextState);
    if (nextState) {
      toast.success(t("upcoming_notify_toast", { title }));
    } else {
      toast.message(t("upcoming_notify_cancelled_toast", { title }));
    }
  };

  return (
    <StudioCardShell
      variant="upcoming"
      imageSrc={item.imageSrc}
      imageAlt={t(item.imageAltKey)}
      topLeftLabel={t(item.categoryKey)}
      topRightNode={<span className="sb4-tag-sub">{t("upcoming_short_badge")}</span>}
      title={title}
      description={t(item.descKey)}
      steps={steps}
      activeStep={activeStep}
      onSelectStep={setActiveStep}
      footerMetaLeft={
        <span className="sb-mono sb-muted" style={{ whiteSpace: "normal", lineHeight: 1.35, fontSize: 9 }}>
          {t("upcoming_rollout_note")}
        </span>
      }
      footerMetaRight={t(item.tierKey)}
      leftActionButton={
        <button
          type="button"
          className="sb-btn sb-btn--ghost"
          onClick={() => setActiveStep((prev) => (prev + 1) % steps.length)}
        >
          <span>{t("upcoming_step_btn", { step: nextStepLabel })}</span>
          <CaretRight size={13} weight="bold" />
        </button>
      }
      rightActionButton={
        <button
          type="button"
          aria-pressed={notified}
          className={`sb-btn ${notified ? "sb-btn--active" : "sb-btn--solid"}`}
          onClick={handleToggleNotify}
        >
          {notified ? <Check size={13} weight="bold" /> : <Bell size={13} weight="bold" />}
          <span>{notified ? t("upcoming_notified_btn") : t("upcoming_notify_btn")}</span>
        </button>
      }
    />
  );
};
