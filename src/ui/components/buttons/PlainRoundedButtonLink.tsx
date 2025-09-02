"use client";

import { getPlainButtonClasses } from "@/lib/ui-class-repo";
import RoundedButtonLink, { RoundedButtonLinkProps } from "./base/RoundedButtonLink";

export default function PlainRoundedButtonLink({
    href,
    overrideClasses,
    ...restProps
}: RoundedButtonLinkProps) {
    const plainClasses = getPlainButtonClasses();

    return (
        <RoundedButtonLink
            href={href}
            overrideClasses={`${plainClasses} ${overrideClasses ?? ""}`}
            {...restProps}
        >
            {restProps.children}
        </RoundedButtonLink>
    );
}
