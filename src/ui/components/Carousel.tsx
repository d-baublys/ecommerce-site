"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { debounce } from "@/lib/utils";
import ProductLink from "./ProductLink";
import { Product } from "@/lib/definitions";
import RoundedButton from "./RoundedButton";

export default function Carousel({ featuredList }: { featuredList: Product[] }) {
    const [activeFeatured, setActiveFeatured] = useState(0);
    const activeFeaturedRef = useRef(0);
    const [isScrolling, setIsScrolling] = useState(false);

    function navBack() {
        if (isScrolling) return;
        setIsScrolling(true);
        setActiveFeatured((prev) => {
            return prev !== 0 ? prev - 1 : featuredList.length - 1;
        });
    }

    function navForward() {
        if (isScrolling) return;
        setIsScrolling(true);
        setActiveFeatured((prev) => {
            return prev < featuredList.length - 1 ? prev + 1 : 0;
        });
    }

    function scrollActiveIntoView() {
        const lastScroll: ScrollToOptions = { top: window.scrollY, left: window.scrollX };

        const element = document.getElementById(`featured-${activeFeaturedRef.current + 1}`);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                inline: "center",
                block: "nearest",
            });
            setTimeout(() => {
                setIsScrolling(false);
            }, 200);
        }

        window.scrollTo(lastScroll);
    }
    const debouncedScrollIntoView = debounce(scrollActiveIntoView, 200);

    useEffect(() => {
        window.addEventListener("resize", debouncedScrollIntoView);

        return () => window.removeEventListener("resize", debouncedScrollIntoView);
    }, []);

    useEffect(() => {
        activeFeaturedRef.current = activeFeatured;
        scrollActiveIntoView();
    }, [activeFeatured]);

    return (
        <div
            id="carousel-master"
            className="flex flex-col justify-center items-center grow w-full h-[500px] min-h-[500px]"
        >
            <div
                id="slider-container"
                className="relative max-w-(--carousel-width) h-4/5 overflow-hidden"
            >
                <ul
                    id="carousel-slider"
                    className="flex overflow-x-hidden gap-(--carousel-img-gap) px-(--carousel-img-w) h-full z-30"
                >
                    {featuredList.map((featuredProd, idx) => (
                        <li
                            key={featuredProd.id}
                            id={`featured-${idx + 1}`}
                            className="relative py-2 min-w-[var(--carousel-img-w)]"
                        >
                            <div className="featured-wrapper relative h-full snap-center drop-shadow-(--tile-shadow) z-0">
                                <Image
                                    src={featuredProd.src}
                                    alt={featuredProd.alt}
                                    fill
                                    sizes="auto"
                                    className="object-cover rounded-2xl"
                                />
                            </div>
                            <ProductLink slug={featuredProd.slug}>
                                <RoundedButton overrideClasses="absolute left-[50%] bottom-1/6 translate-x-[-50%] z-50">
                                    View
                                </RoundedButton>
                            </ProductLink>
                        </li>
                    ))}
                </ul>
                <div
                    id="gradient-overlay-left"
                    className="carousel-gradient-overlay absolute top-0 left-0 w-[calc((100%-var(--carousel-img-w))/2))] h-full bg-[linear-gradient(to_right,_white_0%,_transparent_100%)] pointer-events-none z-40"
                ></div>
                <div
                    id="gradient-overlay-right"
                    className="carousel-gradient-overlay absolute top-0 right-0 w-[calc((100%-var(--carousel-img-w))/2))] h-full bg-[linear-gradient(to_left,_white_0%,_transparent_100%)] pointer-events-none z-40"
                ></div>
                <div
                    id="carousel-chevron-container"
                    className="flex absolute justify-center left-0 top-1/2 gap-(--carousel-img-w) translate-y-[-50%] w-full z-50"
                >
                    <button
                        id="carousel-nav-back"
                        className="cursor-pointer mr-[calc(var(--carousel-img-gap)/2)] translate-x-[50%]"
                        onClick={navBack}
                    >
                        <IoChevronBackSharp className="text-component-color" size={36} />
                    </button>
                    <button
                        id="carousel-nav-forward"
                        className="cursor-pointer ml-[calc(var(--carousel-img-gap)/2)] translate-x-[-50%]"
                        onClick={navForward}
                    >
                        <IoChevronForwardSharp className="text-component-color" size={36} />
                    </button>
                </div>
            </div>
            <div
                id="dot-container-spacer"
                className="flex justify-center items-center w-full h-1/5"
            >
                <ul
                    id="carousel-dot-container"
                    className="absolute flex items-center gap-[10px] bottom-[calc(50px)] left-[50%] translate-x-[-50%] translate-y-[50%]"
                >
                    {featuredList.map((_, idx) => (
                        <li key={idx} className="flex">
                            <button
                                onClick={() => {
                                    setActiveFeatured(idx);
                                }}
                                className={`carousel-dot w-auto h-3 aspect-square rounded-full ${
                                    activeFeatured === idx && "bg-component-color"
                                } border-2 border-component-color transition`}
                            ></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
