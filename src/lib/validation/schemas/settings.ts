/**
 * Settings Validation Schemas
 */

import { z } from "zod";

// =============================================================================
// Profile
// =============================================================================

export const profileSchema = z.object({
  displayName: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name too long"),
  
  jobTitle: z
    .string()
    .max(50, "Job title too long")
    .optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

// =============================================================================
// Security - Change Password
// =============================================================================

export const changePasswordSchema = z.object({
  currentPassword: z
    .string()
    .min(1, "Current password is required"),
    
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
    
  confirmPassword: z
    .string()
    .min(1, "Please confirm your password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// =============================================================================
// Email Change
// =============================================================================

export const emailChangeSchema = z.object({
  newEmail: z
    .string()
    .email("Invalid email address"),
    
  currentPassword: z
    .string()
    .min(1, "Password is required to confirm changes"),
});

export type EmailChangeFormData = z.infer<typeof emailChangeSchema>;

// =============================================================================
// Workspace Profile
// =============================================================================

export const workspaceProfileSchema = z.object({
  workspaceName: z
    .string()
    .min(3, "Workspace name must be at least 3 characters")
    .max(50, "Name too long"),
    
  slug: z
    .string()
    .min(3, "Slug must be at least 3 characters")
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and dashes"),
});

export type WorkspaceProfileFormData = z.infer<typeof workspaceProfileSchema>;

// =============================================================================
// Invite Member
// =============================================================================

export const inviteMemberSchema = z.object({
  email: z.string().email("Invalid email address"),
  role: z.string().min(1, "Role is required"),
});

export type InviteMemberFormData = z.infer<typeof inviteMemberSchema>;
