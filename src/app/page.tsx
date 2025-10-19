import Carousel from "@/ui/components/Carousel";
import { getFeaturedProducts, getProductData } from "@/lib/actions";
import Link from "next/link";
import BareLayout from "@/ui/layouts/BareLayout";
import ProductImage from "@/ui/components/ProductImage";
import { Metadata } from "next";
import { FEATURED_COUNT } from "@/lib/constants";

export const metadata: Metadata = {
    title: "Home | DB-Wear",
};

export default async function HomePage() {
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
            <div className="hero-section relative grow w-full min-h-[400px]">
                <ProductImage
                    product={{ src: "/tshirts.jpg", alt: "Branded t-shirts" }}
                    overrideClasses="brightness-50"
                />
                <div className="flex flex-col main-tagline absolute w-full bottom-0 p-(--gutter) md:p-(--gutter-md) text-sz-heading lg:text-sz-heading-lg font-semibold text-contrasted">
                    <h1>Summer 2025 styles here and now.</h1>
                    <Link
                        href={"/category/all"}
                        className="styled-link w-fit mt-8 text-sz-subheading lg:text-sz-subheading-lg underline"
                    >
                        {"Shop >>>"}
                    </Link>
                </div>
            </div>
            {featuredList ? (
                <div
                    aria-label="Featured products"
                    className="featured-outer flex flex-col w-full min-h-[500px] bg-white"
                >
                    <div className="p-(--gutter) xl:p-(--gutter-md) font-semibold text-sz-subheading lg:text-sz-subheading-lg">
                        <h2>Featured</h2>
                    </div>
                    <Carousel featuredList={featuredList} />
                </div>
            ) : null}
        </div>
    );
}
