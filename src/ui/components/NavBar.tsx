"use client";

import { useBagStore } from "@/stores/bagStore";
import { useSearchStore } from "@/stores/searchStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoBagOutline, IoHeartOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";

export default function NavBar() {
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const itemCount = useBagStore((state) => state.getTotalBagCount());
    const { isSearchOpen, setIsSearchOpen, setIsSearchLoaded } = useSearchStore((state) => state);

    useEffect(() => {
        let lastScroll = window.scrollY;

        function scrollUpSticky() {
            const currentScroll = window.scrollY;
            setIsScrollingUp(currentScroll < lastScroll);
            lastScroll = currentScroll;
        }
        window.addEventListener("scroll", scrollUpSticky);

        setHasMounted(true);

        return () => window.removeEventListener("scroll", scrollUpSticky);
    }, []);

    const handleSearchClick = () => {
        if (!isSearchOpen) {
            setIsSearchOpen(true);
            setTimeout(() => setIsSearchLoaded(true), 0);
        } else {
            setIsSearchLoaded(false);
            setTimeout(() => setIsSearchOpen(false), 200);
        }
    };

    return (
        <nav
            className={`sticky flex justify-center items-center w-full h-nav-height bg-white text-black drop-shadow-(--nav-shadow) z-10 ${
                isScrollingUp ? "top-0" : "top-[calc(var(--nav-height)*-1)]"
            } [transition:top_0.5s_ease]`}
        >
            <div className="flex justify-evenly items-center w-full min-h-full">
                <div className="flex justify-start md:justify-center w-full md:w-auto px-(--gutter) md:px-0 order-1 md:order-2">
                    <Link href={"/"} className="relative">
                        <Image
                            src="/dbwearopt.svg"
                            alt="DB-Wear logomark"
                            width={0}
                            height={0}
                            className="min-w-[120px] h-full"
                            priority={true}
                        />
                    </Link>
                </div>
                <div className="flex w-full justify-center order-2 md:order-1 px-(--gutter) lg:px-(--gutter-md)">
                    <Link href={`/category/all`}>Shop</Link>
                </div>
                <div className="flex w-full justify-end gap-2 md:gap-4 order-3 px-(--gutter) lg:px-(--gutter-md)">
                    <button
                        className="cursor-pointer p-2 [border-radius:50%]"
                        title="Search"
                        aria-label="Search"
                    >
                        <IoSearchOutline
                            onClick={handleSearchClick}
                            className="hover:scale-125 transition"
                        />
                    </button>
                    <Link href={"/wishlist"} className="p-2 [border-radius:50%]">
                        <IoHeartOutline
                            className="hover:scale-125 transition"
                            title="Wishlist"
                            aria-label="Wishlist"
                        />
                    </Link>
                    <Link
                        href={"/bag"}
                        className="relative p-2 [border-radius:50%]"
                        title="Bag"
                        aria-label="Bag"
                    >
                        <IoBagOutline className="hover:scale-125 transition" />
                        {hasMounted && itemCount > 0 && (
                            <div className="bag-item-count flex justify-center items-center absolute top-[-10%] w-4 aspect-square right-[-10%] [border-radius:50%] bg-red-500 text-contrasted text-[0.67rem]">
                                {Math.min(itemCount, 99)}
                            </div>
                        )}
                    </Link>
                    <button className="p-2 [border-radius:50%]">
                        <IoPersonOutline
                            className="hover:scale-125 transition"
                            title="Account"
                            aria-label="Account"
                        />
                    </button>
                </div>
            </div>
        </nav>
    );
}
