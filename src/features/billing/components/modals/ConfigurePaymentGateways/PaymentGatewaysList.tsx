import React from "react";
import { ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { PaymentGateway } from "../../../types";
import { GatewayItem } from "./GatewayItem";

interface PaymentGatewaysListProps {
  gateways: PaymentGateway[];
  editingGatewayId: string | null;
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

export const PaymentGatewaysList: React.FC<PaymentGatewaysListProps> = ({
  gateways,
  editingGatewayId,
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

  return (
    <div className="space-y-4">
      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className={`p-4 rounded-xl flex items-start gap-4 ${
          isDark
            ? "bg-cyan-500/5 border border-cyan-500/10"
            : "bg-cyan-50/50 border border-cyan-100"
        }`}
      >
        <div
          className={`p-2 rounded-lg ${
            isDark ? "bg-cyan-500/10" : "bg-cyan-100"
          }`}
        >
          <ShieldCheck
            className={`w-5 h-5 ${isDark ? "text-cyan-400" : "text-cyan-600"}`}
          />
        </div>
        <div>
          <div
            className={`text-sm font-bold mb-0.5 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Enterprise-Grade Security
          </div>
          <div
            className={`text-xs leading-relaxed ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            All API credentials are encrypted with AES-256 and transmitted via
            secure TLS 1.3 channels. Credentials are never stored in plain text.
          </div>
        </div>
      </motion.div>

      {/* Gateways List */}
      <div className="space-y-4">
        {gateways.map((gateway) => (
          <GatewayItem
            key={gateway.id}
            gateway={gateway}
            isEditing={editingGatewayId === gateway.id}
            editForm={editForm}
            setEditForm={setEditForm}
            showApiKey={showApiKey}
            toggleApiKeyVisibility={toggleApiKeyVisibility}
            handleEdit={handleEdit}
            handleSaveEdit={handleSaveEdit}
            handleCancelEdit={handleCancelEdit}
            handleToggleStatus={handleToggleStatus}
            maskApiKey={maskApiKey}
          />
        ))}
      </div>
    </div>
  );
};
