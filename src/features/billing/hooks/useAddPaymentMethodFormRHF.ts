/**
 * useAddPaymentMethodForm - React Hook Form + Zod version
 *
 * Migrated from useState-based form to RHF with Zod validation.
 * This is the recommended pattern for all forms.
 */

import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { formatCardNumber, getCardType } from "@/lib/validation/schemas/billing";
import { useOrgStore } from "@/features/shared/stores/useOrgStore";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { billingApi } from "../api/billing.api";
import { toast } from "sonner";

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


  // REMOVED: useWatch here caused full re-renders on every keystroke.
  // const cardNumber = useWatch({ ... });
  // const cardType = getCardType(cardNumber);

  // Instead, we export a helper or just let components use useWatch internally.
  // usage: const cardType = getCardType(form.getValues("cardNumber")); 
  // helping valid initial render, but for reactive UI, use ConnectedCreditCardPreview

  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    form.setValue("cardNumber", formatted, { shouldValidate: true });
  };

  const { currentOrg } = useOrgStore();
  const { session } = useAuth();

  // Submit handler - wraps RHF's handleSubmit
  const handleSubmit = form.handleSubmit(async (data) => {
    if (!currentOrg?.id || !session?.accessToken) {
      toast.error("Authentication missing");
      return;
    }

    try {
      // Map frontend keys to backend keys
      await billingApi.createPaymentMethod(currentOrg.id, session.accessToken, {
        brand: getCardType(data.cardNumber),
        last4: data.cardNumber.slice(-4),
        expiry_month: parseInt(data.expiryMonth),
        expiry_year: parseInt(data.expiryYear),
        is_default: data.isDefault,
        type: "card",
        provider: "stripe",
      });

      toast.success("Payment method added successfully");
      onClose();
    } catch (err: any) {
      console.error("Failed to add payment method:", err);
      toast.error(err.message || "Failed to add payment method");
    }
  });

  return {
    form,
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
