import { UserRole } from "@prisma/client";
import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(1, {
    message: "Password is required",
  }),
  code: z.optional(z.string().length(6, { 
      message: "Invalid 2FA code" 
    }).refine((code) => isNumeric(code), {
      message: "Invalid 2FA code"
    }))
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  }),
  password: z.string().min(6, {
    message: "Minimum 6 characters required",
  }),
  name: z.string().min(1, {
    message: "Name is required"
  })
})

export const ResetSchema = z.object({
  email: z.string().email({
    message: "Email is required"
  })
});

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "Minimum 6 characters required"
  })
});

export const SettingsSchema = z.object({
  name: z.string().min(1, { message: "Name cannot be empty" }),
  isTwoFactorEnabled: z.optional(z.boolean()),
  role: z.optional(z.enum([UserRole.ADMIN, UserRole.USER])),
  email: z.string().email(),
  password: z.optional(z.string().min(6)),
  newPassword: z.optional(z.string().min(6)),
})
  .refine((data) => {
    if (data.password && !data.newPassword) {
      return false
    }

    return true
  }, {
    message: "New Password is required",
    path: ["newPassword"]
  })
  .refine((data) => {
    if (data.newPassword && !data.password) {
      return false
    }

    return true
  }, {
    message: "Password is required",
    path: ["password"]
  });

function isNumeric(value: string) {
    return /^[0-9]+$/.test(value);
}

export const TwoFactorSchema = z.object({
  code: z.string().length(6, { 
    message: "Invalid 2FA code" 
  }).refine((code) => isNumeric(code), {
    message: "Invalid 2FA code"
  })
});