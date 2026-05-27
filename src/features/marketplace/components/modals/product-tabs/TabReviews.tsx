/**
 * TabReviews
 *
 * Tab "Reseñas" del modal de detalle de producto.
 * Combina:
 *   - ReviewForm (auth CTA, escribir nueva, o editar/borrar la propia)
 *   - ReviewList paginada (server-driven con useProductReviews)
 *
 * El hook de "mis reseña" se invalida tras submit/update/delete, lo que
 * dispara la re-renderización del form al cambiar entre create ↔ edit.
 */
import React from "react";
import { ReviewForm } from "../../reviews/ReviewForm";
import { ReviewList } from "../../reviews/ReviewList";
import { useProductReviews } from "../../../hooks/useProductReviews";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface TabReviewsProps {
  productId: string;
}

export const TabReviews: React.FC<TabReviewsProps> = React.memo(
  ({ productId }) => {
    const t = useTranslations("marketplace");
    const { theme } = useTheme();
    const isDark = theme === "dark";

    const {
      reviews,
      total,
      loading,
      fetchingMore,
      hasMore,
      loadMore,
    } = useProductReviews(productId);

    return (
      <div className="space-y-6">
        <ReviewForm productId={productId} />

        <div
          className={`h-px ${isDark ? "bg-white/5" : "bg-gray-100"}`}
          aria-hidden
        />

        <div>
          <h4
            className={`mb-3 text-sm font-medium ${
              isDark ? "text-white/70" : "text-gray-700"
            }`}
          >
            {t("reviews")} {total > 0 && `(${total})`}
          </h4>
          <ReviewList
            reviews={reviews}
            loading={loading}
            hasMore={hasMore}
            loadingMore={fetchingMore}
            onLoadMore={loadMore}
          />
        </div>
      </div>
    );
  },
);

TabReviews.displayName = "TabReviews";
