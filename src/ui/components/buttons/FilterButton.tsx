"use client";

interface FilterButtonProps<T> extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    filterKey: T;
    filters: T[];
}

export default function FilterButton<T extends string>({
    filterKey,
    filters,
    ...props
}: FilterButtonProps<T>) {
    return (
        <button
            type="button"
            className={`py-1 px-2 h-min bg-background-lightest text-sz-label-button lg:text-sz-label-button-lg rounded-full cursor-pointer border-2 ${
                filters.includes(filterKey as T) ? "border-black" : "border-background-lightest"
            }`}
            {...props}
        >
            <span className="flex gap-1">{props.children}</span>
        </button>
    );
}
