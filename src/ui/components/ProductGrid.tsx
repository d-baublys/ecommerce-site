"use client";

import {
    Categories,
    PriceFilterKey,
    Product,
    ProductSortKey,
    Sizes,
    SORT_OPTIONS,
    VALID_CATEGORIES,
} from "@/lib/definitions";
import ProductTile from "./ProductTile";
import GridAside from "./GridAside";
import { useEffect, useRef, useState } from "react";
import { fetchFilteredProducts } from "@/lib/utils";
import Link from "next/link";
import { IoChevronDown } from "react-icons/io5";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";

export default function ProductGrid({ category }: { category: Categories | "all" }) {
    const [allCategoryProducts, setAllCategoryProducts] = useState<Product[]>();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>();

    const [sizeFilters, setSizeFilters] = useState<Sizes[]>([]);
    const [priceFilters, setPriceFilters] = useState<PriceFilterKey[]>([]);
    const [productSort, setProductSort] = useState<ProductSortKey>();

    const [error, setError] = useState<Error | null>(null);
    const [isQueryLoading, setIsQueryLoading] = useState<boolean>(true);
    const isFirstLoad = useRef<boolean>(true);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                setIsQueryLoading(true);
                const products = await fetchFilteredProducts({ category });

                setAllCategoryProducts(products);
                setIsQueryLoading(false);
            } catch {
                setError(new Error("Error fetching product data. Please try again later."));
            }
        };

        fetchInitial();
    }, []);

    useEffect(() => {
        const fetchFiltered = async () => {
            try {
                setIsQueryLoading(true);
                const products = await fetchFilteredProducts({
                    category,
                    sizeFilters,
                    priceFilters,
                    productSort,
                });

                if (isFirstLoad.current) {
                    isFirstLoad.current = false;
                    setFilteredProducts(products);
                    setIsQueryLoading(false);
                } else {
                    setTimeout(() => {
                        setFilteredProducts(products);
                        setIsQueryLoading(false);
                    }, 400);
                }
            } catch {
                setError(new Error("Error fetching product data. Please try again later."));
            }
        };

        fetchFiltered();
    }, [category, sizeFilters, priceFilters, productSort]);

    const loadingIndicator = () => {
        return (
            <div className="fixed inset-0 flex justify-center items-center min-h-screen w-full">
                <div className="flex justify-center items-center h-20 gap-[10px] p-4 bg-white rounded-2xl drop-shadow-(--button-shadow)">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className={`loading-circle w-auto h-3 aspect-square rounded-full border-2 border-component-color [animation:loadingSequence_1s_infinite]`}
                        ></div>
                    ))}
                </div>
            </div>
        );
    };

    useBodyScrollLock(isQueryLoading);

    if (error) throw error;

    if (!(allCategoryProducts && filteredProducts)) return loadingIndicator();

    return (
        <div className="flex flex-col px-(--gutter) py-8 lg:px-(--gutter-md) w-screen grow">
            {category === "all" && (
                <ul className="flex w-full border-b-2 gap-8 mb-8 py-2">
                    {Object.entries(VALID_CATEGORIES).map(([key, displayName]) => (
                        <li key={key}>
                            <Link href={`/category/${key}`}>
                                <div>{displayName}</div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex flex-row grow">
                <aside id="filter-aside" className="[flex:1_0_250px]">
                    <div className="sticky top-(--nav-height)">
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
                    <div className="flex justify-between w-full pb-4 font-semibold">
                        <div>
                            <span>{filteredProducts.length}</span> <span>Items</span>
                        </div>
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
                                    productSort ? "" : "max-w-[100px] lg:max-w-[115px]"
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
                                    <div
                                        key={product.id}
                                        className="col-span-6 xl:col-span-4 2xl:col-span-3"
                                    >
                                        <ProductTile product={product} />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex justify-center items-center w-full p-4 gap-4">
                                <p>No products matching your filter</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            {isQueryLoading && loadingIndicator()}
        </div>
    );
}
