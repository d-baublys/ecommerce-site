"use client";

import { MergedBagItem } from "@/lib/definitions";
import { useBagStore } from "@/stores/bagStore";
import { useEffect } from "react";
import { stringifyConvertPrice } from "@/lib/utils";
import CloseButton from "@/ui/components/buttons/CloseButton";
import ProductListTile from "@/ui/components/cards/ProductListTile";

export default function BagTile({
    bagItem,
    handleDelete,
}: {
    bagItem: MergedBagItem;
    handleDelete?: () => void;
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

    const buildEndContent = () => (
        <div className="flex flex-col justify-between items-end h-full">
            <p className="text-sz-interm lg:text-sz-interm-lg">
                <span>£</span>
                <span>{stringifyConvertPrice(productData.price * bagItem.quantity)}</span>
            </p>
            <div className="flex items-center gap-2 pr-2">
                {stock ? (
                    <select
                        aria-label="Quantity selection"
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
    );

    return (
        <ProductListTile
            data={bagItem}
            wrapWithLink={true}
            showSize={true}
            endContent={buildEndContent()}
            externalOverrides="bag-tile"
            internalOverrides="!h-40"
        />
    );
}
