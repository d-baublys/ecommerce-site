"use client";

import GoButton from "@/components/GoButton";
import { productList } from "@/lib/data";
import { BagItem, ProductType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Page() {
    const placeholder: BagItem[] = [
        { product: productList[0], size: "l", quantity: 1 },
        { product: productList[4], size: "xl", quantity: 1 },
    ];

    const [bag, setBag] = useState<BagItem[]>(placeholder); // temporary for prototype

    const emptyBag = bag.length === 0;

    const handleDelete = (deletedProduct: ProductType) => {
        setBag(bag.filter((product) => product !== deletedProduct));
    };

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-contrasted font-semibold md:text-xl">
                My Bag
            </div>
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {bag.map((product) => {
                    return (
                        <div
                            key={product.id}
                            className="flex h-24 w-full sm:w-1/2 min-w-[300px] sm:min-w-[500px] border-2 p-2"
                        >
                            <Link className="w-full" href={`products/${product.slug}`}>
                                <div className="flex h-full gap-2 sm:gap-8">
                                    <div className="wishlist-img-wrapper relative h-full aspect-square">
                                        <Image
                                            className="object-cover"
                                            src={product.src}
                                            alt={product.alt}
                                            sizes="auto"
                                            fill
                                        ></Image>
                                    </div>
                                    <div className="font-semibold">
                                        {product.name.toUpperCase()}
                                    </div>
                                </div>
                            </Link>
                            <div
                                onClick={() => handleDelete(product)}
                                className="flex justify-center items-center aspect-1/2 h-full text-2xl cursor-pointer"
                            >
                                <IoClose />
                            </div>
                        </div>
                    );
                })}
                {!emptyBag ? <GoButton>Proceed to Checkout</GoButton> : "Your bag is empty!"}
            </div>
        </div>
    );
}
