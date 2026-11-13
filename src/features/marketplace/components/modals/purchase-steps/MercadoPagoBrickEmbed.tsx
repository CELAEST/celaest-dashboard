"use client";

import React, { useEffect, useRef, useState } from "react";
import { SpinnerGap, ArrowLeft } from "@phosphor-icons/react";
import { toast } from "sonner";
import { marketplaceApi } from "../../../api/marketplace.api";

interface MercadoPagoBrickEmbedProps {
  productId: string;
  amount: number;
  currency: string;
  couponCode?: string;
  token: string;
  orgId: string;
  onBack: () => void;
  onApproved: () => void;
}

declare global {
  interface Window {
    MercadoPago?: new (publicKey: string, options?: { locale?: string }) => {
      bricks: () => {
        create: (
          brick: string,
          containerId: string,
          settings: Record<string, unknown>
        ) => Promise<{ unmount: () => void }>;
      };
    };
  }
}

function loadMercadoPagoSDK(): Promise<void> {
  if (typeof window === "undefined") return Promise.reject();
  if (window.MercadoPago) return Promise.resolve();
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      'script[src="https://sdk.mercadopago.com/js/v2"]'
    );
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("MP SDK load error")));
      return;
    }
    const script = document.createElement("script");
    script.src = "https://sdk.mercadopago.com/js/v2";
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("MP SDK load error"));
    document.head.appendChild(script);
  });
}

export const MercadoPagoBrickEmbed: React.FC<MercadoPagoBrickEmbedProps> = ({
  productId,
  amount,
  currency,
  couponCode,
  token,
  orgId,
  onBack,
  onApproved,
}) => {
  const [loading, setLoading] = useState(true);
  const controllerRef = useRef<{ unmount: () => void } | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "";
  const isBelowMinimum = currency.toUpperCase() === "COP" && amount < 1000;

  useEffect(() => {
    if (!publicKey || isBelowMinimum) return;
    let cancelled = false;

    loadMercadoPagoSDK()
      .then(async () => {
        if (cancelled || !window.MercadoPago) return;
        const mp = new window.MercadoPago(publicKey, { locale: "es-CO" });
        const bricksBuilder = mp.bricks();
        const controller = await bricksBuilder.create("payment", "mp-payment-brick-container", {
          initialization: { amount },
          customization: {
            visual: {
              hideFormTitle: true,
              style: {
                theme: "dark",
                customVariables: {
                  formBackgroundColor: "transparent",
                  baseColor: "#ffffff",
                  baseColorFirstVariant: "#e4e4e7",
                  baseColorSecondVariant: "#a1a1aa",
                  textPrimaryColor: "#f8fafc",
                  textSecondaryColor: "#94a3b8",
                  inputBackgroundColor: "#0c0c14",
                  inputFocusedBackgroundColor: "#11111c",
                  inputBorderColor: "rgba(255, 255, 255, 0.12)",
                  inputFocusedBorderColor: "rgba(255, 255, 255, 0.4)",
                  buttonTextColor: "#09090b",
                  borderRadiusSmall: "8px",
                  borderRadiusMedium: "12px",
                  borderRadiusLarge: "16px",
                  formPadding: "0px",
                },
              },
            },
            paymentMethods: {
              creditCard: "all",
              debitCard: "all",
              bankTransfer: "all",
              ticket: "all",
            },
          },
          callbacks: {
            onReady: () => {
              if (!cancelled) setLoading(false);
            },
            onSubmit: async ({ formData }: { formData: Record<string, unknown> }) => {
              const payer = (formData.payer || {}) as {
                email?: string;
                identification?: { type?: string; number?: string };
              };
              const res = await marketplaceApi.processMercadoPagoBrick(
                {
                  product_id: productId,
                  coupon_code: couponCode,
                  token: formData.token as string | undefined,
                  payment_method_id: String(formData.payment_method_id || ""),
                  issuer_id: formData.issuer_id ? String(formData.issuer_id) : undefined,
                  installments: formData.installments ? Number(formData.installments) : undefined,
                  payer: {
                    email: payer.email || "",
                    identification: payer.identification?.number
                      ? {
                          type: payer.identification.type || "CC",
                          number: payer.identification.number,
                        }
                      : undefined,
                  },
                },
                token,
                orgId
              );

              if (res.status === "approved" && res.access) {
                toast.success("¡Pago aprobado! Tu licencia ya está activa.");
                onApproved();
                return;
              }
              if (res.redirect_url) {
                window.location.href = res.redirect_url;
                return;
              }
              if (res.status === "rejected") {
                toast.error(`Pago rechazado (${res.status_detail || "intenta con otro medio"})`);
                return;
              }
              toast.info("Pago pendiente de confirmación. Te notificaremos en segundos.");
              onBack();
            },
            onError: (err: unknown) => {
              console.error("MercadoPago Brick error:", err);
              toast.error("No se pudo cargar el formulario de pago.");
              setLoading(false);
            },
          },
        });
        if (cancelled) {
          controller.unmount();
        } else {
          controllerRef.current = controller;
        }
      })
      .catch(() => {
        if (!cancelled) {
          toast.error("No se pudo inicializar Mercado Pago.");
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
      controllerRef.current?.unmount();
      controllerRef.current = null;
    };
  }, [publicKey, isBelowMinimum, productId, amount, couponCode, token, orgId, onApproved, onBack]);

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
        <div>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 block">
            Pago Seguro · Mercado Pago
          </span>
          <span className="text-lg font-bold font-mono text-white">
            {currency.toUpperCase()} {amount.toLocaleString("es-CO")}
          </span>
        </div>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-white/60 hover:text-white transition-colors"
        >
          <ArrowLeft size={14} />
          Volver
        </button>
      </div>

      {isBelowMinimum ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
          El monto mínimo para pagar con Mercado Pago en Colombia es <strong>$1,000 COP</strong> (monto actual: ${amount.toLocaleString("es-CO")} COP).
        </div>
      ) : (
        <>
          {loading && (
            <div className="flex items-center justify-center py-10 text-white/50 gap-2">
              <SpinnerGap size={18} className="animate-spin" />
              <span className="text-xs font-mono">Cargando métodos de pago (PSE, Nequi, Tarjeta)...</span>
            </div>
          )}
          <div id="mp-payment-brick-container" />
        </>
      )}
    </div>
  );
};

