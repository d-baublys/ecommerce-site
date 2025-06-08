"use client";

import {
    Categories,
    PriceFilterKey,
    Product,
    ProductSortKey,
    Sizes,
    SORT_OPTIONS,
} from "@/lib/definitions";
import GridAside from "./GridAside";
import { useEffect, useRef, useState } from "react";
import { fetchFilteredProducts } from "@/lib/utils";
import { IoChevronDown } from "react-icons/io5";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import SlideDownMenu from "./SlideDownMenu";
import BaseGridPage from "./BaseGridPage";
import RoundedButton from "./RoundedButton";

export default function CategoryGridPage({ category }: { category: Categories | "all" }) {
    const [allCategoryProducts, setAllCategoryProducts] = useState<Product[]>();
    const [filteredProducts, setFilteredProducts] = useState<Product[]>();

    const [sizeFilters, setSizeFilters] = useState<Sizes[]>([]);
    const [priceFilters, setPriceFilters] = useState<PriceFilterKey[]>([]);
    const [productSort, setProductSort] = useState<ProductSortKey>();

    const [error, setError] = useState<Error | null>(null);
    const [isQueryLoading, setIsQueryLoading] = useState<boolean>(true);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
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

    const sortingUnit = () => {
        return (
            <div id="product-sort-input" className="flex items-center gap-1 translate-x-4">
                <label
                    htmlFor="sort-select"
                    className={`pr-2 whitespace-nowrap pointer-events-none ${
                        productSort ? "translate-x-[10%] md:translate-0" : "translate-x-[120%]"
                    }`}
                >
                    Sort By
                </label>
                <select
                    id="sort-select"
                    className={`pr-5 font-normal appearance-none cursor-pointer ${
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
                <IoChevronDown
                    className="relative translate-x-[-150%] extra-stroked pointer-events-none"
                    size={14}
                />
            </div>
        );
    };

    useBodyScrollLock(isQueryLoading);

    if (error) throw error;

    if (!(allCategoryProducts && filteredProducts)) return loadingIndicator();

    const asideContent = () => {
        return (
            <aside id="filter-aside" className="hidden lg:flex [flex:1_0_250px] mr-8">
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
        );
    };

    const fixedOverlays = () => {
        return (
            <>
                {isQueryLoading && loadingIndicator()}
                {!isFilterOpen && (
                    <div className="fixed bottom-[5%] left-1/2 translate-x-[-50%] lg:hidden">
                        <RoundedButton
                            className="!bg-black !text-contrasted !border-black [filter:drop-shadow(0_0_2px_rgba(255,255,255,0.5))]"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            Filter
                        </RoundedButton>
                    </div>
                )}
                <SlideDownMenu predicate={isFilterOpen} predicateSetter={setIsFilterOpen}>
                    <GridAside
                        allCategoryProducts={allCategoryProducts}
                        sizeFilters={sizeFilters}
                        setSizeFilters={setSizeFilters}
                        priceFilters={priceFilters}
                        setPriceFilters={setPriceFilters}
                    />
                </SlideDownMenu>
            </>
        );
    };

    return (
        <BaseGridPage
            displayedProducts={filteredProducts}
            noProductMessage={
                allCategoryProducts.length > 0
                    ? "No products matching your filter"
                    : "No products to display"
            }
            category={category}
            asideContent={asideContent()}
            fixedOverlays={fixedOverlays()}
            sortingUnit={sortingUnit()}
        />
    );
}
