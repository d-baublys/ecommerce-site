"use client";

import { Product } from "@/lib/types";
import CloseButton from "@/ui/components/buttons/CloseButton";
import ProductListTile from "@/ui/components/cards/ProductListTile";

export default function DisplayTile({
    productData,
    handleDelete,
}: {
    productData: Product;
    handleDelete?: () => void;
}) {
    const buildEndContent = () => (
        <div className="flex flex-col justify-between w-full items-end h-full">
            {handleDelete && (
                <CloseButton
                    title="Remove from list"
                    aria-label="Remove from list"
                    onClick={handleDelete}
                    className="translate-x-1"
                />
            )}
        </div>
    );

    return (
        <ProductListTile
            data={productData}
            wrapWithLink={false}
            showSize={false}
            endContent={buildEndContent()}
        />
    );
}
