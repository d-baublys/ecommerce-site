import type { Metadata } from "next";
import { Lexend_Exa } from "next/font/google";
import "@/styles/globals.css";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const lexendExa = Lexend_Exa({ variable: "--font-lexend-exa", subsets: ["latin"] });

export const metadata: Metadata = {
    title: "D-Wear",
    description: 'The "Next" best thing in t-shirts.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={`${lexendExa.variable} antialiased`}>
                <div className="flex flex-col justify-center items-center min-h-screen">
                    <NavBar />
                    <main className="relative flex flex-col grow w-full justify-center items-center bg-contrasted overflow-hidden z-0">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    );
}
