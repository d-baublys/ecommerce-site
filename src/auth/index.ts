import { getUser } from "@/lib/actions";
import { comparePasswords } from "@/lib/utils";
import NextAuth, { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const runtime = "nodejs";

const authOptions: NextAuthConfig = {
    providers: [
        Credentials({
            async authorize(credentials) {
                const user = await getUser(credentials.email as string);

                if (user) {
                    const verifiedPassword = await comparePasswords(
                        credentials.password as string,
                        user.password
                    );

                    if (verifiedPassword) {
                        return { id: user.id, email: user.email, role: user.role };
                    }
                }

                return null;
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) token.role = user.role;
            return token;
        },
        session({ session, token }) {
            session.user.role = token.role as string;
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);
