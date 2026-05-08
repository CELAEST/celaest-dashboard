import React from "react";
import { motion } from "motion/react";
import { CircleNotch, CheckCircle } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { Progress } from "@/components/ui/progress";
import { useTranslations } from "next-intl";

interface ActivationStepProps {
  purchaseComplete: boolean;
  progress: number;
  statusMessage?: string;
  onReset: () => void;
  onGoToAssets?: () => void;
}

export const ActivationStep: React.FC<ActivationStepProps> = ({
  purchaseComplete,
  progress,
  statusMessage,
  onReset,
  onGoToAssets,
}) => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6 text-center py-6"
    >
      {purchaseComplete ? (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.6 }}
          >
            <CheckCircle
              className={`mx-auto ${theme === "dark" ? "text-green-400" : "text-green-600"}`}
              size={64}
            />
          </motion.div>
          <div>
            <h2
              className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("completed_exclamation")}
            </h2>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {t("asset_ready")}
            </p>
          </div>
          <div
            className={`p-4 rounded-xl ${theme === "dark" ? "bg-green-500/10 border border-green-500/20" : "bg-green-50 border border-green-200"}`}
          >
            <p
              className={`text-sm ${theme === "dark" ? "text-green-400" : "text-green-700"}`}
            >
              {t("access_details_sent")}
            </p>
          </div>
          <button
            onClick={onGoToAssets || onReset}
            className={`
              w-full py-3 rounded-xl font-medium transition-all
              ${
                theme === "dark"
                  ? "bg-cyan-500 text-black hover:bg-cyan-400"
                  : "bg-gray-900 text-white hover:bg-gray-800"
              }
            `}
          >
            {t("go_to_my_assets")}
          </button>
        </>
      ) : (
        <>
          <CircleNotch
            className={`mx-auto animate-spin ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}
            size={48}
          />
          <div>
            <h2
              className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {t("configuring_asset")}
            </h2>
            <p
              className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
            >
              {statusMessage || t("take_a_few_seconds")}
            </p>
          </div>
          <Progress value={progress} className="w-64 mx-auto" />
        </>
      )}
    </motion.div>
  );
};
