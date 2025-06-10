"use client";

import { MergedBagItem } from "@/lib/definitions";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useBagStore } from "@/stores/bagStore";
import { useEffect } from "react";
import { stringifyConvertPrice } from "@/lib/utils";

export default function BagTile({
    bagItem,
    handleDelete,
    productLink,
}: {
    bagItem: MergedBagItem;
    handleDelete?: () => void;
    productLink: string;
}) {
    const productData = bagItem.product;
    const updateQuantity = useBagStore((state) => state.updateQuantity);

    const stock = bagItem.latestSizeStock;
    const maxQty = Math.min(stock ?? 0, Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY));
    const latestQuantity = Math.min(bagItem.quantity, stock);

    useEffect(() => {
        if (latestQuantity !== bagItem.quantity) {
            updateQuantity(productData.id, bagItem.size, latestQuantity);
        }
    }, [latestQuantity]);

    return (
        <div className="flex h-40 w-full">
            <Link className="w-full" href={productLink}>
                {
                    <div className="flex h-full grow gap-2 sm:gap-8">
                        <div className="wishlist-img-wrapper relative h-full aspect-3/4">
                            <Image
                                className="object-cover"
                                src={productData.src}
                                alt={productData.alt}
                                sizes="auto"
                                fill
                            ></Image>
                        </div>
                        <div className="flex flex-col justify-between">
                            <div className="text-sz-interm lg:text-sz-interm-lg font-semibold">
                                <p>{productData.name.toUpperCase()}</p>
                            </div>
                            <div className="text-component-color">
                                <p>Size - {bagItem.size.toUpperCase()}</p>
                            </div>
                        </div>
                    </div>
                }
            </Link>
            <div className="flex flex-col justify-between items-end h-full w-24">
                <p className="text-sz-interm lg:text-sz-interm-lg">
                    <span>£</span>
                    <span>{stringifyConvertPrice(productData.price * bagItem.quantity)}</span>
                </p>
                <div className="flex items-center gap-2 pr-2">
                    {stock ? (
                        <select
                            value={bagItem.quantity}
                            className="h-10 w-10 pl-1 border-2 rounded-md"
                            onChange={(e) =>
                                updateQuantity(productData.id, bagItem.size, Number(e.target.value))
                            }
                        >
                            {Array.from({ length: maxQty }, (_, idx) => (
                                <option value={idx + 1} key={idx}>
                                    {idx + 1}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex justify-center w-full text-end text-component-color">
                            <p>Out of stock</p>
                        </div>
                    )}
                    <IoClose
                        onClick={handleDelete}
                        className="translate-x-1 cursor-pointer"
                        size={24}
                    />
                </div>
            </div>
        </div>
    );
}
