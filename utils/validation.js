import * as z from "zod";

export const acceptedFormats = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const schema = z.object({
  name: z.string().max(30, "Максимум 30 символов"),
  email: z.string().max(40, "Максимум 40 символов").min(5, "Минимум 5 символов"),
  vin: z.string().max(50, "Максимум 50 символов").optional(),
  message: z.string().max(500, "Максимум 500 символов").optional(),
  fileUrl: z.string().optional(),
});
