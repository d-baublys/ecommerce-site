export default function Home() {
    return (
        <div className="flex flex-col items-center justify-items-center min-h-screen font-[family-name:var(--font-geist-sans)]">
            <nav className="flex w-full h-16 bg-yellow-400"></nav>
            <main className="flex flex-col grow w-full items-center bg-red-400">
                <div></div>
            </main>
            <footer className="flex gap-[24px] flex-wrap justify-center items-center w-full min-h-[300px] bg-green-400">
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
            </footer>
        </div>
    );
}
