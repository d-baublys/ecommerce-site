export default function Footer() {
    return (
        <footer className="flex flex-col gap-[48px] flex-wrap justify-center items-center w-full min-h-[300px] px-(--gutter) md:px-(--gutter-md) bg-background text-contrasted">
            <div className="flex flex-wrap justify-center items-center gap-[24px]">
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    About
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Support
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Policies
                </a>
                <a
                    className="flex items-center gap-2 hover:underline hover:underline-offset-4"
                    href="placeholder"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Sitemap
                </a>
            </div>
            <span className="text-sm">©2025 by DB-Wear</span>
        </footer>
    );
}
