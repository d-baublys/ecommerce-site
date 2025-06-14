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
        <div className="flex flex-col grow w-full justify-center items-center">
            <div className="flex justify-center mb-8">
                <Link href={`${pathname}/add-product`}>
                    <RoundedButton>+ Add Product</RoundedButton>
                </Link>
            </div>
            <ul className="flex flex-row justify-evenly items-center w-full">
                {Object.keys(VALID_CATEGORIES).map((category) => (
                    <li key={category}>
                        <RoundedButton
                            onClick={() => setFilter(category as Categories)}
                            overrideClasses={`${
                                filter === category &&
                                "!bg-component-color !border-component-color !text-contrasted"
                            }`}
                        >
                            {VALID_CATEGORIES[category as Categories]}
                        </RoundedButton>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center w-full grow">
                {filter ? (
                    <ul className="flex flex-col w-full">
                        {querySet.length > 0 ? (
                            querySet.map((item: Product) => (
                                <li key={item.id} className="mt-8">
                                    <Link href={`${pathname}/${encodeURIComponent(item.slug)}`}>
                                        <DisplayTile productData={item} />
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li>No products to show</li>
                        )}
                    </ul>
                ) : (
                    <div className="mt-8">
                        <p>{"Please select a filter"}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
