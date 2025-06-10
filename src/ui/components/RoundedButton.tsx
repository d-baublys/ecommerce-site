export interface RoundedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    overrideClasses?: string;
}

export default function RoundedButton({
    type = "button",
    overrideClasses,
    ...props
}: RoundedButtonProps) {
    return (
        <button
            type={type}
            className={`flex justify-center items-center px-6 py-2 bg-white rounded-full border-2 gap-2 cursor-pointer hover:scale-[103%] transition active:drop-shadow-(--button-shadow) ${
                overrideClasses ?? ""
            }`}
            {...props}
        >
            {props.children}
        </button>
    );
}
