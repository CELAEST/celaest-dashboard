/**
 * ReviewModerationPanel
 *
 * Super-admin moderation surface for marketplace reviews.
 *
 * Layout:
 *   - Filter bar: status select, rating select, comment search, page size.
 *   - Results table: user, product, rating, comment, status, date, actions.
 *   - Per-row actions: Hide / Publish / Flag (cycle through statuses) + a
 *     confirm-gated Delete (hard delete).
 *   - Pagination footer.
 *
 * All mutations route through useAdminSetReviewStatus / useAdminDeleteReview
 * which invalidate the marketplace cache so the customer-facing modal and
 * cards reflect the change immediately.
 */
"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { useTheme } from "@/features/shared/hooks/useTheme";
import {
  Eye,
  EyeSlash,
  Flag,
  Trash,
  CaretLeft,
  CaretRight,
  Star,
  ShieldWarning,
  PencilSimple,
} from "@phosphor-icons/react";
import {
  useAdminReviews,
  useAdminDeleteReview,
  useAdminSetReviewStatus,
  useAdminUpdateReview,
} from "../../hooks/useAdminReviews";
import { AdminReview, AdminReviewFilter, ReviewStatus } from "../../types";
import { StarRatingInput } from "../reviews/StarRatingInput";

const STATUSES: ReviewStatus[] = ["published", "hidden", "flagged", "removed"];
const PAGE_SIZE = 15;

const STATUS_PILL: Record<
  ReviewStatus,
  { dark: string; light: string; labelKey: string }
> = {
  published: {
    dark: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/20",
    light: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    labelKey: "rev_status_published",
  },
  hidden: {
    dark: "bg-slate-500/15 text-slate-300 ring-slate-500/20",
    light: "bg-slate-50 text-slate-700 ring-slate-200",
    labelKey: "rev_status_hidden",
  },
  flagged: {
    dark: "bg-amber-500/15 text-amber-300 ring-amber-500/20",
    light: "bg-amber-50 text-amber-700 ring-amber-200",
    labelKey: "rev_status_flagged",
  },
  removed: {
    dark: "bg-red-500/15 text-red-300 ring-red-500/20",
    light: "bg-red-50 text-red-700 ring-red-200",
    labelKey: "rev_status_removed",
  },
};

