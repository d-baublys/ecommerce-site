"use client";

import { ClientStock, StateSetter, StockTableMode } from "@/lib/types";

interface StockTableInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    type: "text" | "number";
    mode: StockTableMode;
    pairKey?: string | number;
    setTableLocalStock?: StateSetter<ClientStock>;
    setNewSize?: StateSetter<string | undefined>;
    setNewQuantity?: StateSetter<number | undefined>;
    isNew?: boolean;
}

export default function StockTableInput({
    type,
    mode,
    pairKey,
    setTableLocalStock,
    setNewSize,
    setNewQuantity,
    isNew,
    ...props
}: StockTableInputProps) {
    const editable = (mode === "edit" && type === "number") || isNew;

    function handleChange(e: React.FormEvent<HTMLInputElement>) {
        const inputValue = e.currentTarget.value;

        if (type === "text" && setNewSize) {
            setNewSize(inputValue.toLowerCase());
        } else if (type === "number" && setNewQuantity) {
            const quantity = !isNaN(Number(inputValue)) ? Number(inputValue) : undefined;

            if (pairKey && setTableLocalStock) {
                setTableLocalStock((prev) => ({ ...prev, [pairKey]: quantity }));
            } else {
                setNewQuantity(quantity);
            }
        }
    }

    return (
        <input
            type={type}
            disabled={!editable}
            min={0}
            className={`min-w-8 w-16 bg-white rounded-sm my-2 border-2 text-center ${
                !editable ? "border-contrasted" : ""
            }`}
            onChange={(e) => handleChange(e)}
            {...props}
            data-cy={`${type === "text" ? "size-input" : "quantity-input"}`}
        ></input>
    );
}
