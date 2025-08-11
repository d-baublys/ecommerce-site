import { Order, OrderItem, Product } from "@prisma/client";
import ProductImage from "../ProductImage";
import { processDateForClientDate } from "@/lib/utils";

interface OrderTileProps {
    orderData: Order & { items: (OrderItem & { product: Product })[] };
}

export default function OrderTile({ orderData }: OrderTileProps) {
    return (
        <div className="flex flex-col w-full border-2 p-2 gap-2 bg-white">
            <p>Ordered {`${processDateForClientDate(orderData.createdAt)}`}</p>
            {orderData.items.map((orderItem) => (
                <div key={orderItem.id} className="flex h-28 w-full bg-white">
                    <div className="flex h-full grow gap-2 sm:gap-8">
                        <ProductImage product={orderItem.product} overrideClasses="aspect-square" />
                        <div className="flex flex-col justify-between">
                            <div className="font-semibold">
                                {orderItem.product.name.toUpperCase()}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col justify-between items-end h-full bg-amber-300">
                        <select></select>
                    </div>
                </div>
            ))}
        </div>
    );
}
