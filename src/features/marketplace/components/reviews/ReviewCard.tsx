/**
 * ReviewCard
 *
 * Visualiza una reseña individual con soporte light/dark, badge i18n de
 * "compra verificada" y fecha relativa localizada (es / en).
 *
 * Acciones avanzadas (editar / eliminar cualquier reseña) sólo se renderizan
 * cuando el usuario actual tiene rol `super_admin`. El gating lo aplica el
 * frontend para evitar mostrar botones inertes; el backend ya enforce el rol
 * a nivel de ruta (`/admin/marketplace/reviews/*` exige super_admin).
 */
"use client";

import React, { useState } from "react";
import { Review } from "../../types";
import { Star, CheckCircle, PencilSimple, Trash } from "@phosphor-icons/react";
import { formatDistanceToNow } from "date-fns";
import { es, enUS } from "date-fns/locale";
import { useTheme } from "@/features/shared/hooks/useTheme";
import { useLocale, useTranslations } from "next-intl";
import { useRole } from "@/features/auth/hooks/useAuthorization";
import {
  useAdminUpdateReview,
  useAdminDeleteReview,
} from "../../hooks/useAdminReviews";
import { StarRatingInput } from "./StarRatingInput";

const MAX_COMMENT = 2000;

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const locale = useLocale();
  const t = useTranslations("marketplace");
  const { isSuperAdmin } = useRole();

  const [editing, setEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const updateMutation = useAdminUpdateReview();
  const deleteMutation = useAdminDeleteReview();
  const saving =
    updateMutation.isPending &&
    updateMutation.variables?.reviewId === review.id;
  const deleting =
    deleteMutation.isPending && deleteMutation.variables === review.id;

  const formatDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: locale === "en" ? enUS : es,
      });
    } catch {
      return dateString;
    }
  };

  const initial = review.user_name?.charAt(0).toUpperCase() || "?";

  const handleSave = (payload: { rating: number; comment: string }) => {
    updateMutation.mutate(
      { reviewId: review.id, input: payload },
      { onSuccess: () => setEditing(false) },
    );
  };

  const handleDelete = () => {
    deleteMutation.mutate(review.id, {
      onSuccess: () => setConfirmingDelete(false),
    });
  };

  return (
    <div
      className={`rounded-xl border p-4 backdrop-blur-sm transition-colors ${
        isDark
          ? "border-white/10 bg-white/5 hover:border-white/20"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-sm font-bold text-white">
            {initial}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`font-medium ${
                  isDark ? "text-white" : "text-gray-900"
                }`}
              >
                {review.user_name}
              </span>
              {review.is_verified_purchase && (
                <span className="flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-500 dark:text-emerald-400">
                  <CheckCircle className="h-3 w-3" weight="fill" />
                  {t("verified_purchase")}
                </span>
              )}
            </div>
            <span
              className={`text-xs ${
                isDark ? "text-white/40" : "text-gray-400"
              }`}
            >
              {formatDate(review.created_at)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                weight={i < review.rating ? "fill" : "regular"}
                className={`h-4 w-4 ${
                  i < review.rating
                    ? "text-amber-400"
                    : isDark
                      ? "text-white/15"
                      : "text-gray-300"
                }`}
              />
            ))}
          </div>

          {isSuperAdmin && !editing && !confirmingDelete && (
            <>
              <span
                aria-hidden
                className={`h-5 w-px ${
                  isDark ? "bg-white/10" : "bg-gray-200"
                }`}
              />
              <div
                className={`flex items-center gap-1 rounded-lg p-0.5 ring-1 ${
                  isDark
                    ? "bg-white/[0.03] ring-white/10"
                    : "bg-gray-50 ring-gray-200"
                }`}
                title={t("super_admin_actions")}
              >
                <button
                  type="button"
                  aria-label={t("action_edit_content")}
                  title={t("action_edit_content")}
                  onClick={() => setEditing(true)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                    isDark
                      ? "text-indigo-300 hover:bg-indigo-500/20"
                      : "text-indigo-600 hover:bg-indigo-100"
                  }`}
                >
                  <PencilSimple className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  aria-label={t("action_delete_permanent")}
                  title={t("action_delete_permanent")}
                  onClick={() => setConfirmingDelete(true)}
                  className={`flex h-7 w-7 items-center justify-center rounded-md transition-colors ${
                    isDark
                      ? "text-red-300 hover:bg-red-500/20"
                      : "text-red-600 hover:bg-red-100"
                  }`}
                >
                  <Trash className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {editing ? (
        <SuperAdminEditPanel
          review={review}
          isDark={isDark}
          saving={saving}
          onCancel={() => setEditing(false)}
          onSave={handleSave}
        />
      ) : confirmingDelete ? (
        <div
          className={`rounded-lg border p-3 ${
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
            {t("action_delete_permanent_confirm")}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="flex-1 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
            >
              {deleting
                ? t("deleting")
                : t("delete_review_confirm_action")}
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
              className={`flex-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isDark
                  ? "bg-white/5 text-white hover:bg-white/10"
                  : "bg-white text-gray-700 ring-1 ring-gray-200 hover:bg-gray-50"
              }`}
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      ) : (
        review.comment && (
          <p
            className={`text-sm leading-relaxed ${
              isDark ? "text-white/70" : "text-gray-700"
            }`}
          >
            {review.comment}
          </p>
        )
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────
// Edit panel (super_admin only)
// ────────────────────────────────────────────────────────────────────

interface SuperAdminEditPanelProps {
  review: Review;
  isDark: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: (payload: { rating: number; comment: string }) => void;
}

const SuperAdminEditPanel: React.FC<SuperAdminEditPanelProps> = ({
  review,
  isDark,
  saving,
  onCancel,
  onSave,
}) => {
  const t = useTranslations("marketplace");
  const [rating, setRating] = useState<number>(review.rating);
  const [comment, setComment] = useState<string>(review.comment ?? "");

  const dirty = rating !== review.rating || comment !== (review.comment ?? "");
  const canSave = dirty && rating >= 1 && rating <= 5 && !saving;

  return (
    <div
      className={`rounded-lg border p-3 ${
        isDark
          ? "border-indigo-500/30 bg-indigo-500/10"
          : "border-indigo-200 bg-indigo-50"
      }`}
    >
      <div
        className={`mb-2 text-[11px] font-medium uppercase tracking-wider ${
          isDark ? "text-indigo-200/80" : "text-indigo-700"
        }`}
      >
        {t("editing_review")}
      </div>

      <div className="mb-3">
        <StarRatingInput
          value={rating}
          onChange={setRating}
          size="md"
          disabled={saving}
        />
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value.slice(0, MAX_COMMENT))}
        disabled={saving}
        maxLength={MAX_COMMENT}
        rows={3}
        className={`w-full resize-y rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 ${
          isDark
            ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:ring-indigo-400/40"
            : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500/40"
        }`}
      />

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className={`rounded-md px-3 py-1.5 text-xs transition-colors ${
            isDark
              ? "bg-white/5 hover:bg-white/10 text-white/70"
              : "bg-white ring-1 ring-gray-200 hover:bg-gray-50 text-gray-700"
          }`}
        >
          {t("cancel")}
        </button>
        <button
          type="button"
          onClick={() => onSave({ rating, comment })}
          disabled={!canSave}
          className="rounded-md bg-indigo-600 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-indigo-500 disabled:opacity-50"
        >
          {saving ? t("saving") : t("save")}
        </button>
      </div>
    </div>
  );
};
