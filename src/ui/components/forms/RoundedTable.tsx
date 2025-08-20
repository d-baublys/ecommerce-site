export interface RoundedTableProps {
    tableHeadCells: React.ReactNode;
    tableBodyCells: React.ReactNode;
    overrideClasses?: string;
}

export default function RoundedTable({
    tableHeadCells,
    tableBodyCells,
    overrideClasses,
}: RoundedTableProps) {
    return (
        <table className={`border-separate border-spacing-0 ${overrideClasses ?? ""}`}>
            <thead>
                <tr className="p-2">{tableHeadCells}</tr>
            </thead>
            <tbody>{tableBodyCells}</tbody>
        </table>
    );
}
