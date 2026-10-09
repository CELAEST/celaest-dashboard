import React from "react";
import { X, Package } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface OrderDetailsHeaderProps {
  orderId: string;
  orderDate: string;
  onClose: () => void;
}

export const OrderDetailsHeader: React.FC<OrderDetailsHeaderProps> = ({
  orderId,
  orderDate,
  onClose,
}) => {
  const t = useTranslations("billing");
  return (
    <div className="px-6 py-4.5 border-b border-white/8 flex items-center justify-between shrink-0 bg-[#09090b]">
      <div className="flex items-center gap-3.5">
        {/* Icon badge */}
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] text-white/70 border border-white/8">
          <Package size={16} />
        </div>
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-100 font-mono">
            {t("order")} {orderId}
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mt-0.5">
            {t("purchased")}: {orderDate}
          </p>
        </div>
      </div>

      <div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-colors text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
          title="Cerrar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
