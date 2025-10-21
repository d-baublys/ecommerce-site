"use client";

import { ClientProduct } from "@/lib/types";
import { getSkeletonSweep } from "@/lib/ui-class-repo";
import Image from "next/image";
import { useState } from "react";

export default function ProductImage({
    product,
    overrideClasses,
}: {
    product: ClientProduct | { src: string; alt: string };
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
                    data-testid="image-skeleton"
                    className={`absolute inset-0 bg-gray-200 overflow-hidden z-10 ${getSkeletonSweep()}`}
                ></div>
            )}
        </div>
    );
}
