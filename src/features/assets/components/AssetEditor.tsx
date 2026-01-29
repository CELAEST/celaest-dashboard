"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { assetSchema, AssetFormValues } from "../hooks/useAssetForm";
import { Asset } from "../hooks/useAssets";
import { AssetFileUploader } from "./AssetFileUploader";
import { AssetFormFields } from "./AssetFormFields";
import { zodResolver } from "@hookform/resolvers/zod";

interface AssetEditorProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: AssetFormValues) => void;
  asset: Asset | null;
}

export const AssetEditor: React.FC<AssetEditorProps> = ({
  isOpen,
  onClose,
  onSave,
  asset,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const methods = useForm<AssetFormValues>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      type: "excel",
      category: "",
      price: 0,
      operationalCost: 0,
      status: "draft",
      description: "",
      requirements: "",
      features: "",
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (asset) {
      reset({
        name: asset.name,
        type: asset.type,
        category: asset.category,
        price: asset.price,
        operationalCost: asset.operationalCost,
        status: asset.status,
        description: asset.description || "",
        requirements: asset.requirements?.join("\n") || "",
        features: asset.features?.join("\n") || "",
      });
    } else {
      reset({
        name: "",
        type: "excel",
        category: "",
        price: 0,
        operationalCost: 0,
        status: "draft",
        description: "",
        requirements: "",
        features: "",
      });
    }
  }, [asset, reset, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl ${
            isDark ? "bg-gray-900 border-white/10" : "bg-white border-gray-200"
          }`}
        >
          <div
            className={`sticky top-0 z-10 p-6 border-b ${
              isDark
                ? "bg-gray-900/95 backdrop-blur-md border-white/5"
                : "bg-white/95 backdrop-blur-md border-gray-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className={`text-2xl font-bold tracking-tight ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {asset ? "Edit Asset" : "Create New Asset"}
                </h2>
                <p
                  className={`text-sm mt-1 ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {asset
                    ? "Update metadata and versioning"
                    : "Upload and configure digital asset"}
                </p>
              </div>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark
                    ? "hover:bg-white/10 text-gray-400 hover:text-white"
                    : "hover:bg-gray-100 text-gray-600 hover:text-gray-900"
                }`}
              >
                <X size={24} />
              </button>
            </div>
          </div>

          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSave)} className="p-6 space-y-8">
              <AssetFileUploader />
              <AssetFormFields />

              <div className="flex gap-3 pt-4 border-t border-white/5">
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
                  className={`flex-1 px-6 py-3.5 rounded-xl font-bold transition-all shadow-lg ${
                    isDark
                      ? "bg-linear-to-r from-cyan-600 to-cyan-500 text-white hover:shadow-cyan-500/25"
                      : "bg-linear-to-r from-blue-600 to-blue-500 text-white hover:shadow-blue-500/25"
                  }`}
                >
                  {asset ? "Update Asset" : "Create Asset"}
                </button>
              </div>
            </form>
          </FormProvider>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
