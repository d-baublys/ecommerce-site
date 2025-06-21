import { IoClose } from "react-icons/io5";

export default function CloseButton({ onClick }: { onClick: () => void }) {
    return (
        <div className="flex items-center">
            <IoClose className="cursor-pointer" onClick={onClick} size={24} />
        </div>
    );
}
