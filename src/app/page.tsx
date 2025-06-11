import Image from "next/image";
import Carousel from "@/ui/components/Carousel";
import { getFeaturedProducts, getProductData } from "@/lib/actions";
import Link from "next/link";
import { FEATURED_COUNT } from "@/lib/definitions";
import BareLayout from "@/ui/layouts/BareLayout";

export default async function Home() {
    const featuredFetch = await getFeaturedProducts();
    let featuredList = featuredFetch.data;

    if (!featuredList.length) {
        const fallbackFetch = await getProductData();

        const fallbackData = fallbackFetch.data;

        if (!fallbackData.length) {
            return (
                <BareLayout>
                    <p>No featured or fallback products to display</p>
                </BareLayout>
            );
        }

        featuredList = fallbackData.slice(0, FEATURED_COUNT);
    }

    return (
        <div className="flex flex-col w-full">
            <div className="main-product relative grow w-full min-h-[400px]">
                <Image
                    className="object-cover brightness-50"
                    src="/tshirts.jpg"
                    alt="Branded t-shirts"
                    sizes="auto"
                    fill
                ></Image>
                <div className="flex flex-col main-tagline absolute w-full top-1/2 px-(--gutter) md:px-(--gutter-md) text-sz-heading lg:text-sz-heading-lg font-semibold text-contrasted">
                    <h1>Summer 2025 styles here and now.</h1>
                    <Link
                        href={"/category/all"}
                        className="mt-8 text-sz-subheading lg:text-sz-subheading-lg underline"
                    >
                        {"Shop >>>"}
                    </Link>
                </div>
            </div>
            {featuredList ? (
                <div className="featured-outer flex flex-col w-full min-h-[500px] bg-white">
                    <div className="p-(--gutter) xl:p-(--gutter-md) font-semibold text-sz-subheading lg:text-sz-subheading-lg">
                        <h2>Featured</h2>
                    </div>
                    <Carousel featuredList={featuredList} />
                </div>
            ) : null}
        </div>
    );
}
