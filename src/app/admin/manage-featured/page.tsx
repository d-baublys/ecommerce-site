"use client";

import { clearFeaturedProducts, createFeaturedProducts, getFeaturedProducts } from "@/lib/actions";
import { Product } from "@/lib/definitions";
import { areProductListsEqual } from "@/lib/utils";
import GeneralButton from "@/ui/components/GeneralButton";
import BagTile from "@/ui/components/BagTile";
import SearchBar from "@/ui/components/SearchBar";
import { useEffect, useState } from "react";

export default function ManageFeaturedPage() {
    const [savedFeaturedList, setSavedFeaturedList] = useState<Product[]>([]);
    const [provisionalFeaturedList, setProvisionalFeaturedList] = useState<Product[]>([]);

    useEffect(() => {
        const getList = async () => {
            const list = await getFeaturedProducts();
            if (list) {
                setSavedFeaturedList(list);
                setProvisionalFeaturedList(list);
            }
        };
        getList();
    }, []);

    const handleResultClick = (product: Product) => {
        const isNew = !provisionalFeaturedList?.find(
            (existingProd) => existingProd.id === product.id
        );

        if (isNew) setProvisionalFeaturedList((prev) => (prev ? [...prev, product] : [product]));
    };

    const handleSave = async () => {
        if (provisionalFeaturedList?.length <= 5) {
            await clearFeaturedProducts();
            await createFeaturedProducts(provisionalFeaturedList);
            setSavedFeaturedList(provisionalFeaturedList);
        }
    };

    const handleCancel = () => {
        setProvisionalFeaturedList(savedFeaturedList);
    };

    const isListChanged = !areProductListsEqual(savedFeaturedList, provisionalFeaturedList);

    return (
        <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-8">
            <span className="font-semibold text-xl">Featured Products</span>
            <div className="w-3/4 h-10">
                <SearchBar handleResultClick={handleResultClick} />
            </div>
            {provisionalFeaturedList?.length ? (
                <>
                    {provisionalFeaturedList.map((featuredProd) => (
                        <BagTile
                            key={featuredProd.id}
                            dataObj={featuredProd}
                            handleDelete={() =>
                                setProvisionalFeaturedList((prev) =>
                                    prev?.filter((currProd) => currProd.id !== featuredProd.id)
                                )
                            }
                        />
                    ))}
                </>
            ) : (
                "No featured items selected"
            )}
            <div className="flex gap-8 h-8">
                {isListChanged && <GeneralButton onClick={handleSave}>Save</GeneralButton>}
                {isListChanged && <GeneralButton onClick={handleCancel}>Cancel</GeneralButton>}
            </div>
        </div>
    );
}
