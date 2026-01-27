import { useState } from "react";
import { PaymentMethod } from "../types";

export const useEditPaymentMethodForm = (
  method: PaymentMethod,
  onClose: () => void,
  onSave: (method: PaymentMethod) => void
) => {
  const [cardName, setCardName] = useState(method.holderName);
  const [expiryMonth, setExpiryMonth] = useState(method.expiryMonth);
  const [expiryYear, setExpiryYear] = useState(method.expiryYear);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!cardName || cardName.length < 3)
      newErrors.cardName = "Name is required";
    if (
      !expiryMonth ||
      parseInt(expiryMonth, 10) < 1 ||
      parseInt(expiryMonth, 10) > 12
    ) {
      newErrors.expiryMonth = "Invalid month";
    }
    const currentYear = new Date().getFullYear() % 100;
    if (!expiryYear || parseInt(expiryYear, 10) < currentYear) {
      newErrors.expiryYear = "Invalid year";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        ...method,
        holderName: cardName,
        expiryMonth,
        expiryYear,
      });
      onClose();
    }
  };

  return {
    formState: {
      cardName,
      expiryMonth,
      expiryYear,
    },
    setters: {
      setCardName,
      setExpiryMonth,
      setExpiryYear,
    },
    errors,
    focusedField,
    setFocusedField,
    handleSave,
  };
};
