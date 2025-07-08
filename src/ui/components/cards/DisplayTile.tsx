"use client";

import { Product } from "@/lib/definitions";
import ProductImage from "@/ui/components/ProductImage";
import CloseButton from "@/ui/components/buttons/CloseButton";

export default function DisplayTile({
    productData,
    handleDelete,
}: {
    productData: Product;
    handleDelete?: () => void;
}) {
    return (
        <div className="flex h-28 w-full border-2 p-2 bg-white">
            <div className="flex h-full grow gap-2 sm:gap-8">
                <ProductImage product={productData} overrideClasses="aspect-square" />
                <div className="flex flex-col justify-between">
                    <div className="font-semibold">{productData.name.toUpperCase()}</div>
                </div>
            </div>
            <div className="flex flex-col justify-between items-end h-full">
                {handleDelete && (
                    <CloseButton
                        title="Remove from list"
                        aria-label="Remove from list"
                        onClick={handleDelete}
                        className="translate-x-1"
                    />
                )}
            </div>
        </div>
    );
}
