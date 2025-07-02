"use client";

import { useBagStore } from "@/stores/bagStore";
import { useSearchStore } from "@/stores/searchStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
    IoBagOutline,
    IoCog,
    IoHeartOutline,
    IoMenu,
    IoPersonOutline,
    IoSearchOutline,
} from "react-icons/io5";
import { signOut, useSession } from "next-auth/react";
import SlideDownColumnsMenu from "./overlays/SlideDownColumnsMenu";

export default function NavBarClient() {
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const itemCount = useBagStore((state) => state.getTotalBagCount());
    const { isSearchOpen, setIsSearchOpen, setIsSearchLoaded } = useSearchStore((state) => state);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);

    const session = useSession();
    const isAdmin = !!session?.data?.user;

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
        <>
            <nav
                className={`sticky flex justify-center items-center w-full h-nav-height bg-white text-black drop-shadow-(--nav-shadow) z-[9999] ${
                    isScrollingUp ? "top-0" : "top-[calc(var(--nav-height)*-1)]"
                } [transition:top_0.5s_ease]`}
            >
                <div className="flex justify-evenly items-center w-full min-h-full">
                    <div className="flex justify-start sm:justify-center w-full sm:w-auto px-(--gutter) sm:px-0 order-1 sm:order-2">
                        <Link href={"/"} className="relative">
                            <Image
                                src="/dbwearopt.svg"
                                alt="DB-Wear logomark"
                                width={0}
                                height={0}
                                className="min-w-[120px] h-full"
                            />
                        </Link>
                    </div>
                    <div className="w-full justify-center order-2 sm:order-1 px-(--gutter) lg:px-(--gutter-md) hidden sm:flex">
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
                        <Link
                            href={"/wishlist"}
                            className="items-center p-2 [border-radius:50%] hidden sm:flex"
                        >
                            <IoHeartOutline
                                className="hover:scale-125 transition"
                                title="Wishlist"
                                aria-label="Wishlist"
                            />
                        </Link>
                        <Link
                            href={"/bag"}
                            className="relative items-center p-2 [border-radius:50%] hidden sm:flex"
                            title="Bag"
                            aria-label="Bag"
                        >
                            <div className="relative">
                                <IoBagOutline className="hover:scale-125 transition" />
                                {hasMounted && itemCount > 0 && (
                                    <div
                                        aria-label="Bag item count"
                                        className="bag-item-count absolute flex justify-center items-center top-[-13px] right-[-10px] w-4 aspect-square [border-radius:50%] bg-red-500 text-contrasted text-[0.67rem]"
                                    >
                                        <span>{Math.min(itemCount, 99)}</span>
                                    </div>
                                )}
                            </div>
                        </Link>
                        <button
                            className={`p-2 [border-radius:50%] hidden sm:block ${
                                isAdmin ? "cursor-pointer" : ""
                            }`}
                            onClick={() => {
                                isAdmin && setIsAccountOpen(true);
                            }}
                        >
                            <IoPersonOutline
                                className="hover:scale-125 transition"
                                title="Account"
                                aria-label="Account"
                            />
                        </button>
                        <button
                            className="p-2 [border-radius:50%] block sm:hidden cursor-pointer"
                            onClick={() => setIsMenuOpen(true)}
                        >
                            <IoMenu
                                className="hover:scale-125 transition"
                                title="Menu"
                                aria-label="Menu"
                            />
                        </button>
                        {isAdmin && (
                            <Link
                                href={"/admin"}
                                className="items-center p-2 [border-radius:50%] hidden sm:flex"
                            >
                                <IoCog
                                    className="hover:scale-125 transition"
                                    title="Admin"
                                    aria-label="Admin"
                                />
                            </Link>
                        )}
                    </div>
                </div>
            </nav>
            <SlideDownColumnsMenu
                predicate={isMenuOpen}
                predicateSetter={setIsMenuOpen}
                overrideClasses="sm:hidden"
                leftContent={
                    <Link
                        href={`/category/all`}
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1 rounded-full"
                    >
                        Shop
                    </Link>
                }
                rightContent={
                    <>
                        <Link
                            href={"/wishlist"}
                            className="flex items-center gap-4 p-1 rounded-full"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <IoHeartOutline
                                className="hover:scale-125 transition"
                                aria-label="Wishlist"
                            />
                            <span>Wishlist</span>
                        </Link>
                        <Link
                            href={"/bag"}
                            className="relative flex items-center gap-4 p-1 rounded-full"
                            aria-label="Bag"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <div className="relative">
                                <IoBagOutline className="hover:scale-125 transition" />
                                {hasMounted && itemCount > 0 && (
                                    <div className="bag-item-count absolute flex justify-center items-center top-[-13px] right-[-10px] w-4 aspect-square [border-radius:50%] bg-red-500 text-contrasted text-[0.67rem]">
                                        <span>{Math.min(itemCount, 99)}</span>
                                    </div>
                                )}
                            </div>
                            <span>Bag</span>
                        </Link>
                        <button
                            className={`flex items-center gap-4 p-1 rounded-full ${
                                isAdmin ? "cursor-pointer" : ""
                            }`}
                            onClick={() => {
                                isAdmin && setIsAccountOpen(true);
                                isAdmin && setIsMenuOpen(false);
                            }}
                        >
                            <IoPersonOutline
                                className="hover:scale-125 transition"
                                aria-label="Account"
                            />
                            <span>Account</span>
                        </button>
                        {isAdmin && (
                            <Link
                                href={"/admin"}
                                className="flex items-center gap-4 p-1 rounded-full"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                <IoCog
                                    className="hover:scale-125 transition"
                                    aria-label="Wishlist"
                                />
                                <span>Admin</span>
                            </Link>
                        )}
                    </>
                }
            />
            <SlideDownColumnsMenu
                predicate={isAccountOpen}
                predicateSetter={setIsAccountOpen}
                leftContent={
                    <button
                        onClick={async () => {
                            setIsAccountOpen(false);
                            await signOut();
                        }}
                        className="flex items-start p-1 rounded-full cursor-pointer"
                    >
                        Log Out
                    </button>
                }
            />
        </>
    );
}
