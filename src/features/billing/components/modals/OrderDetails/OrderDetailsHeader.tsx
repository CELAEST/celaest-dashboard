import React from "react";
import { X, Package } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";
import { useBillingModalSwipe } from "../shared/BillingModal";

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
  const swipe = useBillingModalSwipe();

  return (
    <div
      onTouchStart={swipe?.handleTouchStart}
      onTouchMove={swipe?.handleTouchMove}
      onTouchEnd={swipe?.handleTouchEnd}
      onPointerDown={swipe?.handlePointerDown}
      onPointerMove={swipe?.handlePointerMove}
      onPointerUp={swipe?.handlePointerUp}
      className="px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-white/8 flex items-center justify-between shrink-0 bg-[#09090b] select-none cursor-grab active:cursor-grabbing touch-none"
    >
      <div className="flex items-center gap-3 sm:gap-3.5 min-w-0 pointer-events-none">
        {/* Icon badge */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl flex items-center justify-center shrink-0 bg-white/[0.04] text-white/70 border border-white/8">
          <Package size={16} />
        </div>
        <div className="min-w-0">
          <h2 className="text-sm font-semibold tracking-tight text-zinc-100 font-mono truncate">
            {t("order")} {orderId}
          </h2>
          <p className="text-[10px] font-mono uppercase tracking-[0.16em] text-white/40 mt-0.5 truncate">
            {t("purchased")}: {orderDate}
          </p>
        </div>
      </div>

      <div className="relative z-10 shrink-0">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          onTouchEnd={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          className="p-1.5 rounded-lg transition-colors text-white/40 hover:text-white hover:bg-white/5 cursor-pointer"
          title="Cerrar"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
