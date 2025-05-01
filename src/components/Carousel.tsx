"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";
import { debounce } from "@/lib/helpers";
import { featureList } from "@/data";

export default function Carousel() {
    const [activeFeatured, setActiveFeatured] = useState(0);
    const activeFeaturedRef = useRef(0);
    const [isScrolling, setIsScrolling] = useState(false);

    function navBack() {
        if (isScrolling) return;
        setIsScrolling(true);
        setActiveFeatured((prev) => {
            return prev !== 0 ? prev - 1 : featureList.length - 1;
        });
    }

    function navForward() {
        if (isScrolling) return;
        setIsScrolling(true);
        setActiveFeatured((prev) => {
            return prev < featureList.length - 1 ? prev + 1 : 0;
        });
    }

    function scrollActiveIntoView() {
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
        <div id="carousel-wrapper" className="relative max-w-(--carousel-width) overflow-hidden">
            <div
                id="carousel-slider"
                className="flex overflow-x-hidden gap-(--carousel-img-gap) px-(--carousel-img-w)"
            >
                {featureList.map((imageData, idx) => (
                    <div
                        key={idx}
                        id={`featured-${idx + 1}`}
                        className="featured-wrapper relative snap-center min-w-[var(--carousel-img-w)] h-[400px]"
                    >
                        <Image
                            src={imageData.src}
                            alt={imageData.alt}
                            fill
                            sizes="auto"
                            className="object-cover rounded-2xl"
                        />
                    </div>
                ))}
            </div>
            <div
                id="carousel-dot-container"
                className="absolute flex items-center gap-[10px] bottom-4 left-[50%] translate-x-[-50%]"
            >
                {featureList.map((_, idx) => (
                    <button
                        onClick={() => {
                            setActiveFeatured(idx);
                        }}
                        key={idx}
                        className={`carousel-dot w-auto h-3 aspect-square rounded-full ${
                            activeFeatured === idx ? "bg-white" : "bg-gray-300"
                        } hover:bg-white transition`}
                    ></button>
                ))}
            </div>
            <div
                id="gradient-overlay-left"
                className="carousel-gradient-overlay absolute top-0 left-0 w-1/3 h-full bg-[linear-gradient(to_right,_white_0%,_transparent_100%)] pointer-events-none"
            ></div>
            <div
                id="gradient-overlay-right"
                className="carousel-gradient-overlay absolute top-0 right-0 w-1/3 h-full bg-[linear-gradient(to_left,_white_0%,_transparent_100%)] pointer-events-none"
            ></div>
            <div
                id="carousel-chevron-container"
                className="flex absolute justify-center left-0 top-1/2 gap-(--carousel-img-w) translate-y-[-50%] w-full"
            >
                <IoChevronBackSharp
                    id="carousel-nav-back"
                    className="text-4xl text-gray-500 cursor-pointer mr-[calc(var(--carousel-img-gap)/2)] translate-x-[50%]"
                    onClick={navBack}
                />
                <IoChevronForwardSharp
                    id="carousel-nav-forward"
                    className="text-4xl text-gray-500 cursor-pointer ml-[calc(var(--carousel-img-gap)/2)] translate-x-[-50%]"
                    onClick={navForward}
                />
            </div>
        </div>
    );
}
