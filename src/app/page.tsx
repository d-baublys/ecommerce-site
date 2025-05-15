import Image from "next/image";
import Carousel from "@/ui/components/Carousel";
import { fetchData } from "@/lib/utils";

export default async function Home() {
    const productList = await fetchData();

    const featuredList = [
        { product: productList[0], alt: "Featured t-shirt 1" },
        { product: productList[1], alt: "Featured t-shirt 2" },
        { product: productList[2], alt: "Featured t-shirt 3" },
        { product: productList[3], alt: "Featured t-shirt 4" },
        { product: productList[4], alt: "Featured t-shirt 5" },
    ];

    return (
        <>
            <div className="main-product relative grow w-full min-h-[400px]">
                <Image
                    className="object-cover brightness-50"
                    src="/tshirts.jpg"
                    alt="Branded t-shirts"
                    fill
                ></Image>
                <div className="flex flex-col main-tagline absolute w-full top-1/2 px-(--gutter) md:px-(--gutter-md) text-4xl font-semibold text-contrasted">
                    Summer 2025 styles here and now.
                    <a className="mt-8 text-2xl underline" href="">
                        {"Shop >>>"}
                    </a>
                </div>
            </div>
            <div className="featured-outer flex flex-col w-full min-h-[500px] bg-white">
                <div className="p-(--gutter) xl:p-(--gutter-md) font-semibold md:text-xl">
                    Featured
                </div>
                <Carousel featuredList={featuredList} />
            </div>
        </>
    );
}
