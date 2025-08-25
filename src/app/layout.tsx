import type { Metadata } from "next";
import "@/ui/styles/globals.css";
import NavBar from "@/ui/components/NavBar";
import Footer from "@/ui/components/Footer";
import { lexendExa } from "@/ui/fonts";
import SearchOverlay from "@/ui/components/overlays/SearchOverlay";
import SessionWrapper from "@/ui/components/misc/SessionWrapper";
import { auth } from "@/auth";

export const metadata: Metadata = {
    title: {
        template: "%s | DB-Wear",
        default: "DB-Wear",
    },
    description: 'The "Next" best thing in t-shirts.',
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await auth();
    return (
        <html lang="en">
            <body
                className={`${lexendExa.variable} antialiased text-sz-base lg:text-sz-base-lg global-constraints min-h-screen flex flex-col`}
            >
                <SessionWrapper session={session}>
                    <div className="flex flex-col justify-center items-center w-full min-w-fit h-full flex-1">
                        <NavBar />
                        <main className="relative flex flex-1 min-w-full min-h-full bg-white">
                            {children}
                        </main>
                        <Footer />
                    </div>
                    <SearchOverlay />
                </SessionWrapper>
            </body>
        </html>
    );
}
