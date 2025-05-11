import RoundedButton from "./RoundedButton";

export default function GeneralButton({
    children,
    className: classes,
    onClick,
}: {
    children?: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}) {
    return (
        <RoundedButton onClick={onClick} className={`bg-contrasted ` + classes}>
            {children}
        </RoundedButton>
    );
}
