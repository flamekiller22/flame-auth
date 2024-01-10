import { db } from "@/lib/db";

export const getUserSecretByUserId = async (userId: string) => {
  try {
    const secretObject = await db.twoFactorSecret.findFirst({
      where: {
        userId
      }
    });

    return secretObject;
  } catch {
    return null;
  }
}

export const getTwoFactorConfirmationByUserId = async (userId: string) => {
  try {
    const twoFactorConfirmation = await db.twoFactorConfirmation.findUnique({
      where: { userId }
    });

    return twoFactorConfirmation;
  } catch {
    return null;
  }
}