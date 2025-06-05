"use client";

import { useBagStore } from "@/stores/bagStore";
import { useEffect, useState } from "react";
import { Sizes, VALID_SIZES } from "@/lib/definitions";
import Image from "next/image";
import { Product } from "@/lib/definitions";
import GoButton from "@/ui/components/GoButton";
import { IoBag, IoHeart, IoHeartOutline } from "react-icons/io5";
import GeneralButton from "@/ui/components/GeneralButton";
import { getNetStock } from "@/lib/utils";
import { useWishlistStore } from "@/stores/wishlistStore";

export default function ProductPageClient({ productData }: { productData: Product }) {
    const [size, setSize] = useState<Sizes>();
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
        const selectedNetStock = getNetStock(
            productData,
            size as keyof typeof productData.stock,
            bag
        );

        setIsButtonDisabled(!selectedNetStock);
    }, [size, bag]);

    return (
        <section
            id="product-container"
            className="flex flex-col md:flex-row grow w-full max-w-[960px]"
        >
            <div className="flex justify-center w-full md:w-1/2 md:m-8">
                <div
                    id="product-img-wrapper"
                    className="relative aspect-[2/3] w-full md:w-auto md:h-[500px] snap-center drop-shadow-(--tile-shadow) z-0"
                >
                    <Image
                        src={productData.src}
                        alt={productData.alt}
                        fill
                        sizes="auto"
                        className="object-cover rounded-md"
                    />
                </div>
            </div>
            <div id="product-aside" className="flex flex-col md:w-1/2 min-h-full m-8 gap-8 ">
                <div>{productData.name}</div>
                <div className="font-semibold">{getLocalFormatting(productData.price)}</div>
                <select
                    className="p-2 bg-white border-2 rounded-md"
                    value={size}
                    defaultValue={"default"}
                    required
                    onChange={(e) => setSize(e.target.value as Sizes)}
                >
                    <option value="default" hidden>
                        Please select a size
                    </option>
                    {VALID_SIZES.filter((size) => size in productData.stock).map((productSize) => {
                        const netStock = getNetStock(
                            productData,
                            productSize as keyof typeof productData.stock,
                            bag
                        );

                        return (
                            <option
                                key={productSize}
                                value={productSize}
                                className={`${!netStock && "text-component-color"}`}
                                disabled={!netStock}
                            >
                                {productSize.toUpperCase()} {!netStock && " - out of stock"}
                            </option>
                        );
                    })}
                </select>
                <GoButton
                    onClick={() =>
                        !isButtonDisabled &&
                        addToBag({ product: productData, size: size as Sizes, quantity: 1 })
                    }
                    predicate={!(size === undefined || isButtonDisabled)}
                    disabled={size === undefined || isButtonDisabled}
                >
                    Add to Bag <IoBag />
                </GoButton>
                <GeneralButton
                    onClick={() =>
                        !inWishlist
                            ? addToWishlist(productData)
                            : removeFromWishlist(productData.id)
                    }
                >
                    <span>{!inWishlist ? "Add to Wishlist" : "Remove from Wishlist"}</span>
                    {inWishlist ? <IoHeart /> : <IoHeartOutline className="stroked-path" />}
                </GeneralButton>
            </div>
        </section>
    );
}
