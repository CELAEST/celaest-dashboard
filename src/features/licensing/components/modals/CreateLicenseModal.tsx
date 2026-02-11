import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Sparkles } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { useCreateLicense } from "@/features/licensing/hooks/useCreateLicense";
import { LicenseTypeSelector } from "./create-license/LicenseTypeSelector";
import { LicenseForm } from "./create-license/LicenseForm";
import { LicenseSuccess } from "./create-license/LicenseSuccess";

import { LicenseFormData } from "@/features/licensing/hooks/useCreateLicense";

interface CreateLicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (licenseData: LicenseFormData) => Promise<string>;
}

export const CreateLicenseModal = ({
  isOpen,
  onClose,
  onCreate,
}: CreateLicenseModalProps) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Using the hook for form state management
  const { form, resetForm: hookReset } = useCreateLicense(() => {}); // Empty callback as we're not using its handleCreateLicense internally here for logic, but passing data up

  // Local state for UI flow
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [createdKey, setCreatedKey] = useState("");

  const onSubmit = async (data: LicenseFormData) => {
    setLoading(true);
    try {
      const key = await onCreate(data);
      setCreatedKey(key || "key_mock_" + Date.now());
      setStep(3);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep(1);
    setCreatedKey("");
    hookReset();
    onClose();
  };

  // Keyboard accessibility: Esc to close
  useEscapeKey(handleClose, isOpen);

  const billingCycle = form.watch("billing_cycle");

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className={`w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden pointer-events-auto flex flex-col ${
                isDark
                  ? "bg-[#0a0a0a] border border-white/10"
                  : "bg-white border border-gray-200"
              }`}
            >
              {/* Header */}
              <div className="p-6 border-b relative overflow-hidden">
                <div
                  className={`absolute inset-0 opacity-10 ${
                    isDark
                      ? "bg-linear-to-r from-cyan-500 via-purple-500 to-pink-500"
                      : "bg-linear-to-r from-cyan-200 via-purple-200 to-pink-200"
                  }`}
                />
                <div className="relative flex justify-between items-center">
                  <h2
                    className={`text-xl font-bold flex items-center gap-2 ${isDark ? "text-white" : "text-gray-900"}`}
                  >
                    <Sparkles className="text-cyan-500" size={20} />
                    Generate License
                  </h2>
                  <button
                    onClick={handleClose}
                    className={`p-2 rounded-full transition-colors ${
                      isDark
                        ? "hover:bg-white/10 text-gray-400 hover:text-white"
                        : "hover:bg-gray-100 text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {step === 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="space-y-4"
                  >
                    <LicenseTypeSelector
                      selectedType={billingCycle}
                      onSelect={(type) =>
                        form.setValue(
                          "billing_cycle",
                          type as
                            | "monthly"
                            | "quarterly"
                            | "yearly"
                            | "lifetime",
                          {
                            shouldValidate: true,
                          },
                        )
                      }
                    />

                    <LicenseForm
                      form={form}
                      onSubmit={form.handleSubmit(onSubmit)}
                      loading={loading}
                    />
                  </motion.div>
                )}

                {step === 3 && (
                  <LicenseSuccess
                    createdKey={createdKey}
                    onCopy={() => navigator.clipboard.writeText(createdKey)}
                    onClose={handleClose}
                  />
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
