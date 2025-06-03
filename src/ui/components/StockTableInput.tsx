import { Product, Sizes, StockTableMode } from "@/lib/definitions";
import { isValidStock } from "@/lib/utils";
import React from "react";

export default function StockTableInput({
    type,
    mode,
    pairKey,
    value,
    stockObjSetter,
    setNewSize,
    setNewStock,
    isNew,
}: {
    type: "text" | "number";
    mode: StockTableMode;
    pairKey?: string | number;
    value?: string | number;
    stockObjSetter?: React.Dispatch<React.SetStateAction<Product["stock"]>>;
    setNewSize?: React.Dispatch<React.SetStateAction<Sizes | undefined>>;
    setNewStock?: React.Dispatch<React.SetStateAction<number | undefined>>;
    isNew?: boolean;
}) {
    const editable = (mode === "edit" && type === "number") || isNew;

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const newValue = e.currentTarget.value;

        if (type === "text" && setNewSize) {
            setNewSize(newValue.toLowerCase() as Sizes);
        } else if (type === "number" && setNewStock && isValidStock(Number(newValue))) {
            if (pairKey && stockObjSetter) {
                stockObjSetter((prev) => ({ ...prev, [pairKey as Sizes]: Number(newValue) }));
            } else {
                setNewStock(Number(newValue));
            }
        }
    }

    return (
        <input
            type={type}
            disabled={!editable}
            min={0}
            className={`min-w-8 w-16 bg-contrasted border-2 rounded-sm my-2 font-semibold text-center ${
                !editable && "border-contrasted"
            }`}
            value={value}
            onChange={(e) => handleChange(e)}
        ></input>
    );
}
