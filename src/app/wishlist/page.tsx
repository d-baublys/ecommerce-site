"use client";

import ProductTile from "@/components/ProductTile";
import { productList } from "@/lib/data";
import { BagItem, Product } from "@/lib/types";
import { useState } from "react";

export default function Page() {
    const [wishlist, setWishlist] = useState([productList[2], productList[1]]); // temporary for prototype

    const emptyWishlist = wishlist.length === 0;

    const handleDelete = (deletedProduct: Product | BagItem) => {
        setWishlist(wishlist.filter((product) => product !== deletedProduct));
    };

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-contrasted font-semibold md:text-xl">
                My Wishlist
            </div>
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {wishlist.map((product, idx) => {
                    return <ProductTile key={idx} dataObj={product} handleDelete={handleDelete} />;
                })}
                {emptyWishlist && "Your wishlist is empty!"}
            </div>
        </div>
    );
}
