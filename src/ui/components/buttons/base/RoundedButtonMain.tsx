"use client";

import RoundedButtonBase from "@/ui/components/buttons/base/RoundedButtonBase";

export interface RoundedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    overrideClasses?: string;
}

export default function RoundedButtonMain({
    type = "button",
    overrideClasses,
    ...restProps
}: RoundedButtonProps) {
    return (
        <button type={type} {...restProps} className="flex w-full rounded-full">
            <RoundedButtonBase overrideClasses={overrideClasses}>
                {restProps.children}
            </RoundedButtonBase>
        </button>
    );
}
