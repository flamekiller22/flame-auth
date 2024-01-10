import { type UserRole } from "@prisma/client";
import NextAuth, { type DefaultSession } from "next-auth";
// import type { JWT } from "@auth/core/jwt";
// import type { Session } from "@auth/core/types";

// declare module "@auth/core/jwt" {
//   interface JWT {
//     role: UserRole;
//     isTwoFactorEnabled: boolean;
//     isOAuth: boolean;
//   }
// }

// declare module "@auth/core/types" {
//   interface Session {
//     user: {
//       role: UserRole;
//       isTwoFactorEnabled: boolean;
//       isOAuth: boolean;
//     } & Session["user"];
//   }
// }

export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
  isTwoFactorEnabled: boolean;
  isOAuth: boolean;
}

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}

