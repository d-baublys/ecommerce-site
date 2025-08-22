import { Metadata } from "next";
import BagPageClient from "./BagPageClient";
import SessionWrapper from "@/ui/components/misc/SessionWrapper";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: "My Bag",
};

export default async function BagPage() {
    const session = await auth();

    return (
        <SessionWrapper session={session}>
            <BagPageClient />
        </SessionWrapper>
    );
}
