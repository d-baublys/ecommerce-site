"use client";

import { Categories, ClientProduct, StockTableMode } from "@/lib/types";
import FormInput from "@/ui/components/forms/FormInput";
import PlainRoundedButton from "@/ui/components/buttons/PlainRoundedButton";
import { useEffect, useRef, useState } from "react";
import {
    convertValidPrice,
    createEmptyProduct,
    formatImageName,
    areProductsEqual,
    isValidPrice,
    slugify,
    stringifyConvertPrice,
    buildProductUrl,
    processDateForClient,
    stripImagePath,
} from "@/lib/utils";
import { IoFolder } from "react-icons/io5";
import ProductStockTable from "./ProductStockTable";
import { useModalStore } from "@/stores/modalStore";
import { createProduct, deleteProduct, updateProduct } from "@/lib/actions";
import { useRouter } from "next/navigation";
import DeleteConfirmModal from "@/ui/components/overlays/DeleteConfirmModal";
import DisplayTile from "@/ui/components/cards/DisplayTile";
import Link from "next/link";
import { VALID_CATEGORIES } from "@/lib/constants";

export default function ProductAddEditForm({ productData }: { productData?: ClientProduct }) {
    const variant = productData ? "edit" : "add";
    const initialProductData: ClientProduct = productData ?? createEmptyProduct();

    const [formSavedProductData, setFormSavedProductData] =
        useState<ClientProduct>(initialProductData);
    const [formProvisionalProductData, setFormProvisionalProductData] =
        useState<ClientProduct>(initialProductData);

    const [tableMode, setTableMode] = useState<StockTableMode>("display");
    const [price, setPrice] = useState<string>(stringifyConvertPrice(initialProductData.price));
    const [fileName, setFileName] = useState<string>(stripImagePath(initialProductData.src));
    const [message, setMessage] = useState<string | null>();
    const { openModal } = useModalStore((state) => state);

    const fileBrowseRef = useRef<HTMLInputElement | null>(null);
    const handleBrowse = () => {
        fileBrowseRef.current?.click();
    };

    const router = useRouter();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFileName(file.name);
            const path = formatImageName(file.name);
            setFormProvisionalProductData((prev) => ({ ...prev, src: path }));
        }
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setPrice(input);

        if (isValidPrice(input)) {
            setFormProvisionalProductData((prev) => ({
                ...prev,
                price: convertValidPrice(input),
            }));
        }
    };

    const handleSubmit = async () => {
        setMessage("");

        if (tableMode !== "display") {
            setMessage("Please apply pending stock changes before saving");
        } else {
            const productData = {
                ...formProvisionalProductData,
                slug: slugify(formProvisionalProductData.name),
            };

            try {
                const dbAction =
                    variant === "add"
                        ? await createProduct(productData)
                        : await updateProduct(productData);

                if (dbAction.success) {
                    setFormSavedProductData(productData);
                    setMessage(
                        variant === "add"
                            ? "Product added successfully"
                            : "Changes saved succesfully"
                    );
                } else if (dbAction.error) {
                    setMessage(dbAction.error);
                } else {
                    setMessage("Something went wrong. Please try again later.");
                }
            } catch (error) {
                console.error(error);
                setMessage("Error updating database");
            }
        }
    };

    const handleCancel = () => {
        setPrice(stringifyConvertPrice(formSavedProductData.price));
        setFileName(stripImagePath(formSavedProductData.src));
        setMessage("");
        setFormProvisionalProductData(formSavedProductData);
    };

    const handleDelete = async (id: string) => {
        const deleteConfirm = await openModal();

        if (deleteConfirm) {
            try {
                await deleteProduct(id);
                router.push(`./`);
            } catch {
                setMessage("Error deleting product");
            }
        }
    };

    const productChanged = !areProductsEqual(formSavedProductData, formProvisionalProductData);

    useEffect(() => {
        setMessage("");
    }, [tableMode]);

    const handleUnload = (e: BeforeUnloadEvent) => {
        e.preventDefault();
        e.returnValue = "";
    };

    useEffect(() => {
        if (productChanged) {
            window.addEventListener("beforeunload", handleUnload);
        } else {
            window.removeEventListener("beforeunload", handleUnload);
        }

        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [productChanged]);

    return (
        <>
            {variant === "edit" && (
                <Link href={buildProductUrl(formSavedProductData.id, formSavedProductData.slug)}>
                    <DisplayTile productData={formSavedProductData} />
                </Link>
            )}
            <form className="flex flex-col w-full p-4 gap-8 bg-background-lightest rounded-lg">
                <FormInput
                    name="product-name"
                    onChange={(e) => {
                        setFormProvisionalProductData((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }));
                    }}
                    legend="Product Name"
                    value={formProvisionalProductData.name}
                />
                <fieldset>
                    <legend className="mb-2 text-sz-label-button lg:text-sz-label-button-lg">
                        Category
                    </legend>
                    <select
                        name="product-category"
                        onChange={(e) => {
                            setFormProvisionalProductData((prev) => ({
                                ...prev,
                                gender: e.target.value as Categories,
                            }));
                        }}
                        className="p-1.5 rounded-lg bg-white"
                        value={formProvisionalProductData.gender}
                    >
                        {VALID_CATEGORIES.map((c, idx) => (
                            <option key={idx} value={c.key}>
                                {c.label}
                            </option>
                        ))}
                    </select>
                </fieldset>
                <FormInput
                    name="product-price"
                    type="number"
                    onChange={(e) => handlePriceChange(e)}
                    legend="Unit Price"
                    value={price}
                />
                <div>
                    <FormInput
                        name="image-path"
                        ref={fileBrowseRef}
                        type="file"
                        onChange={(e) => handleFileSelect(e)}
                        legend="Image Path"
                        overrideClasses="hidden"
                    />
                    <div id="file-dialog-unit" className="flex items-center gap-4">
                        <div>
                            <PlainRoundedButton onClick={handleBrowse}>
                                <IoFolder />
                                <span>Browse</span>
                            </PlainRoundedButton>
                        </div>
                        <p>{fileName}</p>
                    </div>
                </div>
                <FormInput
                    name="image-description"
                    onChange={(e) =>
                        setFormProvisionalProductData((prev) => ({ ...prev, alt: e.target.value }))
                    }
                    legend="Image Description"
                    value={formProvisionalProductData.alt}
                />
                <FormInput
                    name="date-added"
                    type="date"
                    onChange={(e) =>
                        setFormProvisionalProductData((prev) => ({
                            ...prev,
                            dateAdded: new Date(e.target.value),
                        }))
                    }
                    legend="Date Added"
                    value={processDateForClient(formProvisionalProductData.dateAdded)}
                />
                <ProductStockTable
                    formSavedProductData={formSavedProductData}
                    formProvisionalProductData={formProvisionalProductData}
                    setFormProvisionalProductData={setFormProvisionalProductData}
                    tableMode={tableMode}
                    setTableMode={setTableMode}
                />
                <div id="overall-message-container" className="flex justify-center p-2 h-8">
                    <p className="text-center">{message}</p>
                </div>
                <div id="overall-action-container" className="flex justify-between gap-8">
                    {productChanged && (
                        <PlainRoundedButton onClick={handleSubmit}>
                            {variant === "add" ? "Add" : "Save"}
                        </PlainRoundedButton>
                    )}
                    {productChanged && (
                        <PlainRoundedButton onClick={handleCancel}>Cancel</PlainRoundedButton>
                    )}
                </div>
                {variant === "edit" && (
                    <div className="flex justify-center w-full pt-4 border-t">
                        <div>
                            <PlainRoundedButton
                                overrideClasses="!bg-danger-color !text-contrasted !border-danger-color"
                                onClick={() => handleDelete(formProvisionalProductData.id)}
                            >
                                Delete
                            </PlainRoundedButton>
                        </div>
                    </div>
                )}
            </form>
            <DeleteConfirmModal />
        </>
    );
}
