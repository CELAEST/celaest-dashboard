import { X, Check, Sparkles, Star } from "lucide-react";
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", duration: 0.6, bounce: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            onClick={(e: React.MouseEvent) =>
              e.target === e.currentTarget && onClose()
            }
          >
            <div
              className={`relative w-full max-w-6xl max-h-[90vh] rounded-[2rem] overflow-hidden flex flex-col shadow-2xl ${
                darkMode
                  ? "bg-[#0f172a] border border-white/10 shadow-purple-900/20"
                  : "bg-white border border-gray-200 shadow-xl"
              }`}
              onClick={(e: React.MouseEvent) => e.stopPropagation()}
            >
              {/* Background Glows */}
              {darkMode && (
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                  <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen" />
                  <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[100px] mix-blend-screen" />
                </div>
              )}

              {/* Header */}
              <div className="relative p-8 md:p-10 text-center shrink-0 z-10">
                <button
                  onClick={onClose}
                  className={`absolute right-6 top-6 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 hover:rotate-90 hover:scale-110 ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 ${
                    darkMode ? "bg-purple-500/10 text-purple-300 border border-purple-500/20" : "bg-purple-100 text-purple-600"
                  }`}>
                    Pricing Plans
                  </span>
                  <h2
                    className={`text-3xl md:text-5xl font-black mb-4 tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}
                  >
                   Choose Your Growth Path
                  </h2>
                </motion.div>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={`text-lg max-w-2xl mx-auto leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                >
                  Unlock powerful features and scale your business with flexible plans designed for every stage of your journey.
                </motion.p>
              </div>

              {/* Plans Grid - Scrollable with padding for badges */}
              <div className="relative p-6 md:p-10 pt-4 overflow-y-auto flex-1 z-10 custom-scrollbar">
                {/* Extra top padding for the 'Most Popular' badge to not clip */}
                <div className="pt-12 pb-4"> 
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto items-stretch">
                    {plans.map((plan, index) => {
                      const isPopular = plan.popular;
                      
                      // Theme Colors
                      const themeColors = {
                        blue: {
                          border: isPopular ? "border-blue-500" : (darkMode ? "border-blue-500/20" : "border-blue-100"),
                          bg: darkMode ? "bg-slate-900/60" : "bg-white",
                          title: darkMode ? "text-blue-200" : "text-blue-900",
                          price: darkMode ? "text-white" : "text-slate-900",
                          checkBg: darkMode ? "bg-blue-500/20" : "bg-blue-50",
                          check: "text-blue-500",
                          btn: "bg-blue-600 hover:bg-blue-500",
                          glow: "shadow-blue-500/20"
                        },
                        purple: {
                          border: isPopular ? "border-purple-500" : (darkMode ? "border-purple-500/20" : "border-purple-100"),
                          bg: darkMode ? "bg-slate-900/80" : "bg-white",
                          title: darkMode ? "text-purple-200" : "text-purple-900",
                          price: darkMode ? "text-white" : "text-slate-900",
                          checkBg: darkMode ? "bg-purple-500/20" : "bg-purple-50",
                          check: "text-purple-500",
                          btn: "bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500",
                          glow: "shadow-purple-500/40"
                        },
                        emerald: {
                          border: isPopular ? "border-emerald-500" : (darkMode ? "border-emerald-500/20" : "border-emerald-100"),
                          bg: darkMode ? "bg-slate-900/60" : "bg-white",
                          title: darkMode ? "text-emerald-200" : "text-emerald-900",
                          price: darkMode ? "text-white" : "text-slate-900",
                          checkBg: darkMode ? "bg-emerald-500/20" : "bg-emerald-50",
                          check: "text-emerald-500",
                          btn: "bg-emerald-600 hover:bg-emerald-500",
                          glow: "shadow-emerald-500/20"
                        }
                      };

                      const currentTheme = themeColors[plan.color as keyof typeof themeColors];

                      return (
                        <motion.div
                          key={plan.name}
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 + 0.3, type: "spring", bounce: 0.3 }}
                          className={`group relative rounded-3xl p-8 flex flex-col h-full border backdrop-blur-xl transition-all duration-500 ${
                            currentTheme.border
                          } ${currentTheme.bg} ${
                            isPopular 
                              ? `shadow-2xl ${currentTheme.glow} ring-1 ring-white/10 z-10 scale-105` 
                              : "shadow-lg hover:shadow-xl hover:border-opacity-50"
                          }`}
                        >
                          {/* Popular Badge */}
                          {isPopular && (
                            <div className="absolute -top-5 left-0 right-0 flex justify-center z-20">
                              <div className="bg-linear-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg shadow-purple-500/40 uppercase tracking-widest flex items-center gap-2">
                                <Sparkles className="w-3 h-3 fill-white" />
                                Most Popular
                              </div>
                            </div>
                          )}

                          {/* Content */}
                          <div className="text-center mb-8">
                            <h3 className={`text-xl font-bold mb-3 ${currentTheme.title}`}>
                              {plan.name}
                            </h3>
                            <div className="flex items-baseline justify-center gap-1 mb-3">
                              <span className={`text-5xl font-black tracking-tight ${currentTheme.price}`}>
                                {plan.price}
                              </span>
                              {plan.period && (
                                <span className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                                  {plan.period}
                                </span>
                              )}
                            </div>
                            <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                              {plan.description}
                            </p>
                          </div>

                          <div className="flex-1 space-y-4 mb-8">
                            {plan.features.map((feature, i) => (
                              <div key={i} className="flex items-start gap-3 group/item">
                                <div
                                  className={`mt-0.5 rounded-full p-1 shrink-0 transition-colors ${currentTheme.checkBg}`}
                                >
                                  <Check className={`w-3 h-3 ${currentTheme.check}`} />
                                </div>
                                <span className={`text-sm font-medium ${darkMode ? "text-gray-300 group-hover/item:text-white" : "text-gray-600 group-hover/item:text-gray-900"} transition-colors`}>
                                  {feature}
                                </span>
                              </div>
                            ))}
                          </div>

                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={onClose}
                            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all duration-300 ${currentTheme.btn} relative overflow-hidden group/btn`}
                          >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                              {isPopular ? "Get Started Now" : "Choose Plan"}
                              {isPopular && <Star className="w-4 h-4 fill-white/20" />}
                            </span>
                            {/* Shine Effect */}
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000" />
                          </motion.button>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
