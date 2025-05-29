"use client";

import { Categories, Product, VALID_CATEGORIES } from "@/lib/definitions";
import { useState } from "react";
import BagTile from "@/ui/components/BagTile";
import GeneralButton from "@/ui/components/GeneralButton";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminProductsClient({ productData }: { productData: Product[] }) {
    const pathname = usePathname();
    const [filter, setFilter] = useState<Categories | undefined>();
    const querySet = productData.filter((item) => item.gender === filter);

    return (
        <div className="flex flex-col grow justify-center items-center min-w-[300px] sm:min-w-[500px] gap-8">
            <div className="text-xl font-semibold">Products</div>
            <div className="flex justify-center">
                <Link href={`${pathname}/add-product`}>
                    <GeneralButton>+ Add Product</GeneralButton>
                </Link>
            </div>
            <div className="flex flex-row justify-evenly items-center w-full">
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
            {filter ? (
                <div className="flex flex-col gap-4">
                    {querySet.map((item: Product) => (
                        <Link key={item.id} href={`${pathname}/${item.slug}`}>
                            <BagTile dataObj={item} />
                        </Link>
                    ))}
                </div>
            ) : (
                "Please select a filter"
            )}
        </div>
    );
}
