export default function RoundedButton({
    children,
    className: classes,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <button className={`px-6 py-2 rounded-full bg-contrasted text-foreground ` + classes}>
            {children}
        </button>
    );
}
