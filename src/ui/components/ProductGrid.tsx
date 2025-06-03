"use client";

import {
    Categories,
    Product,
    ProductSortKey,
    Sizes,
    SORT_OPTIONS,
    VALID_CATEGORIES,
} from "@/lib/definitions";
import ProductTile from "./ProductTile";
import GridAside from "./GridAside";
import { useEffect, useState } from "react";
import { fetchFilteredProducts } from "@/lib/utils";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";

export default function ProductGrid({ category }: { category: Categories | "all" }) {
    const [allCategoryProducts, setAllCategoryProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [sizeFilters, setSizeFilters] = useState<Sizes[]>([]);
    const [priceFilters, setPriceFilters] = useState<string[]>([]);
    const [productSort, setProductSort] = useState<ProductSortKey>();

    useEffect(() => {
        const fetchInitial = async () => {
            const products = await fetchFilteredProducts({ category });

            setAllCategoryProducts(products);
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        const fetchFiltered = async () => {
            const products = await fetchFilteredProducts({
                category,
                sizeFilters,
                priceFilters,
                productSort,
            });

            setFilteredProducts(products);
        };

        fetchFiltered();
    }, [category, sizeFilters, priceFilters, productSort]);

    return (
        <div className="flex flex-col px-(--gutter) py-8 lg:px-(--gutter-md) w-screen grow">
            {category === "all" && (
                <div className="flex w-full border-b-2 gap-8 mb-8 py-2">
                    {Object.entries(VALID_CATEGORIES).map(([key, displayName]) => (
                        <Link key={key} href={`/category/${key}`}>
                            <div>{displayName}</div>
                        </Link>
                    ))}
                </div>
            )}
            <div className="flex flex-row grow">
                <aside id="filter-aside" className="[flex:1_0_200px]">
                    <div className="sticky top-0">
                        <GridAside
                            allCategoryProducts={allCategoryProducts}
                            sizeFilters={sizeFilters}
                            setSizeFilters={setSizeFilters}
                            priceFilters={priceFilters}
                            setPriceFilters={setPriceFilters}
                        />
                    </div>
                </aside>
                <div className="flex flex-col w-full ml-8">
                    <div className="flex justify-between w-full pb-4 text-sm font-semibold">
                        <div>{filteredProducts.length} Items</div>
                        <div className="flex items-center gap-1">
                            <label
                                htmlFor="sort-select"
                                className={`pr-2 pointer-events-none ${
                                    productSort ? "" : "translate-x-[120%]"
                                }`}
                            >
                                Sort By
                            </label>
                            <select
                                id="sort-select"
                                className={`pr-6 font-normal appearance-none cursor-pointer ${
                                    productSort ? "" : "max-w-[100px]"
                                }`}
                                onChange={(e) => setProductSort(e.target.value as ProductSortKey)}
                                defaultValue="default"
                            >
                                <option disabled hidden value="default"></option>
                                {Object.entries(SORT_OPTIONS).map(([key, sortData]) => (
                                    <option key={key} value={key}>
                                        {sortData.displayName}
                                    </option>
                                ))}
                            </select>
                            <IoChevronDown className="relative translate-x-[-150%] extra-stroked pointer-events-none" />
                        </div>
                    </div>
                    <div className="flex grow">
                        {filteredProducts.length > 0 ? (
                            <div className="grid grid-cols-12 w-full gap-x-4 gap-y-8">
                                {filteredProducts.map((product) => (
                                    <div key={product.id} className="col-span-6 xl:col-span-4 2xl:col-span-3">
                                        <ProductTile product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center w-full p-4 gap-4">
                                No products matching your filter
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
