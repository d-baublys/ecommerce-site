export default function LoadingIndicator() {
    return (
        <div
            id="loading-indicator"
            aria-label="Loading indicator"
            className="fixed inset-0 flex justify-center items-center min-h-screen w-full z-[9999]"
        >
            <div className="flex justify-center items-center h-20 gap-[10px] p-4 bg-white rounded-2xl drop-shadow-(--button-shadow)">
                {Array.from({ length: 5 }).map((_, idx) => (
                    <div
                        key={idx}
                        className={`loading-circle w-auto h-3 aspect-square rounded-full border-2 border-component-color animate-loading-sequence`}
                    ></div>
                ))}
            </div>
        </div>
    );
}
