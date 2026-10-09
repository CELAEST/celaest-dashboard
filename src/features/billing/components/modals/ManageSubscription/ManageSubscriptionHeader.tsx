import React from "react";
import { CreditCard, X } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface ManageSubscriptionHeaderProps {
  onClose?: () => void;
}

export const ManageSubscriptionHeader: React.FC<ManageSubscriptionHeaderProps> = ({ onClose }) => {
  const t = useTranslations("billing");
  return (
    <div className="relative px-6 py-5 border-b border-white/8 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] text-white/80 border border-white/8">
          <CreditCard size={18} />
        </div>
        <div>
          <h2 className="text-base font-semibold tracking-tight text-zinc-100">
            {t("manage_subscription")}
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-wider text-white/40">
            {t("update_subscription_settings")}
          </p>
        </div>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg border border-white/8 bg-white/[0.02] text-white/50 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
