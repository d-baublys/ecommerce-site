"use client";

import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import { useEffect, useRef, useState } from "react";
import ProductImage from "@/ui/components/ProductImage";
import { ClientProduct } from "@/lib/types";

export default function ZoomableImage({ productData }: { productData: ClientProduct }) {
    const [isScrollLocked, setIsScrollLocked] = useState<boolean>(false);
    const [isZoomActive, setIsZoomActive] = useState<boolean>(false);
    const parentRef = useRef<HTMLElement | null>(null);
    const touchHoldRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const parent = document.getElementById("product-img-wrapper");

        if (!parent) return;

        parentRef.current = parent;

        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });

        return () =>
            removeEventListener("contextmenu", (e) => {
                e.preventDefault();
            });
    }, []);

    useBodyScrollLock(isScrollLocked);

    const getParentDimensions = () => {
        if (!parentRef.current) return;
        const { width, height, left, top } = parentRef.current.getBoundingClientRect();
        return { parentWidth: width, parentHeight: height, parentX: left, parentY: top };
    };

    function moveZoomedImage(params: { e: React.MouseEvent }): void;
    function moveZoomedImage(params: { touchOffsetX: number; touchOffsetY: number }): void;
    function moveZoomedImage(
        params: { e: React.MouseEvent } | { touchOffsetX: number; touchOffsetY: number }
    ): void {
        const dimensions = getParentDimensions();

        if (!(parentRef.current && dimensions)) return;

        const { parentWidth, parentHeight } = dimensions;

        const posX =
            (
                (("e" in params ? params.e.nativeEvent.offsetX : params.touchOffsetX) /
                    parentWidth) *
                100
            ).toString() + "%";
        const posY =
            (
                (("e" in params ? params.e.nativeEvent.offsetY : params.touchOffsetY) /
                    parentHeight) *
                100
            ).toString() + "%";

        parentRef.current.style.setProperty("--image-x", posX);
        parentRef.current.style.setProperty("--image-y", posY);
    }

    const handleMouseEnter = () => {
        if (!parentRef.current) return;

        parentRef.current.style.setProperty("--image-display", "display");
    };

    const handleMouseLeave = () => {
        if (!parentRef.current) return;

        parentRef.current.style.setProperty("--image-display", "none");
    };

    const handleTouchStart = (e: React.TouchEvent) => {
        if (!parentRef.current) return;

        touchHoldRef.current = setTimeout(() => {
            setIsScrollLocked(true);
            setIsZoomActive(true);
            handleMouseEnter();
        }, 300);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        const dimensions = getParentDimensions();

        if (!(isZoomActive && parentRef.current && dimensions)) return;

        const touch = e.targetTouches[0];

        const { parentX, parentY } = dimensions;

        const [offsetX, offsetY] = [touch.clientX - parentX, touch.clientY - parentY];

        moveZoomedImage({ touchOffsetX: offsetX, touchOffsetY: offsetY });
    };

    const handleTouchEnd = () => {
        if (touchHoldRef.current) {
            clearTimeout(touchHoldRef.current);
            touchHoldRef.current = null;
        }

        setIsScrollLocked(false);
        setIsZoomActive(false);
        handleMouseLeave();
    };

    return (
        <div
            id="product-img-wrapper"
            className="relative w-full md:w-auto md:h-[500px] rounded-md overflow-hidden drop-shadow-(--tile-shadow) z-0"
            style={{ "--zoomed-bg": `url(${productData.src})` } as React.CSSProperties}
            onMouseEnter={handleMouseEnter}
            onMouseMove={(e) => moveZoomedImage({ e })}
            onMouseLeave={handleMouseLeave}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onTouchCancel={handleMouseLeave}
        >
            <ProductImage product={productData} overrideClasses="aspect-[2/3]" />
        </div>
    );
}
