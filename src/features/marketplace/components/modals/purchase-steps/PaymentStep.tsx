import React from "react";
import { motion } from "motion/react";
import { Loader } from "lucide-react";
import { useTheme } from "@/features/shared/contexts/ThemeContext";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const paymentSchema = z.object({
  cardNumber: z.string().min(16, "Invalid card number").max(19),
  expiry: z
    .string()
    .regex(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, "Invalid format (MM/YY)"),
  cvv: z.string().min(3, "Invalid CVV").max(4),
});

type PaymentFormData = z.infer<typeof paymentSchema>;

interface PaymentStepProps {
  productPrice: string;
  isProcessing: boolean;
  progress: number;
  onPurchase: () => void;
}

export const PaymentStep: React.FC<PaymentStepProps> = ({
  productPrice,
  isProcessing,
  progress,
  onPurchase,
}) => {
  const { theme } = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
  });

  const onSubmit = () => {
    // In a real app, data would be sent to a payment processor
    onPurchase();
  };

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
          Pago Seguro
        </h2>
        <p
          className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
        >
          Tu información está completamente protegida
        </p>
      </div>

      {isProcessing ? (
        <div className="py-12 text-center space-y-4">
          <Loader
            className={`mx-auto animate-spin ${theme === "dark" ? "text-cyan-400" : "text-cyan-600"}`}
            size={48}
          />
          <p
            className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}
          >
            Procesando pago seguro...
          </p>
          <div className="w-64 mx-auto">
            <Progress
              value={progress}
              className={`${theme === "dark" ? "bg-white/10" : "bg-gray-200"} h-2`}
            />
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <label
              className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
            >
              Número de Tarjeta
            </label>
            <input
              {...register("cardNumber")}
              type="text"
              placeholder="0000 0000 0000 0000"
              className={`
                w-full px-4 py-3 rounded-lg border transition-all font-mono
                ${
                  theme === "dark"
                    ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/50"
                    : "bg-white border-gray-300 text-gray-900 focus:border-cyan-500"
                }
              `}
            />
            {errors.cardNumber && (
              <p className="text-red-500 text-xs">
                {errors.cardNumber.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                Vencimiento
              </label>
              <input
                {...register("expiry")}
                type="text"
                placeholder="MM/AA"
                className={`
                  w-full px-4 py-3 rounded-lg border transition-all font-mono
                  ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/50"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-500"
                  }
                `}
              />
              {errors.expiry && (
                <p className="text-red-500 text-xs">{errors.expiry.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label
                className={`text-sm font-medium ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}
              >
                CVV
              </label>
              <input
                {...register("cvv")}
                type="text"
                placeholder="123"
                className={`
                  w-full px-4 py-3 rounded-lg border transition-all font-mono
                  ${
                    theme === "dark"
                      ? "bg-white/5 border-white/10 text-white focus:border-cyan-500/50"
                      : "bg-white border-gray-300 text-gray-900 focus:border-cyan-500"
                  }
                `}
              />
              {errors.cvv && (
                <p className="text-red-500 text-xs">{errors.cvv.message}</p>
              )}
            </div>
          </div>

          <button
            type="submit"
            className={`
              w-full py-3 rounded-xl font-medium transition-all mt-6
              ${
                theme === "dark"
                  ? "bg-cyan-500 text-black hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                  : "bg-gray-900 text-white hover:bg-gray-800 shadow-lg"
              }
            `}
          >
            Confirmar Pago {productPrice}
          </button>
        </form>
      )}
    </motion.div>
  );
};
