import { Product, Sizes } from "@/lib/definitions";
import { IoTrash } from "react-icons/io5";

export default function StockRowDelete({
    stockObjSetter,
    size,
}: {
    stockObjSetter: React.Dispatch<React.SetStateAction<Product["stock"]>>;
    size: Sizes;
}) {
    const handleDelete = () => {
        stockObjSetter((prev) => {
            const newObj = { ...prev };
            delete newObj[size];

            return newObj;
        });
    };

    return (
        <div
            onClick={() => handleDelete()}
            className="flex justify-center items-center cursor-pointer"
        >
            <IoTrash size={20} />
        </div>
    );
}
