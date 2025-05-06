import { productList } from "@/lib/data";
import Image from "next/image";
import { notFound } from "next/navigation";
import { IoBag, IoHeartOutline } from "react-icons/io5";
import GoButton from "@/components/GoButton";
import GeneralButton from "@/components/GeneralButton";

export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = await params;
    const productData = productList.find((p) => p.slug === slug);

    if (!productData) {
        notFound();
    }

    function getLocalFormatting(price: number) {
        return Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(
            price / 100
        );
    }

    return (
        <section
            id="product-container"
            className="flex flex-col md:flex-row grow w-full max-w-[960px]"
        >
            <div className="flex justify-center w-full md:w-1/2 md:m-8">
                <div
                    id="product-img-wrapper"
                    className="aspect-[2/3] w-full md:w-auto md:h-[500px] snap-center drop-shadow-(--button-shadow) z-0"
                >
                    <Image
                        src={productData!.src}
                        alt={productData!.alt}
                        fill
                        sizes="auto"
                        className="object-cover rounded-md"
                    />
                </div>
            </div>
            <div id="product-aside" className="flex flex-col md:w-1/2 min-h-full m-8 gap-8 ">
                <div>{productData.name}</div>
                <div className="font-semibold">{getLocalFormatting(productData.price)}</div>
                <select className="p-2 bg-white border-2 rounded-md" defaultValue={"default"}>
                    <option value="default" hidden>
                        Please select a size
                    </option>
                    {Object.keys(productData.stock).map((size, idx) => {
                        const inStock =
                            productData.stock[size as keyof typeof productData.stock] > 0;
                        return (
                            <option
                                key={idx}
                                value={size}
                                className={`${!inStock && "text-component-color"}`}
                            >
                                {size.toUpperCase()} {!inStock && " - out of stock"}
                            </option>
                        );
                    })}
                </select>
                <GoButton>
                    Add to Bag <IoBag />
                </GoButton>
                <GeneralButton>
                    Add to Wishlist <IoHeartOutline className="stroked-path" />
                </GeneralButton>
            </div>
        </section>
    );
}
