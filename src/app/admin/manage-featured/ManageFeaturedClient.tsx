"use client";

import { clearFeaturedProducts, createFeaturedProducts } from "@/lib/actions";
import { FEATURED_COUNT, Product } from "@/lib/definitions";
import { areProductListsEqual } from "@/lib/utils";
import RoundedButton from "@/ui/components/RoundedButton";
import SearchBar from "@/ui/components/SearchBar";
import { useEffect, useState } from "react";
import DisplayTile from "@/ui/components/DisplayTile";

export default function ManageFeaturedClient({ productData }: { productData: Product[] }) {
    const [savedFeaturedList, setSavedFeaturedList] = useState<Product[]>(productData);
    const [provisionalFeaturedList, setProvisionalFeaturedList] = useState<Product[]>(productData);

    const handleResultClick = (product: Product) => {
        const isNew = !provisionalFeaturedList.find(
            (existingProd) => existingProd.id === product.id
        );

        if (isNew && provisionalFeaturedList.length < FEATURED_COUNT) {
            setProvisionalFeaturedList((prev) => (prev ? [...prev, product] : [product]));
        }
    };

    const handleSave = async () => {
        await clearFeaturedProducts();
        await createFeaturedProducts(provisionalFeaturedList);
        setSavedFeaturedList(provisionalFeaturedList);
    };

    const handleCancel = () => {
        setProvisionalFeaturedList(savedFeaturedList);
    };

    const isListChanged = !areProductListsEqual(savedFeaturedList, provisionalFeaturedList);

    const handleUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
    };

    useEffect(() => {
        if (isListChanged) {
            window.addEventListener("beforeunload", handleUnload);
        } else {
            window.removeEventListener("beforeunload", handleUnload);
        }

        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [isListChanged]);

    return (
        <div className="flex flex-col grow justify-center items-center w-full h-full">
            <div className="w-3/4 h-10">
                <SearchBar handleResultClick={handleResultClick} />
            </div>
            {provisionalFeaturedList.length > 0 ? (
                <ul className="flex flex-col w-full">
                    {provisionalFeaturedList.map((featuredProd) => (
                        <li key={featuredProd.id} className="pt-8">
                            <DisplayTile
                                productData={featuredProd}
                                handleDelete={() =>
                                    setProvisionalFeaturedList((prev) =>
                                        prev?.filter((currProd) => currProd.id !== featuredProd.id)
                                    )
                                }
                            />
                        </li>
                    ))}
                </ul>
            ) : (
                <p>{"Featured item list is empty"}</p>
            )}
            <div className="flex gap-8">
                {isListChanged && <RoundedButton onClick={handleSave}>Save</RoundedButton>}
                {isListChanged && <RoundedButton onClick={handleCancel}>Cancel</RoundedButton>}
            </div>
        </div>
    );
}
