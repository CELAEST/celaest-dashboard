import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCardCompact } from "../ProductCardCompact";
import { UpcomingReleaseCard, UPCOMING_RELEASES } from "../UpcomingReleaseCard";
import type { ActiveCoupon } from "../../store";
import type { MarketplaceProduct } from "../../types";
import type { ResolvedPricingContext } from "@/features/billing/types";

const mockCouponState: { activeCoupon: ActiveCoupon | null } = { activeCoupon: null };
vi.mock("../../store", () => ({
  useMarketplaceCouponStore: () => mockCouponState,
}));

const mockGeoPricingState: {
  pricing: ResolvedPricingContext | null;
  formatPrice: (amount: number, forceCurrency?: string) => string;
} = {
  pricing: null,
  formatPrice: (amount: number) => `$${amount.toFixed(0)}`,
};

vi.mock("@/features/billing/providers/GeoPricingProvider", () => ({
  useGeoPricing: () => mockGeoPricingState,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    message: vi.fn(),
  },
}));

const baseLinguaProduct: MarketplaceProduct = {
  id: "prod-lingua-1",
  organization_id: "org-celaest",
  slug: "celaest-lingua",
  name: "CELAEST Lingua",
  short_description:
    "Aplicación web SaaS para dominio práctico de inglés profesional asistido por IA.",
  description: "Full description",
  base_price: 24,
  currency: "USD",
  category_id: "cat-edu",
  category_name: "EDUCACIÓN",
  rating_avg: 4.9,
  rating_count: 28,
  thumbnail_url: "",
  youtube_video_id: "dQw4w9WgXcQ",
  images: [],
  tags: ["A1-C1", "IPA", "Voz IA"],
  features: [
    "Currículo A1–C1: Progresión modular adaptada a tu nivel real.",
    "Voz IA en vivo: Diálogos guiados para entrevistas y reuniones.",
    "Fonética IPA: Desglose palabra por palabra con referencia estándar.",
  ],
  technical_stack: ["NIVELES", "MALLA IA", "SONIDO"],
  seller_name: "CELAEST",
  version: "1.4.0",
  min_plan_tier: 1,
  product_type: "saas",
  external_url: "https://lingua.celaest.com",
  created_at: "2026-01-01T00:00:00Z",
};

