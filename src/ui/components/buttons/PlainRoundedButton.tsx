"use client";

import { getPlainButtonClasses } from "@/lib/ui-class-repo";
import RoundedButtonMain, { RoundedButtonProps } from "./base/RoundedButtonMain";

export default function PlainRoundedButton({ overrideClasses, ...restProps }: RoundedButtonProps) {
    const plainClasses = getPlainButtonClasses();

    return (
        <RoundedButtonMain
            overrideClasses={`${plainClasses} ${overrideClasses ?? ""}`}
            {...restProps}
        >
            {restProps.children}
        </RoundedButtonMain>
    );
}
