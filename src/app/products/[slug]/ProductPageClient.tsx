"use client";

import { useBagStore } from "@/stores/bagStore";
import { useEffect, useState } from "react";
import { Sizes, VALID_SIZES } from "@/lib/definitions";
import { Product } from "@/lib/definitions";
import GoButton from "@/ui/components/buttons/GoButton";
import { IoBag } from "react-icons/io5";
import { checkStock, createBagItem } from "@/lib/utils";
import ZoomableImage from "@/ui/components/ZoomableImage";
import WishlistToggleButton from "@/ui/components/buttons/WishlistToggleButton";

export default function ProductPageClient({ productData }: { productData: Product }) {
    const [selectedSize, setSelectedSize] = useState<Sizes | "placeholder">("placeholder");
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const bag = useBagStore((state) => state.bag);
    const addToBag = useBagStore((state) => state.addToBag);

    function getLocalFormatting(price: number) {
        return Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
            price / 100
        );
    }

    useEffect(() => {
        const selectedAvailable = checkStock(
            productData,
            selectedSize as keyof typeof productData.stock,
            bag
        );

        setIsButtonDisabled(!selectedAvailable);
    }, [selectedSize, bag, productData]);

    return (
        <div className="flex grow justify-center items-start">
            <div
                id="product-container"
                className="flex flex-col md:flex-row grow w-full max-w-[900px]"
            >
                <div className="flex justify-center w-full md:w-1/2">
                    <ZoomableImage productData={productData} />
                </div>
                <div
                    id="product-aside"
                    className="flex flex-col md:w-1/2 gap-8 mt-8 md:mt-0 md:ml-4"
                >
                    <div>
                        <h1 data-testid="product-detail-name">{productData.name}</h1>
                    </div>
                    <div className="font-semibold">
                        <p>{getLocalFormatting(productData.price)}</p>
                    </div>
                    <select
                        aria-label="Size selection"
                        className="p-2 bg-white border-2 rounded-md"
                        value={selectedSize}
                        required
                        onChange={(e) => setSelectedSize(e.target.value as Sizes)}
                    >
                        <option value="placeholder" hidden>
                            Please select a size
                        </option>
                        {VALID_SIZES.filter((size) => size in productData.stock).map(
                            (productSize) => {
                                const thisSizeAvailable = checkStock(
                                    productData,
                                    productSize as keyof typeof productData.stock,
                                    bag
                                );
                                return (
                                    <option
                                        key={productSize}
                                        value={productSize}
                                        className={`${
                                            !thisSizeAvailable ? "text-component-color" : ""
                                        }`}
                                        disabled={!thisSizeAvailable}
                                    >
                                        {productSize.toUpperCase()}
                                        {!thisSizeAvailable && " - out of stock"}
                                    </option>
                                );
                            }
                        )}
                    </select>
                    <GoButton
                        onClick={() => addToBag(createBagItem(productData, selectedSize as Sizes))}
                        predicate={!(selectedSize === undefined || isButtonDisabled)}
                        disabled={selectedSize === undefined || isButtonDisabled}
                    >
                        <span>Add to Bag</span>
                        <IoBag />
                    </GoButton>
                    <WishlistToggleButton product={productData} />
                </div>
            </div>
        </div>
    );
}
