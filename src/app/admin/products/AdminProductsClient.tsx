"use client";

import { Categories, Product, VALID_CATEGORIES } from "@/lib/definitions";
import { useState } from "react";
import ProductTile from "@/ui/components/ProductTile";
import GeneralButton from "@/ui/components/GeneralButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminProductsClient({ productData }: { productData: Product[] }) {
    const pathname = usePathname();
    const [filter, setFilter] = useState<Categories | undefined>();
    const querySet = productData.filter((item) => item.gender === filter);

    return (
        <div className="flex flex-col grow justify-center items-center min-w-[300px] sm:min-w-[500px] gap-8">
            <div className="flex justify-center">
                <Link href={`${pathname}/add-product`}>
                    <GeneralButton>+ Add Product</GeneralButton>
                </Link>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
                <div>Filter Existing</div>
                {VALID_CATEGORIES.map((category) => (
                    <GeneralButton
                        key={category}
                        onClick={() => setFilter(category)}
                        className={`capitalize ${
                            filter === category &&
                            "!bg-component-color !border-component-color !text-contrasted"
                        }`}
                    >
                        {category}
                    </GeneralButton>
                ))}
            </div>
            {querySet && (
                <div className="flex flex-col gap-4">
                    {querySet.map((item: Product) => (
                        <Link key={item.id} href={`${pathname}/${item.slug}`}>
                            <ProductTile dataObj={item} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
