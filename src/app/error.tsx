"use client";

import GeneralButton from "@/ui/components/GeneralButton";

export default function Error({ reset }: { reset: () => void }) {
    return (
        <div className="flex flex-col items-center text-center gap-8">
            {"Oops! Something went wrong."}
            <GeneralButton onClick={() => reset()}>Try Again</GeneralButton>
        </div>
    );
}
