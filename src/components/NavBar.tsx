"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IoBagOutline, IoHeartOutline, IoPersonOutline, IoSearchOutline } from "react-icons/io5";

export default function NavBar() {
    const [isScrollingUp, setIsScrollingUp] = useState(false);

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

    return (
        <nav
            className={`sticky flex justify-center items-center w-full h-nav-height bg-white text-black drop-shadow-(--nav-shadow) z-10 ${
                isScrollingUp ? "top-0" : "top-[calc(var(--nav-height)*-1)]"
            } [transition:top_0.5s_ease]`}
        >
            <div className="flex lg:grid lg:grid-cols-3 justify-between items-center w-full mx-(--gutter) lg:mx-(--gutter-md)">
                <div className="flex shrink-0 lg:col-start-2 lg:justify-center mr-(--gutter)">
                    <Image src="/dbwearopt.svg" alt="DB-Wear logomark" width={120} height={120} />
                </div>
                <div className="flex gap-6 lg:col-start-3 lg:justify-end">
                    <div className="hover:scale-125 transition">
                        <IoSearchOutline />
                    </div>
                    <div className="hover:scale-125 transition">
                        <IoHeartOutline />
                    </div>
                    <div className="hover:scale-125 transition">
                        <IoBagOutline />
                    </div>
                    <div className="hover:scale-125 transition">
                        <IoPersonOutline />
                    </div>
                </div>
            </div>
        </nav>
    );
}
