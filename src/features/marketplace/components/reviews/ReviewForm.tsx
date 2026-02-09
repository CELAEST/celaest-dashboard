/**
 * ReviewForm - Formulario para enviar reviews
 * Responsabilidad única: capturar y enviar reviews (requiere auth)
 */
"use client";

import React, { useState } from "react";
import { Star, Send, LogIn } from "lucide-react";
import { useReviews } from "../../hooks/useReviews";

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSuccess,
}) => {
  const {
    isAuthenticated,
    submitting,
    success,
    error,
    submitReview,
    resetState,
  } = useReviews();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return;

    const submitted = await submitReview(productId, rating, comment);
    if (submitted) {
      setRating(0);
      setComment("");
      onSuccess?.();
    }
  };

  // Reset success state after showing
  React.useEffect(() => {
    if (success) {
      const timer = setTimeout(resetState, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, resetState]);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
        <div>
          <p className="font-medium text-white">¿Ya tienes este producto?</p>
          <p className="text-sm text-white/50">
            Inicia sesión para dejar una reseña
          </p>
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500">
          <LogIn className="h-4 w-4" />
          Iniciar sesión
        </button>
      </div>
    );
  }

  if (success) {
    return (
      <div className="flex items-center justify-center rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-6">
        <p className="font-medium text-emerald-400">
          ¡Gracias por tu reseña! ✨
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-white/10 bg-white/5 p-4"
    >
      <h4 className="mb-4 font-medium text-white">Escribir una reseña</h4>

      {/* Rating Selection */}
      <div className="mb-4">
        <label className="mb-2 block text-sm text-white/60">
          Tu calificación
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
              className="p-1 transition-transform hover:scale-110"
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= (hoverRating || rating)
                    ? "fill-amber-400 text-amber-400"
                    : "fill-white/10 text-white/20"
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Comment */}
      <div className="mb-4">
        <label className="mb-2 block text-sm text-white/60">
          Tu comentario (opcional)
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Cuéntanos tu experiencia con este producto..."
          rows={3}
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-blue-500/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
        />
      </div>

      {/* Error */}
      {error && <p className="mb-4 text-sm text-red-400">{error}</p>}

      {/* Submit */}
      <button
        type="submit"
        disabled={rating === 0 || submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {submitting ? (
          <>
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Enviando...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Enviar reseña
          </>
        )}
      </button>
    </form>
  );
};
