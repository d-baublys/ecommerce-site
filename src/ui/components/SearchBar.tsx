"use client";

import { getProductData } from "@/lib/actions";
import { Product } from "@/lib/definitions";
import { debounce } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoCloseCircle, IoSearch } from "react-icons/io5";

export default function SearchBar({
    handleResultClick,
    isGlobalSearch,
}: {
    handleResultClick: (product: Product) => void;
    isGlobalSearch?: boolean;
}) {
    const [productList, setProductList] = useState<Product[]>([]);
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Product[]>([]);
    const [isResultLoading, setIsResultLoading] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const getData = async () => {
            const productFetch = await getProductData();

            if (!productFetch.data) throw new Error("Error fetching data for results");

            setProductList(productFetch.data);
        };

        getData();
    }, []);

    const debouncedResults = debounce((currQuery) => {
        setResults(
            productList!.filter((product) =>
                product.name.toLowerCase().includes((currQuery as string).toLowerCase())
            )
        );
        setIsResultLoading(false);
    }, 100);

    const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setResults([]);
        const query = e.currentTarget.value;
        setQuery(query);

        if (!query.trim()) return;

        if (productList) {
            debouncedResults(query);
            setIsResultLoading(true);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<SVGElement>) => {
        e.preventDefault();
        if (!query.trim() || !isGlobalSearch) return;
        router.push(`/search?q=${encodeURIComponent(query)}`);
    };

    const clearAll = () => {
        setQuery("");
        setResults([]);
    };

    const handleClick = (product: Product) => {
        handleResultClick(product);
        clearAll();
    };

    return (
        <form
            role="search"
            className="relative flex flex-col w-full"
            onSubmit={(e) => handleSubmit(e)}
        >
            <div className="flex items-center w-full h-10 bg-background-lightest rounded-full">
                <div className="flex justify-center items-center w-12 h-full text-xl">
                    {isGlobalSearch && (
                        <IoSearch
                            className={query ? "cursor-pointer" : ""}
                            onClick={(e) => handleSubmit(e)}
                        />
                    )}
                </div>
                <input
                    className="w-[90%] h-full outline-none"
                    value={query}
                    onChange={(e) => handleSearch(e)}
                    placeholder="Search products..."
                ></input>
                <div className="flex justify-center items-center w-12 text-[1.75rem]">
                    <IoCloseCircle onClick={() => clearAll()} className="cursor-pointer" />
                </div>
            </div>
            {query && (
                <div className="mx-4 min-h-[100px] px-4 py-2 border-t-[1px] border-background-lighter bg-background-lightest z-100">
                    <ul>
                        {results?.length > 0 &&
                            results.map((product) => (
                                <li
                                    key={product.id}
                                    className="py-1 cursor-pointer bg-background-lightest hover:brightness-90 active:brightness-90"
                                    onClick={() => handleClick(product)}
                                >
                                    {product.name}
                                </li>
                            ))}
                        {!results?.length && !isResultLoading && (
                            <li className="py-1">No results found</li>
                        )}
                    </ul>
                </div>
            )}
        </form>
    );
}
