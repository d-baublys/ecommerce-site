"use client";

import { ClientProduct, ReservedItem, Sizes } from "@/lib/types";
import {
    buildProductUrl,
    checkSizeAvailable,
    buildBagItem,
    isolateInteraction,
    processDateForClient,
    stringifyConvertPrice,
} from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { useBagStore } from "@/stores/bagStore";
import AddSuccessModal from "@/ui/components/overlays/AddSuccessModal";
import WishlistToggleIcon from "@/ui/components/buttons/WishlistToggleIcon";
import ProductImage from "@/ui/components/ProductImage";
import Link from "next/link";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import { VALID_SIZES } from "@/lib/constants";

export default function ProductGridTile({
    product,
    groupedReservedItems,
}: {
    product: ClientProduct;
    groupedReservedItems: ReservedItem[];
}) {
    const { bag, addToBag } = useBagStore((state) => state);

    const [isHovered, setIsHovered] = useState<boolean>(false);
    const [isQuickAddActive, setIsQuickAddActive] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const tileRef = useRef<HTMLDivElement>(null);

    const availableSizes = VALID_SIZES.filter(
        (size) =>
            size in product.stock &&
            checkSizeAvailable(
                product,
                size,
                bag,
                groupedReservedItems.filter((item) => item.id === product.id)
            ).success
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
        addToBag(product, buildBagItem(product, size));
        setIsModalOpen(true);
    };

    const handleBlur = (e: React.FocusEvent) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            setIsHovered(false);
            setIsQuickAddActive(false);
        }
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
            <div
                ref={tileRef}
                className="product-tile relative flex flex-col justify-evenly min-h-[200px] h-min gap-4 text-sz-label-button lg:text-sz-label-button-lg z-0"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsQuickAddActive(false);
                }}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onTouchCancel={handleTouchEnd}
                data-date-added={processDateForClient(product.dateAdded)}
                data-testid="product-tile"
            >
                <div
                    tabIndex={0}
                    onFocus={() => setIsHovered(true)}
                    onBlur={handleBlur}
                    className="relative w-full aspect-[4/5] outline-none"
                >
                    <Link tabIndex={-1} href={buildProductUrl(product.id, product.slug)}>
                        <ProductImage product={product} />
                    </Link>
                    {isHovered && (
                        <div>
                            <div className="absolute top-0 right-0 m-2">
                                <WishlistToggleIcon product={product} iconSize={24} />
                            </div>
                            <div className="lower-hover-container absolute bottom-0 left-0 w-full p-2 md:p-3">
                                {availableSizes.length === 0 ? (
                                    <div
                                        className="flex justify-center items-center px-6 py-2 bg-background-lightest border rounded-full"
                                        onClick={isolateInteraction}
                                    >
                                        <p>Out of stock</p>
                                    </div>
                                ) : isQuickAddActive ? (
                                    <ul
                                        className="flex flex-wrap justify-center gap-[2%] md:gap-[5%] p-2 bg-background-lightest rounded-full cursor-auto"
                                        onClick={isolateInteraction}
                                    >
                                        {availableSizes.map((size) => (
                                            <li key={size} className="p-1">
                                                <button
                                                    className="flex justify-center items-center h-8 md:h-10 aspect-square bg-white text-sz-label-button md:text-sz-label-button-lg rounded-circle cursor-pointer"
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
                                    <PlainRoundedButton
                                        onClick={handleQuickAddClick}
                                        aria-haspopup="listbox"
                                        aria-expanded={isQuickAddActive}
                                    >
                                        Quick Add
                                    </PlainRoundedButton>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Link href={buildProductUrl(product.id, product.slug)}>
                    <div className="flex flex-col grow gap-4">
                        <p className="tile-name">{product.name}</p>
                        <p className="tile-price font-semibold">
                            <span>£</span>
                            <span>{stringifyConvertPrice(product.price)}</span>
                        </p>
                    </div>
                </Link>
            </div>
            {isModalOpen && (
                <AddSuccessModal
                    handleClose={() => setIsModalOpen(false)}
                    isOpenState={isModalOpen}
                    overrideClasses="bag-confirm-modal"
                />
            )}
        </>
    );
}
