"use client";

import { Product, Sizes, StockTableMode, VALID_SIZES } from "@/lib/definitions";
import { isUnique, isValidSize } from "@/lib/utils";
import RoundedButton from "@/ui/components/buttons/RoundedButton";
import StockTableInput from "@/ui/components/forms/StockTableInput";
import StockRowDelete from "@/ui/components/buttons/StockRowDelete";
import { useEffect, useState } from "react";

export default function ProductStockTable({
    savedDataObj,
    provisionalDataObj,
    setProvisionalDataObj,
    tableMode,
    setTableMode,
}: {
    savedDataObj: Product;
    provisionalDataObj: Product;
    setProvisionalDataObj: React.Dispatch<React.SetStateAction<Product>>;
    tableMode: StockTableMode;
    setTableMode: React.Dispatch<React.SetStateAction<StockTableMode>>;
}) {
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

    return (
        <div className="flex flex-col py-4 bg-background-lighter rounded-md ">
            <div className="flex justify-between h-12 px-8">
                {tableMode === "display" && Object.keys(localStockObj)?.length > 0 && (
                    <RoundedButton onClick={() => setTableMode("edit")}>Edit</RoundedButton>
                )}
                {tableMode === "edit" && (
                    <RoundedButton onClick={() => handleApply()}>Apply</RoundedButton>
                )}
                {tableMode === "add" && (
                    <RoundedButton onClick={() => handleAdd()}>Add</RoundedButton>
                )}
                {tableMode === "display" && (
                    <RoundedButton onClick={() => setTableMode("add")}>+ Add Size</RoundedButton>
                )}
                {(tableMode === "edit" || tableMode === "add") && (
                    <RoundedButton onClick={() => handleCancel()}>Cancel</RoundedButton>
                )}
            </div>
            <div className="flex justify-center h-8 p-2">
                <p className="text-center text-white">{message}</p>
            </div>
            <table className="text-center ml-8 border-separate border-spacing-0 mt-2">
                <thead>
                    <tr className="p-2">
                        <th className="w-1/2 bg-background-lightest border-2 border-r-1 py-2 rounded-tl-md">
                            Size
                        </th>
                        <th className="w-1/2 bg-background-lightest border-2 border-l-2 py-2 rounded-tr-md">
                            Stock
                        </th>
                        <th className="min-w-8"></th>
                    </tr>
                </thead>
                <tbody>
                    {tableArr.map((stockSize, idx) => (
                        <tr key={stockSize}>
                            <td
                                className={`border border-l-2 bg-white ${
                                    idx === tableArr.length - 1 && !(tableMode === "add")
                                        ? "rounded-bl-lg border-b-2"
                                        : ""
                                } `}
                            >
                                <StockTableInput
                                    type="text"
                                    mode={tableMode}
                                    value={stockSize.toUpperCase()}
                                />
                            </td>
                            <td
                                className={`border border-r-2 bg-white ${
                                    idx === tableArr.length - 1 && !(tableMode === "add")
                                        ? "rounded-br-lg border-b-2"
                                        : ""
                                } `}
                            >
                                <StockTableInput
                                    type="number"
                                    mode={tableMode}
                                    pairKey={stockSize}
                                    value={localStockObj[stockSize]}
                                    stockObjSetter={setLocalStockObj}
                                    setNewStock={setNewStock}
                                />
                            </td>
                            <td>
                                {tableMode === "edit" && (
                                    <StockRowDelete
                                        stockObjSetter={setLocalStockObj}
                                        size={stockSize as Sizes}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                    {tableMode === "add" && (
                        <tr>
                            <td className="border border-l-2 border-b-2 rounded-bl-lg bg-white">
                                <StockTableInput
                                    type="text"
                                    mode={tableMode}
                                    isNew
                                    setNewSize={setNewSize}
                                />
                            </td>
                            <td className="border border-r-2 border-b-2 rounded-br-lg bg-white">
                                <StockTableInput
                                    type="number"
                                    mode={tableMode}
                                    stockObjSetter={setLocalStockObj}
                                    isNew
                                    setNewStock={setNewStock}
                                />
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
