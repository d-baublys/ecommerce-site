"use client";

import stockUpdate from "@/app/actions/stockUpdate";
import { InventoryMode, Product, Sizes, VALID_SIZES } from "@/lib/definitions";
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

    const handleAdd = async () => {
        if (
            newSize !== undefined &&
            newStock !== undefined &&
            isValidSize(newSize) &&
            isUnique(newSize, provisionalStockObj)
        ) {
            const updatedStockObj = { ...provisionalStockObj, [newSize]: newStock };
            const result = await stockUpdate(productData.id, updatedStockObj);

            if (result.success) {
                setProvisionalStockObj(updatedStockObj);
                setSavedStockObj(updatedStockObj);
                setNewSize(undefined);
                setNewStock(undefined);
                setMode("display");
                setError(undefined);
            } else {
                setProvisionalStockObj(savedStockObj);
                setError("Error updating database");
            }
        } else if (!isValidSize(newSize as Sizes) || !newStock) {
            setError("Invalid size or stock value");
        } else {
            setError("Duplicate size value");
        }
    };

    const handleSave = async () => {
        const result = await stockUpdate(productData.id, provisionalStockObj);

        if (result.success) {
            setSavedStockObj(provisionalStockObj);
            setNewSize(undefined);
            setNewStock(undefined);
            setMode("display");
            setError(undefined);
        } else {
            setProvisionalStockObj(savedStockObj);
            setError("Error updating database");
        }
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
                    {VALID_SIZES.filter((size) => size in provisionalStockObj).map((stockSize) => (
                        <tr key={stockSize}>
                            <td className="border-2">
                                <InventoryInput
                                    type="text"
                                    mode={mode}
                                    value={stockSize.toUpperCase()}
                                />
                            </td>
                            <td className="border-2">
                                <InventoryInput
                                    type="number"
                                    mode={mode}
                                    value={provisionalStockObj[stockSize]}
                                    pair={stockSize}
                                    setProvisionalStockObj={setProvisionalStockObj}
                                    setNewStock={setNewStock}
                                />
                            </td>
                            <td className="min-w-4 w-8">
                                {mode === "edit" && (
                                    <StockRowDelete
                                        setProvisionalStockObj={setProvisionalStockObj}
                                        size={stockSize as Sizes}
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
