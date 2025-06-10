"use client";

import { Product, Sizes, StockTableMode, VALID_SIZES } from "@/lib/definitions";
import { isUnique, isValidSize } from "@/lib/utils";
import RoundedButton from "@/ui/components/RoundedButton";
import StockTableInput from "@/ui/components/StockTableInput";
import StockRowDelete from "@/ui/components/StockRowDelete";
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
        <div className="flex flex-col border-2 p-2">
            <div className="flex justify-between h-12">
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
                <p className="text-center">{message}</p>
            </div>
            <table className="text-center border-2 mt-2 bg-white">
                <thead>
                    <tr className="p-2">
                        <th className="border-2">Size</th>
                        <th className="border-2">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {VALID_SIZES.filter((size) => size in localStockObj).map((stockSize) => (
                        <tr key={stockSize}>
                            <td className="border-2">
                                <StockTableInput
                                    type="text"
                                    mode={tableMode}
                                    value={stockSize.toUpperCase()}
                                />
                            </td>
                            <td className="border-2">
                                <StockTableInput
                                    type="number"
                                    mode={tableMode}
                                    pairKey={stockSize}
                                    value={localStockObj[stockSize]}
                                    stockObjSetter={setLocalStockObj}
                                    setNewStock={setNewStock}
                                />
                            </td>
                            <td className="min-w-4 w-8">
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
                            <td className="border-2">
                                <StockTableInput
                                    type="text"
                                    mode={tableMode}
                                    isNew
                                    setNewSize={setNewSize}
                                />
                            </td>
                            <td className="border-2">
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
