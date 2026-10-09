import React from "react";
import { Check } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface ManageSubscriptionFooterProps {
  onClose: () => void;
}

export const ManageSubscriptionFooter: React.FC<ManageSubscriptionFooterProps> = ({ onClose }) => {
  const t = useTranslations("billing");
  return (
    <div className="relative shrink-0 border-t border-white/8 bg-[#09090b]/40 px-6 py-4 flex justify-end">
      <button
        onClick={onClose}
        type="button"
        className="px-5 py-2 rounded-xl text-xs font-mono font-semibold uppercase tracking-wider bg-white text-black hover:bg-zinc-200 transition-colors shadow-sm flex items-center gap-1.5 cursor-pointer"
      >
        <Check size={14} weight="bold" />
        <span>{t("done")}</span>
      </button>
    </div>
  );
};
