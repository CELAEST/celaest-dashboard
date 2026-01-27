import React from "react";
import { Check, AlertCircle } from "lucide-react";
import { Asset } from "../../hooks/useAssets";

interface ProductDetailsSectionProps {
  product: Asset;
  isDark: boolean;
}

export const ProductDetailsSection: React.FC<ProductDetailsSectionProps> = ({
  product,
  isDark,
}) => {
  return (
    <>
      <div className="mb-8">
        <h3
          className={`text-lg font-bold mb-3 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Description
        </h3>
        <p
          className={`text-sm leading-relaxed ${
            isDark ? "text-gray-400" : "text-gray-600"
          }`}
        >
          {product.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Features */}
        <div>
          <h3
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Key Features
          </h3>
          <ul className="space-y-3">
            {product.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <div
                  className={`mt-0.5 p-1 rounded ${
                    isDark ? "bg-cyan-500/10" : "bg-blue-50"
                  }`}
                >
                  <Check
                    size={14}
                    className={isDark ? "text-cyan-400" : "text-blue-600"}
                  />
                </div>
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  {feature}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h3
            className={`text-lg font-bold mb-4 ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Requirements
          </h3>
          <ul className="space-y-3">
            {product.requirements.map((requirement, index) => (
              <li key={index} className="flex items-start gap-3">
                <AlertCircle
                  size={16}
                  className={`mt-0.5 shrink-0 ${
                    isDark ? "text-gray-500" : "text-gray-400"
                  }`}
                />
                <span
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {requirement}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};
