import type { Metadata } from "next";
import { Lexend_Exa } from "next/font/google";
import "@/styles/globals.css";

const sourceSans = Lexend_Exa({ variable: "--font-lexend-exa", subsets: ["latin"] });

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
            <body className={`${sourceSans.variable} antialiased`}>{children}</body>
        </html>
    );
}
