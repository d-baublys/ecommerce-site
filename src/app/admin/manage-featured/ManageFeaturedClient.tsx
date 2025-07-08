"use client";

import { clearFeaturedProducts, createFeaturedProducts } from "@/lib/actions";
import { FEATURED_COUNT, Product } from "@/lib/definitions";
import { areProductListsEqual } from "@/lib/utils";
import SearchBar from "@/ui/components/SearchBar";
import { useEffect, useState } from "react";
import DisplayTile from "@/ui/components/cards/DisplayTile";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";

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
        <div className="flex flex-col justify-start items-center w-full h-full">
            <div className="w-full h-10">
                <SearchBar
                    handleResultClick={handleResultClick}
                    options={{ isGlobalSearch: false, showSuggestions: true }}
                />
            </div>
            {provisionalFeaturedList.length > 0 ? (
                <ul className="flex flex-col w-full">
                    {provisionalFeaturedList.map((featuredProd) => (
                        <li key={featuredProd.id} className="mt-8">
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
                <div className="flex items-center mt-8 h-full">
                    <p>{"Featured item list is empty"}</p>
                </div>
            )}
            {isListChanged ? (
                <>
                    <div className="flex grow items-end">
                        <div className="flex gap-8 mt-8  h-min">
                            <PlainRoundedButton onClick={handleSave}>Save</PlainRoundedButton>
                            <PlainRoundedButton onClick={handleCancel}>Cancel</PlainRoundedButton>
                        </div>
                    </div>
                </>
            ) : null}
        </div>
    );
}
