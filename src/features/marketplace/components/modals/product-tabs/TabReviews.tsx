import React from "react";
import { Star } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";

export const TabReviews: React.FC = React.memo(() => {
  const { theme } = useTheme();

  return (
    <div className="space-y-4">
      {[
        {
          initials: "JD",
          name: "Juan Delgado",
          rating: 5,
          text: "¡Excelente producto! Me ahorró horas de trabajo. La documentación es clara y el soporte es responsivo.",
        },
        {
          initials: "SM",
          name: "Sara Martínez",
          rating: 4,
          text: "Gran valor por el precio. Funciona exactamente como se describe. Lo recomendaría a cualquiera que busque esta solución.",
        },
      ].map((review, i) => (
        <div
          key={i}
          className={`p-4 rounded-xl ${
            theme === "dark" ? "bg-white/5" : "bg-gray-50"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`
                w-10 h-10 rounded-full flex items-center justify-center font-semibold
                ${
                  i === 0
                    ? theme === "dark"
                      ? "bg-linear-to-r from-cyan-400 to-blue-400 text-black"
                      : "bg-linear-to-r from-blue-600 to-indigo-600 text-white"
                    : "bg-linear-to-r from-purple-600 to-pink-600 text-white"
                }
              `}
            >
              {review.initials}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`font-medium ${
                    theme === "dark" ? "text-white" : "text-gray-900"
                  }`}
                >
                  {review.name}
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
                {review.text}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
});

TabReviews.displayName = "TabReviews";
