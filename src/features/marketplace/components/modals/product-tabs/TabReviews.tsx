import React from "react";
import { Star } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Review } from "../../../types";

interface TabReviewsProps {
  reviews: Review[];
}

export const TabReviews: React.FC<TabReviewsProps> = React.memo(
  ({ reviews }) => {
    const { theme } = useTheme();

    if (!reviews || reviews.length === 0) {
      return (
        <div
          className={`text-center py-8 ${theme === "dark" ? "text-gray-500" : "text-gray-400"}`}
        >
          No hay reseñas todavía.
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {reviews.map((review) => (
          <div
            key={review.id}
            className={`p-4 rounded-xl ${
              theme === "dark" ? "bg-white/5" : "bg-gray-50"
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                ${
                  theme === "dark"
                    ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black"
                    : "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                }
              `}
              >
                {review.user_name
                  ? review.user_name.substring(0, 2).toUpperCase()
                  : "AN"}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`font-medium ${
                      theme === "dark" ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {review.user_name || "Anonymous"}
                  </span>
                  <div className="flex">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star
                        key={j}
                        className={`size-3 ${
                          j < review.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : theme === "dark"
                              ? "text-gray-600"
                              : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
                <p
                  className={`text-sm ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {review.comment}
                </p>
                <div
                  className={`text-xs mt-2 ${
                    theme === "dark" ? "text-gray-500" : "text-gray-400"
                  }`}
                >
                  {new Date(review.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  },
);

TabReviews.displayName = "TabReviews";
