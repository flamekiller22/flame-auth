"use server";

import { Totp } from "time2fa";
import { getUserSecretByUserId } from "@/data/two-factor";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { currentUser } from "@/lib/auth";

export const firstCheckTwoFactor = async (secret: string, code: string) => {
  try {
    const user = await currentUser();
    if (!user) return { error: "Unauthorised" }
    if (typeof user.email !== "string") return { error: "User email not found!" }

    const existingUser = await getUserByEmail(user.email);
    if (!existingUser) {
      return { error: "User not found!" }
    }
  
    const existingSecret = await getUserSecretByUserId(user.id);
  
    if (existingSecret) {
      await db.twoFactorSecret.delete({
        where: {
          id: existingSecret.id
        }
      });
    }

    const isValid = Totp.validate({ passcode: code, secret, drift: 3 });

    if (isValid) {
      await db.twoFactorSecret.create({
        data: {
          userId: user.id,
          secret
        }
      });

      await db.user.update({
        where: { id: user.id },
        data: { isTwoFactorEnabled: true }
      });

      return { success: "2FA enabled!" }
    }

    return { error: "Code does not match!" }
  } catch {
    return { error: "Something went wrong!" }
  }
}