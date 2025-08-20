"use client";

import { Product, Sizes, StockTableMode, VALID_SIZES } from "@/lib/definitions";
import { isUnique, isValidSize } from "@/lib/utils";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import StockTableInput from "@/ui/components/forms/StockTableInput";
import StockRowDelete from "@/ui/components/buttons/StockRowDelete";
import { useEffect, useState } from "react";
import RoundedTable from "@/ui/components/forms/RoundedTable";
import TableHeadCell from "@/ui/components/forms/TableHeadCell";
import TableBodyCell from "@/ui/components/forms/TableBodyCell";

interface ProductStockTableProps {
    savedDataObj: Product;
    provisionalDataObj: Product;
    setProvisionalDataObj: React.Dispatch<React.SetStateAction<Product>>;
    tableMode: StockTableMode;
    setTableMode: React.Dispatch<React.SetStateAction<StockTableMode>>;
}

export default function ProductStockTable({
    savedDataObj,
    provisionalDataObj,
    setProvisionalDataObj,
    tableMode,
    setTableMode,
}: ProductStockTableProps) {
    const [localStockObj, setLocalStockObj] = useState<Product["stock"]>(savedDataObj.stock);

    const [message, setMessage] = useState<string>();
    const [newSize, setNewSize] = useState<Sizes>();
    const [newStock, setNewStock] = useState<number>();

    const tableArr = VALID_SIZES.filter((size) => size in localStockObj);

    useEffect(() => {
        setLocalStockObj(provisionalDataObj.stock);
    }, [provisionalDataObj]);

    const handleAdd = async () => {
        if (
            newSize !== undefined &&
            newStock !== undefined &&
            isValidSize(newSize) &&
            isUnique(newSize, localStockObj)
        ) {
            const updatedStockObj = { ...localStockObj, [newSize]: newStock };

            setProvisionalDataObj((prev) => ({ ...prev, stock: updatedStockObj }));
            setNewSize(undefined);
            setNewStock(undefined);
            setTableMode("display");
            setMessage(undefined);
        } else if (!isValidSize(newSize as Sizes) || !newStock) {
            setMessage("Invalid size or stock value");
        } else {
            setMessage("Duplicate size value");
        }
    };

    const handleApply = async () => {
        setProvisionalDataObj((prev) => ({ ...prev, stock: localStockObj }));
        setNewSize(undefined);
        setNewStock(undefined);
        setTableMode("display");
        setMessage(undefined);
    };

    const handleCancel = () => {
        setLocalStockObj(savedDataObj.stock);
        setNewSize(undefined);
        setNewStock(undefined);
        setTableMode("display");
        setMessage(undefined);
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
                <tr key={stockSize}>
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
                            value={localStockObj[stockSize]}
                            stockObjSetter={setLocalStockObj}
                            setNewStock={setNewStock}
                        />
                    </TableBodyCell>
                    <td>
                        {tableMode === "edit" && (
                            <div className="flex grow w-full justify-center items-center">
                                <StockRowDelete
                                    stockObjSetter={setLocalStockObj}
                                    size={stockSize as Sizes}
                                />
                            </div>
                        )}
                    </td>
                </tr>
            ))}
            {tableMode === "add" && (
                <tr>
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
                            stockObjSetter={setLocalStockObj}
                            isNew
                            setNewStock={setNewStock}
                        />
                    </TableBodyCell>
                </tr>
            )}
        </>
    );

    return (
        <div className="flex flex-col py-4 bg-background-lighter rounded-md ">
            <div className="flex justify-between h-12 px-8">
                {tableMode === "display" && Object.keys(localStockObj)?.length > 0 && (
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
            <div className="flex justify-center h-8 p-2">
                <p className="text-center text-white">{message}</p>
            </div>
            <div className="pl-8 pt-2">
                <RoundedTable
                    tableHeadCells={buildHeadCells()}
                    tableBodyCells={buildBodyCells()}
                    overrideClasses="w-full text-center table-fixed"
                />
            </div>
        </div>
    );
}
