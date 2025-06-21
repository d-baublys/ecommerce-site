"use client";

import { Product, Sizes, VALID_SIZES } from "@/lib/definitions";
import { checkStock, isolateInteraction, stringifyConvertPrice } from "@/lib/utils";
import ProductLink from "@/ui/components/ProductLink";
import { useEffect, useRef, useState } from "react";
import RoundedButton from "@/ui/components/buttons/RoundedButton";
import { useBagStore } from "@/stores/bagStore";
import BagConfirmModal from "@/ui/components/overlays/BagConfirmModal";
import WishlistToggleIcon from "@/ui/components/buttons/WishlistToggleIcon";
import ProductImage from "@/ui/components/ProductImage";

export default function ProductTile({ product }: { product: Product }) {
    const { bag, addToBag } = useBagStore((state) => state);

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isQuickAddActive, setIsQuickAddActive] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const tileRef = useRef<HTMLDivElement>(null);

    const availableSizes = VALID_SIZES.filter(
        (size) => size in product.stock && checkStock(product, size, bag)
    );

    const handleTouchStart = () => {
        timerRef.current = setTimeout(() => setIsHovered(true), 300);
    };

    const handleTouchEnd = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleQuickAddClick = (e: React.TouchEvent | React.MouseEvent) => {
        isolateInteraction(e);
        setIsQuickAddActive(true);
    };

    const handleSizeClick = (e: React.TouchEvent | React.MouseEvent, size: Sizes) => {
        isolateInteraction(e);
        const permitted = addToBag({ product, size, quantity: 1 });
        permitted && setIsModalOpen(true);
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
        <>
            <ProductLink slug={product.slug}>
                <div
                    ref={tileRef}
                    className="relative flex flex-col justify-evenly min-h-[200px] h-min gap-4 text-sz-label-button lg:text-sz-label-button-lg z-0"
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
                        <ProductImage product={product} />
                        {isHovered && (
                            <div>
                                <div className="absolute top-0 right-0 m-2">
                                    <WishlistToggleIcon product={product} iconSize={24} />
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-2 md:p-3">
                                    {!isQuickAddActive && availableSizes.length > 0 ? (
                                        <RoundedButton
                                            overrideClasses="w-full"
                                            onClick={handleQuickAddClick}
                                        >
                                            Quick Add
                                        </RoundedButton>
                                    ) : availableSizes.length > 0 ? (
                                        <ul
                                            className="flex flex-wrap justify-center gap-[2%] md:gap-[5%] p-2 bg-background-lightest rounded-full cursor-auto"
                                            onClick={isolateInteraction}
                                        >
                                            {availableSizes.map((size) => (
                                                <li key={size} className="p-1">
                                                    <button
                                                        className="flex justify-center items-center h-8 md:h-10 aspect-square bg-white text-sz-label-button md:text-sz-label-button-lg [border-radius:50%] cursor-pointer"
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
                    <p className="font-semibold">
                        <span>£</span>
                        <span>{stringifyConvertPrice(product.price)}</span>
                    </p>
                </div>
            </ProductLink>
            {isModalOpen && (
                <BagConfirmModal
                    handleClose={() => setIsModalOpen(false)}
                    scrollPredicate={isModalOpen}
                    hasCloseButton={true}
                />
            )}
        </>
    );
}
