/**
 * ReviewForm
 *
 * Single component that handles the three review states the customer can be in
 * for a given product:
 *
 *   1. No review yet         → blank form, "Submit review".
 *   2. Has an existing review → editable form pre-filled, "Save changes" +
 *      "Delete review" (with a confirm step).
 *   3. Not authenticated     → sign-in CTA explaining what they would gain.
 *
 * The form is the source of truth for character count + 1-5 rating validation;
 * the network call delegates to useReviews / useUpdateReview / useDeleteReview
 * which already take care of cache invalidation and toasts.
 */
"use client";

import React, { useState } from "react";
import {
  PaperPlaneTilt,
  SignIn,
  PencilSimple,
  Trash,
  Star,
  X,
} from "@phosphor-icons/react";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useTranslations } from "next-intl";
import {
  useReviews,
  useUpdateReview,
  useDeleteReview,
} from "../../hooks/useReviews";
import { useMyProductReview } from "../../hooks/useMyProductReview";
import { useAuthPrompt } from "../../context/AuthPromptContext";
import { StarRatingInput } from "./StarRatingInput";
import type { Review } from "../../types";

const MAX_COMMENT = 2000;

interface ReviewFormProps {
  productId: string;
  onSuccess?: () => void;
}

/**
 * Top-level shell: decides between auth-CTA, loading skeleton or the actual
 * form. The form is remounted (via `key`) whenever the user transitions
 * between "no review yet" and an existing review, so the inner component can
 * initialise its state from props in a single pass — no setState-in-useEffect.
 */
export const ReviewForm: React.FC<ReviewFormProps> = ({
  productId,
  onSuccess,
}) => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { review: existing, loading: loadingMine, isAuthenticated } =
    useMyProductReview(productId);
  const { requestLogin } = useAuthPrompt();

  // Cuando hay reseña existente, arrancamos colapsados (summary) y el usuario
  // expande el form sólo al pulsar "Editar". Cuando NO hay reseña, el form se
  // muestra de entrada porque escribir es la acción primaria.
  const [isExpanded, setIsExpanded] = useState<boolean>(false);

  if (!isAuthenticated) {
    return (
      <div
        className={`flex items-center justify-between rounded-xl border p-4 ${
          isDark
            ? "border-white/10 bg-white/5"
            : "border-gray-200 bg-gray-50"
        }`}
      >
        <div>
          <p
            className={`font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("sign_in_to_review")}
          </p>
          <p
            className={`text-sm ${
              isDark ? "text-white/50" : "text-gray-500"
            }`}
          >
            {t("login_to_leave_review")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => requestLogin({ productId, tab: "reviews" })}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-all hover:bg-blue-500"
        >
          <SignIn className="h-4 w-4" />
          {t("login")}
        </button>
      </div>
    );
  }

  if (loadingMine) {
    return (
      <div
        className={`h-20 animate-pulse rounded-xl border ${
          isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
        }`}
        aria-hidden
      />
    );
  }

  // Caso 1 — reseña existente + form colapsado: mostramos el resumen compacto
  // con CTA "Editar reseña". Es la vista por defecto post-publicación.
  if (existing && !isExpanded) {
    return (
      <ReviewSummary
        review={existing}
        productId={productId}
        isDark={isDark}
        onEdit={() => setIsExpanded(true)}
      />
    );
  }

  // Caso 2 — sin reseña, o el usuario optó por editar la propia.
  return (
    <ReviewFormInner
      key={existing?.id ?? "new"}
      productId={productId}
      existing={existing}
      onSuccess={() => {
        // Tras un guardado exitoso volvemos al summary para mantener el modal
        // compacto. El parent también puede reaccionar (cerrar modal, etc).
        setIsExpanded(false);
        onSuccess?.();
      }}
      onCancel={existing ? () => setIsExpanded(false) : undefined}
    />
  );
};

// ────────────────────────────────────────────────────────────────────
// Summary compacto (cliente con reseña ya publicada)
// ────────────────────────────────────────────────────────────────────

interface ReviewSummaryProps {
  review: Review;
  productId: string;
  isDark: boolean;
  onEdit: () => void;
}

const ReviewSummary: React.FC<ReviewSummaryProps> = ({
  review,
  productId,
  isDark,
  onEdit,
}) => {
  const t = useTranslations("marketplace");
  const { deleting, deleteReview } = useDeleteReview(productId);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteReview(review.id);
      setConfirmingDelete(false);
    } catch {
      /* toast already shown by the hook */
    }
  };

  if (confirmingDelete) {
    return (
      <div
        className={`rounded-xl border p-4 ${
          isDark
            ? "border-red-500/30 bg-red-500/10"
            : "border-red-200 bg-red-50"
        }`}
        role="alertdialog"
        aria-live="polite"
      >
        <p
          className={`mb-3 text-sm ${
            isDark ? "text-red-200" : "text-red-700"
          }`}
        >
          {t("delete_review_confirm")}
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
          >
            {deleting ? t("deleting") : t("delete_review_confirm_action")}
          </button>
          <button
            type="button"
            onClick={() => setConfirmingDelete(false)}
            disabled={deleting}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              isDark
                ? "bg-white/5 text-white hover:bg-white/10"
                : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
            }`}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
        isDark
          ? "border-white/10 bg-white/[0.04]"
          : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
            isDark
              ? "bg-blue-500/15 text-blue-300"
              : "bg-blue-50 text-blue-600"
          }`}
          aria-hidden
        >
          <PencilSimple className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div
            className={`text-sm font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {t("your_review")}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  weight={i < review.rating ? "fill" : "regular"}
                  className={`h-3 w-3 ${
                    i < review.rating
                      ? "text-amber-400"
                      : isDark
                        ? "text-white/20"
                        : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            {review.comment && (
              <span
                className={`truncate text-xs ${
                  isDark ? "text-white/50" : "text-gray-500"
                }`}
                title={review.comment}
              >
                · {review.comment}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1.5">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-blue-500"
        >
          <PencilSimple className="h-3.5 w-3.5" />
          {t("edit_review")}
        </button>
        <button
          type="button"
          aria-label={t("delete_review")}
          title={t("delete_review")}
          onClick={() => setConfirmingDelete(true)}
          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-colors ${
            isDark
              ? "text-red-300 hover:bg-red-500/10"
              : "text-red-600 hover:bg-red-50"
          }`}
        >
          <Trash className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
};

