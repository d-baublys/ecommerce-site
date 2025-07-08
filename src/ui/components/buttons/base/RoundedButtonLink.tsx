"use client";

import Link from "next/link";
import RoundedButtonBase from "@/ui/components/buttons/base/RoundedButtonBase";

export interface RoundedButtonLinkProps extends React.ComponentProps<typeof Link> {
    overrideClasses?: string;
}

export default function RoundedButtonLink({
    href,
    overrideClasses,
    ...restProps
}: RoundedButtonLinkProps) {
    return (
        <Link href={href} {...restProps} className="flex w-full rounded-full">
            <RoundedButtonBase overrideClasses={overrideClasses}>
                {restProps.children}
            </RoundedButtonBase>
        </Link>
    );
}
