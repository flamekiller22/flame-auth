"use server";

import { getUserById } from "@/data/user";
import { currentUser } from "@/lib/auth";
import { generateTotpKey } from "@/lib/two-factor";

export const addTwoFactor = async () => {
  try {
    const user = await currentUser();
    if (!user) return { error: "Unauthorised" }
    if (typeof user.email !== "string") return { error: "User email not found!" }

    const existingUser = await getUserById(user.id);
    if (!existingUser) {
      return { error: "User not found!" }
    }
  
    const newKey = generateTotpKey(user.email);

    return { success: { secret: newKey.secret, url: newKey.url }};
  } catch {
    return { error: "Something went wrong!" }
  }
}