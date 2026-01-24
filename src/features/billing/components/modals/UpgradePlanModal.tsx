import { X, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface UpgradePlanModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function UpgradePlanModal({
  darkMode,
  isOpen,
  onClose,
}: UpgradePlanModalProps) {
  const plans = [
    {
      name: "Starter",
      price: "$99",
      period: "/month",
      description: "Perfect for small businesses just starting out.",
      features: [
        "Up to 5 users",
        "Basic analytics",
        "Email support",
        "5GB storage",
      ],
      popular: false,
      color: "blue",
    },
    {
      name: "Pro",
      price: "$299",
      period: "/month",
      description: "Ideal for growing teams requiring more power.",
      features: [
        "Up to 20 users",
        "Advanced analytics",
        "Priority support",
        "20GB storage",
        "API access",
      ],
      popular: true,
      color: "purple",
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      description: "For large organizations with specific needs.",
      features: [
        "Unlimited users",
        "Custom analytics",
        "24/7 Dedicated support",
        "Unlimited storage",
        "SSO & Advanced Security",
      ],
      popular: false,
      color: "emerald",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e: React.MouseEvent) =>
              e.target === e.currentTarget && onClose()
            }
          >
            <div
              className={`relative w-full max-w-6xl max-h-[90vh] rounded-3xl overflow-hidden flex flex-col ${
                darkMode
                  ? "bg-gray-900 border border-white/10 shadow-2xl shadow-purple-500/10"
                  : "bg-white border border-gray-200 shadow-2xl"
              }`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-8 text-center shrink-0">
                <button
                  onClick={onClose}
                  className={`absolute right-6 top-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/20 text-gray-400 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <motion.h2
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`text-3xl md:text-4xl font-bold mb-4 ${darkMode ? "text-white" : "text-gray-900"}`}
                >
                  Upgrade Your Plan
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                >
                  Unlock more features and power up your business with our
                  flexible pricing plans tailored to your needs.
                </motion.p>
              </div>

              {/* Plans Grid - Scrollable */}
              <div className="p-8 pt-0 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                  {plans.map((plan, index) => {
                    const isPopular = plan.popular;
                    const borderColor =
                      plan.color === "blue"
                        ? darkMode
                          ? "border-blue-500/30"
                          : "border-blue-200"
                        : plan.color === "purple"
                          ? darkMode
                            ? "border-purple-500/50"
                            : "border-purple-300"
                          : darkMode
                            ? "border-emerald-500/30"
                            : "border-emerald-200";

                    const glowColor =
                      plan.color === "blue"
                        ? "shadow-blue-500/20"
                        : plan.color === "purple"
                          ? "shadow-purple-500/40"
                          : "shadow-emerald-500/20";

                    const btnColor =
                      plan.color === "blue"
                        ? "bg-blue-600 hover:bg-blue-700"
                        : plan.color === "purple"
                          ? "bg-purple-600 hover:bg-purple-700"
                          : "bg-emerald-600 hover:bg-emerald-700";

                    return (
                      <motion.div
                        key={plan.name}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 + 0.2 }}
                        whileHover={{ y: -10, transition: { duration: 0.3 } }}
                        className={`relative rounded-3xl p-6 md:p-8 flex flex-col border ${borderColor} transition-all duration-300 ${
                          darkMode ? "bg-white/5 backdrop-blur-xl" : "bg-white"
                        } ${isPopular ? `shadow-2xl ${glowColor} ring-1 ring-white/20` : "shadow-lg hover:shadow-xl"}`}
                      >
                        {isPopular && (
                          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                            <span className="bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/30 uppercase tracking-wider">
                              Most Popular
                            </span>
                          </div>
                        )}

                        <div className="text-center mb-6">
                          <h3
                            className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            {plan.name}
                          </h3>
                          <div className="flex items-baseline justify-center gap-1">
                            <span
                              className={`text-4xl font-extrabold ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {plan.price}
                            </span>
                            <span
                              className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                            >
                              {plan.period}
                            </span>
                          </div>
                          <p
                            className={`mt-3 text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                          >
                            {plan.description}
                          </p>
                        </div>

                        <div className="flex-1 space-y-4 mb-8">
                          {plan.features.map((feature, i) => (
                            <div key={i} className="flex items-start gap-3">
                              <div
                                className={`mt-0.5 rounded-full p-0.5 ${
                                  darkMode ? "bg-white/10" : "bg-gray-100"
                                }`}
                              >
                                <Check
                                  className={`w-3.5 h-3.5 ${
                                    plan.color === "blue"
                                      ? "text-blue-500"
                                      : plan.color === "purple"
                                        ? "text-purple-500"
                                        : "text-emerald-500"
                                  }`}
                                />
                              </div>
                              <span
                                className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                              >
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>

                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={onClose}
                          className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${btnColor}`}
                        >
                          {isPopular ? "Get Started" : "Choose Plan"}
                        </motion.button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
