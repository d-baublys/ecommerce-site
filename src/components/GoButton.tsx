import RoundedButton from "./RoundedButton";

export default function GoButton({
    children,
    className: classes,
    onClick,
}: {
    children?: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}) {
    return (
        <RoundedButton
            onClick={onClick}
            className={`bg-green-700 border-green-700 text-contrasted ` + classes}
        >
            {children}
        </RoundedButton>
    );
}
