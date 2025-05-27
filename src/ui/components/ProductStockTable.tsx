"use client";

import { Product, Sizes, StockTableMode, VALID_SIZES } from "@/lib/definitions";
import { isUnique, isValidSize } from "@/lib/utils";
import GeneralButton from "@/ui/components/GeneralButton";
import StockTableInput from "@/ui/components/StockTableInput";
import StockRowDelete from "@/ui/components/StockRowDelete";
import { useState } from "react";

export default function ProductStockTable({
    productData,
    setStock: setSavedStockObj,
    tableMode,
    setTableMode,
}: {
    productData: Product;
    setStock: React.Dispatch<React.SetStateAction<Product["stock"]>>;
    tableMode: StockTableMode;
    setTableMode: React.Dispatch<React.SetStateAction<StockTableMode>>;
}) {
    const [provisionalStockObj, setProvisionalStockObj] = useState<Product["stock"]>(
        productData.stock
    );
    const [message, setMessage] = useState<string | undefined>();
    const [newSize, setNewSize] = useState<Sizes | undefined>();
    const [newStock, setNewStock] = useState<number | undefined>();

    const handleAdd = async () => {
        if (
            newSize !== undefined &&
            newStock !== undefined &&
            isValidSize(newSize) &&
            isUnique(newSize, provisionalStockObj)
        ) {
            const updatedStockObj = { ...provisionalStockObj, [newSize]: newStock };

            setProvisionalStockObj(updatedStockObj);
            setSavedStockObj(updatedStockObj);
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

    const handleSave = async () => {
        setSavedStockObj(provisionalStockObj);
        setNewSize(undefined);
        setNewStock(undefined);
        setTableMode("display");
        setMessage(undefined);
    };

    const handleCancel = () => {
        setProvisionalStockObj(productData.stock);
        setNewSize(undefined);
        setNewStock(undefined);
        setTableMode("display");
        setMessage(undefined);
    };

    return (
        <div className="flex flex-col border-2 p-2">
            <div className="flex justify-between h-12">
                {tableMode === "display" && Object.keys(provisionalStockObj)?.length && (
                    <GeneralButton onClick={() => setTableMode("edit")}>Edit</GeneralButton>
                )}
                {tableMode === "edit" && (
                    <GeneralButton onClick={() => handleSave()}>Save</GeneralButton>
                )}
                {tableMode === "add" && (
                    <GeneralButton onClick={() => handleAdd()}>Add</GeneralButton>
                )}
                {tableMode === "display" && (
                    <GeneralButton onClick={() => setTableMode("add")}>+ Add Size</GeneralButton>
                )}
                {(tableMode === "edit" || tableMode === "add") && (
                    <GeneralButton onClick={() => handleCancel()}>Cancel</GeneralButton>
                )}
            </div>
            {message}
            <table className="text-center border-2 mt-2">
                <thead>
                    <tr className="p-2">
                        <th className="border-2">Size</th>
                        <th className="border-2">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {VALID_SIZES.filter((size) => size in provisionalStockObj).map((stockSize) => (
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
                                    value={provisionalStockObj[stockSize]}
                                    pair={stockSize}
                                    setProvisionalStockObj={setProvisionalStockObj}
                                    setNewStock={setNewStock}
                                />
                            </td>
                            <td className="min-w-4 w-8">
                                {tableMode === "edit" && (
                                    <StockRowDelete
                                        setProvisionalStockObj={setProvisionalStockObj}
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
                                    setProvisionalStockObj={setProvisionalStockObj}
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
