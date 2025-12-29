import { z } from "zod";

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .max(63, { message: "Username must be less than 64 characters long" })
    .regex(/^[a-z0-9][a-z0-9-]*[a-z0-9]$/, {
      message:
        "Username must only contain lowercase letters, numbers, and hyphens",
    })
    .refine((value) => !value.includes("--"), {
      message: "Username must not contain consecutive hyphens",
    })
    .transform((value) => value.toLowerCase()),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(3, { message: "Password must be at least 3 characters long" }),
});

export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string(),
});
