"use client";

import React from "react";
import { ProductCard } from "./ProductCard";
import { MarketplaceProduct } from "../types";
import { AnimatePresence } from "framer-motion";
import { ShoppingBag } from "lucide-react";

interface ProductGridProps {
  products: MarketplaceProduct[];
  loading?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  loading,
}) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="h-80 w-full animate-pulse rounded-2xl bg-white/5 border border-white/10"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="flex h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 bg-white/5 p-12 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
          <ShoppingBag className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-semibold text-white">
          No se encontraron productos
        </h3>
        <p className="mt-2 text-sm text-white/50">
          Prueba ajustando tus filtros de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <AnimatePresence mode="popLayout">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </AnimatePresence>
    </div>
  );
};
