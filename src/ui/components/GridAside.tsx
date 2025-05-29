"use client";

import { Categories, Product, VALID_SIZES } from "@/lib/definitions";
import AccordionSection from "./AccordionSection";
import GeneralButton from "./GeneralButton";
import { Sizes } from "@/lib/definitions";
import { useMemo, useState } from "react";

export default function GridAside({
    products,
    category,
}: {
    products: Product[];
    category: Categories;
}) {
    const [sizeFilters, setSizeFilters] = useState<Sizes[]>([]);

    const priceFilters = [
        { min: 0, max: 50 },
        { min: 50, max: 100 },
        { min: 100, max: 150 },
        { min: 150, max: 200 },
    ];

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

        products.forEach((product) => {
            Object.entries(product.stock).forEach(
                ([size, count]) => (sizesObj[size as Sizes] += count)
            );
        });

        return sizesObj;
    }, [products]);

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

    return (
        <div>
            <AccordionSection text="Size">{populateSizes()}</AccordionSection>
            <AccordionSection text="Price">{"Something else"}</AccordionSection>
        </div>
    );
}
