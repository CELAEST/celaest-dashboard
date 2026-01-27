import React from "react";
import { Layers, ArrowRightCircle, Hash, CreditCard } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { PaymentGateway } from "../../../types";
import { GatewayDisplay } from "./GatewayDisplay";
import { GatewayEditForm } from "./GatewayEditForm";

interface GatewayItemProps {
  gateway: PaymentGateway;
  isEditing: boolean;
  editForm: Partial<PaymentGateway>;
  setEditForm: (form: Partial<PaymentGateway>) => void;
  showApiKey: Record<string, boolean>;
  toggleApiKeyVisibility: (id: string) => void;
  handleEdit: (gateway: PaymentGateway) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleToggleStatus: (id: string) => void;
  maskApiKey: (key: string, show: boolean) => string;
}

export const GatewayItem: React.FC<GatewayItemProps> = ({
  gateway,
  isEditing,
  editForm,
  setEditForm,
  showApiKey,
  toggleApiKeyVisibility,
  handleEdit,
  handleSaveEdit,
  handleCancelEdit,
  handleToggleStatus,
  maskApiKey,
}) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "emerald";
      case "standby":
        return "orange";
      case "disabled":
        return "gray";
      default:
        return "gray";
    }
  };

  const getGatewayIcon = (logo: string) => {
    switch (logo) {
      case "stripe":
        return <Layers className="w-10 h-10 text-indigo-500" />;
      case "paypal":
        return <ArrowRightCircle className="w-10 h-10 text-blue-500" />;
      case "square":
        return <Hash className="w-10 h-10 text-gray-400" />;
      default:
        return <CreditCard className="w-10 h-10 text-gray-500" />;
    }
  };

  const statusColor = getStatusColor(gateway.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        !isEditing
          ? {
              y: -4,
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            }
          : {}
      }
      className={`rounded-2xl overflow-hidden transition-all duration-300 ${
        isDark
          ? "bg-[#1e293b]/50 backdrop-blur-xl border border-white/10"
          : "bg-white border border-gray-200 shadow-sm"
      }`}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-5">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110 ${
                isDark
                  ? "bg-white/5 border border-white/10"
                  : "bg-gray-50 border border-gray-100"
              }`}
            >
              {getGatewayIcon(gateway.logo)}
            </div>
            <div>
              <h3
                className={`text-xl font-black tracking-tight ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {gateway.name}
              </h3>
              <div className="flex items-center gap-2 mt-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleToggleStatus(gateway.id)}
                  className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    statusColor === "emerald"
                      ? isDark
                        ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-emerald-500/10 text-emerald-600 border border-emerald-200 hover:bg-emerald-500/20"
                      : statusColor === "orange"
                        ? isDark
                          ? "bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500/20"
                          : "bg-orange-500/10 text-orange-600 border border-orange-200 hover:bg-orange-500/20"
                        : isDark
                          ? "bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500/20"
                          : "bg-gray-500/10 text-gray-600 border border-gray-200 hover:bg-gray-500/20"
                  }`}
                >
                  {gateway.status}
                </motion.button>
                {gateway.testMode && (
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      isDark
                        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        : "bg-amber-100 text-amber-700 border border-amber-200"
                    }`}
                  >
                    Sandbox
                  </span>
                )}
              </div>
            </div>
          </div>
          {!isEditing && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleEdit(gateway)}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                isDark
                  ? "bg-cyan-600 text-white hover:bg-cyan-500 shadow-lg shadow-cyan-900/20"
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-900/20"
              }`}
            >
              Configure
            </motion.button>
          )}
        </div>

        {isEditing ? (
          <GatewayEditForm
            gatewayId={gateway.id}
            editForm={editForm}
            setEditForm={setEditForm}
            showApiKey={showApiKey}
            toggleApiKeyVisibility={toggleApiKeyVisibility}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
          />
        ) : (
          <GatewayDisplay
            gateway={gateway}
            showApiKey={showApiKey}
            toggleApiKeyVisibility={toggleApiKeyVisibility}
            maskApiKey={maskApiKey}
          />
        )}
      </div>
    </motion.div>
  );
};
