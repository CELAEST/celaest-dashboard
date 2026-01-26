import {
  X,
  Calendar,
  CreditCard,
  AlertTriangle,
  RefreshCw,
  PauseCircle,
  XCircle,
  CheckCircle,
  ArrowDownCircle,
} from "lucide-react";
import { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";

interface ManageSubscriptionModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function ManageSubscriptionModal({
  darkMode,
  isOpen,
  onClose,
}: ManageSubscriptionModalProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [showPauseConfirm, setShowPauseConfirm] = useState(false);
  const [autoRenew, setAutoRenew] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollContainerRef.current) {
      setTimeout(() => {
        scrollContainerRef.current?.scrollTo({
          top: scrollContainerRef.current.scrollHeight,
          behavior: "smooth",
        });
      }, 100);
    }
  };

  const handleToggleCancel = () => {
    const nextState = !showCancelConfirm;
    setShowCancelConfirm(nextState);
    if (nextState) {
      setShowPauseConfirm(false);
      scrollToBottom();
    }
  };

  const handleTogglePause = () => {
    const nextState = !showPauseConfirm;
    setShowPauseConfirm(nextState);
    if (nextState) {
      setShowCancelConfirm(false);
      scrollToBottom();
    }
  };

  const subscriptionDetails = {
    plan: "Premium Tier",
    status: "Active",
    price: "$299.00",
    billingCycle: "Monthly",
    nextBillingDate: "February 1, 2026",
    renewalDate: "January 31, 2026",
    autoRenew: autoRenew,
    activeSince: "September 1, 2025",
  };

  const handleCancelSubscription = () => {
    // Aquí iría la lógica para cancelar la suscripción
    console.log("Cancelling subscription...");
    setShowCancelConfirm(false);
    onClose();
  };

  const handlePauseSubscription = () => {
    // Aquí iría la lógica para pausar la suscripción
    console.log("Pausing subscription...");
    setShowPauseConfirm(false);
  };

  const handleToggleAutoRenew = () => {
    // Aquí iría la lógica para toggle auto-renew
    setAutoRenew(!autoRenew);
    console.log("Toggling auto-renew...");
  };

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
            onClick={(e) => e.target === e.currentTarget && onClose()}
          >
            <div
              className={`relative w-full max-w-3xl max-h-[85vh] rounded-3xl transition-all duration-300 flex flex-col ${
                darkMode
                  ? "bg-gray-900/90 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-cyan-500/5"
                  : "bg-white/90 backdrop-blur-2xl border border-gray-200 shadow-2xl"
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative p-6 border-b border-white/10 shrink-0">
                <button
                  onClick={onClose}
                  className={`absolute right-4 top-4 w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 hover:scale-110 hover:rotate-90 ${
                    darkMode
                      ? "bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: "spring", duration: 0.8, bounce: 0.5 }}
                    className={`w-16 h-16 rounded-2xl flex items-center justify-center ${
                      darkMode
                        ? "bg-linear-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 shadow-lg shadow-cyan-500/20"
                        : "bg-linear-to-br from-blue-500/20 to-indigo-500/20 border border-blue-500/30 shadow-lg shadow-blue-500/20"
                    }`}
                  >
                    <CreditCard
                      className={`w-8 h-8 ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                    />
                  </motion.div>
                  <div>
                    <h2
                      className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      Manage Subscription
                    </h2>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Update your subscription settings and preferences
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div 
                ref={scrollContainerRef}
                className="p-6 space-y-5 overflow-y-auto flex-1 scroll-smooth"
              >
                {/* Current Plan Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className={`rounded-2xl p-5 ${
                    darkMode
                      ? "bg-linear-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 shadow-lg shadow-cyan-500/5"
                      : "bg-linear-to-br from-blue-500/5 to-indigo-500/5 border border-blue-500/20 shadow-lg"
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div
                        className={`text-xs font-semibold tracking-wider mb-1 ${
                          darkMode ? "text-cyan-300" : "text-blue-700"
                        }`}
                      >
                        CURRENT PLAN
                      </div>
                      <div
                        className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {subscriptionDetails.plan}
                      </div>
                    </div>
                    <motion.div
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-1 ${
                        darkMode
                          ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                          : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600"
                      }`}
                    >
                      <CheckCircle className="w-3 h-3" />
                      {subscriptionDetails.status.toUpperCase()}
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        BILLING CYCLE
                      </div>
                      <div
                        className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        {subscriptionDetails.billingCycle}
                      </div>
                    </div>
                    <div>
                      <div
                        className={`text-xs font-semibold mb-1 ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        PRICE
                      </div>
                      <div
                        className={`text-base font-bold ${
                          darkMode ? "text-cyan-400" : "text-blue-600"
                        }`}
                      >
                        {subscriptionDetails.price}/mo
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Subscription Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Next Billing Date */}
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      darkMode
                        ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/30"
                        : "bg-white/60 border border-gray-200 hover:border-blue-500/30 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar
                        className={`w-4 h-4 ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                      />
                      <div
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        NEXT BILLING DATE
                      </div>
                    </div>
                    <div
                      className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {subscriptionDetails.nextBillingDate}
                    </div>
                  </motion.div>

                  {/* Active Since */}
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.02 }}
                    className={`p-4 rounded-xl transition-all duration-300 ${
                      darkMode
                        ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-emerald-500/30"
                        : "bg-white/60 border border-gray-200 hover:border-emerald-500/30 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle
                        className={`w-4 h-4 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                      />
                      <div
                        className={`text-xs font-semibold ${
                          darkMode ? "text-gray-400" : "text-gray-500"
                        }`}
                      >
                        ACTIVE SINCE
                      </div>
                    </div>
                    <div
                      className={`text-base font-bold ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                      {subscriptionDetails.activeSince}
                    </div>
                  </motion.div>
                </div>

                {/* Auto-Renew Toggle */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.01 }}
                  className={`p-5 rounded-xl transition-all duration-300 ${
                    darkMode
                      ? "bg-black/40 backdrop-blur-xl border border-white/10 hover:border-cyan-500/20"
                      : "bg-white/60 border border-gray-200 hover:border-blue-500/20 shadow-sm"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{ rotate: autoRenew ? 360 : 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <RefreshCw
                          className={`w-5 h-5 ${darkMode ? "text-cyan-400" : "text-blue-600"}`}
                        />
                      </motion.div>
                      <div>
                        <div
                          className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          Auto-Renewal
                        </div>
                        <div
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Automatically renew on{" "}
                          {subscriptionDetails.renewalDate}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleToggleAutoRenew}
                      className={`relative w-14 h-7 rounded-full transition-all duration-300 ${
                        autoRenew
                          ? darkMode
                            ? "bg-linear-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
                            : "bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                          : darkMode
                            ? "bg-gray-700"
                            : "bg-gray-300"
                      }`}
                    >
                      <motion.div
                        animate={{ x: autoRenew ? 28 : 4 }}
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 30,
                        }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-lg"
                      />
                    </button>
                  </div>
                </motion.div>

                {/* Action Buttons */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Pause Subscription */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleTogglePause}
                    className={`p-4 rounded-xl transition-all duration-300 group ${
                      darkMode
                        ? "bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40"
                        : "bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500/20 hover:border-orange-500/40 shadow-sm"
                    } ${showPauseConfirm ? "ring-2 ring-orange-500/50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <PauseCircle className="w-5 h-5 text-orange-500" />
                        <div>
                          <div
                            className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            Pause Subscription
                          </div>
                          <div
                            className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            Temporarily pause billing
                          </div>
                        </div>
                      </div>
                      <ArrowDownCircle className={`w-4 h-4 text-orange-400 transition-transform duration-300 ${showPauseConfirm ? "rotate-180" : "opacity-0 group-hover:opacity-100"}`} />
                    </div>
                  </motion.button>

                  {/* Cancel Subscription */}
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleToggleCancel}
                    className={`p-4 rounded-xl transition-all duration-300 group ${
                      darkMode
                        ? "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40"
                        : "bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/40 shadow-sm"
                    } ${showCancelConfirm ? "ring-2 ring-red-500/50" : ""}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 text-left">
                        <XCircle className="w-5 h-5 text-red-500" />
                        <div>
                          <div
                            className={`font-bold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            Cancel Subscription
                          </div>
                          <div
                            className={`text-[10px] ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                          >
                            End your subscription
                          </div>
                        </div>
                      </div>
                      <ArrowDownCircle className={`w-4 h-4 text-red-400 transition-transform duration-300 ${showCancelConfirm ? "rotate-180" : "opacity-0 group-hover:opacity-100"}`} />
                    </div>
                  </motion.button>
                </div>

                <AnimatePresence mode="wait">
                  {showCancelConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className={`rounded-2xl p-6 ring-2 ring-red-500/20 ${
                        darkMode
                          ? "bg-red-500/10 border border-red-500/30 shadow-2xl shadow-red-500/10"
                          : "bg-red-50/50 border border-red-200 shadow-xl"
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-red-500/20 rounded-xl">
                          <AlertTriangle className="w-6 h-6 text-red-500" />
                        </div>
                        <div>
                          <div
                            className={`text-lg font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            Are you sure you want to cancel?
                          </div>
                          <div
                            className={`text-xs leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            Your subscription will remain active until{" "}
                            <span className="font-bold underline decoration-red-500/50">
                              {subscriptionDetails.nextBillingDate}
                            </span>, after which you&apos;ll lose access to all premium features instantly.
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowCancelConfirm(false)}
                          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                            darkMode
                              ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                              : "bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          Keep Subscription
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handleCancelSubscription}
                          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-red-600 text-white hover:bg-red-500 transition-all duration-300 shadow-xl shadow-red-600/20"
                        >
                          Confirm Cancellation
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <AnimatePresence mode="wait">
                  {showPauseConfirm && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: 10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: 10 }}
                      className={`rounded-2xl p-6 ring-2 ring-orange-500/20 ${
                        darkMode
                          ? "bg-orange-500/10 border border-orange-500/30 shadow-2xl shadow-orange-500/10"
                          : "bg-orange-50/50 border border-orange-200 shadow-xl"
                      }`}
                    >
                      <div className="flex items-start gap-4 mb-6">
                        <div className="p-3 bg-orange-500/20 rounded-xl">
                          <AlertTriangle className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <div
                            className={`text-lg font-black mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}
                          >
                            Pause your subscription?
                          </div>
                          <div
                            className={`text-xs leading-relaxed ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            Your subscription will be paused and billing will stop immediately. 
                            You can resume anytime within <span className="font-bold underline">90 days</span> without losing your data.
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3 justify-end">
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setShowPauseConfirm(false)}
                          className={`px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                            darkMode
                              ? "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                              : "bg-gray-100 border border-gray-200 text-gray-900 hover:bg-gray-200"
                          }`}
                        >
                          Go Back
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={handlePauseSubscription}
                          className="px-6 py-2.5 rounded-xl font-bold text-sm bg-orange-600 text-white hover:bg-orange-500 transition-all duration-300 shadow-xl shadow-orange-600/20"
                        >
                          Confirm Pause
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t shrink-0 ${
                  darkMode
                    ? "border-white/10 bg-black/20"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex justify-end">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className={`px-6 py-2.5 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${
                      darkMode
                        ? "bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 shadow-lg shadow-cyan-500/10"
                        : "bg-blue-500/10 border border-blue-500/20 text-blue-600 hover:bg-blue-500/20 shadow-lg"
                    }`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Done
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
