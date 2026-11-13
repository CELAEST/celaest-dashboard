"use client";

import React, { useEffect, useRef, useState } from "react";
import { X, ShieldCheck, SpinnerGap } from "@phosphor-icons/react";
import { toast } from "sonner";
import { marketplaceApi } from "../../api/marketplace.api";

interface MercadoPagoBrickModalProps {
  isOpen: boolean;
  productId: string;
  amount: number;
  currency: string;
  couponCode?: string;
  token: string;
  orgId: string;
  onClose: () => void;
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

export const MercadoPagoBrickModal: React.FC<MercadoPagoBrickModalProps> = ({
  isOpen,
  productId,
  amount,
  currency,
  couponCode,
  token,
  orgId,
  onClose,
  onApproved,
}) => {
  const [loading, setLoading] = useState(true);
  const controllerRef = useRef<{ unmount: () => void } | null>(null);
  const publicKey = process.env.NEXT_PUBLIC_MERCADOPAGO_PUBLIC_KEY || "";

  useEffect(() => {
    if (!isOpen || !publicKey) return;
    let cancelled = false;

    loadMercadoPagoSDK()
      .then(async () => {
        if (cancelled || !window.MercadoPago) return;
        const mp = new window.MercadoPago(publicKey, { locale: "es-CO" });
        const bricksBuilder = mp.bricks();
        const controller = await bricksBuilder.create("payment", "mp-payment-brick-container", {
          initialization: {
            amount,
          },
          customization: {
            visual: {
              style: {
                theme: "dark",
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
                onClose();
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
              onClose();
            },
            onError: () => {
              toast.error("Error cargando la pasarela de pago.");
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
  }, [isOpen, publicKey, productId, amount, couponCode, token, orgId, onApproved, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-white/10 bg-[#0d0d14] p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-semibold text-white">
              Pago seguro ({currency.toUpperCase()} {amount.toLocaleString("es-CO")})
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12 text-zinc-400 gap-2">
            <SpinnerGap className="w-5 h-5 animate-spin" />
            <span className="text-sm">Cargando métodos de pago...</span>
          </div>
        )}
        <div id="mp-payment-brick-container" />
      </div>
    </div>
  );
};

