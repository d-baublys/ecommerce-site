"use client";

import { Product } from "@/lib/definitions";
import { getSkeletonSweep } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

export default function ProductImage({
    product,
    overrideClasses,
}: {
    product: Product | { src: string; alt: string };
    overrideClasses?: string;
}) {
    const [isImgLoaded, setIsImgLoaded] = useState<boolean>(false);

    return (
        <div className={`relative h-full ${overrideClasses ?? ""}`}>
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
                <div
                    className={`absolute inset-0 bg-gray-200 overflow-hidden z-10 ${getSkeletonSweep(
                        isImgLoaded
                    )}`}
                ></div>
            )}
        </div>
    );
}
