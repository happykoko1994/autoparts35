import * as z from "zod";

export const acceptedFormats = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
];

export const schema = z.object({
  name: z.string().min(2, "Заполните поле"),
  email: z.string().email("Некорректный email"),
  vin: z.string().optional(),
  message: z.string().optional(),
  file: z.any(),
});
