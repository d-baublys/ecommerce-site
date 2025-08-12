import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        user?: User & DefaultSession["user"];
    }

    interface User {
        role: string;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        user?: User;
    }
}
