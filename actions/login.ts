"use server";

import * as z from "zod";

import { db } from "@/lib/db";
import { signIn } from "@/auth";
import { Totp } from "time2fa";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";
import { generateVerificationToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { sendVerificationEmail } from "@/lib/mail";
import { getUserSecretByUserId } from "@/data/two-factor";

export const login = async (values: z.infer<typeof LoginSchema>, callbackUrl?: string) => {
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid Fields!" };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: "Email doesn't exist" }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email, existingUser.id);

    await sendVerificationEmail(verificationToken.email, verificationToken.token);

    return { success: "Confirmation email sent!" }
  }

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      const existingSecret = await getUserSecretByUserId(existingUser.id);
  
      if (!existingSecret) {
        return { error: "2FA secret not found!" }
      }

      const isValid = Totp.validate({ passcode: code, secret: existingSecret.secret, drift: 3 });

      if (isValid) {
        await db.twoFactorConfirmation.create({
          data: {
            userId: existingUser.id
          }
        });
      } else {
        return { twoFaError: "Wrong 2FA code" }
      }
    } else {
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid credentials" }
        case "AuthorizedCallbackError":
          if (error.cause && error.cause.reason === "2FA CHECK FAILED") {
            return { error: "2FA Check Failed" }
          } else {
            return { error: "Something went wrong" }
          }
        default:
          return { error: "Something went wrong" }
      }
    }

    throw error;
  }
};