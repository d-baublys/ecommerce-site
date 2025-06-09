"use client";

import RoundedButton from "@/ui/components/RoundedButton";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="flex flex-col items-center text-center gap-8">
            <p>{error ? `${error.message}` : "Something went wrong!"}</p>
            <RoundedButton onClick={() => reset()}>Try Again</RoundedButton>
        </div>
    );
}
