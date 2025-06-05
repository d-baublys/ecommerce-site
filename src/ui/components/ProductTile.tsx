"use client";

import { Product, Sizes } from "@/lib/definitions";
import { stringifyConvertPrice } from "@/lib/utils";
import Image from "next/image";
import ProductLink from "./ProductLink";
import { useWishlistStore } from "@/stores/wishlistStore";
import { IoHeart, IoHeartOutline } from "react-icons/io5";
import { useEffect, useRef, useState } from "react";
import GeneralButton from "./GeneralButton";
import { useBagStore } from "@/stores/bagStore";

export default function ProductTile({ product }: { product: Product }) {
    const { wishlist, addToWishlist, removeFromWishlist } = useWishlistStore((state) => state);
    const inWishlist = wishlist.find((item) => item.id === product.id);

    const addToBag = useBagStore((state) => state.addToBag);

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isQuickAddActive, setIsQuickAddActive] = useState<boolean>(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const tileRef = useRef<HTMLDivElement>(null);

    const isolateInteraction = (e: React.TouchEvent | React.MouseEvent) => {
        e.preventDefault();
    };

    const handleTouchStart = () => {
        timerRef.current = setTimeout(() => setIsHovered(true), 300);
    };

    const handleTouchEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleWishlistClick = (e: React.TouchEvent | React.MouseEvent) => {
        isolateInteraction(e);

        if (!inWishlist) {
            addToWishlist(product);
        } else {
            removeFromWishlist(product.id);
        }
    };

    const handleQuickAddClick = (e: React.TouchEvent | React.MouseEvent) => {
        isolateInteraction(e);
        setIsQuickAddActive(true);
    };

    const handleSizeClick = (e: React.TouchEvent | React.MouseEvent, size: Sizes) => {
        isolateInteraction(e);
        addToBag({ product, size, quantity: 1 });
    };

    useEffect(() => {
        const handleOffTouch = (e: TouchEvent) => {
            if (tileRef.current && !tileRef.current.contains(e?.target as Node)) {
                setIsHovered(false);
                setIsQuickAddActive(false);
            }
        };

        document.addEventListener("touchstart", handleOffTouch);

        return () => document.removeEventListener("touchstart", handleOffTouch);
    }, []);

    return (
        <ProductLink slug={product.slug}>
            <div
                ref={tileRef}
                className="relative flex flex-col justify-evenly min-h-[200px] h-min gap-4 text-sz-label-button lg:text-sz-label-button-lg"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsQuickAddActive(false);
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
            >
                <div className="relative w-full aspect-[4/5]">
                    <Image
                        src={product.src}
                        alt={product.alt}
                        fill
                        sizes="auto"
                        className="object-cover"
                    />
                    {isHovered && (
                        <div>
                            <div
                                className="absolute top-0 right-0 p-1 m-2 bg-white [border-radius:50%]"
                                onClick={handleWishlistClick}
                            >
                                <div className="relative translate-y-[1px]">
                                    {inWishlist ? (
                                        <IoHeart size={24} />
                                    ) : (
                                        <IoHeartOutline size={24} />
                                    )}
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-0 w-full p-4">
                                {!isQuickAddActive ? (
                                    <GeneralButton className="w-full" onClick={handleQuickAddClick}>
                                        Quick Add
                                    </GeneralButton>
                                ) : (
                                    <ul className="flex flex-wrap justify-center gap-4 p-2 bg-background-lighter rounded-full">
                                        {Object.entries(product.stock).map(
                                            ([size, count]) =>
                                                count > 0 && (
                                                    <li key={size}>
                                                        <button
                                                            className="flex justify-center items-center w-10 aspect-square bg-white text-sz-base lg:text-sz-base-lg [border-radius:50%] cursor-pointer"
                                                            onClick={(e) =>
                                                                handleSizeClick(e, size as Sizes)
                                                            }
                                                        >
                                                            {size.toUpperCase()}
                                                        </button>
                                                    </li>
                                                )
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                    )}
                </div>
                <p>{product.name}</p>
                <div className="font-semibold">
                    <span>£</span>
                    <span>{stringifyConvertPrice(product.price)}</span>
                </div>
            </div>
        </ProductLink>
    );
}
