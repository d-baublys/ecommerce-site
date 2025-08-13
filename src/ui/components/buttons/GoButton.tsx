"use client";

import { getGoButtonClasses } from "@/lib/ui-class-repo";
import RoundedButtonMain, {
    RoundedButtonProps,
} from "@/ui/components/buttons/base/RoundedButtonMain";

interface GoButtonProps extends RoundedButtonProps {
    predicate: boolean;
}

export default function GoButton({ predicate, overrideClasses, ...restProps }: GoButtonProps) {
    const goButtonClasses = getGoButtonClasses(predicate);

    return (
        <RoundedButtonMain
            overrideClasses={`${goButtonClasses} ${overrideClasses ?? ""}`}
            {...restProps}
        >
            {restProps.children}
        </RoundedButtonMain>
    );
}
