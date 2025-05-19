import { BagItem, Product } from "@/lib/definitions";
import Link from "next/link";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import { useBagStore } from "@/stores/bagStore";

export default function ProductTile({
    dataObj,
    handleDelete,
}: {
    dataObj: Product | (BagItem & { latestSizeStock: number });
    handleDelete: () => void;
}) {
    const isBagItem = "quantity" in dataObj;
    const productData = isBagItem ? dataObj.product : dataObj;

    const stock = isBagItem ? dataObj.latestSizeStock : null;
    const maxQty = Math.min(stock ?? 0, Number(process.env.NEXT_PUBLIC_SINGLE_ITEM_MAX_QUANTITY));

    const latestQuantity = isBagItem ? Math.min(dataObj.quantity, stock!) : null;

    const updateQuantity = useBagStore((state) => state.updateQuantity);

    if (isBagItem && latestQuantity !== dataObj.quantity) {
        updateQuantity(dataObj.product.id, dataObj.size, latestQuantity!);
    }

    return (
        <div className="flex h-24 w-full sm:w-1/2 min-w-[300px] sm:min-w-[500px] border-2 p-2">
            <Link className="w-full" href={`products/${productData.slug}`}>
                <div className="flex h-full gap-2 sm:gap-8">
                    <div className="wishlist-img-wrapper relative h-full aspect-square">
                        <Image
                            className="object-cover"
                            src={productData.src}
                            alt={productData.alt}
                            sizes="auto"
                            fill
                        ></Image>
                    </div>
                    <div className="flex flex-col justify-between">
                        <div className="font-semibold">{productData.name.toUpperCase()}</div>
                        {isBagItem && (
                            <div className="text-component-color">
                                Size - {(dataObj as BagItem).size.toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>
            </Link>
            <div className="flex flex-col justify-between items-end h-full w-24 text-2xl">
                <IoClose onClick={handleDelete} className="translate-x-1 cursor-pointer" />
                {isBagItem &&
                    (stock ? (
                        <select
                            value={dataObj.quantity}
                            className="h-10 w-10 pl-1 text-xl border-2 rounded-md"
                            onChange={(e) =>
                                updateQuantity(productData.id, dataObj.size, Number(e.target.value))
                            }
                        >
                            {Array.from({ length: maxQty }, (_, idx) => (
                                <option value={idx + 1} key={idx}>
                                    {idx + 1}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <div className="flex justify-center w-full text-base text-end text-component-color">
                            Out of stock
                        </div>
                    ))}
            </div>
        </div>
    );
}
