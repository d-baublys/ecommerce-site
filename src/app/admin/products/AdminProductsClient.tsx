"use client";

import { Categories, Product, VALID_CATEGORIES } from "@/lib/definitions";
import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import DisplayTile from "@/ui/components/cards/DisplayTile";
import SearchBar from "@/ui/components/SearchBar";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";

export default function AdminProductsClient() {
    const router = useRouter();
    const pathname = usePathname();
    const [filter, setFilter] = useState<Categories | null>(null);
    const [unfilteredResults, setUnfilteredResults] = useState<Product[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const querySet = unfilteredResults.filter((item) => {
        if (filter || /\s+/.test(searchQuery)) return item.gender === filter;
        if (searchQuery) return true;
        return false;
    });

    const handleResultClick = (product: Product) => {
        router.push(`/admin/products/${encodeURIComponent(product.slug)}`);
    };

    return (
        <div className="flex flex-col grow w-full justify-center items-center">
            <div className="flex justify-center mb-8">
                <PlainRoundedButtonLink
                    href={`${pathname}/add-product`}
                    overrideClasses="!bg-background-lightest"
                >
                    + Add Product
                </PlainRoundedButtonLink>
            </div>
            <div id="admin-product-search-container" className="w-full h-10 mb-8">
                <SearchBar
                    handleResultClick={handleResultClick}
                    options={{ isGlobalSearch: false, showSuggestions: false }}
                    parentSetter={setUnfilteredResults}
                    parentQuerySetter={setSearchQuery}
                    parentFilter={filter}
                />
            </div>
            <ul className="flex flex-row justify-evenly items-center w-full">
                {Object.keys(VALID_CATEGORIES).map((category) => (
                    <li key={category}>
                        <PlainRoundedButton
                            onClick={() =>
                                setFilter((curr) =>
                                    curr === category ? null : (category as Categories)
                                )
                            }
                            overrideClasses={`${
                                filter === category &&
                                "!bg-component-color !border-component-color !text-contrasted"
                            }`}
                        >
                            {VALID_CATEGORIES[category as Categories]}
                        </PlainRoundedButton>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center w-full grow">
                {(filter || searchQuery) && querySet.length > 0 ? (
                    <ul id="admin-products-container" className="flex flex-col w-full">
                        {querySet.map((item: Product) => (
                            <li key={item.id} className="mt-8">
                                <Link href={`${pathname}/${encodeURIComponent(item.slug)}`}>
                                    <DisplayTile productData={item} />
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="flex items-center mt-8 h-full">
                        <p className="text-center">
                            {filter || /\S+/.test(searchQuery)
                                ? "No products matching your search"
                                : "Please select a filter or search by keyword"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
