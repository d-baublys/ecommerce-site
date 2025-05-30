import Image from "next/image";
import Carousel from "@/ui/components/Carousel";
import { getFeaturedProducts, getProductData } from "@/lib/actions";
import Link from "next/link";

export default async function Home() {
    const featuredFetch = await getFeaturedProducts();
    let featuredList = featuredFetch.data;

    if (!featuredFetch.success) {
        const fallbackFetch = await getProductData();

        if (fallbackFetch.success && fallbackFetch.data) {
            const fallbackData = fallbackFetch.data;

            featuredList = fallbackData.slice(0, 5);
        } else {
            throw new Error("No featured or fallback products to display");
        }
    }

    return (
        <>
            <div className="main-product relative grow w-full min-h-[400px]">
                <Image
                    className="object-cover brightness-50"
                    src="/tshirts.jpg"
                    alt="Branded t-shirts"
                    sizes="auto"
                    fill
                ></Image>
                <div className="flex flex-col main-tagline absolute w-full top-1/2 px-(--gutter) md:px-(--gutter-md) text-4xl font-semibold text-contrasted">
                    Summer 2025 styles here and now.
                    <Link href={"/"} className="mt-8 text-2xl underline">
                        {"Shop >>>"}
                    </Link>
                </div>
            </div>
            <div className="featured-outer flex flex-col w-full min-h-[500px] bg-white">
                <div className="p-(--gutter) xl:p-(--gutter-md) font-semibold md:text-xl">
                    Featured
                </div>
                {featuredList && <Carousel featuredList={featuredList} />}
            </div>
        </>
    );
}
