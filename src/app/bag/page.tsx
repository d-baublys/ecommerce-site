"use client";

import GoButton from "@/components/GoButton";
import ProductTile from "@/components/ProductTile";
import { productList } from "@/lib/data";
import { BagItem, Product } from "@/lib/types";
import { useState } from "react";

export default function Page() {
    const placeholder: BagItem[] = [
        { product: productList[2], size: "l", quantity: 1 },
        { product: productList[3], size: "xl", quantity: 1 },
    ];

    const [bag, setBag] = useState<BagItem[]>(placeholder); // temporary for prototype

    const emptyBag = bag.length === 0;

    const handleDelete = (deletedProduct: Product | BagItem) => {
        setBag(bag.filter((product) => product !== deletedProduct));
    };

    return (
        <div className="flex flex-col justify-center items-center grow w-full">
            <div className="flex justify-center items-center w-full p-2 bg-background-lighter text-contrasted font-semibold md:text-xl">
                My Bag
            </div>
            <div className="flex flex-col grow justify-center items-center w-full max-w-[960px] h-full my-4 gap-4">
                {bag.map((bagItem) => (
                    <ProductTile
                        key={bagItem.product!.id}
                        dataObj={bagItem}
                        handleDelete={handleDelete}
                    />
                ))}
                {!emptyBag ? <GoButton>Proceed to Checkout</GoButton> : "Your bag is empty!"}
            </div>
        </div>
    );
}
