export default function RoundedButton({
    children,
    className: classes,
    onClick,
}: {
    children?: React.ReactNode;
    className?: string;
    onClick?: React.MouseEventHandler<HTMLElement>;
}) {
    return (
        <button
            onClick={onClick}
            className={
                `flex justify-center items-center px-6 py-2 rounded-full border-2 gap-2 cursor-pointer hover:scale-[103%] transition drop-shadow-(--button-shadow) ` + classes
            }
        >
            {children}
        </button>
    );
}
