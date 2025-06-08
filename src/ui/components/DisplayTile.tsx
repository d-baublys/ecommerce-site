"use client";

import { Product } from "@/lib/definitions";
import { IoClose } from "react-icons/io5";
import Image from "next/image";

export default function DisplayTile({
    productData,
    handleDelete,
}: {
    productData: Product;
    handleDelete?: () => void;
}) {
    return (
        <div className="flex h-24 w-full sm:w-1/2 min-w-[300px] sm:min-w-[500px] border-2 p-2">
            <div className="flex h-full grow gap-2 sm:gap-8">
                <div className="wishlist-img-wrapper relative h-full aspect-square">
                    <Image
                        className="object-cover"
                        src={productData.src}
                        alt={productData.alt}
                        sizes="auto"
                        fill
                    ></Image>
                </div>
                <div className="flex flex-col justify-between">
                    <div className="font-semibold">{productData.name.toUpperCase()}</div>
                </div>
            </div>
            <div className="flex flex-col justify-between items-end h-full w-24">
                {handleDelete && (
                    <IoClose
                        onClick={handleDelete}
                        className="translate-x-1 cursor-pointer"
                        size={24}
                    />
                )}
            </div>
        </div>
    );
}
