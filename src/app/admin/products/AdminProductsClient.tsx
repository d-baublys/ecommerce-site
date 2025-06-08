"use client";

import { Categories, Product, VALID_CATEGORIES } from "@/lib/definitions";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DisplayTile from "@/ui/components/DisplayTile";
import RoundedButton from "@/ui/components/RoundedButton";

export default function AdminProductsClient({ productData }: { productData: Product[] }) {
    const pathname = usePathname();
    const [filter, setFilter] = useState<Categories | undefined>();
    const querySet = productData.filter((item) => item.gender === filter);

    return (
        <div className="flex flex-col grow justify-center items-center min-w-[300px] sm:min-w-[500px] gap-8">
            <h2 className="text-sz-subheading lg:text-sz-subheading-lg font-semibold">Products</h2>
            <div className="flex justify-center">
                <Link href={`${pathname}/add-product`}>
                    <RoundedButton>+ Add Product</RoundedButton>
                </Link>
            </div>
            <ul className="flex flex-row justify-evenly items-center w-full">
                {Object.keys(VALID_CATEGORIES).map((category) => (
                    <li key={category}>
                        <RoundedButton
                            onClick={() => setFilter(category as Categories)}
                            className={`capitalize ${
                                filter === category &&
                                "!bg-component-color !border-component-color !text-contrasted"
                            }`}
                        >
                            {category}
                        </RoundedButton>
                    </li>
                ))}
            </ul>
            {filter ? (
                <ul className="flex flex-col gap-4">
                    {querySet.length > 0 ? (
                        querySet.map((item: Product) => (
                            <li key={item.id}>
                                <Link href={`${pathname}/${item.slug}`}>
                                    <DisplayTile productData={item} />
                                </Link>
                            </li>
                        ))
                    ) : (
                        <li>No products to show</li>
                    )}
                </ul>
            ) : (
                <p>{"Please select a filter"}</p>
            )}
        </div>
    );
}
