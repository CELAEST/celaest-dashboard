import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useMarketplaceCouponStore } from "../store";
import { couponsService } from "@/features/coupons/services/coupons.service";
import { useApiAuth } from "@/lib/use-api-auth";
import { Tag, X, CheckCircle, CircleNotch, Lightning } from "@phosphor-icons/react";
import { settingsApi } from "@/features/settings/api/settings.api";
import { UpgradePlanModal } from "@/features/billing/components/modals/UpgradePlanModal";

export function CouponFAB() {
  const { activeCoupon, setCoupon, clearCoupon } = useMarketplaceCouponStore();
  const { token, orgId } = useApiAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isPlansOpen, setIsPlansOpen] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();

  // Silently load and re-validate the active coupon when the user enters the marketplace
  useEffect(() => {
    if (!token || !orgId) return;

    // Do not attempt to auto-load from DB if we just completed a successful checkout.
    // The checkout return hook is actively clearing the coupon in the background,
    // and querying the DB now might grab the old stale coupon before the DB transaction finishes.
    const isSuccess = searchParams.get("success") === "true";
    if (isSuccess) return;

    const loadAndValidate = async () => {
      try {
        let currentCoupon = activeCoupon;

        // 1. If not in memory, try loading from db preferences
        if (!currentCoupon) {
          const res = await settingsApi.getPreferences(token);
          if (res.preferences?.raw) {
            try {
              const prefs = JSON.parse(res.preferences.raw);
              if (prefs.marketplace_active_coupon) {
                currentCoupon = prefs.marketplace_active_coupon;
              }
            } catch {
              // Ignore JSON parse errors
            }
          }
        }

        // 2. Validate current coupon
        if (currentCoupon) {
          const result = await couponsService.validateCoupon(
            currentCoupon.code,
            token,
            orgId,
          );

          if (result.valid && result.coupon) {
            setCoupon({
              code: currentCoupon.code,
              type: result.coupon.discount_type as
                | "percentage"
                | "fixed_amount",
              value: result.coupon.discount_value as number,
            });
          } else {
            // Invalid/Expired: clear from memory and DB
            clearCoupon();
            await settingsApi.updatePreferences(
              { marketplace_active_coupon: null },
              token,
            );
          }
        }
      } catch (err) {
        console.error("Auto-validation of DB coupon failed:", err);
      }
    };

    // We only want to run this once on mount/auth, not on every activeCoupon change
    loadAndValidate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, orgId, searchParams]);

  const handleApply = async () => {
    if (!code.trim() || !token || !orgId) return;

    setLoading(true);
    setError(null);
    try {
      // Usar token y orgId asumiendo un rol de usuario validando su propio cupón
      // Si el usuario no está logueado, esto requeriría un endpoint público.
      // Por ahora el dashboard requiere login, así que usar los tokens actuales funciona.
      const result = await couponsService.validateCoupon(
        code.trim(),
        token,
        orgId,
      );

      if (
        result.valid &&
        result.coupon &&
        result.coupon.discount_type &&
        result.coupon.discount_value !== undefined
      ) {
        const couponData = {
          code: code.trim(),
          type: result.coupon.discount_type as "percentage" | "fixed_amount",
          value: result.coupon.discount_value,
        };
        setCoupon(couponData);
        // Persist to DB
        await settingsApi.updatePreferences(
          { marketplace_active_coupon: couponData },
          token,
        );

        setIsOpen(false);
        setCode("");
      } else {
        setError(result.reason || "Invalid coupon code");
      }
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to validate coupon",
      );
    } finally {
      setLoading(false);
    }
  };

  const currentSavingsText = activeCoupon
    ? activeCoupon.type === "percentage"
      ? `${activeCoupon.value}% OFF`
      : `$${activeCoupon.value} OFF`
    : "";

  return (
    <>
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
        {/* Popover Bubble for Coupons */}
        {isOpen && (
          <div className="mb-2 w-72 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200 origin-bottom-right">
            <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
              <h3 className="text-sm font-medium text-white flex items-center gap-2">
                <Tag className="w-4 h-4 text-cyan-400" />
                Apply Coupon
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {activeCoupon ? (
                <div className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl gap-2">
                  <CheckCircle className="w-8 h-8 text-emerald-400" />
                  <p className="text-emerald-300 font-medium text-sm text-center">
                    Active Code:{" "}
                    <span className="text-white font-bold">
                      {activeCoupon.code}
                    </span>
                  </p>
                  <div className="mt-2 text-xs text-emerald-400/80 bg-emerald-500/10 px-3 py-1 rounded-full">
                    Discount: {currentSavingsText || ""}
                  </div>
                  <button
                    onClick={async () => {
                      clearCoupon();
                      if (token) {
                        await settingsApi.updatePreferences(
                          { marketplace_active_coupon: null },
                          token,
                        );
                      }
                      setIsOpen(false);
                    }}
                    className="mt-3 text-xs text-red-400 hover:text-red-300 underline"
                  >
                    Remove Coupon
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs text-gray-400">Coupon Code</label>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value.toUpperCase())}
                      placeholder="e.g. EARLYBIRD"
                      className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-500/50 uppercase"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          void handleApply();
                        }
                      }}
                    />
                    {error && (
                      <p className="text-xs text-red-400 mt-1">{error}</p>
                    )}
                  </div>

                  <button
                    onClick={() => void handleApply()}
                    disabled={!code.trim() || loading}
                    className="w-full py-2 bg-linear-to-r from-cyan-500 to-blue-500 text-white text-sm font-medium rounded-lg hover:from-cyan-400 hover:to-blue-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex justify-center items-center h-9"
                  >
                    {loading ? (
                      <CircleNotch className="w-4 h-4 animate-spin" />
                    ) : (
                      "Apply Code"
                    )}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* FAB Stack Content */}
        <div className="flex flex-col gap-3 items-end">
          {/* Coupons Action Button (Top) */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`relative flex items-center justify-start h-12 rounded-full shadow-lg backdrop-blur-xl border transition-all duration-500 ease-out hover:scale-[1.02] active:scale-95 w-12 group-hover:w-[165px] pl-[13px] overflow-hidden group/btn hover:shadow-[0_0_30px_-5px]
              ${
                activeCoupon
                  ? "bg-linear-to-r from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300 hover:shadow-emerald-500/30"
                  : "bg-linear-to-tr from-cyan-500/20 to-blue-500/20 border-cyan-500/30 text-cyan-300 hover:shadow-cyan-500/30 hover:border-cyan-400/50"
              }
            `}
          >
            {/* Shimmer Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />

            <Tag
              className={`relative z-10 w-5 h-5 shrink-0 transition-transform duration-300 group-hover/btn:scale-110 ${
                activeCoupon
                  ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]"
                  : "text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]"
              }`}
            />
            <span className="relative z-10 font-bold text-sm whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-500 pointer-events-none">
              {activeCoupon ? currentSavingsText : "Tengo un Cupón"}
            </span>
          </button>

          {/* Plans Action Button (Bottom) */}
          <button
            onClick={() => setIsPlansOpen(true)}
            className="relative flex items-center justify-start h-12 rounded-full shadow-lg backdrop-blur-xl border transition-all duration-500 ease-out hover:scale-[1.02] active:scale-95 bg-linear-to-tr from-purple-500/20 to-fuchsia-500/20 border-purple-500/30 text-purple-300 hover:border-purple-400/50 hover:shadow-[0_0_30px_-5px] hover:shadow-purple-500/30 w-12 group-hover:w-[135px] pl-[13px] overflow-hidden group/btn"
          >
            {/* Shimmer Overlay */}
            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 ease-in-out" />

            <Lightning className="relative z-10 w-5 h-5 shrink-0 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.5)] transition-transform duration-300 group-hover/btn:scale-110" />
            <span className="relative z-10 font-bold text-sm whitespace-nowrap overflow-hidden max-w-0 opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 group-hover:ml-3 transition-all duration-500 pointer-events-none">
              Ver Planes
            </span>
          </button>
        </div>
      </div>

      {isPlansOpen && (
        <UpgradePlanModal
          isOpen={isPlansOpen}
          onClose={() => setIsPlansOpen(false)}
        />
      )}
    </>
  );
}
