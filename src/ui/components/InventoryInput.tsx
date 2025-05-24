import { InventoryMode, Product, Sizes } from "@/lib/definitions";
import { isValidStock } from "@/lib/utils";
import React from "react";

export default function InventoryInput({
    type,
    mode,
    value,
    pair,
    setProvisionalStockObj,
    setNewSize,
    setNewStock,
    isNew,
}: {
    type: "text" | "number";
    mode: InventoryMode;
    value?: string | number;
    pair?: string | number;
    setProvisionalStockObj?: React.Dispatch<React.SetStateAction<Product["stock"]>>;
    setNewSize?: React.Dispatch<React.SetStateAction<Sizes | undefined>>;
    setNewStock?: React.Dispatch<React.SetStateAction<number | undefined>>;
    isNew?: boolean;
}) {
    const editable = (mode === "edit" && type === "number") || isNew;

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const newValue = e.currentTarget.value;

        if (type === "text") {
            setNewSize!(newValue.toLowerCase() as Sizes);
        } else if (type === "number" && isValidStock(Number(newValue))) {
            setNewStock!(Number(newValue));
            if (pair) {
                setProvisionalStockObj!((prev) => ({ ...prev, [pair as Sizes]: Number(newValue) }));
            }
        }
    }

    return (
        <input
            type={type}
            disabled={!editable}
            min={0}
            className={`min-w-8 w-16 bg-contrasted border-2 rounded-sm my-2 text-lg font-semibold text-center ${
                !editable && "border-contrasted"
            }`}
            value={value}
            onChange={(e) => handleChange(e)}
        ></input>
    );
}
