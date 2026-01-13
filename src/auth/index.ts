import { prisma } from "@/lib/prisma";
import { compare } from "bcryptjs";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import baseAuthConfig from "./auth.config";

const serverAuthConfig: NextAuthConfig = {
    ...baseAuthConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                let user;

                try {
                    user = await prisma.user.findFirst({
                        where: { email: credentials.email as string },
                    });
                } catch (error) {
                    console.error("Error fetching user data: ", error);
                    return null;
                }

                if (user) {
                    const verifiedPassword = await compare(
                        credentials.password as string,
                        user.password
                    );

                    if (verifiedPassword) {
                        return {
                            id: String(user.id),
                            email: user.email,
                            role: user.role,
                        };
                    }
                }

                return null;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(serverAuthConfig);
