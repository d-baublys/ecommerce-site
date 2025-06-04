import { Product } from "@/lib/definitions";
import { stringifyConvertPrice } from "@/lib/utils";
import Image from "next/image";
import ProductLink from "./ProductLink";

export default function ProductTile({ product }: { product: Product }) {
    return (
        <ProductLink slug={product.slug}>
            <div className="flex flex-col justify-evenly min-h-[200px] h-min gap-4 text-sz-label-button lg:text-sz-label-button-lg">
                <div className="relative w-full aspect-[4/5]">
                    <Image
                        src={product.src}
                        alt={product.alt}
                        fill
                        sizes="auto"
                        className="object-cover"
                    />
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
