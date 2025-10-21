"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import DisplayTile from "@/ui/components/cards/DisplayTile";
import SearchBar from "@/ui/components/SearchBar";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";
import { buildAdminProductUrl } from "@/lib/utils";
import { VALID_CATEGORIES } from "@/lib/constants";
import { Categories, ClientProduct } from "@/lib/types";

export default function AdminProductsClient() {
    const pathname = usePathname();
    const [filter, setFilter] = useState<Categories | null>(null);
    const [unfilteredResults, setUnfilteredResults] = useState<ClientProduct[]>([]);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
    const querySet = unfilteredResults.filter((item) => {
        if (filter || /^\s+$/.test(searchQuery)) return item.gender === filter;
        if (searchQuery) return true;
        return false;
    });

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
                    options={{ isGlobalSearch: false, showSuggestions: false }}
                    parentSetter={setUnfilteredResults}
                    parentQuerySetter={setSearchQuery}
                    parentFilter={filter}
                    parentLoadingStateSetter={setIsResultLoading}
                />
            </div>
            <ul className="flex flex-row justify-evenly items-center w-full">
                {VALID_CATEGORIES.map((c) => (
                    <li key={c.key}>
                        <PlainRoundedButton
                            onClick={() => setFilter((curr) => (curr === c.key ? null : c.key))}
                            overrideClasses={`!bg-background-lightest ${
                                filter === c.key &&
                                "!bg-component-color !border-component-color !text-contrasted"
                            }`}
                        >
                            {c.label}
                        </PlainRoundedButton>
                    </li>
                ))}
            </ul>
            <div className="flex justify-center w-full grow">
                {!isResultLoading ? (
                    (filter || searchQuery) && querySet.length > 0 ? (
                        <ul id="admin-products-container" className="flex flex-col w-full">
                            {querySet.map((item: ClientProduct) => (
                                <li key={item.id} className="mt-8">
                                    <Link href={buildAdminProductUrl(item.id)}>
                                        <DisplayTile productData={item} />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="flex items-center mt-8 h-full">
                            <p className="text-center">
                                {!(filter || searchQuery) ||
                                (searchQuery && /^\s+$/.test(searchQuery))
                                    ? "Please select a filter or search by keyword"
                                    : "No products matching your search"}
                            </p>
                        </div>
                    )
                ) : null}
            </div>
        </div>
    );
}
