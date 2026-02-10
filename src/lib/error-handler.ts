import { ApiError } from "./api-client";

/**
 * Translates backend error codes and messages into user-friendly strings.
 */
export const handleApiError = (error: unknown): string => {
  if (error instanceof ApiError) {
    // Handle specific backend codes
    switch (error.code) {
      case "DB_ERROR":
        if (error.message.includes("unique_product_version")) {
          return "This version already exists for this product. Please use a different version number.";
        }
        return `Database error: ${error.message}`;

      case "MISSING_ORG_ID":
        return "Organization context is missing. Please ensure you have an active organization selected.";

      case "NETWORK_ERROR":
        return "Network connection issue. Please check your internet and try again.";

      case "AUTH_ERROR":
      case "UNAUTHORIZED":
        return "Your session has expired or is invalid. Please log in again.";

      case "FORBIDDEN":
        return "You don't have permission to perform this action.";

      case "NOT_FOUND":
        return "The requested information could not be found.";

      case "VALIDATION_ERROR":
        return "The data provided is invalid. Please check your inputs.";

      default:
        // If message is present, return it, otherwise fallback
        return error.message || "An unexpected error occurred. Please try again later.";
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An unknown error occurred.";
};
