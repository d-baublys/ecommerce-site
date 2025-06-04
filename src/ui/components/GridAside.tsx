"use client";

import { PriceFilterKey, PRICE_FILTER_OPTIONS, Product, VALID_SIZES } from "@/lib/definitions";
import AccordionSection from "./AccordionSection";
import GeneralButton from "./GeneralButton";
import { Sizes } from "@/lib/definitions";
import { useMemo } from "react";

export default function GridAside({
    allCategoryProducts,
    sizeFilters,
    setSizeFilters,
    priceFilters,
    setPriceFilters,
}: {
    allCategoryProducts: Product[];
    sizeFilters: Sizes[];
    setSizeFilters: React.Dispatch<React.SetStateAction<Sizes[]>>;
    priceFilters: string[];
    setPriceFilters: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    const handleSizePress = (size: Sizes) => {
        setSizeFilters((prev) =>
            sizeFilters.includes(size)
                ? prev.filter((prevSize) => prevSize !== size)
                : [...prev, size]
        );
    };

    const sizesObj = useMemo(() => {
        const sizesObj: Record<Sizes, number> = {} as Record<Sizes, number>;

        VALID_SIZES.forEach((size) => {
            sizesObj[size as Sizes] = 0;
        });

        allCategoryProducts.forEach((product) => {
            Object.keys(product.stock).forEach(
                (size) => product.stock[size as Sizes] && sizesObj[size as Sizes]++
            );
        });

        return sizesObj;
    }, [allCategoryProducts]);

    const populateSizes = () => (
        <ul>
            {Object.entries(sizesObj).map(
                ([size, count]) =>
                    count > 0 && (
                        <li key={size}>
                            <GeneralButton
                                onClick={() => handleSizePress(size as Sizes)}
                                className={`!py-1 !px-2 h-min !bg-background-lightest !text-sz-label-button lg:!text-sz-label-button-lg ${
                                    sizeFilters.includes(size as Sizes)
                                        ? ""
                                        : "!border-background-lightest "
                                }`}
                            >
                                {size.toUpperCase()} ({count})
                            </GeneralButton>
                        </li>
                    )
            )}
        </ul>
    );

    const handlePricePress = (key: PriceFilterKey) => {
        setPriceFilters((prev) =>
            priceFilters.includes(key) ? prev.filter((prevKey) => prevKey !== key) : [...prev, key]
        );
    };

    const pricesObj = useMemo(() => {
        const pricesObj: Record<string, number> = {} as Record<string, number>;

        Object.keys(PRICE_FILTER_OPTIONS).forEach((key) => {
            pricesObj[key] = 0;
        });

        allCategoryProducts.forEach((product) => {
            Object.entries(PRICE_FILTER_OPTIONS).forEach(([key, range]) => {
                if (range.min <= product.price && product.price < range.max) {
                    pricesObj[key]++;
                }
            });
        });
        return pricesObj;
    }, [allCategoryProducts]);

    const populatePrices = () => (
        <ul>
            {Object.entries(pricesObj).map(
                ([key, count]) =>
                    count > 0 && (
                        <li key={key}>
                            <GeneralButton
                                onClick={() => handlePricePress(key as PriceFilterKey)}
                                className={`!py-1 !px-2 h-min !bg-background-lightest !text-sz-label-button lg:!text-sz-label-button-lg ${
                                    priceFilters.includes(key) ? "" : "!border-background-lightest "
                                }`}
                            >
                                {createPriceLabel(key as PriceFilterKey, count)}
                            </GeneralButton>
                        </li>
                    )
            )}
        </ul>
    );

    const createPriceLabel = (key: PriceFilterKey, count: number) => {
        return isFinite(PRICE_FILTER_OPTIONS[key].max)
            ? `£${PRICE_FILTER_OPTIONS[key].min / 100}-£${
                  PRICE_FILTER_OPTIONS[key].max / 100 - 1
              } (${count})`
            : `Over £${PRICE_FILTER_OPTIONS[key].min / 100} (${count})`;
    };

    return (
        <div className="divide-y border-y">
            <AccordionSection text="Size">{populateSizes()}</AccordionSection>
            <AccordionSection text="Price">{populatePrices()}</AccordionSection>
        </div>
    );
}
