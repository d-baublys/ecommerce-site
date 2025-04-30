"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { IoChevronBackSharp, IoChevronForwardSharp } from "react-icons/io5";

export default function Carousel() {
    const [activeFeatured, setActiveFeatured] = useState(0);
    const [isScrolling, setIsScrolling] = useState(false);

    const featureList = [
        { src: "/featured1.jpg", alt: "Featured t-shirt 1" },
        { src: "/featured2.jpg", alt: "Featured t-shirt 2" },
        { src: "/featured3.jpg", alt: "Featured t-shirt 3" },
        { src: "/featured4.jpg", alt: "Featured t-shirt 4" },
        { src: "/featured5.jpg", alt: "Featured t-shirt 5" },
    ];

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
        const element = document.getElementById(`featured-${activeFeatured + 1}`);
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

    useEffect(() => scrollActiveIntoView(), [activeFeatured]);

    return (
        <div className="carousel-wrapper relative max-w-[calc(var(--carousel-img-w)*3)]">
            <div className="carousel-slider flex bg-white overflow-x-hidden gap-[calc(var(--carousel-img-w)/4)] px-[var(--carousel-img-w)]">
                {featureList.map((imageData, idx) => (
                    <div
                        key={idx}
                        id={`featured-${idx + 1}`}
                        className="relative snap-center min-w-(--carousel-img-w) h-[400px]"
                    >
                        <Image
                            src={imageData.src}
                            alt={imageData.alt}
                            fill
                            className="object-cover rounded-2xl"
                        />
                    </div>
                ))}
            </div>
            <div className="absolute flex items-center gap-[10px] bottom-4 left-[50%] translate-x-[-50%]">
                {featureList.map((_, idx) => (
                    <button
                        onClick={() => {
                            setActiveFeatured(idx);
                        }}
                        key={idx}
                        className={`w-auto h-3 aspect-square rounded-full ${
                            activeFeatured === idx ? "bg-white" : "bg-gray-300"
                        } hover:bg-white transition`}
                    ></button>
                ))}
            </div>
            <div className="pointer-events-none absolute top-0 left-0 w-1/3 h-full bg-[linear-gradient(to_right,_white_60%,_transparent_100%)]"></div>
            <div className="pointer-events-none absolute top-0 right-0 w-1/3 h-full bg-[linear-gradient(to_left,_white_60%,_transparent_100%)]"></div>
            <IoChevronBackSharp
                onClick={navBack}
                className="absolute top-1/2 left-1/4 text-4xl text-gray-500 cursor-pointer translate-y-[-50%]"
            />
            <IoChevronForwardSharp
                onClick={navForward}
                className="absolute top-1/2 left-3/4 text-4xl text-gray-500 cursor-pointer translate-x-[-100%] translate-y-[-50%]"
            />
        </div>
    );
}
