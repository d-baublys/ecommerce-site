import { Product } from "@/lib/definitions";
import { stringifyConvertPrice } from "@/lib/utils";
import Image from "next/image";
import ProductLink from "./ProductLink";

export default function ProductTile({ product }: { product: Product }) {
    return (
        <ProductLink slug={product.slug}>
            <div className="flex flex-col justify-evenly min-h-[200px] h-min gap-4 text-sm">
                <div className="relative w-full aspect-[4/5]">
                    <Image
                        src={product.src}
                        alt={product.alt}
                        fill
                        sizes="auto"
                        className="object-cover"
                    />
                </div>
                <div>{product.name}</div>
                <div className="font-semibold">£{stringifyConvertPrice(product.price)}</div>
            </div>
        </ProductLink>
    );
}
