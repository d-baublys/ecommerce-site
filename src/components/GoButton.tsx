import RoundedButton from "./RoundedButton";

export default function GoButton({
    children,
    className: classes,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return (
        <RoundedButton className={`bg-green-700 border-green-700 text-contrasted ` + classes}>
            {children}
        </RoundedButton>
    );
}
