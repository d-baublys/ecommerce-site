"use client";

import { useEffect, useRef, useState } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { buildProductUrl, debounce } from "@/lib/utils";
import { Product } from "@/lib/types";
import ProductImage from "@/ui/components/ProductImage";
import PlainRoundedButtonLink from "@/ui/components/buttons/PlainRoundedButtonLink";

export default function Carousel({ featuredList }: { featuredList: Product[] }) {
    const [activeFeatured, setActiveFeatured] = useState(0);
    const activeFeaturedRef = useRef(0);
    const [isScrolling, setIsScrolling] = useState(false);

    function navBack() {
        if (isScrolling) return;
        setIsScrolling(true);
        setActiveFeatured((prev) => {
            return prev > 0 ? prev - 1 : featuredList.length - 1;
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
            className="flex flex-col items-center grow w-full h-[500px] min-h-[500px] sm:h-[700px] sm:min-h-[700px]"
        >
            <div id="slider-container" className="relative max-w-(--carousel-width) h-4/5">
                <ul
                    id="carousel-slider"
                    data-testid="carousel-slider"
                    className="flex overflow-hidden gap-(--carousel-img-gap) px-(--carousel-img-w) h-full z-30"
                >
                    {featuredList.map((featuredProd, idx) => (
                        <li
                            key={featuredProd.id}
                            id={`featured-${idx + 1}`}
                            className="relative py-2 min-w-[var(--carousel-img-w)]"
                        >
                            <ProductImage
                                product={featuredProd}
                                overrideClasses="snap-center rounded-2xl drop-shadow-(--tile-shadow) overflow-hidden"
                            />
                            <div className="absolute left-[50%] bottom-1/6 translate-x-[-50%] z-50">
                                <PlainRoundedButtonLink
                                    href={buildProductUrl(featuredProd.id, featuredProd.slug)}
                                    tabIndex={activeFeatured === idx ? 0 : -1}
                                >
                                    View
                                </PlainRoundedButtonLink>
                            </div>
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
                        title="Previous item"
                        aria-label="Previous item"
                        id="carousel-nav-back"
                        tabIndex={-1}
                        className="cursor-pointer mr-[calc(var(--carousel-img-gap)/2)] translate-x-[50%]"
                        onClick={navBack}
                    >
                        <IoChevronBackSharp className="text-component-color" size={36} />
                    </button>
                    <button
                        title="Next item"
                        aria-label="Next item"
                        id="carousel-nav-forward"
                        tabIndex={-1}
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
                <ul id="carousel-dot-container" className="flex items-center gap-3 -translate-y-1">
                    {featuredList.map((_, idx) => (
                        <li key={idx} className="flex">
                            <button
                                aria-label={`Scroll to product ${idx + 1}`}
                                onClick={() => {
                                    setActiveFeatured(idx);
                                }}
                                className={`carousel-dot w-auto h-3 aspect-square rounded-full ${
                                    activeFeatured === idx ? "bg-component-color" : ""
                                } border-2 border-component-color transition`}
                            ></button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
