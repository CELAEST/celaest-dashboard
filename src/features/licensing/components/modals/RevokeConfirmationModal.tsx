import React from "react";
import { Warning, ShieldSlash, X } from "@phosphor-icons/react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useEscapeKey } from "@/features/shared/hooks/useEscapeKey";
import { useSwipeDownToClose } from "@/features/shared/hooks/useSwipeDownToClose";
import { useTranslations } from "next-intl";

interface RevokeConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  licenseId: string;
  ipCount: number;
}

/**
 * A premium confirmation modal for destructive license revocation.
 * Follows SOLID principles by isolating the confirmation logic and UI.
 * Upgraded to Lingua Standard with mobile swipe-down-to-close.
 */
export const RevokeConfirmationModal: React.FC<
  RevokeConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, licenseId, ipCount }) => {
  const { isDark } = useTheme();
  const t = useTranslations("licensing");

  // Keyboard accessibility: Esc to close
  useEscapeKey(onClose, isOpen);

  // Mobile Swipe-down-to-close gesture
  const {
    sheetRef,
    handlePillRef,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
    handlePillClick,
  } = useSwipeDownToClose({ onClose });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
          />

          {/* Modal Content */}
          <div
            ref={sheetRef}
            onClick={(e) => e.stopPropagation()}
            style={{ willChange: "transform", backfaceVisibility: "hidden" }}
            className={`relative z-10 w-full max-w-lg rounded-t-[26px] sm:rounded-[32px] border-t sm:border overflow-hidden p-5 sm:p-8 max-h-[92dvh] overflow-y-auto animate-modal-content pb-[max(1.5rem,env(safe-area-inset-bottom))] ${
              isDark
                ? "bg-[#0a0a0a] border-white/5 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
                : "bg-white border-gray-100 shadow-2xl"
            }`}
          >
            {/* Mobile Drag Indicator Handle */}
            <div
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onClick={handlePillClick}
              className="sm:hidden -mt-2 mb-4 w-full flex items-center justify-center py-2 shrink-0 select-none cursor-grab active:cursor-grabbing touch-none"
              title="Desliza hacia abajo para cerrar"
              role="button"
              tabIndex={0}
              aria-label="Deslizar hacia abajo para cerrar"
            >
              <div
                ref={handlePillRef}
                className="w-10 h-1.5 rounded-full bg-white/20 hover:bg-white/35 transition-all duration-150"
              />
            </div>

            {/* Decorative Header */}
            <div className="absolute top-0 left-0 w-full h-1.5 bg-linear-to-r from-rose-500 via-rose-400 to-rose-500" />

            <div className="flex flex-col items-stretch text-center gap-4 sm:gap-6">
              <div
                className={`w-14 h-14 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl flex items-center justify-center rotate-3 transition-transform duration-500 hover:rotate-0 mx-auto ${
                  isDark
                    ? "bg-rose-500/10 text-rose-500 border border-rose-500/20"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}
              >
                <ShieldSlash className="w-7 h-7 sm:w-10 sm:h-10" />
              </div>

              <div className="w-full">
                <h2
                  className={`text-lg sm:text-2xl font-black uppercase tracking-tighter italic ${isDark ? "text-white" : "text-gray-900"}`}
                >
                  {t("revoke_auth_title")}
                </h2>
                <p
                  className={`mt-1.5 sm:mt-2 text-xs sm:text-sm font-medium px-1 sm:px-4 ${isDark ? "text-gray-400" : "text-gray-500"}`}
                >
                  {t.rich("revoke_auth_desc", {
                    id: licenseId,
                    mono: (chunks) => (
                      <span className="font-mono font-bold text-rose-500">
                        {chunks}
                      </span>
                    ),
                  })}
                </p>
              </div>

              <div
                className={`w-full p-3.5 sm:p-4 rounded-xl sm:rounded-2xl flex items-start gap-3 sm:gap-4 text-left ${
                  isDark
                    ? "bg-white/3 border border-white/5"
                    : "bg-gray-50 border border-gray-100"
                }`}
              >
                <Warning className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p
                    className={`text-[10px] font-black uppercase tracking-widest ${isDark ? "text-amber-500/80" : "text-amber-600"}`}
                  >
                    {t("system_warning")}
                  </p>
                  <p className="text-xs text-gray-500 font-medium mt-0.5 leading-relaxed">
                    {t("revoke_impact_warning", { count: ipCount })}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 w-full gap-2.5 sm:gap-4 mt-2 sm:mt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className={`order-2 sm:order-1 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs transition-all cursor-pointer ${
                    isDark
                      ? "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
                  }`}
                >
                  {t("cancel_protocol")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`order-1 sm:order-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-lg active:scale-95 cursor-pointer ${
                    isDark
                      ? "bg-rose-500 text-white hover:bg-rose-600 shadow-rose-500/25"
                      : "bg-rose-600 text-white hover:bg-rose-700 shadow-rose-600/30"
                  }`}
                >
                  {t("confirm_deauthorization")}
                </button>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              onTouchEnd={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Cerrar modal"
              className="absolute top-4 right-4 sm:top-6 sm:right-6 p-1.5 sm:p-2 rounded-full hover:bg-white/5 transition-colors text-gray-500 hover:text-white cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
