"use client";

import React from "react";
import { motion } from "motion/react";
import { Trash, WarningCircle } from "@phosphor-icons/react";

interface ConfirmArchiveModalProps {
  isOpen: boolean;
  assetName: string;
  isDeleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmArchiveModal: React.FC<ConfirmArchiveModalProps> = ({
  isOpen,
  assetName,
  isDeleting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 1000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => !isDeleting && onCancel()}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(0,0,0,0.7)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      />

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        style={{
          position: "relative",
          width: "100%",
          maxWidth: "24rem",
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 25px 50px rgba(0,0,0,0.5)",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "1px",
            background:
              "linear-gradient(to right, transparent, rgba(239,68,68,0.6), transparent)",
            zIndex: 20,
          }}
        />

        {/* Corner glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "16rem",
            height: "16rem",
            background:
              "radial-gradient(circle at top right, rgba(239,68,68,0.07), transparent 70%)",
            pointerEvents: "none",
            zIndex: 0,
          }}
        />

        {/* Header */}
        <div
          style={{
            position: "relative",
            padding: "1.5rem 1.5rem 1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "1rem",
          }}
        >
          <div
            style={{
              flexShrink: 0,
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "0.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "rgb(248,113,113)",
            }}
          >
            <WarningCircle size={20} weight="duotone" />
          </div>
          <div>
            <h3
              style={{
                fontSize: "0.875rem",
                fontWeight: 900,
                fontStyle: "italic",
                letterSpacing: "-0.025em",
                color: "white",
                textTransform: "uppercase",
                margin: 0,
              }}
            >
              Archivar Asset
            </h3>
            <p
              style={{
                marginTop: "0.25rem",
                fontSize: "0.75rem",
                color: "rgba(255,255,255,0.5)",
                lineHeight: 1.6,
              }}
            >
              ¿Estás seguro de que deseas archivar{" "}
              <span style={{ color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>
                &quot;{assetName}&quot;
              </span>
              ? Esta acción ocultará el asset del marketplace.
            </p>
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background: "rgba(255,255,255,0.06)",
            margin: "0 1.5rem",
          }}
        />

        {/* Actions */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            gap: "0.75rem",
            padding: "1rem 1.5rem",
          }}
        >
          <button
            onClick={onCancel}
            disabled={isDeleting}
            style={{
              padding: "0.5rem 1rem",
              fontSize: "0.75rem",
              fontWeight: 600,
              borderRadius: "0.75rem",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.6)",
              background: "transparent",
              cursor: "pointer",
              opacity: isDeleting ? 0.4 : 1,
            }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.375rem",
              padding: "0.5rem 1rem",
              fontSize: "0.75rem",
              fontWeight: 700,
              borderRadius: "0.75rem",
              background: "rgba(239,68,68,0.15)",
              border: "1px solid rgba(239,68,68,0.3)",
              color: "rgb(248,113,113)",
              cursor: "pointer",
              opacity: isDeleting ? 0.4 : 1,
            }}
          >
            <Trash size={13} weight="bold" />
            {isDeleting ? "Archivando..." : "Sí, archivar"}
          </button>
        </div>
      </motion.div>
    </div>
  );
};
