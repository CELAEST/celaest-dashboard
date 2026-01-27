import React from "react";
import { Key, Eye, EyeOff, Zap, CheckCircle } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { PaymentGateway } from "../../../types";

interface GatewayEditFormProps {
  gatewayId: string;
  editForm: Partial<PaymentGateway>;
  setEditForm: (form: Partial<PaymentGateway>) => void;
  showApiKey: Record<string, boolean>;
  toggleApiKeyVisibility: (id: string) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
}

export const GatewayEditForm: React.FC<GatewayEditFormProps> = ({
  gatewayId,
  editForm,
  setEditForm,
  showApiKey,
  toggleApiKeyVisibility,
  handleSaveEdit,
  handleCancelEdit,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4"
    >
      {/* API Key */}
      <div>
        <label
          className={`block text-xs font-semibold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          API Key / Secret
        </label>
        <div className="relative">
          <Key
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <input
            type={showApiKey[gatewayId] ? "text" : "password"}
            value={editForm.apiKey || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                apiKey: e.target.value,
              })
            }
            placeholder="Enter API key or secret"
            className={`w-full pl-10 pr-12 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 ${
              isDark
                ? "bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50"
                : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
            }`}
          />
          <button
            onClick={() => toggleApiKeyVisibility(gatewayId)}
            className={`absolute right-3 top-1/2 -translate-y-1/2 transition-colors duration-300 ${
              isDark
                ? "text-gray-500 hover:text-gray-300"
                : "text-gray-400 hover:text-gray-600"
            }`}
          >
            {showApiKey[gatewayId] ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Webhook URL */}
      <div>
        <label
          className={`block text-xs font-semibold mb-2 ${
            isDark ? "text-gray-300" : "text-gray-700"
          }`}
        >
          Webhook URL
        </label>
        <div className="relative">
          <Zap
            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${
              isDark ? "text-gray-500" : "text-gray-400"
            }`}
          />
          <input
            type="text"
            value={editForm.webhookUrl || ""}
            onChange={(e) =>
              setEditForm({
                ...editForm,
                webhookUrl: e.target.value,
              })
            }
            placeholder="https://..."
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 ${
              isDark
                ? "bg-black/60 border border-white/10 text-white placeholder-gray-500 focus:border-cyan-500/50"
                : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:border-blue-500"
            }`}
          />
        </div>
      </div>

      {/* Test Mode Toggle */}
      <motion.div
        whileHover={{ scale: 1.01 }}
        className={`p-4 rounded-xl flex items-center justify-between ${
          isDark
            ? "bg-white/5 border border-white/10"
            : "bg-gray-50 border border-gray-200"
        }`}
      >
        <div>
          <div
            className={`text-sm font-semibold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Test Mode
          </div>
          <div
            className={`text-xs ${isDark ? "text-gray-400" : "text-gray-600"}`}
          >
            Enable test mode for development and testing
          </div>
        </div>
        <button
          onClick={() =>
            setEditForm({
              ...editForm,
              testMode: !editForm.testMode,
            })
          }
          className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
            editForm.testMode
              ? isDark
                ? "bg-linear-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
                : "bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
              : isDark
                ? "bg-gray-700"
                : "bg-gray-300"
          }`}
        >
          <motion.div
            animate={{ x: editForm.testMode ? 28 : 4 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
          />
        </button>
      </motion.div>

      {/* Action Buttons */}
      <div className="flex gap-2 justify-end pt-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCancelEdit}
          className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
            isDark
              ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
              : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
          }`}
        >
          Cancel
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveEdit}
          className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
            isDark
              ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
              : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Save Configuration
        </motion.button>
      </div>
    </motion.div>
  );
};
