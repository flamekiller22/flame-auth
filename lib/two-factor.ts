import { Totp } from "time2fa";

export const generateTotpKey = (email: string) => {
  const key = Totp.generateKey({
    issuer: "flame-auth",
    user: email
  });

  console.log("TOTP KEY GENERATED: \n", generateTotpKey, "\n\n");

  return key;
}