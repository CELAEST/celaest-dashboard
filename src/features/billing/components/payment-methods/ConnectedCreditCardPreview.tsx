"use client";

import React from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { CreditCardPreview } from "../ui/CreditCardPreview";
import { AddPaymentMethodFormData } from "../../hooks/useAddPaymentMethodFormRHF";

export const ConnectedCreditCardPreview: React.FC = () => {
  const { control } = useFormContext<AddPaymentMethodFormData>();

  // Watch values locally to prevent parent re-renders
  const cardNumber = useWatch({ control, name: "cardNumber" });
  const cardName = useWatch({ control, name: "cardName" });
  const expiryMonth = useWatch({ control, name: "expiryMonth" });
  const expiryYear = useWatch({ control, name: "expiryYear" });
  const cardType = "VISA"; // You might want to derive this from cardNumber

  // Note: focusedField might need a context or local state if critical,
  // but for now we skip it to avoid complex wiring, as discussed.

  return (
    <CreditCardPreview
      cardNumber={cardNumber}
      cardName={cardName}
      expiryMonth={expiryMonth}
      expiryYear={expiryYear}
      cardType={cardType}
      focusedField={null}
    />
  );
};
