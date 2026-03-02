import React from "react";
import Image from "next/image";
import { motion } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { useTheme } from "@/features/shared/hooks/useTheme";

interface ConfirmationStepProps {
  product: {
    title: string;
    image: string;
  };
  originalPrice: string;
  finalPrice: string;
  hasCoupon: boolean;
  onContinue: () => void;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  product,
  originalPrice,
  finalPrice,
  hasCoupon,
  onContinue,
}) => {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <div className="text-center">
        <h2
          className={`text-2xl font-bold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
        >
          Confirmar Adquisición
        </h2>
        <p
          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Revisa los detalles antes de continuar
        </p>
      </div>

      <div
        className={`p-6 rounded-2xl ${theme === "dark" ? "bg-white/5" : "bg-gray-50"}`}
      >
        <div className="flex items-center gap-4">
          <Image
            src={
              product.image ||
              "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&fm=webp"
            }
            alt={product.title}
            width={80}
            height={80}
            className="rounded-lg object-cover"
          />
          <div className="flex-1">
            <h3
              className={`font-semibold mb-1 ${theme === "dark" ? "text-white" : "text-gray-900"}`}
            >
              {product.title}
            </h3>
            <div className="flex flex-col">
              {hasCoupon && (
                <span className="text-sm line-through text-gray-500 font-medium">
                  {originalPrice}
                </span>
              )}
              <p
                className={`text-2xl font-bold ${
                  hasCoupon
                    ? "text-emerald-500"
                    : theme === "dark"
                      ? "text-cyan-400"
                      : "text-cyan-600"
                }`}
              >
                {finalPrice}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <ShieldCheck
          className={`${theme === "dark" ? "text-green-400" : "text-green-600"}`}
          size={18}
        />
        <span className={theme === "dark" ? "text-gray-300" : "text-gray-700"}>
          Transacción protegida con cifrado de grado militar
        </span>
      </div>

      <button
        onClick={onContinue}
        className={`
          w-full py-3 rounded-xl font-medium transition-all
          ${
            theme === "dark"
              ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
          }
        `}
      >
        Continuar al Pago
      </button>
    </motion.div>
  );
};
