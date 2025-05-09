import RoundedButton from "./RoundedButton";

export default function GoButton({
    children,
    className: classes,
    onClick,
    disabled,
}: {
    children?: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    disabled?: boolean;
}) {
    return (
        <RoundedButton
            onClick={onClick}
            className={`bg-go-color border-go-color text-contrasted ` + classes}
            disabled={disabled}
        >
            {children}
        </RoundedButton>
    );
}
