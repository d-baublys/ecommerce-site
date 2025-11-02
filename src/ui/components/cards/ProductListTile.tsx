"use client";

import { BagItem, Product, ClientProduct, Sizes, ClientOrder } from "@/lib/types";
import Link from "next/link";
import { buildProductUrl } from "@/lib/utils";
import ProductImage from "@/ui/components/ProductImage";

interface ProductListTileProps {
    inputData:
        | ClientProduct
        | ClientProduct[]
        | (BagItem & { product: ClientProduct })
        | ClientOrder;
    wrapWithLink: boolean;
    showSize: boolean;
    endContent?: React.ReactNode | ((idx: number) => React.ReactNode);
    externalOverrides?: string;
    internalOverrides?: string;
}

export default function ProductListTile(props: ProductListTileProps) {
    const { inputData, wrapWithLink, showSize, endContent, externalOverrides, internalOverrides } =
        props;

    let tileData: (
        | ClientProduct
        | (BagItem & { product: ClientProduct })
        | ClientOrder["items"][number]
    )[];

    if ("items" in inputData) {
        tileData = inputData.items;
    } else if (inputData instanceof Array) {
        tileData = inputData;
    } else {
        tileData = [inputData];
    }

    const renderCentralContent = (product: Product | ClientProduct, size?: Sizes) => {
        return (
            <div className={`flex grow gap-2 sm:gap-8 ${internalOverrides ?? ""}`}>
                <ProductImage
                    product={product}
                    overrideClasses="flex aspect-3/4 min-h-28 !h-auto"
                />
                <div className="flex flex-col justify-between">
                    <div className="sm:text-sz-interm lg:text-sz-interm-lg font-semibold">
                        <p>{product.name.toUpperCase()}</p>
                    </div>
                    {size && showSize && (
                        <div className="text-component-color mt-2">
                            <p>Size - {size.toUpperCase()}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`flex w-full flex-row bg-white border-2 p-2 ${externalOverrides ?? ""}`}>
            <div className="flex flex-col w-full gap-8">
                {tileData.map((item, idx) => {
                    const productData = "product" in item ? item.product : item;
                    const hasSize = "size" in item;
                    return (
                        <div
                            key={`${productData.id}-${hasSize ? item.size : 1}`}
                            className="flex flex-row"
                        >
                            {wrapWithLink ? (
                                <Link
                                    className="w-full"
                                    href={buildProductUrl(productData.id, productData.slug)}
                                >
                                    {renderCentralContent(
                                        productData,
                                        hasSize ? item.size : undefined
                                    )}
                                </Link>
                            ) : (
                                renderCentralContent(productData, hasSize ? item.size : undefined)
                            )}
                            <div className="flex items-end max-w-[33%] min-h-full ml-4 md:ml-8">
                                {typeof endContent === "function"
                                    ? endContent(idx)
                                    : endContent !== null
                                    ? endContent
                                    : null}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
