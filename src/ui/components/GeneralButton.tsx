import RoundedButton from "./RoundedButton";

export default function GeneralButton({
    children,
    type,
    className: classes,
    onClick,
}: {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}) {
    return (
        <RoundedButton type={type} onClick={onClick} className={`bg-contrasted ` + classes}>
            {children}
        </RoundedButton>
    );
}
