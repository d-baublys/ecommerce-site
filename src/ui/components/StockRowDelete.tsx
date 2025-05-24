import { Product, Sizes } from "@/lib/definitions";
import { IoTrash } from "react-icons/io5";

export default function StockRowDelete({
    setProvisionalStockObj,
    size,
}: {
    setProvisionalStockObj?: React.Dispatch<React.SetStateAction<Product["stock"]>>;
    size: Sizes;
}) {
    const handleDelete = () => {
        setProvisionalStockObj!((prev) => {
            const newObj = { ...prev };
            delete newObj[size];
            return newObj;
        });
    };

    return (
        <div
            onClick={() => handleDelete()}
            className="flex justify-center items-center text-lg cursor-pointer"
        >
            <IoTrash />
        </div>
    );
}
