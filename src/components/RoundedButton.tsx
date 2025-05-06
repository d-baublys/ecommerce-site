export default function RoundedButton({
    children,
    className: classes,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <button className={`flex justify-center items-center px-6 py-2 rounded-full border-2 gap-2 ` + classes}>
            {children}
        </button>
    );
}
