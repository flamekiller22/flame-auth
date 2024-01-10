"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { db } from "@/lib/db";

export const disableTwoFactor = async () => {
  try {
    const user = await currentUser();
    if (!user) return { error: "Unauthorised" }
    if (typeof user.email !== "string") return { error: "User email not found!" }

    const existingUser = await getUserById(user.id);
    if (!existingUser) {
      return { error: "User not found!" }
    }
    
    await db.twoFactorSecret.delete({
      where: {
        userId: existingUser.id,
      }
    });

    await db.user.update({
      where: { id: existingUser.id },
      data: { isTwoFactorEnabled: false }
    });

    return { success: "2FA disabled!"};
  } catch {
    return { error: "Something went wrong!" }
  }
}