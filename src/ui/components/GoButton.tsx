import RoundedButton, { RoundedButtonProps } from "./RoundedButton";

interface GoButtonProps extends RoundedButtonProps {
    predicate: boolean;
    overrideClasses?: string;
}

export default function GoButton({ predicate, overrideClasses, ...props }: GoButtonProps) {
    return (
        <RoundedButton
            overrideClasses={`text-contrasted ${
                predicate
                    ? "!bg-go-color !border-go-color"
                    : "!bg-component-color !border-component-color hover:!scale-none hover:!cursor-auto active:!drop-shadow-none"
            } ${overrideClasses ?? ""}`}
            {...props}
        >
            {props.children}
        </RoundedButton>
    );
}