interface ReviewFormInnerProps {
  productId: string;
  existing: Review | null;
  onSuccess?: () => void;
  /**
   * Si lo provee el padre, se renderiza un botón "Cancelar" para volver al
   * summary colapsado. Sólo aplica en el flujo de edición.
   */
  onCancel?: () => void;
}

/**
 * Inner controlled form. Mounted with the right initial state for the current
 * scenario (create / edit) and disposed when the scenario changes.
 */
const ReviewFormInner: React.FC<ReviewFormInnerProps> = ({
  productId,
  existing,
  onSuccess,
  onCancel,
}) => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const { submitting, submitReview } = useReviews();
  const { updating, updateReview } = useUpdateReview(productId);
  const { deleting, deleteReview } = useDeleteReview(productId);

  const [rating, setRating] = useState<number>(existing?.rating ?? 0);
  const [comment, setComment] = useState<string>(existing?.comment ?? "");
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const isEditing = !!existing;
  const isBusy = submitting || updating || deleting;
  const remaining = MAX_COMMENT - comment.length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);
    if (rating < 1 || rating > 5) {
      setLocalError(t("rating_required"));
      return;
    }
    try {
      if (isEditing) {
        await updateReview(existing!.id, rating, comment);
      } else {
        await submitReview(productId, rating, comment);
        setRating(0);
        setComment("");
      }
      onSuccess?.();
    } catch {
      /* toast already shown by the hook */
    }
  };

  const handleDelete = async () => {
    if (!existing) return;
    try {
      await deleteReview(existing.id);
      setConfirmingDelete(false);
      setRating(0);
      setComment("");
      onSuccess?.();
    } catch {
      /* toast already shown */
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`rounded-xl border p-4 ${
        isDark ? "border-white/10 bg-white/5" : "border-gray-200 bg-gray-50"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h4
            className={`font-medium ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            {isEditing ? t("your_review") : t("write_a_review")}
          </h4>
          {isEditing && (
            <span
              className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                isDark
                  ? "bg-blue-500/15 text-blue-300"
                  : "bg-blue-50 text-blue-700"
              }`}
            >
              <PencilSimple className="h-3 w-3" />
              {t("edit_review")}
            </span>
          )}
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isBusy}
            aria-label={t("cancel")}
            title={t("cancel")}
            className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
              isDark
                ? "text-white/60 hover:bg-white/5 hover:text-white"
                : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <label
          className={`mb-2 block text-sm ${
            isDark ? "text-white/60" : "text-gray-600"
          }`}
        >
          {t("your_rating")}
        </label>
        <StarRatingInput
          value={rating}
          onChange={setRating}
          disabled={isBusy}
        />
      </div>

      <div className="mb-2">
        <label
          className={`mb-2 block text-sm ${
            isDark ? "text-white/60" : "text-gray-600"
          }`}
        >
          {t("your_comment_optional")}
        </label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
          placeholder={t("tell_us_experience_placeholder")}
          rows={4}
          disabled={isBusy}
          className={`w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-1 disabled:cursor-not-allowed disabled:opacity-50 ${
            isDark
              ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/50"
              : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
          }`}
        />
        <div
          className={`mt-1 text-right text-xs ${
            remaining < 200 ? "text-amber-500" : isDark ? "text-white/40" : "text-gray-400"
          }`}
        >
          {t("chars_remaining", { remaining: comment.length })}
        </div>
      </div>

      {localError && (
        <p className="mb-3 text-sm text-red-400">{localError}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <button
          type="submit"
          disabled={rating === 0 || isBusy}
          className="flex flex-1 min-w-[160px] items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-all hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting || updating ? (
            <>
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              {isEditing ? t("saving") : t("sending")}
            </>
          ) : (
            <>
              <PaperPlaneTilt className="h-4 w-4" />
              {isEditing ? t("save_changes") : t("submit_review")}
            </>
          )}
        </button>

        {isEditing && !confirmingDelete && (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            disabled={isBusy}
            className={`flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              isDark
                ? "bg-white/5 text-red-300 hover:bg-red-500/10 hover:text-red-200"
                : "bg-white text-red-600 ring-1 ring-gray-200 hover:bg-red-50"
            }`}
          >
            <Trash className="h-4 w-4" />
            {t("delete_review")}
          </button>
        )}
      </div>

      {isEditing && confirmingDelete && (
        <div
          className={`mt-4 rounded-lg border p-3 ${
            isDark
              ? "border-red-500/30 bg-red-500/10"
              : "border-red-200 bg-red-50"
          }`}
          role="alertdialog"
          aria-live="polite"
        >
          <p
            className={`mb-3 text-sm ${
              isDark ? "text-red-200" : "text-red-700"
            }`}
          >
            {t("delete_review_confirm")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
            >
              {deleting ? t("deleting") : t("delete_review_confirm_action")}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isDark
                  ? "bg-white/5 text-white hover:bg-white/10"
                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}
    </form>
  );
};
