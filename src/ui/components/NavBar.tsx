"use client";

import { useBagStore } from "@/stores/bagStore";
import { useSearchStore } from "@/stores/searchStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoBagOutline, IoHeartOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";

export default function NavBar() {
    const [isScrollingUp, setIsScrollingUp] = useState(false);
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
            <div className="flex lg:grid lg:grid-cols-3 justify-between items-center w-full mx-(--gutter) lg:mx-(--gutter-md)">
                <div className="flex shrink-0 lg:col-start-2 lg:justify-center mr-(--gutter)">
                    <Link href={"/"}>
                        <Image
                            src="/dbwearopt.svg"
                            alt="DB-Wear logomark"
                            width={120}
                            height={120}
                        />
                    </Link>
                </div>
                <div className="flex gap-6 lg:col-start-3 lg:justify-end">
                    <div className="cursor-pointer">
                        <IoSearchOutline
                            onClick={handleSearchClick}
                            className="hover:scale-125 transition"
                        />
                    </div>
                    <Link href={"/wishlist"}>
                        <div>
                            <IoHeartOutline className="hover:scale-125 transition" />
                        </div>
                    </Link>
                    <Link href={"/bag"}>
                        <div className="relative">
                            <IoBagOutline className="hover:scale-125 transition" />
                            {itemCount > 0 && (
                                <div className="bag-item-count flex justify-center items-center absolute top-[-67%] w-4 aspect-square right-[-67%] [border-radius:50%] bg-red-500 text-contrasted text-[0.67rem]">
                                    {Math.min(itemCount, 99)}
                                </div>
                            )}
                        </div>
                    </Link>
                    <div>
                        <IoPersonOutline className="hover:scale-125 transition" />
                    </div>
                </div>
            </div>
        </nav>
    );
}
