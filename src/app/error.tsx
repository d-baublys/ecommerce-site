"use client"; // must for error files

import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
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
            <div>
                <PlainRoundedButton
                    onClick={() => reset()}
                    overrideClasses="!bg-background-lightest"
                >
                    Try Again
                </PlainRoundedButton>
            </div>
        </BareLayout>
    );
}
