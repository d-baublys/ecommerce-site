"use client";

import { Categories, Product, StockTableMode, VALID_CATEGORIES } from "@/lib/definitions";
import FormInput from "./FormInput";
import GeneralButton from "./GeneralButton";
import { useRef, useState } from "react";
import {
    capitalize,
    convertValidPrice,
    createEmptyProduct,
    formatImagePath,
    isValidPrice,
    slugify,
    stringifyConvertPrice,
} from "@/lib/utils";
import { IoFolder } from "react-icons/io5";
import ProductStockTable from "./ProductStockTable";
import { useRouter } from "next/navigation";
import { useModalStore } from "@/stores/modalStore";
import { productAdd, productDelete, productUpdate } from "@/lib/actions";

export default function ProductAddEditForm({ productData }: { productData?: Product }) {
    let dataObj = productData ? productData : createEmptyProduct();
    const mode = productData ? "edit" : "add";

    const [name, setName] = useState<string>(dataObj.name || "");
    const [category, setCategory] = useState<Categories>(dataObj.gender || VALID_CATEGORIES[0]);
    const [price, setPrice] = useState<string>(stringifyConvertPrice(dataObj.price) || "0");
    const [imagePath, setImagePath] = useState<string>(dataObj.src || "");
    const [altText, setAltText] = useState<string>(dataObj.alt || "");
    const [stock, setStock] = useState<Product["stock"]>(dataObj.stock || {});

    const [tableMode, setTableMode] = useState<StockTableMode>("display");
    const [fileName, setFileName] = useState<string | null>(dataObj.src.slice(1));
    const [message, setMessage] = useState<string | null>();
    const openModal = useModalStore((state) => state.openModal);

    const fileBrowseRef = useRef<HTMLInputElement | null>(null);
    const handleBrowse = () => {
        fileBrowseRef.current?.click();
    };

    const router = useRouter();

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (file) {
            setFileName(file.name);
            setImagePath(formatImagePath(file.name));
        } else {
            setFileName(null);
            setImagePath("");
        }
    };

    const handleSubmit = async () => {
        if (
            name &&
            category &&
            isValidPrice(price) &&
            imagePath &&
            altText &&
            stock &&
            Object.keys(stock)?.length &&
            tableMode === "display"
        ) {
            dataObj = {
                ...dataObj,
                name,
                gender: category,
                price: convertValidPrice(price),
                slug: slugify(name),
                src: imagePath,
                alt: altText,
                stock,
            };
            const dbAction =
                mode === "add" ? await productAdd(dataObj) : await productUpdate(dataObj);

            if (dbAction.success) {
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
        router.back();
    };

    const handleDelete = async (id: string) => {
        const deleteConfirm = await openModal();

        if (deleteConfirm) {
            productDelete(id);
        }
    };

    return (
        <form className="flex flex-col w-full p-4 gap-8 border-2 rounded-lg">
            <FormInput
                onChange={(e) => setName(e.target.value)}
                legend="Product Name"
                value={name}
            />
            <fieldset>
                <legend className="mb-2">Category</legend>
                <select
                    onChange={(e) => setCategory(e.target.value as Categories)}
                    className="p-1.5 border-2 rounded-lg"
                >
                    {VALID_CATEGORIES.map((category, idx) => (
                        <option key={idx} value={category}>
                            {capitalize(category)}
                        </option>
                    ))}
                </select>
            </fieldset>
            <FormInput
                type="number"
                onChange={(e) => setPrice(e.target.value)}
                legend="Unit Price"
                value={price}
            />
            <fieldset>
                <legend className="mb-2">Image Path</legend>
                <input
                    ref={fileBrowseRef}
                    type="file"
                    className="hidden"
                    onChange={(e) => handleFileSelect(e)}
                ></input>
                <div className="flex items-center gap-4">
                    <GeneralButton onClick={handleBrowse}>
                        <IoFolder />
                        <span>Browse</span>
                    </GeneralButton>
                    <span>{fileName}</span>
                </div>
            </fieldset>
            <FormInput
                onChange={(e) => setAltText(e.target.value)}
                legend="Image Description"
                value={altText}
            />
            <ProductStockTable
                productData={dataObj}
                setStock={setStock}
                tableMode={tableMode}
                setTableMode={setTableMode}
            />
            <div className="h-8">{message}</div>
            <div className="flex justify-between gap-8">
                <GeneralButton className="w-full" onClick={handleSubmit}>
                    {mode === "add" ? "Add" : "Save"}
                </GeneralButton>
                <GeneralButton className="w-full" onClick={handleCancel}>
                    Cancel
                </GeneralButton>
            </div>
            {mode === "edit" && (
                <div className="flex justify-center w-full pt-4 border-t-black border-t-2">
                    <GeneralButton
                        className="bg-danger-color text-contrasted border-danger-color"
                        onClick={() => handleDelete(dataObj.id)}
                    >
                        Delete
                    </GeneralButton>
                </div>
            )}
        </form>
    );
}
