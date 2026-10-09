/**
 * ReviewList
 *
 * Lista de reseñas con estados vacío / loading / paginación.
 *
 * - Loading inicial: tres skeletons animados.
 * - Vacío: panel "be first to review" centrado.
 * - Con datos: tarjetas + opcional botón "Cargar más" si el caller proporciona
 *   `onLoadMore` y `hasMore`.
 */
"use client";

import React from "react";
import { Review } from "../../types";
import { ReviewCard } from "./ReviewCard";
import { Chat } from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
}

export const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
}) => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={`h-24 animate-pulse rounded-xl border ${
              isDark
                ? "border-white/10 bg-white/5"
                : "border-gray-200 bg-gray-100"
            }`}
            aria-hidden
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-2xl border border-dashed py-12 text-center ${
          isDark
            ? "border-white/[0.08] bg-[#0D0D11]"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <div
          className={`mb-3 flex h-11 w-11 items-center justify-center rounded-xl ${
            isDark
              ? "bg-[#141418] border border-white/[0.08] text-white/50"
              : "bg-blue-50 text-blue-500"
          }`}
        >
          <Chat className="h-5 w-5" />
        </div>
        <h4
          className={`font-medium ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          {t("no_reviews_yet_title")}
        </h4>
        <p
          className={`mt-1 text-sm ${
            isDark ? "text-white/50" : "text-gray-500"
          }`}
        >
          {t("be_first_to_review")}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}

      {hasMore && onLoadMore && (
        <div className="flex justify-center pt-2">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loadingMore}
            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            } disabled:opacity-50`}
          >
            {loadingMore ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                {t("loading_reviews")}
              </>
            ) : (
              t("load_more_reviews")
            )}
          </button>
        </div>
      )}
    </div>
  );
};
