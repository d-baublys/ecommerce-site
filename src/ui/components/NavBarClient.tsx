"use client";

import { useBagStore } from "@/stores/bagStore";
import { useSearchStore } from "@/stores/searchStore";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import SlideDownColumnsMenu from "@/ui/components/overlays/SlideDownColumnsMenu";
import { renderConditionalIcons, renderFixedIcons } from "@/lib/navIcons";
import { useRestoreFocus } from "@/hooks/useRestoreFocus";

export default function NavBarClient() {
    const [isScrollingUp, setIsScrollingUp] = useState(false);
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    const itemCount = useBagStore((state) => state.getTotalBagCount());
    const { isSearchOpen, isSearchLoaded, setIsSearchOpen, setIsSearchLoaded } = useSearchStore(
        (state) => state
    );
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isAccountOpen, setIsAccountOpen] = useState<boolean>(false);
    const elementRef = useRef<HTMLElement>(null);

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

    const closeSearchAll = () => {
        setIsSearchLoaded(false);
        setTimeout(() => setIsSearchOpen(false), 200);
    };

    const handleSearchClick = () => {
        setIsMenuOpen(false);
        if (!isSearchOpen) {
            setIsSearchOpen(true);
            setTimeout(() => setIsSearchLoaded(true), 0);
            elementRef.current = document.activeElement as HTMLElement;
        } else {
            closeSearchAll();
        }
    };

    const handleMenuClick = () => {
        setIsMenuOpen(true);
        closeSearchAll();
        if (!isMenuOpen) {
            elementRef.current = document.activeElement as HTMLElement;
        }
    };

    const handleMenuClose = () => {
        setIsMenuOpen(false);
    };

    const handleAccountClick = () => {
        if (!isAdmin) return;
        setIsAccountOpen(true);
        handleMenuClose();
        if (!isAccountOpen) {
            elementRef.current = document.activeElement as HTMLElement;
        }
    };

    useRestoreFocus(isSearchLoaded, elementRef);
    useRestoreFocus(isMenuOpen, elementRef);
    useRestoreFocus(isAccountOpen, elementRef);

    return (
        <>
            <nav
                id="navbar"
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
                    <div
                        id="main-entry"
                        className="w-full justify-center order-2 sm:order-1 px-(--gutter) lg:px-(--gutter-md) hidden sm:flex"
                    >
                        <Link href={`/category/all`}>Shop</Link>
                    </div>
                    <div className="flex w-full justify-end gap-2 md:gap-4 order-3 px-(--gutter) lg:px-(--gutter-md)">
                        {renderFixedIcons({
                            handleSearchClick,
                            handleMenuClick,
                        })}
                        {renderConditionalIcons({
                            isForMenu: false,
                            isAdmin,
                            hasMounted,
                            itemCount,
                            handleMenuClose,
                            handleAccountClick,
                        })}
                    </div>
                </div>
            </nav>
            <SlideDownColumnsMenu
                id="nav-mobile-menu"
                isOpenState={isMenuOpen}
                handleClose={() => setIsMenuOpen(false)}
                overrideClasses="sm:hidden"
                leftContent={
                    <Link
                        id="mobile-entry"
                        href={`/category/all`}
                        onClick={() => setIsMenuOpen(false)}
                        className="p-1 rounded-full"
                    >
                        Shop
                    </Link>
                }
                rightContent={
                    <>
                        {renderConditionalIcons({
                            isForMenu: true,
                            isAdmin,
                            hasMounted,
                            itemCount,
                            handleMenuClose,
                            handleAccountClick,
                        })}
                    </>
                }
            />
            <SlideDownColumnsMenu
                isOpenState={isAccountOpen}
                handleClose={() => setIsAccountOpen(false)}
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
