interface TableBodyCellProps {
    children: string | React.ReactNode;
    variant: "leftEnd" | "middle" | "rightEnd";
    isLastRow: boolean;
    overrideClasses?: string;
}

export default function TableBodyCell({
    children,
    variant,
    isLastRow,
    overrideClasses,
}: TableBodyCellProps) {
    let sideClass: string = "";
    let bottomClass: string = "";

    if (variant === "leftEnd") {
        sideClass = "border-l-2";
    } else if (variant === "rightEnd") {
        sideClass = "border-r-2";
    }

    if (variant === "leftEnd" && isLastRow) {
        bottomClass = "rounded-bl-lg border-b-2";
    } else if (variant === "rightEnd" && isLastRow) {
        bottomClass = "rounded-br-lg border-b-2";
    } else if (isLastRow) {
        bottomClass = "border-b-2";
    }

    return (
        <td className={`border bg-white ${sideClass} ${bottomClass} ${overrideClasses ?? ""}`}>
            {children}
        </td>
    );
}
