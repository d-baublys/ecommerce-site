import { auth } from "@/auth";
import NavBarClient from "@/ui/components/NavBarClient";
import SessionWrapper from "@/ui/components/misc/SessionWrapper";

export default async function NavBar() {
    const session = await auth();

    return (
        <SessionWrapper session={session}>
            <NavBarClient />
        </SessionWrapper>
    );
}
