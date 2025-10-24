"use client";

import { ClientProduct, ClientStock, Sizes, StockTableMode } from "@/lib/types";
import { extractZodMessage, isUnique } from "@/lib/utils";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import StockTableInput from "@/ui/components/forms/StockTableInput";
import StockRowDelete from "@/ui/components/buttons/StockRowDelete";
import { useEffect, useState } from "react";
import RoundedTable from "@/ui/components/forms/RoundedTable";
import TableHeadCell from "@/ui/components/forms/TableHeadCell";
import TableBodyCell from "@/ui/components/forms/TableBodyCell";
import { VALID_SIZES } from "@/lib/constants";
import { clientStockSchema, sizeSchema } from "@/lib/schemas";

interface ProductStockTableProps {
    formSavedProductData: ClientProduct;
    formProvisionalProductData: ClientProduct;
    setFormProvisionalProductData: React.Dispatch<React.SetStateAction<ClientProduct>>;
    tableMode: StockTableMode;
    setTableMode: React.Dispatch<React.SetStateAction<StockTableMode>>;
}

export default function ProductStockTable({
    formSavedProductData,
    formProvisionalProductData,
    setFormProvisionalProductData,
    tableMode,
    setTableMode,
}: ProductStockTableProps) {
    const [tableLocalStock, setTableLocalStock] = useState<ClientStock>(formSavedProductData.stock);

    const [message, setMessage] = useState<string>();
    const [newSize, setNewSize] = useState<string>();
    const [newQuantity, setNewQuantity] = useState<number>();

    const tableArr = VALID_SIZES.filter((size) => size in tableLocalStock);

    const resetUi = () => {
        setNewSize(undefined);
        setNewQuantity(undefined);
        setTableMode("display");
        setMessage(undefined);
    };

    useEffect(() => {
        setTableLocalStock(formProvisionalProductData.stock);
        resetUi();
    }, [formProvisionalProductData]);

    const parseUpdateStock = (stock: ClientStock) => {
        const parsedStock = clientStockSchema.safeParse(stock);

        if (!parsedStock.success) {
            setMessage(extractZodMessage(parsedStock));
            return;
        }

        setFormProvisionalProductData((prev) => ({ ...prev, stock: parsedStock.data }));
    };

    const handleAdd = async () => {
        const parsedSize = sizeSchema.safeParse(newSize);

        if (!parsedSize.success) {
            setMessage(extractZodMessage(parsedSize));
            return;
        }

        if (!isUnique(parsedSize.data, tableLocalStock)) {
            setMessage("Duplicate size value");
            return;
        }
        const updatedStock = { ...tableLocalStock, [parsedSize.data]: newQuantity };

        parseUpdateStock(updatedStock);
    };

    const handleApply = async () => {
        parseUpdateStock(tableLocalStock);
    };

    const handleCancel = () => {
        setTableLocalStock(formProvisionalProductData.stock);
        resetUi();
    };

    const buildHeadCells = () => (
        <>
            <TableHeadCell variant="leftEnd" overrideClasses="w-1/2">
                Size
            </TableHeadCell>
            <TableHeadCell variant="rightEnd" overrideClasses="w-1/2">
                Stock
            </TableHeadCell>
            <th className="w-8"></th>
        </>
    );

    const buildBodyCells = () => (
        <>
            {tableArr.map((stockSize, idx) => (
                <tr key={stockSize} data-cy="table-row">
                    <TableBodyCell
                        variant="leftEnd"
                        isLastRow={idx === tableArr.length - 1 && !(tableMode === "add")}
                    >
                        <StockTableInput
                            type="text"
                            mode={tableMode}
                            value={stockSize.toUpperCase()}
                        />
                    </TableBodyCell>
                    <TableBodyCell
                        variant="rightEnd"
                        isLastRow={idx === tableArr.length - 1 && !(tableMode === "add")}
                    >
                        <StockTableInput
                            type="number"
                            mode={tableMode}
                            pairKey={stockSize}
                            value={tableLocalStock[stockSize]}
                            setTableLocalStock={setTableLocalStock}
                            setNewQuantity={setNewQuantity}
                        />
                    </TableBodyCell>
                    <td>
                        {tableMode === "edit" && (
                            <div className="flex grow w-full justify-center items-center">
                                <StockRowDelete
                                    stockObjSetter={setTableLocalStock}
                                    size={stockSize as Sizes}
                                />
                            </div>
                        )}
                    </td>
                </tr>
            ))}
            {tableMode === "add" && (
                <tr data-cy="table-row">
                    <TableBodyCell variant="leftEnd" isLastRow={tableMode === "add"}>
                        <StockTableInput
                            type="text"
                            mode={tableMode}
                            isNew
                            setNewSize={setNewSize}
                        />
                    </TableBodyCell>
                    <TableBodyCell variant="rightEnd" isLastRow={tableMode === "add"}>
                        <StockTableInput
                            type="number"
                            mode={tableMode}
                            setTableLocalStock={setTableLocalStock}
                            isNew
                            setNewQuantity={setNewQuantity}
                        />
                    </TableBodyCell>
                </tr>
            )}
        </>
    );

    return (
        <div className="flex flex-col py-4 bg-background-lighter rounded-md ">
            <div id="stock-table-button-container" className="flex justify-between h-12 px-8">
                {tableMode === "display" && Object.keys(tableLocalStock)?.length > 0 && (
                    <div>
                        <PlainRoundedButton onClick={() => setTableMode("edit")}>
                            Edit
                        </PlainRoundedButton>
                    </div>
                )}
                {tableMode === "edit" && (
                    <div>
                        <PlainRoundedButton onClick={() => handleApply()}>Apply</PlainRoundedButton>
                    </div>
                )}
                {tableMode === "add" && (
                    <div>
                        <PlainRoundedButton onClick={() => handleAdd()}>Add</PlainRoundedButton>
                    </div>
                )}
                {tableMode === "display" && (
                    <div>
                        <PlainRoundedButton onClick={() => setTableMode("add")}>
                            + Add Size
                        </PlainRoundedButton>
                    </div>
                )}
                {(tableMode === "edit" || tableMode === "add") && (
                    <div>
                        <PlainRoundedButton onClick={() => handleCancel()}>
                            Cancel
                        </PlainRoundedButton>
                    </div>
                )}
            </div>
            <div id="stock-table-message-container" className="flex justify-center h-8 p-2">
                <p className="text-center text-white">{message}</p>
            </div>
            <div className="pl-8 pt-2">
                <RoundedTable
                    id="stock-table"
                    tableHeadCells={buildHeadCells()}
                    tableBodyCells={buildBodyCells()}
                    overrideClasses="w-full text-center table-fixed"
                />
            </div>
        </div>
    );
}
