export default function RoundedButton({
    className: classes,
    text,
}: {
    className: string;
    text: string;
}) {
    return (
        <button className={`px-6 py-2 rounded-full bg-contrasted text-foreground ` + classes}>{text}</button>
    );
}
