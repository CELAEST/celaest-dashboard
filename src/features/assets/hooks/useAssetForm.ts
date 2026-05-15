import { z } from "zod";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const assetSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  type: z.enum(["excel", "script", "google-sheet", "software", "plugin", "theme", "template", "asset", "service"]),
  category_id: z.string().min(1, "Category is required"),
  price: z.number().min(0, "Price must be positive"),
  status: z.enum(["draft", "published", "archived"]),
  is_public: z.boolean(),
  description: z.string().optional(),
  features: z.string().optional(), 
  tags: z.string().optional(),
  technical_stack: z.string().optional(),
  requirements: z.string().optional(),
  min_plan_tier: z.number().min(0).max(4),
  external_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  github_repository: z.string().optional(),
  thumbnail_url: z.string().url("Must be a valid URL").or(z.literal("")).optional(),
  // Optional YouTube preview. Accepts any YouTube URL flavour or the bare
  // 11-char video id; the backend normalises and stores only the id. Empty
  // string clears the preview (falls back to thumbnail_url in the modal).
  // We deliberately don't z.string().url() here because youtu.be short
  // links are valid for us and a bare id (e.g. "dQw4w9WgXcQ") is also OK.
  youtube_url: z.string().max(255).optional(),
  pending_image: z.custom<File>()
    .superRefine((val, ctx) => {
      if (!val) return;
      if (!(val instanceof File)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "No es un archivo válido" });
        return;
      }
      if (val.size > MAX_IMAGE_SIZE) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La imagen debe pesar menos de 5MB" });
      }
      if (!ACCEPTED_IMAGE_TYPES.includes(val.type)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Formato no soportado (sólo JPG, PNG, WEBP, GIF)" });
      }
    }).optional().nullable(),
  productFile: z.custom<File>()
    .superRefine((val, ctx) => {
      if (!val) return;
      if (!(val instanceof File)) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "No es un archivo válido" });
        return;
      }
      if (val.size > MAX_FILE_SIZE) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El archivo no debe exceder los 50MB" });
      }
    }).optional().nullable(),
});

export type AssetFormValues = z.infer<typeof assetSchema>;