describe("ProductCardCompact (Preset 04 · Studio 3D)", () => {
  beforeEach(() => {
    mockCouponState.activeCoupon = null;
    mockGeoPricingState.pricing = null;
    mockGeoPricingState.formatPrice = (amount: number) => `$${amount.toFixed(0)}`;
  });

  it("renders SaaS En Plan state with Abrir App CTA, rating, focal price, and interactive capability rows", () => {
    const onSelect = vi.fn();
    const onViewDetails = vi.fn();

    render(
      <ProductCardCompact
        product={baseLinguaProduct}
        accessLevel="plan"
        onSelect={onSelect}
        onViewDetails={onViewDetails}
      />,
    );

    expect(screen.getByText("CELAEST Lingua")).toBeInTheDocument();
    expect(screen.getByText("$24")).toBeInTheDocument();
    expect(screen.getByText("USD / mes")).toBeInTheDocument();
    expect(screen.getByText("4.9")).toBeInTheDocument();
    expect(screen.getByText("EN PLAN")).toBeInTheDocument();
    expect(screen.getByText("Incluido · Starter+")).toBeInTheDocument();

    // Respects Subtle Violet fallback for Lingua when backend thumbnail_url is empty
    const img = screen.getByAltText("CELAEST Lingua") as HTMLImageElement;
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(
      "/images/marketplace/studio-lingua-violet.webp",
    );

    // Step 01 detail visible initially; clicking Step 02 reveals Step 02 detail
    expect(screen.getByText("Progresión modular adaptada a tu nivel real.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Voz IA en vivo/i }));
    expect(
      screen.getByText("Diálogos guiados para entrevistas y reuniones."),
    ).toBeInTheDocument();

    // Abrir App active & Demo trigger calls onViewDetails cleanly
    fireEvent.click(screen.getByRole("button", { name: /Abrir App/i }));
    expect(onSelect).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /Demo/i }));
    expect(onViewDetails).toHaveBeenCalledTimes(1);
  });

  it("preserves backend thumbnail_url when present and avoids mid-word stack truncation", () => {
    render(
      <ProductCardCompact
        product={{
          ...baseLinguaProduct,
          thumbnail_url: "https://cdn.celaest.com/custom-lingua-v2.webp",
          features: [
            "Ruta estructurada Pathway A1 a C1",
            "Conversación con IA en tiempo real",
            "Lectura interactiva y fonética IPA",
          ],
          technical_stack: ["Aplicación Web", "Motor de Voz IA", "CELAEST IA Mesh"],
        }}
        accessLevel="none"
        onSelect={vi.fn()}
      />,
    );

    const img = screen.getByAltText("CELAEST Lingua") as HTMLImageElement;
    expect(decodeURIComponent(img.getAttribute("src") ?? "")).toContain(
      "https://cdn.celaest.com/custom-lingua-v2.webp",
    );
    expect(screen.queryByText("MOTOR DE V")).not.toBeInTheDocument();
    expect(screen.getByText("MOTOR VOZ IA")).toBeInTheDocument();
    expect(
      screen.getByText("Ruta estructurada Pathway A1 a C1 · Aplicación Web"),
    ).toBeInTheDocument();
  });

  it("handles public acquire, coupon discount, free WELCOME redemption, geo pricing, perpetual owned & RBAC blocked", () => {
    const { rerender } = render(
      <ProductCardCompact
        product={baseLinguaProduct}
        accessLevel="none"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Adquirir/i })).toBeEnabled();
    expect(screen.getByText("DISPONIBLE")).toBeInTheDocument();

    // -25% percentage coupon
    mockCouponState.activeCoupon = { code: "SAVE25", type: "percentage", value: 25 };
    rerender(
      <ProductCardCompact
        product={baseLinguaProduct}
        accessLevel="none"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("$18")).toBeInTheDocument();
    expect(screen.getByText("-25%")).toBeInTheDocument();

    // 100% free coupon
    mockCouponState.activeCoupon = { code: "WELCOME", type: "percentage", value: 100 };
    rerender(
      <ProductCardCompact
        product={baseLinguaProduct}
        accessLevel="none"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("Gratis")).toBeInTheDocument();

    // Geo-pricing (CO COP) without coupons
    mockCouponState.activeCoupon = null;
    mockGeoPricingState.pricing = {
      country_code: "CO",
      country_name: "Colombia",
      currency: { code: "COP", symbol: "$", decimals: 0, is_zero_decimal: true },
      exchange_rate: 4100,
      ppp_multiplier: 1,
      pricing_tier: "latam",
    };
    mockGeoPricingState.formatPrice = (amt: number) =>
      `COP ${Math.round(amt).toLocaleString("en-US")}`;
    rerender(
      <ProductCardCompact
        product={baseLinguaProduct}
        accessLevel="none"
        onSelect={vi.fn()}
      />,
    );
    expect(screen.getByText("COP 98,400")).toBeInTheDocument();
    expect(screen.getByText("/ mes")).toBeInTheDocument();

    // Reset geo for perpetual non-SaaS owned state (disabled CTA, details remain active)
    mockGeoPricingState.pricing = null;
    const downloadProduct: MarketplaceProduct = {
      ...baseLinguaProduct,
      slug: "desktop-cli",
      name: "CELAEST CLI Pro",
      product_type: "download",
      external_url: undefined,
      base_price: 49,
      rating_avg: 0,
      rating_count: 0,
      youtube_video_id: undefined,
    };
    rerender(
      <ProductCardCompact
        product={downloadProduct}
        accessLevel="owned"
        onSelect={vi.fn()}
        onViewDetails={vi.fn()}
      />,
    );
    expect(screen.getByText("USD · PAGO ÚNICO")).toBeInTheDocument();
    expect(screen.getByText("Sin reseñas aún")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "ADQUIRIDO" })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Ver Detalles/i })).toBeEnabled();

    // RBAC blocked (member role)
    rerender(
      <ProductCardCompact
        product={baseLinguaProduct}
        accessLevel="none"
        disabledReason="Solo Propietarios"
        onSelect={vi.fn()}
        onViewDetails={vi.fn()}
      />,
    );
    expect(screen.getByRole("button", { name: /Solo Propietarios/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /Ver Detalles/i })).toBeEnabled();
  });
});

describe("UpcomingReleaseCard (Empleo & Órdenes)", () => {
  it("renders Employment & Orders studio roadmap cards and supports interactive steps and reminder toggle", () => {
    render(
      <>
        {UPCOMING_RELEASES.map((item) => (
          <UpcomingReleaseCard key={item.id} item={item} />
        ))}
      </>,
    );

    expect(screen.getByText("Automatización de Empleo")).toBeInTheDocument();
    expect(screen.getByText("Automatización de Órdenes")).toBeInTheDocument();

    const empleoImg = screen.getByAltText(/Carpeta ejecutiva/i) as HTMLImageElement;
    expect(decodeURIComponent(empleoImg.getAttribute("src") ?? "")).toContain(
      "/images/marketplace/upcoming-empleo-violet.webp",
    );

    const ordenesImg = screen.getByAltText(/Cajas de despacho negro mate/i) as HTMLImageElement;
    expect(decodeURIComponent(ordenesImg.getAttribute("src") ?? "")).toContain(
      "/images/marketplace/upcoming-ordenes-violet.webp",
    );

    // Step cycling on first card
    const stepButtons = screen.getAllByRole("button", { name: /Paso 02/i });
    fireEvent.click(stepButtons[0]);
    expect(
      screen.getByText(/Reordena logros de tu trayectoria real/i),
    ).toBeInTheDocument();

    // Notify toggle on first card
    const notifyButtons = screen.getAllByRole("button", { name: /Avisarme/i });
    fireEvent.click(notifyButtons[0]);
    expect(screen.getByRole("button", { name: /Aviso activo/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});
