"use client";

import GeneralButton from "@/ui/components/GeneralButton";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center text-center gap-8">
            <p>
                <span>{error ? `${error.message}` : "Something went wrong!"}</span>
            </p>
            <GeneralButton onClick={() => reset()}>Try Again</GeneralButton>
        </div>
    );
}
