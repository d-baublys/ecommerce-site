"use client";

import { Categories, Product, Sizes } from "@/lib/definitions";
import ProductTile from "./ProductTile";
import GridAside from "./GridAside";
import { useEffect, useState } from "react";
import { fetchFilteredProducts } from "@/lib/utils";

export default function ProductGrid({ category }: { category: Categories }) {
    const [allCategoryProducts, setAllCategoryProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [sizeFilters, setSizeFilters] = useState<Sizes[]>([]);
    const [priceFilters, setPriceFilters] = useState<string[]>([]);

    useEffect(() => {
        const fetchInitial = async () => {
            const products = await fetchFilteredProducts({ category });

            setAllCategoryProducts(products);
        };
        fetchInitial();
    }, []);

    useEffect(() => {
        const fetchFiltered = async () => {
            const products = await fetchFilteredProducts({ category, sizeFilters, priceFilters });

            setFilteredProducts(products);
        };

        fetchFiltered();
    }, [category, sizeFilters, priceFilters]);

    return (
        <div className="flex p-8 w-screen grow">
            <div id="filter-aside" className="[flex:1_0_200px] bg-blue-500">
                <GridAside
                    allCategoryProducts={allCategoryProducts}
                    sizeFilters={sizeFilters}
                    setSizeFilters={setSizeFilters}
                    priceFilters={priceFilters}
                    setPriceFilters={setPriceFilters}
                />
            </div>
            {filteredProducts.length > 0 ? (
                <div className="grid [grid-template-columns:repeat(auto-fit,minmax(200px,500px))] w-full p-4 gap-4">
                    {filteredProducts.map((product) => (
                        <ProductTile key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="flex justify-center items-center w-full p-4 gap-4">
                    No products matching your filter
                </div>
            )}
        </div>
    );
}
