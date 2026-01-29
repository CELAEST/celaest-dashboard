import * as z from "zod";

// =============================================================================
// Login Schema
// =============================================================================

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// =============================================================================
// Signup Schema
// =============================================================================

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, "Name must be at least 2 characters"),
});

export type SignupFormValues = z.infer<typeof signupSchema>;

// =============================================================================
// Initial Setup (Super Admin) Schema
// =============================================================================

export const initialSetupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type InitialSetupFormData = z.infer<typeof initialSetupSchema>;
