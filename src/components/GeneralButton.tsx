import RoundedButton from "./RoundedButton";

export default function GeneralButton({
    children,
    className: classes,
}: {
    children?: React.ReactNode;
    className?: string;
}) {
    return <RoundedButton className={`bg-contrasted ` + classes}>{children}</RoundedButton>;
}
