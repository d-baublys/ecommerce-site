export default function RoundedButton({
    children,
    type = "button",
    className: classes,
    onClick,
    disabled,
}: {
    children?: React.ReactNode;
    type?: "submit" | "reset" | "button";
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
    disabled?: boolean;
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={
                `flex justify-center items-center px-6 py-2 rounded-full border-2 gap-2 cursor-pointer hover:scale-[103%] transition active:drop-shadow-(--button-shadow) ` +
                classes
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
