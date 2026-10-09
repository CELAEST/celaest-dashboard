import React from "react";
import { ArrowCounterClockwise, PencilSimple, FloppyDisk, Package } from "@phosphor-icons/react";
import { useTranslations } from "next-intl";

interface OrderDetailsFooterProps {
  mode: "view" | "edit";
  setMode: (mode: "view" | "edit") => void;
  onClose: () => void;
  onSave: () => void;
  onRefund?: () => void;
  canRefund?: boolean;
  lastEditDate: string;
  isSuperAdmin?: boolean;
}

export const OrderDetailsFooter: React.FC<OrderDetailsFooterProps> = ({
  mode,
  setMode,
  onClose,
  onSave,
  onRefund,
  canRefund = false,
  lastEditDate,
  isSuperAdmin = false,
}) => {
  const t = useTranslations("billing");
  const tCommon = useTranslations("common");
  return (
    <div className="px-6 py-3.5 border-t border-white/8 bg-[#09090b] flex items-center justify-between shrink-0">
      {/* Left: metadata badge */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 bg-white/[0.04] text-white/50 border border-white/8">
          <Package size={13} />
        </div>
        <div>
          <p className="text-[9px] font-mono uppercase tracking-[0.16em] text-white/30 mb-0.5">{t("last_edit")}</p>
          <p className="text-xs font-mono text-white/70 tracking-wider tabular-nums">{lastEditDate}</p>
        </div>
      </div>

      {/* Right: action buttons */}
      <div className="flex items-center gap-2">
        {mode === "view" ? (
          <>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {tCommon("close")}
            </button>
            {isSuperAdmin && (
              <button
                onClick={() => setMode("edit")}
                className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 text-white/80 hover:text-white text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <PencilSimple size={13} />
                {tCommon("edit")}
              </button>
            )}
            {canRefund && onRefund && (
              <button
                onClick={onRefund}
                className="px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-300 text-xs font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowCounterClockwise size={13} />
                {t("refund")}
              </button>
            )}
          </>
        ) : (
          <>
            <button
              onClick={() => setMode("view")}
              className="px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 text-white/80 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
            >
              {tCommon("cancel")}
            </button>
            <button
              onClick={onSave}
              className="px-4 py-1.5 rounded-xl bg-white text-zinc-900 hover:bg-zinc-200 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <FloppyDisk size={13} />
              {t("save")}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
