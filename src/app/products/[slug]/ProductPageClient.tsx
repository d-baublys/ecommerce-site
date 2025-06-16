"use client";

import { useBagStore } from "@/stores/bagStore";
import { useEffect, useState } from "react";
import { Sizes, VALID_SIZES } from "@/lib/definitions";
import Image from "next/image";
import { Product } from "@/lib/definitions";
import GoButton from "@/ui/components/GoButton";
import { IoBag, IoHeart, IoHeartOutline } from "react-icons/io5";
import { checkStock } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlistStore";
import RoundedButton from "@/ui/components/RoundedButton";
import ZoomableImage from "@/ui/components/ZoomableImage";

export default function ProductPageClient({ productData }: { productData: Product }) {
    const [size, setSize] = useState<Sizes | "placeholder">("placeholder");
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const bag = useBagStore((state) => state.bag);
    const addToBag = useBagStore((state) => state.addToBag);
    const wishlist = useWishlistStore((state) => state.wishlist);
    const addToWishlist = useWishlistStore((state) => state.addToWishlist);
    const removeFromWishlist = useWishlistStore((state) => state.removeFromWishlist);
    const inWishlist = wishlist.find((wishlistItem) => wishlistItem.id === productData.id);

    function getLocalFormatting(price: number) {
        return Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
            price / 100
        );
    }

    useEffect(() => {
        const selectedAvailable = checkStock(
            productData,
            size as keyof typeof productData.stock,
            bag
        );

        setIsButtonDisabled(!selectedAvailable);
    }, [size, bag, productData]);

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
                        <p>{productData.name}</p>
                    </div>
                    <div className="font-semibold">
                        <p>{getLocalFormatting(productData.price)}</p>
                    </div>
                    <select
                        className="p-2 bg-white border-2 rounded-md"
                        value={size}
                        required
                        onChange={(e) => setSize(e.target.value as Sizes)}
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
                                            !thisSizeAvailable && "text-component-color"
                                        }`}
                                        disabled={!thisSizeAvailable}
                                    >
                                        {productSize.toUpperCase()}{" "}
                                        {!thisSizeAvailable && " - out of stock"}
                                    </option>
                                );
                            }
                        )}
                    </select>
                    <GoButton
                        onClick={() =>
                            addToBag({ product: productData, size: size as Sizes, quantity: 1 })
                        }
                        predicate={!(size === undefined || isButtonDisabled)}
                        disabled={size === undefined || isButtonDisabled}
                    >
                        Add to Bag <IoBag />
                    </GoButton>
                    <RoundedButton
                        onClick={() =>
                            !inWishlist
                                ? addToWishlist(productData)
                                : removeFromWishlist(productData.id)
                        }
                    >
                        <span>{!inWishlist ? "Add to Wishlist" : "Remove from Wishlist"}</span>
                        {inWishlist ? <IoHeart /> : <IoHeartOutline className="stroked-path" />}
                    </RoundedButton>
                </div>
            </div>
        </div>
    );
}
