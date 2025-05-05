"use client";

import { productList } from "@/lib/data";
import { ProductType } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function Page() {
    const [wishlist, setWishlist] = useState([productList[2], productList[3]]); // temporary for prototype

    const handleDelete = (deletedProduct: ProductType) => {
        setWishlist(wishlist.filter((product) => product !== deletedProduct));
    };

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-contrasted font-semibold md:text-xl">
                My Wishlist
            </div>
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full gap-4">
                {wishlist.map((product) => {
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
            </div>
        </div>
    );
}
