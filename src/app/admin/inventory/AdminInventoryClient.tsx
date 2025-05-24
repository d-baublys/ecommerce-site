"use client";

import { Product } from "@/lib/definitions";
import { useState } from "react";
import ProductTile from "@/ui/components/ProductTile";
import GeneralButton from "@/ui/components/GeneralButton";
import { Sizes } from "@/lib/definitions";
import Link from "next/link";

export default function AdminInventoryClient({ productData }: { productData: Product[] }) {
    const [filter, setFilter] = useState<Sizes | undefined>();

    const querySet = productData.filter((item) => (item.gender as Sizes) === filter);

    return (
        <div className="flex flex-col grow justify-center items-center min-w-[300px] sm:min-w-[500px] gap-8">
            <div className="flex justify-center">
                <GeneralButton>+ Add Product</GeneralButton>
            </div>
            <div className="flex flex-row justify-between items-center w-full">
                <div>Filter Existing</div>
                <GeneralButton
                    onClick={() => setFilter("mens" as Sizes)}
                    className={`${
                        filter === ("mens" as Sizes) &&
                        "!bg-component-color !border-component-color !text-contrasted"
                    }`}
                >
                    Mens
                </GeneralButton>
                <GeneralButton
                    onClick={() => setFilter("womens" as Sizes)}
                    className={`${
                        filter === ("womens" as Sizes) &&
                        "!bg-component-color !border-component-color !text-contrasted"
                    }`}
                >
                    Womens
                </GeneralButton>
            </div>
            {querySet && (
                <div className="flex flex-col gap-4">
                    {querySet.map((item: Product, idx: number) => (
                        <Link key={idx} href={`inventory/${item.slug}`}>
                            <ProductTile dataObj={item} />
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
