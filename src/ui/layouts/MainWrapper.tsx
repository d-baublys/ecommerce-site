export default function MainWrapper({
    children,
    overrideClasses,
}: {
    children: React.ReactNode;
    overrideClasses?: string;
}) {
    return (
        <div
            className={`flex flex-col grow h-full px-(--gutter-sm) sm:px-(--gutter) py-8 lg:px-(--gutter-md) bg-green-500 ${
                overrideClasses ?? ""
            }`}
        >
            {children}
        </div>
    );
}
