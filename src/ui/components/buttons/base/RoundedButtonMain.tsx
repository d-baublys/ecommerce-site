"use client";

import RoundedButtonBase from "@/ui/components/buttons/base/RoundedButtonBase";

export interface RoundedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    ref?: React.RefObject<HTMLButtonElement | null>;
    overrideClasses?: string;
}

export default function RoundedButtonMain({
    ref,
    type = "button",
    overrideClasses,
    ...restProps
}: RoundedButtonProps) {
    return (
        <button ref={ref} type={type} {...restProps} className="flex w-full rounded-full">
            <RoundedButtonBase overrideClasses={overrideClasses}>
                {restProps.children}
            </RoundedButtonBase>
        </button>
    );
}
