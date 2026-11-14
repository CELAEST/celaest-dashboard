"use client";

import React from "react";
import { Play } from "@phosphor-icons/react";
import { ImageWithFallback } from "@/components/figma/ImageWithFallback";
import type { StudioCapabilityStep } from "./catalogCardHelpers";
import { usePointerSheen } from "./usePointerSheen";
import "./StudioCatalogCard.css";

interface StudioCardShellProps {
  variant: "live" | "upcoming";
  imageSrc: string | null;
  imageAlt: string;
  priority?: boolean;
  topLeftLabel: string;
  topRightNode: React.ReactNode;
  title: string;
  description: string;
  steps: StudioCapabilityStep[];
  activeStep: number;
  onSelectStep: (idx: number) => void;
  onInspectDetails?: () => void;
  showDemoButton?: boolean;
  demoButtonLabel?: string;
  demoButtonTitle?: string;
  footerMetaLeft: React.ReactNode;
  footerMetaRight: string;
  leftActionButton: React.ReactNode;
  rightActionButton: React.ReactNode;
}

/** Shared Preset 04 Studio 3D obsidian card scaffold used across live and upcoming catalog items. */
export const StudioCardShell: React.FC<StudioCardShellProps> = ({
  variant,
  imageSrc,
  imageAlt,
  priority = false,
  topLeftLabel,
  topRightNode,
  title,
  description,
  steps,
  activeStep,
  onSelectStep,
  onInspectDetails,
  showDemoButton = false,
  demoButtonLabel,
  demoButtonTitle,
  footerMetaLeft,
  footerMetaRight,
  leftActionButton,
  rightActionButton,
}) => {
  const { cardRef, onMouseMove } = usePointerSheen();
  const safeActiveIndex = steps.length > 0 ? Math.min(activeStep, steps.length - 1) : 0;
  const activeDetail = steps[safeActiveIndex]?.detail;

  return (
    <article
      ref={cardRef}
      onMouseMove={onMouseMove}
      className={`sb-card ${variant === "live" ? "sb-card--live-solid" : "sb-card--dashed-neutral"}`}
    >
      <div className="sb-pointer-glow" />

      <div>
        <div
          className={`sb4-hero ${onInspectDetails ? "sb4-hero--interactive" : ""}`}
          onClick={onInspectDetails}
        >
          <ImageWithFallback
            src={imageSrc}
            alt={imageAlt}
            fill
            priority={priority}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="sb4-hero-img object-cover"
          />
          <div className="sb4-hero-scrim" />

          <div className="sb4-hero-top">
            <span className="sb4-tag-line">{topLeftLabel}</span>
            {topRightNode}
          </div>

          {showDemoButton && onInspectDetails && (
            <button
              type="button"
              className="sb-demo-cue"
              title={demoButtonTitle}
              onClick={(e) => {
                e.stopPropagation();
                onInspectDetails();
              }}
            >
              <Play size={9} weight="fill" />
              <span>{demoButtonLabel}</span>
            </button>
          )}

          <svg
            viewBox="0 0 380 36"
            className="sb4-trace-svg"
            fill="none"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M 22 26 L 138 26 L 154 14 L 240 14 L 256 26 L 358 26"
              stroke="rgba(255,255,255,0.14)"
              strokeWidth="1"
            />
            <path
              d="M 22 26 L 138 26 L 154 14 L 240 14 L 256 26 L 358 26"
              stroke="rgba(255,255,255,0.85)"
              strokeWidth="1.4"
              className="sb-signal-path"
            />
          </svg>
        </div>

        <div className="sb4-body">
          <div>
            <h3
              onClick={onInspectDetails}
              className={`sb4-title ${onInspectDetails ? "sb4-title--interactive" : ""}`}
            >
              {title}
            </h3>
            <p className="sb4-desc">{description}</p>
          </div>

          {steps.length > 0 && (
            <div className="sb4-steps">
              {steps.map((step, idx) => (
                <button
                  key={step.num}
                  type="button"
                  aria-pressed={safeActiveIndex === idx}
                  className={`sb4-step-row ${safeActiveIndex === idx ? "is-active" : ""}`}
                  onClick={() => onSelectStep(idx)}
                >
                  <span className="sb4-step-idx">{step.num}</span>
                  <span className="sb4-step-name">{step.name}</span>
                  <span className="sb4-step-val">{step.tag}</span>
                </button>
              ))}
            </div>
          )}

          {activeDetail && <div className="sb4-detail-line">{activeDetail}</div>}
        </div>
      </div>

      <footer className="sb-footer">
        <div className="sb-footer-meta">
          {footerMetaLeft}
          <span
            className="sb-mono"
            style={{ color: "#e4e4e7", fontSize: 9, flexShrink: 0, whiteSpace: "nowrap" }}
          >
            {footerMetaRight}
          </span>
        </div>
        <div className="sb-btn-pair">
          {leftActionButton}
          {rightActionButton}
        </div>
      </footer>
    </article>
  );
};
