"use client";

interface FilterButtonProps<T> extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    objKey: T;
    filterArr: T[];
}

export default function FilterButton<T extends string>({
    objKey,
    filterArr,
    ...props
}: FilterButtonProps<T>) {
    return (
        <button
            type="button"
            className={`flex gap-1 py-1 px-2 h-min bg-background-lightest text-sz-label-button lg:text-sz-label-button-lg rounded-full cursor-pointer border-2 ${
                filterArr.includes(objKey as T) ? "border-black" : "border-background-lightest"
            }`}
            {...props}
        >
            {props.children}
        </button>
    );
}