export const ReviewModerationPanel: React.FC = () => {
  const t = useTranslations("marketplace");
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [statusFilter, setStatusFilter] = useState<ReviewStatus | "">("");
  const [ratingFilter, setRatingFilter] = useState<number>(0);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filter: AdminReviewFilter = useMemo(
    () => ({
      status: statusFilter,
      rating: ratingFilter || undefined,
      q: search || undefined,
      page,
      limit: PAGE_SIZE,
    }),
    [statusFilter, ratingFilter, search, page],
  );

  const { data, isLoading, isError } = useAdminReviews(filter);
  const setStatusMutation = useAdminSetReviewStatus();
  const deleteMutation = useAdminDeleteReview();
  const updateMutation = useAdminUpdateReview();

  const reviews = data?.reviews ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleStatus = (review: AdminReview, next: ReviewStatus) => {
    if (review.status === next) return;
    setStatusMutation.mutate({ reviewId: review.id, status: next });
  };

  const handleDelete = (reviewId: string) => {
    deleteMutation.mutate(reviewId, {
      onSuccess: () => setPendingDelete(null),
    });
  };

  const handleSaveEdit = (
    reviewId: string,
    payload: { rating: number; comment: string },
  ) => {
    updateMutation.mutate(
      { reviewId, input: payload },
      { onSuccess: () => setEditingId(null) },
    );
  };

  const surface = isDark
    ? "bg-white/5 border-white/10"
    : "bg-white border-gray-200";
  const muted = isDark ? "text-white/60" : "text-gray-600";
  const heading = isDark ? "text-white" : "text-gray-900";

  return (
    <div className="flex h-full flex-col gap-4">
      <div>
        <h3 className={`text-lg font-semibold ${heading}`}>
          {t("reviews_moderation_title")}
        </h3>
        <p className={`text-sm ${muted}`}>
          {t("reviews_moderation_subtitle")}
        </p>
      </div>

      {/* ── Filters ─────────────────────────────────────────────────── */}
      <div
        className={`flex flex-wrap items-end gap-3 rounded-xl border p-3 ${surface}`}
      >
        <FilterField label={t("filter_status")} isDark={isDark}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as ReviewStatus | "");
              setPage(1);
            }}
            className={selectClass(isDark)}
          >
            <option value="">{t("all_statuses")}</option>
            {STATUSES.map((s) => (
              <option key={s} value={s}>
                {t(STATUS_PILL[s].labelKey)}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label={t("filter_rating")} isDark={isDark}>
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(Number(e.target.value));
              setPage(1);
            }}
            className={selectClass(isDark)}
          >
            <option value={0}>{t("all_ratings")}</option>
            {[5, 4, 3, 2, 1].map((r) => (
              <option key={r} value={r}>
                {"★".repeat(r)}
              </option>
            ))}
          </select>
        </FilterField>

        <FilterField label={t("search")} isDark={isDark} grow>
          <input
            type="search"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("filter_search_placeholder")}
            className={inputClass(isDark)}
          />
        </FilterField>
      </div>

      {/* ── Table ───────────────────────────────────────────────────── */}
      <div className={`flex-1 overflow-auto rounded-xl border ${surface}`}>
        {isError ? (
          <div className="flex flex-col items-center justify-center gap-2 p-12 text-center">
            <ShieldWarning className="h-8 w-8 text-red-400" />
            <p className={muted}>Error loading reviews.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-black/5 dark:divide-white/10 text-sm">
            <thead className={isDark ? "bg-white/5" : "bg-gray-50"}>
              <tr className={`${muted} text-left text-[11px] uppercase tracking-wider`}>
                <th className="px-4 py-3">{t("rev_col_user")}</th>
                <th className="px-4 py-3">{t("rev_col_product")}</th>
                <th className="px-4 py-3">{t("rev_col_rating")}</th>
                <th className="px-4 py-3">{t("rev_col_comment")}</th>
                <th className="px-4 py-3">{t("rev_col_status")}</th>
                <th className="px-4 py-3">{t("rev_col_date")}</th>
                <th className="px-4 py-3 text-right">{t("rev_col_actions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3">
                      <div
                        className={`h-6 w-full animate-pulse rounded ${
                          isDark ? "bg-white/5" : "bg-gray-100"
                        }`}
                      />
                    </td>
                  </tr>
                ))
              ) : reviews.length === 0 ? (
                <tr>
                  <td colSpan={7} className={`px-4 py-10 text-center ${muted}`}>
                    {t("moderation_empty")}
                  </td>
                </tr>
              ) : (
                reviews.map((r) => (
                  <React.Fragment key={r.id}>
                    <ReviewRow
                      review={r}
                      isDark={isDark}
                      pendingDelete={pendingDelete === r.id}
                      isEditing={editingId === r.id}
                      onSetStatus={(s) => handleStatus(r, s)}
                      onRequestDelete={() => setPendingDelete(r.id)}
                      onCancelDelete={() => setPendingDelete(null)}
                      onConfirmDelete={() => handleDelete(r.id)}
                      onStartEdit={() => setEditingId(r.id)}
                      deleting={
                        deleteMutation.isPending && pendingDelete === r.id
                      }
                      updating={
                        setStatusMutation.isPending &&
                        setStatusMutation.variables?.reviewId === r.id
                      }
                    />
                    {editingId === r.id && (
                      <ReviewEditRow
                        review={r}
                        isDark={isDark}
                        saving={
                          updateMutation.isPending &&
                          updateMutation.variables?.reviewId === r.id
                        }
                        onCancel={() => setEditingId(null)}
                        onSave={(payload) => handleSaveEdit(r.id, payload)}
                      />
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ──────────────────────────────────────────────── */}
      {total > 0 && (
        <div className={`flex items-center justify-between text-xs ${muted}`}>
          <span>
            {(page - 1) * PAGE_SIZE + 1}–
            {Math.min(page * PAGE_SIZE, total)} / {total}
          </span>
          <div className="flex items-center gap-1">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={pagerClass(isDark)}
              aria-label="Previous page"
            >
              <CaretLeft className="h-3 w-3" />
            </button>
            <span className={`px-2 ${heading}`}>{page}/{totalPages}</span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={pagerClass(isDark)}
              aria-label="Next page"
            >
              <CaretRight className="h-3 w-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ────────────────────────────────────────────────────────────────────
// Subcomponents
// ────────────────────────────────────────────────────────────────────

interface ReviewRowProps {
  review: AdminReview;
  isDark: boolean;
  pendingDelete: boolean;
  isEditing: boolean;
  updating: boolean;
  deleting: boolean;
  onSetStatus: (status: ReviewStatus) => void;
  onRequestDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
  onStartEdit: () => void;
}

const ReviewRow: React.FC<ReviewRowProps> = ({
  review,
  isDark,
  pendingDelete,
  isEditing,
  updating,
  deleting,
  onSetStatus,
  onRequestDelete,
  onCancelDelete,
  onConfirmDelete,
  onStartEdit,
}) => {
  const t = useTranslations("marketplace");
  const pill = STATUS_PILL[review.status];

  return (
    <tr
      className={`align-top transition-colors ${
        isDark ? "hover:bg-white/[0.03]" : "hover:bg-gray-50"
      }`}
    >
      <td className="px-4 py-3">
        <div className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}>
          {review.user_name || "—"}
        </div>
        <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
          {review.user_email}
        </div>
      </td>
      <td className="px-4 py-3">
        <div
          className={`font-medium ${isDark ? "text-white" : "text-gray-900"}`}
        >
          {review.product_name}
        </div>
        <div className={`text-xs ${isDark ? "text-white/40" : "text-gray-400"}`}>
          {review.product_slug}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-0.5">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              weight={i < review.rating ? "fill" : "regular"}
              className={`h-3.5 w-3.5 ${
                i < review.rating
                  ? "text-amber-400"
                  : isDark
                    ? "text-white/15"
                    : "text-gray-300"
              }`}
            />
          ))}
        </div>
      </td>
      <td className="max-w-sm px-4 py-3">
        <p
          className={`line-clamp-3 text-sm ${
            isDark ? "text-white/80" : "text-gray-700"
          }`}
          title={review.comment}
        >
          {review.comment || "—"}
        </p>
      </td>
      <td className="px-4 py-3">
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ring-1 ${
            isDark ? pill.dark : pill.light
          }`}
        >
          {t(pill.labelKey)}
        </span>
      </td>
      <td className={`px-4 py-3 text-xs ${isDark ? "text-white/50" : "text-gray-500"}`}>
        {new Date(review.created_at).toLocaleDateString()}
      </td>
      <td className="px-4 py-3">
        {pendingDelete ? (
          <div className="flex flex-col gap-1">
            <span
              className={`text-[11px] ${
                isDark ? "text-red-300" : "text-red-600"
              }`}
            >
              {t("action_delete_permanent_confirm")}
            </span>
            <div className="flex justify-end gap-1">
              <button
                type="button"
                onClick={onConfirmDelete}
                disabled={deleting}
                className="rounded-md bg-red-600 px-2 py-1 text-[11px] font-medium text-white transition-colors hover:bg-red-500 disabled:opacity-50"
              >
                {deleting
                  ? t("deleting")
                  : t("delete_review_confirm_action")}
              </button>
              <button
                type="button"
                onClick={onCancelDelete}
                disabled={deleting}
                className={iconBtnClass(isDark)}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-end gap-1">
            {review.status !== "published" && (
              <ActionBtn
                isDark={isDark}
                title={t("action_publish")}
                onClick={() => onSetStatus("published")}
                disabled={updating}
                tone="emerald"
              >
                <Eye className="h-3.5 w-3.5" />
              </ActionBtn>
            )}
            {review.status !== "hidden" && (
              <ActionBtn
                isDark={isDark}
                title={t("action_hide")}
                onClick={() => onSetStatus("hidden")}
                disabled={updating}
                tone="slate"
              >
                <EyeSlash className="h-3.5 w-3.5" />
              </ActionBtn>
            )}
            {review.status !== "flagged" && (
              <ActionBtn
                isDark={isDark}
                title={t("action_flag")}
                onClick={() => onSetStatus("flagged")}
                disabled={updating}
                tone="amber"
              >
                <Flag className="h-3.5 w-3.5" />
              </ActionBtn>
            )}
            <ActionBtn
              isDark={isDark}
              title={t("action_edit_content")}
              onClick={onStartEdit}
              disabled={isEditing}
              tone="indigo"
            >
              <PencilSimple className="h-3.5 w-3.5" />
            </ActionBtn>
            <ActionBtn
              isDark={isDark}
              title={t("action_delete_permanent")}
              onClick={onRequestDelete}
              disabled={deleting}
              tone="red"
            >
              <Trash className="h-3.5 w-3.5" />
            </ActionBtn>
          </div>
        )}
      </td>
    </tr>
  );
};

// ────────────────────────────────────────────────────────────────────
// Inline edit sub-row (super_admin only)
// ────────────────────────────────────────────────────────────────────

interface ReviewEditRowProps {
  review: AdminReview;
  isDark: boolean;
  saving: boolean;
  onCancel: () => void;
  onSave: (payload: { rating: number; comment: string }) => void;
}

const ReviewEditRow: React.FC<ReviewEditRowProps> = ({
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
    <tr
      className={
        isDark ? "bg-indigo-500/[0.05]" : "bg-indigo-50/60"
      }
    >
      <td colSpan={7} className="px-4 py-4">
        <div className="flex flex-col gap-3">
          <div
            className={`text-[11px] font-medium uppercase tracking-wider ${
              isDark ? "text-indigo-200/80" : "text-indigo-700"
            }`}
          >
            {t("editing_review")}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-start">
            <div className="md:w-44">
              <StarRatingInput
                value={rating}
                onChange={setRating}
                size="md"
                disabled={saving}
              />
            </div>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={saving}
              maxLength={2000}
              rows={3}
              className={`flex-1 resize-y rounded-md border px-3 py-2 text-sm transition-colors focus:outline-none focus:ring-2 disabled:opacity-50 ${
                isDark
                  ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:ring-indigo-400/40"
                  : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:ring-indigo-500/40"
              }`}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className={iconBtnClass(isDark)}
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
      </td>
    </tr>
  );
};

// ────────────────────────────────────────────────────────────────────
// Inline helpers / class composition
// ────────────────────────────────────────────────────────────────────

const FilterField: React.FC<{
  label: string;
  isDark: boolean;
  grow?: boolean;
  children: React.ReactNode;
}> = ({ label, isDark, grow, children }) => (
  <label className={`flex flex-col gap-1 ${grow ? "flex-1 min-w-[180px]" : ""}`}>
    <span
      className={`text-[11px] font-medium uppercase tracking-wider ${
        isDark ? "text-white/50" : "text-gray-500"
      }`}
    >
      {label}
    </span>
    {children}
  </label>
);

const ActionBtn: React.FC<{
  isDark: boolean;
  title: string;
  onClick: () => void;
  disabled?: boolean;
  tone: "emerald" | "slate" | "amber" | "red" | "indigo";
  children: React.ReactNode;
}> = ({ isDark, title, onClick, disabled, tone, children }) => {
  const toneMap = {
    emerald: isDark
      ? "hover:bg-emerald-500/15 text-emerald-300"
      : "hover:bg-emerald-50 text-emerald-700",
    indigo: isDark
      ? "hover:bg-indigo-500/15 text-indigo-300"
      : "hover:bg-indigo-50 text-indigo-700",
    slate: isDark
      ? "hover:bg-slate-500/15 text-slate-300"
      : "hover:bg-slate-50 text-slate-700",
    amber: isDark
      ? "hover:bg-amber-500/15 text-amber-300"
      : "hover:bg-amber-50 text-amber-700",
    red: isDark
      ? "hover:bg-red-500/15 text-red-300"
      : "hover:bg-red-50 text-red-600",
  };
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md p-1.5 transition-colors disabled:opacity-50 ${toneMap[tone]}`}
    >
      {children}
    </button>
  );
};

const selectClass = (isDark: boolean) =>
  `rounded-lg border px-2 py-1.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
    isDark
      ? "border-white/10 bg-white/5 text-white focus:border-blue-500/50 focus:ring-blue-500/50"
      : "border-gray-200 bg-white text-gray-900 focus:border-blue-400 focus:ring-blue-400"
  }`;

const inputClass = (isDark: boolean) =>
  `w-full rounded-lg border px-3 py-1.5 text-sm transition-colors focus:outline-none focus:ring-1 ${
    isDark
      ? "border-white/10 bg-white/5 text-white placeholder:text-white/30 focus:border-blue-500/50 focus:ring-blue-500/50"
      : "border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 focus:border-blue-400 focus:ring-blue-400"
  }`;

const pagerClass = (isDark: boolean) =>
  `rounded-md p-1.5 transition-colors disabled:opacity-30 ${
    isDark
      ? "bg-white/5 hover:bg-white/10 text-white"
      : "bg-white ring-1 ring-gray-200 hover:bg-gray-50 text-gray-700"
  }`;

const iconBtnClass = (isDark: boolean) =>
  `rounded-md px-2 py-1 text-[11px] transition-colors ${
    isDark
      ? "bg-white/5 hover:bg-white/10 text-white/70"
      : "bg-white ring-1 ring-gray-200 hover:bg-gray-50 text-gray-700"
  }`;
