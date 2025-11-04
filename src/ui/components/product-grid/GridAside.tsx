"use client";

import { ClientProduct, PriceFilterId, Sizes, StateSetter } from "@/lib/types";
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
    allCategoryProducts: ClientProduct[];
    sizeFilters: Sizes[];
    setSizeFilters: StateSetter<Sizes[]>;
    priceFilters: PriceFilterId[];
    setPriceFilters: StateSetter<PriceFilterId[]>;
}) {
    const buildBaseRecord = <T extends string>(keys: T[]) => {
        const record: Record<T, number> = Object.fromEntries(keys.map((key) => [key, 0])) as Record<
            T,
            number
        >;

        return record;
    };

    const sizesData = useMemo(() => {
        const sizesMap = VALID_SIZES.map((size) => size);
        const sizesData: Record<Sizes, number> = buildBaseRecord<Sizes>(sizesMap);

        allCategoryProducts.forEach((product) => {
            Object.keys(product.stock).forEach(
                (size) => product.stock[size as Sizes] && sizesData[size as Sizes]++
            );
        });

        return sizesData;
    }, [allCategoryProducts]);

    const pricesData = useMemo(() => {
        const filterIds = Object.keys(PRICE_FILTER_OPTIONS) as PriceFilterId[];
        const pricesData: Record<PriceFilterId, number> = buildBaseRecord<PriceFilterId>(filterIds);

        allCategoryProducts.forEach((product) => {
            Object.entries(PRICE_FILTER_OPTIONS).forEach(([filterId, range]) => {
                if (range.min <= product.price && product.price < range.max) {
                    pricesData[filterId as PriceFilterId]++;
                }
            });
        });

        return pricesData;
    }, [allCategoryProducts]);

    const handleSizePress = (size: Sizes) => {
        setSizeFilters((prev) =>
            sizeFilters.includes(size)
                ? prev.filter((prevSize) => prevSize !== size)
                : [...prev, size]
        );
    };

    const handlePricePress = (filterId: PriceFilterId) => {
        setPriceFilters((prev) =>
            priceFilters.includes(filterId)
                ? prev.filter((prevId) => prevId !== filterId)
                : [...prev, filterId]
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

    const createPriceLabel = (filterId: PriceFilterId, count: number) => {
        return isFinite(PRICE_FILTER_OPTIONS[filterId].max) ? (
            <>
                <span>
                    {`£${PRICE_FILTER_OPTIONS[filterId].min / 100}-£${
                        PRICE_FILTER_OPTIONS[filterId].max / 100 - 1
                    }`}
                </span>
                <span>{`(${count})`}</span>
            </>
        ) : (
            <>
                <span>{`Over £${PRICE_FILTER_OPTIONS[filterId].min / 100}`}</span>
                <span>{`(${count})`}</span>
            </>
        );
    };

    type GenerateButtonListParams<T extends string> = {
        data: Record<T, number>;
        filters: T[];
        handleClick: (key: T) => void;
        labelCreator: (key: T, count: number) => React.JSX.Element;
        className: string;
    };

    const generateButtonList = <T extends string>(params: GenerateButtonListParams<T>) => {
        const { data, filters, handleClick, labelCreator, className } = params;

        return Object.entries(data).length > 0 ? (
            <ul className={`${className} flex flex-wrap py-4 gap-4`}>
                {Object.entries(data).map(([key, count]) =>
                    (count as number) > 0 ? (
                        <li key={key}>
                            <FilterButton
                                filterKey={key as T}
                                filters={filters}
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
                    data: sizesData,
                    filters: sizeFilters,
                    handleClick: handleSizePress,
                    labelCreator: createSizeLabel,
                    className: "size-btn-container",
                })}
            </AccordionSection>
            <AccordionSection text="Price">
                {generateButtonList({
                    data: pricesData,
                    filters: priceFilters,
                    handleClick: handlePricePress,
                    labelCreator: createPriceLabel,
                    className: "price-btn-container",
                })}
            </AccordionSection>
        </div>
    );
}
