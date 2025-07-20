"use client";

import { MergedBagItem } from "@/lib/definitions";
import Link from "next/link";
import { useBagStore } from "@/stores/bagStore";
import { useEffect } from "react";
import { buildProductUrl, stringifyConvertPrice } from "@/lib/utils";
import ProductImage from "@/ui/components/ProductImage";
import CloseButton from "@/ui/components/buttons/CloseButton";

export default function BagTile({
    bagItem,
    handleDelete,
    productSlug,
}: {
    bagItem: MergedBagItem;
    handleDelete?: () => void;
    productSlug: string;
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
        <div className="bag-tile flex h-40 w-full">
            <Link className="w-full" href={buildProductUrl(productSlug)}>
                {
                    <div className="flex h-full grow gap-2 sm:gap-8">
                        <ProductImage product={productData} overrideClasses="aspect-3/4" />
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
            <div className="flex flex-col justify-between items-end h-full w-24 ml-8">
                <p className="text-sz-interm lg:text-sz-interm-lg">
                    <span>£</span>
                    <span>{stringifyConvertPrice(productData.price * bagItem.quantity)}</span>
                </p>
                <div className="flex items-center gap-2 pr-2">
                    {stock ? (
                        <select
                            value={bagItem.quantity}
                            className="h-10 w-10 pl-1 border-2 rounded-md bg-white"
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
                    <CloseButton
                        aria-label="Remove from bag"
                        title="Remove from bag"
                        onClick={handleDelete}
                        className="translate-x-1"
                    />
                </div>
            </div>
        </div>
    );
}
