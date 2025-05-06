import { BagItem } from "@/lib/types";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

export default function BagTile({
    bagItem,
    handleDelete,
}: {
    bagItem: BagItem;
    handleDelete: (deletedProduct: BagItem) => void;
}) {
    const stock = bagItem.product.stock;
    const qtyOptions = stock[bagItem.size as keyof typeof stock];
    const maxQty = Math.min(qtyOptions ?? 0, 5);

    return (
        <div className="flex h-24 w-full sm:w-1/2 min-w-[300px] sm:min-w-[500px] border-2 p-2">
            <Link className="w-full" href={`products/${bagItem.product.slug}`}>
                <div className="flex h-full gap-2 sm:gap-8">
                    <div className="wishlist-img-wrapper relative h-full aspect-square">
                        <Image
                            className="object-cover"
                            src={bagItem.product.src}
                            alt={bagItem.product.alt}
                            sizes="auto"
                            fill
                        ></Image>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="font-semibold">{bagItem.product.name.toUpperCase()}</div>
                        <div className="text-component-color">
                            Size - {bagItem.size.toUpperCase()}
                        </div>
                    </div>
                </div>
            </Link>
            <div className="flex flex-col justify-between items-end h-full w-24 text-2xl">
                <IoClose
                    onClick={() => handleDelete(bagItem)}
                    className="translate-x-1 cursor-pointer"
                />
                {qtyOptions ? (
                    <select className="h-10 w-10 pl-1 text-xl border-2 rounded-md">
                        {Array.from({ length: maxQty }, (_, idx) => (
                            <option value={idx} key={idx}>
                                {idx + 1}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className="flex justify-center w-full text-base text-end text-component-color">
                        Out of stock
                    </div>
                )}
            </div>
        </div>
    );
}
