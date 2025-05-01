import Image from "next/image";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Carousel from "@/components/Carousel";

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-items-center min-h-screen text-foreground font-[family-name:var(--font-lexend-exa)]">
            <NavBar />
            <main className="relative flex flex-col grow w-full items-center bg-background overflow-hidden z-0">
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
                    <Carousel />
                </div>
            </main>
            <Footer />
        </div>
    );
}
