export default function DarkBackdrop({
    zIndex,
    onClick,
    classes,
}: {
    zIndex: number;
    onClick?: () => void;
    classes?: string;
}) {
    return (
        <div
            id="modal-backdrop"
            onClick={onClick}
            className={`fixed top-0 left-0 w-full min-h-screen bg-black opacity-75 z-[${zIndex}] ${classes}`}
        ></div>
    );
}
