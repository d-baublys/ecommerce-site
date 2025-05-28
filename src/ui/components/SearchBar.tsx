"use client";

import { getProductData } from "@/lib/actions";
import { Product } from "@/lib/definitions";
import { debounce } from "@/lib/utils";
import { useEffect, useState } from "react";
import { IoCloseCircle, IoSearch } from "react-icons/io5";

export default function SearchBar({
    handleResultClick,
}: {
    handleResultClick: (product: Product) => void;
}) {
    const [productList, setProductList] = useState<Product[]>([]);
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Product[]>([]);
    const [isResultLoading, setIsResultLoading] = useState<boolean>(false);

    useEffect(() => {
        const getData = async () => {
            const data = await getProductData();
            setProductList(data);
        };

        getData();
    }, []);

    const debouncedResults = debounce((currQuery) => {
        setResults(
            productList!.filter((product) =>
                product.name.toLowerCase().includes(currQuery.toLowerCase())
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

    const clearAll = () => {
        setQuery("");
        setResults([]);
    };

    const handleClick = (product: Product) => {
        handleResultClick(product);
        clearAll();
    };

    return (
        <div className="relative flex flex-col w-full">
            <div className="flex items-center w-full h-10 bg-background-lightest rounded-full">
                <div className="px-3 text-xl">
                    <IoSearch />
                </div>
                <input
                    className="w-[90%] h-full outline-none"
                    value={query}
                    onChange={(e) => handleSearch(e)}
                    placeholder="Search products..."
                ></input>
                <div className="px-3 text-[1.75rem]">
                    <IoCloseCircle onClick={() => clearAll()} />
                </div>
            </div>
            {query && (
                <div className="absolute top-full left-[2%] w-[96%] min-h-[100px] px-4 py-2 border-t-[1px] border-background-lighter bg-background-lightest z-100">
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
        </div>
    );
}
