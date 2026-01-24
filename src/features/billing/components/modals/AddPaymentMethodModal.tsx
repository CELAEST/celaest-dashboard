import {
  X,
  CreditCard,
  Lock,
  User,
  Mail,
  MapPin,
  Building,
  Sparkles,
  Check,
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface AddPaymentMethodModalProps {
  darkMode: boolean;
  isOpen: boolean;
  onClose: () => void;
}

export function AddPaymentMethodModal({
  darkMode,
  isOpen,
  onClose,
}: AddPaymentMethodModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [billingEmail, setBillingEmail] = useState("");
  const [billingAddress, setBillingAddress] = useState("");
  const [billingCity, setBillingCity] = useState("");
  const [billingZip, setBillingZip] = useState("");
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.substring(0, 19); // Max 16 digits + 3 spaces
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value.replace(/\D/g, ""));
    setCardNumber(formatted);
  };

  const detectCardType = (number: string) => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "VISA";
    if (cleaned.startsWith("5")) return "MASTERCARD";
    if (cleaned.startsWith("3")) return "AMEX";
    return "CARD";
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 13) {
      newErrors.cardNumber = "Invalid card number";
    }
    if (!cardName || cardName.length < 3) {
      newErrors.cardName = "Name is required";
    }
    if (
      !expiryMonth ||
      parseInt(expiryMonth) < 1 ||
      parseInt(expiryMonth) > 12
    ) {
      newErrors.expiryMonth = "Invalid month";
    }
    if (!expiryYear || parseInt(expiryYear) < 26) {
      newErrors.expiryYear = "Invalid year";
    }
    if (!cvv || cvv.length < 3) {
      newErrors.cvv = "Invalid CVV";
    }
    if (!billingEmail || !billingEmail.includes("@")) {
      newErrors.billingEmail = "Invalid email";
    }
    if (!billingAddress) {
      newErrors.billingAddress = "Address is required";
    }
    if (!billingCity) {
      newErrors.billingCity = "City is required";
    }
    if (!billingZip) {
      newErrors.billingZip = "Zip code is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      // Aquí iría la lógica para agregar el método de pago
      console.log("Adding payment method...", {
        cardNumber,
        cardName,
        expiryMonth,
        expiryYear,
        setAsDefault,
      });
      onClose();
    }
  };

  const cardType = detectCardType(cardNumber);

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
              className={`relative w-full max-w-4xl max-h-[85vh] rounded-3xl transition-all duration-300 flex flex-col ${
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
                      Add Payment Method
                    </h2>
                    <p
                      className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                    >
                      Securely add a new credit or debit card
                    </p>
                  </div>
                </div>
              </div>

              {/* Content - Scrollable */}
              <div className="p-6 overflow-y-auto flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Left Column - Card Preview */}
                  <div>
                    {/* Card Preview */}
                    <motion.div
                      initial={{ opacity: 0, rotateY: -20 }}
                      animate={{ opacity: 1, rotateY: 0 }}
                      transition={{ duration: 0.6 }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative rounded-2xl p-6 mb-4 overflow-hidden ${
                        darkMode
                          ? "bg-linear-to-br from-cyan-500/20 via-blue-500/20 to-indigo-500/20 backdrop-blur-xl border border-cyan-500/30 shadow-2xl shadow-cyan-500/20"
                          : "bg-linear-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 border border-blue-500/30 shadow-2xl"
                      }`}
                      style={{
                        aspectRatio: "1.586",
                      }}
                    >
                      {/* Decorative Pattern */}
                      <div className="absolute inset-0 opacity-10">
                        <div
                          className={`absolute inset-0 ${darkMode ? "bg-cyan-400" : "bg-blue-500"}`}
                          style={{
                            backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.1) 35px, rgba(255,255,255,.1) 70px)`,
                          }}
                        />
                      </div>

                      <div className="relative h-full flex flex-col justify-between">
                        {/* Card Type & Chip */}
                        <div className="flex items-start justify-between">
                          <motion.div
                            animate={
                              focusedField === "cardNumber"
                                ? { scale: [1, 1.05, 1] }
                                : {}
                            }
                            transition={{
                              duration: 0.5,
                              repeat:
                                focusedField === "cardNumber" ? Infinity : 0,
                              repeatDelay: 0.5,
                            }}
                            className={`w-12 h-9 rounded-lg ${
                              darkMode
                                ? "bg-linear-to-br from-yellow-400/40 to-yellow-600/40"
                                : "bg-linear-to-br from-yellow-400/60 to-yellow-600/60"
                            }`}
                          />
                          <motion.div
                            animate={cardNumber ? { scale: [1, 1.1, 1] } : {}}
                            transition={{ duration: 0.5 }}
                            className={`text-xs font-bold tracking-wider ${darkMode ? "text-cyan-300" : "text-blue-700"}`}
                          >
                            {cardType}
                          </motion.div>
                        </div>

                        {/* Card Number */}
                        <motion.div
                          animate={cardNumber ? { scale: [1, 1.02, 1] } : {}}
                          transition={{ duration: 0.3 }}
                          className={`text-xl font-mono tracking-widest ${darkMode ? "text-white" : "text-gray-900"}`}
                        >
                          {cardNumber || "•••• •••• •••• ••••"}
                        </motion.div>

                        {/* Card Details */}
                        <div className="flex items-end justify-between">
                          <div>
                            <div
                              className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              CARD HOLDER
                            </div>
                            <motion.div
                              animate={cardName ? { scale: [1, 1.05, 1] } : {}}
                              transition={{ duration: 0.3 }}
                              className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {cardName || "YOUR NAME"}
                            </motion.div>
                          </div>
                          <div>
                            <div
                              className={`text-xs mb-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                            >
                              EXPIRES
                            </div>
                            <motion.div
                              animate={
                                expiryMonth && expiryYear
                                  ? { scale: [1, 1.05, 1] }
                                  : {}
                              }
                              transition={{ duration: 0.3 }}
                              className={`font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                            >
                              {expiryMonth && expiryYear
                                ? `${expiryMonth}/${expiryYear}`
                                : "MM/YY"}
                            </motion.div>
                          </div>
                        </div>
                      </div>
                    </motion.div>

                    {/* Security Badge */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`p-4 rounded-xl flex items-start gap-3 ${
                        darkMode
                          ? "bg-emerald-500/5 border border-emerald-500/20"
                          : "bg-emerald-500/5 border border-emerald-500/20"
                      }`}
                    >
                      <motion.div
                        animate={{ rotate: [0, -10, 10, -10, 0] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      >
                        <Lock className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      </motion.div>
                      <div>
                        <div
                          className={`text-xs font-semibold mb-1 flex items-center gap-1 ${darkMode ? "text-emerald-400" : "text-emerald-600"}`}
                        >
                          <Sparkles className="w-3 h-3" />
                          256-Bit SSL Encryption
                        </div>
                        <div
                          className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                        >
                          Your payment information is encrypted and secure
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right Column - Form */}
                  <div className="space-y-4">
                    {/* Card Information */}
                    <div>
                      <h3
                        className={`text-base font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Card Information
                      </h3>

                      {/* Card Number */}
                      <div className="mb-3">
                        <label
                          className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Card Number
                        </label>
                        <div className="relative">
                          <CreditCard
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                              focusedField === "cardNumber"
                                ? darkMode
                                  ? "text-cyan-400"
                                  : "text-blue-600"
                                : darkMode
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            }`}
                          />
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            onFocus={() => setFocusedField("cardNumber")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="1234 5678 9012 3456"
                            className={`w-full pl-10 pr-10 py-2.5 rounded-xl font-mono text-sm transition-all duration-300 ${
                              errors.cardNumber
                                ? "border-2 border-red-500"
                                : focusedField === "cardNumber"
                                  ? darkMode
                                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500 shadow-lg shadow-cyan-500/20"
                                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400 shadow-lg shadow-blue-500/20"
                                  : darkMode
                                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                            }`}
                          />
                          {cardNumber && !errors.cardNumber && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <Check className="w-4 h-4 text-emerald-500" />
                            </motion.div>
                          )}
                        </div>
                        {errors.cardNumber && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-xs text-red-500 mt-1"
                          >
                            {errors.cardNumber}
                          </motion.div>
                        )}
                      </div>

                      {/* Card Name */}
                      <div className="mb-3">
                        <label
                          className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                        >
                          Cardholder Name
                        </label>
                        <div className="relative">
                          <User
                            className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                              focusedField === "cardName"
                                ? darkMode
                                  ? "text-cyan-400"
                                  : "text-blue-600"
                                : darkMode
                                  ? "text-gray-500"
                                  : "text-gray-400"
                            }`}
                          />
                          <motion.input
                            whileFocus={{ scale: 1.01 }}
                            type="text"
                            value={cardName}
                            onChange={(e) =>
                              setCardName(e.target.value.toUpperCase())
                            }
                            onFocus={() => setFocusedField("cardName")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="JOHN DOE"
                            className={`w-full pl-10 pr-10 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                              errors.cardName
                                ? "border-2 border-red-500"
                                : focusedField === "cardName"
                                  ? darkMode
                                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500 shadow-lg shadow-cyan-500/20"
                                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400 shadow-lg shadow-blue-500/20"
                                  : darkMode
                                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                            }`}
                          />
                          {cardName && !errors.cardName && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute right-3 top-1/2 -translate-y-1/2"
                            >
                              <Check className="w-4 h-4 text-emerald-500" />
                            </motion.div>
                          )}
                        </div>
                      </div>

                      {/* Expiry & CVV */}
                      <div className="grid grid-cols-3 gap-2">
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            Month
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="text"
                            value={expiryMonth}
                            onChange={(e) =>
                              setExpiryMonth(
                                e.target.value
                                  .replace(/\D/g, "")
                                  .substring(0, 2),
                              )
                            }
                            onFocus={() => setFocusedField("expiryMonth")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="MM"
                            className={`w-full px-3 py-2.5 rounded-xl font-mono text-center text-sm transition-all duration-300 ${
                              errors.expiryMonth
                                ? "border-2 border-red-500"
                                : focusedField === "expiryMonth"
                                  ? darkMode
                                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                                  : darkMode
                                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            Year
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="text"
                            value={expiryYear}
                            onChange={(e) =>
                              setExpiryYear(
                                e.target.value
                                  .replace(/\D/g, "")
                                  .substring(0, 2),
                              )
                            }
                            onFocus={() => setFocusedField("expiryYear")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="YY"
                            className={`w-full px-3 py-2.5 rounded-xl font-mono text-center text-sm transition-all duration-300 ${
                              errors.expiryYear
                                ? "border-2 border-red-500"
                                : focusedField === "expiryYear"
                                  ? darkMode
                                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                                  : darkMode
                                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                            }`}
                          />
                        </div>
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            CVV
                          </label>
                          <motion.input
                            whileFocus={{ scale: 1.02 }}
                            type="password"
                            value={cvv}
                            onChange={(e) =>
                              setCvv(
                                e.target.value
                                  .replace(/\D/g, "")
                                  .substring(0, 4),
                              )
                            }
                            onFocus={() => setFocusedField("cvv")}
                            onBlur={() => setFocusedField(null)}
                            placeholder="•••"
                            className={`w-full px-3 py-2.5 rounded-xl font-mono text-center text-sm transition-all duration-300 ${
                              errors.cvv
                                ? "border-2 border-red-500"
                                : focusedField === "cvv"
                                  ? darkMode
                                    ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                                    : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                                  : darkMode
                                    ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                    : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Billing Information */}
                    <div>
                      <h3
                        className={`text-base font-bold mb-3 ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Billing Information
                      </h3>

                      <div className="space-y-3">
                        {/* Email */}
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            Email
                          </label>
                          <div className="relative">
                            <Mail
                              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                                focusedField === "billingEmail"
                                  ? darkMode
                                    ? "text-cyan-400"
                                    : "text-blue-600"
                                  : darkMode
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              }`}
                            />
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="email"
                              value={billingEmail}
                              onChange={(e) => setBillingEmail(e.target.value)}
                              onFocus={() => setFocusedField("billingEmail")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="john@example.com"
                              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                                errors.billingEmail
                                  ? "border-2 border-red-500"
                                  : focusedField === "billingEmail"
                                    ? darkMode
                                      ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                                      : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                                    : darkMode
                                      ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                      : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                              }`}
                            />
                          </div>
                        </div>

                        {/* Address */}
                        <div>
                          <label
                            className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                          >
                            Address
                          </label>
                          <div className="relative">
                            <MapPin
                              className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                                focusedField === "billingAddress"
                                  ? darkMode
                                    ? "text-cyan-400"
                                    : "text-blue-600"
                                  : darkMode
                                    ? "text-gray-500"
                                    : "text-gray-400"
                              }`}
                            />
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={billingAddress}
                              onChange={(e) =>
                                setBillingAddress(e.target.value)
                              }
                              onFocus={() => setFocusedField("billingAddress")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="123 Main Street"
                              className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                                errors.billingAddress
                                  ? "border-2 border-red-500"
                                  : focusedField === "billingAddress"
                                    ? darkMode
                                      ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                                      : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                                    : darkMode
                                      ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                      : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                              }`}
                            />
                          </div>
                        </div>

                        {/* City & Zip */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label
                              className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                            >
                              City
                            </label>
                            <div className="relative">
                              <Building
                                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors duration-300 ${
                                  focusedField === "billingCity"
                                    ? darkMode
                                      ? "text-cyan-400"
                                      : "text-blue-600"
                                    : darkMode
                                      ? "text-gray-500"
                                      : "text-gray-400"
                                }`}
                              />
                              <motion.input
                                whileFocus={{ scale: 1.01 }}
                                type="text"
                                value={billingCity}
                                onChange={(e) => setBillingCity(e.target.value)}
                                onFocus={() => setFocusedField("billingCity")}
                                onBlur={() => setFocusedField(null)}
                                placeholder="New York"
                                className={`w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                                  errors.billingCity
                                    ? "border-2 border-red-500"
                                    : focusedField === "billingCity"
                                      ? darkMode
                                        ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                                        : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                                      : darkMode
                                        ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                        : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                                }`}
                              />
                            </div>
                          </div>
                          <div>
                            <label
                              className={`block text-xs font-semibold mb-2 ${darkMode ? "text-gray-300" : "text-gray-700"}`}
                            >
                              Zip
                            </label>
                            <motion.input
                              whileFocus={{ scale: 1.01 }}
                              type="text"
                              value={billingZip}
                              onChange={(e) => setBillingZip(e.target.value)}
                              onFocus={() => setFocusedField("billingZip")}
                              onBlur={() => setFocusedField(null)}
                              placeholder="10001"
                              className={`w-full px-4 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                                errors.billingZip
                                  ? "border-2 border-red-500"
                                  : focusedField === "billingZip"
                                    ? darkMode
                                      ? "bg-black/60 border-2 border-cyan-500/50 text-white placeholder-gray-500"
                                      : "bg-white border-2 border-blue-500 text-gray-900 placeholder-gray-400"
                                    : darkMode
                                      ? "bg-black/40 border border-white/10 text-white placeholder-gray-500"
                                      : "bg-white border border-gray-300 text-gray-900 placeholder-gray-400"
                              }`}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Set as Default */}
                    <motion.div
                      whileHover={{ scale: 1.01 }}
                      className={`p-3 rounded-xl flex items-center justify-between ${
                        darkMode
                          ? "bg-black/40 backdrop-blur-xl border border-white/10"
                          : "bg-gray-50 border border-gray-200"
                      }`}
                    >
                      <div
                        className={`text-xs font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}
                      >
                        Set as default payment method
                      </div>
                      <button
                        onClick={() => setSetAsDefault(!setAsDefault)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${
                          setAsDefault
                            ? darkMode
                              ? "bg-linear-to-r from-cyan-400 to-blue-500 shadow-lg shadow-cyan-500/50"
                              : "bg-linear-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                            : darkMode
                              ? "bg-gray-700"
                              : "bg-gray-300"
                        }`}
                      >
                        <motion.div
                          animate={{ x: setAsDefault ? 24 : 4 }}
                          transition={{
                            type: "spring",
                            stiffness: 500,
                            damping: 30,
                          }}
                          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-lg"
                        />
                      </button>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div
                className={`p-4 border-t shrink-0 ${
                  darkMode
                    ? "border-white/10 bg-black/20"
                    : "border-gray-200 bg-gray-50/50"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`text-xs flex items-center gap-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}
                  >
                    <Lock className="w-3 h-3" />
                    Your payment is encrypted and secure
                  </div>
                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={onClose}
                      className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                        darkMode
                          ? "bg-white/5 border border-white/10 text-gray-400 hover:bg-white/10"
                          : "bg-gray-100 border border-gray-200 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      Cancel
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleSubmit}
                      className={`px-6 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 ${
                        darkMode
                          ? "bg-linear-to-r from-cyan-400 to-blue-500 text-white shadow-lg shadow-cyan-500/50"
                          : "bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      Add Card
                    </motion.button>
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
