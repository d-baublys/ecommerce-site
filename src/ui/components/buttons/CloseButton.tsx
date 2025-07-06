import { IoClose } from "react-icons/io5";

export default function CloseButton(props: React.HtmlHTMLAttributes<HTMLButtonElement>) {
    return (
        <button type="button" className="flex items-center" {...props}>
            <IoClose className="cursor-pointer" size={24} />
        </button>
    );
}
