"use client";

import { Product, Sizes, VALID_SIZES } from "@/lib/definitions";
import { getNetStock, stringifyConvertPrice } from "@/lib/utils";
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

    const { bag, addToBag } = useBagStore((state) => state);

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isQuickAddActive, setIsQuickAddActive] = useState<boolean>(false);
    const [isImgLoaded, setIsImgLoaded] = useState<boolean>(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const tileRef = useRef<HTMLDivElement>(null);

    const availableSizes = VALID_SIZES.filter(
        (size) => size in product.stock && getNetStock(product, size, bag) > 0
    );

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
                    <div
                        className={`relative w-full h-full transition duration-500 ${
                            isImgLoaded ? "opacity-100" : "opacity-0"
                        }`}
                    >
                        <Image
                            src={product.src}
                            alt={product.alt}
                            fill
                            sizes="auto"
                            className="object-cover"
                            onLoad={() => setIsImgLoaded(true)}
                        />
                    </div>
                    {!isImgLoaded && (
                        <div className="absolute w-full h-full inset-0 bg-gray-200 overflow-hidden before:content-[''] before:absolute before:inset-0 before:translate-x-[-100%] before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:[animation:skeletonSweep_1s_infinite]"></div>
                    )}
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
                                {!isQuickAddActive && availableSizes.length > 0 ? (
                                    <GeneralButton className="w-full" onClick={handleQuickAddClick}>
                                        Quick Add
                                    </GeneralButton>
                                ) : availableSizes.length > 0 ? (
                                    <ul
                                        className="flex flex-wrap justify-center gap-4 p-2 bg-background-lightest rounded-full cursor-auto"
                                        onClick={isolateInteraction}
                                    >
                                        {availableSizes.map((size) => (
                                            <li key={size}>
                                                <button
                                                    className="flex justify-center items-center h-12 aspect-square bg-white text-sz-base lg:text-sz-base-lg [border-radius:50%] cursor-pointer"
                                                    onClick={(e) =>
                                                        handleSizeClick(e, size as Sizes)
                                                    }
                                                >
                                                    {size.toUpperCase()}
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <div
                                        className="flex justify-center items-center px-6 py-2 bg-background-lightest border-white rounded-full cursor-auto"
                                        onClick={isolateInteraction}
                                    >
                                        <p>Out of stock</p>
                                    </div>
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
