import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";
import NavBarClient from "@/ui/components/NavBarClient";

export default async function NavBar() {
    const session = await auth();

    if (session && session.user) {
        session.user = {
            name: session.user.name,
            email: session.user.email,
        };
    }

    return (
        <SessionProvider session={session}>
            <NavBarClient />
        </SessionProvider>
    );
}
