interface TableHeadCellProps {
    children: string | React.ReactNode;
    variant: "leftEnd" | "middle" | "rightEnd";
    overrideClasses?: string;
}

export default function TableHeadCell({ children, variant, overrideClasses }: TableHeadCellProps) {
    let conditionalClass: string = "";

    if (variant === "leftEnd") {
        conditionalClass = "border-r-1 rounded-tl-md";
    } else if (variant === "rightEnd") {
        conditionalClass = "border-l-2 rounded-tr-md";
    } else {
        conditionalClass = "border-r-1";
    }

    return (
        <th
            className={`bg-background-lightest border-2 py-2 ${conditionalClass} ${
                overrideClasses ?? ""
            }`}
        >
            {children}
        </th>
    );
}
