"use client";

import { Categories, ClientProduct, PriceFilterId, ProductSortId, Sizes } from "@/lib/types";
import GridAside from "@/ui/components/product-grid/GridAside";
import { useEffect, useRef, useState } from "react";
import { extractFilters, extractSort } from "@/lib/utils";
import { IoChevronDown } from "react-icons/io5";
import SlideDownMenu from "@/ui/components/overlays/SlideDownMenu";
import BaseGridPage from "@/ui/pages/BaseGridPage";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { getFilteredProducts } from "@/lib/fetching-utils";
import LoadingIndicator from "@/ui/components/overlays/LoadingIndicator";
import { PRICE_FILTER_OPTIONS, SORT_OPTIONS, VALID_CATEGORIES, VALID_SIZES } from "@/lib/constants";

type PageOptions = {
    noAside?: boolean;
    noCategoryTabs?: boolean;
    noOverlays?: boolean;
    noSorting?: boolean;
};

export default function CategoryGridPage({
    category,
    options,
    query,
}: {
    category: Categories | "all";
    options?: PageOptions;
    query?: string;
}) {
    const paramsGetter = useSearchParams();
    const paramsSetter = new URLSearchParams(paramsGetter);
    const pathname = usePathname();
    const { replace } = useRouter();
    const [urlSizeFilters, urlPriceFilters, urlSort] = [
        paramsGetter.get("s"),
        paramsGetter.get("p"),
        paramsGetter.get("sort"),
    ];

    const [allCategoryProducts, setAllCategoryProducts] = useState<ClientProduct[]>();
    const [filteredProducts, setFilteredProducts] = useState<ClientProduct[]>();

    const [sizeFilters, setSizeFilters] = useState<Sizes[]>(
        extractFilters<Sizes>(urlSizeFilters, VALID_SIZES)
    );
    const [priceFilters, setPriceFilters] = useState<PriceFilterId[]>(
        extractFilters<PriceFilterId>(
            urlPriceFilters,
            Object.keys(PRICE_FILTER_OPTIONS) as PriceFilterId[]
        )
    );
    const [productSort, setProductSort] = useState<ProductSortId | "placeholder">(
        extractSort(urlSort)
    );

    const [error, setError] = useState<Error | null>(null);
    const [isQueryLoading, setIsQueryLoading] = useState<boolean>(false);
    const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
    const isFirstLoad = useRef<boolean>(true);

    useEffect(() => {
        const fetchInitial = async () => {
            try {
                const products = await getFilteredProducts({ category, query });
                setAllCategoryProducts(products);
            } catch {
                setError(new Error("Error fetching product data. Please try again later."));
            }
        };

        fetchInitial();
    }, [query]);

    useEffect(() => {
        if (isQueryLoading) return;

        const fetchFiltered = async () => {
            try {
                setIsQueryLoading(true);

                const start = Date.now();

                const filtered = await getFilteredProducts({
                    category,
                    sizeFilters,
                    priceFilters,
                    productSort,
                    query,
                });

                setFilteredProducts(filtered);

                const now = Date.now();
                const elapsed = now - start;
                const MIN_LOADING_TIME = 400;

                if (isFirstLoad.current) {
                    isFirstLoad.current = false;
                    setIsQueryLoading(false);
                } else {
                    setTimeout(
                        () => {
                            setIsQueryLoading(false);
                        },
                        elapsed < MIN_LOADING_TIME ? MIN_LOADING_TIME - elapsed : 0
                    );
                }
            } catch {
                setError(new Error("Error fetching product data. Please try again later."));
                setIsQueryLoading(false);
            }

            return () => {
                setIsQueryLoading(false);
            };
        };

        fetchFiltered();
    }, [category, sizeFilters, priceFilters, productSort, query]);

    useEffect(() => {
        const extractedSizes = extractFilters<Sizes>(urlSizeFilters, VALID_SIZES).sort();
        const extractedPrices = extractFilters<PriceFilterId>(
            urlPriceFilters,
            Object.keys(PRICE_FILTER_OPTIONS) as PriceFilterId[]
        ).sort();

        if (!sizeFilters.sort().every((f, idx) => f === extractedSizes[idx])) {
            setSizeFilters(extractedSizes);
        }

        if (!priceFilters.sort().every((f, idx) => f === extractedPrices[idx])) {
            setPriceFilters(extractedPrices);
        }

        if (productSort !== extractSort(urlSort)) {
            setProductSort(extractSort(urlSort));
        }
    }, [urlSizeFilters, urlPriceFilters, urlSort]);

    useEffect(() => {
        if (sizeFilters.length) {
            paramsSetter.set("s", sizeFilters.join("|"));
        } else {
            paramsSetter.delete("s");
        }

        if (priceFilters.length) {
            paramsSetter.set("p", priceFilters.join("|"));
        } else {
            paramsSetter.delete("p");
        }

        if (productSort && productSort !== "placeholder") {
            paramsSetter.set("sort", productSort);
        } else {
            paramsSetter.delete("sort");
        }

        replace(`${pathname}?${paramsSetter.toString()}`);
    }, [sizeFilters, priceFilters, productSort]);

    const categoryTabs = () => {
        return (
            <ul aria-label="Category tabs" className="flex w-full border-b-2 gap-8 mb-8 py-2">
                {VALID_CATEGORIES.map((c) => (
                    <li key={c.id}>
                        <Link href={`/category/${c.id}`}>
                            <div>{c.label}</div>
                        </Link>
                    </li>
                ))}
            </ul>
        );
    };

    const sortingUnit = () => {
        return (
            <div id="product-sort-input" className="relative flex items-center gap-1.5 xs:gap-3">
                <label
                    htmlFor="sort-select"
                    className={`whitespace-nowrap pointer-events-none ${
                        productSort !== "placeholder" ? "block" : "hidden"
                    }`}
                >
                    Sort By
                </label>
                <select
                    id="sort-select"
                    aria-label="Product sorting selection"
                    className={`pr-4 xs:pr-5 appearance-none cursor-pointer focus:max-w-none ${
                        productSort !== "placeholder"
                            ? "font-normal"
                            : "max-w-[85px] lg:max-w-[95px] font-semibold"
                    }`}
                    onChange={(e) => setProductSort(e.target.value as ProductSortId)}
                    value={productSort}
                >
                    <option disabled hidden value="placeholder">
                        Sort By
                    </option>
                    {Object.entries(SORT_OPTIONS).map(([key, sortData]) => (
                        <option key={key} value={key} className="font-normal">
                            {sortData.label}
                        </option>
                    ))}
                </select>
                <IoChevronDown
                    className="absolute right-0 translate-y-[1px] extra-stroked pointer-events-none"
                    size={14}
                />
            </div>
        );
    };

    if (error) throw error;

    if (!(allCategoryProducts && filteredProducts)) return <LoadingIndicator />;

    const shouldRenderTabs = !options?.noCategoryTabs && category === "all";
    const shouldRenderAside = !options?.noAside && (filteredProducts.length > 0 || !query);
    const shouldRenderFilterBtn = !isFilterOpen && shouldRenderAside;

    const asideContent = () => {
        return (
            <aside
                id="filter-aside"
                aria-label="Filtering aside"
                className="hidden lg:flex [flex:1_0_250px] mr-8"
            >
                <div className="desktop-filtering sticky top-(--nav-height) w-full">
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
            <div data-testid="fixed-overlays">
                {isQueryLoading && <LoadingIndicator />}
                {shouldRenderFilterBtn && (
                    <div className="fixed bottom-[5%] left-1/2 translate-x-[-50%] lg:hidden">
                        <PlainRoundedButton
                            overrideClasses="!bg-black !text-contrasted !border-black [filter:drop-shadow(0_0_2px_rgba(255,255,255,0.5))]"
                            onClick={() => setIsFilterOpen(true)}
                        >
                            Filter
                        </PlainRoundedButton>
                    </div>
                )}
                <SlideDownMenu
                    aria-label="Filter menu"
                    isOpenState={isFilterOpen}
                    handleClose={() => setIsFilterOpen(false)}
                    overrideClasses="lg:hidden"
                >
                    <div className="mobile-filtering flex w-full max-w-[500px]">
                        <GridAside
                            allCategoryProducts={allCategoryProducts}
                            sizeFilters={sizeFilters}
                            setSizeFilters={setSizeFilters}
                            priceFilters={priceFilters}
                            setPriceFilters={setPriceFilters}
                        />
                    </div>
                </SlideDownMenu>
            </div>
        );
    };

    return (
        <BaseGridPage
            displayedProducts={filteredProducts}
            noProductMessage={
                allCategoryProducts.length > 0
                    ? "No products matching your filter"
                    : query !== undefined
                    ? "No products matching your search"
                    : "No products to display"
            }
            linkWhenEmptyList={false}
            categoryTabs={shouldRenderTabs && categoryTabs()}
            asideContent={shouldRenderAside && asideContent()}
            fixedOverlays={!options?.noOverlays && fixedOverlays()}
            sortingUnit={!options?.noSorting && sortingUnit()}
        />
    );
}
