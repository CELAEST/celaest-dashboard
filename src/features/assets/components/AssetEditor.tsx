"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { X, Package } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { assetSchema, AssetFormValues } from "../hooks/useAssetForm";
import { Asset, AssetType } from "../services/assets.service";
import { AssetFileUploader } from "./AssetFileUploader";
import { AssetFormFields } from "./AssetFormFields";
import { zodResolver } from "@hookform/resolvers/zod";

interface AssetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AssetFormValues) => void;
  asset: Asset | null;
  isUploading?: boolean;
  uploadProgress?: number;
}

export const AssetEditor: React.FC<AssetEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  asset,
  isUploading,
  uploadProgress,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      return () => {
        document.body.style.overflow = "";
        document.removeEventListener("keydown", handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const methods = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      type: "excel",
      category_id: "",
      price: 0,
      status: "draft",
      is_public: false,
      description: "",
      requirements: "",
      features: "",
      tags: "",
      technical_stack: "",
      min_plan_tier: 0,
      external_url: "",
      github_repository: "",
      thumbnail_url: "",
    },
  });

  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    // Normalize legacy status values to current enum
    const normalizeStatus = (s: string): "draft" | "published" | "archived" => {
      switch (s) {
        case "published":
        case "stable":
        case "active":
          return "published";
        case "archived":
        case "deprecated":
          return "archived";
        default:
          return "draft";
      }
    };

    if (asset) {
      reset({
        name: asset.name,
        type: (asset.display_type || asset.type) as AssetType,
        category_id: asset.categoryId || "",
        price: asset.price,
        status: normalizeStatus(asset.status),
        is_public: asset.isPublic ?? false,
        description: asset.description || "",
        requirements: asset.requirements?.join("\n") || "",
        features: asset.features?.join("\n") || "",
        tags: asset.tags?.join("\n") || "",
        technical_stack: asset.technicalStack?.join("\n") || "",
        min_plan_tier: asset.minPlanTier || 0,
        external_url: asset.external_url || "",
        github_repository: asset.github_repository || "",
        thumbnail_url: asset.thumbnail || "",
      });
    } else {
      reset({
        name: "",
        type: "excel",
        category_id: "",
        price: 0,
        status: "draft",
        is_public: false,
        description: "",
        requirements: "",
        features: "",
        tags: "",
        technical_stack: "",
        min_plan_tier: 0,
        external_url: "",
        github_repository: "",
        thumbnail_url: "",
      });
    }
  }, [asset, reset, isOpen]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          role="dialog"
          aria-modal="true"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.75)",
              backdropFilter: "blur(8px)",
            }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.25 }}
            style={{
              position: "relative",
              zIndex: 10,
              width: "100%",
              maxWidth: "50rem",
              margin: "0 1rem",
              maxHeight: "94vh",
              borderRadius: "1.5rem",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: isDark
                ? "0 30px 60px -12px rgba(0,0,0,0.7), 0 0 0 1px rgba(255,255,255,0.08)"
                : "0 30px 60px -12px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.08)",
              background: isDark ? "#0a0a0a" : "#ffffff",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent line */}
            <div
              className={`absolute inset-x-0 top-0 h-px z-20 ${
                isDark
                  ? "bg-linear-to-r from-transparent via-cyan-500/70 to-transparent"
                  : "bg-linear-to-r from-transparent via-blue-400/50 to-transparent"
              }`}
            />

            {/* Corner glow behind watermark */}
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "22rem",
                height: "22rem",
                background: isDark
                  ? "radial-gradient(circle at top right, rgba(6,182,212,0.06), transparent 70%)"
                  : "radial-gradient(circle at top right, rgba(59,130,246,0.06), transparent 70%)",
                pointerEvents: "none",
                zIndex: 0,
              }}
            />

            {/* Background watermark icon — gradient prism effect */}
            <div
              style={{
                position: "absolute",
                top: "-0.5rem",
                right: "-0.5rem",
                pointerEvents: "none",
                userSelect: "none",
                zIndex: 0,
                transform: "rotate(-12deg)",
              }}
            >
              {/* Capa violet/purple — desplazada y difuminada */}
              {isDark && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    color: "#a78bfa",
                    opacity: 0.07,
                    filter: "blur(4px)",
                    transform: "translate(-10px, 10px)",
                  }}
                >
                  <Package size={260} weight="duotone" />
                </div>
              )}
              {/* Capa pink/accent — desplazada opuesta */}
              {isDark && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    color: "#e879f9",
                    opacity: 0.03,
                    filter: "blur(2px)",
                    transform: "translate(6px, -6px)",
                  }}
                >
                  <Package size={260} weight="duotone" />
                </div>
              )}
              {/* Capa principal — cyan con glow */}
              <div
                style={{
                  color: isDark ? "#22d3ee" : "#3b82f6",
                  opacity: isDark ? 0.09 : 0.07,
                  filter: isDark
                    ? "drop-shadow(0 0 18px rgba(6,182,212,0.25))"
                    : "none",
                }}
              >
                <Package size={260} weight="duotone" />
              </div>
            </div>

            {/* Header */}
            <div
              className="relative px-8 py-6 flex justify-between items-start overflow-hidden shrink-0"
              style={{
                borderBottom: isDark
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "1px solid rgba(0,0,0,0.08)",
              }}
            >
              {/* Fondo gradiente sutil — igual que OrderDetailsHeader pero en cyan */}
              <div
                className={`absolute inset-0 ${
                  isDark
                    ? "bg-linear-to-r from-cyan-500/10 via-teal-600/8 to-transparent"
                    : "bg-linear-to-r from-cyan-50 via-blue-50/60 to-transparent"
                }`}
              />
              {/* Grid dots decorativo */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage: isDark
                    ? "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)"
                    : "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                  pointerEvents: "none",
                }}
              />
              {/* Línea accent inferior izquierda */}
              <div
                className={`absolute bottom-0 left-0 h-px w-2/5 ${
                  isDark
                    ? "bg-linear-to-r from-cyan-500/50 to-transparent"
                    : "bg-linear-to-r from-cyan-400/30 to-transparent"
                }`}
              />

              {/* Left: icon + text */}
              <div className="relative z-10 flex gap-4 items-start">
                {/* Icon badge — mismo patrón Orders */}
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-lg shrink-0 ${
                    isDark
                      ? "bg-[#111] text-cyan-400 border border-white/10 shadow-cyan-500/10"
                      : "bg-white text-cyan-600 border border-cyan-100 shadow-cyan-200/40"
                  }`}
                >
                  <Package size={24} weight="duotone" />
                </div>

                <div>
                  <h2
                    className={`text-2xl font-bold leading-tight ${
                      isDark ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {asset ? asset.name : "New Asset"}
                  </h2>

                  <div className="flex items-center gap-2 mt-1.5">
                    {/* Badge de estado — igual al "Purchased: date" de Orders */}
                    <span
                      className={`text-sm font-medium px-2 py-0.5 rounded-full ${
                        asset
                          ? isDark
                            ? "bg-amber-500/10 text-amber-300 border border-amber-500/15"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                          : isDark
                            ? "bg-white/8 text-gray-300"
                            : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {asset ? "Editing asset" : "Upload and configure digital asset"}
                    </span>
                    {!asset && (
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    )}
                  </div>
                </div>
              </div>

              {/* Close button */}
              <div className="relative z-10">
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className={`p-2 rounded-full transition-colors ${
                    isDark
                      ? "hover:bg-white/10 text-gray-400 hover:text-white"
                      : "hover:bg-black/5 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            {/* Body */}
            <FormProvider {...methods}>
              <form
                onSubmit={handleSubmit(
                  (data) =>
                    onSave({
                      ...data,
                      productFile: selectedFile || undefined,
                    } as AssetFormValues),
                  (errors) => {
                    const firstError = Object.values(errors)[0];
                    if (firstError?.message) {
                      import("sonner").then(({ toast }) =>
                        toast.error(`Validation: ${firstError.message}`),
                      );
                    }
                  },
                )}
                style={{ position: "relative", zIndex: 10 }}
                className="flex-1 overflow-y-auto p-6 space-y-8"
              >
                <AssetFileUploader
                  selectedFile={selectedFile}
                  onFileSelect={setSelectedFile}
                />
                <AssetFormFields
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                />

                <div
                  className={`flex gap-3 pt-4 border-t ${
                    isDark ? "border-white/10" : "border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={onClose}
                    className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-colors ${
                      isDark
                        ? "bg-white/5 text-gray-300 hover:bg-white/10 border border-white/10"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:scale-[1.02] active:scale-[0.98] ${
                      isDark
                        ? "bg-linear-to-r from-cyan-600 to-cyan-500 text-white hover:shadow-cyan-500/30"
                        : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:shadow-blue-500/30"
                    }`}
                  >
                    {asset ? "Update Asset" : "Create Asset"}
                  </button>
                </div>
              </form>
            </FormProvider>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};
