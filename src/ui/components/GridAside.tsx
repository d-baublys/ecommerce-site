"use client";

import { PriceFilterKey, priceFiltersOptions, Product, VALID_SIZES } from "@/lib/definitions";
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

    const populateSizes = () => {
        return Object.entries(sizesObj).map(([size, count]) => {
            if (!count) return null;

            return (
                <GeneralButton
                    key={size}
                    onClick={() => handleSizePress(size as Sizes)}
                    className={`!py-2 !px-3 h-min ${
                        sizeFilters.includes(size as Sizes) ? "" : "!border-contrasted "
                    }`}
                >
                    {size.toUpperCase()} ({count})
                </GeneralButton>
            );
        });
    };

    const handlePricePress = (key: PriceFilterKey) => {
        setPriceFilters((prev) =>
            priceFilters.includes(key) ? prev.filter((prevKey) => prevKey !== key) : [...prev, key]
        );
    };

    const pricesObj = useMemo(() => {
        const pricesObj: Record<string, number> = {} as Record<string, number>;

        Object.keys(priceFiltersOptions).forEach((key) => {
            pricesObj[key] = 0;
        });

        allCategoryProducts.forEach((product) => {
            Object.entries(priceFiltersOptions).forEach(([key, range]) => {
                if (range.min <= product.price && product.price < range.max) {
                    pricesObj[key]++;
                }
            });
        });
        return pricesObj;
    }, [allCategoryProducts]);

    const populatePrices = () => {
        return Object.entries(pricesObj).map(([key, count]) => {
            if (!count) return null;

            return (
                <GeneralButton
                    key={key}
                    onClick={() => handlePricePress(key as PriceFilterKey)}
                    className={`!py-2 !px-3 h-min ${
                        priceFilters.includes(key) ? "" : "!border-contrasted "
                    }`}
                >
                    {createPriceLabel(key as PriceFilterKey, count)}
                </GeneralButton>
            );
        });
    };

    const createPriceLabel = (key: PriceFilterKey, count: number) => {
        return isFinite(priceFiltersOptions[key].max)
            ? `£${priceFiltersOptions[key].min / 100}-£${
                  priceFiltersOptions[key].max / 100 - 1
              } (${count})`
            : `Over £${priceFiltersOptions[key].min / 100} (${count})`;
    };

    return (
        <div>
            <AccordionSection text="Size">{populateSizes()}</AccordionSection>
            <AccordionSection text="Price">{populatePrices()}</AccordionSection>
        </div>
    );
}
