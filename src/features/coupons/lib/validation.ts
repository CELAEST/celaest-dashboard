import { z } from "zod";

export const CreateCouponSchema = z.object({
  code: z
    .string()
    .min(3, "El código debe tener al menos 3 caracteres")
    .max(50, "El código debe tener menos de 50 caracteres")
    .regex(/^[A-Z0-9_-]+$/, "El código solo puede contener letras mayúsculas, números, guiones y guiones bajos"),
  discount_type: z.enum(["percentage", "fixed_amount"]),
  discount_value: z.coerce.number().min(0.01, "El descuento debe ser mayor a 0"),
  max_redemptions: z.coerce.number().min(1, "Debe ser al menos 1").nullable().optional(),
  expires_at: z.string().nullable().optional(),
  currency: z.string().default("USD"),
}).refine((data) => {
  if (data.discount_type === "percentage" && data.discount_value > 100) {
    return false;
  }
  return true;
}, {
  message: "El descuento porcentual no puede superar el 100%",
  path: ["discount_value"],
});

export type CreateCouponFormValues = z.infer<typeof CreateCouponSchema>;
