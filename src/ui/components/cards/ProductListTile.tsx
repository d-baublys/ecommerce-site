"use client";

import {
    BagItem,
    OrderData,
    OrderItemWithClientProductNoStock,
    Product,
    ProductNoStock,
    Sizes,
} from "@/lib/definitions";
import Link from "next/link";
import { buildProductUrl, convertOrderProducts } from "@/lib/utils";
import ProductImage from "@/ui/components/ProductImage";

interface ProductListTileProps {
    data: Product | Product[] | BagItem | OrderData;
    wrapWithLink: boolean;
    showSize: boolean;
    endContent?: React.ReactNode;
    externalOverrides?: string;
    internalOverrides?: string;
}

export default function ProductListTile(props: ProductListTileProps) {
    const { data, wrapWithLink, showSize, endContent, externalOverrides, internalOverrides } =
        props;

    let dataArr: (Product | BagItem | OrderItemWithClientProductNoStock)[];

    if ("items" in data) {
        dataArr = convertOrderProducts(data);
    } else if (data instanceof Array) {
        dataArr = data;
    } else {
        dataArr = [data];
    }

    const renderCentralContent = (product: Product | ProductNoStock, size?: Sizes) => {
        return (
            <div className={`flex grow h-28 gap-2 sm:gap-8 ${internalOverrides}`}>
                <ProductImage product={product} overrideClasses="aspect-3/4" />
                <div className="flex flex-col justify-between">
                    <div className="text-sz-interm lg:text-sz-interm-lg font-semibold">
                        <p>{product.name.toUpperCase()}</p>
                    </div>
                    {size && showSize && (
                        <div className="text-component-color">
                            <p>Size - {size.toUpperCase()}</p>
                        </div>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className={`flex w-full flex-row bg-white border-2 p-2 ${externalOverrides}`}>
            <div className="flex flex-col w-full gap-2">
                {dataArr.map((itemData) => {
                    const productData = "product" in itemData ? itemData.product : itemData;
                    const hasSize = "size" in itemData;
                    return wrapWithLink ? (
                        <Link
                            key={`${productData.id}-${hasSize ? itemData.size : 1}`}
                            className="w-full"
                            href={buildProductUrl(productData.slug)}
                        >
                            {renderCentralContent(productData, hasSize ? itemData.size : undefined)}
                        </Link>
                    ) : (
                        <div key={`${productData.id}-${hasSize ? itemData.size : 1}`}>
                            {renderCentralContent(productData, hasSize ? itemData.size : undefined)}
                        </div>
                    );
                })}
            </div>
            <div className="flex items-end min-h-full ml-8">{endContent ?? null}</div>
        </div>
    );
}
