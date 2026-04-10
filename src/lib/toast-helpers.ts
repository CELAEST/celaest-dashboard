/**
 * Mutation toast helpers.
 * Wraps sonner toast with a standardized "retry" action for failed mutations.
 */

import { toast } from "sonner";

interface MutationErrorOptions {
  message: string;
  onRetry?: () => void;
}

/**
 * Shows an error toast with an optional "Reintentar" action button.
 * Use this instead of bare `toast.error()` in mutation `onError` callbacks.
 */
export function toastMutationError({ message, onRetry }: MutationErrorOptions) {
  toast.error(message, {
    duration: 8000,
    ...(onRetry
      ? {
          action: {
            label: "Reintentar",
            onClick: onRetry,
          },
        }
      : {}),
  });
}

/**
 * Shows a success toast — simple wrapper for consistency.
 */
export function toastMutationSuccess(message: string) {
  toast.success(message, { duration: 3000 });
}
