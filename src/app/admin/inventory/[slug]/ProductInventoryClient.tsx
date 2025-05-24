"use client";

import { InventoryMode, Product, Sizes } from "@/lib/definitions";
import { isUnique, isValidSize } from "@/lib/utils";
import GeneralButton from "@/ui/components/GeneralButton";
import InventoryInput from "@/ui/components/InventoryInput";
import StockRowDelete from "@/ui/components/StockRowDelete";
import { useState } from "react";

export default function ProductInventoryClient({ productData }: { productData: Product }) {
    const [mode, setMode] = useState<InventoryMode>("display");
    const [savedStockObj, setSavedStockObj] = useState<Product["stock"]>(productData.stock);
    const [provisionalStockObj, setProvisionalStockObj] = useState<Product["stock"]>(
        productData.stock
    );
    const [error, setError] = useState<string | undefined>();
    const [newSize, setNewSize] = useState<Sizes | undefined>();
    const [newStock, setNewStock] = useState<number | undefined>();

    const handleAdd = () => {
        if (
            newSize !== undefined &&
            newStock !== undefined &&
            isValidSize(newSize) &&
            isUnique(newSize, provisionalStockObj)
        ) {
            const updatedStockObj = { ...provisionalStockObj, [newSize]: newStock };
            setProvisionalStockObj!(updatedStockObj);
            setSavedStockObj(updatedStockObj);
            setNewSize(undefined);
            setNewStock(undefined);
            setMode("display");
            setError(undefined);
        } else {
            setError("Invalid or duplicate size value");
        }
    };

    const handleSave = () => {
        setSavedStockObj(provisionalStockObj);
        setNewSize(undefined);
        setNewStock(undefined);
        setMode("display");
        setError(undefined);
    };

    const handleCancel = () => {
        setProvisionalStockObj(savedStockObj);
        setNewSize(undefined);
        setNewStock(undefined);
        setMode("display");
        setError(undefined);
    };

    return (
        <div className="flex flex-col border-2 p-2">
            <div className="flex justify-between h-12">
                {mode === "display" && (
                    <GeneralButton onClick={() => setMode("edit")}>Edit</GeneralButton>
                )}
                {mode === "edit" && (
                    <GeneralButton onClick={() => handleSave()}>Save</GeneralButton>
                )}
                {mode === "add" && <GeneralButton onClick={() => handleAdd()}>Add</GeneralButton>}
                {mode === "display" && (
                    <GeneralButton onClick={() => setMode("add")}>+ Add Size</GeneralButton>
                )}
                {(mode === "edit" || mode === "add") && (
                    <GeneralButton onClick={() => handleCancel()}>Cancel</GeneralButton>
                )}
            </div>
            {error}
            <table className="text-center border-2 mt-2">
                <thead>
                    <tr className="p-2">
                        <th className="border-2">Size</th>
                        <th className="border-2">Stock</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(provisionalStockObj).map(([size, stock], idx) => (
                        <tr key={idx}>
                            <td className="border-2">
                                <InventoryInput
                                    type="text"
                                    mode={mode}
                                    value={size.toUpperCase()}
                                />
                            </td>
                            <td className="border-2">
                                <InventoryInput
                                    type="number"
                                    mode={mode}
                                    value={stock}
                                    pair={size}
                                    setProvisionalStockObj={setProvisionalStockObj}
                                    setNewStock={setNewStock}
                                />
                            </td>
                            <td className="min-w-4 w-8">
                                {mode === "edit" && (
                                    <StockRowDelete
                                        setProvisionalStockObj={setProvisionalStockObj}
                                        size={size as Sizes}
                                    />
                                )}
                            </td>
                        </tr>
                    ))}
                    {mode === "add" && (
                        <tr>
                            <td className="border-2">
                                <InventoryInput
                                    type="text"
                                    mode={mode}
                                    isNew
                                    setNewSize={setNewSize}
                                />
                            </td>
                            <td className="border-2">
                                <InventoryInput
                                    type="number"
                                    mode={mode}
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
