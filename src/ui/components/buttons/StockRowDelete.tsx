"use client";

import { Product, Sizes } from "@/lib/types";
import { IoTrash } from "react-icons/io5";

interface StockRowDeleteProps extends React.HtmlHTMLAttributes<HTMLButtonElement> {
    stockObjSetter: React.Dispatch<React.SetStateAction<Product["stock"]>>;
    size: Sizes;
}

export default function StockRowDelete({ stockObjSetter, size, ...props }: StockRowDeleteProps) {
    const handleDelete = () => {
        stockObjSetter((prev) => {
            const newObj = { ...prev };
            delete newObj[size];

            return newObj;
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
