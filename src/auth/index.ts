import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

const authOptions: NextAuthConfig = {
    providers: [
        Credentials({
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                const adminUsername = process.env.ADMIN_USERNAME;
                const adminPassword = process.env.ADMIN_PASSWORD;

                if (!(adminUsername && adminPassword)) {
                    throw new Error("Missing admin login env variables");
                }

                if (
                    credentials?.username === adminUsername &&
                    credentials?.password === adminPassword
                ) {
                    return { id: "1", name: "admin" };
                }
                return null;
            },
        }),
    ],
    secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
