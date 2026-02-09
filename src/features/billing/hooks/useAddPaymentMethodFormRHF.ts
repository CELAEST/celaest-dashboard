/**
 * useAddPaymentMethodForm - React Hook Form + Zod version
 *
 * Migrated from useState-based form to RHF with Zod validation.
 * This is the recommended pattern for all forms.
 */

import { useForm, UseFormReturn, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCardNumber, getCardType } from "@/lib/validation/schemas/billing";

// =============================================================================
// Schema (extended for this specific form)
// =============================================================================

const addPaymentMethodFormSchema = z.object({
  cardNumber: z
    .string()
    .min(13, "Card number too short")
    .max(19, "Card number too long"),

  cardName: z
    .string()
    .min(1, "Cardholder name is required")
    .max(100, "Name too long"),

  expiryMonth: z
    .string()
    .regex(/^(0[1-9]|1[0-2])$/, "Invalid month (01-12)"),

  expiryYear: z
    .string()
    .length(2, "Use 2-digit year")
    .regex(/^\d{2}$/, "Invalid year"),

  cvv: z
    .string()
    .min(3, "CVV must be 3-4 digits")
    .max(4, "CVV must be 3-4 digits")
    .regex(/^\d+$/, "Only numbers allowed"),

  billingEmail: z
    .string()
    .email("Invalid email address"),

  billingAddress: z
    .string()
    .min(1, "Address is required"),

  billingCity: z
    .string()
    .min(1, "City is required"),

  billingZip: z
    .string()
    .min(1, "Zip code is required"),

  isDefault: z.boolean().default(false),
});

export type AddPaymentMethodFormData = z.infer<typeof addPaymentMethodFormSchema>;

// =============================================================================
// Hook
// =============================================================================

interface UseAddPaymentMethodFormResult {
  form: UseFormReturn<AddPaymentMethodFormData>;
  cardType: "visa" | "mastercard" | "amex" | "unknown";
  handleCardNumberChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: () => void;
  isSubmitting: boolean;
}

export const useAddPaymentMethodFormRHF = (
  onClose: () => void
): UseAddPaymentMethodFormResult => {
  const form = useForm<AddPaymentMethodFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(addPaymentMethodFormSchema) as any,
    mode: "onBlur", // Validate on blur for better UX
    reValidateMode: "onChange", // Re-validate on change after first submit
    defaultValues: {
      cardNumber: "",
      cardName: "",
      expiryMonth: "",
      expiryYear: "",
      cvv: "",
      billingEmail: "",
      billingAddress: "",
      billingCity: "",
      billingZip: "",
      isDefault: false,
    },
  });

  const cardNumber = useWatch({
    control: form.control,
    name: "cardNumber",
    defaultValue: "",
  });
  const cardType = getCardType(cardNumber);

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    form.setValue("cardNumber", formatted, { shouldValidate: true });
  };

  // Submit handler - wraps RHF's handleSubmit
  const handleSubmit = form.handleSubmit(async (data) => {
    console.log("Adding payment method...", data);
    // TODO: API call here
    // await api.addPaymentMethod(data);
    onClose();
  });

  return {
    form,
    cardType,
    handleCardNumberChange,
    handleSubmit,
    isSubmitting: form.formState.isSubmitting,
  };
};

// =============================================================================
// Legacy export (for gradual migration)
// =============================================================================

/**
 * @deprecated Use useAddPaymentMethodFormRHF instead
 * This export maintains backward compatibility during migration
 */
export { useAddPaymentMethodFormRHF as useAddPaymentMethodFormV2 };
