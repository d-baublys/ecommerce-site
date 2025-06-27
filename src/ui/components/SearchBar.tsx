"use client";

import { Product } from "@/lib/definitions";
import { fetchFilteredProducts } from "@/lib/fetching-utils";
import { debounce } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { SetStateAction, useEffect, useState } from "react";
import { IoCloseCircle, IoSearch } from "react-icons/io5";

type SearchBarConfig = {
    isGlobalSearch: boolean;
    showSuggestions: boolean;
    placeholderText?: string;
};

export default function SearchBar({
    handleResultClick,
    handleSearchClose,
    options,
    parentSetter,
    parentQuerySetter,
}: {
    handleResultClick: (product: Product) => void;
    handleSearchClose?: () => void;
    options: SearchBarConfig;
    parentSetter?: React.Dispatch<SetStateAction<Product[]>>;
    parentQuerySetter?: React.Dispatch<SetStateAction<string | null>>;
}) {
    const [productList, setProductList] = useState<Product[]>();
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Product[]>([]);
    const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
    const [hasMounted, setHasMounted] = useState<boolean>(false);

    const router = useRouter();

    useEffect(() => {
        const getData = async () => {
            const productFetch = await fetchFilteredProducts({ category: "all" });

            setProductList(productFetch);
            if (parentSetter) parentSetter(productFetch);
            setHasMounted(true);
        };

        getData();
    }, []);

    if (productList === undefined && hasMounted) {
        return (
            <p className="flex items-center h-full">
                Error fetching product data. Please try again later.
            </p>
        );
    }

    const debouncedResults = debounce((currQuery) => {
        const results = productList!.filter((product) =>
            product.name.toLowerCase().includes((currQuery as string).toLowerCase())
        );
        setResults(results);
        if (parentSetter) parentSetter(results);
        setIsResultLoading(false);
    }, 100);

    const handleSearch = (e: React.FormEvent<HTMLInputElement>) => {
        setResults([]);
        const query = e.currentTarget.value;
        setQuery(query);
        parentQuerySetter && parentQuerySetter(query);

        if (!query.trim()) return;

        if (productList) {
            debouncedResults(query);
            setIsResultLoading(true);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement> | React.MouseEvent<SVGElement>) => {
        e.preventDefault();
        if (!query.trim() || !options?.isGlobalSearch) return;
        handleSearchClose && handleSearchClose();
        router.push(`/results?q=${encodeURIComponent(query)}`);
    };

    const clearAll = () => {
        setQuery("");
        parentQuerySetter && parentQuerySetter(null);
        setResults([]);
    };

    const handleClick = (product: Product) => {
        handleResultClick(product);
        clearAll();
        handleSearchClose && handleSearchClose();
    };

    return (
        <form
            role="search"
            className="relative flex flex-col w-full"
            onSubmit={(e) => handleSubmit(e)}
        >
            <div className="flex items-center w-full h-searchbar-height bg-background-lightest rounded-full">
                <div className="flex justify-center items-center w-12 h-full">
                    {options?.isGlobalSearch && (
                        <IoSearch
                            className={query ? "cursor-pointer" : ""}
                            onClick={(e) => handleSubmit(e)}
                            size={20}
                        />
                    )}
                </div>
                <input
                    className="w-full h-full outline-none"
                    value={query}
                    disabled={productList === undefined}
                    onChange={(e) => handleSearch(e)}
                    placeholder={options?.placeholderText ?? "Search products..."}
                ></input>
                <div className="flex justify-center items-center w-12 text-[1.75rem]">
                    <IoCloseCircle onClick={() => clearAll()} className="cursor-pointer" />
                </div>
            </div>
            {query && options?.showSuggestions && (
                <div className="mx-4 min-h-[100px] px-2 py-2 border-t border-background-lighter bg-background-lightest z-100">
                    <ul>
                        {results?.length > 0 &&
                            results.map((product) => (
                                <li
                                    key={product.id}
                                    className="flex items-center p-1 cursor-pointer bg-background-lightest hover:brightness-90 active:brightness-90"
                                    onClick={() => handleClick(product)}
                                >
                                    <div className="flex shrink-0 mr-2">
                                        <IoSearch size={14} />
                                    </div>
                                    <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                                        {product.name}
                                    </span>
                                </li>
                            ))}
                        {!results?.length && !isResultLoading && (
                            <li className="p-1">
                                <span className="whitespace-nowrap overflow-ellipsis overflow-hidden">
                                    No results found
                                </span>
                            </li>
                        )}
                    </ul>
                </div>
            )}
        </form>
    );
}
