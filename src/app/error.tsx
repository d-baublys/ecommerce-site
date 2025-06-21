"use client"; // must for error files

import RoundedButton from "@/ui/components/buttons/RoundedButton";
import BareLayout from "@/ui/layouts/BareLayout";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <BareLayout>
            <p>{error ? `${error.message}` : "Something went wrong!"}</p>
            <RoundedButton onClick={() => reset()}>Try Again</RoundedButton>
        </BareLayout>
    );
}
