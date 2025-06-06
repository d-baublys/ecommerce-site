"use client";

import { useRouter } from "next/navigation";
import SearchBar from "./SearchBar";
import { Product } from "@/lib/definitions";
import { useSearchStore } from "@/stores/searchStore";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import DarkBackdrop from "./DarkBackdrop";
import CloseButton from "./CloseButton";

export default function SearchOverlay() {
    const { isSearchOpen, setIsSearchOpen, isSearchLoaded, setIsSearchLoaded } = useSearchStore(
        (state) => state
    );

    useBodyScrollLock(isSearchOpen);

    const router = useRouter();

    const closeOverlay = () => {
        setIsSearchLoaded(false);
        setTimeout(() => setIsSearchOpen(false), 200);
    };

    const handleResultClick = (product: Product) => {
        closeOverlay();
        router.push(`/products/${product.slug}`);
    };

    if (!isSearchOpen && !isSearchLoaded) return null;

    return (
        <>
            {
                <DarkBackdrop
                    zIndex={50}
                    onClick={() => closeOverlay()}
                    classes={`[transition:all_0.1s_ease] ${
                        isSearchLoaded ? "!opacity-75" : "!opacity-0"
                    }`}
                />
            }
            <div
                className={`absolute top-0 left-0 flex justify-center w-full min-h-screen md:min-h-[400px] bg-contrasted drop-shadow-xl [transition:all_0.2s_ease-out] ${
                    isSearchLoaded ? "opacity-100" : "opacity-0"
                }`}
            >
                <div
                    className={`flex flex-col items-center w-2/3 pb-4 [transition:all_0.4s_ease-out] ${
                        isSearchLoaded ? "opacity-100 translate-0" : "opacity-0 translate-y-6"
                    }`}
                >
                    <div className="flex justify-center items-start mt-[13rem]">
                        <SearchBar handleResultClick={handleResultClick} isGlobalSearch />
                        <CloseButton onClick={() => closeOverlay()} />
                    </div>
                </div>
            </div>
        </>
    );
}
