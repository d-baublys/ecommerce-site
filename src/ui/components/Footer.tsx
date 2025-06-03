import Link from "next/link";

export default function Footer() {
    return (
        <footer className="flex flex-col gap-[48px] flex-wrap justify-center items-center w-full min-h-[300px] px-(--gutter) md:px-(--gutter-md) bg-background text-contrasted">
            <div className="flex flex-wrap justify-center items-center gap-[24px]">
                <Link
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href={"/"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    About
                </Link>
                <Link
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href={"/"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Support
                </Link>
                <Link
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href={"/"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Policies
                </Link>
                <Link
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href={"/"}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Sitemap
                </Link>
            </div>
            <span className="text-sz-label-button lg:text-sz-label-button-lg">
                ©2025 by DB-Wear
            </span>
        </footer>
    );
}
