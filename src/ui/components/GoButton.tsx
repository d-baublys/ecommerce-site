import RoundedButton, { RoundedButtonProps } from "./RoundedButton";

interface GoButtonProps extends RoundedButtonProps {
    predicate: boolean;
}

export default function GoButton({
    predicate,
    className: overrideClasses,
    ...props
}: GoButtonProps) {
    return (
        <RoundedButton
            className={`${
                predicate
                    ? "!bg-go-color !border-go-color"
                    : "!bg-component-color !border-component-color hover:!scale-none hover:!cursor-auto active:!drop-shadow-none"
            } text-contrasted ${overrideClasses ?? ""}`}
            {...props}
        >
            {props.children}
        </RoundedButton>
    );
}
