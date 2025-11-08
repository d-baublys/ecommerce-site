"use client";

import { useBagStore } from "@/stores/bagStore";
import { useEffect, useState } from "react";
import { ClientProduct, ReservedItem, Sizes } from "@/lib/types";
import GoButton from "@/ui/components/buttons/GoButton";
import { IoBag } from "react-icons/io5";
import { checkSizeAvailable, buildBagItem, getUniformReservedItems } from "@/lib/utils";
import ZoomableImage from "@/ui/components/ZoomableImage";
import WishlistToggleButton from "@/ui/components/buttons/WishlistToggleButton";
import AddSuccessModal from "@/ui/components/overlays/AddSuccessModal";
import { VALID_SIZES } from "@/lib/constants";

export default function ProductPageClient({
    productData,
    reservedItems,
}: {
    productData: ClientProduct;
    reservedItems: ReservedItem[];
}) {
    const [selectedSize, setSelectedSize] = useState<Sizes | "placeholder">("placeholder");
    const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const bag = useBagStore((state) => state.bag);
    const addToBag = useBagStore((state) => state.addToBag);
    const addPermitted = !(selectedSize === "placeholder" || isButtonDisabled);

    const getLocalFormatting = (price: number) => {
        return Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
            price / 100
        );
    };

    useEffect(() => {
        if (selectedSize === "placeholder") return;

        try {
            const selectedSizeCheck = checkSizeAvailable(
                productData,
                selectedSize as Sizes,
                bag,
                getUniformReservedItems({
                    items: reservedItems,
                    productId: productData.id,
                    size: selectedSize,
                })
            );

            setIsButtonDisabled(!selectedSizeCheck.success);
        } catch (error) {
            const e = error as Error;
            throw new Error(e.message);
        }
    }, [selectedSize, bag, productData]);

    const handleAdd = () => {
        addToBag(productData, buildBagItem(productData, selectedSize as Sizes));
        setIsModalOpen(true);
    };

    return (
        <>
            <div className="flex grow justify-center items-start">
                <div
                    id="product-container"
                    className="flex flex-col md:flex-row grow w-full max-w-[1000px]"
                >
                    <div className="flex justify-center w-full md:w-1/2">
                        <ZoomableImage productData={productData} />
                    </div>
                    <div
                        id="product-aside"
                        className="flex flex-col md:w-1/2 gap-8 mt-8 md:mt-0 md:ml-4"
                    >
                        <div>
                            <h1 data-testid="product-detail-name">{productData.name}</h1>
                        </div>
                        <div className="font-semibold">
                            <p>{getLocalFormatting(productData.price)}</p>
                        </div>
                        <select
                            aria-label="Size selection"
                            className="p-2 bg-white border-2 rounded-md"
                            value={selectedSize}
                            required
                            onChange={(e) => setSelectedSize(e.target.value as Sizes)}
                        >
                            <option value="placeholder" hidden>
                                Please select a size
                            </option>
                            {VALID_SIZES.filter((size) => size in productData.stock).map(
                                (productSize) => {
                                    const thisSizeCheck = checkSizeAvailable(
                                        productData,
                                        productSize as Sizes,
                                        bag,
                                        getUniformReservedItems({
                                            items: reservedItems,
                                            productId: productData.id,
                                            size: productSize,
                                        })
                                    );

                                    return (
                                        <option
                                            key={productSize}
                                            value={productSize}
                                            className={`${
                                                !thisSizeCheck.success ? "text-component-color" : ""
                                            }`}
                                            disabled={!thisSizeCheck.success}
                                        >
                                            {productSize.toUpperCase()}
                                            {!thisSizeCheck.success &&
                                                thisSizeCheck.error === "nil" &&
                                                " - out of stock"}
                                        </option>
                                    );
                                }
                            )}
                        </select>
                        <GoButton
                            onClick={handleAdd}
                            predicate={addPermitted}
                            disabled={!addPermitted}
                        >
                            <span>Add to Bag</span>
                            <IoBag />
                        </GoButton>
                        <WishlistToggleButton product={productData} />
                    </div>
                </div>
            </div>
            {isModalOpen && (
                <AddSuccessModal
                    handleClose={() => setIsModalOpen(false)}
                    isOpenState={isModalOpen}
                    overrideClasses="bag-confirm-modal"
                />
            )}
        </>
    );
}
