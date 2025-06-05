"use client";

type FilterButtonProps<T> = {
    children: React.ReactNode;
    objKey: T;
    filterArr: T[];
    handleClick: () => void;
};

export default function FilterButton<T extends string>({
    children,
    objKey,
    filterArr,
    handleClick,
}: FilterButtonProps<T>) {
    return (
        <button
            type="button"
            onClick={handleClick}
            className={`flex gap-1 py-1 px-2 h-min bg-background-lightest text-sz-label-button lg:text-sz-label-button-lg rounded-full cursor-pointer border-2 ${
                filterArr.includes(objKey as T) ? "border-black" : "border-background-lightest"
            }`}
        >
            {children}
        </button>
    );
}
