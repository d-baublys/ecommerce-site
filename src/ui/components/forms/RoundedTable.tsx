export interface RoundedTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
    tableHeadCells: React.ReactNode;
    tableBodyCells: React.ReactNode;
    overrideClasses?: string;
}

export default function RoundedTable({
    tableHeadCells,
    tableBodyCells,
    overrideClasses,
    ...props
}: RoundedTableProps) {
    return (
        <table {...props} className={`border-separate border-spacing-0 ${overrideClasses ?? ""}`}>
            <thead>
                <tr className="p-2">{tableHeadCells}</tr>
            </thead>
            <tbody>{tableBodyCells}</tbody>
        </table>
    );
}
