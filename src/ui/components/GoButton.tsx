import RoundedButton from "./RoundedButton";

export default function GoButton({
    children,
    predicate,
    className: classes,
    onClick,
    disabled,
}: {
    children?: React.ReactNode;
    predicate: boolean;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    disabled?: boolean;
}) {
    return (
        <RoundedButton
            onClick={onClick}
            className={
                `${
                    predicate
                        ? "bg-go-color border-go-color"
                        : "bg-component-color border-component-color hover:!scale-100 hover:!cursor-auto active:!drop-shadow-none"
                } text-contrasted ` + classes
            }
            disabled={disabled}
        >
            {children}
        </RoundedButton>
    );
}
