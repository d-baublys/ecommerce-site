export default function MainWrapper({
    children,
    overrideClasses,
}: {
    children: React.ReactNode;
    overrideClasses?: string;
}) {
    return (
        <div
            className={`flex flex-col grow px-(--gutter-sm) sm:px-(--gutter) py-8 lg:px-(--gutter-md) ${
                overrideClasses ?? ""
            }`}
        >
            {children}
        </div>
    );
}
