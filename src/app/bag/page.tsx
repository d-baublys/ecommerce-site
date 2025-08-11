import { Metadata } from "next";
import BagPageClient from "./BagPageClient";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
    title: "My Bag",
};

export default async function BagPage() {
    const session = await auth();

    if (session && session.user) {
        session.user = {
            id: session.user.id,
            email: session.user.email,
            role: session.user.role,
        };
    }

    return (
        <SessionProvider>
            <BagPageClient />
        </SessionProvider>
    );
}
