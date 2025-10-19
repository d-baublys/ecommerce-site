"use client";

import { PriceFilterKey, Product, Sizes } from "@/lib/types";
import AccordionSection from "./AccordionSection";
import React, { useMemo } from "react";
import FilterButton from "@/ui/components/buttons/FilterButton";
import { PRICE_FILTER_OPTIONS, VALID_SIZES } from "@/lib/constants";

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
    priceFilters: PriceFilterKey[];
    setPriceFilters: React.Dispatch<React.SetStateAction<PriceFilterKey[]>>;
}) {
    const createInitialObj = <T extends string>(keyArr: T[]) => {
        const dataObj: Record<T, number> = Object.fromEntries(
            keyArr.map((key) => [key, 0])
        ) as Record<T, number>;

        return dataObj;
    };

    const sizesObj = useMemo(() => {
        const keys = VALID_SIZES.map((size) => size);
        const sizesObj: Record<Sizes, number> = createInitialObj<Sizes>(keys);

        allCategoryProducts.forEach((product) => {
            Object.keys(product.stock).forEach(
                (size) => product.stock[size as Sizes] && sizesObj[size as Sizes]++
            );
        });

        return sizesObj;
    }, [allCategoryProducts]);

    const pricesObj = useMemo(() => {
        const keys = Object.keys(PRICE_FILTER_OPTIONS) as PriceFilterKey[];
        const pricesObj: Record<PriceFilterKey, number> = createInitialObj<PriceFilterKey>(keys);

        allCategoryProducts.forEach((product) => {
            Object.entries(PRICE_FILTER_OPTIONS).forEach(([key, range]) => {
                if (range.min <= product.price && product.price < range.max) {
                    pricesObj[key as PriceFilterKey]++;
                }
            });
        });

        return pricesObj;
    }, [allCategoryProducts]);

    const handleSizePress = (size: Sizes) => {
        setSizeFilters((prev) =>
            sizeFilters.includes(size)
                ? prev.filter((prevSize) => prevSize !== size)
                : [...prev, size]
        );
    };

    const handlePricePress = (key: PriceFilterKey) => {
        setPriceFilters((prev) =>
            priceFilters.includes(key) ? prev.filter((prevKey) => prevKey !== key) : [...prev, key]
        );
    };

    const createSizeLabel = (size: Sizes, count: number) => {
        return (
            <>
                <span>{`${size.toUpperCase()}`}</span>
                <span>{`(${count})`}</span>
            </>
        );
    };

    const createPriceLabel = (key: PriceFilterKey, count: number) => {
        return isFinite(PRICE_FILTER_OPTIONS[key].max) ? (
            <>
                <span>
                    {`£${PRICE_FILTER_OPTIONS[key].min / 100}-£${
                        PRICE_FILTER_OPTIONS[key].max / 100 - 1
                    }`}
                </span>
                <span>{`(${count})`}</span>
            </>
        ) : (
            <>
                <span>{`Over £${PRICE_FILTER_OPTIONS[key].min / 100}`}</span>
                <span>{`(${count})`}</span>
            </>
        );
    };

    type GenerateButtonListParams<T extends string> = {
        dataObj: Record<T, number>;
        filterArr: T[];
        handleClick: (key: T) => void;
        labelCreator: (key: T, count: number) => React.JSX.Element;
        className: string;
    };

    const generateButtonList = <T extends string>(params: GenerateButtonListParams<T>) => {
        const { dataObj, filterArr, handleClick, labelCreator, className } = params;

        return Object.entries(dataObj).length > 0 ? (
            <ul className={`${className} flex flex-wrap py-4 gap-4`}>
                {Object.entries(dataObj).map(([key, count]) =>
                    (count as number) > 0 ? (
                        <li key={key}>
                            <FilterButton
                                objKey={key as T}
                                filterArr={filterArr}
                                onClick={() => handleClick(key as T)}
                            >
                                {labelCreator(key as T, count as number)}
                            </FilterButton>
                        </li>
                    ) : null
                )}
            </ul>
        ) : null;
    };

    return (
        <div className="w-full h-min border-b-1">
            <AccordionSection text="Size">
                {generateButtonList({
                    dataObj: sizesObj,
                    filterArr: sizeFilters,
                    handleClick: handleSizePress,
                    labelCreator: createSizeLabel,
                    className: "size-btn-container",
                })}
            </AccordionSection>
            <AccordionSection text="Price">
                {generateButtonList({
                    dataObj: pricesObj,
                    filterArr: priceFilters,
                    handleClick: handlePricePress,
                    labelCreator: createPriceLabel,
                    className: "price-btn-container",
                })}
            </AccordionSection>
        </div>
    );
}
