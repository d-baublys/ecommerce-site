import { Product } from "@/lib/types";
import Link from "next/link";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

export default function WishlistTile({
    product,
    handleDelete,
}: {
    product: Product;
    handleDelete: (deletedProduct: Product) => void;
}) {
    return (
        <div className="flex h-24 w-full sm:w-1/2 min-w-[300px] sm:min-w-[500px] border-2 p-2">
            <Link className="w-full" href={`products/${product.slug}`}>
                <div className="flex h-full gap-2 sm:gap-8">
                    <div className="wishlist-img-wrapper relative h-full aspect-square">
                        <Image
                            className="object-cover"
                            src={product.src}
                            alt={product.alt}
                            sizes="auto"
                            fill
                        ></Image>
                    </div>
                    <div className="font-semibold">{product.name.toUpperCase()}</div>
                </div>
            </Link>
            <div className="flex flex-col justify-between items-end h-full w-24 text-2xl">
                <IoClose
                    onClick={() => handleDelete(product)}
                    className="translate-x-1 cursor-pointer"
                />
            </div>
        </div>
    );
}
