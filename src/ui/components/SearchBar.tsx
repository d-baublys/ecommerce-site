"use client";

import { getProductData } from "@/lib/actions";
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

interface SearchBarProps {
    handleResultClick: (product: Product) => void;
    handleSearchClose?: () => void;
    options: SearchBarConfig;
    inputRef?: React.RefObject<HTMLInputElement | null>;
    parentSetter?: React.Dispatch<SetStateAction<Product[]>>;
    parentQuerySetter?: React.Dispatch<SetStateAction<string | null>>;
}

export default function SearchBar(props: SearchBarProps) {
    const [productList, setProductList] = useState<Product[]>();
    const [query, setQuery] = useState<string>("");
    const [results, setResults] = useState<Product[]>([]);
    const [isResultLoading, setIsResultLoading] = useState<boolean>(false);
    const [activeIdx, setActiveIdx] = useState<number>(-1);
    const [showSuggestions, setShowSuggestions] = useState<boolean>(false);
    const {
        handleResultClick,
        handleSearchClose,
        options,
        inputRef,
        parentSetter,
        parentQuerySetter,
    } = props;

    const router = useRouter();

    useEffect(() => {
        const getData = async () => {
            const productFetch = options.isGlobalSearch
                ? await fetchFilteredProducts({ category: "all" })
                : (await getProductData())?.data;

            setProductList(productFetch);
            if (parentSetter) parentSetter(productFetch);
        };

        getData();
    }, []);

    const debouncedResults = debounce((currQuery) => {
        if (!productList) return;

        const results = productList.filter((product) =>
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

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!(results?.length && options.showSuggestions)) return;

        if (e.key === "ArrowDown") {
            const newIndex =
                activeIdx === results.length - 1 ? -1 : (activeIdx + 1) % results.length;
            newIndex >= 0 && setQuery(results[newIndex].name);
            setActiveIdx(newIndex);
        }

        if (e.key === "ArrowUp") {
            const newIndex =
                activeIdx === 0
                    ? -1
                    : (activeIdx - 1 + (results.length + 1)) % (results.length + 1);
            newIndex >= 0 && setQuery(results[newIndex].name);
            setActiveIdx(newIndex);
        }

        if (e.key === "Enter" && activeIdx >= 0) {
            handleClick(results[activeIdx]);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setShowSuggestions(false);
            setActiveIdx(-1);
        }, 200);
    };

    return (
        <form
            role="search"
            className="relative flex flex-col w-full max-w-[calc(100%-26px)]"
            onSubmit={(e) => handleSubmit(e)}
        >
            <div className="flex items-center w-full h-searchbar-height bg-background-lightest rounded-full">
                <div className="flex justify-center items-center w-12 h-full">
                    {options?.isGlobalSearch && (
                        <button
                            type="submit"
                            title="Submit search"
                            aria-label="Submit search"
                            className={`p-1 rounded-circle ${query ? "cursor-pointer" : ""}`}
                        >
                            <IoSearch size={20} />
                        </button>
                    )}
                </div>
                <input
                    ref={inputRef}
                    type="search"
                    aria-label="Search input"
                    autoComplete="off"
                    className="w-full h-full outline-none"
                    value={query}
                    disabled={productList === undefined}
                    onChange={(e) => handleSearch(e)}
                    placeholder={options?.placeholderText ?? "Search products..."}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setShowSuggestions(true)}
                    onBlur={handleInputBlur}
                ></input>
                <div className="flex justify-center items-center w-12 text-[1.75rem]">
                    <button
                        type="button"
                        title="Clear search"
                        aria-label="Clear search"
                        className="cursor-pointer rounded-circle"
                        onClick={() => clearAll()}
                    >
                        <IoCloseCircle />
                    </button>
                </div>
            </div>
            {query && options?.showSuggestions && showSuggestions && (
                <div className="mx-4 min-h-[100px] px-2 py-2 border-t border-background-lighter bg-background-lightest z-100">
                    <ul
                        className="suggestions-container suggestions-height-cap overflow-scroll no-scrollbar"
                        data-testid="suggestions-ul"
                    >
                        {results?.length > 0 &&
                            results.map((product, idx) => (
                                <li
                                    key={product.id}
                                    className={`flex items-center p-1 cursor-pointer bg-background-lightest hover:brightness-90 active:brightness-90 ${
                                        activeIdx === idx ? "brightness-90" : ""
                                    }`}
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
