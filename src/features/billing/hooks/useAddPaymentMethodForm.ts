import { useState } from "react";

interface FormErrors {
  cardNumber?: string;
  cardName?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  billingEmail?: string;
  billingAddress?: string;
  billingCity?: string;
  billingZip?: string;
}

export const useAddPaymentMethodForm = (onClose: () => void) => {
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
  const [errors, setErrors] = useState<FormErrors>({});
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

  const cardType = detectCardType(cardNumber);

  const validateForm = () => {
    const newErrors: FormErrors = {};

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

  return {
    formState: {
      cardNumber,
      cardName,
      expiryMonth,
      expiryYear,
      cvv,
      billingEmail,
      billingAddress,
      billingCity,
      billingZip,
      setAsDefault,
    },
    setters: {
      setCardNumber,
      setCardName,
      setExpiryMonth,
      setExpiryYear,
      setCvv,
      setBillingEmail,
      setBillingAddress,
      setBillingCity,
      setBillingZip,
      setSetAsDefault,
    },
    errors,
    focusedField,
    setFocusedField,
    handleCardNumberChange,
    cardType,
    handleSubmit,
  };
};
