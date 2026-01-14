import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import baseAuthConfig from "./auth.config";
import { getUser } from "@/lib/actions";
import { comparePasswords } from "@/lib/utils";

const serverAuthConfig: NextAuthConfig = {
    ...baseAuthConfig,
    providers: [
        Credentials({
            async authorize(credentials) {
                const user = await getUser(credentials.email as string);

                if (user.data) {
                    const userData = user.data;
                    const verifiedPassword = await comparePasswords(
                        credentials.password as string,
                        userData.password
                    );

                    if (verifiedPassword) {
                        return {
                            id: String(userData.id),
                            email: userData.email,
                            role: userData.role,
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
