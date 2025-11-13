"use client";

import { usePathname, useRouter } from "next/navigation";
import SearchBar from "@/ui/components/SearchBar";
import { ClientProduct } from "@/lib/types";
import { useSearchStore } from "@/stores/searchStore";
import useBodyScrollLock from "@/hooks/useBodyScrollLock";
import DarkBackdrop from "@/ui/components/overlays/DarkBackdrop";
import CloseButton from "@/ui/components/buttons/CloseButton";
import { useEffect, useRef } from "react";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { buildProductUrl } from "@/lib/utils";

export default function SearchOverlay() {
    const { isSearchOpen, isSearchLoaded, closeSearchSmooth, closeSearchInstant } = useSearchStore(
        (state) => state
    );

    useBodyScrollLock(isSearchOpen);

    const router = useRouter();
    const pathname = usePathname();
    const inputRef = useRef<HTMLInputElement>(null);

    const handleResultClick = (product: ClientProduct) => {
        closeSearchSmooth();
        router.push(buildProductUrl(product.id, product.slug));
    };

    useEffect(() => {
        const focusTimeout = setTimeout(() => {
            inputRef.current?.focus();
        }, 500);

        return () => clearTimeout(focusTimeout);
    }, [isSearchLoaded]);

    useEffect(() => {
        closeSearchInstant();
    }, [pathname]);

    const trapRef = useFocusTrap(isSearchOpen, closeSearchSmooth);

    if (!isSearchOpen && !isSearchLoaded) return null;

    return (
        <>
            <DarkBackdrop
                onClick={closeSearchSmooth}
                overrideClasses={`[transition:all_0.1s_ease] ${
                    isSearchLoaded ? "!opacity-75" : "!opacity-0"
                }`}
            />

            <div
                id="search-overlay-container"
                data-testid="search-overlay-container"
                className={`absolute top-0 left-0 flex justify-center global-constraints overlay-constraints search-overlay-constraints bg-white drop-shadow-xl z-[8500] [transition:all_0.2s_ease-out] ${
                    isSearchLoaded ? "opacity-100" : "opacity-0"
                }`}
                ref={trapRef}
                aria-label="Search overlay"
                role="dialog"
                aria-modal="true"
            >
                <div
                    className={`flex flex-col items-center w-5/6 xs:w-3/4 md:w-1/2 pb-4 [transition:all_0.4s_ease-out] ${
                        isSearchLoaded ? "opacity-100 translate-0" : "opacity-0 translate-y-6"
                    }`}
                >
                    <div className="flex justify-center items-start w-full searchbar-positioning">
                        <SearchBar
                            inputRef={inputRef}
                            handleResultClick={handleResultClick}
                            handleSearchClose={closeSearchSmooth}
                            options={{ isGlobalSearch: true, showSuggestions: true }}
                        />
                        <div className="flex items-center h-searchbar-height pl-0.5">
                            <CloseButton
                                title="Close search"
                                aria-label="Close search"
                                onClick={closeSearchSmooth}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
