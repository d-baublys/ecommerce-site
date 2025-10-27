"use client";

import { ClientStock, Sizes } from "@/lib/types";
import { IoTrash } from "react-icons/io5";

interface StockRowDeleteProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    stockSetter: React.Dispatch<React.SetStateAction<ClientStock>>;
    size: Sizes;
}

export default function StockRowDelete({ stockSetter, size, ...props }: StockRowDeleteProps) {
    const handleDelete = () => {
        stockSetter((prev) => {
            const updatedStock = { ...prev };
            delete updatedStock[size];

            return updatedStock;
        });
    };

    return (
        <button
            type="button"
            title="Delete row"
            aria-label="Delete row"
            onClick={() => handleDelete()}
            className="stock-row-delete flex justify-center items-center cursor-pointer"
            {...props}
        >
            <IoTrash size={20} />
        </button>
    );
}
