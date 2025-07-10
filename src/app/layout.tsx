import type { Metadata } from "next";
import "@/ui/styles/globals.css";
import NavBar from "@/ui/components/NavBar";
import Footer from "@/ui/components/Footer";
import { lexendExa } from "@/ui/fonts";
import SearchOverlay from "@/ui/components/overlays/SearchOverlay";

export const metadata: Metadata = {
    title: "DB-Wear",
    description: 'The "Next" best thing in t-shirts.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${lexendExa.variable} antialiased text-sz-base lg:text-sz-base-lg`}>
                <div className="flex flex-col justify-center items-center min-h-screen">
                    <NavBar />
                    <main className="relative flex grow w-full bg-white">{children}</main>
                    <Footer />
                </div>
                <SearchOverlay />
            </body>
        </html>
    );
}
