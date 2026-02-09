/**
 * ProductModalSidebar Tests
 * Tests for ownership status display and button interactions
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductModalSidebar } from "../ProductModalSidebar";
import { MarketplaceProduct } from "../../../types";

// Mock ThemeContext
vi.mock("@/features/shared/contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: "dark" }),
}));

// Mock formatCurrency
vi.mock("@/lib/utils", () => ({
  formatCurrency: (price: number, currency: string) => `$${price} ${currency}`,
}));

const mockProduct: MarketplaceProduct = {
  id: "test-id-123",
  organization_id: "org-123",
  slug: "test-product",
  name: "Test Product",
  short_description: "A test product",
  description: "Full description",
  base_price: 99.99,
  currency: "USD",
  category_id: "cat-1",
  category_name: "Software",
  rating_avg: 4.5,
  rating_count: 10,
  thumbnail_url: "https://example.com/thumb.jpg",
  images: [],
  tags: ["test"],
  features: [],
  technical_stack: [],
  seller_name: "Test Seller",
  created_at: "2024-01-01T00:00:00Z",
};

describe("ProductModalSidebar", () => {
  describe("Not Owned State", () => {
    it("displays price when not owned", () => {
      render(<ProductModalSidebar product={mockProduct} />);

      expect(screen.getByText(/\$99\.99/)).toBeInTheDocument();
    });

    it('displays "Comprar Ahora" button when not owned', () => {
      render(<ProductModalSidebar product={mockProduct} />);

      expect(
        screen.getByRole("button", { name: /comprar ahora/i }),
      ).toBeInTheDocument();
    });

    it("calls onPurchase when purchase button is clicked", () => {
      const onPurchase = vi.fn();
      render(
        <ProductModalSidebar product={mockProduct} onPurchase={onPurchase} />,
      );

      fireEvent.click(screen.getByRole("button", { name: /comprar ahora/i }));

      expect(onPurchase).toHaveBeenCalledTimes(1);
    });

    it('does not display "ADQUIRIDO" badge when not owned', () => {
      render(<ProductModalSidebar product={mockProduct} />);

      expect(screen.queryByText("ADQUIRIDO")).not.toBeInTheDocument();
    });
  });

  describe("Owned State", () => {
    it('displays "ADQUIRIDO" badge when owned', () => {
      render(<ProductModalSidebar product={mockProduct} isOwned={true} />);

      expect(screen.getByText("ADQUIRIDO")).toBeInTheDocument();
    });

    it("displays download button when owned", () => {
      render(<ProductModalSidebar product={mockProduct} isOwned={true} />);

      expect(
        screen.getByRole("button", { name: /descargar/i }),
      ).toBeInTheDocument();
    });

    it('displays "Ver Licencia" button when owned', () => {
      render(<ProductModalSidebar product={mockProduct} isOwned={true} />);

      expect(
        screen.getByRole("button", { name: /ver licencia/i }),
      ).toBeInTheDocument();
    });

    it("does not display purchase button when owned", () => {
      render(<ProductModalSidebar product={mockProduct} isOwned={true} />);

      expect(
        screen.queryByRole("button", { name: /comprar ahora/i }),
      ).not.toBeInTheDocument();
    });

    it("does not display price when owned", () => {
      render(<ProductModalSidebar product={mockProduct} isOwned={true} />);

      expect(screen.queryByText(/\$99\.99/)).not.toBeInTheDocument();
    });

    it("calls onDownload when download button is clicked", () => {
      const onDownload = vi.fn();
      render(
        <ProductModalSidebar
          product={mockProduct}
          isOwned={true}
          onDownload={onDownload}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /descargar/i }));

      expect(onDownload).toHaveBeenCalledTimes(1);
    });

    it("calls onViewLicense when license button is clicked", () => {
      const onViewLicense = vi.fn();
      render(
        <ProductModalSidebar
          product={mockProduct}
          isOwned={true}
          onViewLicense={onViewLicense}
        />,
      );

      fireEvent.click(screen.getByRole("button", { name: /ver licencia/i }));

      expect(onViewLicense).toHaveBeenCalledTimes(1);
    });
  });

  describe("Product Info Section", () => {
    it("displays seller name", () => {
      render(<ProductModalSidebar product={mockProduct} />);

      expect(screen.getByText("Test Seller")).toBeInTheDocument();
    });

    it("displays category", () => {
      render(<ProductModalSidebar product={mockProduct} />);

      expect(screen.getByText("Software")).toBeInTheDocument();
    });

    it("displays 30-day guarantee badge", () => {
      render(<ProductModalSidebar product={mockProduct} />);

      expect(screen.getByText(/Garantía de 30 Días/i)).toBeInTheDocument();
    });
  });

  describe("Tags Section", () => {
    it("displays tags when present", () => {
      render(<ProductModalSidebar product={mockProduct} />);

      expect(screen.getByText("test")).toBeInTheDocument();
    });

    it("does not display tags section when no tags", () => {
      const productWithoutTags = { ...mockProduct, tags: [] };
      render(<ProductModalSidebar product={productWithoutTags} />);

      expect(screen.queryByText("Categorías y Tags")).not.toBeInTheDocument();
    });
  });
});
