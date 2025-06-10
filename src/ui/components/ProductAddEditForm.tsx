"use client";

import { Categories, Product, StockTableMode, VALID_CATEGORIES } from "@/lib/definitions";
import FormInput from "./FormInput";
import RoundedButton from "./RoundedButton";
import { useEffect, useRef, useState } from "react";
import {
    convertValidPrice,
    createEmptyProduct,
    formatImagePath,
    areProductsEqual,
    isValidPrice,
    slugify,
    stringifyConvertPrice,
} from "@/lib/utils";
import { IoFolder } from "react-icons/io5";
import ProductStockTable from "./ProductStockTable";
import { useModalStore } from "@/stores/modalStore";
import { productAdd, productDelete, productUpdate } from "@/lib/actions";
import { useRouter } from "next/navigation";

export default function ProductAddEditForm({ productData }: { productData?: Product }) {
    const dataObj = productData ? productData : createEmptyProduct();
    const [savedDataObj, setSavedDataObj] = useState<Product>(dataObj);
    const [provisionalDataObj, setProvisionalDataObj] = useState<Product>(dataObj);

    const mode = productData ? "edit" : "add";
    const [tableMode, setTableMode] = useState<StockTableMode>("display");

    const [price, setPrice] = useState<string>(stringifyConvertPrice(dataObj.price));
    const [message, setMessage] = useState<string | null>();
    const openModal = useModalStore((state) => state.openModal);

    const fileBrowseRef = useRef<HTMLInputElement | null>(null);
    const handleBrowse = () => {
        fileBrowseRef.current?.click();
    };
    let fileName: string | null = provisionalDataObj.src.slice(1);

    const router = useRouter();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        fileName = null;
        let path = "";

        if (file) {
            fileName = file.name;
            path = formatImagePath(file.name);
        }
        setProvisionalDataObj((prev) => ({ ...prev, src: path }));
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value;
        setPrice(input);

        if (isValidPrice(input)) {
            setProvisionalDataObj((prev) => ({
                ...prev,
                price: convertValidPrice(input),
            }));
        }
    };

    const handleSubmit = async () => {
        setMessage("");

        if (
            provisionalDataObj.name &&
            provisionalDataObj.gender &&
            provisionalDataObj.price &&
            provisionalDataObj.src &&
            provisionalDataObj.alt &&
            provisionalDataObj.dateAdded &&
            Object.keys(provisionalDataObj.stock)?.length &&
            tableMode === "display"
        ) {
            const dbObj = {
                ...provisionalDataObj,
                slug: slugify(provisionalDataObj.name),
            };
            const dbAction = mode === "add" ? await productAdd(dbObj) : await productUpdate(dbObj);

            if (dbAction.success) {
                setSavedDataObj(provisionalDataObj);
                setMessage(
                    mode === "add" ? "Product added successfully" : "Changes saved succesfully"
                );
            } else {
                setMessage("Error updating database");
            }
        } else if (!(tableMode === "display")) {
            setMessage("Please apply pending stock changes before saving");
        } else {
            setMessage("Invalid data values. Please check and try again.");
        }
    };

    const handleCancel = () => {
        setPrice(stringifyConvertPrice(savedDataObj.price));
        setMessage("");
        setProvisionalDataObj(savedDataObj);
    };

    const handleDelete = async (id: string) => {
        const deleteConfirm = await openModal();

        if (deleteConfirm) {
            try {
                await productDelete(id);
                router.push(`./`);
            } catch {
                setMessage("Error deleting product");
            }
        }
    };

    const productChanged = !areProductsEqual(savedDataObj, provisionalDataObj);

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
        <form className="flex flex-col w-full p-4 gap-8 border-2 bg-background-lightest rounded-lg">
            <FormInput
                onChange={(e) => {
                    setProvisionalDataObj((prev) => ({ ...prev, name: e.target.value }));
                }}
                legend="Product Name"
                value={provisionalDataObj.name}
            />
            <fieldset>
                <legend className="mb-2">Category</legend>
                <select
                    onChange={(e) => {
                        setProvisionalDataObj((prev) => ({
                            ...prev,
                            gender: e.target.value as Categories,
                        }));
                    }}
                    className="p-1.5 border-2 rounded-lg bg-white"
                    value={provisionalDataObj.gender}
                >
                    {Object.keys(VALID_CATEGORIES).map((category, idx) => (
                        <option key={idx} value={category}>
                            {VALID_CATEGORIES[category as Categories]}
                        </option>
                    ))}
                </select>
            </fieldset>
            <FormInput
                type="number"
                onChange={(e) => handlePriceChange(e)}
                legend="Unit Price"
                value={price}
            />
            <div>
                <FormInput
                    ref={fileBrowseRef}
                    type="file"
                    onChange={(e) => handleFileSelect(e)}
                    legend="Image Path"
                    className="hidden"
                />
                <div className="flex items-center gap-4">
                    <RoundedButton onClick={handleBrowse}>
                        <IoFolder />
                        <span>Browse</span>
                    </RoundedButton>
                    <p>{fileName}</p>
                </div>
            </div>
            <FormInput
                onChange={(e) =>
                    setProvisionalDataObj((prev) => ({ ...prev, alt: e.target.value }))
                }
                legend="Image Description"
                value={provisionalDataObj.alt}
            />
            <FormInput
                type="date"
                onChange={(e) =>
                    setProvisionalDataObj((prev) => ({ ...prev, dateAdded: e.target.value }))
                }
                legend="Date Added"
                value={provisionalDataObj.dateAdded}
            />
            <ProductStockTable
                savedDataObj={savedDataObj}
                provisionalDataObj={provisionalDataObj}
                setProvisionalDataObj={setProvisionalDataObj}
                tableMode={tableMode}
                setTableMode={setTableMode}
            />
            <div className="flex justify-center p-2 h-8">
                <p className="text-center">{message}</p>
            </div>
            <div className="flex justify-between gap-8">
                {productChanged && (
                    <RoundedButton className="w-full" onClick={handleSubmit}>
                        {mode === "add" ? "Add" : "Save"}
                    </RoundedButton>
                )}
                {productChanged && (
                    <RoundedButton className="w-full" onClick={handleCancel}>
                        Cancel
                    </RoundedButton>
                )}
            </div>
            {mode === "edit" && (
                <div className="flex justify-center w-full pt-4 border-t-black border-t-2">
                    <RoundedButton
                        className="!bg-danger-color !text-contrasted !border-danger-color"
                        onClick={() => handleDelete(provisionalDataObj.id)}
                    >
                        Delete
                    </RoundedButton>
                </div>
            )}
        </form>
    );
}
