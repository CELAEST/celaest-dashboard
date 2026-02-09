/**
 * ReviewList - Componente para mostrar lista de reviews
 * Responsabilidad única: renderizar lista con estados vacío/loading
 */
"use client";

import React from "react";
import { Review } from "../../types";
import { ReviewCard } from "./ReviewCard";
import { MessageSquare } from "lucide-react";

interface ReviewListProps {
  reviews: Review[];
  loading?: boolean;
}

export const ReviewList: React.FC<ReviewListProps> = ({ reviews, loading }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-24 animate-pulse rounded-xl border border-white/10 bg-white/5"
          />
        ))}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/5 py-12 text-center">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-500/10 text-blue-400">
          <MessageSquare className="h-6 w-6" />
        </div>
        <h4 className="font-medium text-white">Sin reseñas aún</h4>
        <p className="mt-1 text-sm text-white/50">
          Sé el primero en dejar una reseña
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <ReviewCard key={review.id} review={review} />
      ))}
    </div>
  );
};
