"use client";

import { useBagStore } from "@/stores/bagStore";
import { useState } from "react";
import { Sizes } from "../../../generated/prisma";
import Image from "next/image";
import { Product } from "@/lib/definitions";
import GoButton from "./GoButton";
import { IoBag, IoHeartOutline } from "react-icons/io5";
import GeneralButton from "./GeneralButton";

export default function ProductContainer({ productData }: { productData: Product }) {
    const [size, setSize] = useState<Sizes>();
    const bag = useBagStore((state) => state.bag);
    const addToBag = useBagStore((state) => state.addToBag);

    function getLocalFormatting(price: number) {
        return Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
            price / 100
        );
    }
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
                    {Object.keys(productData.stock).map((productSize, idx) => {
                        const backendStock =
                            productData.stock[productSize as keyof typeof productData.stock];

                        const existing = bag.find(
                            (bagItem) =>
                                bagItem.product.id === productData.id &&
                                bagItem.size === productSize
                        );

                        const bagQuantity = existing?.quantity ?? 0;

                        const netStock = backendStock! - bagQuantity;

                        return (
                            <option
                                key={idx}
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
                        addToBag({ product: productData, size: size as Sizes, quantity: 1 })
                    }
                >
                    Add to Bag <IoBag />
                </GoButton>
                <GeneralButton>
                    Add to Wishlist <IoHeartOutline className="stroked-path" />
                </GeneralButton>
            </div>
        </section>
    );
}
